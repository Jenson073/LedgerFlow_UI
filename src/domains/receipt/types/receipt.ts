export interface Receipt {
  id: string;
  receiptNumber: string;
  merchantName: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export interface CreateReceiptInput {
  merchantName: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}
