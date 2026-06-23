<template>
  <div class="auth-card">
    <div class="auth-header">
      <div class="brand-logo" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 20v-6.75Z" />
        </svg>
      </div>
      <h1 class="auth-title">LedgerFlow</h1>
      <p class="auth-subtitle">Professional Accountant Tracking & Analytics</p>
    </div>

    <!-- Toggle Forms -->
    <div class="auth-body">
      <h2 class="form-title">{{ viewMode === 'login' ? 'Welcome Back' : 'Get Started' }}</h2>
      <p class="form-subtitle">
        {{ viewMode === 'login' ? 'Sign in to access your financial tracking dashboard.' : 'Register a new accountant ledger space.' }}
      </p>

      <LoginForm
        v-if="viewMode === 'login'"
        @switch-view="setViewMode"
        @login-success="onAuthSuccess"
      />
      <SignupForm
        v-else
        @switch-view="setViewMode"
        @register-success="onAuthSuccess"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from '#app';
import LoginForm from '../components/LoginForm.vue';
import SignupForm from '../components/SignupForm.vue';

const router = useRouter();
const viewMode = ref<'login' | 'signup'>('login');

const setViewMode = (mode: 'login' | 'signup') => {
  viewMode.value = mode;
};

const onAuthSuccess = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 26rem;
  background: var(--surface-bg-card, rgba(30, 41, 59, 0.45));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-lg, 16px);
  padding: 2.25rem 2rem;
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  text-align: center;
  transition: all 0.3s ease;
}

.auth-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--radius-md, 10px);
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-alt));
  color: var(--color-bg-base, #0f172a);
  box-shadow: 0 8px 16px var(--shadow-accent);
  margin-bottom: 0.5rem;
}

.brand-logo svg {
  width: 2rem;
  height: 2rem;
}

.auth-title {
  margin: 0;
  font-size: 1.85rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  background: linear-gradient(to right, #f8fafc, #cbd5e1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.auth-subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.auth-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
}

.form-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-base);
}

.form-subtitle {
  margin: 0 0 1.25rem 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}
</style>
