import { defineStore } from 'pinia';
import { authService } from '../services/authService';
import type { Credentials, SignupCredentials, User } from '../types/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async checkSession() {
      if (this.initialized) return;
      this.loading = true;
      try {
        const currentUser = await authService.getCurrentUser();
        this.user = currentUser;
      } catch (err: any) {
        console.error('Error fetching current session:', err);
      } finally {
        this.loading = false;
        this.initialized = true;
      }
    },

    async login(credentials: Credentials): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {
        const loggedInUser = await authService.login(credentials);
        this.user = loggedInUser;
        return true;
      } catch (err: any) {
        this.error = err.message || 'An error occurred during login.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(credentials: SignupCredentials): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {
        const registeredUser = await authService.register(credentials);
        this.user = registeredUser;
        return true;
      } catch (err: any) {
        this.error = err.message || 'An error occurred during registration.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout(): Promise<boolean> {
      this.loading = true;
      try {
        await authService.logout();
        this.user = null;
        return true;
      } catch (err: any) {
        console.error('Logout error:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
