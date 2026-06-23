<template>
  <form class="expense-form" @submit.prevent="handleSubmit">
    <AppInput
      id="exp-desc"
      v-model="description"
      type="text"
      label="Description"
      placeholder="e.g. Slack Technologies Subscription"
      required
      :disabled="loading"
    />

    <AppInput
      id="exp-amount"
      v-model="amount"
      type="number"
      step="0.01"
      min="0.01"
      label="Amount ($)"
      placeholder="e.g. 150.00"
      required
      :disabled="loading"
    />

    <AppInput
      id="exp-date"
      v-model="date"
      type="date"
      label="Expense Date"
      required
      :disabled="loading"
    />

    <AppSelect
      id="exp-category"
      v-model="category"
      label="Category"
      required
      :disabled="loading"
    >
      <option value="" disabled>Select a category</option>
      <option value="Rent & Lease">Rent & Lease</option>
      <option value="Software & Subscriptions">Software & Subscriptions</option>
      <option value="Utilities">Utilities</option>
      <option value="Marketing & Advertising">Marketing & Advertising</option>
      <option value="Payroll & Labor">Payroll & Labor</option>
      <option value="Taxes & Licenses">Taxes & Licenses</option>
      <option value="Travel & Meals">Travel & Meals</option>
      <option value="Other Expenses">Other Expenses</option>
    </AppSelect>

    <AppSelect
      id="exp-payment"
      v-model="paymentMethod"
      label="Payment Method"
      required
      :disabled="loading"
    >
      <option value="" disabled>Select a payment method</option>
      <option value="Bank Transfer">Bank Transfer</option>
      <option value="Credit Card">Credit Card</option>
      <option value="Debit Card">Debit Card</option>
      <option value="Direct Debit">Direct Debit</option>
      <option value="Cash">Cash</option>
      <option value="Check">Check</option>
    </AppSelect>

    <div class="input-group">
      <label for="exp-notes" class="input-label">Notes / Description</label>
      <textarea
        id="exp-notes"
        v-model="notes"
        placeholder="Brief description of the expense..."
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
        Log Expense
      </AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppInput from '~/shared/components/AppInput.vue';
import AppSelect from '~/shared/components/AppSelect.vue';
import AppButton from '~/shared/components/AppButton.vue';
import { useExpense } from '../composables/useExpense';

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const { createExpense, loading } = useExpense();

const description = ref('');
const amount = ref<number | string>('');
const date = ref(new Date().toISOString().substring(0, 10));
const category = ref('');
const paymentMethod = ref('');
const notes = ref('');

const handleSubmit = async () => {
  if (!category.value || !paymentMethod.value) return;

  const success = await createExpense({
    description: description.value.trim(),
    amount: Number(amount.value),
    date: date.value,
    category: category.value,
    paymentMethod: paymentMethod.value,
    notes: notes.value.trim(),
  });

  if (success) {
    emit('success');
  }
};
</script>

<style scoped>
.expense-form {
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
