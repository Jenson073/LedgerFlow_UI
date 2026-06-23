import { defineStore } from 'pinia';
import { useInvoiceStore } from '~/domains/invoice/store/invoiceStore';
import { useReceiptStore } from '~/domains/receipt/store/receiptStore';
import { useExpenseStore } from '~/domains/expense/store/expenseStore';
import { useBankRecordStore } from '~/domains/bank-record/store/bankRecordStore';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats } from '../types/dashboard';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    loading: false,
  }),

  getters: {
    stats: (): DashboardStats => {
      const invoiceStore = useInvoiceStore();
      const receiptStore = useReceiptStore();
      const expenseStore = useExpenseStore();
      const bankRecordStore = useBankRecordStore();

      return dashboardService.calculateStats(
        invoiceStore.invoices,
        receiptStore.receipts,
        expenseStore.expenses,
        bankRecordStore.bankRecords
      );
    },
  },

  actions: {
    async fetchAllData(force = false) {
      this.loading = true;
      const invoiceStore = useInvoiceStore();
      const receiptStore = useReceiptStore();
      const expenseStore = useExpenseStore();
      const bankRecordStore = useBankRecordStore();

      try {
        await Promise.all([
          invoiceStore.fetchInvoices(force),
          receiptStore.fetchReceipts(force),
          expenseStore.fetchExpenses(force),
          bankRecordStore.fetchBankRecords(force),
        ]);
      } catch (error) {
        console.error('Error fetching dashboard sub-domain data:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
