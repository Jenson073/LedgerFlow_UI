import { defineStore } from 'pinia';
import { receiptService } from '../services/receiptService';
import type { Receipt, CreateReceiptInput } from '../types/receipt';

export const useReceiptStore = defineStore('receipt', {
  state: () => ({
    receipts: [] as Receipt[],
    loading: false,
    error: null as string | null,
    initialized: false,
  }),

  getters: {
    totalReceiptsAmount: (state) => {
      return state.receipts.reduce((sum, rec) => sum + rec.amount, 0);
    },
  },

  actions: {
    async fetchReceipts(force = false) {
      if (this.initialized && !force) return;
      this.loading = true;
      this.error = null;
      try {
        const data = await receiptService.getReceipts();
        this.receipts = data;
        this.initialized = true;
      } catch (err: any) {
        this.error = err.message || 'An error occurred fetching receipts.';
      } finally {
        this.loading = false;
      }
    },

    async createReceipt(input: CreateReceiptInput): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {
        const data = await receiptService.addReceipt(input);
        this.receipts.unshift(data);
        return true;
      } catch (err: any) {
        this.error = err.message || 'An error occurred creating receipt.';
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
