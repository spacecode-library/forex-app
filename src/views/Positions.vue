<!-- <template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Open Positions</h1>
        <p class="text-gray-600">Manage your active trading positions</p>
      </div>

      <PositionDebug v-if="showDebug" @close="showDebug = false" />

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

      <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Position Details</h2>
          <div class="flex items-center space-x-3">
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
  
  if (!position) {
    toastStore.error('Invalid position object')
    console.error('❌ Position object is null/undefined')
    return
  }
  
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
  
  if (positionId === 'undefined' || positionId === undefined || positionId === null) {
    toastStore.error('Position ID is undefined')
    console.error('❌ Position ID is undefined:', positionId)
    return
  }
  
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
  
  const confirmMessage = `Close ${position.symbol} position?\n\nCurrent P&L: ${formatCurrency(position.unrealized_pnl || 0)}`
  if (!confirm(confirmMessage)) {
    return
  }
  
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
</script> -->
<!-- 
<template>
  <div class="min-h-screen bg-gray-50 py-8 pb-16 overflow-y overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Open Positions</h1>
        <p class="text-gray-600">Manage your active trading positions</p>
      </div>

      <PositionDebug v-if="showDebug" @close="showDebug = false" />

      <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8">
        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">Open Positions</p>
              <p class="text-sm font-semibold text-gray-900">{{ openPositions.length }}</p>
            </div>
          </div>
        </div>
        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">Balance</p>
              <p class="text-sm font-semibold text-gray-900">{{ balance.toFixed(2)  }}</p>
            </div>
          </div>
        </div>
        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">Equity</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(balance -  totalUnrealizedPnL)  }}</p>
            </div>
          </div>
        </div>

        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">
                Unrealized P&L
                <span v-if="wsStore.isConnected"
                  class="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse ml-1"></span>
              </p>
              <p :class="[
                'text-sm font-semibold transition-all duration-300',
                totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ formatCurrency(totalUnrealizedPnL) }}
              </p>
            </div>
          </div>
        </div>

        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">Used Margin</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(usedMargin) }}</p>
            </div>
          </div>
        </div>

        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">Margin Level</p>
              <p class="text-sm font-semibold text-gray-900">{{ marginLevel }}%</p>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-hidden">
        <div class=" py-2 border-b  border-gray-100 flex justify-end items-center">
          <div class="flex items-center space-x-3">
            <button v-if="openPositions.length > 0" @click="showCloseAllModal = true"
              class=" text-sm leading-4 font-medium rounded-md text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Close All
            </button>
          </div>
        </div>
        <div class="text-start py-2 text-sm font-medium text-gray-600 tracking-wider">
          Positions
        </div>


        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
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
                    <router-link to="/trading"
                      class="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      Start Trading
                    </router-link>
                  </div>
                </td>
              </tr>

              <div v-for="position in openPositions"
                :key="`${position.id}-${position.unrealized_pnl || 0}-${position.current_price || 0}`" :class="[
                  'hover:bg-gray-50 items-center justify-between transition-colors',
                  showShimmer ? 'shimmer-bg' : ''
                ]" 
                @click="toggleExpand(position.id)" @mousedown="startLongPress(position)" @mouseup="cancelLongPress"
                @mouseleave="cancelLongPress">
                <div class="py-1 flex justify-between items-center">
                  <div class="">
                    <div :class="['relative z-10 text-sm font-medium text-gray-900']"
                    >{{ position.symbol }} ,
                      <span :class="[
                        'inline-flex py-1 text-xs font-semibold rounded-full',
                        position.user_type === 'buy'
                          ? 'text-blue-500'
                          : 'text-red-800'
                      ]">
                        {{ position.user_type?.toUpperCase() }}
                      </span>
                    </div>
                    <div class="text-xs flex gap-x-1 ">
                      <p>{{ formatPrice(position.entry_price, position.symbol) }}</p>
                      <ArrowRightIcon class="w-3 h-3 text-gray-700" />
                      <p> {{ formatPrice(position.current_price, position.symbol) }}</p>

                    </div>
                  </div>

                  <div class=" py-4 text-end whitespace-nowrap text-sm font-semibold">
                    <span :class="[
                      'px-3 py-2 rounded font-bold text-sm transition-all duration-300',
                      getPnLClass(position.unrealized_pnl),
                      wsStore.isConnected ? 'animate-pulse-subtle' : ''
                    ]">
                      {{ formatCurrency(position.unrealized_pnl || 0) }}
                    </span>
                  </div>
                </div>

                <div v-if="expandedPositionId === position.id"
                  class="w-full bg-gray-50 px-4 py-2 text-sm text-gray-700">
                  <p><strong>Volume:</strong> {{ position.volume }}</p>
                  <p><strong>Stop Loss:</strong> {{ position.stop_loss || '---' }}</p>
                  <p><strong>Take Profit:</strong> {{ position.take_profit || '---' }}</p>
                  <p><strong>Opened At:</strong> {{ formatDateTime(position.open_time) }}</p>
                  <button @click.stop="closePosition(position)" class="mt-2 text-red-600 hover:underline">Close</button>
                </div>
              </div>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showCloseAllModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
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
            <button @click="showCloseAllModal = false"
              class="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md hover:bg-gray-400">
              Cancel
            </button>
            <button @click="closeAllPositions" :disabled="isClosingAll"
              class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md hover:bg-red-700 disabled:opacity-50">
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
import { reactive } from 'vue'

