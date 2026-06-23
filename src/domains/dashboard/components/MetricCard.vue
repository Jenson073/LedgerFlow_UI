<template>
  <div :class="['metric-card', `card-accent-${accent}`]">
    <div class="card-body">
      <div class="card-info">
        <p class="metric-title">{{ title }}</p>
        <h3 class="metric-value">{{ value }}</h3>
        <p v-if="subtitle" class="metric-subtitle">{{ subtitle }}</p>
      </div>
      <div class="card-icon-container" aria-hidden="true">
        <slot name="icon"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  value: string;
  subtitle?: string;
  accent?: 'primary' | 'success' | 'danger' | 'warning' | 'violet';
}

withDefaults(defineProps<Props>(), {
  accent: 'primary',
});
</script>

<style scoped>
.metric-card {
  position: relative;
  background: var(--surface-bg-card, rgba(30, 41, 59, 0.45));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-md, 12px);
  padding: 1.25rem 1.5rem;
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border-color: var(--border-hover-color, rgba(255, 255, 255, 0.15));
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
}

.metric-title {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-value {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text-base);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.metric-subtitle {
  margin: 0;
  font-size: 0.775rem;
  color: var(--color-text-muted);
}

.card-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-md, 8px);
  color: var(--icon-color, #94a3b8);
  background: var(--icon-bg, rgba(255, 255, 255, 0.04));
  transition: all 0.25s;
}

.metric-card:hover .card-icon-container {
  transform: scale(1.05);
}

/* Card Accents */
.card-accent-primary {
  border-left: 3px solid var(--color-accent);
  --icon-color: var(--color-accent);
  --icon-bg: rgba(139, 92, 246, 0.12);
}

.card-accent-success {
  border-left: 3px solid #10b981;
  --icon-color: #34d399;
  --icon-bg: rgba(16, 185, 129, 0.12);
}

.card-accent-danger {
  border-left: 3px solid #ef4444;
  --icon-color: #f87171;
  --icon-bg: rgba(239, 68, 68, 0.12);
}

.card-accent-warning {
  border-left: 3px solid #f59e0b;
  --icon-color: #fbbf24;
  --icon-bg: rgba(245, 158, 11, 0.12);
}

.card-accent-violet {
  border-left: 3px solid #a855f7;
  --icon-color: #c084fc;
  --icon-bg: rgba(168, 85, 247, 0.12);
}
</style>
