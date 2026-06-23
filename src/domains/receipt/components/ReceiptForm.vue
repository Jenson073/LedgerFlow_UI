<template>
  <form class="receipt-form" @submit.prevent="handleSubmit">
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

    <div class="input-group">
      <label for="rec-notes" class="input-label">Notes / Description</label>
      <textarea
        id="rec-notes"
        v-model="notes"
        placeholder="Describe what was purchased..."
        rows="3"
        class="form-textarea"
        :disabled="loading"
      ></textarea>
    </div>

    <div class="form-actions">
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

<style scoped>
.receipt-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

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
}

.form-textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--color-text-base);
  background: var(--surface-bg-input, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: var(--radius-md, 8px);
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
  resize: vertical;
}

.form-textarea:focus {
  border-color: var(--color-accent);
  background: var(--surface-bg-input-focus, rgba(255, 255, 255, 0.08));
  box-shadow: 0 0 0 3px var(--color-accent-subtle, rgba(139, 92, 246, 0.15));
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
</style>
