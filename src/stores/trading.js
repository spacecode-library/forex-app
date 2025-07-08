// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// import { tradingAPI } from '@/services/api'
// import { useToastStore } from './toast'

// export const useTradingStore = defineStore('trading', () => {
//   const prices = ref({})
//   const positions = ref([])
//   const tradeHistory = ref([])
//   const tradingSummary = ref({})
//   const isLoading = ref(false)
//   const lastPriceUpdate = ref(null)

//   // Computed getters
//   const openPositions = computed(() => 
//     positions.value.filter(p => p.status === 'EXECUTED')
//   )

//   const totalUnrealizedPnL = computed(() => 
//     openPositions.value.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0)
//   )

//   const symbolPrices = computed(() => prices.value)

//   // Price management
//   const updatePrice = (priceData) => {
//     const { symbol, bid, ask, timestamp } = priceData
    
//     // Store previous price for comparison
//     const prevPrice = prices.value[symbol]
    
//     prices.value[symbol] = {
//       symbol,
//       bid: parseFloat(bid),
//       ask: parseFloat(ask),
//       timestamp: new Date(timestamp),
//       spread: parseFloat(ask) - parseFloat(bid),
//       direction: prevPrice ? 
//         (bid > prevPrice.bid ? 'up' : bid < prevPrice.bid ? 'down' : 'neutral') : 'neutral'
//     }
    
//     lastPriceUpdate.value = new Date()
//     console.log('📈 Price updated:', symbol, 'Bid:', bid, 'Ask:', ask)
//   }

//   const getPrice = (symbol) => {
//     return prices.value[symbol] || null
//   }

//   // Trading operations
//   const placeTrade = async (tradeData) => {
//     isLoading.value = true
//     const toastStore = useToastStore()
    
//     try {
//       const trade = await tradingAPI.placeTrade(tradeData)
      
//       // Add to positions if executed
//       if (trade.status === 'EXECUTED') {
//         positions.value.unshift(trade)
//       }
      
//       // Add to history
//       tradeHistory.value.unshift(trade)
      
//       toastStore.success(`Trade placed successfully: ${trade.ticket}`)
      
//       // Refresh summary
//       await fetchTradingSummary()
      
