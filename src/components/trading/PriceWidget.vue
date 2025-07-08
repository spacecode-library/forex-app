<!-- <template>
  <div class=" flex justify-between hover:bg-gray-50 transition-colors"
  @click="$emit('trade', { symbol })"
  >
    <div class=" mb-3">
      <div class="flex items-center">
        <h4 class="text-lg font-semibold text-gray-900">{{ symbol }}</h4>
      </div>
      <div class="text-xs text-gray-500">
        {{ formatTime(price?.timestamp) }}
      </div>
    </div>
    <div v-if="price" class="space-y-2">
      <div class="flex justify-between"
      >
        <div class="text-center">
          <div :class="[
            'text-xl font-mono font-semibold px-2 py-1 rounded',
            getPriceClass(price.direction, 'bid')
          ]">
            {{ formatPrice(price.bid) }}
          </div>
        </div>
        <div class="text-center">
          <div :class="[
            'text-lg font-mono font-semibold px-2 py-1 rounded',
            getPriceClass(price.direction, 'ask')
          ]">
            {{ formatPrice(price.ask) }}
          </div>
        </div>
      </div>
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
</script> -->

<!-- 
<template>
  <div class="bg-gray-800 text-white border-b border-gray-700 transition-colors hover:bg-gray-750">
    <div class="flex items-center justify-between py-2 px-3">
      <div class="flex flex-col min-w-[100px]">
        <div class="flex items-center gap-2">
          <span class="text-white font-semibold text-sm">{{ symbol }}</span>
          <TrendingUpIcon v-if="price?.direction === 'up'" class="w-3 h-3 text-blue-400" />
          <TrendingDownIcon v-if="price?.direction === 'down'" class="w-3 h-3 text-red-400" />
          <MinusIcon v-if="!price?.direction" class="w-3 h-3 text-gray-500" />
        </div>
        <div class="text-xs text-gray-400">{{ formatTime(price?.timestamp) }}</div>
      </div>

      <div class="flex flex-col items-center min-w-[80px]">
        <div :class="[
          'text-sm font-medium',
          getChangeColor(price?.change)
        ]">
          {{ formatChange(price?.change || 0) }}
        </div>
        <div :class="[
          'text-xs',
          getChangeColor(price?.change)
        ]">
          {{ formatChangePercent(price?.changePercent || 0) }}
        </div>
      </div>

      <div class="text-right min-w-[100px]">
        <div :class="getPriceClasses(price?.direction, price?.change)">
          {{ formatPrice(price?.bid || 0) }}
          <sup class="text-xs">{{ getLastDigit(price?.bid || 0) }}</sup>
        </div>
      </div>

      <div class="text-right min-w-[100px]">
        <div :class="getPriceClasses(price?.direction, price?.change)">
          {{ formatPrice(price?.ask || 0) }}
          <sup class="text-xs">{{ getLastDigit(price?.ask || 0) }}</sup>
        </div>
      </div>

      <div class="flex flex-col text-xs text-gray-400 min-w-[120px] text-right">
        <div>H: {{ formatPrice(price?.high || price?.ask || 0) }}</div>
        <div>L: {{ formatPrice(price?.low || price?.bid || 0) }}</div>
      </div>

      <div class="opacity-0 hover:opacity-100 transition-opacity flex gap-1 ml-2">
        <button
          @click="$emit('trade', { symbol, type: 'sell' })"
          class="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition-colors"
        >
          SELL
        </button>
        <button
          @click="$emit('trade', { symbol, type: 'buy' })"
          class="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded transition-colors"
        >
          BUY
        </button>
      </div>
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
  if (!price || isNaN(price)) return '0.00000'
  
  if (props.symbol.includes('JPY')) {
    return Number(price).toFixed(3)
  } else if (props.symbol === 'XAUUSD') {
    return Number(price).toFixed(2)
  } else {
    return Number(price).toFixed(5)
  }
}

const getLastDigit = (price) => {
  if (!price || isNaN(price)) return '0'
  const formatted = formatPrice(price)
  return formatted.slice(-1)
}

const formatChange = (change) => {
  if (!change || isNaN(change)) return '+0.00000'
  const formatted = formatPrice(Math.abs(change))
  return `${change >= 0 ? '+' : '-'}${formatted}`
}

