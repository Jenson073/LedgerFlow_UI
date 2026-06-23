export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  notes?: string;
}

export interface CreateInvoiceInput {
  clientName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  notes?: string;
}
