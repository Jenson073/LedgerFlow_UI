<template>
  <NuxtPage />
</template>

<script setup lang="ts">
// Main root file mapping routes
</script>
<!--
Nuxt File-Based Routing Overview

1. pages/
   - Creates frontend page routes automatically.
   - Example:
     pages/index.vue            -> /
     pages/dashboard.vue        -> /dashboard
     pages/auth/callback.vue    -> /auth/callback

2. server/api/
   - Creates backend API endpoints with an "/api" prefix.
   - Example:
     server/api/auth/login.get.ts   -> GET /api/auth/login
     server/api/auth/me.get.ts      -> GET /api/auth/me

3. server/routes/
   - Creates server routes without the "/api" prefix.
   - Useful for callbacks, webhooks, robots.txt, etc.
   - Example:
     server/routes/auth/callback.get.ts -> GET /auth/callback

Nuxt automatically scans these folders during startup and generates the corresponding routes based on the folder and file structure.
-->