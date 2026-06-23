import { storage } from '~/shared/utils/storage';
import type { BankRecord, CreateBankRecordInput } from '../types/bankRecord';

const BANK_RECORDS_KEY = 'accounting_bank_records';

const getInitialBankRecords = (): BankRecord[] => {
  return [
    {
      id: 'br_5',
      transactionId: 'TXN-984021',
      date: '2026-06-05',
      description: 'DEP: Hooli Inc. Invoice INV-2026-005',
      amount: 3200.00,
      balance: 28598.20,
      notes: 'Customer invoice deposit.',
    },
    {
      id: 'br_4',
      transactionId: 'TXN-983054',
      date: '2026-06-03',
      description: 'WD: Slack Technologies Inc.',
      amount: -156.00,
      balance: 25398.20,
      notes: 'Direct debit SaaS subscription.',
    },
    {
      id: 'br_3',
      transactionId: 'TXN-982109',
      date: '2026-06-01',
      description: 'WD: Office Building Lease Rent',
      amount: -3200.00,
      balance: 25554.20,
      notes: 'June lease payment transfer.',
    },
    {
      id: 'br_2',
      transactionId: 'TXN-981045',
      date: '2026-05-25',
      description: 'WD: Electricity Utility Grid bill',
      amount: -245.80,
      balance: 28754.20,
      notes: 'Direct debit electric utility.',
    },
    {
      id: 'br_1',
      transactionId: 'TXN-980012',
      date: '2026-05-15',
      description: 'DEP: Acme Corporation Invoice INV-2026-001',
      amount: 4500.00,
      balance: 29000.00,
      notes: 'Customer wire transfer invoice deposit.',
    }
  ];
};

export const bankRecordService = {
  async getBankRecords(): Promise<BankRecord[]> {
    const records = storage.get<BankRecord[]>(BANK_RECORDS_KEY, []);
    if (records.length === 0) {
      const initial = getInitialBankRecords();
      storage.set<BankRecord[]>(BANK_RECORDS_KEY, initial);
      return initial;
    }
    return records;
  },

  async addBankRecord(input: CreateBankRecordInput): Promise<BankRecord> {
    const records = storage.get<BankRecord[]>(BANK_RECORDS_KEY, []);
    
    const currentBalance = records.length > 0 ? records[0].balance : 24500.00;
    const amount = Number(input.amount);
    const newBalance = currentBalance + amount;

    const newRecord: BankRecord = {
      id: `br_${Math.random().toString(36).substring(2, 9)}`,
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: input.date,
      description: input.description,
      amount,
      balance: newBalance,
      notes: input.notes,
    };

    records.unshift(newRecord);
    storage.set<BankRecord[]>(BANK_RECORDS_KEY, records);
    return newRecord;
  }
};
