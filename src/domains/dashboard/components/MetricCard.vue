<template>
  <div :class="['relative bg-bg-card/45 border border-border rounded-md px-6 py-5 backdrop-blur-xl saturate-[180%] shadow-md overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg hover:border-border-hover', accentStyles.card]">
    <div class="flex justify-between items-center gap-4">
      <div class="flex flex-col gap-1 text-left">
        <p class="m-0 text-[0.8rem] font-semibold text-text-muted uppercase tracking-wider">{{ title }}</p>
        <h3 class="m-0 text-[1.6rem] font-bold text-text-base tabular-nums tracking-tight">{{ value }}</h3>
        <p v-if="subtitle" class="m-0 text-[0.775rem] text-text-muted">{{ subtitle }}</p>
      </div>
      <div :class="['flex items-center justify-center w-11 h-11 rounded-md transition-transform duration-200 group-hover:scale-105', accentStyles.icon]" aria-hidden="true">
        <slot name="icon"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  accent?: 'primary' | 'success' | 'danger' | 'warning' | 'violet';
}

const props = withDefaults(defineProps<Props>(), {
  accent: 'primary',
});

const accentStyles = computed(() => {
  switch (props.accent) {
    case 'primary':
      return {
        card: 'border-l-[3px] border-l-accent',
        icon: 'text-accent bg-accent-subtle',
      };
    case 'success':
      return {
        card: 'border-l-[3px] border-l-success',
        icon: 'text-success bg-success-subtle',
      };
    case 'danger':
      return {
        card: 'border-l-[3px] border-l-danger',
        icon: 'text-danger bg-danger-subtle',
      };
    case 'warning':
      return {
        card: 'border-l-[3px] border-l-warning',
        icon: 'text-warning bg-warning-subtle',
      };
    case 'violet':
      return {
        card: 'border-l-[3px] border-l-accent-alt',
        icon: 'text-accent-alt bg-accent-subtle',
      };
    default:
      return {
        card: '',
        icon: 'text-text-muted bg-white/5',
      };
  }
});
</script>

