import { storage } from '~/shared/utils/storage';
import type { Invoice, CreateInvoiceInput, InvoiceStatus } from '../types/invoice';

const INVOICES_KEY = 'accounting_invoices';

const getInitialInvoices = (): Invoice[] => {
  return [
    {
      id: 'inv_1',
      invoiceNumber: 'INV-2026-001',
      clientName: 'Acme Corporation',
      amount: 4500.00,
      issueDate: '2026-05-10',
      dueDate: '2026-06-10',
      status: 'Paid',
      notes: 'Consulting services for Q2 core strategy.',
    },
    {
      id: 'inv_2',
      invoiceNumber: 'INV-2026-002',
      clientName: 'Globex Industries',
      amount: 8750.50,
      issueDate: '2026-05-20',
      dueDate: '2026-06-20',
      status: 'Pending',
      notes: 'Custom integration software delivery.',
    },
    {
      id: 'inv_3',
      invoiceNumber: 'INV-2026-003',
      clientName: 'Initech Software',
      amount: 2300.00,
      issueDate: '2026-04-15',
      dueDate: '2026-05-15',
      status: 'Overdue',
      notes: 'Monthly database administration maintenance fee.',
    },
    {
      id: 'inv_4',
      invoiceNumber: 'INV-2026-004',
      clientName: 'Umbrella Corp',
      amount: 12500.00,
      issueDate: '2026-06-01',
      dueDate: '2026-07-01',
      status: 'Pending',
      notes: 'Bio-tech analysis consultation.',
    },
    {
      id: 'inv_5',
      invoiceNumber: 'INV-2026-005',
      clientName: 'Hooli Inc.',
      amount: 3200.00,
      issueDate: '2026-05-05',
      dueDate: '2026-06-05',
      status: 'Paid',
      notes: 'Server bandwidth setup commission.',
    }
  ];
};

export const invoiceService = {
  async getInvoices(): Promise<Invoice[]> {
    const invoices = storage.get<Invoice[]>(INVOICES_KEY, []);
    if (invoices.length === 0) {
      const initial = getInitialInvoices();
      storage.set<Invoice[]>(INVOICES_KEY, initial);
      return initial;
    }
    return invoices;
  },

  async addInvoice(input: CreateInvoiceInput): Promise<Invoice> {
    const invoices = storage.get<Invoice[]>(INVOICES_KEY, []);
    
    const newInvoice: Invoice = {
      id: `inv_${Math.random().toString(36).substring(2, 9)}`,
      invoiceNumber: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: input.clientName,
      amount: Number(input.amount),
      issueDate: input.issueDate,
      dueDate: input.dueDate,
      status: input.status,
      notes: input.notes,
    };

    invoices.unshift(newInvoice);
    storage.set<Invoice[]>(INVOICES_KEY, invoices);
    return newInvoice;
  },

  async updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    const invoices = storage.get<Invoice[]>(INVOICES_KEY, []);
    const index = invoices.findIndex((inv) => inv.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }
    invoices[index].status = status;
    storage.set<Invoice[]>(INVOICES_KEY, invoices);
    return invoices[index];
  }
};
