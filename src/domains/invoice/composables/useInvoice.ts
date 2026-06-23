import { storeToRefs } from 'pinia';
import { useInvoiceStore } from '../store/invoiceStore';

export const useInvoice = () => {
  const store = useInvoiceStore();
  const { invoices, loading, error, initialized, totalRevenue, totalDues } = storeToRefs(store);

  return {
    // State
    invoices,
    loading,
    error,
    initialized,
    totalRevenue,
    totalDues,

    // Actions
    fetchInvoices: store.fetchInvoices,
    createInvoice: store.createInvoice,
    updateStatus: store.updateStatus,
  };
};
