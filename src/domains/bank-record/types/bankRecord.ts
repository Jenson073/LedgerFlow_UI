export interface BankRecord {
  id: string;
  transactionId: string;
  date: string;
  description: string;
  amount: number; // Positive = deposit/credit, Negative = withdrawal/debit
  balance: number;
  notes?: string;
}

export interface CreateBankRecordInput {
  date: string;
  description: string;
  amount: number;
  notes?: string;
}
