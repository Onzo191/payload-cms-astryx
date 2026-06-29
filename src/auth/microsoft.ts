import { createHash, randomBytes, webcrypto } from 'node:crypto'

import {
  generatePayloadCookie,
  getFieldsToSign,
  jwtSign,
  type Payload,
  type PayloadRequest,
} from 'payload'

import type { User } from '@/payload-types'

import { ACTIVE_ACCOUNT_STATUSES, DEFAULT_MEMBER_ROLE_KEY } from './constants'
import { ensureAuthDefaults } from './defaults'
import { createUUIDv7 } from './uuid'
export { softOffboardAccount as softOffboardMicrosoftAccount } from './accountLifecycle'

const MICROSOFT_AUTH_COOKIE_PREFIX = 'astryx-ms-oauth'
const OAUTH_COOKIE_MAX_AGE_SECONDS = 10 * 60
const MICROSOFT_SCOPE = 'openid profile email'
const GENERIC_MICROSOFT_TENANTS = new Set(['common', 'consumers', 'organizations'])

type MicrosoftOpenIDConfiguration = {
  issuer: string
  jwks_uri: string
}

type MicrosoftJWK = JsonWebKey & {
  kid?: string
  use?: string
}

type MicrosoftJWKS = {
  keys: MicrosoftJWK[]
}

type JWKSCacheEntry = {
  expiresAt: number
  jwks: MicrosoftJWKS
}

export type MicrosoftIDTokenClaims = {
  aud?: string | string[]
  email?: string
  exp?: number
  family_name?: string
  given_name?: string
  iss?: string
  name?: string
  nbf?: number
  nonce?: string
  oid?: string
  preferred_username?: string
  tid?: string
  upn?: string
}

export type MicrosoftOAuthConfig = {
  allowedDomain: string
  autoCreateUsers: boolean
  clientID: string
  clientSecret?: string
  failureRedirect: string
  redirectURI: string
  successRedirect: string
  tenantID: string
}

export type MicrosoftOAuthCookies = {
  nonce: string
  returnTo: string
  state: string
  verifier: string
}

export type VerifiedMicrosoftAccount = {
  email: string
  familyName?: string
  givenName?: string
  name?: string
  objectID: string
  tenantID: string
}

const jwksCache = new Map<string, JWKSCacheEntry>()

const randomURLToken = (byteLength = 32) => randomBytes(byteLength).toString('base64url')

const normalizeDomain = (domain: string) => domain.trim().toLowerCase().replace(/^@/, '')

const safeRelativePath = (value: null | string, fallback: string) => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback
  }

  return value
}

export const safeMicrosoftReturnPath = (value: null | string, fallback: string) =>
  safeRelativePath(value, fallback)

export const getMicrosoftOAuthCookieNames = () => ({
  nonce: `${MICROSOFT_AUTH_COOKIE_PREFIX}-nonce`,
  returnTo: `${MICROSOFT_AUTH_COOKIE_PREFIX}-return-to`,
  state: `${MICROSOFT_AUTH_COOKIE_PREFIX}-state`,
  verifier: `${MICROSOFT_AUTH_COOKIE_PREFIX}-verifier`,
})

export const getMicrosoftOAuthCookieOptions = (secure: boolean) => ({
  httpOnly: true,
  maxAge: OAUTH_COOKIE_MAX_AGE_SECONDS,
  path: '/',
  sameSite: 'lax' as const,
  secure,
})

export const createMicrosoftOAuthCookies = (returnTo: null | string): MicrosoftOAuthCookies => ({
  nonce: randomURLToken(),
  returnTo: safeMicrosoftReturnPath(returnTo, process.env.MICROSOFT_SUCCESS_REDIRECT || '/admin'),
  state: randomURLToken(),
  verifier: randomURLToken(64),
})

export const createPKCEChallenge = (verifier: string) =>
  createHash('sha256').update(verifier).digest('base64url')

const getOrigin = (request: Request) => {
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const forwardedHost = request.headers.get('x-forwarded-host')

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }

  return new URL(request.url).origin
}

