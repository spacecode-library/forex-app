<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Trading Terminal</h1>
        <p class="text-gray-600">Place and manage your trades</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Trading Panel -->
        <div class="lg:col-span-1">
          <TradingPanel @trade-placed="handleTradeSuccess" />
        </div>

        <!-- Market Data & Charts -->
        <!-- <div class="lg:col-span-2 space-y-8">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Market Overview</h3>
              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-600">Symbol:</label>
                <select
                  v-model="selectedSymbol"
                  class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EURUSD">EUR/USD</option>
                  <option value="USDJPY">USD/JPY</option>
                  <option value="XAUUSD">XAU/USD (Gold)</option>
                </select>
              </div>
            </div>

            <div v-if="currentPrice" class="grid grid-cols-3 gap-4 mb-6">
              <div class="text-center">
                <div class="text-sm text-gray-500 mb-1">Bid</div>
                <div :class="[
                  'text-2xl font-mono font-bold p-3 rounded-lg',
                  getPriceClass(currentPrice.direction)
                ]">
                  {{ formatPrice(currentPrice.bid) }}
                </div>
              </div>
              <div class="text-center">
                <div class="text-sm text-gray-500 mb-1">Spread</div>
                <div class="text-lg font-semibold text-gray-700 p-3">
                  {{ formatSpread(currentPrice.spread) }}
                </div>
              </div>
              <div class="text-center">
                <div class="text-sm text-gray-500 mb-1">Ask</div>
                <div :class="[
                  'text-2xl font-mono font-bold p-3 rounded-lg',
                  getPriceClass(currentPrice.direction)
                ]">
                  {{ formatPrice(currentPrice.ask) }}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <button
                @click="quickTrade('sell')"
                :disabled="!currentPrice"
                class="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                SELL {{ currentPrice ? formatPrice(currentPrice.bid) : '---' }}
              </button>
              <button
                @click="quickTrade('buy')"
                :disabled="!currentPrice"
                class="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                BUY {{ currentPrice ? formatPrice(currentPrice.ask) : '---' }}
              </button>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Market Watch</h3>
            </div>
            <div class="overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bid</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ask</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spread</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="symbol in ['EURUSD', 'USDJPY', 'XAUUSD']"
                    :key="symbol"
                    :class="[
                      'hover:bg-gray-50 cursor-pointer transition-colors',
                      { 'bg-blue-50': selectedSymbol === symbol }
                    ]"
                    @click="selectedSymbol = symbol"
                  >
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ symbol }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {{ prices[symbol] ? formatPrice(prices[symbol].bid) : '---' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {{ prices[symbol] ? formatPrice(prices[symbol].ask) : '---' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      {{ prices[symbol] ? formatSpread(prices[symbol].spread) : '---' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <span :class="[
                        'inline-flex items-center',
                        getPriceChangeClass(prices[symbol]?.direction)
                      ]">
                        <component
                          :is="getPriceChangeIcon(prices[symbol]?.direction)"
                          class="w-4 h-4 mr-1"
                        />
                        {{ getPriceChangeText(prices[symbol]?.direction) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div> -->

        <!-- Positions & Orders -->
        <div class="lg:col-span-1">
          <PositionsSidebar @close-position="handleClosePosition" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTradingStore } from '@/stores/trading'
import { useToastStore } from '@/stores/toast'
import TradingPanel from '@/components/trading/TradingPanel.vue'
import PositionsSidebar from '@/components/trading/PositionsSidebar.vue'

import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const tradingStore = useTradingStore()
const toastStore = useToastStore()

const selectedSymbol = ref(route.query.symbol )
const selectedTimeframe = ref('1h')

const prices = computed(() => tradingStore.symbolPrices)
const currentPrice = computed(() => prices.value[selectedSymbol.value])

const formatPrice = (price) => tradingStore.formatPrice(price)

const formatSpread = (spread) => {
  if (!spread) return '0.0'
  const multiplier = selectedSymbol.value.includes('JPY') ? 100 : 10000
  return (spread * multiplier).toFixed(1)
}

const getPriceClass = (direction) => {
  switch (direction) {
    case 'up':
      return 'bg-green-100 text-green-800 border border-green-200'
    case 'down':
      return 'bg-red-100 text-red-800 border border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
}

const getPriceChangeClass = (direction) => {
  switch (direction) {
    case 'up':
      return 'text-green-600'
    case 'down':
      return 'text-red-600'
    default:
      return 'text-gray-500'
  }
}

const getPriceChangeIcon = (direction) => {
  switch (direction) {
    case 'up':
      return ArrowTrendingUpIcon
    case 'down':
      return ArrowTrendingDownIcon
    default:
      return MinusIcon
  }
}

const getPriceChangeText = (direction) => {
  switch (direction) {
    case 'up':
      return 'Rising'
    case 'down':
      return 'Falling'
    default:
      return 'Stable'
  }
}

const quickTrade = (type) => {
  if (!currentPrice.value) {
    toastStore.error('Price data not available')
    return
  }

  // Emit event to trading panel to pre-fill the form
  const event = new CustomEvent('quick-trade', {
    detail: {
      symbol: selectedSymbol.value,
      type: type,
      price: type === 'buy' ? currentPrice.value.ask : currentPrice.value.bid
    }
  })
  document.dispatchEvent(event)
}

const handleTradeSuccess = (trade) => {
  toastStore.success(`Trade placed successfully: ${trade.ticket}`)
}

const handleClosePosition = async (positionId) => {
  try {
    await tradingStore.closeTrade(positionId)
  } catch (error) {
    toastStore.error('Failed to close position')
  }
}

// Watch for symbol changes from query params
watch(() => route.query.symbol, (newSymbol) => {
  if (newSymbol) {
    selectedSymbol.value = newSymbol
  }
})

onMounted(async () => {
  await tradingStore.initializeTradingData()
})
</script>