import {
  ChartBarIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ScaleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon
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

// Watch for real-time updates
watch(
  () => tradingStore.positionUpdateTrigger,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      console.log('🔄 Real-time position update triggered:', newVal)
    }
  }
)

// Enhanced formatting functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0)
}

const formatPrice = (price, symbol = '') => {
  return tradingStore.formatPrice(price, symbol)
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

const formatTime = (datetime) => {
  if (!datetime) return '---'
  return new Date(datetime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatRelativeTime = (datetime) => {
  if (!datetime) return ''
  const diff = Date.now() - new Date(datetime).getTime()
  if (diff < 1000) return 'now'
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
  return `${Math.floor(diff / 60000)}m ago`
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

// Enhanced styling functions for real-time updates
const getCurrentPriceClass = (position) => {
  if (!position.current_price || !position.entry_price) return 'text-gray-600 bg-gray-100'

  const isProfit = position.user_type === 'buy'
    ? position.current_price > position.entry_price
    : position.current_price < position.entry_price

  return isProfit
    ? 'text-green-700 bg-green-100 border border-green-200'
    : 'text-red-700 bg-red-100 border border-red-200'
}

const getPipsClass = (position) => {
  const pips = parseFloat(calculatePips(position))
  return pips >= 0
    ? 'text-green-600 bg-green-50 border border-green-200'
    : 'text-red-600 bg-red-50 border border-red-200'
}

const getPnLClass = (pnl) => {
  return (pnl || 0) >= 0
    ? 'text-green-600 '
    : 'text-red-600'
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

const forceRefresh = async () => {
  isLoading.value = true
  try {
    // Force refresh all data
    await Promise.all([
      tradingStore.fetchPositions(true),
      tradingStore.recalculateAllPnL(),
      wsStore.requestPositionUpdates()
    ])
    toastStore.success('All data refreshed')
  } catch (error) {
    console.error('Force refresh failed:', error)
    toastStore.error('Refresh failed')
  } finally {
    isLoading.value = false
  }
}

// Rest of your existing methods remain the same...
const closePosition = async (position) => {
  console.log('🔄 Close position called with:', position)

  if (!position || !position.id) {
    toastStore.error('Invalid position')
    return
  }

  const confirmMessage = `Close ${position.symbol} position?\n\nCurrent P&L: ${formatCurrency(position.unrealized_pnl || 0)}`
  if (!confirm(confirmMessage)) {
    return
  }

  try {
    await tradingStore.closeTrade(position.id)
    toastStore.success(`Position ${position.symbol} closed successfully`)
  } catch (error) {
    console.error('❌ Failed to close position:', error)
    toastStore.error(error.response?.data?.detail || 'Failed to close position')
  }
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



// Store expanded position ID
const expandedPositionId = ref(null)
// Store long press timer
const longPressTimer = ref(null)
// Store selected position for bottom sheet
const selectedForBottomSheet = ref(null)

// Toggle expand/collapse
const toggleExpand = (id) => {
  expandedPositionId.value = expandedPositionId.value === id ? null : id
}

// Handle long press to open bottom sheet
const startLongPress = (position) => {
  longPressTimer.value = setTimeout(() => {
    selectedForBottomSheet.value = position
  }, 600) // 600ms press duration
}

const cancelLongPress = () => {
  clearTimeout(longPressTimer.value)
}


const showShimmer = ref(true)

// onMounted(() => {
  
// })



onMounted(async () => {
  setTimeout(() => {
    showShimmer.value = false
  }, 600)
  console.log('📊 Real-time positions component mounted')
  // await refreshPositions()
  await tradingStore.initializeTradingData()

  // Ensure WebSocket is connected for real-time updates
  if (!wsStore.isConnected) {
    wsStore.connect()
  }
})

onUnmounted(() => {
  console.log('📊 Positions component unmounted')
})
</script>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -150% 0;
  }
  100% {
    background-position: 150% 0;
  }
}

.shimmer-bg {
  position: relative;
  overflow: hidden;
}

.shimmer-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(200, 200, 200, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  ); 
  background-size: 200% 100%;
  animation: shimmer 0.8s linear infinite;
  pointer-events: none;
}
@keyframes pulse-subtle {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.8;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s infinite;
}
</style> -->


<template>
  <div class="min-h-screen bg-gray-50 py-8 pb-16 overflow-y overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Open Positions</h1>
        <p class="text-gray-600">Manage your active trading positions</p>
      </div>

      <PositionDebug v-if="showDebug" @close="showDebug = false" />

      <!-- Account Info Grid - Updated to include leverage -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-8">
        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">Open Positions</p>
              <p class="text-sm font-semibold text-gray-900">{{ openPositions.length }}</p>
            </div>
          </div>
        </div>

        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">Balance</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(accountInfo.balance) }}</p>
            </div>
          </div>
        </div>

        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">Equity</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(accountInfo.balance - totalUnrealizedPnL)
              }}</p>
            </div>
          </div>
        </div>

        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">
                Unrealized P&L
                <span v-if="wsStore.isConnected"
                  class="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse ml-1"></span>
              </p>
              <p :class="[
                'text-sm font-semibold transition-all duration-300',
                totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ formatCurrency(totalUnrealizedPnL) }}
              </p>
            </div>
          </div>
        </div>

        <!-- NEW: Show leverage -->
        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">Leverage</p>
              <p class="text-sm font-semibold text-gray-900">{{ accountInfo.leverage || 100 }}:1</p>
            </div>
          </div>
        </div>

        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">Used Margin</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(accountInfo.margin_used) }}</p>
            </div>
          </div>
        </div>

        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">Free Margin</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatCurrency(accountInfo.free_margin) }}</p>
            </div>
          </div>
        </div>

        <div class="">
          <div class="">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">Margin Level</p>
              <p :class="[
                'text-sm font-semibold',
                getMarginLevelClass(accountInfo.margin_level)
              ]">
                {{ accountInfo.margin_level ? accountInfo.margin_level.toFixed(0) : '0' }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-hidden">
        <div class=" py-2 border-b  border-gray-100 flex justify-end items-center">
          <div class="flex items-center space-x-3">
            <button v-if="openPositions.length > 0" @click="showCloseAllModal = true"
              class=" text-sm leading-4 font-medium rounded-md text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Close All
            </button>
          </div>
        </div>
        <div class="text-start py-2 text-sm font-medium text-gray-600 tracking-wider">
          Positions
        </div>


        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
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
                    <router-link to="/trading"
                      class="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      Start Trading
                    </router-link>
                  </div>
                </td>
              </tr>

              <div v-for="position in openPositions" :key="position.id" :class="[
                'hover:bg-gray-50 items-center justify-between transition-colors',
              ]" @click="toggleExpand(position.id)" @mousedown="startLongPress(position)" @mouseup="cancelLongPress"
                @mouseleave="cancelLongPress">
                <div class="py-1 flex justify-between items-center">
                  <div class="">
                    <div :class="['relative z-10 text-sm font-medium text-gray-900']">{{ position.symbol }} ,
                      <span :class="[
                        'inline-flex py-1 text-xs font-semibold rounded-full',
                        position.user_type === 'buy'
                          ? 'text-blue-500'
                          : 'text-red-800'
                      ]">
                        {{ position.user_type?.toUpperCase() }}
                      </span>
                    </div>
                    <div class="text-xs flex gap-x-1 ">
                      <p>{{ formatPrice(position.entry_price, position.symbol) }}</p>
                      <ArrowRightIcon class="w-3 h-3 text-gray-700" />
                      <p> {{ formatPrice(position.current_price, position.symbol) }}</p>
                    </div>
                  </div>

                  <div class=" py-4 text-end whitespace-nowrap text-sm font-semibold">
                    <span :class="[
                      'px-3 py-2 rounded font-bold text-sm transition-all duration-300',
                      getPnLClass(position.unrealized_pnl),
                      wsStore.isConnected ? 'animate-pulse-subtle' : ''
                    ]">
                      {{ formatCurrency(position.unrealized_pnl || 0) }}
                    </span>
                  </div>
                </div>

                <!-- <div v-if="expandedPositionId === position.id"
                  class="w-full bg-gray-50 px-4 py-2 text-sm text-gray-700">
                  <div class="grid grid-cols-2 gap-2">
                    <p><strong>Volume:</strong> {{ position.volume }}</p>
                    <p><strong>Margin:</strong> {{ formatCurrency(position.margin_required || (position.volume * 1000))
                      }}</p>
                    <p><strong>Stop Loss:</strong> {{ position.stop_loss || '---' }}</p>
                    <p><strong>Take Profit:</strong> {{ position.take_profit || '---' }}</p>
                  </div>
                  <p class="mt-2"><strong>Opened At:</strong> {{ formatDateTime(position.open_time) }}</p>
                  <button @click.stop="closePosition(position)" class="mt-2 text-red-600 hover:underline">Close</button>
                </div> -->
                <div v-if="expandedPositionId === position.id"
                  class="w-full bg-gray-50 px-4 py-2 text-sm text-gray-700">
                  <div class="grid grid-cols-2 gap-2">
                    <p><strong>Volume:</strong> {{ position.volume }}</p>
                    <p><strong>Margin:</strong> {{ formatCurrency(position.margin_required || (position.volume * 1000))
                    }}</p>

                    <!-- NEW: Editable SL/TP -->
                    <div>
                      <strong>Stop Loss:</strong>
                      <input v-if="editingPosition === position.id" v-model.number="editSL" type="number"
                        class="ml-1 w-20 text-xs border rounded px-1" @click.stop />
                      <span v-else>{{ position.stop_loss || '---' }}</span>
                    </div>

                    <div>
                      <strong>Take Profit:</strong>
                      <input v-if="editingPosition === position.id" v-model.number="editTP" type="number"
                        class="ml-1 w-20 text-xs border rounded px-1" @click.stop />
                      <span v-else>{{ position.take_profit || '---' }}</span>
                    </div>
                  </div>

                  <p class="mt-2"><strong>Opened At:</strong> {{ formatDateTime(position.open_time) }}</p>

                  <div class="flex space-x-2 mt-2">
                    <button v-if="editingPosition !== position.id" @click.stop="startEditPosition(position)"
                      class="text-blue-600 hover:underline text-xs">
                      Edit SL/TP
                    </button>
                    <button v-if="editingPosition === position.id" @click.stop="savePosition(position)"
                      class="text-green-600 hover:underline text-xs">
                      Save
                    </button>
                    <button v-if="editingPosition === position.id" @click.stop="cancelEdit()"
                      class="text-gray-600 hover:underline text-xs">
                      Cancel
                    </button>
                    <button @click.stop="closePosition(position)" class="text-red-600 hover:underline text-xs">
                      Close
                    </button>
                  </div>
                </div>
              </div>

              <div v-for="order in pendingOrders" :key="order.id"
                class="flex justify-between items-center py-2 px-3 bg-yellow-50 border border-yellow-200 rounded mb-2">
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ order.symbol }} {{ order.user_type.toUpperCase() }} {{ order.volume }} lots
                  </div>
                  <div class="text-xs text-gray-600">
                    Target: {{ formatPrice(order.target_price, order.symbol) }}
                  </div>
                </div>

                <div class="flex items-center space-x-2">
                  <div class="text-xs text-yellow-600 font-medium">PENDING</div>
                  <!-- NEW: Cancel button -->
                  <button @click="cancelOrder(order)" class="text-xs text-red-600 hover:text-red-800 hover:underline">
                    Cancel
                  </button>
                </div>
              </div>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Close All Modal -->
    <div v-if="showCloseAllModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
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
            <button @click="showCloseAllModal = false"
              class="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md hover:bg-gray-400">
              Cancel
            </button>
            <button @click="closeAllPositions" :disabled="isClosingAll"
              class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md hover:bg-red-700 disabled:opacity-50">
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
import { tradingAPI } from '@/services/api' // NEW: Import trading API
import PositionDebug from '@/components/debug/PositionDebug.vue'
import { reactive } from 'vue'

