<template>
  <div class="auth-layout">
    <!-- Glowing background elements -->
    <div class="glowing-mesh" aria-hidden="true">
      <div class="mesh-shape mesh-1"></div>
      <div class="mesh-shape mesh-2"></div>
    </div>

    <!-- Page wrapper -->
    <main class="auth-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
}

.auth-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 10;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
