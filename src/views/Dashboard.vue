<!-- <template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
      <div class="mb-4 flex items-center gap-x-2">
        <Bars3Icon class="w-6 h-6" />
        <h1 class="text-lg font-semibold text-gray-800">
          Quotes
        </h1>
      </div>
      <div class="">
        <div class="p-2">
          <div class="space-y-4">
            <PriceWidget v-for="symbol in ['EURUSD', 'USDJPY', 'XAUUSD']" :key="symbol" :symbol="symbol"
              :price="prices[symbol]" @trade="handleQuickTrade" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTradingStore } from '@/stores/trading'
import StatCard from '@/components/common/StatCard.vue'
import PriceWidget from '@/components/trading/PriceWidget.vue'

import {
  Bars3Icon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const tradingStore = useTradingStore()

const user = computed(() => authStore.user)
const prices = computed(() => tradingStore.symbolPrices)

const handleQuickTrade = (data) => {
  router.push({
    path: '/trading',
    query: {
      symbol: data.symbol,
      type: data.type
    }
  })
}

onMounted(async () => {
  await tradingStore.initializeTradingData()
})
</script> -->

<template>
  <div class="min-h-screen text-white">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-700">
      <div class="flex items-center gap-3">
        <Bars3Icon class="w-5 h-5 text-gray-900" />
        <h1 class="text-lg text-gray-900 font-semibold">Quotes</h1>
        <div :class="[
          'w-2 h-2 rounded-full',
          wsStore.isConnected ? 'bg-green-500' : 'bg-red-500'
        ]" />
      </div>
      <div class="flex items-center gap-4">
        <!-- Connection Status -->
        <!-- <div class="flex items-center gap-2 text-sm">
          <div :class="[
            'w-2 h-2 rounded-full',
            wsStore.isConnected ? 'bg-green-500' : 'bg-red-500'
          ]" />
          <span class="text-gray-300">
            {{ wsStore.isConnected ? 'Live Prices' : 'Disconnected' }}
          </span>
        </div> -->
        
        <!-- Actions -->
        <div class="flex items-center gap-2">
          <button 
            @click="refreshPrices"
            class="text-gray-400 hover:text-white transition-colors"
            :disabled="isRefreshing"
          >
            <ArrowPathIcon :class="['w-5 h-5', isRefreshing && 'animate-spin']" />
          </button>
          <PencilIcon class="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </div>


    <!-- Quotes List -->
    <div class="flex-1 overflow-auto">
      <div v-if="isLoading" class="p-4 text-center text-gray-400">
        <!-- <div class="animate-pulse">Loading prices...</div> -->
      </div>
      
      <div v-else>
        <ModifiedPriceWidget
          v-for="symbol in symbols"
          :key="symbol"
          :symbol="symbol"
          :price="symbolPrices[symbol]"
          @trade="handleQuickTrade"
        />
      </div>
    </div>

   
    
    <!-- Position Summary Sidebar (Optional - can be toggled) -->
    <!-- <div v-if="showPositionSummary" class="fixed right-0 top-16 bottom-16 w-80 bg-gray-800 border-l border-gray-700 z-10">
      <PositionsSidebar @close-position="handleClosePosition" />
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTradingStore } from '@/stores/trading'
import { useWebSocketStore } from '@/stores/websocket'
import ModifiedPriceWidget from '@/components/trading/PriceWidget.vue'
import PositionsSidebar from '@/components/trading/PositionsSidebar.vue'

import {
  Bars3Icon,
  PencilIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const tradingStore = useTradingStore()
const wsStore = useWebSocketStore()

// Local state
const isLoading = ref(true)
const isRefreshing = ref(false)
const currentTime = ref('')
const showPositionSummary = ref(false)

// Computed properties
const symbolPrices = computed(() => tradingStore.symbolPrices)
const symbols = computed(() => Object.keys(symbolPrices.value))
const marketStatus = computed(() => {
  // You can enhance this based on your backend data
  return wsStore.isConnected ? 'Open' : 'Closed'
})

// Methods
const handleQuickTrade = (data) => {
  router.push({
    path: '/trading',
    query: {
      symbol: data.symbol,
      type: data.type || 'buy'
    }
  })
}

const handleClosePosition = async (positionId) => {
  try {
    await tradingStore.closeTrade(positionId)
  } catch (error) {
    console.error('Failed to close position:', error)
  }
}

const refreshPrices = async () => {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  try {
    // Force refresh from your backend
    await tradingStore.fetchPositions(true)
    await tradingStore.fetchTradingSummary()
  } catch (error) {
    console.error('Failed to refresh data:', error)
  } finally {
    isRefreshing.value = false
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const updateCurrentTime = () => {
  currentTime.value = formatTime(new Date())
}

// Lifecycle
onMounted(async () => {
  try {
    // Initialize trading data using your existing methods
    await tradingStore.initializeTradingData()
    
    // Connect WebSocket using your existing store
    if (!wsStore.isConnected) {
      wsStore.connect()
    }
    
    // Update current time every second
    const timeInterval = setInterval(updateCurrentTime, 1000)
    updateCurrentTime()
    
    // Cleanup interval on unmount
    onUnmounted(() => {
      clearInterval(timeInterval)
    })
    
  } catch (error) {
    console.error('Failed to initialize quotes page:', error)
  } finally {
    isLoading.value = false
  }
})

// Keyboard shortcuts (MT5 style)
const handleKeyPress = (event) => {
  switch (event.key) {
    case 'F5':
      event.preventDefault()
      refreshPrices()
      break
    case 'F9':
      event.preventDefault()
      showPositionSummary.value = !showPositionSummary.value
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
/* Custom scrollbar for MT5 look */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #6B7280;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}
</style>