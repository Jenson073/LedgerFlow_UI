<template>
  <div class="flex min-h-screen w-full">
    <!-- Glowing background elements -->
    <div class="glowing-mesh" aria-hidden="true">
      <div class="mesh-shape mesh-1"></div>
      <div class="mesh-shape mesh-2"></div>
    </div>

    <!-- Mobile Header -->
    <div class="flex items-center gap-4 fixed top-0 inset-x-0 h-14 bg-bg-card/45 backdrop-blur-md border-b border-border px-4 z-[100] md:hidden">
      <button
        type="button"
        class="bg-transparent border-none text-text-base cursor-pointer p-1 flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        aria-label="Toggle Navigation Menu"
        @click="toggleSidebar"
      >
        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <div class="text-[1.15rem] font-bold tracking-tight text-text-base">LedgerFlow</div>
    </div>

    <!-- Sidebar Navigation -->
    <aside :class="['fixed inset-y-0 left-0 w-64 bg-bg-card/55 border-r border-border backdrop-blur-lg saturate-[180%] flex flex-col px-5 py-7 z-[200] transition-transform duration-300 ease-in-out md:translate-x-0', isSidebarOpen ? 'translate-x-0' : '-translate-x-full']">
      <!-- Sidebar Close (Mobile only) -->
      <button
        type="button"
        class="absolute top-4 right-4 bg-transparent border-none text-text-muted cursor-pointer p-1 flex items-center md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        aria-label="Close menu"
        @click="closeSidebar"
      >
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Brand -->
      <div class="flex items-center gap-3 mb-9 ps-1">
        <span class="flex items-center justify-center w-8 h-8 rounded-sm bg-gradient-to-br from-accent to-accent-alt text-bg-canvas" aria-hidden="true">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 20v-6.75Z" />
          </svg>
        </span>
        <span class="text-xl font-bold tracking-tight text-text-base">LedgerFlow</span>
      </div>

      <!-- Navigation Links -->
      <nav class="flex flex-col gap-1.5 flex-grow" aria-label="Main Navigation">
        <div class="text-[0.725rem] font-semibold text-text-muted uppercase tracking-wider mb-2 ps-2">Workspace</div>
        <a href="#/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-md text-[0.9rem] font-medium bg-accent-subtle text-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-[1.15rem] h-[1.15rem]">
            <path fill-rule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1-1.414 1.414L11 5.414V17a1 1 0 1 1-2 0V5.414L3.707 10.707a1 1 0 0 1-1.414-1.414l7-7Z" clip-rule="evenodd" />
          </svg>
          Account Dashboard
        </a>
      </nav>

      <!-- Active User Card / Logout -->
      <div class="mt-auto flex flex-col gap-4 pt-6 border-t border-border">
        <div class="flex items-center gap-3 p-1">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent-alt text-bg-canvas flex items-center justify-center text-[0.85rem] font-bold">
            {{ userInitials }}
          </div>
          <div class="flex flex-col text-left">
            <p class="m-0 text-[0.85rem] font-semibold text-text-base">{{ user?.name || 'Accountant' }}</p>
            <p class="m-0 text-[0.75rem] text-text-muted">{{ user?.role || 'Staff Ledger' }}</p>
          </div>
        </div>
        <button
          type="button"
          class="flex items-center justify-center gap-2 w-full p-2 font-medium text-[0.85rem] text-text-muted bg-danger/5 border border-danger/10 rounded-md cursor-pointer transition-all duration-200 hover:bg-danger/10 hover:text-red-400 hover:border-danger/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loading"
          @click="onLogout"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" aria-hidden="true"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-[1.15rem] h-[1.15rem]">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Content Panel -->
    <div class="flex-grow flex flex-col min-h-screen">
      <!-- Backdrop Overlay (for Mobile Sidebar open) -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-slate-950/50 backdrop-blur-[4px] z-[150] md:hidden"
        @click="closeSidebar"
      ></div>

      <main class="p-6 w-full mt-14 md:mt-0 md:ps-64 md:p-9">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from '#app';
import { useAuth } from '~/domains/auth/composables/useAuth';

const router = useRouter();
const { user, logout, loading } = useAuth();
const isSidebarOpen = ref(false);

const userInitials = computed(() => {
  if (!user.value || !user.value.name) return 'AC';
  const parts = user.value.name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return user.value.name.substring(0, 2).toUpperCase();
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const onLogout = async () => {
  const success = await logout();
  if (success) {
    router.push('/');
  }
};
</script>

