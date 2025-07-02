<template>
  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-yellow-800">Position Debug Panel</h3>
      <div class="flex space-x-2">
        <button
          @click="runFullDiagnostic"
          :disabled="isLoading"
          class="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
        >
          {{ isLoading ? 'Running...' : 'Run Diagnostic' }}
        </button>
        <button
          @click="clearLogs"
          class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
        >
          Clear Logs
        </button>
        <button
          @click="visible = false"
          class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Store State -->
      <div class="bg-white rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3">Frontend Store State</h4>
        <div class="space-y-2 text-sm">
          <div><strong>Positions in Store:</strong> {{ storeState.positions_count }}</div>
          <div><strong>Update Trigger:</strong> {{ storeState.update_trigger }}</div>
          <div><strong>Missing IDs:</strong> {{ storeState.missing_ids.length }}</div>
          <div><strong>WebSocket Connected:</strong> {{ wsStore.isConnected }}</div>
          <div><strong>Last Price Update:</strong> {{ formatTime(storeState.last_price_update) }}</div>
        </div>
        
        <div class="mt-3">
          <h5 class="font-medium text-gray-700 mb-2">Position IDs in Store:</h5>
          <div class="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded text-xs">
            <div v-for="pos in storeState.position_ids" :key="pos.id" class="flex justify-between">
              <span>{{ pos.id.substring(0, 8) }}...</span>
              <span class="text-blue-600">{{ pos.symbol }}</span>
            </div>
            <div v-if="storeState.position_ids.length === 0" class="text-gray-500 italic">
              No positions in store
            </div>
          </div>
        </div>
      </div>

      <!-- API State -->
      <div class="bg-white rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3">API/Database State</h4>
        <div class="space-y-2 text-sm">
          <div><strong>Positions from API:</strong> {{ apiState.positions_count }}</div>
          <div><strong>Last API Call:</strong> {{ formatTime(apiState.last_fetch) }}</div>
          <div><strong>API Status:</strong> 
            <span :class="apiState.status === 'success' ? 'text-green-600' : 'text-red-600'">
              {{ apiState.status }}
            </span>
          </div>
        </div>
        
        <div class="mt-3">
          <h5 class="font-medium text-gray-700 mb-2">Position IDs from API:</h5>
          <div class="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded text-xs">
            <div v-for="pos in apiState.position_ids" :key="pos.id" class="flex justify-between">
              <span>{{ pos.id.substring(0, 8) }}...</span>
              <span class="text-blue-600">{{ pos.symbol }}</span>
            </div>
            <div v-if="apiState.position_ids.length === 0" class="text-gray-500 italic">
              No positions from API
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sync Analysis -->
    <div class="bg-white rounded-lg p-4 mt-4">
      <h4 class="font-semibold text-gray-800 mb-3">Synchronization Analysis</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <div class="font-medium text-gray-700">Only in Store:</div>
          <div class="bg-blue-50 p-2 rounded min-h-[60px]">
            <div v-for="id in onlyInStore" :key="id" class="text-blue-700">
              {{ id.substring(0, 8) }}...
            </div>
            <div v-if="onlyInStore.length === 0" class="text-gray-500 italic">None</div>
          </div>
        </div>
        
        <div>
          <div class="font-medium text-gray-700">Only in API:</div>
          <div class="bg-red-50 p-2 rounded min-h-[60px]">
            <div v-for="id in onlyInAPI" :key="id" class="text-red-700">
              {{ id.substring(0, 8) }}...
            </div>
            <div v-if="onlyInAPI.length === 0" class="text-gray-500 italic">None</div>
          </div>
        </div>
        
        <div>
          <div class="font-medium text-gray-700">In Both:</div>
          <div class="bg-green-50 p-2 rounded min-h-[60px]">
            <div v-for="id in inBoth" :key="id" class="text-green-700">
              {{ id.substring(0, 8) }}...
            </div>
            <div v-if="inBoth.length === 0" class="text-gray-500 italic">None</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-2 mt-4">
      <button
        @click="syncFromAPI"
        :disabled="isLoading"
        class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        Force Sync from API
      </button>
      <button
        @click="testWebSocket"
        class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
      >
        Test WebSocket
      </button>
      <button
        @click="debugStoreState"
        class="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
      >
        Log Store State
      </button>
      <button
        @click="testAPIEndpoint"
        :disabled="isLoading"
        class="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50"
      >
        Test API Endpoint
      </button>
    </div>

    <!-- Debug Logs -->
    <div class="bg-white rounded-lg p-4 mt-4">
      <h4 class="font-semibold text-gray-800 mb-3">Debug Logs</h4>
      <div class="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs max-h-64 overflow-y-auto">
        <div v-for="(log, index) in debugLogs" :key="index" class="mb-1">
          [{{ log.timestamp }}] {{ log.message }}
        </div>
        <div v-if="debugLogs.length === 0" class="text-gray-500">
          No debug logs yet. Click "Run Diagnostic" to start.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTradingStore } from '@/stores/trading'
