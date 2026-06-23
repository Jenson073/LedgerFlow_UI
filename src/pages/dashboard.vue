<template>
  <NuxtLayout name="default">
    <DashboardPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import DashboardPage from '~/domains/dashboard/pages/DashboardPage.vue';

// Page Metadata
definePageMeta({
  layout: false,
});
</script>
