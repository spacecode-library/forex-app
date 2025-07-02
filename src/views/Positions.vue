<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Open Positions</h1>
        <p class="text-gray-600">Manage your active trading positions</p>
      </div>

      <!-- Advanced Debug Panel -->
      <PositionDebug v-if="showDebug" @close="showDebug = false" />

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ChartBarIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Open Positions</p>
              <p class="text-2xl font-semibold text-gray-900">{{ openPositions.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CurrencyDollarIcon :class="[
                'h-8 w-8',
                totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
              ]" />
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Unrealized P&L</p>
              <p :class="[
                'text-2xl font-semibold',
                totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ formatCurrency(totalUnrealizedPnL) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <BanknotesIcon class="h-8 w-8 text-purple-600" />
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Used Margin</p>
              <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(usedMargin) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ScaleIcon class="h-8 w-8 text-yellow-600" />
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Margin Level</p>
              <p class="text-2xl font-semibold text-gray-900">{{ marginLevel }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Positions Table -->
      <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Position Details</h2>
          <div class="flex items-center space-x-3">
            <!-- WebSocket Status Indicator -->
            <div class="flex items-center text-xs">
              <div :class="[
                'w-2 h-2 rounded-full mr-1',
                wsStore.isConnected ? 'bg-green-500' : 'bg-red-500'
              ]"></div>
              <span :class="[
                wsStore.isConnected ? 'text-green-600' : 'text-red-600'
              ]">
                {{ wsStore.isConnected ? 'Live' : 'Offline' }}
              </span>
            </div>
            
            <!-- Debug Toggle -->
            <button 
              @click="showDebug = !showDebug"
              class="text-xs text-gray-600 hover:text-gray-800"
            >
              Debug
            </button>
            
            <button
              @click="refreshPositions"
              :disabled="isLoading"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <ArrowPathIcon :class="['h-4 w-4 mr-2', { 'animate-spin': isLoading }]" />
              Refresh
            </button>
            <button
              v-if="openPositions.length > 0"
              @click="showCloseAllModal = true"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Close All
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Price
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pips
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P&L
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stop Loss
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Take Profit
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Open Time
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading && openPositions.length === 0">
                <td colspan="11" class="px-6 py-12 text-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p class="mt-2 text-gray-500">Loading positions...</p>
                </td>
              </tr>
              
              <tr v-else-if="openPositions.length === 0">
                <td colspan="11" class="px-6 py-12 text-center">
                  <div class="text-gray-500">
                    <ChartBarIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 class="text-sm font-medium">No open positions</h3>
                    <p class="text-sm mt-1">Start trading to see your positions here.</p>
                    <router-link
                      to="/trading"
                      class="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Start Trading
                    </router-link>
                  </div>
                </td>
              </tr>
              
              <tr
                v-for="position in openPositions"
                :key="`${position.id}-${position.unrealized_pnl || 0}`"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ position.symbol }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    position.user_type === 'buy' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  ]">
                    {{ position.user_type?.toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ position.volume }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {{ formatPrice(position.entry_price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                  <span :class="[
                    'px-1 py-0.5 rounded transition-colors duration-300',
                    getPriceClass(position.symbol, position.current_price, position.entry_price, position.user_type)
                  ]">
                    {{ formatPrice(position.current_price) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span :class="[
                    'px-1 py-0.5 rounded font-semibold',
                    (position.unrealized_pnl || 0) >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                  ]">
                    {{ calculatePips(position) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                  <span :class="[
                    'px-2 py-1 rounded font-bold text-sm',
                    (position.unrealized_pnl || 0) >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                  ]">
                    {{ formatCurrency(position.unrealized_pnl || 0) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                  {{ position.stop_loss ? formatPrice(position.stop_loss) : '---' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                  {{ position.take_profit ? formatPrice(position.take_profit) : '---' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDateTime(position.open_time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="">
                    <button
                      @click="closePosition(position)"
                      class="text-red-600 hover:text-red-900 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Close All Modal -->
    <div
      v-if="showCloseAllModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <ExclamationTriangleIcon class="mx-auto h-16 w-16 text-red-600" />
          <h3 class="text-lg leading-6 font-medium text-gray-900 mt-2">Close All Positions</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to close all {{ openPositions.length }} open positions? 
              This action cannot be undone.
            </p>
            <div class="mt-3 p-3 bg-gray-50 rounded text-sm">
              <div class="flex justify-between">
                <span>Total Unrealized P&L:</span>
                <span :class="[
                  'font-semibold',
                  totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ formatCurrency(totalUnrealizedPnL) }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex justify-center space-x-3 mt-4">
            <button
              @click="showCloseAllModal = false"
              class="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              @click="closeAllPositions"
              :disabled="isClosingAll"
              class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {{ isClosingAll ? 'Closing...' : 'Close All' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTradingStore } from '@/stores/trading'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { useWebSocketStore } from '@/stores/websocket'
import PositionDebug from '@/components/debug/PositionDebug.vue'

import {
  ChartBarIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ScaleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const tradingStore = useTradingStore()
const authStore = useAuthStore()
const toastStore = useToastStore()
const wsStore = useWebSocketStore()

const isLoading = ref(false)
const isClosingAll = ref(false)
const showCloseAllModal = ref(false)
const showDebug = ref(false)

// Use computed properties that properly react to store changes
const openPositions = computed(() => tradingStore.openPositions)
const totalUnrealizedPnL = computed(() => tradingStore.totalUnrealizedPnL)
const balance = computed(() => authStore.user?.balance || 0)

const usedMargin = computed(() => {
  return openPositions.value.reduce((sum, pos) => sum + (pos.volume * 1000), 0)
})

const marginLevel = computed(() => {
  if (usedMargin.value === 0) return 0
  const equity = balance.value + totalUnrealizedPnL.value
  return ((equity / usedMargin.value) * 100).toFixed(0)
})

// Watch for position updates and log them
watch(
  () => tradingStore.positionUpdateTrigger,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      console.log('🔄 Position trigger updated:', newVal, 'Positions:', openPositions.value.length)
    }
  }
)

watch(
  () => openPositions.value.length,
  (newLength, oldLength) => {
    console.log('📊 Position count changed:', oldLength, '->', newLength)
  }
)

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0)
}

const formatPrice = (price) => {
  return tradingStore.formatPrice(price)
}

const formatDateTime = (datetime) => {
  if (!datetime) return '---'
  return new Date(datetime).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const calculatePips = (position) => {
  if (!position.entry_price || !position.current_price) return '0.0'
  
  const diff = position.user_type === 'buy' 
    ? position.current_price - position.entry_price
    : position.entry_price - position.current_price
  
  const multiplier = position.symbol && position.symbol.includes('JPY') ? 100 : 10000
  const pips = diff * multiplier
  
  return (pips >= 0 ? '+' : '') + pips.toFixed(1)
}

const getPriceClass = (symbol, currentPrice, entryPrice, type) => {
  if (!currentPrice || !entryPrice) return 'text-gray-600'
  const isProfit = type === 'buy' ? currentPrice > entryPrice : currentPrice < entryPrice
  return isProfit ? 'text-green-600' : 'text-red-600'
}

const refreshPositions = async () => {
  isLoading.value = true
  try {
    await tradingStore.fetchPositions()
    toastStore.success('Positions refreshed')
  } catch (error) {
    console.error('Failed to fetch positions:', error)
    toastStore.error('Failed to refresh positions')
  } finally {
    isLoading.value = false
  }
}

const closePosition = async (position) => {
  console.log('🔄 Close position called with:', position)
  
  // STEP 1: Validate position object
  if (!position) {
    toastStore.error('Invalid position object')
    console.error('❌ Position object is null/undefined')
    return
  }
  
  // STEP 2: Check for ID property
  const positionId = position.id || position.trade_id || position.position_id
  
  if (!positionId) {
    toastStore.error('Position has no valid ID')
    console.error('❌ Position missing ID:', {
      position,
      availableKeys: Object.keys(position),
      id: position.id,
      trade_id: position.trade_id,
      position_id: position.position_id
    })
    return
  }
  
  // STEP 3: Validate ID format
  if (positionId === 'undefined' || positionId === undefined || positionId === null) {
    toastStore.error('Position ID is undefined')
    console.error('❌ Position ID is undefined:', positionId)
    return
  }
  
  // STEP 4: Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(String(positionId))) {
    toastStore.error(`Invalid UUID format: ${positionId}`)
    console.error('❌ Invalid UUID format:', {
      positionId,
      type: typeof positionId,
      length: String(positionId).length
    })
    return
  }
  
  // STEP 5: Confirm with user
  const confirmMessage = `Close ${position.symbol} position?\n\nCurrent P&L: ${formatCurrency(position.unrealized_pnl || 0)}`
  if (!confirm(confirmMessage)) {
    return
  }
  
  // STEP 6: Attempt to close
  try {
    console.log('✅ Attempting to close position:', {
      id: positionId,
      symbol: position.symbol,
      type: position.user_type
    })
    
    await tradingStore.closeTrade(positionId)
    toastStore.success(`Position ${position.symbol} closed successfully`)
    
  } catch (error) {
    console.error('❌ Failed to close position:', error)
    
    // Parse error message
    let errorMessage = 'Failed to close position'
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail
    } else if (error.message) {
      errorMessage = error.message
    }
    
    toastStore.error(errorMessage)
  }
}

const editPosition = (position) => {
  // TODO: Implement position editing modal
  toastStore.info('Position editing coming soon')
}

const closeAllPositions = async () => {
  isClosingAll.value = true
  try {
    const promises = openPositions.value.map(position => 
      tradingStore.closeTrade(position.id)
    )
    
    await Promise.all(promises)
    
    showCloseAllModal.value = false
    toastStore.success(`Closed ${promises.length} positions`)
  } catch (error) {
    console.error('Close all positions error:', error)
    toastStore.error('Failed to close some positions')
  } finally {
    isClosingAll.value = false
  }
}

onMounted(async () => {
  console.log('📊 Positions component mounted')
  await refreshPositions()
  await tradingStore.initializeTradingData()
})

onUnmounted(() => {
  console.log('📊 Positions component unmounted')
})
</script>