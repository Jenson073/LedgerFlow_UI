<template>
  <form class="flex flex-col gap-5 w-full" @submit.prevent="handleSubmit">
    <AppInput
      id="rec-merchant"
      v-model="merchantName"
      type="text"
      label="Merchant Name"
      placeholder="e.g. Amazon Web Services"
      required
      :disabled="loading"
    />

    <AppInput
      id="rec-amount"
      v-model="amount"
      type="number"
      step="0.01"
      min="0.01"
      label="Amount ($)"
      placeholder="e.g. 89.50"
      required
      :disabled="loading"
    />

    <AppInput
      id="rec-date"
      v-model="date"
      type="date"
      label="Transaction Date"
      required
      :disabled="loading"
    />

    <AppSelect
      id="rec-category"
      v-model="category"
      label="Category"
      required
      :disabled="loading"
    >
      <option value="" disabled>Select a category</option>
      <option value="Hosting & Infrastructure">Hosting & Infrastructure</option>
      <option value="Office Supplies">Office Supplies</option>
      <option value="Meals & Entertainment">Meals & Entertainment</option>
      <option value="Travel & Lodging">Travel & Lodging</option>
      <option value="Professional Services">Professional Services</option>
      <option value="Utilities & Software">Utilities & Software</option>
      <option value="Other Expenses">Other Expenses</option>
    </AppSelect>

    <div class="flex flex-col gap-1.5 w-full text-left">
      <label for="rec-notes" class="text-[0.85rem] font-medium text-text-base">Notes / Description</label>
      <textarea
        id="rec-notes"
        v-model="notes"
        placeholder="Describe what was purchased..."
        rows="3"
        class="w-full px-3.5 py-2.5 font-sans text-[0.95rem] text-text-base bg-bg-input border border-border rounded-md outline-none transition-all duration-200 box-border resize-y placeholder:text-text-muted/40 focus:border-accent focus:bg-bg-input-focus focus:shadow-[0_0_0_3px_var(--color-accent-subtle)]"
        :disabled="loading"
      ></textarea>
    </div>

    <div class="flex justify-end gap-3 mt-2">
      <AppButton
        type="button"
        variant="text"
        :disabled="loading"
        @click="$emit('cancel')"
      >
        Cancel
      </AppButton>
      <AppButton
        type="submit"
        variant="primary"
        :loading="loading"
      >
        Save Receipt
      </AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppInput from '~/shared/components/AppInput.vue';
import AppSelect from '~/shared/components/AppSelect.vue';
import AppButton from '~/shared/components/AppButton.vue';
import { useReceipt } from '../composables/useReceipt';

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const { createReceipt, loading } = useReceipt();

const merchantName = ref('');
const amount = ref<number | string>('');
const date = ref(new Date().toISOString().substring(0, 10));
const category = ref('');
const notes = ref('');

const handleSubmit = async () => {
  if (!category.value) return;

  const success = await createReceipt({
    merchantName: merchantName.value.trim(),
    amount: Number(amount.value),
    date: date.value,
    category: category.value,
    notes: notes.value.trim(),
  });

  if (success) {
    emit('success');
  }
};
</script>

