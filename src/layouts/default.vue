<template>
  <div class="default-layout">
    <!-- Glowing background elements -->
    <div class="glowing-mesh" aria-hidden="true">
      <div class="mesh-shape mesh-1"></div>
      <div class="mesh-shape mesh-2"></div>
    </div>

    <!-- Mobile Menu Button -->
    <div class="mobile-header">
      <button
        type="button"
        class="mobile-menu-toggle"
        aria-label="Toggle Navigation Menu"
        @click="toggleSidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <div class="mobile-brand">LedgerFlow</div>
    </div>

    <!-- Sidebar Navigation -->
    <aside :class="['sidebar-nav', { 'sidebar-open': isSidebarOpen }]">
      <!-- Sidebar Close (Mobile only) -->
      <button
        type="button"
        class="mobile-close-btn"
        aria-label="Close menu"
        @click="closeSidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Brand -->
      <div class="sidebar-brand-wrapper">
        <span class="brand-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 20v-6.75Z" />
          </svg>
        </span>
        <span class="brand-text">LedgerFlow</span>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-menu" aria-label="Main Navigation">
        <div class="menu-label">Workspace</div>
        <a href="#/dashboard" class="menu-link active-link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="menu-icon">
            <path fill-rule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7a1 1 0 0 1-1.414 1.414L11 5.414V17a1 1 0 1 1-2 0V5.414L3.707 10.707a1 1 0 0 1-1.414-1.414l7-7Z" clip-rule="evenodd" />
          </svg>
          Account Dashboard
        </a>
      </nav>

      <!-- Active User Card / Logout -->
      <div class="sidebar-footer">
        <div class="user-profile-widget">
          <div class="avatar-circle">
            {{ userInitials }}
          </div>
          <div class="user-meta-info">
            <p class="user-display-name">{{ user?.name || 'Accountant' }}</p>
            <p class="user-display-role">{{ user?.role || 'Staff Ledger' }}</p>
          </div>
        </div>
        <button
          type="button"
          class="logout-action-btn"
          :disabled="loading"
          @click="onLogout"
        >
          <span v-if="loading" class="spinner-small" aria-hidden="true"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="logout-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Content Panel -->
    <div class="content-panel">
      <!-- Backdrop Overlay (for Mobile Sidebar open) -->
      <div
        v-if="isSidebarOpen"
        class="sidebar-backdrop"
        @click="closeSidebar"
      ></div>

      <main class="page-container">
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

<style scoped>
.default-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Mobile Header */
.mobile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: fixed;
  top: 0;
  inset-inline: 0;
  height: 3.5rem;
  background: var(--surface-bg-card, rgba(30, 41, 59, 0.45));
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  padding-inline: 1rem;
  z-index: 100;
}

.mobile-menu-toggle {
  background: none;
  border: none;
  color: var(--color-text-base);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
}

.mobile-menu-toggle svg {
  width: 1.5rem;
  height: 1.5rem;
}

.mobile-brand {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

@media (min-width: 768px) {
  .mobile-header {
    display: none;
  }
}

/* Sidebar Styling */
.sidebar-nav {
  position: fixed;
  inset-y: 0;
  left: 0;
  width: 16rem;
  background: var(--surface-bg-card, rgba(15, 23, 42, 0.55));
  border-right: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(24px) saturate(180%);
  display: flex;
  flex-direction: column;
  padding: 1.75rem 1.25rem;
  z-index: 200;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-open {
  transform: translateX(0);
}

@media (min-width: 768px) {
  .sidebar-nav {
    transform: translateX(0);
  }
}

.mobile-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
}

.mobile-close-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

@media (min-width: 768px) {
  .mobile-close-btn {
    display: none;
  }
}

.sidebar-brand-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2.25rem;
  padding-inline-start: 0.25rem;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-sm, 6px);
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-alt));
  color: var(--color-bg-base);
}

.brand-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex-grow: 1;
}

.menu-label {
  font-size: 0.725rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  padding-inline-start: 0.5rem;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: all 0.2s;
}

.menu-link:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text-base);
}

.active-link {
  background: var(--color-accent-subtle, rgba(139, 92, 246, 0.08));
  color: var(--color-accent) !important;
  font-weight: 600;
}

.menu-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
}

.user-profile-widget {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem;
}

.avatar-circle {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-alt));
  color: var(--color-bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
}

.user-meta-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.user-display-name {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-base);
}

.user-display-role {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.logout-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-muted);
  background: rgba(239, 68, 68, 0.03);
  border: 1px solid rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  transition: all 0.2s;
}

.logout-action-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.2);
}

.logout-icon {
  width: 1.15rem;
  height: 1.15rem;
}

.spinner-small {
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Content Panel */
.content-panel {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 150;
}

@media (min-width: 768px) {
  .sidebar-backdrop {
    display: none;
  }
}

.page-container {
  padding: 1.5rem;
  width: 100%;
  margin-top: 3.5rem; /* Space for mobile header */
}

@media (min-width: 768px) {
  .page-container {
    padding: 2.25rem;
    margin-inline-start: 16rem; /* Space for sidebar */
    margin-top: 0;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
