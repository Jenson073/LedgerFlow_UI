<template>
  <button
    :type="type"
    :class="['app-btn', `btn-${variant}`, { 'btn-loading': loading }]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="spinner" aria-hidden="true"></span>
    <span class="btn-content" :class="{ 'content-hidden': loading }">
      <slot name="icon"></slot>
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'text';
  loading?: boolean;
  disabled?: boolean;
}
//this provides default values for the props defined in the Props interface if the parent component does not provide them. It ensures that it doesnot have undefined values and maintains consistent behavior for the button component.
withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  loading: false,
  disabled: false,
});
</script>

<style scoped>
.app-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: var(--radius-md, 8px);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  line-height: 1.25;
  outline: none;
}

.app-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Button Variants */
.btn-primary {
  background: var(--btn-primary-bg, linear-gradient(135deg, var(--color-accent), var(--color-accent-alt)));
  color: var(--color-bg-base);
  box-shadow: 0 4px 12px var(--shadow-accent);
}

.btn-primary:hover:not(:disabled) {
  background: var(--btn-primary-bg-hover, var(--color-accent));
  transform: translateY(-1px);
  box-shadow: 0 6px 16px var(--shadow-accent-hover);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-secondary {
  background: var(--surface-bg-subtle, rgba(255, 255, 255, 0.08));
  border-color: var(--border-color, rgba(255, 255, 255, 0.1));
  color: var(--color-text-base);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--surface-bg-subtle-hover, rgba(255, 255, 255, 0.15));
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
}

.btn-outline:hover:not(:disabled) {
  background: var(--color-accent-subtle, rgba(139, 92, 246, 0.1));
}

.btn-danger {
  background: var(--color-danger, #ef4444);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-text {
  background: transparent;
  color: var(--color-text-muted);
  padding-inline: 0.5rem;
}

.btn-text:hover:not(:disabled) {
  color: var(--color-text-base);
  background: rgba(255, 255, 255, 0.04);
}

/* Disabled State */
.app-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Loading State & Spinner */
.btn-loading {
  cursor: wait;
}

.btn-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s;
}

.content-hidden {
  opacity: 0;
}

.spinner {
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
