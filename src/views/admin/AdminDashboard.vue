<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-600">System overview and management tools</p>
      </div>

      <!-- System Status Banner -->
      <div v-if="systemStatus" class="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div :class="[
              'w-3 h-3 rounded-full mr-3',
              isSystemHealthy ? 'bg-green-500' : 'bg-red-500'
            ]"></div>
            <span class="text-sm font-medium">
              System Status: {{ isSystemHealthy ? 'Operational' : 'Issues Detected' }}
            </span>
          </div>
          <div class="text-xs text-gray-500">
            Last updated: {{ formatTime(new Date()) }}
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          :value="String(dashboardData?.users?.total || 0)"
          icon="UserGroupIcon"
          color="blue"
        />
        <StatCard
          title="Active Users"
          :value="String(dashboardData?.users?.active || 0)"
          icon="UserIcon"
          color="green"
        />
        <StatCard
          title="Total Trades"
          :value="String(dashboardData?.trades?.total || 0)"
          icon="ChartBarIcon"
          color="purple"
        />
        <StatCard
          title="System P&L"
          :value="formatCurrency(dashboardData?.financials?.total_profit || 0)"
          :icon="(dashboardData?.financials?.total_profit || 0) >= 0 ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'"
          :color="(dashboardData?.financials?.total_profit || 0) >= 0 ? 'green' : 'red'"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- System Overview -->
        <div class="lg:col-span-2 space-y-8">
          <!-- User Distribution -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <UserGroupIcon class="w-5 h-5 mr-2 text-blue-600" />
                User Distribution
              </h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">
                    {{ dashboardData?.users?.total || 0 }}
                  </div>
                  <div class="text-sm text-gray-500">Total Users</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">
                    {{ dashboardData?.users?.active || 0 }}
                  </div>
                  <div class="text-sm text-gray-500">Active Users</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">
                    {{ dashboardData?.users?.demo_accounts || 0 }}
                  </div>
                  <div class="text-sm text-gray-500">Demo Accounts</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-orange-600">
                    {{ dashboardData?.users?.live_accounts || 0 }}
                  </div>
                  <div class="text-sm text-gray-500">Live Accounts</div>
                </div>
              </div>

              <!-- Account Type Chart -->
              <div class="mt-6">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm text-gray-600">Account Distribution</span>
                  <span class="text-xs text-gray-500">
                    {{ calculateAccountRatio() }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-purple-600 h-2 rounded-l-full"
                    :style="{ width: `${getAccountPercentage('demo')}%` }"
                  ></div>
                  <div 
                    class="bg-orange-600 h-2 rounded-r-full"
                    :style="{ width: `${getAccountPercentage('live')}%`, marginLeft: `${getAccountPercentage('demo')}%` }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Demo ({{ getAccountPercentage('demo') }}%)</span>
                  <span>Live ({{ getAccountPercentage('live') }}%)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Trading Activity -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <ChartBarIcon class="w-5 h-5 mr-2 text-green-600" />
                Trading Activity
              </h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">
                    {{ dashboardData?.trades?.total || 0 }}
                  </div>
                  <div class="text-sm text-gray-500">Total Trades</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">
                    {{ dashboardData?.trades?.real || 0 }}
                  </div>
                  <div class="text-sm text-gray-500">Live Trades</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">
                    {{ dashboardData?.trades?.demo || 0 }}
                  </div>
                  <div class="text-sm text-gray-500">Demo Trades</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-yellow-600">
                    {{ dashboardData?.trades?.open || 0 }}
                  </div>
                  <div class="text-sm text-gray-500">Open Positions</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Financial Overview -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <CurrencyDollarIcon class="w-5 h-5 mr-2 text-yellow-600" />
                Financial Overview
              </h3>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Total System P&L</span>
                  <span :class="[
                    'text-lg font-semibold',
                    (dashboardData?.financials?.total_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ formatCurrency(dashboardData?.financials?.total_profit || 0) }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Live Trading P&L</span>
                  <span :class="[
                    'font-semibold',
                    (dashboardData?.financials?.real_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ formatCurrency(dashboardData?.financials?.real_profit || 0) }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Demo Trading P&L</span>
                  <span :class="[
                    'font-semibold',
                    (dashboardData?.financials?.demo_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ formatCurrency(dashboardData?.financials?.demo_profit || 0) }}
                  </span>
                </div>
                <div class="flex justify-between items-center pt-2 border-t">
                  <span class="text-sm text-gray-600">Total User Balance</span>
                  <span class="font-semibold text-gray-900">
                    {{ formatCurrency(dashboardData?.financials?.total_user_balance || 0) }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Live/Demo Ratio</span>
                  <span class="font-medium text-gray-900">
                    {{ calculateTradeRatio() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions & System Status -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Quick Actions -->
          

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
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">System Info</h3>
            </div>
            <div class="p-6">
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Version</span>
                  <span class="font-medium">v1.0.0</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Environment</span>
                  <span class="font-medium">Production</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Uptime</span>
                  <span class="font-medium">{{ calculateUptime() }}</span>
                </div>
              </div>
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