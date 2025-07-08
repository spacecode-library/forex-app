<!-- <template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Trading Terminal</h1>
        <p class="text-gray-600">Place and manage your trades</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div class="lg:col-span-1">
          <TradingPanel @trade-placed="handleTradeSuccess" />
        </div>
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
</script> -->
<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pb-24">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <CurrencyDollarIcon class="h-5 w-5 text-blue-600 mr-2" />
        <h2 class="text-lg font-semibold text-gray-900">Place Order</h2>
      </div>
      <div class="text-xs text-gray-500">
        Commission: $3/lot
      </div>
    </div>

    <form @submit.prevent="submitTrade" class="space-y-4">
      <!-- Symbol Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Symbol</label>
        <select
          v-model="form.symbol"
          class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="EURUSD">EUR/USD</option>
          <option value="USDJPY">USD/JPY</option>
          <option value="XAUUSD">XAU/USD (Gold)</option>
        </select>
      </div>

      <!-- Order Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            :class="[
              'py-2 px-3 text-sm font-medium rounded-lg border transition-colors',
              form.order_type === 'market'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
            @click="form.order_type = 'market'"
          >
            Market Order
          </button>
          <button
            type="button"
            :class="[
              'py-2 px-3 text-sm font-medium rounded-lg border transition-colors',
              form.order_type === 'limit'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
            @click="form.order_type = 'limit'"
          >
            Limit Order
          </button>
        </div>
      </div>

      <!-- Buy/Sell Buttons with Current Prices -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Direction</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            :class="[
              'py-3 px-4 text-sm font-semibold rounded-lg transition-colors',
              form.user_type === 'buy'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            @click="form.user_type = 'buy'"
          >
            BUY {{ currentPrice ? formatPrice(currentPrice.ask) : '---' }}
          </button>
          <button
            type="button"
            :class="[
              'py-3 px-4 text-sm font-semibold rounded-lg transition-colors',
              form.user_type === 'sell'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            @click="form.user_type = 'sell'"
          >
            SELL {{ currentPrice ? formatPrice(currentPrice.bid) : '---' }}
          </button>
        </div>
        <div v-if="currentPrice" class="mt-1 text-xs text-gray-500 text-center">
          Spread: {{ formatSpread(currentPrice.ask - currentPrice.bid) }} pips
        </div>
      </div>

      <!-- Volume -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Volume (Lots)</label>
        <div class="relative">
          <input
            v-model.number="form.volume"
            type="number"
            step="0.01"
            min="0.01"
            max="100"
            class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.01"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <span class="text-gray-500 text-sm">lots</span>
          </div>
        </div>
        <div class="mt-1 flex space-x-1">
          <button
            v-for="size in [0.01, 0.1, 1.0, 5.0]"
            :key="size"
            type="button"
            @click="form.volume = size"
            class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <!-- Limit Price (for limit orders) -->
      <div v-if="form.order_type === 'limit'">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Limit Price
          <span class="text-xs text-gray-500">
            ({{ form.user_type === 'buy' ? 'below' : 'above' }} current market price)
          </span>
        </label>
        <input
          v-model.number="form.price"
          type="number"
          step="0.00001"
          class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter limit price"
        />
        <div v-if="form.price && currentPrice" class="mt-1 text-xs">
          <span :class="getLimitPriceValidationClass()">
            {{ getLimitPriceValidationText() }}
          </span>
        </div>
      </div>

      <!-- Stop Loss -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <input
            v-model="enableStopLoss"
            type="checkbox"
            class="mr-2"
          />
          Stop Loss
          <span class="text-xs text-gray-500">(Auto close on loss)</span>
        </label>
        <input
          v-if="enableStopLoss"
          v-model.number="form.stop_loss"
          type="number"
          step="0.00001"
          class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Stop loss price"
        />
      </div>

      <!-- Take Profit -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <input
            v-model="enableTakeProfit"
            type="checkbox"
            class="mr-2"
          />
          Take Profit
          <span class="text-xs text-gray-500">(Auto close on profit)</span>
        </label>
        <input
          v-if="enableTakeProfit"
          v-model.number="form.take_profit"
          type="number"
          step="0.00001"
          class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Take profit price"
        />
      </div>

      <!-- Order Summary -->
      <div class="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Order Type:</span>
          <span class="font-medium capitalize">{{ form.order_type }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Direction:</span>
          <span :class="[
            'font-medium',
            form.user_type === 'buy' ? 'text-green-600' : 'text-red-600'
          ]">
            {{ form.user_type?.toUpperCase() || '---' }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Volume:</span>
          <span class="font-medium">{{ form.volume || 0 }} lots</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Margin Required:</span>
          <span class="font-medium">${{ estimatedMargin.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Commission:</span>
          <span class="font-medium text-red-600">${{ estimatedCommission.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between border-t pt-2">
          <span class="text-gray-600 font-medium">Total Required:</span>
          <span class="font-semibold">${{ totalRequired.toFixed(2) }}</span>
        </div>
        <div v-if="form.stop_loss" class="flex justify-between">
          <span class="text-gray-600">Stop Loss:</span>
          <span class="font-medium">{{ formatPrice(form.stop_loss) }}</span>
        </div>
        <div v-if="form.take_profit" class="flex justify-between">
          <span class="text-gray-600">Take Profit:</span>
          <span class="font-medium">{{ formatPrice(form.take_profit) }}</span>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="!isFormValid || isLoading || !hasSufficientBalance"
        :class="[
          'w-full py-3 px-4 text-sm font-semibold rounded-lg transition-colors',
          isFormValid && !isLoading && hasSufficientBalance
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        <div v-if="isLoading" class="flex items-center justify-center">
          <div class="spinner mr-2"></div>
          Placing Order...
        </div>
        <div v-else-if="!hasSufficientBalance" class="text-red-600">
          Insufficient Balance
        </div>
        <div v-else>
          Place {{ form.order_type === 'market' ? 'Market' : 'Limit' }} {{ form.user_type?.toUpperCase() || '' }} Order
        </div>
      </button>

      <!-- Balance Info -->
      <div class="text-center text-sm border-t pt-3">
        <div class="flex justify-between text-gray-600">
          <span>Available Balance:</span>
          <span class="font-medium">${{ balance.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-gray-600">
          <span>After Trade:</span>
          <span :class="[
            'font-medium',
            hasSufficientBalance ? 'text-green-600' : 'text-red-600'
          ]">
            ${{ (balance - totalRequired).toFixed(2) }}
          </span>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useTradingStore } from '@/stores/trading'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { CurrencyDollarIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['trade-placed'])

const tradingStore = useTradingStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const form = ref({
  symbol: 'EURUSD',
  order_type: 'market',
  user_type: 'buy',
  volume: 0.01,
  price: null,
  stop_loss: null,
  take_profit: null
})

const enableStopLoss = ref(false)
const enableTakeProfit = ref(false)
const isLoading = ref(false)

const prices = computed(() => tradingStore.symbolPrices)
const currentPrice = computed(() => prices.value[form.value.symbol])
const balance = computed(() => authStore.user?.balance || 0)

const estimatedMargin = computed(() => {
  return (form.value.volume || 0) * 1000 // Simplified margin calculation
})

const estimatedCommission = computed(() => {
  return (form.value.volume || 0) * 3 // $3 per lot
})

const totalRequired = computed(() => {
  return estimatedMargin.value + estimatedCommission.value
})

const hasSufficientBalance = computed(() => {
  return balance.value >= totalRequired.value
})

const isFormValid = computed(() => {
  const baseValid = form.value.symbol &&
         form.value.order_type &&
         form.value.user_type &&
         form.value.volume > 0 &&
         form.value.volume <= 100

  if (!baseValid) return false

  // Validate limit order price
  if (form.value.order_type === 'limit') {
    if (!form.value.price) return false
    
    if (currentPrice.value) {
      const currentMarketPrice = form.value.user_type === 'buy' 
        ? currentPrice.value.ask 
        : currentPrice.value.bid

      // Buy limit must be below market, sell limit must be above market
      if (form.value.user_type === 'buy' && form.value.price >= currentMarketPrice) {
        return false
      }
      if (form.value.user_type === 'sell' && form.value.price <= currentMarketPrice) {
        return false
      }
    }
  }

  // Validate SL/TP relationship
  if (enableStopLoss.value && enableTakeProfit.value && 
      form.value.stop_loss && form.value.take_profit) {
    if (form.value.user_type === 'buy') {
      if (form.value.stop_loss >= form.value.take_profit) return false
    } else {
      if (form.value.stop_loss <= form.value.take_profit) return false
    }
  }

  return true
})

const formatPrice = (price) => {
  return tradingStore.formatPrice(price, form.value.symbol)
}

const formatSpread = (spread) => {
  if (!spread) return '0.0'
  const multiplier = form.value.symbol.includes('JPY') ? 100 : 10000
  return (spread * multiplier).toFixed(1)
}

const getLimitPriceValidationClass = () => {
  if (!form.value.price || !currentPrice.value) return ''
  
  const currentMarketPrice = form.value.user_type === 'buy' 
    ? currentPrice.value.ask 
    : currentPrice.value.bid

  const isValid = form.value.user_type === 'buy' 
    ? form.value.price < currentMarketPrice
    : form.value.price > currentMarketPrice

  return isValid ? 'text-green-600' : 'text-red-600'
}

const getLimitPriceValidationText = () => {
  if (!form.value.price || !currentPrice.value) return ''
  
  const currentMarketPrice = form.value.user_type === 'buy' 
    ? currentPrice.value.ask 
    : currentPrice.value.bid

  const diff = Math.abs(form.value.price - currentMarketPrice)
  const pips = diff * (form.value.symbol.includes('JPY') ? 100 : 10000)

  const isValid = form.value.user_type === 'buy' 
    ? form.value.price < currentMarketPrice
    : form.value.price > currentMarketPrice

  if (isValid) {
    return `Valid: ${pips.toFixed(1)} pips ${form.value.user_type === 'buy' ? 'below' : 'above'} market`
  } else {
    return `Invalid: Must be ${form.value.user_type === 'buy' ? 'below' : 'above'} current market price`
  }
}

const submitTrade = async () => {
  if (!isFormValid.value || !hasSufficientBalance.value) return

  isLoading.value = true
  try {
    const tradeData = {
      symbol: form.value.symbol,
      order_type: form.value.order_type,
      user_type: form.value.user_type,
      volume: form.value.volume,
      price: form.value.order_type === 'limit' ? form.value.price : null,
      stop_loss: enableStopLoss.value ? form.value.stop_loss : null,
      take_profit: enableTakeProfit.value ? form.value.take_profit : null
    }

    const trade = await tradingStore.placeTrade(tradeData)
    emit('trade-placed', trade)

    // Show different success messages for market vs limit orders
    if (form.value.order_type === 'market') {
      toastStore.success(`Market order executed: ${trade.ticket}`)
    } else {
      toastStore.success(`Limit order placed: ${trade.ticket}`)
    }

    // Reset form
    resetForm()
  } catch (error) {
    console.error('Trade submission failed:', error)
    toastStore.error(error.response?.data?.detail || 'Failed to place order')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.value = {
    symbol: form.value.symbol, // Keep symbol
    order_type: 'market',
    user_type: 'buy',
    volume: 0.01,
    price: null,
    stop_loss: null,
    take_profit: null
  }
  enableStopLoss.value = false
  enableTakeProfit.value = false
}

// Clear SL/TP when disabled
watch(enableStopLoss, (value) => {
  if (!value) form.value.stop_loss = null
})

watch(enableTakeProfit, (value) => {
  if (!value) form.value.take_profit = null
})

// Watch symbol changes to update price display
watch(() => form.value.symbol, () => {
  form.value.price = null // Reset limit price when symbol changes
})

const handleQuickTrade = (event) => {
  const { symbol, type, price } = event.detail
  form.value.symbol = symbol
  form.value.user_type = type
  if (type === 'buy') {
    form.value.user_type = 'buy'
  } else {
    form.value.user_type = 'sell'
  }
}

// Listen for quick trade events
onMounted(() => {
  document.addEventListener('quick-trade', handleQuickTrade)
})

onUnmounted(() => {
  document.removeEventListener('quick-trade', handleQuickTrade)
})
</script>

<style scoped>
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>