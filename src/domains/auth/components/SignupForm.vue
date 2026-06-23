<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <div v-if="error" class="form-error-alert" role="alert">
      {{ error }}
    </div>

    <div v-if="validationError" class="form-error-alert" role="alert">
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

    <div class="form-actions">
      <AppButton
        type="submit"
        variant="primary"
        :loading="loading"
        class="submit-button"
      >
        Create Account
      </AppButton>
    </div>

    <p class="form-toggle-text">
      Already have an account?
      <button
        type="button"
        class="toggle-link-btn"
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
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.form-error-alert {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md, 8px);
  background-color: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: left;
  animation: shake 0.4s ease-in-out;
}

.form-actions {
  margin-top: 0.5rem;
}

.submit-button {
  width: 100%;
  padding-block: 0.75rem;
}

.form-toggle-text {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin: 0;
  text-align: center;
}

.toggle-link-btn {
  background: none;
  border: none;
  color: var(--color-accent);
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}

.toggle-link-btn:hover {
  text-decoration: underline;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
</style>
