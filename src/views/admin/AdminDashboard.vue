<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-600">System overview and management tools</p>
      </div>


      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- System Overview -->

        <!-- Quick Actions & System Status -->
        <div class="lg:col-span-1 space-y-6">     

          <!-- System Status -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">System Status</h3>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">WebSocket Status</span>
                <div class="flex items-center">
                  <div :class="[
                    'w-2 h-2 rounded-full mr-2',
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  ]"></div>
                  <span :class="[
                    'text-xs font-medium',
                    isConnected ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ isConnected ? 'Connected' : 'Disconnected' }}
                  </span>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Database</span>
                <span class="text-xs font-medium text-green-600">Connected</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">MT5 Connection</span>
                <span class="text-xs font-medium text-green-600">Active</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Last Update</span>
                <span class="text-xs text-gray-500">{{ formatTime(new Date()) }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Admins Online</span>
                <span class="text-xs font-medium text-blue-600">{{ dashboardData?.users?.admins || 0 }}</span>
              </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                @click="$router.push('/admin/users')"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
              >
                <UserIcon class="w-5 h-5 mr-2" />
                Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create User Modal -->
    <CreateUserModal
      v-if="showCreateUserModal"
      @close="showCreateUserModal = false"
      @created="handleUserCreated"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useWebSocketStore } from '@/stores/websocket'
import { useToastStore } from '@/stores/toast'
import { adminAPI, systemAPI, handleApiError } from '@/services/api'
import StatCard from '@/components/common/StatCard.vue'
import CreateUserModal from '@/views/admin/CreateUserModal.vue'

import {
  UserGroupIcon,
  UserIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  PlusIcon,
  ShieldCheckIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'

const wsStore = useWebSocketStore()
const toastStore = useToastStore()

const systemStatus = ref(null)
const isLoading = ref(false)
const showCreateUserModal = ref(false)
const startTime = ref(new Date())
const dashboardData = ref({})

const isConnected = computed(() => wsStore.isConnected)
const isSystemHealthy = computed(() => {
  return isConnected.value && systemStatus.value?.database === 'connected'
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  })
}

const calculateAccountRatio = () => {
  const demo = dashboardData.value?.users?.demo_accounts || 0
  const live = dashboardData.value?.users?.live_accounts || 0
  const total = demo + live
  if (total === 0) return '0% Demo / 0% Live'
  const demoPercent = ((demo / total) * 100).toFixed(0)
  const livePercent = ((live / total) * 100).toFixed(0)
  return `${demoPercent}% Demo / ${livePercent}% Live`
}

const calculateTradeRatio = () => {
  const real = dashboardData.value?.trades?.real || 0
  const demo = dashboardData.value?.trades?.demo || 0
  const total = real + demo
  if (total === 0) return '0% / 0%'
  const realPercent = ((real / total) * 100).toFixed(0)
  const demoPercent = ((demo / total) * 100).toFixed(0)
  return `${realPercent}% Live / ${demoPercent}% Demo`
}

const getAccountPercentage = (type) => {
  const demo = dashboardData.value?.users?.demo_accounts || 0
  const live = dashboardData.value?.users?.live_accounts || 0
  const total = demo + live
  
  if (total === 0) return 0
  
  if (type === 'demo') {
    return Math.round((demo / total) * 100)
  } else {
    return Math.round((live / total) * 100)
  }
}

const calculateUptime = () => {
  const now = new Date()
  const diff = Math.floor((now.getTime() - startTime.value.getTime()) / 1000)
  
  const hours = Math.floor(diff / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

const refreshDashboard = async () => {
  isLoading.value = true
  try {
    const [dashboard, health] = await Promise.all([
      adminAPI.getDashboard(),
      systemAPI.getHealth().catch(() => null)
    ])
    
    dashboardData.value = dashboard
    systemStatus.value = health
    
    toastStore.success('Dashboard data refreshed')
  } catch (error) {
    console.error('Dashboard refresh error:', error)
    toastStore.error(handleApiError(error))
  } finally {
    isLoading.value = false
  }
}

const handleUserCreated = (user) => {
  showCreateUserModal.value = false
  toastStore.success(`User ${user.username} created successfully`)
  refreshDashboard()
}


onMounted(async () => {
  await refreshDashboard()
  
  // Set up periodic refresh every 30 seconds
  const interval = setInterval(refreshDashboard, 30000)
  
  // Cleanup on unmount
  onBeforeUnmount(() => {
    clearInterval(interval)
  })
})
</script>