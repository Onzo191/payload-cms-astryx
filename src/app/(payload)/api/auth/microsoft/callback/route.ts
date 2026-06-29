import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import {
  createPayloadAuthCookieForUser,
  exchangeMicrosoftAuthorizationCode,
  findOrCreateMicrosoftUser,
  getMicrosoftOAuthConfig,
  getMicrosoftOAuthCookieNames,
  safeMicrosoftReturnPath,
  verifyMicrosoftIDToken,
} from '@/auth/microsoft'

const clearOAuthCookies = (response: NextResponse) => {
  const cookieNames = getMicrosoftOAuthCookieNames()

  Object.values(cookieNames).forEach((cookieName) => {
    response.cookies.set(cookieName, '', {
      expires: new Date(0),
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
    })
  })
}

const redirectWithReason = ({
  reason,
  request,
}: {
  reason: string
  request: NextRequest
}) => {
  const microsoftConfig = getMicrosoftOAuthConfig(request)
  const redirectURL = new URL(microsoftConfig.failureRedirect, request.nextUrl.origin)

  redirectURL.searchParams.set('reason', reason)

  const response = NextResponse.redirect(redirectURL)
  clearOAuthCookies(response)

  return response
}

export const GET = async (request: NextRequest) => {
  const microsoftConfig = getMicrosoftOAuthConfig(request)
  const cookieNames = getMicrosoftOAuthCookieNames()
  const code = request.nextUrl.searchParams.get('code')
  const returnedState = request.nextUrl.searchParams.get('state')
  const error = request.nextUrl.searchParams.get('error')
  const expectedState = request.cookies.get(cookieNames.state)?.value
  const verifier = request.cookies.get(cookieNames.verifier)?.value
  const nonce = request.cookies.get(cookieNames.nonce)?.value
  const returnTo = safeMicrosoftReturnPath(
    request.cookies.get(cookieNames.returnTo)?.value || null,
    microsoftConfig.successRedirect,
  )

  if (error) {
    return redirectWithReason({ reason: error, request })
  }

  if (!microsoftConfig.clientID) {
    return redirectWithReason({ reason: 'missing_microsoft_client_id', request })
  }

  if (!code || !returnedState || !expectedState || returnedState !== expectedState) {
    return redirectWithReason({ reason: 'invalid_oauth_state', request })
  }

  if (!verifier || !nonce) {
    return redirectWithReason({ reason: 'missing_oauth_cookie', request })
  }

  try {
    const idToken = await exchangeMicrosoftAuthorizationCode({
      code,
      config: microsoftConfig,
      verifier,
    })
    const account = await verifyMicrosoftIDToken({
      allowedDomain: microsoftConfig.allowedDomain,
      clientID: microsoftConfig.clientID,
      idToken,
      nonce,
      tenantID: microsoftConfig.tenantID,
    })
    const payload = await getPayload({ config })
    const user = await findOrCreateMicrosoftUser({
      account,
      autoCreateUsers: microsoftConfig.autoCreateUsers,
      payload,
    })
    const auth = await createPayloadAuthCookieForUser({
      email: account.email,
      payload,
      userID: user.id,
    })
    const response = NextResponse.redirect(new URL(returnTo, request.nextUrl.origin))

    clearOAuthCookies(response)
    response.headers.append('Set-Cookie', auth.cookie)

    return response
  } catch (caughtError) {
    const reason = caughtError instanceof Error ? caughtError.message : 'microsoft_oauth_failed'

    request.nextUrl.searchParams.set('reason', reason)
    return redirectWithReason({ reason, request })
  }
}
