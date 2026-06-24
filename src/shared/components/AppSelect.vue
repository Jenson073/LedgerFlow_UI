<template>
  <div class="flex flex-col gap-1.5 w-full text-left">
    <label v-if="label" :for="id" class="text-[0.85rem] font-medium text-text-base flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
    </label>
    <div class="relative w-full flex items-center">
      <select
        :id="id"
        :value="modelValue"
        :required="required"
        :class="[
          'w-full pl-3.5 pr-9 py-2.5 font-sans text-[0.95rem] text-text-base bg-bg-input border border-border rounded-md outline-none transition-all duration-200 cursor-pointer appearance-none box-border focus:border-accent focus:bg-bg-input-focus focus:shadow-[0_0_0_3px_var(--color-accent-subtle)]',
          error ? 'border-danger focus:shadow-[0_0_0_3px_var(--color-danger-subtle)]' : ''
        ]"
        v-bind="$attrs"
        @change="onChange"
      >
        <slot></slot>
      </select>
      <span class="absolute right-3.5 pointer-events-none w-5 h-5 text-text-muted/60 flex items-center" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
        </svg>
      </span>
    </div>
    <span v-if="error" class="error-message text-[0.775rem] text-danger mt-0.5 font-medium" role="alert">{{ error }}</span>
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
.app-select option {
  background: #1e293b;
  color: #f8fafc;
}

.error-message {
  animation: fadeIn 0.2s ease-out forwards;
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