import { useWebSocketStore } from '@/stores/websocket'
import { tradingAPI, debugAPI } from '@/services/api'

const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const tradingStore = useTradingStore()
const wsStore = useWebSocketStore()

const isLoading = ref(false)
const debugLogs = ref([])
const apiState = ref({
  positions_count: 0,
  position_ids: [],
  last_fetch: null,
  status: 'unknown'
})

const storeState = computed(() => tradingStore.debugStoreState())

const onlyInStore = computed(() => {
  const storeIds = storeState.value.position_ids.map(p => p.id)
  const apiIds = apiState.value.position_ids.map(p => p.id)
  return storeIds.filter(id => !apiIds.includes(id))
})

const onlyInAPI = computed(() => {
  const storeIds = storeState.value.position_ids.map(p => p.id)
  const apiIds = apiState.value.position_ids.map(p => p.id)
  return apiIds.filter(id => !storeIds.includes(id))
})

const inBoth = computed(() => {
  const storeIds = storeState.value.position_ids.map(p => p.id)
  const apiIds = apiState.value.position_ids.map(p => p.id)
  return storeIds.filter(id => apiIds.includes(id))
})

const log = (message) => {
  const timestamp = new Date().toLocaleTimeString()
  debugLogs.value.push({ timestamp, message })
  console.log(`[PositionDebug] ${message}`)
  
  // Keep only last 50 logs
  if (debugLogs.value.length > 50) {
    debugLogs.value = debugLogs.value.slice(-50)
  }
}

const formatTime = (time) => {
  return time ? new Date(time).toLocaleTimeString() : 'Never'
}

const clearLogs = () => {
  debugLogs.value = []
}

const debugStoreState = () => {
  const state = tradingStore.debugStoreState()
  log(`Store state: ${JSON.stringify(state, null, 2)}`)
}

const testAPIEndpoint = async () => {
  isLoading.value = true
  try {
    log('Testing API endpoint...')
    const positions = await debugAPI.testPositions()
    
    apiState.value = {
      positions_count: positions.length,
      position_ids: positions.map(p => ({ id: p.id, symbol: p.symbol })),
      last_fetch: new Date(),
      status: 'success'
    }
    
    log(`API test successful: ${positions.length} positions`)
  } catch (error) {
    log(`API test failed: ${error.message}`)
    apiState.value.status = 'error'
  } finally {
    isLoading.value = false
  }
}

const syncFromAPI = async () => {
  isLoading.value = true
  try {
    log('Force syncing from API...')
    await tradingStore.syncPositions()
    await testAPIEndpoint() // Refresh API state
    log('Sync completed successfully')
  } catch (error) {
    log(`Sync failed: ${error.message}`)
  } finally {
    isLoading.value = false
  }
}

const testWebSocket = () => {
  log(`WebSocket status: ${wsStore.isConnected ? 'Connected' : 'Disconnected'}`)
  
  if (wsStore.isConnected) {
    // Send a test message
    wsStore.sendMessage({ type: 'ping', timestamp: new Date().toISOString() })
    log('Sent WebSocket ping message')
  } else {
    log('WebSocket not connected - attempting reconnection')
    wsStore.forceReconnect()
  }
}

const runFullDiagnostic = async () => {
  isLoading.value = true
  log('🔍 Starting full diagnostic...')
  
  try {
    // Test store state
    log('1. Checking store state...')
    debugStoreState()
    
    // Test API
    log('2. Testing API endpoint...')
    await testAPIEndpoint()
    
    // Test WebSocket
    log('3. Testing WebSocket...')
    testWebSocket()
    
    // Compare states
    log('4. Analyzing synchronization...')
    log(`Store has ${storeState.value.positions_count} positions`)
    log(`API has ${apiState.value.positions_count} positions`)
    log(`Only in store: ${onlyInStore.value.length}`)
    log(`Only in API: ${onlyInAPI.value.length}`)
    log(`In both: ${inBoth.value.length}`)
    
    if (onlyInAPI.value.length > 0) {
      log('⚠️ Found positions in API that are missing from store!')
      onlyInAPI.value.forEach(id => {
        log(`Missing position ID: ${id}`)
      })
    }
    
    if (onlyInStore.value.length > 0) {
      log('⚠️ Found positions in store that are not in API!')
      onlyInStore.value.forEach(id => {
        log(`Extra position ID: ${id}`)
      })
    }
    
    if (onlyInAPI.value.length === 0 && onlyInStore.value.length === 0) {
      log('✅ Store and API are synchronized')
    }
    
    log('🔍 Full diagnostic completed')
    
  } catch (error) {
    log(`❌ Diagnostic failed: ${error.message}`)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  log('Position Debug Panel initialized')
  await testAPIEndpoint()
})
</script>