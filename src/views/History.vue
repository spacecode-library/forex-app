<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Trade History</h1>
        <p class="text-gray-600">View your complete trading history and performance</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Symbol</label>
            <select
              v-model="filters.symbol"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Symbols</option>
              <option value="EURUSD">EUR/USD</option>
              <option value="USDJPY">USD/JPY</option>
              <option value="XAUUSD">XAU/USD</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="filters.status"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="EXECUTED">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              v-model="filters.fromDate"
              type="date"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              v-model="filters.toDate"
              type="date"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div class="flex justify-between items-center mt-4">
          <div class="flex space-x-2">
            <button
              @click="applyFilters"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
            <button
              @click="clearFilters"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear
            </button>
          </div>
          
          <button
            @click="exportHistory"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Export CSV
          </button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ChartBarIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Total Trades</p>
              <p class="text-2xl font-semibold text-gray-900">{{ filteredTrades.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <TrophyIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Winning Trades</p>
              <p class="text-2xl font-semibold text-green-600">{{ winningTrades }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <AcademicCapIcon class="h-8 w-8 text-purple-600" />
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Win Rate</p>
              <p class="text-2xl font-semibold text-purple-600">{{ winRate }}%</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CurrencyDollarIcon :class="[
                'h-8 w-8',
                totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
              ]" />
            </div>
            <div class="ml-5">
              <p class="text-sm font-medium text-gray-500">Total P&L</p>
              <p :class="[
                'text-2xl font-semibold',
                totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ formatCurrency(totalProfit) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Trades Table -->
      <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Trade Details</h2>
          <div class="text-sm text-gray-500">
            Showing {{ paginatedTrades.length }} of {{ filteredTrades.length }} trades
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    @click="sortBy('ticket')">
                  <div class="flex items-center">
                    Ticket
                    <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    @click="sortBy('symbol')">
                  <div class="flex items-center">
                    Symbol
                    <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                  </div>
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
                  Exit Price
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P&L
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    @click="sortBy('open_time')">
                  <div class="flex items-center">
                    Open Time
                    <ChevronUpDownIcon class="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Close Time
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="paginatedTrades.length === 0">
                <td colspan="10" class="px-6 py-12 text-center">
                  <div class="text-gray-500">
                    <ClockIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 class="text-sm font-medium">No trades found</h3>
                    <p class="text-sm mt-1">Try adjusting your filters or start trading.</p>
                  </div>
                </td>
              </tr>
              
              <tr
                v-for="trade in paginatedTrades"
                :key="trade.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ trade.ticket }}
                </td>
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
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {{ formatPrice(trade.entry_price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {{ trade.exit_price ? formatPrice(trade.exit_price) : '---' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                  <span :class="[
                    trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ formatCurrency(trade.profit) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDateTime(trade.open_time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ trade.close_time ? formatDateTime(trade.close_time) : '---' }}
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

        <!-- Pagination -->
        <div v-if="filteredTrades.length > itemsPerPage" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to 
                  {{ Math.min(currentPage * itemsPerPage, filteredTrades.length) }} of 
                  {{ filteredTrades.length }} results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTradingStore } from '@/stores/trading'
import { useToastStore } from '@/stores/toast'

import {
  ChartBarIcon,
  TrophyIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChevronUpDownIcon
} from '@heroicons/vue/24/outline'

const tradingStore = useTradingStore()
const toastStore = useToastStore()

const filters = ref({
  symbol: '',
  status: '',
  fromDate: '',
  toDate: ''
})

const sortField = ref('open_time')
const sortOrder = ref('desc')
const currentPage = ref(1)
const itemsPerPage = ref(20)

const tradeHistory = computed(() => tradingStore.tradeHistory)

const filteredTrades = computed(() => {
  let trades = [...tradeHistory.value]

  // Apply filters
  if (filters.value.symbol) {
    trades = trades.filter(trade => trade.symbol === filters.value.symbol)
  }
  
  if (filters.value.status) {
    trades = trades.filter(trade => trade.status === filters.value.status)
  }
  
  if (filters.value.fromDate) {
    const fromDate = new Date(filters.value.fromDate)
    trades = trades.filter(trade => new Date(trade.open_time) >= fromDate)
  }
  
  if (filters.value.toDate) {
    const toDate = new Date(filters.value.toDate)
    toDate.setHours(23, 59, 59, 999)
    trades = trades.filter(trade => new Date(trade.open_time) <= toDate)
  }

  // Apply sorting
  trades.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]
    
    if (sortField.value === 'open_time' || sortField.value === 'close_time') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }
    
    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return trades
})

const paginatedTrades = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTrades.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredTrades.value.length / itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const winningTrades = computed(() => {
  return filteredTrades.value.filter(trade => trade.profit > 0).length
})

const winRate = computed(() => {
  const closedTrades = filteredTrades.value.filter(trade => trade.status === 'CLOSED')
  if (closedTrades.length === 0) return 0
  const winning = closedTrades.filter(trade => trade.profit > 0).length
  return ((winning / closedTrades.length) * 100).toFixed(1)
})

const totalProfit = computed(() => {
  return filteredTrades.value.reduce((sum, trade) => sum + trade.profit, 0)
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

const formatDateTime = (datetime) => {
  return new Date(datetime).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
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

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'desc'
  }
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  filters.value = {
    symbol: '',
    status: '',
    fromDate: '',
    toDate: ''
  }
  currentPage.value = 1
}

const exportHistory = () => {
  const csvContent = generateCSV(filteredTrades.value)
  downloadCSV(csvContent, 'trade-history.csv')
  toastStore.success('Trade history exported successfully')
}

const generateCSV = (trades) => {
  const headers = [
    'Ticket', 'Symbol', 'Type', 'Volume', 'Entry Price', 'Exit Price', 
    'P&L', 'Open Time', 'Close Time', 'Status'
  ]
  
  const rows = trades.map(trade => [
    trade.ticket,
    trade.symbol,
    trade.user_type,
    trade.volume,
    trade.entry_price || '',
    trade.exit_price || '',
    trade.profit,
    trade.open_time,
    trade.close_time || '',
    trade.status
  ])
  
  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Reset pagination when filters change
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

onMounted(async () => {
  await tradingStore.fetchTradeHistory(100)
})
</script>