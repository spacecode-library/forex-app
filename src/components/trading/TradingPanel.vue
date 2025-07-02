<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <CurrencyDollarIcon class="w-5 h-5 mr-2 text-blue-600" />
        New Order
      </h3>
    </div>

    <form @submit.prevent="submitTrade" class="p-6 space-y-4">
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
        <select
          v-model="form.order_type"
          class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="market">Market Order</option>
          <option value="limit">Limit Order</option>
          <option value="stop">Stop Order</option>
        </select>
      </div>

      <!-- Trade Direction -->
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
        <label class="block text-sm font-medium text-gray-700 mb-2">Limit Price</label>
        <input
          v-model.number="form.price"
          type="number"
          step="0.00001"
          class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter limit price"
        />
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

      <!-- Trade Summary -->
      <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Symbol:</span>
          <span class="font-medium">{{ form.symbol }}</span>
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
          <span class="text-gray-600">Est. Margin:</span>
          <span class="font-medium">${{ estimatedMargin.toFixed(2) }}</span>
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

      <!-- Debug Info (remove this in production) -->
      <!-- <div class="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
        <strong>Debug Info:</strong><br>
        Form Valid: {{ isFormValid }}<br>
        Symbol: {{ form.symbol }}<br>
        Order Type: {{ form.order_type }}<br>
        User Type: {{ form.user_type }}<br>
        Volume: {{ form.volume }}<br>
        Volume > 0: {{ form.volume > 0 }}<br>
        Volume <= 100: {{ form.volume <= 100 }}<br>
        Price Required: {{ form.order_type === 'limit' }}<br>
        Price Provided: {{ form.price }}<br>
        Price Check: {{ (form.order_type !== 'limit' || form.price) }}
      </div> -->

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="!isFormValid || isLoading"
        :class="[
          'w-full py-3 px-4 text-sm font-semibold rounded-lg transition-colors',
          isFormValid && !isLoading
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        <div v-if="isLoading" class="flex items-center justify-center">
          <div class="spinner mr-2"></div>
          Placing Order...
        </div>
        <div v-else>
          Place {{ form.user_type?.toUpperCase() || '' }} Order
        </div>
      </button>

      <!-- Balance Info -->
      <div class="text-center text-sm text-gray-600 pt-2 border-t">
        Available Balance: <span class="font-medium">${{ balance.toFixed(2) }}</span>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useTradingStore } from '@/stores/trading'
import { useAuthStore } from '@/stores/auth'
import { CurrencyDollarIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'

const emit = defineEmits(['trade-placed'])

const tradingStore = useTradingStore()
const authStore = useAuthStore()
const route = useRoute()

const form = ref({
  symbol: ref(route.query.symbol ).value ? `${ref(route.query.symbol ).value}`:'EURUSD',
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

// Fixed the logical error in form validation
const isFormValid = computed(() => {
  return form.value.symbol &&
         form.value.order_type &&
         form.value.user_type &&
         form.value.volume > 0 &&
         form.value.volume <= 100 &&
         (form.value.order_type !== 'limit' || form.value.price) // Fixed this line
})

const formatPrice = (price) => {
  return tradingStore.formatPrice(price)
}

const submitTrade = async () => {
  if (!isFormValid.value) return

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

    // Reset form
    resetForm()
  } catch (error) {
    console.error('Trade submission failed:', error)
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

// Clear SL/TP when disabled
watch(enableStopLoss, (value) => {
  if (!value) form.value.stop_loss = null
})

watch(enableTakeProfit, (value) => {
  if (!value) form.value.take_profit = null
})

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