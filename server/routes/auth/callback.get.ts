import { defineEventHandler, getQuery, getCookie, setCookie, deleteCookie, sendRedirect, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code as string;
  const state = query.state as string;

  const authState = getCookie(event, 'auth_state');
  const authCodeVerifier = getCookie(event, 'auth_code_verifier');

  // Verify the OIDC state matches
  if (!code || !state || !authState || state !== authState || !authCodeVerifier) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid state or missing authorization code parameters.',
    });
  }

  // Clear temporary auth validation cookies
  deleteCookie(event, 'auth_state');
  deleteCookie(event, 'auth_code_verifier');

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await $fetch<any>('http://localhost:8080/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:3000/auth/callback',
        client_id: '379545720174149635',
        code_verifier: authCodeVerifier,
      }).toString(),
    });

    const cookieOptions = {
      httpOnly: true,
      secure: false, // Local HTTP development
      sameSite: 'lax' as const,
      path: '/',
    };

    const maxAge = 3600;
/*
Authorization Code -> exchanged once for tokens.
Access Token -> authorizes API requests (short-lived).
ID Token -> identifies the logged-in user.
Refresh Token -> obtains new Access/ID Tokens (long-lived) only to it is set to automatically refresh.
When the Refresh Token expires, the user must authenticate again.
*/
    // Save tokens in httpOnly cookies
    if (tokenResponse.access_token) {
      setCookie(event, 'access_token', tokenResponse.access_token, {
        ...cookieOptions,
        maxAge: maxAge,
      });
    }

    if (tokenResponse.id_token) {
      setCookie(event, 'id_token', tokenResponse.id_token, {
        ...cookieOptions,
        maxAge: maxAge,
      });
    }

    if (tokenResponse.refresh_token) {
      setCookie(event, 'refresh_token', tokenResponse.refresh_token, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    // Redirect user to the protected dashboard page
    return sendRedirect(event, '/dashboard', 302);
  } catch (error: any) {
    console.error('Error exchanging authorization code for tokens:', error);
    // Redirect to login page with error state
    return sendRedirect(event, '/?error=token_exchange_failed', 302);
  }
});
