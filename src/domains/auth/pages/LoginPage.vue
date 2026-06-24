<template>
  <div class="w-full max-w-[26rem] bg-bg-card/45 border border-border rounded-lg px-8 py-9 backdrop-blur-xl saturate-[180%] shadow-2xl flex flex-col gap-7 text-center transition-all duration-300">
    <div class="flex flex-col items-center gap-2">
      <div class="flex items-center justify-center w-14 h-14 rounded-md bg-gradient-to-br from-accent to-accent-alt text-bg-canvas shadow-accent mb-2" aria-hidden="true">
        <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 20v-6.75Z" />
        </svg>
      </div>
      <h1 class="m-0 text-3.5xl font-extrabold tracking-tight bg-gradient-to-r from-text-base to-text-muted bg-clip-text text-transparent">LedgerFlow</h1>
      <p class="m-0 text-[0.85rem] text-text-muted font-medium">Professional Accountant Tracking & Analytics</p>
    </div>

    <!-- Toggle Forms -->
    <div class="flex flex-col gap-1 text-left">
      <h2 class="m-0 text-xl font-semibold text-text-base">{{ viewMode === 'login' ? 'Welcome Back' : 'Get Started' }}</h2>
      <p class="m-0 mb-5 text-[0.85rem] text-text-muted leading-relaxed">
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

