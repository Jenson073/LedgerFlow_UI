<template>
  <form class="flex flex-col gap-5 w-full" @submit.prevent="handleSubmit">
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

    <div class="flex flex-col gap-1.5 w-full text-left">
      <label for="br-notes" class="text-[0.85rem] font-medium text-text-base">Notes / Description</label>
      <textarea
        id="br-notes"
        v-model="notes"
        placeholder="Brief description of the bank entry..."
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

