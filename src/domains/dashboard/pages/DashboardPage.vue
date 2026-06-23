<template>
  <div v-if="isAuthenticated" class="dashboard-page">
    <!-- Top Header Summary -->
    <div class="dashboard-header">
      <div class="header-titles">
        <h1 class="welcome-title">Dashboard Overview</h1>
        <p class="welcome-subtitle">Welcome back, <span class="accountant-name">{{ user?.name }}</span></p>
      </div>
      <div class="header-date" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="calendar-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        <span>{{ formatDate(new Date()) }}</span>
      </div>
    </div>

    <!-- Metrics Row -->
    <div class="metrics-grid">
      <MetricCard
        title="Bank Ledger Balance"
        :value="formatCurrency(stats.bankBalance)"
        accent="primary"
        subtitle="Current operating cash flow"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 0-1.5 0v1.008a7.002 7.002 0 0 0-4.75 6.742V13.5a1.5 1.5 0 0 1-1.5 1.5h-.75a.75.75 0 0 0 0 1.5h13.5a.75.75 0 0 0 0-1.5h-.75a1.5 1.5 0 0 1-1.5-1.5V10a7.002 7.002 0 0 0-4.75-6.742V2.25Z" clip-rule="evenodd" />
          </svg>
        </template>
      </MetricCard>

      <MetricCard
        title="Total Income (Paid)"
        :value="formatCurrency(stats.totalIncome)"
        accent="success"
        :subtitle="'Monthly Avg: ' + formatCurrency(stats.averageIncome)"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm1.25-11.25a.75.75 0 0 0-2.5 0v4.59L6.97 9.53a.75.75 0 1 0-1.06 1.06l3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06l-1.78 1.78V6.75Z" clip-rule="evenodd" />
          </svg>
        </template>
      </MetricCard>

      <MetricCard
        title="Total Expenses"
        :value="formatCurrency(stats.totalExpenses)"
        accent="danger"
        :subtitle="'Monthly Avg: ' + formatCurrency(stats.averageExpense)"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.59L7.53 9.56a.75.75 0 0 0-1.06 1.06l3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06l-1.72 1.72V6.75Z" clip-rule="evenodd" />
          </svg>
        </template>
      </MetricCard>

      <MetricCard
        title="Outstanding Dues"
        :value="formatCurrency(stats.outstandingDues)"
        accent="warning"
        subtitle="Unpaid customer invoices"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
          </svg>
        </template>
      </MetricCard>
    </div>

    <!-- Chart & Summary grid -->
    <div class="dashboard-grid">
      <!-- SVG Chart -->
      <div class="grid-col-2">
        <StatsChart :trends="stats.monthlyTrends" />
      </div>

      <!-- Quick Analysis Card -->
      <div class="analysis-box">
        <h4 class="analysis-title">Financial Health Summary</h4>
        <div class="analysis-metrics-list">
          <div class="analysis-item">
            <span>Net Cashflow Margin</span>
            <span :class="[stats.netCashflow >= 0 ? 'text-success' : 'text-danger']">
              {{ formatPercent((stats.netCashflow / (stats.totalIncome || 1)) * 100) }}
            </span>
          </div>
          <div class="analysis-item">
            <span>Income-to-Expense Ratio</span>
            <span :class="[stats.totalIncome >= stats.totalExpenses ? 'text-success' : 'text-danger']">
              {{ (stats.totalIncome / (stats.totalExpenses || 1)).toFixed(2) }}x
            </span>
          </div>
          <div class="analysis-item">
            <span>Uncollected Revenue</span>
            <span class="text-warning">
              {{ formatPercent((stats.outstandingDues / ((stats.totalIncome + stats.outstandingDues) || 1)) * 100) }}
            </span>
          </div>
        </div>

        <div class="insight-bubble">
          <p v-if="stats.netCashflow >= 0">
            🟢 <strong>Healthy surplus:</strong> Ledger shows positive margins. Reinvest surplus or pay down pending liabilities.
          </p>
          <p v-else>
            🔴 <strong>Cash deficit:</strong> Outflow exceeds paid income. Focus on collecting outstanding client invoices.
          </p>
        </div>
      </div>
    </div>

    <!-- Data Tabs Section -->
    <div class="tabs-container">
      <div class="tabs-header">
        <nav class="tabs-nav" aria-label="Dashboard records tabs">
          <button
            v-for="tab in tabItems"
            :key="tab.value"
            type="button"
            :class="['tab-btn', { 'tab-active': activeTab === tab.value }]"
            @click="setActiveTab(tab.value)"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="tab-panel">
        <InvoiceTable
          v-if="activeTab === 'invoices'"
          @open-create-modal="openModal('invoice')"
        />
        <ReceiptTable
          v-else-if="activeTab === 'receipts'"
          @open-create-modal="openModal('receipt')"
        />
        <ExpenseTable
          v-else-if="activeTab === 'expenses'"
          @open-create-modal="openModal('expense')"
        />
        <BankRecordTable
          v-else-if="activeTab === 'bank'"
          @open-create-modal="openModal('bank')"
        />
      </div>
    </div>

    <!-- Form Dialogs Modals -->
    <AppModal
      :show="showModal"
      :title="modalTitle"
      @close="closeModal"
    >
      <InvoiceForm
        v-if="modalType === 'invoice'"
        @success="onFormSuccess"
        @cancel="closeModal"
      />
      <ReceiptForm
        v-else-if="modalType === 'receipt'"
        @success="onFormSuccess"
        @cancel="closeModal"
      />
      <ExpenseForm
        v-else-if="modalType === 'expense'"
        @success="onFormSuccess"
        @cancel="closeModal"
      />
      <BankRecordForm
        v-else-if="modalType === 'bank'"
        @success="onFormSuccess"
        @cancel="closeModal"
      />
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from '#app';
import { useAuth } from '~/domains/auth/composables/useAuth';
import { useDashboard } from '../composables/useDashboard';
import { formatDate, formatCurrency, formatPercent } from '~/shared/utils/formatters';
import MetricCard from '../components/MetricCard.vue';
import StatsChart from '../components/StatsChart.vue';
import AppModal from '~/shared/components/AppModal.vue';

