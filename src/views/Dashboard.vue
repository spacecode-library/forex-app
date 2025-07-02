<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-4 flex items-center gap-x-2">
        <Bars3Icon class="w-6 h-6" />
        <h1 class="text-lg font-semibold text-gray-800">
          Quotes
        </h1>
      </div>

      <!-- Quick Stats -->
      <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Account Balance"
          :value="formatCurrency(tradingSummary.balance || 0)"
          icon="BanknotesIcon"
          color="blue"
        />
        <StatCard
          title="Total P&L"
          :value="formatCurrency(tradingSummary.total_profit || 0)"
          :icon="tradingSummary.total_profit >= 0 ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'"
          :color="tradingSummary.total_profit >= 0 ? 'green' : 'red'"
        />
        <StatCard
          title="Open Positions"
          :value="String(tradingSummary.open_positions || 0)"
          icon="ChartBarIcon"
          color="purple"
        />
        <StatCard
          title="Win Rate"
          :value="`${(tradingSummary.win_rate || 0).toFixed(1)}%`"
          icon="AcademicCapIcon"
          color="yellow"
        />
      </div> -->

      
          <div class="">
            <div class="p-2">
              <div class="space-y-4">
                <PriceWidget
                  v-for="symbol in ['EURUSD', 'USDJPY', 'XAUUSD']"
                  :key="symbol"
                  :symbol="symbol"
                  :price="prices[symbol]"
                  @trade="handleQuickTrade"
                />
              </div>
            </div>
          </div>
        <!-- </div> -->

        <!-- Recent Activity & Open Positions -->
        <!-- <div class="lg:col-span-2 space-y-8"> -->
         
          <!-- <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <ChartBarIcon class="w-5 h-5 mr-2 text-blue-600" />
                Open Positions
              </h3>
              <router-link
                to="/positions"
                class="text-sm text-blue-600 hover:text-blue-500"
              >
                View all
              </router-link>
            </div>
            <div class="overflow-hidden">
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
                      Entry
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      P&L
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="openPositions.length === 0">
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                      No open positions
                    </td>
                  </tr>
                  <tr
                    v-for="position in openPositions.slice(0, 5)"
                    :key="position.symbol"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ position.symbol }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        position.user_type === 'buy' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      ]">
                        {{ position.user_type.toUpperCase() }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ position.volume }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatPrice(position.entry_price) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatPrice(position.current_price) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <span :class="[
                        'font-semibold',
                        position.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      ]">
                        {{ formatCurrency(position.unrealized_pnl) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> -->

          <!-- Recent Trades -->
          <!-- <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <ClockIcon class="w-5 h-5 mr-2 text-gray-600" />
                Recent Trades
              </h3>
              <router-link
                to="/history"
                class="text-sm text-blue-600 hover:text-blue-500"
              >
                View all
              </router-link>
            </div>
            <div class="overflow-hidden">
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
                      P&L
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="recentTrades.length === 0">
                    <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                      No recent trades
                    </td>
                  </tr>
                  <tr
                    v-for="trade in recentTrades.slice(0, 5)"
                    :key="trade.id"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ trade.symbol }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        trade.user_type === 'buy' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      ]">
                        {{ trade.user_type.toUpperCase() }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ trade.volume }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <span :class="[
                        'font-semibold',
                        trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      ]">
                        {{ formatCurrency(trade.profit) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        getStatusClass(trade.status)
                      ]">
                        {{ trade.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> -->
        <!-- </div> -->
      <!-- </div> -->
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
  BanknotesIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  AcademicCapIcon,
   Bars3Icon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const tradingStore = useTradingStore()

const user = computed(() => authStore.user)
const prices = computed(() => tradingStore.symbolPrices)
const openPositions = computed(() => tradingStore.openPositions)
const recentTrades = computed(() => tradingStore.tradeHistory)
const tradingSummary = computed(() => tradingStore.tradingSummary)

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

const formatPrice = (price) => {
  return tradingStore.formatPrice(price)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'EXECUTED':
      return 'bg-green-100 text-green-800'
    case 'CLOSED':
      return 'bg-gray-100 text-gray-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-yellow-100 text-yellow-800'
  }
}

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
</script>