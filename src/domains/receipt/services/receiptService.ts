import { storage } from '~/shared/utils/storage';
import type { Receipt, CreateReceiptInput } from '../types/receipt';

const RECEIPTS_KEY = 'accounting_receipts';

const getInitialReceipts = (): Receipt[] => {
  return [
    {
      id: 'rec_1',
      receiptNumber: 'REC-2026-001',
      merchantName: 'Amazon Web Services',
      amount: 412.50,
      category: 'Hosting & Infrastructure',
      date: '2026-06-02',
      notes: 'Monthly server hosting and cloud storage bill.',
    },
    {
      id: 'rec_2',
      receiptNumber: 'REC-2026-002',
      merchantName: 'Office Depot',
      amount: 189.90,
      category: 'Office Supplies',
      date: '2026-05-28',
      notes: 'Printer ink, paper packages, and file folders.',
    },
    {
      id: 'rec_3',
      receiptNumber: 'REC-2026-003',
      merchantName: 'Starbucks Coffee',
      amount: 32.40,
      category: 'Meals & Entertainment',
      date: '2026-06-15',
      notes: 'Client meeting discussion coffee.',
    },
    {
      id: 'rec_4',
      receiptNumber: 'REC-2026-004',
      merchantName: 'Delta Air Lines',
      amount: 650.00,
      category: 'Travel & Lodging',
      date: '2026-05-12',
      notes: 'Roundtrip flight ticket for accounting summit.',
    }
  ];
};

export const receiptService = {
  async getReceipts(): Promise<Receipt[]> {
    const receipts = storage.get<Receipt[]>(RECEIPTS_KEY, []);
    if (receipts.length === 0) {
      const initial = getInitialReceipts();
      storage.set<Receipt[]>(RECEIPTS_KEY, initial);
      return initial;
    }
    return receipts;
  },

  async addReceipt(input: CreateReceiptInput): Promise<Receipt> {
    const receipts = storage.get<Receipt[]>(RECEIPTS_KEY, []);
    
    const newReceipt: Receipt = {
      id: `rec_${Math.random().toString(36).substring(2, 9)}`,
      receiptNumber: `REC-2026-${String(receipts.length + 1).padStart(3, '0')}`,
      merchantName: input.merchantName,
      amount: Number(input.amount),
      category: input.category,
      date: input.date,
      notes: input.notes,
    };

    receipts.unshift(newReceipt);
    storage.set<Receipt[]>(RECEIPTS_KEY, receipts);
    return newReceipt;
  }
};
