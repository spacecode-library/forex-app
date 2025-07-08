<template>
  <div id="app" class="min-h-screen">
    <!-- Navigation -->
    <Navbar v-if="!isAuthPage" />
    
    <!-- Main Content -->
    <main :class="{ 'pt-0': !isAuthPage }">
      <router-view />
    </main>
    
    <!-- Global Loading Overlay -->
    <LoadingOverlay v-if="isLoading" />
    
    <!-- Toast Notifications -->
    <!-- <ToastContainer /> -->
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWebSocketStore } from '@/stores/websocket'
import { useUIStore } from '@/stores/ui'
import Navbar from '@/components/common/Navbar.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

const route = useRoute()
const authStore = useAuthStore()
const wsStore = useWebSocketStore()
const uiStore = useUIStore()

const isAuthPage = computed(() => 
  route.path === '/login' || route.path === '/register'
)

const isLoading = computed(() => uiStore.isLoading)

onMounted(async () => {
  // Initialize authentication state
  await authStore.initializeAuth()
  
  // Connect WebSocket if authenticated
  if (authStore.isAuthenticated) {
    wsStore.connect()
  }
})
</script>

<style>
@import 'tailwindcss';

* {
  box-sizing: border-box;
}

#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Trading specific styles */
.buy-color {
  @apply text-green-600 bg-green-50;
}

.sell-color {
  @apply text-red-600 bg-red-50;
}

.profit-positive {
  @apply text-green-600;
}

.profit-negative {
  @apply text-red-600;
}

/* Chart container */
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}

/* Animation utilities */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>