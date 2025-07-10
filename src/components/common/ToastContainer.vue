<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'max-w-sm w-full border rounded-md pointer-events-auto overflow-hidden bg-white',
          toastBorderClasses[toast.type]
        ]"
      >
        <div class="flex items-center p-4 space-x-3">
          <component :is="toastIcons[toast.type]" class="h-6 w-6 text-blue-500" />
          <p class="text-sm text-gray-800 flex-1">
            {{ toast.message }}
          </p>
          <button
            @click="removeToast(toast.id)"
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '@/stores/toast'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const toastStore = useToastStore()
const toasts = computed(() => toastStore.toasts)

const toastBorderClasses = {
  success: 'border-blue-500',
  error: 'border-blue-500',
  warning: 'border-blue-500',
  info: 'border-blue-500'
}

const toastIcons = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon
}

const removeToast = (id) => {
  toastStore.removeToast(id)
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(50%);
}
</style>
