export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netCashflow: number;
  outstandingDues: number;
  bankBalance: number;
  averageIncome: number;
  averageExpense: number;
  monthlyTrends: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
}
