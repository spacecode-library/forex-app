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

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tradingAPI } from '@/services/api'
import { useToastStore } from './toast'

export const useTradingStore = defineStore('trading', () => {
  const prices = ref({})
  const positions = ref([])
  const tradeHistory = ref([])
  const tradingSummary = ref({})
  const isLoading = ref(false)
  const lastPriceUpdate = ref(null)
  const positionUpdateTrigger = ref(0)
  const missingPositionIds = ref(new Set()) // Track missing positions

  // Computed getters
  const openPositions = computed(() => {
    positionUpdateTrigger.value // Force reactivity
    return positions.value.filter(p => p.status === 'EXECUTED')
  })

  const totalUnrealizedPnL = computed(() => {
    positionUpdateTrigger.value // Force reactivity
    return openPositions.value.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0)
  })

  const symbolPrices = computed(() => prices.value)

  // Price management
  const updatePrice = (priceData) => {
    const { symbol, bid, ask, timestamp } = priceData
    
    const prevPrice = prices.value[symbol]
    
    prices.value[symbol] = {
      symbol,
      bid: parseFloat(bid),
      ask: parseFloat(ask),
      timestamp: new Date(timestamp),
      spread: parseFloat(ask) - parseFloat(bid),
      direction: prevPrice ? 
        (bid > prevPrice.bid ? 'up' : bid < prevPrice.bid ? 'down' : 'neutral') : 'neutral'
    }
    
    lastPriceUpdate.value = new Date()
  }

  const getPrice = (symbol) => {
    return prices.value[symbol] || null
  }

  // Trading operations
  const placeTrade = async (tradeData) => {
    isLoading.value = true
    const toastStore = useToastStore()
    
    try {
      const trade = await tradingAPI.placeTrade(tradeData)
      
      if (trade.status === 'EXECUTED') {
        positions.value = [...positions.value, trade]
        positionUpdateTrigger.value++
        console.log('➕ New position added to store:', trade.id)
      }
      
      tradeHistory.value = [trade, ...tradeHistory.value]
      toastStore.success(`Trade placed successfully: ${trade.ticket}`)
      
      await fetchTradingSummary()
      return trade
    } catch (error) {
      toastStore.error(error.response?.data?.detail || 'Failed to place trade')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const closeTrade = async (tradeId) => {
    isLoading.value = true
    const toastStore = useToastStore()
    
    try {
      const closedTrade = await tradingAPI.closeTrade(tradeId)
      
      positions.value = positions.value.filter(p => p.id !== tradeId)
      positionUpdateTrigger.value++
      
      const historyIndex = tradeHistory.value.findIndex(t => t.id === tradeId)
      if (historyIndex !== -1) {
        tradeHistory.value[historyIndex] = closedTrade
      } else {
        tradeHistory.value = [closedTrade, ...tradeHistory.value]
      }
      
      toastStore.success(`Position closed: ${closedTrade.ticket}`)
      await fetchTradingSummary()
      return closedTrade
    } catch (error) {
      toastStore.error(error.response?.data?.detail || 'Failed to close trade')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Enhanced data fetching with better error handling
  const fetchPositions = async (force = false) => {
    try {
      console.log('📊 Fetching positions from API...')
      const data = await tradingAPI.getPositions()
      
      positions.value = [...data]
      positionUpdateTrigger.value++
      
      console.log('📊 Positions loaded:', {
        count: data.length,
        ids: data.map(p => p.id),
        symbols: data.map(p => `${p.symbol} (${p.user_type})`)
      })
      
      // Clear missing position tracking since we just refreshed
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

  // WebSocket updates
  const updateTrade = (tradeData) => {
    const historyIndex = tradeHistory.value.findIndex(t => t.id === tradeData.id)
    if (historyIndex !== -1) {
      const newHistory = [...tradeHistory.value]
      newHistory[historyIndex] = tradeData
      tradeHistory.value = newHistory
    }
    
    if (tradeData.status === 'EXECUTED') {
      const positionIndex = positions.value.findIndex(p => p.id === tradeData.id)
      if (positionIndex !== -1) {
        const newPositions = [...positions.value]
        newPositions[positionIndex] = tradeData
        positions.value = newPositions
        positionUpdateTrigger.value++
      }
    } else {
      positions.value = positions.value.filter(p => p.id !== tradeData.id)
      positionUpdateTrigger.value++
    }
  }

  // ENHANCED: Robust position update with auto-sync
  const updatePosition = async (positionData) => {
    const positionId = String(positionData.id)
    
    console.log('🔄 Processing position update:', {
      id: positionId,
      symbol: positionData.symbol,
      unrealized_pnl: positionData.unrealized_pnl,
      current_price: positionData.current_price
    })
    
    console.log('📊 Current store state:', {
      total_positions: positions.value.length,
      position_ids: positions.value.map(p => String(p.id)),
      missing_ids: Array.from(missingPositionIds.value)
    })
    
    // Find position in store
    const index = positions.value.findIndex(p => String(p.id) === positionId)
    
    if (index !== -1) {
      // Position found - update it
      console.log('✅ Position found at index:', index)
      
      const newPositions = positions.value.map((position, i) => {
        if (i === index) {
          return {
            ...position,
            current_price: positionData.current_price,
            unrealized_pnl: positionData.unrealized_pnl,
            // Preserve all original fields
            id: position.id,
            symbol: position.symbol,
            user_type: position.user_type,
            volume: position.volume,
            entry_price: position.entry_price,
            open_time: position.open_time,
            status: position.status,
            ticket: position.ticket
          }
        }
        return position
      })
      
      positions.value = newPositions
      positionUpdateTrigger.value++
      
      // Remove from missing positions if it was there
      missingPositionIds.value.delete(positionId)
      
      console.log('✅ Position updated successfully:', {
        id: positionId,
        symbol: positionData.symbol,
        new_pnl: positionData.unrealized_pnl
      })
      
    } else {
      // Position not found in store
      console.log('❌ Position not found in store:', {
        looking_for_id: positionId,
        available_ids: positions.value.map(p => String(p.id)),
        position_count: positions.value.length
      })
      
      // Track this missing position
      missingPositionIds.value.add(positionId)
      
      // If we have too many missing positions, refresh the entire store
      if (missingPositionIds.value.size >= 3) {
        console.log('⚠️ Too many missing positions, refreshing store...')
        await fetchPositions(true)
        missingPositionIds.value.clear()
        
        // Try the update again after refresh
        const newIndex = positions.value.findIndex(p => String(p.id) === positionId)
        if (newIndex !== -1) {
          console.log('✅ Position found after refresh, updating...')
          return updatePosition(positionData) // Recursive call after refresh
        }
      } else {
        // For single missing position, try to fetch it specifically
        console.log('🔄 Attempting to sync missing position...')
        try {
          // await fetchPositions(true) // Force refresh
          
          // Try update again after refresh
          const refreshedIndex = positions.value.findIndex(p => String(p.id) === positionId)
          if (refreshedIndex !== -1) {
            console.log('✅ Position found after sync, updating...')
            return updatePosition(positionData) // Recursive call
          } else {
            console.log('❌ Position still not found after sync')
          }
        } catch (error) {
          console.error('❌ Failed to sync positions:', error)
        }
      }
      
      // If it's a new executed position, add it to store
      if (positionData.status === 'EXECUTED') {
        console.log('➕ Adding new position to store')
        positions.value = [...positions.value, positionData]
        positionUpdateTrigger.value++
        missingPositionIds.value.delete(positionId)
      }
    }
  }

  // Enhanced sync function
  const syncPositions = async () => {
    console.log('🔄 Syncing positions with backend...')
    try {
      await fetchPositions(true)
      console.log('✅ Position sync completed')
    } catch (error) {
      console.error('❌ Position sync failed:', error)
    }
  }

  // Debug function to check store state
  const debugStoreState = () => {
    const state = {
      positions_count: positions.value.length,
      position_ids: positions.value.map(p => ({ id: String(p.id), symbol: p.symbol })),
      missing_ids: Array.from(missingPositionIds.value),
      update_trigger: positionUpdateTrigger.value,
      last_price_update: lastPriceUpdate.value
    }
    
    console.log('🔍 Trading Store Debug State:', state)
    return state
  }

  // Force update function for debugging
  const forcePositionUpdate = () => {
    positionUpdateTrigger.value++
    console.log('🔄 Force update triggered:', positionUpdateTrigger.value)
  }

  // Initialize data with better error handling
  const initializeTradingData = async () => {
    try {
      console.log('🚀 Initializing trading data...')
      
      await Promise.all([
        fetchPositions(true),
        fetchTradeHistory(20),
        fetchTradingSummary()
      ])
      
      console.log('✅ Trading data initialization completed')
    } catch (error) {
      console.error('❌ Failed to initialize trading data:', error)
      throw error
    }
  }

  // Utility functions
  const formatPrice = (price, digits = 5) => {
    return typeof price === 'number' ? price.toFixed(digits) : '0.00000'
  }

  const formatPnL = (pnl) => {
    const value = typeof pnl === 'number' ? pnl : 0
    return {
      value,
      formatted: value.toFixed(2),
      isPositive: value >= 0,
      className: value >= 0 ? 'text-profit' : 'text-loss'
    }
  }

  const calculatePipValue = (symbol, price1, price2) => {
    const diff = Math.abs(price1 - price2)
    const multiplier = symbol.includes('JPY') ? 100 : 10000
    return Math.round(diff * multiplier)
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
    missingPositionIds,
    
    // Computed
    openPositions,
    totalUnrealizedPnL,
    symbolPrices,
    
    // Actions
    updatePrice,
    getPrice,
    placeTrade,
    closeTrade,
    fetchPositions,
    fetchTradeHistory,
    fetchTradingSummary,
    updateTrade,
    updatePosition,
    syncPositions,
    forcePositionUpdate,
    debugStoreState,
    initializeTradingData,
    
    // Utilities
    formatPrice,
    formatPnL,
    calculatePipValue
  }
})