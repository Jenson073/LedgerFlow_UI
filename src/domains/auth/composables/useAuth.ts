import { storeToRefs } from 'pinia';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const store = useAuthStore();
  const { user, loading, error, initialized, isAuthenticated } = storeToRefs(store);

  return {
    // State
    user,
    loading,
    error,
    initialized,
    isAuthenticated,

    // Actions
    login: store.login,
    register: store.register,
    logout: store.logout,
    checkSession: store.checkSession,
  };
};
