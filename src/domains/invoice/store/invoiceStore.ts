import { defineStore } from 'pinia';
import { invoiceService } from '../services/invoiceService';
import type { Invoice, CreateInvoiceInput, InvoiceStatus } from '../types/invoice';

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    invoices: [] as Invoice[],
    loading: false,
    error: null as string | null,
    initialized: false,
  }),

  getters: {
    totalRevenue: (state) => {
      return state.invoices
        .filter((inv) => inv.status === 'Paid')
        .reduce((sum, inv) => sum + inv.amount, 0);
    },
    totalDues: (state) => {
      return state.invoices
        .filter((inv) => inv.status === 'Pending' || inv.status === 'Overdue')
        .reduce((sum, inv) => sum + inv.amount, 0);
    },
  },

  actions: {
    async fetchInvoices(force = false) {
      if (this.initialized && !force) return;
      this.loading = true;
      this.error = null;
      try {
        const data = await invoiceService.getInvoices();
        this.invoices = data;
        this.initialized = true;
      } catch (err: any) {
        this.error = err.message || 'An error occurred fetching invoices.';
      } finally {
        this.loading = false;
      }
    },

    async createInvoice(input: CreateInvoiceInput): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {
        const data = await invoiceService.addInvoice(input);
        this.invoices.unshift(data);
        return true;
      } catch (err: any) {
        this.error = err.message || 'An error occurred creating invoice.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async updateStatus(id: string, status: InvoiceStatus): Promise<boolean> {
      try {
        const data = await invoiceService.updateInvoiceStatus(id, status);
        const index = this.invoices.findIndex((inv) => inv.id === id);
        if (index !== -1) {
          this.invoices[index] = data;
        }
        return true;
      } catch (err) {
        console.error('Error updating invoice status:', err);
        return false;
      }
    }
  },
});
