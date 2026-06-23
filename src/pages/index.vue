<template>
  <NuxtLayout name="auth">
    <LoginPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import LoginPage from '~/domains/auth/pages/LoginPage.vue';

// Page Metadata
definePageMeta({
  layout: false,
});
</script>