export const getMicrosoftOAuthConfig = (request: Request): MicrosoftOAuthConfig => {
  const origin = process.env.NEXT_PUBLIC_SERVER_URL || getOrigin(request)

  return {
    allowedDomain: normalizeDomain(process.env.MICROSOFT_ALLOWED_DOMAIN || 'vng.com.vn'),
    autoCreateUsers: process.env.MICROSOFT_AUTO_CREATE_USERS !== 'false',
    clientID: process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || undefined,
    failureRedirect: safeRelativePath(
      process.env.MICROSOFT_FAILURE_REDIRECT || '/admin/login?error=microsoft_oauth',
      '/admin/login?error=microsoft_oauth',
    ),
    redirectURI:
      process.env.MICROSOFT_REDIRECT_URI || `${origin}/api/auth/microsoft/callback`,
    successRedirect: safeRelativePath(process.env.MICROSOFT_SUCCESS_REDIRECT || '/admin', '/admin'),
    tenantID: process.env.MICROSOFT_TENANT_ID || 'organizations',
  }
}

export const createMicrosoftAuthorizationURL = ({
  config,
  cookies,
}: {
  config: MicrosoftOAuthConfig
  cookies: MicrosoftOAuthCookies
}) => {
  const url = new URL(
    `https://login.microsoftonline.com/${config.tenantID}/oauth2/v2.0/authorize`,
  )

  url.searchParams.set('client_id', config.clientID)
  url.searchParams.set('code_challenge', createPKCEChallenge(cookies.verifier))
  url.searchParams.set('code_challenge_method', 'S256')
  url.searchParams.set('nonce', cookies.nonce)
  url.searchParams.set('prompt', 'select_account')
  url.searchParams.set('redirect_uri', config.redirectURI)
  url.searchParams.set('response_mode', 'query')
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', MICROSOFT_SCOPE)
  url.searchParams.set('state', cookies.state)

  return url
}

const getOpenIDConfiguration = async (tenantID: string): Promise<MicrosoftOpenIDConfiguration> => {
  const response = await fetch(
    `https://login.microsoftonline.com/${tenantID}/v2.0/.well-known/openid-configuration`,
    {
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    throw new Error('Unable to load Microsoft OpenID configuration')
  }

  return (await response.json()) as MicrosoftOpenIDConfiguration
}

const getJWKS = async (jwksURI: string): Promise<MicrosoftJWKS> => {
  const cached = jwksCache.get(jwksURI)

  if (cached && cached.expiresAt > Date.now()) {
    return cached.jwks
  }

  const response = await fetch(jwksURI, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Unable to load Microsoft JWKS')
  }

  const jwks = (await response.json()) as MicrosoftJWKS

  jwksCache.set(jwksURI, {
    expiresAt: Date.now() + 60 * 60 * 1000,
    jwks,
  })

  return jwks
}

const decodeTokenPart = <T>(part: string): T => JSON.parse(Buffer.from(part, 'base64url').toString())

const verifyMicrosoftTokenSignature = async ({
  idToken,
  jwksURI,
}: {
  idToken: string
  jwksURI: string
}) => {
  const [encodedHeader, encodedPayload, encodedSignature] = idToken.split('.')

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    throw new Error('Invalid Microsoft ID token format')
  }

  const header = decodeTokenPart<{ alg?: string; kid?: string }>(encodedHeader)

  if (header.alg !== 'RS256' || !header.kid) {
    throw new Error('Unsupported Microsoft ID token signature')
  }

  const jwks = await getJWKS(jwksURI)
  const jwk = jwks.keys.find((key) => key.kid === header.kid)

  if (!jwk) {
    throw new Error('Unable to find Microsoft signing key')
  }

  const publicKey = await webcrypto.subtle.importKey(
    'jwk',
    jwk,
    {
      hash: 'SHA-256',
      name: 'RSASSA-PKCS1-v1_5',
    },
    false,
    ['verify'],
  )

  const isValid = await webcrypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    Buffer.from(encodedSignature, 'base64url'),
    Buffer.from(`${encodedHeader}.${encodedPayload}`),
  )

  if (!isValid) {
    throw new Error('Invalid Microsoft ID token signature')
  }
}

const getMicrosoftEmail = (claims: MicrosoftIDTokenClaims) =>
  (claims.preferred_username || claims.email || claims.upn || '').trim().toLowerCase()

export const isAllowedMicrosoftEmail = (email: string, allowedDomain = 'vng.com.vn') => {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedDomain = normalizeDomain(allowedDomain)

  return normalizedEmail.endsWith(`@${normalizedDomain}`)
}

