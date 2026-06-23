import { storeToRefs } from 'pinia';
import { useDashboardStore } from '../store/dashboardStore';

export const useDashboard = () => {
  const store = useDashboardStore();
  const { loading } = storeToRefs(store);

  return {
    loading,
    stats: computed(() => store.stats),
    fetchAllData: store.fetchAllData,
  };
};
