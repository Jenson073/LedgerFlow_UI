import { defineStore } from 'pinia';
import { bankRecordService } from '../services/bankRecordService';
import type { BankRecord, CreateBankRecordInput } from '../types/bankRecord';

export const useBankRecordStore = defineStore('bankRecord', {
  state: () => ({
    bankRecords: [] as BankRecord[],
    loading: false,
    error: null as string | null,
    initialized: false,
  }),

  getters: {
    currentBankBalance: (state) => {
      return state.bankRecords.length > 0 ? state.bankRecords[0].balance : 24500.00;
    },
  },

  actions: {
    async fetchBankRecords(force = false) {
      if (this.initialized && !force) return;
      this.loading = true;
      this.error = null;
      try {
        const data = await bankRecordService.getBankRecords();
        this.bankRecords = data;
        this.initialized = true;
      } catch (err: any) {
        this.error = err.message || 'An error occurred fetching bank records.';
      } finally {
        this.loading = false;
      }
    },

    async createBankRecord(input: CreateBankRecordInput): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {
        const data = await bankRecordService.addBankRecord(input);
        this.bankRecords.unshift(data);
        return true;
      } catch (err: any) {
        this.error = err.message || 'An error occurred creating bank record.';
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
