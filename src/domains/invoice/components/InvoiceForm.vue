<template>
  <form class="flex flex-col gap-5 w-full" @submit.prevent="handleSubmit">
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

    <div class="flex gap-4 w-full">
      <AppInput
        id="inv-issue-date"
        v-model="issueDate"
        type="date"
        label="Issue Date"
        required
        :disabled="loading"
        class="flex-1"
      />

      <AppInput
        id="inv-due-date"
        v-model="dueDate"
        type="date"
        label="Due Date"
        required
        :disabled="loading"
        class="flex-1"
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

    <div class="flex flex-col gap-1.5 w-full text-left">
      <label for="inv-notes" class="text-[0.85rem] font-medium text-text-base">Notes / Description</label>
      <textarea
        id="inv-notes"
        v-model="notes"
        placeholder="Brief description of consulting work, products, etc."
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