export const validateMicrosoftClaims = ({
  allowedDomain,
  claims,
  clientID,
  nonce,
  now = new Date(),
  tenantID,
}: {
  allowedDomain: string
  claims: MicrosoftIDTokenClaims
  clientID: string
  nonce: string
  now?: Date
  tenantID: string
}): VerifiedMicrosoftAccount => {
  const nowSeconds = Math.floor(now.getTime() / 1000)
  const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud]
  const email = getMicrosoftEmail(claims)

  if (!audience.includes(clientID)) {
    throw new Error('Invalid Microsoft token audience')
  }

  if (!claims.exp || claims.exp <= nowSeconds - 60) {
    throw new Error('Microsoft token is expired')
  }

  if (claims.nbf && claims.nbf > nowSeconds + 60) {
    throw new Error('Microsoft token is not active yet')
  }

  if (!claims.nonce || claims.nonce !== nonce) {
    throw new Error('Invalid Microsoft token nonce')
  }

  if (!claims.tid || !claims.oid || !claims.iss) {
    throw new Error('Missing Microsoft tenant or subject claims')
  }

  if (!GENERIC_MICROSOFT_TENANTS.has(tenantID) && claims.tid !== tenantID) {
    throw new Error('Microsoft token tenant is not allowed')
  }

  if (claims.iss !== `https://login.microsoftonline.com/${claims.tid}/v2.0`) {
    throw new Error('Invalid Microsoft token issuer')
  }

  if (!email || !isAllowedMicrosoftEmail(email, allowedDomain)) {
    throw new Error(`Only @${normalizeDomain(allowedDomain)} Microsoft accounts are allowed`)
  }

  return {
    email,
    familyName: claims.family_name,
    givenName: claims.given_name,
    name: claims.name,
    objectID: claims.oid,
    tenantID: claims.tid,
  }
}

export const verifyMicrosoftIDToken = async ({
  allowedDomain,
  clientID,
  idToken,
  nonce,
  tenantID,
}: {
  allowedDomain: string
  clientID: string
  idToken: string
  nonce: string
  tenantID: string
}) => {
  const openIDConfiguration = await getOpenIDConfiguration(tenantID)

  await verifyMicrosoftTokenSignature({
    idToken,
    jwksURI: openIDConfiguration.jwks_uri,
  })

  const [, encodedPayload] = idToken.split('.')
  const claims = decodeTokenPart<MicrosoftIDTokenClaims>(encodedPayload)

  return validateMicrosoftClaims({
    allowedDomain,
    claims,
    clientID,
    nonce,
    tenantID,
  })
}

export const exchangeMicrosoftAuthorizationCode = async ({
  code,
  config,
  verifier,
}: {
  code: string
  config: MicrosoftOAuthConfig
  verifier: string
}) => {
  const body = new URLSearchParams({
    client_id: config.clientID,
    code,
    code_verifier: verifier,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectURI,
    scope: MICROSOFT_SCOPE,
  })

  if (config.clientSecret) {
    body.set('client_secret', config.clientSecret)
  }

  const response = await fetch(
    `https://login.microsoftonline.com/${config.tenantID}/oauth2/v2.0/token`,
    {
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    },
  )

  if (!response.ok) {
    throw new Error('Unable to exchange Microsoft authorization code')
  }

  const tokenSet = (await response.json()) as {
    id_token?: string
  }

  if (!tokenSet.id_token) {
    throw new Error('Microsoft token response did not include an ID token')
  }

  return tokenSet.id_token
}

const getRoleIDByKey = async (payload: Payload, key: string) => {
  const result = await payload.find({
    collection: 'roles',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      key: {
        equals: key,
      },
    },
  })

  return result.docs[0]?.id
}

const createRandomPassword = () => randomBytes(48).toString('base64url')

