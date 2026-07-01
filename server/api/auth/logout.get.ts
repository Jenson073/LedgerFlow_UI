import { defineEventHandler, getCookie, deleteCookie, sendRedirect } from 'h3';

export default defineEventHandler(async (event) => {
  const idToken = getCookie(event, 'id_token');

  // Clear local session cookies
  deleteCookie(event, 'access_token');
  deleteCookie(event, 'id_token');
  deleteCookie(event, 'refresh_token');

  if (idToken) {
    // Redirect to Zitadel OIDC End Session endpoint so it clears the server-side IAM session
    const logoutUrl = new URL('http://localhost:8080/oidc/v1/end_session');
    logoutUrl.searchParams.set('post_logout_redirect_uri', 'http://localhost:3000/');
    logoutUrl.searchParams.set('id_token_hint', idToken);
    return sendRedirect(event, logoutUrl.toString(), 302);
  }

  // Fallback direct redirection to root login screen
  return sendRedirect(event, '/', 302);
});
