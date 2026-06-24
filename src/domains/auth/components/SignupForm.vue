<template>
  <form class="flex flex-col gap-5 w-full" @submit.prevent="handleSubmit">
    <div v-if="error" class="error-shake p-3 rounded-md bg-danger/15 border border-danger/20 text-red-300 text-[0.85rem] font-medium text-left" role="alert">
      {{ error }}
    </div>

    <div v-if="validationError" class="error-shake p-3 rounded-md bg-danger/15 border border-danger/20 text-red-300 text-[0.85rem] font-medium text-left" role="alert">
      {{ validationError }}
    </div>

    <AppInput
      id="register-name"
      v-model="name"
      type="text"
      label="Full Name"
      placeholder="e.g. Jane Doe, CPA"
      required
      :disabled="loading"
    />

    <AppInput
      id="register-email"
      v-model="email"
      type="email"
      label="Email Address"
      placeholder="e.g. accountant@example.com"
      required
      :disabled="loading"
    />

    <AppInput
      id="register-password"
      v-model="password"
      type="password"
      label="Password"
      placeholder="Create password"
      required
      :disabled="loading"
    />

    <AppInput
      id="register-confirm-password"
      v-model="confirmPassword"
      type="password"
      label="Confirm Password"
      placeholder="Repeat password"
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
        Create Account
      </AppButton>
    </div>

    <p class="text-[0.85rem] text-text-muted m-0 text-center">
      Already have an account?
      <button
        type="button"
        class="bg-transparent border-none text-accent font-medium cursor-pointer p-0 font-inherit hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        :disabled="loading"
        @click="$emit('switch-view', 'login')"
      >
        Sign In
      </button>
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppInput from '~/shared/components/AppInput.vue';
import AppButton from '~/shared/components/AppButton.vue';
import { useAuth } from '../composables/useAuth';

const emit = defineEmits<{
  (e: 'switch-view', view: 'login'): void;
  (e: 'register-success'): void;
}>();

const { register, loading, error } = useAuth();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const validationError = ref('');

const handleSubmit = async () => {
  validationError.value = '';

  if (password.value.length < 6) {
    validationError.value = 'Password must be at least 6 characters long.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    validationError.value = 'Passwords do not match.';
    return;
  }

  const success = await register({
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value,
  });

  if (success) {
    emit('register-success');
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

