import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuth } from '~/shared/composables/useAuth';
//middleware is the code that runs before any nuxt route to any page
//auth.global.ts is a global middleware that runs before any route to any page in the application
export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware checks during server-side API or auth callback routing
  if (import.meta.server && (to.path.startsWith('/api/') || to.path === '/auth/callback')) {
    return;
  }

  const { user, fetchUser } = useAuth();

  // Load active user session on client/server if not already populated in reactive state
  if (user.value === null) {
    await fetchUser();
  }

  // Enforce page auth protection rules
  if (user.value === null) {
    // Unauthenticated user: restrict access to dashboard
    if (to.path === '/dashboard') {
      return navigateTo('/');
    }
  } else {
    // Authenticated user: prevent visiting the index login page
    if (to.path === '/') {
      return navigateTo('/dashboard');
    }
  }
});
