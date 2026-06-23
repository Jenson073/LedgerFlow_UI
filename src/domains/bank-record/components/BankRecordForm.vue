<template>
  <form class="bank-record-form" @submit.prevent="handleSubmit">
    <AppInput
      id="br-desc"
      v-model="description"
      type="text"
      label="Description"
      placeholder="e.g. Deposit: Hooli Inc. Invoice"
      required
      :disabled="loading"
    />

    <AppSelect
      id="br-type"
      v-model="txnType"
      label="Transaction Type"
      required
      :disabled="loading"
    >
      <option value="Deposit">Deposit / Credit (+)</option>
      <option value="Withdrawal">Withdrawal / Debit (-)</option>
    </AppSelect>

    <AppInput
      id="br-amount"
      v-model="amount"
      type="number"
      step="0.01"
      min="0.01"
      label="Amount ($)"
      placeholder="e.g. 500.00"
      required
      :disabled="loading"
    />

    <AppInput
      id="br-date"
      v-model="date"
      type="date"
      label="Transaction Date"
      required
      :disabled="loading"
    />

    <div class="input-group">
      <label for="br-notes" class="input-label">Notes / Description</label>
      <textarea
        id="br-notes"
        v-model="notes"
        placeholder="Brief description of the bank entry..."
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
        Log Entry
      </AppButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppInput from '~/shared/components/AppInput.vue';
import AppSelect from '~/shared/components/AppSelect.vue';
import AppButton from '~/shared/components/AppButton.vue';
import { useBankRecord } from '../composables/useBankRecord';

const emit = defineEmits<{
  (e: 'success'): void;
  (e: 'cancel'): void;
}>();

const { createBankRecord, loading } = useBankRecord();

const description = ref('');
const txnType = ref<'Deposit' | 'Withdrawal'>('Deposit');
const amount = ref<number | string>('');
const date = ref(new Date().toISOString().substring(0, 10));
const notes = ref('');

const handleSubmit = async () => {
  const absoluteAmount = Number(amount.value);
  const finalAmount = txnType.value === 'Withdrawal' ? -absoluteAmount : absoluteAmount;

  const success = await createBankRecord({
    description: description.value.trim(),
    amount: finalAmount,
    date: date.value,
    notes: notes.value.trim(),
  });

  if (success) {
    emit('success');
  }
};
</script>

<style scoped>
.bank-record-form {
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
