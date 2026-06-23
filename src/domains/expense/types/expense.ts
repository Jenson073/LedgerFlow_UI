export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string;
  notes?: string;
}

export interface CreateExpenseInput {
  description: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string;
  notes?: string;
}
