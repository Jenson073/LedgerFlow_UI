<template>
  <div class="flex flex-col gap-1.5 w-full text-left">
    <label v-if="label" :for="id" class="text-[0.85rem] font-medium text-text-base flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-danger" aria-hidden="true">*</span>
    </label>
    <div class="relative w-full">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :class="[
          'w-full px-3.5 py-2.5 font-sans text-[0.95rem] text-text-base bg-bg-input border border-border rounded-md outline-none transition-all duration-200 box-border placeholder:text-text-muted/40 focus:border-accent focus:bg-bg-input-focus focus:shadow-[0_0_0_3px_var(--color-accent-subtle)] user-invalid:border-danger user-invalid:shadow-[0_0_0_3px_var(--color-danger-subtle)]',
          error ? 'border-danger focus:shadow-[0_0_0_3px_var(--color-danger-subtle)]' : ''
        ]"
        v-bind="$attrs"
        @input="onInput"
      />
    </div>
    <span v-if="error" class="error-message text-[0.775rem] text-danger mt-0.5 font-medium" role="alert">{{ error }}</span>
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
