<template>
  <div class="records-container">
    <!-- Controls Bar -->
    <div class="controls-bar">
      <div class="search-filter-group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by merchant..."
          class="table-search-input"
        />
        <select v-model="categoryFilter" class="table-filter-select">
          <option value="All">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
      <AppButton variant="primary" @click="$emit('open-create-modal')">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="btn-icon">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
        </template>
        New Receipt
      </AppButton>
    </div>

    <!-- Table Container -->
    <div class="table-responsive">
      <div v-if="loading" class="table-loading-overlay">
        <span class="table-spinner"></span>
        <p>Updating receipt vault...</p>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>Receipt #</th>
            <th>Merchant</th>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredReceipts.length === 0">
            <td colspan="6" class="empty-table-row">No receipts found.</td>
          </tr>
          <tr v-for="receipt in filteredReceipts" :key="receipt.id" class="table-row">
            <td class="bold-text">{{ receipt.receiptNumber }}</td>
            <td>{{ receipt.merchantName }}</td>
            <td>{{ formatDate(receipt.date) }}</td>
            <td>
              <span class="category-pill">{{ receipt.category }}</span>
            </td>
            <td class="amount-cell">{{ formatCurrency(receipt.amount) }}</td>
            <td class="notes-cell" :title="receipt.notes">{{ receipt.notes || '—' }}</td>
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
import { useReceipt } from '../composables/useReceipt';

defineEmits<{
  (e: 'open-create-modal'): void;
}>();

const { receipts, loading } = useReceipt();

const searchQuery = ref('');
const categoryFilter = ref('All');

const categories = computed(() => {
  const allCats = receipts.value.map((r) => r.category);
  return Array.from(new Set(allCats));
});

const filteredReceipts = computed(() => {
  return receipts.value.filter((rec) => {
    const matchesSearch = rec.merchantName
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase()) ||
      rec.receiptNumber.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesCategory =
      categoryFilter.value === 'All' || rec.category === categoryFilter.value;

    return matchesSearch && matchesCategory;
  });
});
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

.category-pill {
  display: inline-flex;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: rgba(139, 92, 246, 0.08);
  color: #c084fc;
  font-size: 0.775rem;
  font-weight: 500;
  border: 1px solid rgba(139, 92, 246, 0.15);
}

.amount-cell {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.notes-cell {
  max-width: 15rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-muted);
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