export const findOrCreateMicrosoftUser = async ({
  account,
  autoCreateUsers,
  payload,
}: {
  account: VerifiedMicrosoftAccount
  autoCreateUsers: boolean
  payload: Payload
}) => {
  await ensureAuthDefaults(payload)

  const byObjectID = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      microsoftObjectID: {
        equals: account.objectID,
      },
    },
  })

  const byEmail = byObjectID.docs[0]
    ? byObjectID
    : await payload.find({
        collection: 'users',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: {
          email: {
            equals: account.email,
          },
        },
      })

  const existingUser = byObjectID.docs[0] || byEmail.docs[0]
  const displayName = account.name || [account.givenName, account.familyName].filter(Boolean).join(' ')
  const now = new Date().toISOString()

  if (existingUser) {
    if (existingUser.microsoftObjectID && existingUser.microsoftObjectID !== account.objectID) {
      throw new Error('This email is already linked to another Microsoft account')
    }

    if (!(ACTIVE_ACCOUNT_STATUSES as readonly string[]).includes(existingUser.accountStatus)) {
      await payload.update({
        collection: 'users',
        data: {
          sessions: [],
        },
        id: existingUser.id,
        overrideAccess: true,
        showHiddenFields: true,
      })

      throw new Error('This account is not active')
    }

    return payload.update({
      collection: 'users',
      data: {
        authProvider: 'microsoft',
        deactivationReason: null,
        displayName: displayName || existingUser.displayName,
        firstName: account.givenName || existingUser.firstName,
        lastMicrosoftLoginAt: now,
        lastName: account.familyName || existingUser.lastName,
        microsoftLinkedAt: existingUser.microsoftLinkedAt || now,
        microsoftObjectID: account.objectID,
        microsoftTenantID: account.tenantID,
        offboardedAt: null,
      },
      depth: 2,
      id: existingUser.id,
      overrideAccess: true,
      showHiddenFields: true,
    })
  }

  if (!autoCreateUsers) {
    throw new Error('Microsoft account auto-provisioning is disabled')
  }

  const defaultRoleID = await getRoleIDByKey(payload, DEFAULT_MEMBER_ROLE_KEY)

  if (!defaultRoleID) {
    throw new Error(`Missing required role: ${DEFAULT_MEMBER_ROLE_KEY}`)
  }

  return payload.create({
    collection: 'users',
    data: {
      accountStatus: 'active',
      authProvider: 'microsoft',
      displayName: displayName || account.email,
      email: account.email,
      firstName: account.givenName,
      lastMicrosoftLoginAt: now,
      lastName: account.familyName,
      microsoftLinkedAt: now,
      microsoftObjectID: account.objectID,
      microsoftTenantID: account.tenantID,
      password: createRandomPassword(),
      roles: [defaultRoleID],
    },
    depth: 2,
    overrideAccess: true,
    showHiddenFields: true,
  })
}

const removeExpiredSessions = (sessions: NonNullable<User['sessions']>) => {
  const now = new Date()

  return sessions.filter(({ expiresAt }) => new Date(expiresAt) > now)
}

export const createPayloadAuthCookieForUser = async ({
  email,
  payload,
  userID,
}: {
  email: string
  payload: Payload
  userID: string
}) => {
  const usersCollection = payload.collections.users
  let sid: string | undefined
  let user = (await payload.findByID({
    collection: 'users',
    depth: 2,
    id: userID,
    overrideAccess: true,
    showHiddenFields: true,
  })) as User

  if (usersCollection.config.auth.useSessions) {
    sid = createUUIDv7()

    const now = new Date()
    const expiresAt = new Date(now.getTime() + usersCollection.config.auth.tokenExpiration * 1000)
    const sessions = removeExpiredSessions(user.sessions || [])

    sessions.push({
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      id: sid,
    })

    user = (await payload.update({
      collection: 'users',
      data: {
        sessions,
      },
      depth: 2,
      id: userID,
      overrideAccess: true,
      showHiddenFields: true,
    })) as User
  }

  const userForToken = {
    ...user,
    _strategy: 'microsoft-entra',
    collection: 'users',
  } as PayloadRequest['user']

  const fieldsToSign = getFieldsToSign({
    collectionConfig: usersCollection.config,
    email,
    sid,
    user: userForToken,
  })

  const { exp, token } = await jwtSign({
    fieldsToSign,
    secret: payload.secret,
    tokenExpiration: usersCollection.config.auth.tokenExpiration,
  })

  return {
    cookie: generatePayloadCookie({
      collectionAuthConfig: usersCollection.config.auth,
      cookiePrefix: payload.config.cookiePrefix,
      token,
    }),
    exp,
    token,
    user,
  }
}
