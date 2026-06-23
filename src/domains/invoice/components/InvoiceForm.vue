<template>
  <form class="invoice-form" @submit.prevent="handleSubmit">
    <AppInput
      id="inv-client"
      v-model="clientName"
      type="text"
      label="Client Name"
      placeholder="e.g. Acme Corporation"
      required
      :disabled="loading"
    />

    <AppInput
      id="inv-amount"
      v-model="amount"
      type="number"
      step="0.01"
      min="0.01"
      label="Amount ($)"
      placeholder="e.g. 1500.00"
      required
      :disabled="loading"
    />

    <div class="form-row">
      <AppInput
        id="inv-issue-date"
        v-model="issueDate"
        type="date"
        label="Issue Date"
        required
        :disabled="loading"
      />

      <AppInput
        id="inv-due-date"
        v-model="dueDate"
        type="date"
        label="Due Date"
        required
        :disabled="loading"
      />
    </div>

    <AppSelect
      id="inv-status"
      v-model="status"
      label="Initial Status"
      required
      :disabled="loading"
    >
      <option value="Pending">Pending (Unpaid)</option>
      <option value="Paid">Paid</option>
      <option value="Overdue">Overdue</option>
    </AppSelect>

    <div class="input-group">
      <label for="inv-notes" class="input-label">Notes / Description</label>
      <textarea
        id="inv-notes"
        v-model="notes"
        placeholder="Brief description of consulting work, products, etc."
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
        Create Invoice
      </AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppInput from '~/shared/components/AppInput.vue';
import AppSelect from '~/shared/components/AppSelect.vue';
import AppButton from '~/shared/components/AppButton.vue';
import { useInvoice } from '../composables/useInvoice';
import type { InvoiceStatus } from '../types/invoice';

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const { createInvoice, loading } = useInvoice();

const clientName = ref('');
const amount = ref<number | string>('');
const issueDate = ref(new Date().toISOString().substring(0, 10));
const dueDate = ref(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10));
const status = ref<InvoiceStatus>('Pending');
const notes = ref('');

const handleSubmit = async () => {
  const success = await createInvoice({
    clientName: clientName.value.trim(),
    amount: Number(amount.value),
    issueDate: issueDate.value,
    dueDate: dueDate.value,
    status: status.value,
    notes: notes.value.trim(),
  });

  if (success) {
    emit('success');
  }
};
</script>

<style scoped>
.invoice-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.form-row {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.form-row > * {
  flex: 1;
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
