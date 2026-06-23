<template>
  <div class="input-group" :class="{ 'has-error': !!error }">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required-indicator" aria-hidden="true">*</span>
    </label>
    <div class="input-wrapper">
      <!-- Every : means -> Bind this HTML attribute to a Vue variable-->
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        class="app-input"
        v-bind="$attrs"
        @input="onInput"
      />
    </div>
    <span v-if="error" class="error-message" role="alert">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number;
  label?: string;
  type?: string;
  id: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
  text-align: left;
}

.input-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-base);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required-indicator {
  color: var(--color-danger, #ef4444);
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.app-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--color-text-base);
  background: var(--surface-bg-input, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: var(--radius-md, 8px);
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.app-input::placeholder {
  color: var(--color-text-muted, rgba(255, 255, 255, 0.4));
}

.app-input:focus {
  border-color: var(--color-accent);
  background: var(--surface-bg-input-focus, rgba(255, 255, 255, 0.08));
  box-shadow: 0 0 0 3px var(--color-accent-subtle, rgba(139, 92, 246, 0.15));
}

/* Use standard validity helper where possible */
.app-input:user-invalid {
  border-color: var(--color-danger, #ef4444);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

/* Custom error prop styling */
.has-error .app-input {
  border-color: var(--color-danger, #ef4444);
}

.has-error .app-input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.error-message {
  font-size: 0.775rem;
  color: var(--color-danger, #ef4444);
  margin-top: 0.125rem;
  font-weight: 500;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
