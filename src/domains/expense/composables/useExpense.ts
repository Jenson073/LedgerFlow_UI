import { storeToRefs } from 'pinia';
import { useExpenseStore } from '../store/expenseStore';

export const useExpense = () => {
  const store = useExpenseStore();
  const { expenses, loading, error, initialized, totalExpensesAmount } = storeToRefs(store);

  return {
    // State
    expenses,
    loading,
    error,
    initialized,
    totalExpensesAmount,

    // Actions
    fetchExpenses: store.fetchExpenses,
    createExpense: store.createExpense,
  };
};
