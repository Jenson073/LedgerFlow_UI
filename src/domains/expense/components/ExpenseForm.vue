<template>
  <form class="flex flex-col gap-5 w-full" @submit.prevent="handleSubmit">
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

    <div class="flex flex-col gap-1.5 w-full text-left">
      <label for="exp-notes" class="text-[0.85rem] font-medium text-text-base">Notes / Description</label>
      <textarea
        id="exp-notes"
        v-model="notes"
        placeholder="Brief description of the expense..."
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

