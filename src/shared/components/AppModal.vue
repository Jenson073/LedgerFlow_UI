<template>
  <Teleport to="body" :disabled="!isMounted">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm md:ps-64" @click.self="onOverlayClick">
        <Transition name="scale" appear>
          <div
            class="modal-container relative w-full max-w-lg flex flex-col bg-bg-modal border border-border rounded-lg shadow-2xl backdrop-blur-3xl saturate-[180%] overflow-hidden"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 :id="titleId" class="m-0 text-[1.15rem] font-semibold text-text-base">{{ title }}</h3>
              <button
                type="button"
                class="flex items-center justify-center w-7 h-7 p-0 text-text-muted bg-transparent border-none rounded-full cursor-pointer transition-colors duration-200 hover:bg-white/5 hover:text-text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                aria-label="Close modal"
                @click="close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6 max-h-[80vh] overflow-y-auto scrollbar-thin">
              <slot></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

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

const isMounted = ref(false);

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
  isMounted.value = true;
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
.modal-container {
  animation: modalEnter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalEnter {
  from {
    transform: scale(0.9) translateY(10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

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
