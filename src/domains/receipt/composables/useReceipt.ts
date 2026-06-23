import { storeToRefs } from 'pinia';
import { useReceiptStore } from '../store/receiptStore';

export const useReceipt = () => {
  const store = useReceiptStore();
  const { receipts, loading, error, initialized, totalReceiptsAmount } = storeToRefs(store);

  return {
    // State
    receipts,
    loading,
    error,
    initialized,
    totalReceiptsAmount,

    // Actions
    fetchReceipts: store.fetchReceipts,
    createReceipt: store.createReceipt,
  };
};
