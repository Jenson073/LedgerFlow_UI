import { defineEventHandler, getCookie, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const idToken = getCookie(event, 'id_token');

  if (!idToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. No active session token found.',
    });
  }

  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT signature format.');
    }

    // Decode base64url encoded payload segment (second index of JWT)
    const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson);

    // Return profile details extracted from OIDC Claims
    return {
      id: payload.sub,
      name: payload.name || payload.preferred_username || 'Accounting Practitioner',
      email: payload.email || '',
      role: 'Firm Lead CPA',
    };
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. Session signature verification failed.',
    });
  }
});
