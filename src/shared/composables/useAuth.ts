import { useState, useRequestHeaders } from '#app';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useAuth = () => {
  //usestate vs ref: useState is a Nuxt composable that persists state across server and client, while ref is a Vue composable that creates a reactive reference for local component state. In this case, useState is used to maintain the user profile and loading state across the application.
  const user = useState<UserProfile | null>('auth_user', () => null);
  const loading = useState<boolean>('auth_loading', () => false);

  const fetchUser = async () => {
    loading.value = true;
    try {
      // Forward cookie headers during Server-Side Rendering (SSR)
      const headers = useRequestHeaders(['cookie']) as Record<string, string>;
      const data = await $fetch<UserProfile>('/api/auth/me', {
        headers: headers,
      });
      user.value = data;
      return true;
    } catch (error) {
      user.value = null;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      // Redirect to endpoint clearing cookies and terminating Zitadel session
      window.location.href = '/api/auth/logout';
      return true;
    } catch (error) {
      console.error('Logout redirect error:', error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    fetchUser,
    logout,
  };
};
