<template>
  <div class="records-container">
    <!-- Controls Bar -->
    <div class="controls-bar">
      <div class="search-filter-group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by client..."
          class="table-search-input"
        />
        <select v-model="statusFilter" class="table-filter-select">
          <option value="All">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>
      <AppButton variant="primary" @click="$emit('open-create-modal')">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="btn-icon">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
        </template>
        New Invoice
      </AppButton>
    </div>

    <!-- Table Container -->
    <div class="table-responsive">
      <div v-if="loading" class="table-loading-overlay">
        <span class="table-spinner"></span>
        <p>Updating invoice ledger...</p>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Client</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th class="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredInvoices.length === 0">
            <td colspan="7" class="empty-table-row">No invoice records found.</td>
          </tr>
          <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="table-row">
            <td class="bold-text">{{ invoice.invoiceNumber }}</td>
            <td>{{ invoice.clientName }}</td>
            <td>{{ formatDate(invoice.issueDate) }}</td>
            <td>{{ formatDate(invoice.dueDate) }}</td>
            <td class="amount-cell">{{ formatCurrency(invoice.amount) }}</td>
            <td>
              <span :class="['status-badge', `status-${invoice.status.toLowerCase()}`]">
                {{ invoice.status }}
              </span>
            </td>
            <td class="actions-cell">
              <AppButton
                v-if="invoice.status !== 'Paid'"
                variant="outline"
                size="sm"
                @click="onMarkPaid(invoice.id)"
              >
                Mark Paid
              </AppButton>
              <span v-else class="action-completed-text">
                No Actions
              </span>
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

<style scoped>
.records-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.table-search-input {
  padding: 0.5rem 0.875rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--color-text-base);
  background: var(--surface-bg-input, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: var(--radius-md, 8px);
  outline: none;
  transition: all 0.2s;
  min-width: 15rem;
}

.table-search-input:focus {
  border-color: var(--color-accent);
  background: var(--surface-bg-input-focus, rgba(255, 255, 255, 0.08));
}

.table-filter-select {
  padding: 0.5rem 2rem 0.5rem 0.875rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--color-text-base);
  background: var(--surface-bg-input, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: var(--radius-md, 8px);
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2394a3b8'%3E%3Cpath fill-rule='evenodd' d='M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z' clip-rule='evenodd'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.25rem;
}

.table-filter-select option {
  background: #1e293b;
  color: #f8fafc;
}

.btn-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.table-responsive {
  position: relative;
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius-md, 8px);
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.data-table th {
  padding: 0.875rem 1rem;
  font-weight: 600;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.06));
  background: rgba(255, 255, 255, 0.02);
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.04));
  color: var(--color-text-base);
}

.bold-text {
  font-weight: 600;
}

.amount-cell {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.status-badge {
  display: inline-flex;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.775rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.status-paid {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-pending {
  background: rgba(245, 158, 11, 0.12);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.status-overdue {
  background: rgba(239, 68, 68, 0.12);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.actions-header, .actions-cell {
  text-align: right;
}

.actions-cell {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 2.75rem;
}

.action-completed-text {
  font-size: 0.775rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.empty-table-row {
  text-align: center;
  padding: 3rem !important;
  color: var(--color-text-muted);
}

/* Loading Overlay */
.table-loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  z-index: 10;
}

.table-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--color-accent);
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
