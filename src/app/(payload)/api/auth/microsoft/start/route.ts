import { NextRequest, NextResponse } from 'next/server'

import {
  createMicrosoftAuthorizationURL,
  createMicrosoftOAuthCookies,
  getMicrosoftOAuthConfig,
  getMicrosoftOAuthCookieNames,
  getMicrosoftOAuthCookieOptions,
} from '@/auth/microsoft'

export const GET = (request: NextRequest) => {
  const config = getMicrosoftOAuthConfig(request)
  const redirectURL = new URL(config.failureRedirect, request.nextUrl.origin)

  if (!config.clientID) {
    redirectURL.searchParams.set('reason', 'missing_microsoft_client_id')
    return NextResponse.redirect(redirectURL)
  }

  const cookies = createMicrosoftOAuthCookies(request.nextUrl.searchParams.get('returnTo'))
  const authorizationURL = createMicrosoftAuthorizationURL({
    config,
    cookies,
  })
  const response = NextResponse.redirect(authorizationURL)
  const cookieNames = getMicrosoftOAuthCookieNames()
  const cookieOptions = getMicrosoftOAuthCookieOptions(request.nextUrl.protocol === 'https:')

  response.cookies.set(cookieNames.state, cookies.state, cookieOptions)
  response.cookies.set(cookieNames.verifier, cookies.verifier, cookieOptions)
  response.cookies.set(cookieNames.nonce, cookies.nonce, cookieOptions)
  response.cookies.set(cookieNames.returnTo, cookies.returnTo, cookieOptions)

  return response
}
