<template>
  <div class=" flex justify-between hover:bg-gray-50 transition-colors"
  @click="$emit('trade', { symbol })"
  >
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center">
        <h4 class="text-lg font-semibold text-gray-900">{{ symbol }}</h4>
        <!-- <div
          v-if="price"
          :class="[
            'ml-2 w-2 h-2 rounded-full',
            getPriceDirectionClass(price.direction)
          ]"
        ></div> -->
      </div>
      <!-- <div class="text-xs text-gray-500">
        {{ formatTime(price?.timestamp) }}
      </div> -->
    </div>

    <div v-if="price" class="space-y-2">
      <!-- Bid/Ask Prices -->
      <div class="flex justify-between"
      >
        <div class="text-center">
          <!-- <div class="text-xs text-gray-500 mb-1">Bid</div> -->
          <div :class="[
            'text-xl font-mono font-semibold px-2 py-1 rounded',
            getPriceClass(price.direction, 'bid')
          ]">
            {{ formatPrice(price.bid) }}
          </div>
        </div>
        <div class="text-center">
          <!-- <div class="text-xs text-gray-500 mb-1">Ask</div> -->
          <div :class="[
            'text-lg font-mono font-semibold px-2 py-1 rounded',
            getPriceClass(price.direction, 'ask')
          ]">
            {{ formatPrice(price.ask) }}
          </div>
        </div>
      </div>

      <!-- Spread -->
      <!-- <div class="text-center">
        <div class="text-xs text-gray-500">
          Spread: {{ formatSpread(price.spread) }} pips
        </div>
      </div> -->

      <!-- Quick Trade Buttons -->
      <!-- <div class="grid grid-cols-2 gap-2 mt-3">
        <button
          @click="$emit('trade', { symbol, type: 'sell' })"
          class="bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
        >
          SELL {{ formatPrice(price.bid) }}
        </button>
        <button
          @click="$emit('trade', { symbol, type: 'buy' })"
          class="bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
        >
          BUY {{ formatPrice(price.ask) }}
        </button>
      </div> -->
    </div>

    <div v-else class="text-center py-4 text-gray-500">
      <div class="animate-pulse">Loading price...</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  symbol: {
    type: String,
    required: true
  },
  price: {
    type: Object,
    default: null
  }
})

defineEmits(['trade'])

const formatPrice = (price) => {
  if (!price) return '0.00000'
  
  // Different precision for different symbols
  const precision = props.symbol.includes('JPY') ? 3 : 3
  return Number(price).toFixed(precision)
}

const formatSpread = (spread) => {
  if (!spread) return '0.0'
  
  const multiplier = props.symbol.includes('JPY') ? 100 : 10000
  return (spread * multiplier).toFixed(1)
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getPriceDirectionClass = (direction) => {
  switch (direction) {
    case 'up':
      return 'bg-green-500 animate-pulse'
    case 'down':
      return 'bg-red-500 animate-pulse'
    default:
      return 'bg-gray-400'
  }
}

const getPriceClass = (direction, type) => {
  const baseClass = 'transition-colors duration-300'
  
  switch (direction) {
    case 'up':
      return `${baseClass}  text-blue-500 animate-price-up`
    case 'down':
      return `${baseClass}  text-red-500 animate-price-down`
    default:
      return `${baseClass}  text-gray-800`
  }
}
</script>