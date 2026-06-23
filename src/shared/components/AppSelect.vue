<template>
  <div class="select-group" :class="{ 'has-error': !!error }">
    <label v-if="label" :for="id" class="select-label">
      {{ label }}
      <span v-if="required" class="required-indicator" aria-hidden="true">*</span>
    </label>
    <div class="select-wrapper">
      <select
        :id="id"
        :value="modelValue"
        :required="required"
        class="app-select"
        v-bind="$attrs"
        @change="onChange"
      >
        <slot></slot>
      </select>
      <span class="select-chevron" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
        </svg>
      </span>
    </div>
    <span v-if="error" class="error-message" role="alert">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number;
  label?: string;
  id: string;
  required?: boolean;
  error?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>

<style scoped>
.select-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
  text-align: left;
}

.select-label {
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

.select-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.app-select {
  width: 100%;
  padding: 0.625rem 2.25rem 0.625rem 0.875rem;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--color-text-base);
  background: var(--surface-bg-input, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: var(--radius-md, 8px);
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

/* Forcing dropdown options dark styling in modern browser */
.app-select option {
  background: var(--dropdown-bg, #1e293b);
  color: #f8fafc;
}

.app-select:focus {
  border-color: var(--color-accent);
  background: var(--surface-bg-input-focus, rgba(255, 255, 255, 0.08));
  box-shadow: 0 0 0 3px var(--color-accent-subtle, rgba(139, 92, 246, 0.15));
}

.select-chevron {
  position: absolute;
  right: 0.875rem;
  pointer-events: none;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text-muted, rgba(255, 255, 255, 0.4));
  display: flex;
  align-items: center;
}

/* Custom error prop styling */
.has-error .app-select {
  border-color: var(--color-danger, #ef4444);
}

.has-error .app-select:focus {
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
