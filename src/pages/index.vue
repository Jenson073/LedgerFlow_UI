<template>
  <NuxtLayout name="auth">
    <div class="flex flex-col gap-6 w-full max-w-md bg-bg-card/45 border border-border rounded-lg p-9 backdrop-blur-xl saturate-[180%] shadow-lg text-center animate-slide-in">
      <div class="flex flex-col items-center gap-3">
        <span class="flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-br from-accent to-accent-alt text-bg-canvas shadow-accent" aria-hidden="true">
          <svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 20v-6.75Z" />
          </svg>
        </span>
        <h2 class="m-0 text-2xl font-bold tracking-tight text-text-base">LedgerFlow</h2>
        <p class="m-0 text-sm text-text-muted">Domain-Driven Accounting Dashboard</p>
      </div>

      <div class="h-[1px] w-full bg-border"></div>

      <div class="flex flex-col gap-4">
        <button
          type="button"
          class="flex items-center justify-center gap-3 w-full px-5 py-3 font-semibold text-sm rounded-md bg-accent text-bg-canvas shadow-accent hover:bg-accent-alt hover:-translate-y-px active:translate-y-0 transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          @click="loginWithZitadel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
          </svg>
          Sign In with Zitadel
        </button>
      </div>

      <div v-if="errorMsg" class="p-3 rounded-md bg-danger/10 border border-danger/25 text-xs text-red-400">
        {{ errorMsg }}
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from '#app';

definePageMeta({
  layout: false,
});

const route = useRoute();
const errorMsg = ref('');

onMounted(() => {
  if (route.query.error) {
    errorMsg.value = 'Authentication failed. Please try again.';
  }
});

const loginWithZitadel = () => {
  window.location.href = '/api/auth/login';
};
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
