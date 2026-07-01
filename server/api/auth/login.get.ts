import { defineEventHandler, setCookie, sendRedirect } from 'h3';
import crypto from 'node:crypto';
//Whenever this endpoint is requested, execute this defineEventHandler function
export default defineEventHandler(async (event) => {
  // Generate random state and code verifier
  const state = crypto.randomBytes(16).toString('base64url');
  const codeVerifier = crypto.randomBytes(32).toString('base64url');

  // Generate SHA-256 base64url code challenge
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  // Set cookies for validation in callback step (5-minute expiration)
  const cookieOptions = {
    httpOnly: true,
    secure: false, // Local HTTP development
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 300, // 5 minutes
  };

  setCookie(event, 'auth_state', state, cookieOptions);
  setCookie(event, 'auth_code_verifier', codeVerifier, cookieOptions);

  // Zitadel OAuth/OIDC endpoint query parameters
  const authorizationUrl = new URL('http://localhost:8080/oauth/v2/authorize');
  authorizationUrl.searchParams.set('client_id', '379545720174149635');
  authorizationUrl.searchParams.set('redirect_uri', 'http://localhost:3000/auth/callback');
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', 'openid profile email offline_access');
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('code_challenge', codeChallenge);
  authorizationUrl.searchParams.set('code_challenge_method', 'S256');

  // Redirect user to Zitadel Authorization portal
  return sendRedirect(event, authorizationUrl.toString(), 302);
});