import {
  ChartBarIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ScaleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

const tradingStore = useTradingStore()
const authStore = useAuthStore()
const toastStore = useToastStore()
const wsStore = useWebSocketStore()

const isLoading = ref(false)
const isClosingAll = ref(false)
const showCloseAllModal = ref(false)
const showDebug = ref(false)

// NEW: Account info with leverage
const accountInfo = ref({
  balance: 0,
  leverage: 100,
  margin_used: 0,
  free_margin: 0,
  margin_level: 0,
  open_positions: 0
})

// Use computed properties that properly react to store changes
const openPositions = computed(() => tradingStore.openPositions)
const totalUnrealizedPnL = computed(() => tradingStore.totalUnrealizedPnL)

// NEW: Fetch account info with leverage
const fetchAccountInfo = async () => {
  try {
    const info = await tradingAPI.getAccountInfo()
    accountInfo.value = info
    // console.log(accountInfo,info,'account data')
  } catch (error) {
    console.error('Failed to fetch account info:', error)
    // Fallback to basic info
    accountInfo.value = {
      balance: authStore.user?.balance || 0,
      leverage: authStore.user?.leverage || 100,
      margin_used: openPositions.value.reduce((sum, pos) => sum + (pos.margin_required || pos.volume * 1000), 0),
      free_margin: 0,
      margin_level: 0,
      open_positions: openPositions.value.length
    }
  }
}

// Watch for real-time updates
watch(
  () => tradingStore.positionUpdateTrigger,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      console.log('🔄 Real-time position update triggered:', newVal)
      // Refresh account info when positions change
      fetchAccountInfo()
    }
  }
)