const formatChangePercent = (percent) => {
  if (!percent || isNaN(percent)) return '+0.00%'
  return `${percent >= 0 ? '+' : ''}${Number(percent).toFixed(2)}%`
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

const getChangeColor = (change) => {
  if (!change) return 'text-gray-400'
  return change >= 0 ? 'text-blue-400' : 'text-red-400'
}

const getPriceClasses = (direction, change) => {
  const baseClasses = "font-mono font-semibold text-lg transition-all duration-300"
  
  if (direction === 'up') {
    return `${baseClasses} text-blue-400 animate-pulse`
  } else if (direction === 'down') {
    return `${baseClasses} text-red-400 animate-pulse`
  }
  
  if (change > 0) {
    return `${baseClasses} text-blue-400`
  } else if (change < 0) {
    return `${baseClasses} text-red-400`
  }
  
  return `${baseClasses} text-gray-300`
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: #374151;
}

.hover\:bg-gray-750:hover {
  background-color: #374151;
}
</style> -->



<template>
  <div class="text-gray-900 transition-colors">
    <div class="flex items-center justify-between py-2 px-3"
      @click="$emit('trade', { symbol, type: ''})"
    >
      <!-- Symbol and Time -->
      <div class="flex flex-col min-w-[100px]">
        <div class="flex items-center gap-2">
          <span class="text-gray-900 font-semibold text-sm">{{ symbol }}</span>
          <TrendingUpIcon v-if="price?.direction === 'up'" class="w-3 h-3 text-blue-400" />
          <TrendingDownIcon v-if="price?.direction === 'down'" class="w-3 h-3 text-red-400" />
          <MinusIcon v-if="!price?.direction" class="w-3 h-3 text-gray-500" />
        </div>
        <div class="text-xs text-gray-400">{{ formatTime(price?.timestamp) }}</div>
      </div>


      <!-- Bid Price (Industry Standard: Price you can SELL at) -->
      <div class="text- min-w-[100px]">
        <div :class="getBidPriceClasses()">
          {{ formatPrice(price?.bid || 0) }}
          <sup class="text-xs">{{ getLastDigit(price?.bid || 0) }}</sup>
          <div class="text-xs text-start">
          <span class="text-gray-400 ">L: {{ formatPrice(price?.low || price?.bid || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- Ask Price (Industry Standard: Price you can BUY at) -->
      <div class="text- min-w-[100px]">
        <div :class="getAskPriceClasses()">
          {{ formatPrice(price?.ask || 0) }}
          <sup class="text-xs">{{ getLastDigit(price?.ask || 0) }}</sup>
          <div class="text-xs text-start">
          <span class="text-gray-400">H: {{ formatPrice(price?.high || price?.ask || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- Spread (Industry Standard: Ask - Bid in pips) -->
      <!-- <div class="text-center min-w-[70px]">
        <div class="text-xs text-gray-400 mb-1">SPREAD</div>
        <div class="text-sm font-mono text-yellow-400">
          {{ formatSpread(price?.spread_pips || calculateSpreadPips()) }}
        </div>
      </div> -->

      <!-- Daily High/Low (Industry Standard) -->
      <!-- <div class="flex  text-xs text-gray-400 min-w-[120px] text-right">
        <div class="mb-1 mr-1">
          <span class="text-green-400">H:</span> {{ formatPrice(price?.high || price?.ask || 0) }}
        </div>
        <div>
          <span class="text-red-400">L:</span> {{ formatPrice(price?.low || price?.bid || 0) }}
        </div>
      </div> -->

      <!-- Quick Trade Buttons (Industry Standard Layout) -->
      <!-- <div class="flex flex-col gap-1 ml-2 min-w-[60px]">
        <button
          @click="$emit('trade', { symbol, type: 'sell', price: price?.bid })"
          class="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition-colors font-semibold"
        >
          SELL {{ formatPriceShort(price?.bid || 0) }}
        </button>
        <button
          @click="$emit('trade', { symbol, type: 'buy', price: price?.ask })"
          class="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded transition-colors font-semibold"
        >
          BUY {{ formatPriceShort(price?.ask || 0) }}
        </button>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
// import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from '@heroicons/vue/24/outline'

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

// Industry Standard: Price formatting based on symbol specifications
const formatPrice = (price) => {
  if (!price || isNaN(price)) return '0.00000'
  
  // Industry standard decimal places
  if (props.symbol.includes('JPY')) {
    return Number(price).toFixed(3)  // JPY pairs: 3 decimal places
  } else if (props.symbol === 'XAUUSD') {
    return Number(price).toFixed(2)  // Gold: 2 decimal places  
  } else {
    return Number(price).toFixed(5)  // Major pairs: 5 decimal places
  }
}

// Short price format for buttons
const formatPriceShort = (price) => {
  if (!price || isNaN(price)) return '0.00'
  
  if (props.symbol.includes('JPY')) {
    return Number(price).toFixed(2)
  } else if (props.symbol === 'XAUUSD') {
    return Number(price).toFixed(1)
  } else {
    return Number(price).toFixed(4)
  }
}

const getLastDigit = (price) => {
  if (!price || isNaN(price)) return '0'
  const formatted = formatPrice(price)
  return formatted.slice(-1)
}

// Industry Standard: Daily change (Current - Daily Open)
const formatDailyChange = (change) => {
  if (!change || isNaN(change)) return '+0.00000'
  const formatted = formatPrice(Math.abs(change))
  return `${change >= 0 ? '+' : '-'}${formatted}`
}

const formatDailyChangePercent = (percent) => {
  if (!percent || isNaN(percent)) return '+0.00%'
  return `${percent >= 0 ? '+' : ''}${Number(percent).toFixed(2)}%`
}

// Industry Standard: Spread in pips
const calculateSpreadPips = () => {
  if (!props.price?.ask || !props.price?.bid) return 0
  const spread = props.price.ask - props.price.bid
  return convertToPips(spread)
}

const convertToPips = (priceDiff) => {
  if (props.symbol.includes('JPY')) {
    return priceDiff * 100      // JPY: 1 pip = 0.01
  } else if (props.symbol === 'XAUUSD') {
    return priceDiff * 10       // Gold: 1 pip = 0.10
  } else {
    return priceDiff * 10000    // Major pairs: 1 pip = 0.0001
  }
}

const formatSpread = (spreadPips) => {
  if (!spreadPips || isNaN(spreadPips)) return '0.0'
  return Math.abs(spreadPips).toFixed(1)
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

// Industry Standard: Color coding for daily change
const getDailyChangeColor = (change) => {
  if (!change || change === 0) return 'text-gray-400'
  return change > 0 ? 'text-blue-400' : 'text-red-400'
}

// Industry Standard: Price highlighting based on movement
const getBidPriceClasses = () => {
  const baseClasses = "font-mono font-semibold text-lg transition-all duration-300"
  
  if (props.price?.direction === 'up') {
    return `${baseClasses} text-blue-400 animate-pulse`
  } else if (props.price?.direction === 'down') {
    return `${baseClasses} text-red-400 animate-pulse`
  }
  
  // Static color based on daily change
  const change = props.price?.change || 0
  if (change > 0) {
    return `${baseClasses} text-blue-400`
  } else if (change < 0) {
    return `${baseClasses} text-red-400`
  }
  
  return `${baseClasses} text-gray-300`
}

const getAskPriceClasses = () => {
  // Ask price usually follows bid price movement
  return getBidPriceClasses()
}

// Industry Standard: Determine if spread is narrow/wide
const getSpreadClass = () => {
  const spreadPips = calculateSpreadPips()
  
  // Industry standard spread ranges
  if (props.symbol.includes('JPY')) {
    return spreadPips <= 2 ? 'text-green-400' : spreadPips <= 5 ? 'text-yellow-400' : 'text-red-400'
  } else if (props.symbol === 'XAUUSD') {
    return spreadPips <= 5 ? 'text-green-400' : spreadPips <= 15 ? 'text-yellow-400' : 'text-red-400'
  } else {
    return spreadPips <= 3 ? 'text-green-400' : spreadPips <= 8 ? 'text-yellow-400' : 'text-red-400'
  }
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: #374151;
}

.hover\:bg-gray-750:hover {
  background-color: #374151;
}

/* Industry standard animation for price updates */
@keyframes price-flash {
  0% { background-color: rgba(59, 130, 246, 0.3); }
  100% { background-color: transparent; }
}

.animate-price-flash {
  animation: price-flash 0.5s ease-out;
}
</style>