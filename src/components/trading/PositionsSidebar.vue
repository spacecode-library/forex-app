<template>
  <div class="space-y-6">
    <!-- Open Positions -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-sm font-semibold text-gray-900 flex items-center">
          <ChartBarIcon class="w-4 h-4 mr-2 text-blue-600" />
          Open Positions ({{ openPositions.length }})
        </h3>
        <div class="text-xs text-gray-500">
          P&L: <span :class="totalPnL >= 0 ? 'text-green-600' : 'text-red-600'" class="font-semibold">
            {{ formatCurrency(totalPnL) }}
          </span>
        </div>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="openPositions.length === 0" class="p-4 text-center text-gray-500 text-sm">
          No open positions
        </div>
        
        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="position in openPositions"
            :key="position.symbol"
            class="p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <div class="font-medium text-sm text-gray-900">{{ position.symbol }}</div>
                <div class="flex items-center space-x-2 text-xs text-gray-500">
                  <span :class="[
                    'inline-flex px-2 py-0.5 rounded text-xs font-semibold',
                    position.user_type === 'buy' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  ]">
                    {{ position.user_type.toUpperCase() }}
                  </span>
                  <span>{{ position.volume }} lots</span>
                </div>
              </div>
              <button
                @click="closePosition(position)"
                class="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Close
              </button>
            </div>

            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600">Entry:</span>
                <span class="font-mono">{{ formatPrice(position.entry_price) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Current:</span>
                <span class="font-mono">{{ formatPrice(position.current_price) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">P&L:</span>
                <span :class="[
                  'font-semibold',
                  position.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ formatCurrency(position.unrealized_pnl) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Pips:</span>
                <span :class="[
                  'font-medium',
                  position.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ calculatePips(position) }}
                </span>
              </div>
            </div>

            <div v-if="position.stop_loss || position.take_profit" class="mt-2 pt-2 border-t border-gray-100">
              <div v-if="position.stop_loss" class="flex justify-between text-xs">
                <span class="text-gray-600">SL:</span>
                <span class="font-mono text-red-600">{{ formatPrice(position.stop_loss) }}</span>
              </div>
              <div v-if="position.take_profit" class="flex justify-between text-xs">
                <span class="text-gray-600">TP:</span>
                <span class="font-mono text-green-600">{{ formatPrice(position.take_profit) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Summary -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-4 py-3 border-b border-gray-200">
        <h3 class="text-sm font-semibold text-gray-900 flex items-center">
          <BanknotesIcon class="w-4 h-4 mr-2 text-green-600" />
          Account Summary
        </h3>
      </div>
      
      <div class="p-4 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Balance:</span>
          <span class="font-semibold text-gray-900">{{ formatCurrency(balance) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Unrealized P&L:</span>
          <span :class="[
            'font-semibold',
            totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
          ]">
            {{ formatCurrency(totalPnL) }}
          </span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Equity:</span>
          <span class="font-semibold text-gray-900">{{ formatCurrency(equity) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Used Margin:</span>
          <span class="font-medium text-gray-700">{{ formatCurrency(usedMargin) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Free Margin:</span>
          <span class="font-medium text-gray-700">{{ formatCurrency(freeMargin) }}</span>
        </div>
      </div>
    </div>

    <!-- Trading Stats -->
    <!-- <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-4 py-3 border-b border-gray-200">
        <h3 class="text-sm font-semibold text-gray-900 flex items-center">
          <AcademicCapIcon class="w-4 h-4 mr-2 text-purple-600" />
          Trading Stats
        </h3>
      </div>
      
      <div class="p-4 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Total Trades:</span>
          <span class="font-medium">{{ tradingSummary.total_trades || 0 }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Winning Trades:</span>
          <span class="font-medium text-green-600">{{ tradingSummary.winning_trades || 0 }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Win Rate:</span>
          <span class="font-medium">{{ (tradingSummary.win_rate || 0).toFixed(1) }}%</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Total P&L:</span>
          <span :class="[
            'font-semibold',
            (tradingSummary.total_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          ]">
            {{ formatCurrency(tradingSummary.total_profit || 0) }}
          </span>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTradingStore } from '@/stores/trading'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

import {
  ChartBarIcon,
  BanknotesIcon,
  AcademicCapIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['close-position'])

const tradingStore = useTradingStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const openPositions = computed(() => tradingStore.openPositions)
const tradingSummary = computed(() => tradingStore.tradingSummary)
const balance = computed(() => authStore.user?.balance || 0)

const totalPnL = computed(() => {
  return openPositions.value.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0)
})

const equity = computed(() => {
  return balance.value + totalPnL.value
})

const usedMargin = computed(() => {
  return openPositions.value.reduce((sum, pos) => sum + (pos.volume * 1000), 0)
})

const freeMargin = computed(() => {
  return equity.value - usedMargin.value
})

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

const calculatePips = (position) => {
  if (!position.entry_price || !position.current_price) return '0.0'
  
  const diff = position.user_type === 'buy' 
    ? position.current_price - position.entry_price
    : position.entry_price - position.current_price
  
  const multiplier = position.symbol.includes('JPY') ? 100 : 10000
  const pips = diff * multiplier
  
  return (pips >= 0 ? '+' : '') + pips.toFixed(1)
}

const closePosition = async (position) => {
  if (!confirm(`Are you sure you want to close ${position.symbol} position?`)) {
    return
  }

  try {
    await emit('close-position', position.id)
    toastStore.success(`Position ${position.symbol} closed successfully`)
  } catch (error) {
    toastStore.error('Failed to close position')
  }
}
</script>