// Enhanced formatting functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0)
}

const formatPrice = (price, symbol = '') => {
  return tradingStore.formatPrice(price, symbol)
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

// NEW: Get margin level color based on risk
const getMarginLevelClass = (marginLevel) => {
  if (!marginLevel) return 'text-gray-900'

  if (marginLevel <= 20) return 'text-red-600 font-bold' // Stop out risk
  if (marginLevel <= 50) return 'text-orange-600 font-semibold' // Margin call
  if (marginLevel <= 100) return 'text-yellow-600' // Warning
  return 'text-green-600' // Healthy
}

const getPnLClass = (pnl) => {
  return (pnl || 0) >= 0
    ? 'text-green-600 '
    : 'text-red-600'
}

const cancelOrder = async (order) => {
  if (!confirm(`Cancel ${order.symbol} ${order.user_type.toUpperCase()} order at ${formatPrice(order.target_price, order.symbol)}?`)) {
    return
  }
  
  try {
    const result = await tradingAPI.cancelPendingOrder(order.id)
    
    // Remove from pending orders
    pendingOrders.value = pendingOrders.value.filter(o => o.id !== order.id)
    
    // Refresh account info (balance updated)
    await fetchAccountInfo()
    
    toastStore.success(`Order ${result.ticket} cancelled - $${result.refunded_amount.toFixed(2)} refunded`)
    
  } catch (error) {
    console.error('Failed to cancel order:', error)
    toastStore.error(error.response?.data?.detail || 'Failed to cancel order')
  }
}

const refreshPositions = async () => {
  isLoading.value = true
  try {
    await tradingStore.fetchPositions()
    await fetchAccountInfo()
    toastStore.success('Positions refreshed')
  } catch (error) {
    console.error('Failed to fetch positions:', error)
    toastStore.error('Failed to refresh positions')
  } finally {
    isLoading.value = false
  }
}

const forceRefresh = async () => {
  isLoading.value = true
  try {
    // Force refresh all data
    await Promise.all([
      tradingStore.fetchPositions(true),
      tradingStore.recalculateAllPnL(),
      fetchAccountInfo(), // NEW: Include account info refresh
      wsStore.requestPositionUpdates()
    ])
    toastStore.success('All data refreshed')
  } catch (error) {
    console.error('Force refresh failed:', error)
    toastStore.error('Refresh failed')
  } finally {
    isLoading.value = false
  }
}

const editingPosition = ref(null)
const editSL = ref(null)
const editTP = ref(null)

const startEditPosition = (position) => {
  editingPosition.value = position.id
  editSL.value = position.stop_loss
  editTP.value = position.take_profit
}

const savePosition = async (position) => {
  try {
    await tradingAPI.updateTrade(position.id, {
      stop_loss: editSL.value,
      take_profit: editTP.value
    })

    // Update local position
    const index = openPositions.value.findIndex(p => p.id === position.id)
    if (index !== -1) {
      openPositions.value[index].stop_loss = editSL.value
      openPositions.value[index].take_profit = editTP.value
    }

    editingPosition.value = null
    await refreshPositions()
    toastStore.success('Position updated successfully')
  } catch (error) {
    toastStore.error('Failed to update position')
  }
}

const cancelEdit = () => {
  editingPosition.value = null
  editSL.value = null
  editTP.value = null
}


// Rest of your existing methods remain the same...
const closePosition = async (position) => {
  console.log('🔄 Close position called with:', position)

  if (!position || !position.id) {
    toastStore.error('Invalid position')
    return
  }

  const confirmMessage = `Close ${position.symbol} position?\n\nCurrent P&L: ${formatCurrency(position.unrealized_pnl || 0)}`
  if (!confirm(confirmMessage)) {
    return
  }

  try {
    await tradingStore.closeTrade(position.id)
    await fetchAccountInfo() // NEW: Refresh account info after closing
    toastStore.success(`Position ${position.symbol} closed successfully`)
  } catch (error) {
    console.error('❌ Failed to close position:', error)
    toastStore.error(error.response?.data?.detail || 'Failed to close position')
  }
}

const pendingOrders = ref([])

const fetchPendingOrders = async () => {
  try {
    const orders = await tradingAPI.getPendingOrders()
    pendingOrders.value = orders
  } catch (error) {
    console.error('Failed to fetch pending orders:', error)
  }
}

const closeAllPositions = async () => {
  isClosingAll.value = true
  try {
    const promises = openPositions.value.map(position =>
      tradingStore.closeTrade(position.id)
    )

    await Promise.all(promises)
    await fetchAccountInfo() // NEW: Refresh account info after closing all

    showCloseAllModal.value = false
    toastStore.success(`Closed ${promises.length} positions`)
  } catch (error) {
    console.error('Close all positions error:', error)
    toastStore.error('Failed to close some positions')
  } finally {
    isClosingAll.value = false
  }
}

// Store expanded position ID
const expandedPositionId = ref(null)
// Store long press timer
const longPressTimer = ref(null)
// Store selected position for bottom sheet
const selectedForBottomSheet = ref(null)

// Toggle expand/collapse
const toggleExpand = (id) => {
  expandedPositionId.value = expandedPositionId.value === id ? null : id
}

// Handle long press to open bottom sheet
const startLongPress = (position) => {
  longPressTimer.value = setTimeout(() => {
    selectedForBottomSheet.value = position
  }, 600) // 600ms press duration
}

const cancelLongPress = () => {
  clearTimeout(longPressTimer.value)
}

const showShimmer = ref(true)

onMounted(async () => {
  setTimeout(() => {
    showShimmer.value = false
  }, 600)
  console.log('📊 Real-time positions component mounted')

  await tradingStore.initializeTradingData()
  await fetchAccountInfo() // NEW: Fetch account info on mount
  await fetchPendingOrders()
  // Ensure WebSocket is connected for real-time updates
  if (!wsStore.isConnected) {
    wsStore.connect()
  }
})

onUnmounted(() => {
  console.log('📊 Positions component unmounted')
})
</script>

<style scoped>
/* @keyframes shimmer {
  0% {
    background-position: -150% 0;
  }
  100% {
    background-position: 150% 0;
  }
}

.shimmer-bg {
  position: relative;
  overflow: hidden;
}

.shimmer-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(200, 200, 200, 0.4) 50%,
    rgba(255, 255, 255, 0) 100%
  ); 
  background-size: 200% 100%;
  animation: shimmer 0.8s linear infinite;
  pointer-events: none;
} */
@keyframes pulse-subtle {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.8;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s infinite;
}
</style>