// Import table components
import InvoiceTable from '~/domains/invoice/components/InvoiceTable.vue';
import ReceiptTable from '~/domains/receipt/components/ReceiptTable.vue';
import ExpenseTable from '~/domains/expense/components/ExpenseTable.vue';
import BankRecordTable from '~/domains/bank-record/components/BankRecordTable.vue';

// Import forms
import InvoiceForm from '~/domains/invoice/components/InvoiceForm.vue';
import ReceiptForm from '~/domains/receipt/components/ReceiptForm.vue';
import ExpenseForm from '~/domains/expense/components/ExpenseForm.vue';
import BankRecordForm from '~/domains/bank-record/components/BankRecordForm.vue';

const router = useRouter();
const { user, isAuthenticated, checkSession } = useAuth();
const { stats, fetchAllData } = useDashboard();

const activeTab = ref<'invoices' | 'receipts' | 'expenses' | 'bank'>('invoices');

const showModal = ref(false);
const modalType = ref<'invoice' | 'receipt' | 'expense' | 'bank' | null>(null);

const tabItems = [
  { name: 'Customer Invoices', value: 'invoices' },
  { name: 'Merchant Receipts', value: 'receipts' },
  { name: 'Logged Expenses', value: 'expenses' },
  { name: 'Bank Ledger Statement', value: 'bank' },
];

const modalTitle = computed(() => {
  switch (modalType.value) {
    case 'invoice': return 'Create Customer Invoice';
    case 'receipt': return 'Upload Receipt Record';
    case 'expense': return 'Log Operational Expense';
    case 'bank': return 'Add Bank Ledger Entry';
    default: return '';
  }
});

const setActiveTab = (tab: any) => {
  activeTab.value = tab;
};

const openModal = (type: 'invoice' | 'receipt' | 'expense' | 'bank') => {
  modalType.value = type;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  modalType.value = null;
};

const onFormSuccess = () => {
  closeModal();
};

onMounted(async () => {
  // Ensure session check
  await checkSession();
  if (!isAuthenticated.value) {
    router.push('/');
  } else {
    // Prefetch all domain records
    await fetchAllData();
  }
});
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  width: 100%;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.header-titles {
  text-align: left;
}

.welcome-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text-base);
}

.welcome-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.accountant-name {
  color: var(--color-accent-alt, #c084fc);
  font-weight: 600;
}

.header-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-md, 8px);
  background: var(--surface-bg-card, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-base);
}

.calendar-icon {
  width: 1.15rem;
  height: 1.15rem;
  color: var(--color-accent);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 2fr 1fr;
  }
  .grid-col-2 {
    grid-column: span 1;
  }
}

.analysis-box {
  background: var(--surface-bg-card, rgba(30, 41, 59, 0.45));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-md, 12px);
  padding: 1.5rem;
  backdrop-filter: blur(20px) saturate(180%);
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  text-align: left;
}

.analysis-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text-base);
}

.analysis-metrics-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.analysis-item span:last-child {
  font-weight: 700;
}

.text-success {
  color: #34d399;
}

.text-danger {
  color: #f87171;
}

.text-warning {
  color: #fbbf24;
}

.insight-bubble {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md, 8px);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--color-text-muted);
}

.insight-bubble p {
  margin: 0;
}

.tabs-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tabs-header {
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
}

.tabs-nav {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs-nav::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.75rem 0.25rem;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-muted);
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--color-text-base);
}

.tab-active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
  font-weight: 600;
}

.tab-panel {
  width: 100%;
}
</style>
