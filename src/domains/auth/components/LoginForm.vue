<template>
  <form class="flex flex-col gap-5 w-full" @submit.prevent="handleSubmit"><!-- Prevents reload of page on submission -->
    <div v-if="error" class="error-shake p-3 rounded-md bg-danger/15 border border-danger/20 text-red-300 text-[0.85rem] font-medium text-left" role="alert">
      {{ error }}
    </div>
    <!-- Sends props to the input component -->
    <AppInput
      id="login-email"
      v-model="email"
      type="email"
      label="Email Address"
      placeholder="e.g. accountant@example.com"
      required
      :disabled="loading"
    />

    <AppInput
      id="login-password"
      v-model="password"
      type="password"
      label="Password"
      placeholder="Enter your password"
      required
      :disabled="loading"
    />

    <div class="mt-2">
      <AppButton
        type="submit"
        variant="primary"
        :loading="loading"
        class="w-full py-3"
      >
        Sign In
      </AppButton>
    </div>

    <p class="text-[0.85rem] text-text-muted m-0 text-center">
      Don't have an account?
      <button
        type="button"
        class="bg-transparent border-none text-accent font-medium cursor-pointer p-0 font-inherit hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        :disabled="loading"
        @click="$emit('switch-view', 'signup')"
      >
        Create Account
      </button>
    </p>

    <!-- Help Note -->
    <div class="mt-2 p-3 rounded-md bg-white/[0.03] border border-white/[0.05] text-[0.775rem] text-text-muted text-left">
      <p class="font-semibold text-text-base mt-0 mb-1.5">💡 Demo Access Credentials</p>
      <p class="m-0 mb-1">Email: <code class="text-accent-alt font-semibold">accountant@example.com</code></p>
      <p class="m-0 mb-1 last:mb-0">Password: <code class="text-accent-alt font-semibold">password123</code></p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppInput from '~/shared/components/AppInput.vue';
import AppButton from '~/shared/components/AppButton.vue';
import { useAuth } from '../composables/useAuth';

const emit = defineEmits<{
  (e: 'switch-view', view: 'signup'): void; 
  (e: 'login-success'): void;
 }>();

const { login, loading, error } = useAuth();

const email = ref('');
const password = ref('');

const handleSubmit = async () => {
  const success = await login({
    email: email.value.trim(),
    password: password.value,
  });

  if (success) {
    emit('login-success');
  }
};
</script>

<style scoped>
.error-shake {
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
</style>

