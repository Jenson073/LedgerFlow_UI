<template>
  <div class="flex flex-col gap-5 w-full">
    <!-- Controls Bar -->
    <div class="flex justify-between items-center gap-4 flex-wrap">
      <div class="flex items-center gap-3 flex-wrap">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search expenses..."
          class="px-3.5 py-2 text-sm text-text-base bg-bg-input border border-border rounded-md outline-none transition-all duration-200 w-60 focus:border-accent focus:bg-bg-input-focus focus:shadow-[0_0_0_3px_var(--color-accent-subtle)]"
        />
        <div class="relative flex items-center">
          <select v-model="categoryFilter" class="pl-3.5 pr-8 py-2 text-sm text-text-base bg-bg-input border border-border rounded-md outline-none cursor-pointer transition-all duration-200 appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.25rem] focus:border-accent focus:bg-bg-input-focus focus:shadow-[0_0_0_3px_var(--color-accent-subtle)] bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%2394a3b8%22%3E%3Cpath fill-rule=%22evenodd%22 d=%22M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z%22 clip-rule=%22evenodd%22/%3E%3C/svg%3E')]">
            <option value="All" class="bg-slate-800 text-slate-100">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat" class="bg-slate-800 text-slate-100">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>
      <AppButton variant="primary" @click="$emit('open-create-modal')">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-[1.15rem] h-[1.15rem]">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
        </template>
        New Expense
      </AppButton>
    </div>

    <!-- Table Container -->
    <div class="relative w-full overflow-x-auto rounded-md bg-white/[0.01] border border-border">
      <div v-if="loading" class="absolute inset-0 bg-slate-950/65 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
        <span class="w-8 h-8 border-3 border-accent border-r-transparent rounded-full animate-spin"></span>
        <p class="text-sm font-medium text-text-base">Updating expense logs...</p>
      </div>

      <table class="w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            <th class="px-4 py-3.5 font-semibold text-text-muted border-b border-border bg-white/[0.02]">Date</th>
            <th class="px-4 py-3.5 font-semibold text-text-muted border-b border-border bg-white/[0.02]">Description</th>
            <th class="px-4 py-3.5 font-semibold text-text-muted border-b border-border bg-white/[0.02]">Category</th>
            <th class="px-4 py-3.5 font-semibold text-text-muted border-b border-border bg-white/[0.02]">Payment Method</th>
            <th class="px-4 py-3.5 font-semibold text-text-muted border-b border-border bg-white/[0.02]">Amount</th>
            <th class="px-4 py-3.5 font-semibold text-text-muted border-b border-border bg-white/[0.02]">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredExpenses.length === 0">
            <td colspan="6" class="text-center p-12 text-text-muted">No expenses found.</td>
          </tr>
          <tr v-for="expense in filteredExpenses" :key="expense.id" class="hover:bg-white/[0.01] transition-colors">
            <td class="p-4 border-b border-white/[0.04] text-text-base font-semibold">{{ formatDate(expense.date) }}</td>
            <td class="p-4 border-b border-white/[0.04] text-text-base">{{ expense.description }}</td>
            <td class="p-4 border-b border-white/[0.04] text-text-base">
              <span class="inline-flex px-2 py-0.5 rounded-sm bg-danger-subtle text-danger text-[0.775rem] font-medium border border-danger/15">{{ expense.category }}</span>
            </td>
            <td class="p-4 border-b border-white/[0.04] text-text-base">{{ expense.paymentMethod }}</td>
            <td class="p-4 border-b border-white/[0.04] text-danger font-semibold tabular-nums">{{ formatCurrency(expense.amount) }}</td>
            <td class="p-4 border-b border-white/[0.04] text-text-muted max-w-[15rem] truncate" :title="expense.notes">{{ expense.notes || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatCurrency, formatDate } from '~/shared/utils/formatters';
import AppButton from '~/shared/components/AppButton.vue';
import { useExpense } from '../composables/useExpense';

defineEmits<{
  (e: 'open-create-modal'): void;
}>();

const { expenses, loading } = useExpense();

const searchQuery = ref('');
const categoryFilter = ref('All');

const categories = computed(() => {
  const allCats = expenses.value.map((e) => e.category);
  return Array.from(new Set(allCats));
});

const filteredExpenses = computed(() => {
  return expenses.value.filter((exp) => {
    const matchesSearch = exp.description
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    const matchesCategory =
      categoryFilter.value === 'All' || exp.category === categoryFilter.value;

    return matchesSearch && matchesCategory;
  });
});
</script>