//       return trade
//     } catch (error) {
//       toastStore.error(error.response?.data?.detail || 'Failed to place trade')
//       throw error
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const closeTrade = async (tradeId) => {
//     isLoading.value = true
//     const toastStore = useToastStore()
    
//     try {
//       const closedTrade = await tradingAPI.closeTrade(tradeId)
      
//       // Remove from positions
//       const positionIndex = positions.value.findIndex(p => p.id === tradeId)
//       if (positionIndex !== -1) {
//         positions.value.splice(positionIndex, 1)
//       }
      
//       // Update in history
//       const historyIndex = tradeHistory.value.findIndex(t => t.id === tradeId)
//       if (historyIndex !== -1) {
//         tradeHistory.value[historyIndex] = closedTrade
//       } else {
//         tradeHistory.value.unshift(closedTrade)
//       }
      
//       toastStore.success(`Position closed: ${closedTrade.ticket}`)
      
//       // Refresh summary
//       await fetchTradingSummary()
      
//       return closedTrade
//     } catch (error) {
//       toastStore.error(error.response?.data?.detail || 'Failed to close trade')
//       throw error
//     } finally {
//       isLoading.value = false
//     }
//   }

//   // Data fetching
//   const fetchPositions = async () => {
//     try {
//       const data = await tradingAPI.getPositions()
//       positions.value = data
//     } catch (error) {
//       console.error('Failed to fetch positions:', error)
//     }
//   }

//   const fetchTradeHistory = async (limit = 50, offset = 0) => {
//     try {
//       const data = await tradingAPI.getTradeHistory(limit, offset)
      
//       if (offset === 0) {
//         tradeHistory.value = data
//       } else {
//         tradeHistory.value.push(...data)
//       }
      
//       return data
//     } catch (error) {
//       console.error('Failed to fetch trade history:', error)
//       throw error
//     }
//   }

//   const fetchTradingSummary = async () => {
//     try {
//       const data = await tradingAPI.getTradingSummary()
//       tradingSummary.value = data
//     } catch (error) {
//       console.error('Failed to fetch trading summary:', error)
//     }
//   }

//   // WebSocket updates
//   const updateTrade = (tradeData) => {
//     // Update trade in history
//     const historyIndex = tradeHistory.value.findIndex(t => t.id === tradeData.id)
//     if (historyIndex !== -1) {
//       tradeHistory.value[historyIndex] = tradeData
//     }
    
//     // Update position if open
//     if (tradeData.status === 'EXECUTED') {
//       const positionIndex = positions.value.findIndex(p => p.id === tradeData.id)
//       if (positionIndex !== -1) {
//         positions.value[positionIndex] = tradeData
//       }
//     } else {
//       // Remove from positions if closed
//       positions.value = positions.value.filter(p => p.id !== tradeData.id)
//     }
//   }

//   // const updatePosition = (positionData) => {
//   //   const index = positions.value.findIndex(p => p.id === positionData.id)
//   //   if (index !== -1) {
//   //     positions.value[index] = { ...positions.value[index], ...positionData }
//   //   }
//   // }

//   const updatePosition = (positionData) => {
//   console.log('🔄 Updating position in store:', positionData)
  
//   // Find the position in our positions array
//   const index = positions.value.findIndex(p => p.id === positionData.id)
  
//   if (index !== -1) {
//     // Update existing position
//     positions.value[index] = {
//       ...positions.value[index],
//       ...positionData,
//       current_price: positionData.current_price,
//       unrealized_pnl: positionData.unrealized_pnl
//     }
//     console.log('✅ Position updated:', positions.value[index])
//   } else {
//     // Position not found - might be a new position, add it
//     if (positionData.status === 'EXECUTED') {
//       positions.value.push(positionData)
//       console.log('➕ New position added:', positionData)
//     }
//   }
// }

//   // Initialize data
//   const initializeTradingData = async () => {
//     try {
//       await Promise.all([
//         fetchPositions(),
//         fetchTradeHistory(20),
//         fetchTradingSummary()
//       ])
//     } catch (error) {
//       console.error('Failed to initialize trading data:', error)
//     }
//   }

//   // Utility functions
//   const formatPrice = (price, digits = 5) => {
//     return typeof price === 'number' ? price.toFixed(digits) : '0.00000'
//   }

//   const formatPnL = (pnl) => {
//     const value = typeof pnl === 'number' ? pnl : 0
//     return {
//       value,
//       formatted: value.toFixed(2),
//       isPositive: value >= 0,
//       className: value >= 0 ? 'text-profit' : 'text-loss'
//     }
//   }

//   const calculatePipValue = (symbol, price1, price2) => {
//     const diff = Math.abs(price1 - price2)
//     const multiplier = symbol.includes('JPY') ? 100 : 10000
//     return Math.round(diff * multiplier)
//   }

//   return {
//     // State
//     prices,
//     positions,
//     tradeHistory,
//     tradingSummary,
//     isLoading,
//     lastPriceUpdate,
    
//     // Computed
//     openPositions,
//     totalUnrealizedPnL,
//     symbolPrices,
    
//     // Actions
//     updatePrice,
//     getPrice,
//     placeTrade,
//     closeTrade,
//     fetchPositions,
//     fetchTradeHistory,
//     fetchTradingSummary,
//     updateTrade,
//     updatePosition,
//     initializeTradingData,
    
//     // Utilities
//     formatPrice,
//     formatPnL,
//     calculatePipValue

//   }
// })

// import { defineStore } from 'pinia'
// import { ref, computed, reactive } from 'vue'
// import { tradingAPI } from '@/services/api'
// import { useToastStore } from './toast'

// export const useTradingStore = defineStore('trading', () => {
//   const prices = ref({})
//   const positions = ref([])
//   const tradeHistory = ref([])
//   const tradingSummary = ref({})
//   const isLoading = ref(false)
//   const lastPriceUpdate = ref(null)
  
//   // Add a reactive trigger for force updates
//   const positionUpdateTrigger = ref(0)

//   // Computed getters
//   const openPositions = computed(() => {
//     positionUpdateTrigger.value // Force reactivity
//     return positions.value.filter(p => p.status === 'EXECUTED')
//   })

//   const totalUnrealizedPnL = computed(() => {
//     positionUpdateTrigger.value // Force reactivity
//     return openPositions.value.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0)
//   })

//   const symbolPrices = computed(() => prices.value)

//   // Price management
//   const updatePrice = (priceData) => {
//     const { symbol, bid, ask, timestamp } = priceData
    
//     // Store previous price for comparison
//     const prevPrice = prices.value[symbol]
    
//     prices.value[symbol] = {
//       symbol,
//       bid: parseFloat(bid),
//       ask: parseFloat(ask),
//       timestamp: new Date(timestamp),
//       spread: parseFloat(ask) - parseFloat(bid),
//       direction: prevPrice ? 
//         (bid > prevPrice.bid ? 'up' : bid < prevPrice.bid ? 'down' : 'neutral') : 'neutral'
//     }
    
//     lastPriceUpdate.value = new Date()
//     console.log('📈 Price updated:', symbol, 'Bid:', bid, 'Ask:', ask)
//   }

//   const getPrice = (symbol) => {
//     return prices.value[symbol] || null
//   }

//   // Trading operations
//   const placeTrade = async (tradeData) => {
//     isLoading.value = true
//     const toastStore = useToastStore()
    
//     try {
//       const trade = await tradingAPI.placeTrade(tradeData)
      
//       // Add to positions if executed
//       if (trade.status === 'EXECUTED') {
//         positions.value = [...positions.value, trade]
//         positionUpdateTrigger.value++
//       }
      
//       // Add to history
//       tradeHistory.value = [trade, ...tradeHistory.value]
      
//       toastStore.success(`Trade placed successfully: ${trade.ticket}`)
      
//       // Refresh summary
//       await fetchTradingSummary()
      
//       return trade
//     } catch (error) {
//       toastStore.error(error.response?.data?.detail || 'Failed to place trade')
//       throw error
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const closeTrade = async (tradeId) => {
//     isLoading.value = true
//     const toastStore = useToastStore()
    
//     try {
//       const closedTrade = await tradingAPI.closeTrade(tradeId)
      
//       // Remove from positions
//       positions.value = positions.value.filter(p => p.id !== tradeId)
//       positionUpdateTrigger.value++
      
//       // Update in history
//       const historyIndex = tradeHistory.value.findIndex(t => t.id === tradeId)
//       if (historyIndex !== -1) {
//         tradeHistory.value[historyIndex] = closedTrade
//       } else {
//         tradeHistory.value = [closedTrade, ...tradeHistory.value]
//       }
      
//       toastStore.success(`Position closed: ${closedTrade.ticket}`)
      
//       // Refresh summary
//       await fetchTradingSummary()
      
//       return closedTrade
//     } catch (error) {
//       toastStore.error(error.response?.data?.detail || 'Failed to close trade')
//       throw error
//     } finally {
//       isLoading.value = false
//     }
//   }

//   // Data fetching
//   const fetchPositions = async () => {
//     try {
//       const data = await tradingAPI.getPositions()
//       positions.value = [...data] // Create new array reference
//       positionUpdateTrigger.value++
//       console.log('📊 Positions fetched:', positions.value)
//     } catch (error) {
//       console.error('Failed to fetch positions:', error)
//     }
//   }

//   const fetchTradeHistory = async (limit = 50, offset = 0) => {
//     try {
//       const data = await tradingAPI.getTradeHistory(limit, offset)
      
//       if (offset === 0) {
//         tradeHistory.value = [...data]
//       } else {
//         tradeHistory.value = [...tradeHistory.value, ...data]
//       }
      
//       return data
//     } catch (error) {
//       console.error('Failed to fetch trade history:', error)
//       throw error
//     }
//   }

//   const fetchTradingSummary = async () => {
//     try {
//       const data = await tradingAPI.getTradingSummary()
//       tradingSummary.value = { ...data }
//     } catch (error) {
//       console.error('Failed to fetch trading summary:', error)
//     }
//   }

//   // WebSocket updates
//   const updateTrade = (tradeData) => {
//     // Update trade in history
//     const historyIndex = tradeHistory.value.findIndex(t => t.id === tradeData.id)
//     if (historyIndex !== -1) {
//       const newHistory = [...tradeHistory.value]
//       newHistory[historyIndex] = tradeData
//       tradeHistory.value = newHistory
//     }
    
//     // Update position if open
//     if (tradeData.status === 'EXECUTED') {
//       const positionIndex = positions.value.findIndex(p => p.id === tradeData.id)
//       if (positionIndex !== -1) {
//         const newPositions = [...positions.value]
//         newPositions[positionIndex] = tradeData
//         positions.value = newPositions
//         positionUpdateTrigger.value++
//       }
//     } else {
//       // Remove from positions if closed
//       positions.value = positions.value.filter(p => p.id !== tradeData.id)
//       positionUpdateTrigger.value++
//     }
//   }

//   // COMPLETELY REWRITTEN: More robust position update
//   const updatePosition = (positionData) => {
//     console.log('🔄 Updating position in store:', positionData)
//     console.log('🔄 Current positions count:', positions.value.length)
//     console.log('🔄 Looking for position with ID:', positionData.id)
//     console.log('🔄 Available position IDs:', positions.value.map(p => ({ id: p.id, symbol: p.symbol })))
    
//     // Find the position index
//     const index = positions.value.findIndex(p => String(p.id) === String(positionData.id))
    
//     if (index !== -1) {
//       console.log('✅ Found position at index:', index)
      
//       // Create completely new positions array with updated position
//       const newPositions = positions.value.map((position, i) => {
//         if (i === index) {
//           return {
//             ...position,
//             current_price: positionData.current_price,
//             unrealized_pnl: positionData.unrealized_pnl,
//             // Ensure we keep all original position data
//             symbol: position.symbol,
//             user_type: position.user_type,
//             volume: position.volume,
//             entry_price: position.entry_price,
//             open_time: position.open_time,
//             status: position.status,
//             id: position.id
//           }
//         }
//         return position
//       })
      
//       // Replace the entire array and trigger update
//       positions.value = newPositions
//       positionUpdateTrigger.value++
      
//       console.log('✅ Position updated successfully')
//       console.log('✅ Updated position:', newPositions[index])
//       console.log('✅ Trigger incremented to:', positionUpdateTrigger.value)
//     } else {
//       console.log('❌ Position not found with ID:', positionData.id)
      
//       // If it's a new executed position, add it
//       if (positionData.status === 'EXECUTED') {
//         positions.value = [...positions.value, positionData]
//         positionUpdateTrigger.value++
//         console.log('➕ New position added:', positionData)
//       }
//     }
//   }

//   // Force update function for debugging
//   const forcePositionUpdate = () => {
//     positionUpdateTrigger.value++
//     console.log('🔄 Force update triggered:', positionUpdateTrigger.value)
//   }

//   // Initialize data
//   const initializeTradingData = async () => {
//     try {
//       await Promise.all([
//         fetchPositions(),
//         fetchTradeHistory(20),
//         fetchTradingSummary()
//       ])
//       console.log('📊 Trading data initialized')
//     } catch (error) {
//       console.error('Failed to initialize trading data:', error)
//     }
//   }

//   // Utility functions
//   const formatPrice = (price, digits = 5) => {
//     return typeof price === 'number' ? price.toFixed(digits) : '0.00000'
//   }

//   const formatPnL = (pnl) => {
//     const value = typeof pnl === 'number' ? pnl : 0
//     return {
//       value,
//       formatted: value.toFixed(2),
//       isPositive: value >= 0,
//       className: value >= 0 ? 'text-profit' : 'text-loss'
//     }
//   }

//   const calculatePipValue = (symbol, price1, price2) => {
//     const diff = Math.abs(price1 - price2)
//     const multiplier = symbol.includes('JPY') ? 100 : 10000
//     return Math.round(diff * multiplier)
//   }

//   return {
//     // State
//     prices,
//     positions,
//     tradeHistory,
//     tradingSummary,
//     isLoading,
//     lastPriceUpdate,
//     positionUpdateTrigger,
    
//     // Computed
//     openPositions,
//     totalUnrealizedPnL,
//     symbolPrices,
    
//     // Actions
//     updatePrice,
//     getPrice,
//     placeTrade,
//     closeTrade,
//     fetchPositions,
//     fetchTradeHistory,
//     fetchTradingSummary,
//     updateTrade,
//     updatePosition,
//     forcePositionUpdate,
//     initializeTradingData,
    
//     // Utilities
//     formatPrice,
//     formatPnL,
//     calculatePipValue
//   }
// })

// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// import { tradingAPI } from '@/services/api'
// import { useToastStore } from './toast'

// export const useTradingStore = defineStore('trading', () => {
//   const prices = ref({})
//   const positions = ref([])
//   const tradeHistory = ref([])
//   const tradingSummary = ref({})
//   const isLoading = ref(false)
//   const lastPriceUpdate = ref(null)
//   const positionUpdateTrigger = ref(0)
//   const missingPositionIds = ref(new Set()) // Track missing positions

//   // Computed getters
//   const openPositions = computed(() => {
//     positionUpdateTrigger.value // Force reactivity
//     return positions.value.filter(p => p.status === 'EXECUTED')
//   })

//   const totalUnrealizedPnL = computed(() => {
//     positionUpdateTrigger.value // Force reactivity
//     return openPositions.value.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0)
//   })

//   const symbolPrices = computed(() => prices.value)

//   // Price management
//   const updatePrice = (priceData) => {
//     const { symbol, bid, ask, timestamp } = priceData
    
//     const prevPrice = prices.value[symbol]
    
//     prices.value[symbol] = {
//       symbol,
//       bid: parseFloat(bid),
//       ask: parseFloat(ask),
//       timestamp: new Date(timestamp),
//       spread: parseFloat(ask) - parseFloat(bid),
//       direction: prevPrice ? 
//         (bid > prevPrice.bid ? 'up' : bid < prevPrice.bid ? 'down' : 'neutral') : 'neutral'
//     }
    
//     lastPriceUpdate.value = new Date()
//   }

//   const getPrice = (symbol) => {
//     return prices.value[symbol] || null
//   }

//   // Trading operations
//   const placeTrade = async (tradeData) => {
//     isLoading.value = true
//     const toastStore = useToastStore()
    
//     try {
//       const trade = await tradingAPI.placeTrade(tradeData)
      
//       if (trade.status === 'EXECUTED') {
//         positions.value = [...positions.value, trade]
//         positionUpdateTrigger.value++
//         console.log('➕ New position added to store:', trade.id)
//       }
      
//       tradeHistory.value = [trade, ...tradeHistory.value]
//       toastStore.success(`Trade placed successfully: ${trade.ticket}`)
      
//       await fetchTradingSummary()
//       return trade
//     } catch (error) {
//       toastStore.error(error.response?.data?.detail || 'Failed to place trade')
//       throw error
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const closeTrade = async (tradeId) => {
//     isLoading.value = true
//     const toastStore = useToastStore()
    
//     try {
//       const closedTrade = await tradingAPI.closeTrade(tradeId)
      
//       positions.value = positions.value.filter(p => p.id !== tradeId)
//       positionUpdateTrigger.value++
      
//       const historyIndex = tradeHistory.value.findIndex(t => t.id === tradeId)
//       if (historyIndex !== -1) {
//         tradeHistory.value[historyIndex] = closedTrade
//       } else {
//         tradeHistory.value = [closedTrade, ...tradeHistory.value]
//       }
      
//       toastStore.success(`Position closed: ${closedTrade.ticket}`)
//       await fetchTradingSummary()
//       return closedTrade
//     } catch (error) {
//       toastStore.error(error.response?.data?.detail || 'Failed to close trade')
//       throw error
//     } finally {
//       isLoading.value = false
//     }
//   }

//   // Enhanced data fetching with better error handling
//   const fetchPositions = async (force = false) => {
//     try {
//       console.log('📊 Fetching positions from API...')
//       const data = await tradingAPI.getPositions()
      
//       positions.value = [...data]
//       positionUpdateTrigger.value++
      
//       console.log('📊 Positions loaded:', {
//         count: data.length,
//         ids: data.map(p => p.id),
//         symbols: data.map(p => `${p.symbol} (${p.user_type})`)
//       })
      
//       // Clear missing position tracking since we just refreshed
//       missingPositionIds.value.clear()
      
//       return data
//     } catch (error) {
//       console.error('❌ Failed to fetch positions:', error)
//       throw error
//     }
//   }

//   const fetchTradeHistory = async (limit = 50, offset = 0) => {
//     try {
//       const data = await tradingAPI.getTradeHistory(limit, offset)
      
//       if (offset === 0) {
//         tradeHistory.value = [...data]
//       } else {
//         tradeHistory.value = [...tradeHistory.value, ...data]
//       }
      
//       return data
//     } catch (error) {
//       console.error('Failed to fetch trade history:', error)
//       throw error
//     }
//   }

//   const fetchTradingSummary = async () => {
//     try {
//       const data = await tradingAPI.getTradingSummary()
//       tradingSummary.value = { ...data }
//     } catch (error) {
//       console.error('Failed to fetch trading summary:', error)
//     }
//   }

//   // WebSocket updates
//   const updateTrade = (tradeData) => {
//     const historyIndex = tradeHistory.value.findIndex(t => t.id === tradeData.id)
//     if (historyIndex !== -1) {
//       const newHistory = [...tradeHistory.value]
//       newHistory[historyIndex] = tradeData
//       tradeHistory.value = newHistory
//     }
    
//     if (tradeData.status === 'EXECUTED') {
//       const positionIndex = positions.value.findIndex(p => p.id === tradeData.id)
//       if (positionIndex !== -1) {
//         const newPositions = [...positions.value]
//         newPositions[positionIndex] = tradeData
//         positions.value = newPositions
//         positionUpdateTrigger.value++
//       }
//     } else {
//       positions.value = positions.value.filter(p => p.id !== tradeData.id)
//       positionUpdateTrigger.value++
//     }
//   }

//   // ENHANCED: Robust position update with auto-sync
//   const updatePosition = async (positionData) => {
//     const positionId = String(positionData.id)
    
//     console.log('🔄 Processing position update:', {
//       id: positionId,
//       symbol: positionData.symbol,
//       unrealized_pnl: positionData.unrealized_pnl,
//       current_price: positionData.current_price
//     })
    
//     console.log('📊 Current store state:', {
//       total_positions: positions.value.length,
//       position_ids: positions.value.map(p => String(p.id)),
//       missing_ids: Array.from(missingPositionIds.value)
//     })
    
//     // Find position in store
//     const index = positions.value.findIndex(p => String(p.id) === positionId)
    
//     if (index !== -1) {
//       // Position found - update it
//       console.log('✅ Position found at index:', index)
      
//       const newPositions = positions.value.map((position, i) => {
//         if (i === index) {
//           return {
//             ...position,
//             current_price: positionData.current_price,
//             unrealized_pnl: positionData.unrealized_pnl,
//             // Preserve all original fields
//             id: position.id,
//             symbol: position.symbol,
//             user_type: position.user_type,
//             volume: position.volume,
//             entry_price: position.entry_price,
//             open_time: position.open_time,
//             status: position.status,
//             ticket: position.ticket
//           }
//         }
//         return position
//       })
      
//       positions.value = newPositions
//       positionUpdateTrigger.value++
      
//       // Remove from missing positions if it was there
//       missingPositionIds.value.delete(positionId)
      
//       console.log('✅ Position updated successfully:', {
//         id: positionId,
//         symbol: positionData.symbol,
//         new_pnl: positionData.unrealized_pnl
//       })
      
//     } else {
//       // Position not found in store
//       console.log('❌ Position not found in store:', {
//         looking_for_id: positionId,
//         available_ids: positions.value.map(p => String(p.id)),
//         position_count: positions.value.length
//       })
      
//       // Track this missing position
//       missingPositionIds.value.add(positionId)
      
//       // If we have too many missing positions, refresh the entire store
//       if (missingPositionIds.value.size >= 3) {
//         console.log('⚠️ Too many missing positions, refreshing store...')
//         await fetchPositions(true)
//         missingPositionIds.value.clear()
        
//         // Try the update again after refresh
//         const newIndex = positions.value.findIndex(p => String(p.id) === positionId)
//         if (newIndex !== -1) {
//           console.log('✅ Position found after refresh, updating...')
//           return updatePosition(positionData) // Recursive call after refresh
//         }
//       } else {
//         // For single missing position, try to fetch it specifically
//         console.log('🔄 Attempting to sync missing position...')
//         try {
//           // await fetchPositions(true) // Force refresh
          
//           // Try update again after refresh
//           const refreshedIndex = positions.value.findIndex(p => String(p.id) === positionId)
//           if (refreshedIndex !== -1) {
//             console.log('✅ Position found after sync, updating...')
//             return updatePosition(positionData) // Recursive call
//           } else {
//             console.log('❌ Position still not found after sync')
//           }
//         } catch (error) {
//           console.error('❌ Failed to sync positions:', error)
//         }
//       }
      
//       // If it's a new executed position, add it to store
//       if (positionData.status === 'EXECUTED') {
//         console.log('➕ Adding new position to store')
//         positions.value = [...positions.value, positionData]
//         positionUpdateTrigger.value++
//         missingPositionIds.value.delete(positionId)
//       }
//     }
//   }

//   // Enhanced sync function
//   const syncPositions = async () => {
//     console.log('🔄 Syncing positions with backend...')
//     try {
//       await fetchPositions(true)
//       console.log('✅ Position sync completed')
//     } catch (error) {
//       console.error('❌ Position sync failed:', error)
//     }
//   }

//   // Debug function to check store state
//   const debugStoreState = () => {
//     const state = {
//       positions_count: positions.value.length,
//       position_ids: positions.value.map(p => ({ id: String(p.id), symbol: p.symbol })),
//       missing_ids: Array.from(missingPositionIds.value),
//       update_trigger: positionUpdateTrigger.value,
//       last_price_update: lastPriceUpdate.value
//     }
    
//     console.log('🔍 Trading Store Debug State:', state)
//     return state
//   }

//   // Force update function for debugging
//   const forcePositionUpdate = () => {
//     positionUpdateTrigger.value++
//     console.log('🔄 Force update triggered:', positionUpdateTrigger.value)
//   }

//   // Initialize data with better error handling
//   const initializeTradingData = async () => {
//     try {
//       console.log('🚀 Initializing trading data...')
      
//       await Promise.all([
//         fetchPositions(true),
//         fetchTradeHistory(20),
//         fetchTradingSummary()
//       ])
      
//       console.log('✅ Trading data initialization completed')
//     } catch (error) {
//       console.error('❌ Failed to initialize trading data:', error)
//       throw error
//     }
//   }

//   // Utility functions
//   const formatPrice = (price, digits = 5) => {
//     return typeof price === 'number' ? price.toFixed(digits) : '0.00000'
//   }

//   const formatPnL = (pnl) => {
//     const value = typeof pnl === 'number' ? pnl : 0
//     return {
//       value,
//       formatted: value.toFixed(2),
//       isPositive: value >= 0,
//       className: value >= 0 ? 'text-profit' : 'text-loss'
//     }
//   }

//   const calculatePipValue = (symbol, price1, price2) => {
//     const diff = Math.abs(price1 - price2)
//     const multiplier = symbol.includes('JPY') ? 100 : 10000
//     return Math.round(diff * multiplier)
//   }

//   return {
//     // State
//     prices,
//     positions,
//     tradeHistory,
//     tradingSummary,
//     isLoading,
//     lastPriceUpdate,
//     positionUpdateTrigger,
//     missingPositionIds,
    
//     // Computed
//     openPositions,
//     totalUnrealizedPnL,
//     symbolPrices,
    
//     // Actions
//     updatePrice,
//     getPrice,
//     placeTrade,
//     closeTrade,
//     fetchPositions,
//     fetchTradeHistory,
//     fetchTradingSummary,
//     updateTrade,
//     updatePosition,
//     syncPositions,
//     forcePositionUpdate,
//     debugStoreState,
//     initializeTradingData,
    
//     // Utilities
//     formatPrice,
//     formatPnL,
//     calculatePipValue
//   }
// })







// // stores/trading.js (Enhanced for real-time P&L updates)
// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// import { tradingAPI } from '@/services/api'
// import { useToastStore } from './toast'

// export const useTradingStore = defineStore('trading', () => {
//   // State
//   const prices = ref({})
//   const positions = ref([])
//   const tradeHistory = ref([])
//   const tradingSummary = ref({})
//   const isLoading = ref(false)
//   const lastPriceUpdate = ref(null)
//   const positionUpdateTrigger = ref(0)
//   const missingPositionIds = ref(new Set())
  
//   // Daily high/low tracking for MT5 display
//   const dailyStats = ref({})
  
//   // Real-time P&L tracking
//   const realTimePnL = ref({}) // positionId -> current P&L

//   // Computed getters
//   const openPositions = computed(() => {
//     const filteredPositions = positions.value.filter(p => p.status === 'EXECUTED')
    
//     // Enhance positions with real-time P&L
//     return filteredPositions.map(position => {
//       const positionId = String(position.id)
//       const realtimePnL = realTimePnL.value[positionId]
      
//       if (realtimePnL !== undefined) {
//         return {
//           ...position,
//           unrealized_pnl: realtimePnL.unrealized_pnl,
//           current_price: realtimePnL.current_price,
//           last_update: realtimePnL.timestamp
//         }
//       }
      
//       return position
//     })
//   })

//   const totalUnrealizedPnL = computed(() => 
//     openPositions.value.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0)
//   )

//   const symbolPrices = computed(() => {
//     // Enhance prices with daily stats and additional MT5 data
//     const enhancedPrices = {}
    
//     Object.keys(prices.value).forEach(symbol => {
//       const price = prices.value[symbol]
//       const stats = dailyStats.value[symbol] || {}
      
//       enhancedPrices[symbol] = {
//         ...price,
//         high: stats.high || price.ask || 0,
//         low: stats.low || price.bid || 0,
//         change: price.change || 0,
//         changePercent: price.changePercent || 0,
//         spread: price.spread || ((price.ask || 0) - (price.bid || 0)),
//         timestamp: price.timestamp || new Date()
//       }
//     })
    
//     return enhancedPrices
//   })

//   // 🚀 NEW: Real-time price update with position P&L calculation
//   const updatePrice = (priceData) => {
//     const { symbol, bid, ask, timestamp } = priceData
    
//     // Store previous price for comparison
//     const prevPrice = prices.value[symbol]
//     const newBid = parseFloat(bid)
//     const newAsk = parseFloat(ask)
    
//     // Calculate change and direction
//     let change = 0
//     let changePercent = 0
//     let direction = null
    
//     if (prevPrice && prevPrice.bid) {
//       change = newBid - prevPrice.bid
//       changePercent = (change / prevPrice.bid) * 100
      
//       if (newBid > prevPrice.bid) direction = 'up'
//       else if (newBid < prevPrice.bid) direction = 'down'
//     }
    
//     // Update daily stats
//     if (!dailyStats.value[symbol]) {
//       dailyStats.value[symbol] = {
//         high: newAsk,
//         low: newBid,
//         openPrice: newBid
//       }
//     } else {
//       dailyStats.value[symbol].high = Math.max(dailyStats.value[symbol].high, newAsk)
//       dailyStats.value[symbol].low = Math.min(dailyStats.value[symbol].low, newBid)
//     }
    
//     // Update price data
//     prices.value[symbol] = {
//       symbol,
//       bid: newBid,
//       ask: newAsk,
//       timestamp: new Date(timestamp),
//       spread: newAsk - newBid,
//       direction,
//       change,
//       changePercent
//     }
    
//     lastPriceUpdate.value = new Date()
    
//     // 🎯 CRITICAL: Immediately update P&L for all positions of this symbol
//     updatePositionPnLForSymbol(symbol, newBid, newAsk)
    
//     // Clear direction after animation duration
//     setTimeout(() => {
//       if (prices.value[symbol]) {
//         prices.value[symbol].direction = null
//       }
//     }, 1000)
//   }

//   // 🚀 NEW: Real-time P&L calculation for positions
//   const updatePositionPnLForSymbol = (symbol, bid, ask) => {
//     const symbolPositions = positions.value.filter(p => 
//       p.symbol === symbol && p.status === 'EXECUTED'
//     )
    
//     if (symbolPositions.length === 0) return
    
//     console.log(`💰 Updating P&L for ${symbolPositions.length} ${symbol} positions`)
    
//     symbolPositions.forEach(position => {
//       const positionId = String(position.id)
      
//       // Determine current price based on position type
//       const currentPrice = position.user_type === 'sell' ? ask : bid
      
//       // Calculate unrealized P&L
//       let priceDiff = 0
//       if (position.user_type === 'buy') {
//         priceDiff = currentPrice - position.entry_price
//       } else {
//         priceDiff = position.entry_price - currentPrice
//       }
      
//       // Calculate P&L based on symbol specifications
//       const pointValue = getPointValue(symbol)
//       const unrealized_pnl = priceDiff * position.volume * 1000 * pointValue
      
//       // Store real-time P&L
//       realTimePnL.value[positionId] = {
//         unrealized_pnl,
//         current_price: currentPrice,
//         price_diff: priceDiff,
//         pips: calculatePips(symbol, position.entry_price, currentPrice, position.user_type),
//         timestamp: new Date()
//       }
      
//       console.log(`📊 ${symbol} P&L updated:`, {
//         id: positionId,
//         type: position.user_type,
//         entry: position.entry_price,
//         current: currentPrice,
//         pnl: unrealized_pnl
//       })
//     })
    
//     // Trigger reactivity
//     positionUpdateTrigger.value++
//   }

//   // Helper functions for P&L calculations
//   const getPointValue = (symbol) => {
//     if (symbol.includes('JPY')) {
//       return 0.01 // 1 pip = 0.01 for JPY pairs
//     } else if (symbol === 'XAUUSD') {
//       return 0.1  // 1 pip = $0.10 for Gold per 0.01 move
//     } else {
//       return 1    // 1 pip = $1 for major pairs per 0.0001 move
//     }
//   }

//   const calculatePips = (symbol, entryPrice, currentPrice, tradeType) => {
//     if (!entryPrice || !currentPrice) return 0
    
//     let priceDiff = 0
//     if (tradeType === 'buy') {
//       priceDiff = currentPrice - entryPrice
//     } else {
//       priceDiff = entryPrice - currentPrice
//     }
    
//     if (symbol.includes('JPY')) {
//       return priceDiff * 100
//     } else if (symbol === 'XAUUSD') {
//       return priceDiff * 10
//     } else {
//       return priceDiff * 10000
//     }
//   }

//   // Enhanced position update from WebSocket
//   const updatePosition = (positionData) => {
//     console.log('🔄 WebSocket position update:', positionData)
    
//     const positionId = String(positionData.id)
//     const existingIndex = positions.value.findIndex(p => String(p.id) === positionId)
    
//     if (existingIndex !== -1) {
//       // Update existing position
//       const existingPosition = positions.value[existingIndex]
      
//       // Update the position object
//       positions.value[existingIndex] = {
//         ...existingPosition,
//         current_price: positionData.current_price,
//         last_update: new Date()
//       }
      
//       // Update real-time P&L
//       realTimePnL.value[positionId] = {
//         unrealized_pnl: positionData.unrealized_pnl,
//         current_price: positionData.current_price,
//         timestamp: new Date()
//       }
      
//       positionUpdateTrigger.value++
      
//       console.log('✅ Position P&L updated via WebSocket:', {
//         id: positionId,
//         symbol: existingPosition.symbol,
//         pnl: positionData.unrealized_pnl
//       })
//     } else {
//       console.warn('⚠️ Position not found for WebSocket update:', positionId)
//     }
//   }

//   // Trading actions (enhanced with real-time tracking)
//   const placeTrade = async (tradeData) => {
//     const toastStore = useToastStore()
//     isLoading.value = true
    
//     try {
//       console.log('📤 Placing trade:', tradeData)
      
//       const result = await tradingAPI.placeTrade(tradeData)
      
//       console.log('✅ Trade placed successfully:', result)
      
//       // Add to trade history
//       tradeHistory.value.unshift(result)
      
//       // If executed immediately, add to positions and initialize P&L tracking
//       if (result.status === 'EXECUTED') {
//         positions.value.unshift(result)
        
//         // Initialize real-time P&L for new position
//         const positionId = String(result.id)
//         const currentPrice = prices.value[result.symbol]
        
//         if (currentPrice) {
//           const entryPrice = result.entry_price
//           const marketPrice = result.user_type === 'sell' ? currentPrice.ask : currentPrice.bid
          
//           realTimePnL.value[positionId] = {
//             unrealized_pnl: 0, // Starts at 0
//             current_price: marketPrice,
//             timestamp: new Date()
//           }
//         }
        
//         positionUpdateTrigger.value++
//       }
      
//       toastStore.success(`Trade placed: ${result.ticket}`)
      
//       // Refresh summary
//       await fetchTradingSummary()
      
//       return result
//     } catch (error) {
//       console.error('❌ Trade placement failed:', error)
//       toastStore.error(error.response?.data?.detail || 'Failed to place trade')
//       throw error
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const closeTrade = async (tradeId) => {
//     const toastStore = useToastStore()
//     isLoading.value = true
    
//     try {
//       console.log('🔒 Closing trade:', tradeId)
      
//       const closedTrade = await tradingAPI.closeTrade(tradeId)
      
//       console.log('✅ Trade closed:', closedTrade)
      
//       // Remove from positions
//       positions.value = positions.value.filter(p => p.id !== tradeId)
      
//       // Clean up real-time P&L tracking
//       const positionId = String(tradeId)
//       delete realTimePnL.value[positionId]
      
//       positionUpdateTrigger.value++
      
//       // Add to history if not already there
//       const historyIndex = tradeHistory.value.findIndex(t => t.id === tradeId)
//       if (historyIndex !== -1) {
//         tradeHistory.value[historyIndex] = closedTrade
//       } else {
//         tradeHistory.value.unshift(closedTrade)
//       }
      
//       toastStore.success(`Position closed: ${closedTrade.ticket}`)
      
//       // Refresh summary
//       await fetchTradingSummary()
      
//       return closedTrade
//     } catch (error) {
//       console.error('❌ Failed to close trade:', error)
//       toastStore.error(error.response?.data?.detail || 'Failed to close trade')
//       throw error
//     } finally {
//       isLoading.value = false
//     }
//   }

//   // Data fetching (enhanced)
//   const fetchPositions = async (force = false) => {
//     try {
//       console.log('📊 Fetching positions from API...', force ? '(forced)' : '')
//       const data = await tradingAPI.getPositions()
      
//       positions.value = [...data]
      
//       // Initialize real-time P&L for all positions
//       data.forEach(position => {
//         const positionId = String(position.id)
//         realTimePnL.value[positionId] = {
//           unrealized_pnl: position.unrealized_pnl || 0,
//           current_price: position.current_price || 0,
//           timestamp: new Date()
//         }
//       })
      
//       positionUpdateTrigger.value++
      
//       console.log('📊 Positions loaded:', {
//         count: data.length,
//         ids: data.map(p => p.id),
//         symbols: data.map(p => `${p.symbol} (${p.user_type})`)
//       })
      
//       // Clear missing position tracking
//       missingPositionIds.value.clear()
      
//       return data
//     } catch (error) {
//       console.error('❌ Failed to fetch positions:', error)
//       throw error
//     }
//   }

//   const fetchTradeHistory = async (limit = 50, offset = 0) => {
//     try {
//       const data = await tradingAPI.getTradeHistory(limit, offset)
      
//       if (offset === 0) {
//         tradeHistory.value = [...data]
//       } else {
//         tradeHistory.value = [...tradeHistory.value, ...data]
//       }
      
//       return data
//     } catch (error) {
//       console.error('Failed to fetch trade history:', error)
//       throw error
//     }
//   }

//   const fetchTradingSummary = async () => {
//     try {
//       const data = await tradingAPI.getTradingSummary()
//       tradingSummary.value = { ...data }
//     } catch (error) {
//       console.error('Failed to fetch trading summary:', error)
//     }
//   }

//   // Initialize trading data
//   const initializeTradingData = async () => {
//     try {
//       console.log('🚀 Initializing trading data...')
      
//       // Fetch all data in parallel
//       await Promise.all([
//         fetchPositions(),
//         fetchTradeHistory(),
//         fetchTradingSummary()
//       ])
      
//       console.log('✅ Trading data initialized successfully')
//     } catch (error) {
//       console.error('❌ Failed to initialize trading data:', error)
//       throw error
//     }
//   }

//   // Price formatting utilities
//   const formatPrice = (price, symbol = '') => {
//     if (!price || isNaN(price)) return '0.00000'
    
//     if (symbol.includes('JPY')) {
//       return Number(price).toFixed(3)
//     } else if (symbol === 'XAUUSD') {
//       return Number(price).toFixed(2)
//     } else {
//       return Number(price).toFixed(5)
//     }
//   }

//   const formatSpread = (spread, symbol = '') => {
//     if (!spread || isNaN(spread)) return '0.0'
    
//     const multiplier = symbol.includes('JPY') ? 100 : 10000
//     return (spread * multiplier).toFixed(1)
//   }

//   // Reset daily stats
//   const resetDailyStats = () => {
//     dailyStats.value = {}
//     console.log('📊 Daily stats reset')
//   }

//   // 🎯 Force P&L recalculation for all positions
//   const recalculateAllPnL = () => {
//     console.log('🔄 Recalculating P&L for all positions...')
    
//     Object.keys(prices.value).forEach(symbol => {
//       const price = prices.value[symbol]
//       if (price && price.bid && price.ask) {
//         updatePositionPnLForSymbol(symbol, price.bid, price.ask)
//       }
//     })
//   }

//   return {
//     // State
//     prices,
//     positions,
//     tradeHistory,
//     tradingSummary,
//     isLoading,
//     lastPriceUpdate,
//     positionUpdateTrigger,
//     realTimePnL,
    
//     // Computed
//     openPositions,
//     totalUnrealizedPnL,
//     symbolPrices,
    
//     // Actions
//     updatePrice,
//     updatePosition,
//     updatePositionPnLForSymbol,
//     placeTrade,
//     closeTrade,
//     fetchPositions,
//     fetchTradeHistory,
//     fetchTradingSummary,
//     initializeTradingData,
//     recalculateAllPnL,
    
//     // Utilities
//     formatPrice,
//     formatSpread,
//     resetDailyStats,
//     calculatePips,
//     getPointValue
//   }
// })





// stores/trading.js (Industry Standard Implementation)
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tradingAPI } from '@/services/api'
import { useToastStore } from './toast'

export const useTradingStore = defineStore('trading', () => {
  // State
  const prices = ref({})
  const positions = ref([])
  const tradeHistory = ref([])
  const tradingSummary = ref({})
  const isLoading = ref(false)
  const lastPriceUpdate = ref(null)
  const positionUpdateTrigger = ref(0)
  const missingPositionIds = ref(new Set())
  
  // Industry standard: Real-time P&L tracking
  const realTimePnL = ref({}) // positionId -> current P&L

  // Computed getters
  const openPositions = computed(() => {
    const filteredPositions = positions.value.filter(p => p.status === 'EXECUTED')
    
    // Enhance positions with real-time P&L
    return filteredPositions.map(position => {
      const positionId = String(position.id)
      const realtimePnL = realTimePnL.value[positionId]
      
      if (realtimePnL !== undefined) {
        return {
          ...position,
          unrealized_pnl: realtimePnL.unrealized_pnl,
          current_price: realtimePnL.current_price,
          pips: realtimePnL.pips,
          last_update: realtimePnL.timestamp
        }
      }
      
      return position
    })
  })

  const totalUnrealizedPnL = computed(() => 
    openPositions.value.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0)
  )

  const symbolPrices = computed(() => {
    // Return enhanced prices with industry standard fields
    const enhancedPrices = {}
    
    Object.keys(prices.value).forEach(symbol => {
      const price = prices.value[symbol]
      
      enhancedPrices[symbol] = {
        ...price,
        // Ensure all industry standard fields are present
        symbol: price.symbol || symbol,
        bid: price.bid || 0,
        ask: price.ask || 0,
        change: price.change || 0,
        change_percent: price.change_percent || 0,
        daily_open: price.daily_open || price.bid || 0,
        high: price.high || price.ask || 0,
        low: price.low || price.bid || 0,
        spread: price.spread || ((price.ask || 0) - (price.bid || 0)),
        spread_pips: price.spread_pips || 0,
        timestamp: price.timestamp || new Date().toISOString(),
        digits: price.digits || getDigits(symbol),
        point: price.point || getPointSize(symbol),
        pip_size: price.pip_size || getPipSize(symbol)
      }
    })
    
    return enhancedPrices
  })

  // Industry Standard: Price update handling
  const updatePrice = (priceData) => {
    const { symbol, bid, ask, change, change_percent, spread_pips, timestamp } = priceData
    
    // Store previous price for comparison
    const prevPrice = prices.value[symbol]
    const newBid = parseFloat(bid)
    const newAsk = parseFloat(ask)
    
    // Determine direction based on bid price movement
    let direction = null
    if (prevPrice && prevPrice.bid) {
      if (newBid > prevPrice.bid) direction = 'up'
      else if (newBid < prevPrice.bid) direction = 'down'
    }
    
    // Industry standard price data structure
    prices.value[symbol] = {
      symbol,
      bid: newBid,
      ask: newAsk,
      change: parseFloat(change || 0),
      change_percent: parseFloat(change_percent || 0),
      daily_open: parseFloat(priceData.daily_open || newBid),
      high: parseFloat(priceData.high || newAsk),
      low: parseFloat(priceData.low || newBid),
      spread: newAsk - newBid,
      spread_pips: parseFloat(spread_pips || 0),
      timestamp: timestamp || new Date().toISOString(),
      direction,
      // Additional industry standard fields
      digits: priceData.digits || getDigits(symbol),
      point: priceData.point || getPointSize(symbol),
      pip_size: priceData.pip_size || getPipSize(symbol),
      volume: priceData.volume || 0,
      tick_count: priceData.tick_count || 0
    }
    
    lastPriceUpdate.value = new Date()
    
    // Industry Standard: Immediately update P&L for all positions of this symbol
    updatePositionPnLForSymbol(symbol, newBid, newAsk)
    
    // Clear direction after animation duration
    setTimeout(() => {
      if (prices.value[symbol]) {
        prices.value[symbol].direction = null
      }
    }, 1000)
  }

  // Industry Standard: Real-time P&L calculation
  const updatePositionPnLForSymbol = (symbol, bid, ask) => {
    const symbolPositions = positions.value.filter(p => 
      p.symbol === symbol && p.status === 'EXECUTED'
    )
    
    if (symbolPositions.length === 0) return
    
    console.log(`💰 Updating P&L for ${symbolPositions.length} ${symbol} positions`)
    
    symbolPositions.forEach(position => {
      const positionId = String(position.id)
      
      // Industry standard: Current price based on position direction
      const currentPrice = position.user_type === 'sell' ? ask : bid
      
      // Industry standard: P&L calculation
      let priceDiff = 0
      if (position.user_type === 'buy') {
        priceDiff = currentPrice - position.entry_price
      } else {
        priceDiff = position.entry_price - currentPrice
      }
      
      // Convert to pips
      const pips = convertToPips(symbol, priceDiff)
      
      // Calculate pip value and P&L
      const pipValue = calculatePipValue(symbol, position.volume)
      const unrealized_pnl = pips * pipValue
      
      // Store real-time P&L
      realTimePnL.value[positionId] = {
        unrealized_pnl: Math.round(unrealized_pnl * 100) / 100, // Round to 2 decimals
        current_price: currentPrice,
        price_diff: priceDiff,
        pips: Math.round(pips * 10) / 10, // Round to 1 decimal
        pip_value: pipValue,
        timestamp: new Date()
      }
      
      console.log(`📊 ${symbol} P&L updated:`, {
        id: positionId,
        type: position.user_type,
        entry: position.entry_price,
        current: currentPrice,
        pips: pips,
        pnl: unrealized_pnl
      })
    })
    
    // Trigger reactivity
    positionUpdateTrigger.value++
  }

  // Industry standard helper functions
  const getDigits = (symbol) => {
    if (symbol.includes('JPY')) return 3
    if (symbol === 'XAUUSD') return 2
    return 5
  }

  const getPointSize = (symbol) => {
    if (symbol.includes('JPY')) return 0.001
    if (symbol === 'XAUUSD') return 0.01
    return 0.00001
  }

  const getPipSize = (symbol) => {
    if (symbol.includes('JPY')) return 0.01
    if (symbol === 'XAUUSD') return 0.10
    return 0.0001
  }

  const convertToPips = (symbol, priceDiff) => {
    if (symbol.includes('JPY')) {
      return priceDiff * 100
    } else if (symbol === 'XAUUSD') {
      return priceDiff * 10
    } else {
      return priceDiff * 10000
    }
  }

  const calculatePipValue = (symbol, volume) => {
    // Industry standard pip value calculation
    if (symbol.includes('JPY')) {
      return volume * 10  // $10 per pip per lot for JPY pairs
    } else if (symbol === 'XAUUSD') {
      return volume * 10  // $10 per pip per lot for Gold
    } else {
      return volume * 10  // $10 per pip per lot for major pairs
    }
  }

  // Enhanced position update from WebSocket
  const updatePosition = (positionData) => {
    console.log('🔄 WebSocket position update:', positionData)
    
    const positionId = String(positionData.id)
    const existingIndex = positions.value.findIndex(p => String(p.id) === positionId)
    
    if (existingIndex !== -1) {
      // Update existing position
      const existingPosition = positions.value[existingIndex]
      
      // Update the position object
      positions.value[existingIndex] = {
        ...existingPosition,
        current_price: positionData.current_price,
        last_update: new Date()
      }
      
      // Update real-time P&L with industry standard data
      realTimePnL.value[positionId] = {
        unrealized_pnl: positionData.unrealized_pnl,
        current_price: positionData.current_price,
        pips: positionData.pips || 0,
        pip_value: positionData.pip_value || 0,
        price_diff: positionData.price_diff || 0,
        timestamp: new Date()
      }
      
      positionUpdateTrigger.value++
      
      console.log('✅ Position P&L updated via WebSocket:', {
        id: positionId,
        symbol: existingPosition.symbol,
        pnl: positionData.unrealized_pnl,
        pips: positionData.pips
      })
    } else {
      console.warn('⚠️ Position not found for WebSocket update:', positionId)
    }
  }

  // Trading actions (keep existing implementation)
  const placeTrade = async (tradeData) => {
    const toastStore = useToastStore()
    isLoading.value = true
    
    try {
      console.log('📤 Placing trade:', tradeData)
      
      const result = await tradingAPI.placeTrade(tradeData)
      
      console.log('✅ Trade placed successfully:', result)
      
      // Add to trade history
      tradeHistory.value.unshift(result)
      
      // If executed immediately, add to positions and initialize P&L tracking
      if (result.status === 'EXECUTED') {
        positions.value.unshift(result)
        
        // Initialize real-time P&L for new position
        const positionId = String(result.id)
        const currentPrice = prices.value[result.symbol]
        
        if (currentPrice) {
          const marketPrice = result.user_type === 'sell' ? currentPrice.ask : currentPrice.bid
          
          realTimePnL.value[positionId] = {
            unrealized_pnl: 0, // Starts at 0
            current_price: marketPrice,
            pips: 0,
            pip_value: calculatePipValue(result.symbol, result.volume),
            timestamp: new Date()
          }
        }
        
        positionUpdateTrigger.value++
      }
      
      toastStore.success(`Trade placed: ${result.ticket}`)
      
      // Refresh summary
      await fetchTradingSummary()
      
      return result
    } catch (error) {
      console.error('❌ Trade placement failed:', error)
      toastStore.error(error.response?.data?.detail || 'Failed to place trade')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const closeTrade = async (tradeId) => {
    const toastStore = useToastStore()
    isLoading.value = true
    
    try {
      console.log('🔒 Closing trade:', tradeId)
      
      const closedTrade = await tradingAPI.closeTrade(tradeId)
      
      console.log('✅ Trade closed:', closedTrade)
      
      // Remove from positions
      positions.value = positions.value.filter(p => p.id !== tradeId)
      
      // Clean up real-time P&L tracking
      const positionId = String(tradeId)
      delete realTimePnL.value[positionId]
      
      positionUpdateTrigger.value++
      
      // Add to history
      const historyIndex = tradeHistory.value.findIndex(t => t.id === tradeId)
      if (historyIndex !== -1) {
        tradeHistory.value[historyIndex] = closedTrade
      } else {
        tradeHistory.value.unshift(closedTrade)
      }
      
      toastStore.success(`Position closed: ${closedTrade.ticket}`)
      
      // Refresh summary
      await fetchTradingSummary()
      
      return closedTrade
    } catch (error) {
      console.error('❌ Failed to close trade:', error)
      toastStore.error(error.response?.data?.detail || 'Failed to close trade')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Data fetching (keep existing implementation)
  const fetchPositions = async (force = false) => {
    try {
      console.log('📊 Fetching positions from API...', force ? '(forced)' : '')
      const data = await tradingAPI.getPositions()
      
      positions.value = [...data]
      
      // Initialize real-time P&L for all positions
      data.forEach(position => {
        const positionId = String(position.id)
        realTimePnL.value[positionId] = {
          unrealized_pnl: position.unrealized_pnl || 0,
          current_price: position.current_price || 0,
          pips: 0,
          pip_value: calculatePipValue(position.symbol, position.volume),
          timestamp: new Date()
        }
      })
      
      positionUpdateTrigger.value++
      
      console.log('📊 Positions loaded:', {
        count: data.length,
        ids: data.map(p => p.id),
        symbols: data.map(p => `${p.symbol} (${p.user_type})`)
      })
      
      missingPositionIds.value.clear()
      
      return data
    } catch (error) {
      console.error('❌ Failed to fetch positions:', error)
      throw error
    }
  }

  const fetchTradeHistory = async (limit = 50, offset = 0) => {
    try {
      const data = await tradingAPI.getTradeHistory(limit, offset)
      
      if (offset === 0) {
        tradeHistory.value = [...data]
      } else {
        tradeHistory.value = [...tradeHistory.value, ...data]
      }
      
      return data
    } catch (error) {
      console.error('Failed to fetch trade history:', error)
      throw error
    }
  }

  const fetchTradingSummary = async () => {
    try {
      const data = await tradingAPI.getTradingSummary()
      tradingSummary.value = { ...data }
    } catch (error) {
      console.error('Failed to fetch trading summary:', error)
    }
  }

  const initializeTradingData = async () => {
    try {
      console.log('🚀 Initializing trading data...')
      
      await Promise.all([
        fetchPositions(),
        fetchTradeHistory(),
        fetchTradingSummary()
      ])
      
      console.log('✅ Trading data initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize trading data:', error)
      throw error
    }
  }

  // Industry standard price formatting
  const formatPrice = (price, symbol = '') => {
    if (!price || isNaN(price)) return '0.00000'
    
    if (symbol.includes('JPY')) {
      return Number(price).toFixed(3)
    } else if (symbol === 'XAUUSD') {
      return Number(price).toFixed(2)
    } else {
      return Number(price).toFixed(5)
    }
  }

  const formatSpread = (spread, symbol = '') => {
    if (!spread || isNaN(spread)) return '0.0'
    
    const multiplier = symbol.includes('JPY') ? 100 : 10000
    return (spread * multiplier).toFixed(1)
  }

  // Force P&L recalculation for all positions
  const recalculateAllPnL = () => {
    console.log('🔄 Recalculating P&L for all positions...')
    
    Object.keys(prices.value).forEach(symbol => {
      const price = prices.value[symbol]
      if (price && price.bid && price.ask) {
        updatePositionPnLForSymbol(symbol, price.bid, price.ask)
      }
    })
  }

  return {
    // State
    prices,
    positions,
    tradeHistory,
    tradingSummary,
    isLoading,
    lastPriceUpdate,
    positionUpdateTrigger,
    realTimePnL,
    
    // Computed
    openPositions,
    totalUnrealizedPnL,
    symbolPrices,
    
    // Actions
    updatePrice,
    updatePosition,
    updatePositionPnLForSymbol,
    placeTrade,
    closeTrade,
    fetchPositions,
    fetchTradeHistory,
    fetchTradingSummary,
    initializeTradingData,
    recalculateAllPnL,
    
    // Utilities
    formatPrice,
    formatSpread,
    getDigits,
    getPointSize,
    getPipSize,
    convertToPips,
    calculatePipValue
  }
})