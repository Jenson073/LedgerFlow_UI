import { storage } from '~/shared/utils/storage';
import type { Expense, CreateExpenseInput } from '../types/expense';

const EXPENSES_KEY = 'accounting_expenses';

const getInitialExpenses = (): Expense[] => {
  return [
    {
      id: 'exp_1',
      description: 'Office Building Monthly Rent',
      amount: 3200.00,
      category: 'Rent & Lease',
      date: '2026-06-01',
      paymentMethod: 'Bank Transfer',
      notes: 'HQ Office rent for June 2026.',
    },
    {
      id: 'exp_2',
      description: 'Slack Technologies Subscription',
      amount: 156.00,
      category: 'Software & Subscriptions',
      date: '2026-06-03',
      paymentMethod: 'Credit Card',
      notes: 'Slack Pro plan for 12 team members.',
    },
    {
      id: 'exp_3',
      description: 'Electricity & Gas Utilities',
      amount: 245.80,
      category: 'Utilities',
      date: '2026-05-25',
      paymentMethod: 'Direct Debit',
      notes: 'Power grid bill for May.',
    },
    {
      id: 'exp_4',
      description: 'Meta Advertising Campaign',
      amount: 1200.00,
      category: 'Marketing & Advertising',
      date: '2026-05-18',
      paymentMethod: 'Credit Card',
      notes: 'Facebook Ads for tax consultancy promo.',
    },
    {
      id: 'exp_5',
      description: 'CPA Software Suite Annual License',
      amount: 1800.00,
      category: 'Software & Subscriptions',
      date: '2026-05-02',
      paymentMethod: 'Bank Transfer',
      notes: 'TaxCalc & LedgerPro annual cloud license renewal.',
    }
  ];
};

export const expenseService = {
  async getExpenses(): Promise<Expense[]> {
    const expenses = storage.get<Expense[]>(EXPENSES_KEY, []);
    if (expenses.length === 0) {
      const initial = getInitialExpenses();
      storage.set<Expense[]>(EXPENSES_KEY, initial);
      return initial;
    }
    return expenses;
  },

  async addExpense(input: CreateExpenseInput): Promise<Expense> {
    const expenses = storage.get<Expense[]>(EXPENSES_KEY, []);
    
    const newExpense: Expense = {
      id: `exp_${Math.random().toString(36).substring(2, 9)}`,
      description: input.description,
      amount: Number(input.amount),
      category: input.category,
      date: input.date,
      paymentMethod: input.paymentMethod,
      notes: input.notes,
    };

    expenses.unshift(newExpense);
    storage.set<Expense[]>(EXPENSES_KEY, expenses);
    return newExpense;
  }
};
