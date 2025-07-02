<template>
  <div class="fixed top-4 right-50 z-50 space-y-2">
    <transition-group
      name="toast"
      tag="div"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden',
          toastClasses[toast.type]
        ]"
      >
        <div class="p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <component :is="toastIcons[toast.type]" class="h-5 w-64" />
            </div>
            <div class="">
              <p class="text-sm font-medium">
                {{ toast.message }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="removeToast(toast.id)"
                class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <XMarkIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
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

const toastClasses = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-500 text-white'
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
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>