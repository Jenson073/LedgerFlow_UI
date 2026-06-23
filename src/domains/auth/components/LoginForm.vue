<template>
  <form class="auth-form" @submit.prevent="handleSubmit"><!-- Prevents reload of page on submission -->
    <div v-if="error" class="form-error-alert" role="alert">
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

    <div class="form-actions">
      <AppButton
        type="submit"
        variant="primary"
        :loading="loading"
        class="submit-button"
      >
        Sign In
      </AppButton>
    </div>

    <p class="form-toggle-text">
      Don't have an account?
      <button
        type="button"
        class="toggle-link-btn"
        :disabled="loading"
        @click="$emit('switch-view', 'signup')"
      >
        Create Account
      </button>
    </p>

    <!-- Help Note -->
    <div class="help-box">
      <p class="help-title">💡 Demo Access Credentials</p>
      <p>Email: <code>accountant@example.com</code></p>
      <p>Password: <code>password123</code></p>
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

.help-box {
  margin-top: 0.5rem;
  padding: 0.75rem;
  border-radius: var(--radius-md, 8px);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.775rem;
  color: var(--color-text-muted);
  text-align: left;
}

.help-title {
  font-weight: 600;
  color: var(--color-text-base);
  margin-top: 0;
  margin-bottom: 0.375rem;
}

.help-box p {
  margin: 0 0 0.25rem 0;
}

.help-box p:last-child {
  margin-bottom: 0;
}

.help-box code {
  color: var(--color-accent-alt, #a78bfa);
  font-weight: 600;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
</style>
