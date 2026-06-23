<template>
  <Transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="onOverlayClick">
      <Transition name="scale" appear>
        <div
          class="modal-container"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <!-- Header -->
          <div class="modal-header">
            <h3 :id="titleId" class="modal-title">{{ title }}</h3>
            <button
              type="button"
              class="close-button"
              aria-label="Close modal"
              @click="close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';

interface Props {
  show: boolean;
  title: string;
  closeOnOverlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  closeOnOverlay: true,
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const titleId = `modal-title-${Math.random().toString(36).substring(2, 9)}`;

const close = () => {
  emit('close');
};

const onOverlayClick = () => {
  if (props.closeOnOverlay) {
    close();
  }
};

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    close();
  }
};

// Lock body scroll when modal is active
watch(
  () => props.show,
  (isShowing) => {
    if (process.client) {
      if (isShowing) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }
);

onMounted(() => {
  if (process.client) {
    window.addEventListener('keydown', handleEscape);
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('keydown', handleEscape);
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 32rem;
  display: flex;
  flex-direction: column;
  background: var(--surface-bg-modal, rgba(30, 41, 59, 0.7));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-lg, 12px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3),
              0 8px 10px -6px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(24px) saturate(180%);
  animation: modalEnter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
}

.modal-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-text-base);
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.06);
  color: var(--color-text-base);
}

.close-button svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-scrollbar-thumb, rgba(255, 255, 255, 0.15)) transparent;
}

/* Modal Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
