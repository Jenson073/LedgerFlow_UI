<template>
  <div class="relative min-h-screen w-full flex items-center justify-center p-6 overflow-y-auto">
    <!-- Glowing background elements -->
    <div class="glowing-mesh" aria-hidden="true">
      <div class="mesh-shape mesh-1"></div>
      <div class="mesh-shape mesh-2"></div>
    </div>

    <!-- Page wrapper -->
    <main class="flex items-center justify-center w-full z-10 animate-fade-in">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
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
