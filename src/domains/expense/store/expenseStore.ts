import { defineStore } from 'pinia';
import { expenseService } from '../services/expenseService';
import type { Expense, CreateExpenseInput } from '../types/expense';

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    expenses: [] as Expense[],
    loading: false,
    error: null as string | null,
    initialized: false,
  }),

  getters: {
    totalExpensesAmount: (state) => {
      return state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    },
  },

  actions: {
    async fetchExpenses(force = false) {
      if (this.initialized && !force) return;
      this.loading = true;
      this.error = null;
      try {
        const data = await expenseService.getExpenses();
        this.expenses = data;
        this.initialized = true;
      } catch (err: any) {
        this.error = err.message || 'An error occurred fetching expenses.';
      } finally {
        this.loading = false;
      }
    },

    async createExpense(input: CreateExpenseInput): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {
        const data = await expenseService.addExpense(input);
        this.expenses.unshift(data);
        return true;
      } catch (err: any) {
        this.error = err.message || 'An error occurred creating expense.';
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
