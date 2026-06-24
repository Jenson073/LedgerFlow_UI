<template>
  <button
    :type="type"
    :class="[
      'relative inline-flex items-center justify-center gap-2 px-5 py-2.5 font-medium rounded-md border border-transparent cursor-pointer transition-all duration-200 ease-in-out select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
      variantClasses,
      loading ? 'cursor-wait' : ''
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <span v-if="loading" class="absolute w-5 h-5 border-2 border-current border-r-transparent rounded-full animate-spin" aria-hidden="true"></span>
    <span class="inline-flex items-center justify-center gap-2 transition-opacity duration-200" :class="{ 'opacity-0': loading }">
      <slot name="icon"></slot>
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'text';
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  loading: false,
  disabled: false,
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-gradient-to-br from-accent to-accent-alt text-bg-canvas shadow-accent hover:from-accent hover:to-accent hover:-translate-y-px hover:shadow-accent-hover active:translate-y-0';
    case 'secondary':
      return 'bg-bg-card border-border text-text-base hover:bg-white/10 dark:hover:bg-white/5';
    case 'outline':
      return 'bg-transparent border border-accent text-accent hover:bg-accent-subtle';
    case 'danger':
      return 'bg-danger text-white shadow-[0_4px_12px_rgba(239,68,68,0.2)] hover:bg-danger-hover hover:-translate-y-px';
    case 'text':
      return 'bg-transparent text-text-muted px-2 hover:text-text-base hover:bg-white/5';
    default:
      return '';
  }
});
</script>
