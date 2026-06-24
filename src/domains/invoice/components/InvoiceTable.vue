<template>
  <div class="flex flex-col gap-5 w-full">
    <!-- Controls Bar -->
    <div class="flex justify-between items-center gap-4 flex-wrap">
      <div class="flex items-center gap-3 flex-wrap">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by client..."
          class="px-3.5 py-2 text-sm text-text-base bg-bg-input border border-border rounded-md outline-none transition-all duration-200 w-60 focus:border-accent focus:bg-bg-input-focus focus:shadow-[0_0_0_3px_var(--color-accent-subtle)]"
        />
        <div class="relative flex items-center">
          <select v-model="statusFilter" class="pl-3.5 pr-8 py-2 text-sm text-text-base bg-bg-input border border-border rounded-md outline-none cursor-pointer transition-all duration-200 appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.25rem] focus:border-accent focus:bg-bg-input-focus focus:shadow-[0_0_0_3px_var(--color-accent-subtle)] bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%2394a3b8%22%3E%3Cpath fill-rule=%22evenodd%22 d=%22M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z%22 clip-rule=%22evenodd%22/%3E%3C/svg%3E')]">
            <option value="All" class="bg-slate-800 text-slate-100">All Statuses</option>
            <option value="Paid" class="bg-slate-800 text-slate-100">Paid</option>
            <option value="Pending" class="bg-slate-800 text-slate-100">Pending</option>
            <option value="Overdue" class="bg-slate-800 text-slate-100">Overdue</option>
          </select>
        </div>
      </div>
      <AppButton variant="primary" @click="$emit('open-create-modal')">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-[1.15rem] h-[1.15rem]">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
        </template>
        New Invoice
      </AppButton>
    </div>

    <!-- Table Container -->
    <div class="relative w-full overflow-x-auto rounded-md bg-white/[0.01] border border-border">
      <div v-if="loading" class="absolute inset-0 bg-slate-950/65 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
        <span class="w-8 h-8 border-3 border-accent border-r-transparent rounded-full animate-spin"></span>
        <p class="text-sm font-medium text-text-base">Updating invoice ledger...</p>
      </div>

      <table class="w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            <th class="px-4 py-3.5 font-semibold text-text-muted border-b border-border bg-white/[0.02]">Invoice #</th>
            <th class="px-4 py-3.5 font-semibold text-text-muted border-b border-border bg-white/[0.02]">Client</th>
            <th class="px-4 py-3.5 font-semibold text-text-muted border-b border-border bg-white/[0.02]">Issue Date</th>
            <th class="px-4 py-3.5 font-semibold text-text-muted border-b border-border bg-white/[0.02]">Due Date</th>
            <th class="px-4 py-3.5 font-semibold text-text-muted border-b border-border bg-white/[0.02]">Amount</th>
            <th class="px-4 py-3.5 font-semibold text-text-muted border-b border-border bg-white/[0.02]">Status</th>
            <th class="px-4 py-3.5 font-semibold text-text-muted border-b border-border bg-white/[0.02] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredInvoices.length === 0">
            <td colspan="7" class="text-center p-12 text-text-muted">No invoice records found.</td>
          </tr>
          <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="hover:bg-white/[0.01] transition-colors">
            <td class="p-4 border-b border-white/[0.04] text-text-base font-semibold">{{ invoice.invoiceNumber }}</td>
            <td class="p-4 border-b border-white/[0.04] text-text-base">{{ invoice.clientName }}</td>
            <td class="p-4 border-b border-white/[0.04] text-text-base">{{ formatDate(invoice.issueDate) }}</td>
            <td class="p-4 border-b border-white/[0.04] text-text-base">{{ formatDate(invoice.dueDate) }}</td>
            <td class="p-4 border-b border-white/[0.04] text-text-base font-semibold tabular-nums">{{ formatCurrency(invoice.amount) }}</td>
            <td class="p-4 border-b border-white/[0.04] text-text-base">
              <span :class="[
                'inline-flex px-2.5 py-1 rounded-full text-[0.775rem] font-semibold tracking-wide border',
                invoice.status === 'Paid' ? 'bg-success-subtle text-success border-success/20' :
                invoice.status === 'Pending' ? 'bg-warning-subtle text-warning border-warning/20' :
                'bg-danger-subtle text-danger border-danger/20'
              ]">
                {{ invoice.status }}
              </span>
            </td>
            <td class="p-4 border-b border-white/[0.04] text-text-base text-right">
              <div class="flex justify-end items-center min-h-[2.25rem]">
                <button
                  v-if="invoice.status !== 'Paid'"
                  type="button"
                  class="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-md bg-accent text-bg-canvas hover:bg-accent-alt hover:-translate-y-px active:translate-y-0 shadow-sm transition-all duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  @click="onMarkPaid(invoice.id)"
                >
                  Mark Paid
                </button>
                <span v-else class="text-[0.775rem] text-text-muted italic">
                  No Actions
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatCurrency, formatDate } from '~/shared/utils/formatters';
import AppButton from '~/shared/components/AppButton.vue';
import { useInvoice } from '../composables/useInvoice';
import type { InvoiceStatus } from '../types/invoice';

defineEmits<{
  (e: 'open-create-modal'): void;
}>();

const { invoices, loading, updateStatus } = useInvoice();

const searchQuery = ref('');
const statusFilter = ref<InvoiceStatus | 'All'>('All');

const filteredInvoices = computed(() => {
  return invoices.value.filter((inv) => {
    const matchesSearch = inv.clientName
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus =
      statusFilter.value === 'All' || inv.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

const onMarkPaid = async (id: string) => {
  await updateStatus(id, 'Paid');
};
</script>

