import { storeToRefs } from 'pinia';
import { useBankRecordStore } from '../store/bankRecordStore';

export const useBankRecord = () => {
  const store = useBankRecordStore();
  const { bankRecords, loading, error, initialized, currentBankBalance } = storeToRefs(store);

  return {
    // State
    bankRecords,
    loading,
    error,
    initialized,
    currentBankBalance,

    // Actions
    fetchBankRecords: store.fetchBankRecords,
    createBankRecord: store.createBankRecord,
  };
};
