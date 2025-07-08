// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// import { useAuthStore } from './auth'
// import { useTradingStore } from './trading'

// export const useWebSocketStore = defineStore('websocket', () => {
//   const socket = ref(null)
//   const isConnected = ref(false)
//   const reconnectAttempts = ref(0)
//   const maxReconnectAttempts = 5
//   const reconnectInterval = ref(null)

//   const connect = () => {
//     const authStore = useAuthStore()
    
//     if (!authStore.isAuthenticated) {
//       console.warn('Cannot connect WebSocket: not authenticated')
//       return
//     }

//     try {
//       const wsUrl = `ws://localhost:8000/ws`
//       socket.value = new WebSocket(wsUrl)

//       socket.value.onopen = () => {
//         console.log('WebSocket connected')
//         isConnected.value = true
//         reconnectAttempts.value = 0
        
//         // Subscribe to price updates
//         if (socket.value.readyState === WebSocket.OPEN) {
//           socket.value.send(JSON.stringify({
//             type: 'subscribe',
//             symbols: ['EURUSD', 'USDJPY', 'XAUUSD']
//           }))
//         }
//       }

//       socket.value.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data)
//           handleMessage(data)
//         } catch (error) {
//           console.error('Failed to parse WebSocket message:', error)
//         }
//       }

//       socket.value.onclose = () => {
//         console.log('WebSocket disconnected')
//         isConnected.value = false
        
//         // Attempt to reconnect if authenticated
//         if (authStore.isAuthenticated && reconnectAttempts.value < maxReconnectAttempts) {
//           reconnectAttempts.value++
//           console.log(`Attempting to reconnect... (${reconnectAttempts.value}/${maxReconnectAttempts})`)
          
//           reconnectInterval.value = setTimeout(() => {
//             connect()
//           }, 3000 * reconnectAttempts.value) // Exponential backoff
//         }
//       }

//       socket.value.onerror = (error) => {
//         console.error('WebSocket error:', error)
//       }

//     } catch (error) {
//       console.error('Failed to create WebSocket connection:', error)
//     }
//   }

//   const disconnect = () => {
//     if (reconnectInterval.value) {
//       clearTimeout(reconnectInterval.value)
//       reconnectInterval.value = null
//     }
    
//     if (socket.value) {
//       socket.value.close()
//       socket.value = null
//     }
    
//     isConnected.value = false
//     reconnectAttempts.value = 0
//   }

//   const handleMessage = (data) => {
//     const tradingStore = useTradingStore()
    
//     switch (data.type) {
//       case 'price_update':
//         tradingStore.updatePrice(data.data)
//         break
      
//       case 'subscription_confirmed':
//         console.log('Subscription confirmed for symbols:', data.symbols)
//         break
      
//       case 'trade_update':
//         tradingStore.updateTrade(data.data)
//         break
      
//       case 'position_update':
//         tradingStore.updatePosition(data.data)
//         break
      
//       default:
//         console.log('Unhandled WebSocket message:', data)
//     }
//   }

//   const sendMessage = (message) => {
//     if (socket.value && socket.value.readyState === WebSocket.OPEN) {
//       socket.value.send(JSON.stringify(message))
//     } else {
//       console.warn('WebSocket not connected, cannot send message')
//     }
//   }

//   return {
//     isConnected: computed(() => isConnected.value),
//     connect,
//     disconnect,
//     sendMessage,
//     reconnectAttempts: computed(() => reconnectAttempts.value)
//   }
// })

// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// import { useAuthStore } from './auth'
// import { useTradingStore } from './trading'

// export const useWebSocketStore = defineStore('websocket', () => {
//   const socket = ref(null)
//   const isConnected = ref(false)
//   const reconnectAttempts = ref(0)
//   const maxReconnectAttempts = 5
//   const reconnectInterval = ref(null)

//   const connect = () => {
//     const authStore = useAuthStore()
    
//     if (!authStore.isAuthenticated) {
//       console.warn('Cannot connect WebSocket: not authenticated')
//       return
//     }

//     try {
//       const wsUrl = `ws://localhost:8000/ws`
//       socket.value = new WebSocket(wsUrl)

//       socket.value.onopen = () => {
//         console.log('WebSocket connected')
//         isConnected.value = true
//         reconnectAttempts.value = 0
        
//         // Subscribe to price updates
//         if (socket.value.readyState === WebSocket.OPEN) {
//           socket.value.send(JSON.stringify({
//             type: 'subscribe',
//             symbols: ['EURUSD', 'USDJPY', 'XAUUSD']
//           }))
//         }
//       }

//       socket.value.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data)
//           console.log('📨 WebSocket message received:', data) // Debug log
//           handleMessage(data)
//         } catch (error) {
//           console.error('Failed to parse WebSocket message:', error)
//         }
//       }

//       socket.value.onclose = () => {
//         console.log('WebSocket disconnected')
//         isConnected.value = false
        
//         // Attempt to reconnect if authenticated
//         if (authStore.isAuthenticated && reconnectAttempts.value < maxReconnectAttempts) {
//           reconnectAttempts.value++
//           console.log(`Attempting to reconnect... (${reconnectAttempts.value}/${maxReconnectAttempts})`)
          
//           reconnectInterval.value = setTimeout(() => {
//             connect()
//           }, 3000 * reconnectAttempts.value) // Exponential backoff
//         }
//       }

//       socket.value.onerror = (error) => {
//         console.error('WebSocket error:', error)
//       }

//     } catch (error) {
//       console.error('Failed to create WebSocket connection:', error)
//     }
//   }

//   const disconnect = () => {
//     if (reconnectInterval.value) {
//       clearTimeout(reconnectInterval.value)
//       reconnectInterval.value = null
//     }
    
//     if (socket.value) {
//       socket.value.close()
//       socket.value = null
//     }
    
//     isConnected.value = false
//     reconnectAttempts.value = 0
//   }

//   const handleMessage = (data) => {
//     const tradingStore = useTradingStore()
    
//     // Debug logging
//     if (window.wsDebug) {
//       window.wsDebug(data)
//     }
    
//     switch (data.type) {
//       case 'price_update':
//         console.log('📈 Price update:', data.data.symbol, data.data.bid, data.data.ask)
//         tradingStore.updatePrice(data.data)
//         break
      
//       case 'subscription_confirmed':
//         console.log('✅ Subscription confirmed for symbols:', data.symbols)
//         break
      
//       case 'trade_update':
//         console.log('💼 Trade update:', data.data)
//         tradingStore.updateTrade(data.data)
//         break
      
//       case 'position_update':
//         console.log('🔄 Position update:', data.data.symbol, 'P&L:', data.data.unrealized_pnl)
//         tradingStore.updatePosition(data.data)
//         break
      
//       default:
//         console.log('❓ Unhandled WebSocket message:', data)
//     }
//   }

//   const sendMessage = (message) => {
//     if (socket.value && socket.value.readyState === WebSocket.OPEN) {
//       socket.value.send(JSON.stringify(message))
//     } else {
//       console.warn('WebSocket not connected, cannot send message')
//     }
//   }

//   return {
//     isConnected: computed(() => isConnected.value),
//     connect,
//     disconnect,
//     sendMessage,
//     reconnectAttempts: computed(() => reconnectAttempts.value)
//   }
// })


// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// import { useAuthStore } from './auth'
// import { useTradingStore } from './trading'

// export const useWebSocketStore = defineStore('websocket', () => {
//   const socket = ref(null)
//   const isConnected = ref(false)
//   const reconnectAttempts = ref(0)
//   const maxReconnectAttempts = 5
//   const reconnectInterval = ref(null)
//   const lastMessageTime = ref(null)
//   const messageCount = ref(0)

//   const connect = () => {
//     const authStore = useAuthStore()
    
//     if (!authStore.isAuthenticated) {
//       console.warn('Cannot connect WebSocket: not authenticated')
//       return
//     }

//     try {
//       const wsUrl = `ws://localhost:8000/ws`
//       console.log('🔌 Connecting to WebSocket:', wsUrl)
      
//       socket.value = new WebSocket(wsUrl)

//       socket.value.onopen = () => {
//         console.log('✅ WebSocket connected successfully')
//         isConnected.value = true
//         reconnectAttempts.value = 0
        
//         // Subscribe to price updates
//         if (socket.value.readyState === WebSocket.OPEN) {
//           const subscribeMessage = {
//             type: 'subscribe',
//             symbols: ['EURUSD', 'USDJPY', 'XAUUSD']
//           }
//           socket.value.send(JSON.stringify(subscribeMessage))
//           console.log('📡 Subscription message sent:', subscribeMessage)
//         }
//       }

//       socket.value.onmessage = (event) => {
//         try {
//           const data = JSON.parse(event.data)
//           lastMessageTime.value = new Date()
//           messageCount.value++
          
//           // console.log(`📨 WebSocket message #${messageCount.value}:`, data.type, data)
//           handleMessage(data)
//         } catch (error) {
//           console.error('❌ Failed to parse WebSocket message:', error, event.data)
//         }
//       }

//       socket.value.onclose = (event) => {
//         console.log('❌ WebSocket disconnected:', event.code, event.reason)
//         isConnected.value = false
        
//         // Attempt to reconnect if authenticated
//         if (authStore.isAuthenticated && reconnectAttempts.value < maxReconnectAttempts) {
//           reconnectAttempts.value++
//           const delay = 3000 * reconnectAttempts.value // Exponential backoff
//           console.log(`🔄 Attempting to reconnect in ${delay}ms... (${reconnectAttempts.value}/${maxReconnectAttempts})`)
          
//           reconnectInterval.value = setTimeout(() => {
//             connect()
//           }, delay)
//         } else if (reconnectAttempts.value >= maxReconnectAttempts) {
//           console.error('❌ Max reconnection attempts reached')
//         }
//       }

//       socket.value.onerror = (error) => {
//         console.error('❌ WebSocket error:', error)
//       }

//     } catch (error) {
//       console.error('❌ Failed to create WebSocket connection:', error)
//     }
//   }

//   const disconnect = () => {
//     console.log('🔌 Disconnecting WebSocket')
    
//     if (reconnectInterval.value) {
//       clearTimeout(reconnectInterval.value)
//       reconnectInterval.value = null
//     }
    
//     if (socket.value) {
//       socket.value.close()
//       socket.value = null
//     }
    
//     isConnected.value = false
//     reconnectAttempts.value = 0
//   }

//   const handleMessage = (data) => {
//     const tradingStore = useTradingStore()
    
//     switch (data.type) {
//       case 'price_update':
//         // console.log('📈 Processing price update:', data.data.symbol, data.data.bid, data.data.ask)
//         tradingStore.updatePrice(data.data)
//         break
      
//       case 'subscription_confirmed':
//         // console.log('✅ Subscription confirmed for symbols:', data.symbols)
//         break
      
//       case 'trade_update':
//         // console.log('💼 Processing trade update:', data.data.id, data.data.status)
//         tradingStore.updateTrade(data.data)
//         break
      
//       case 'position_update':
//         // console.log('🔄 Processing position update:', {
//         //   id: data.data.id,
//         //   symbol: data.data.symbol,
//         //   unrealized_pnl: data.data.unrealized_pnl,
//         //   current_price: data.data.current_price
//         // })
        
//         // Ensure the position update has the required fields
//         if (data.data.id && data.data.symbol && typeof data.data.unrealized_pnl === 'number') {
//           tradingStore.updatePosition(data.data)
//           // console.log('✅ Position update processed successfully')
//         } else {
//           // console.warn('⚠️ Invalid position update data:', data.data)
//         }
//         break
      
//       default:
//         // console.log('❓ Unhandled WebSocket message type:', data.type, data)
//     }
//   }

//   const sendMessage = (message) => {
//     if (socket.value && socket.value.readyState === WebSocket.OPEN) {
//       const messageStr = JSON.stringify(message)
//       socket.value.send(messageStr)
//       console.log('📤 Message sent:', message)
//     } else {
//       console.warn('⚠️ WebSocket not connected, cannot send message:', message)
//     }
//   }

//   // Ping function to keep connection alive
//   const ping = () => {
//     if (isConnected.value) {
//       sendMessage({ type: 'ping' })
//     }
//   }

//   // Start ping interval when connected
//   let pingInterval = null
  
//   const startPingInterval = () => {
//     if (pingInterval) clearInterval(pingInterval)
//     pingInterval = setInterval(ping, 30000) // Ping every 30 seconds
//   }

//   const stopPingInterval = () => {
//     if (pingInterval) {
//       clearInterval(pingInterval)
//       pingInterval = null
//     }
//   }

//   // Watch connection status
//   const watchConnection = () => {
//     if (isConnected.value) {
//       startPingInterval()
//     } else {
//       stopPingInterval()
//     }
//   }

//   // Force reconnect function
//   const forceReconnect = () => {
//     console.log('🔄 Force reconnecting...')
//     disconnect()
//     setTimeout(() => {
//       reconnectAttempts.value = 0
//       connect()
//     }, 1000)
//   }

//   return {
//     // State
//     isConnected: computed(() => isConnected.value),
//     reconnectAttempts: computed(() => reconnectAttempts.value),
//     lastMessageTime: computed(() => lastMessageTime.value),
//     messageCount: computed(() => messageCount.value),
    
//     // Actions
//     connect,
//     disconnect,
//     sendMessage,
//     forceReconnect,
    
//     // Internal methods (exposed for debugging)
//     _handleMessage: handleMessage,
//     _watchConnection: watchConnection
//   }
// })


// stores/websocket.js (Enhanced for real-time position P&L)
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import { useTradingStore } from './trading'

export const useWebSocketStore = defineStore('websocket', () => {
  const socket = ref(null)
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectInterval = ref(null)
  const lastMessageTime = ref(null)
  const messageCount = ref(0)
  const priceUpdateCount = ref(0)
  const positionUpdateCount = ref(0)

  const connect = () => {
    const authStore = useAuthStore()
    
    if (!authStore.isAuthenticated) {
      console.warn('Cannot connect WebSocket: not authenticated')
      return
    }

    try {
      const wsUrl = `ws://localhost:8000/ws`
      console.log('🔌 Connecting to WebSocket:', wsUrl)
      
      socket.value = new WebSocket(wsUrl)

      socket.value.onopen = () => {
        console.log('✅ WebSocket connected successfully')
        isConnected.value = true
        reconnectAttempts.value = 0
        
        // Subscribe to price updates for all symbols
        if (socket.value.readyState === WebSocket.OPEN) {
          const subscribeMessage = {
            type: 'subscribe',
            symbols: ['EURUSD', 'USDJPY', 'XAUUSD']
          }
          socket.value.send(JSON.stringify(subscribeMessage))
          console.log('📡 Subscription message sent:', subscribeMessage)
        }
      }

      socket.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          lastMessageTime.value = new Date()
          messageCount.value++
          
          // Enhanced message handling for real-time P&L
          handleMessage(data)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      socket.value.onclose = () => {
        console.log('❌ WebSocket disconnected')
        isConnected.value = false
        
        // Attempt to reconnect if authenticated
        if (authStore.isAuthenticated && reconnectAttempts.value < maxReconnectAttempts) {
          reconnectAttempts.value++
          console.log(`🔄 Attempting to reconnect... (${reconnectAttempts.value}/${maxReconnectAttempts})`)
          
          reconnectInterval.value = setTimeout(() => {
            connect()
          }, 3000 * reconnectAttempts.value)
        }
      }

      socket.value.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
      }

    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error)
    }
  }

  const disconnect = () => {
    if (reconnectInterval.value) {
      clearTimeout(reconnectInterval.value)
      reconnectInterval.value = null
    }
    
    if (socket.value) {
      socket.value.close()
      socket.value = null
    }
    
    isConnected.value = false
    reconnectAttempts.value = 0
  }

  // 🚀 ENHANCED: Real-time message handling for positions
  const handleMessage = (data) => {
    const tradingStore = useTradingStore()
    
    switch (data.type) {
      case 'price_update':
        priceUpdateCount.value++
        console.log('📈 Price update received:', {
          symbol: data.data.symbol,
          bid: data.data.bid,
          ask: data.data.ask,
          count: priceUpdateCount.value
        })
        
        // 🎯 CRITICAL: Update price in trading store (triggers P&L recalculation)
        tradingStore.updatePrice(data.data)
        break
      
      case 'position_update':
        positionUpdateCount.value++
        console.log('🔄 Position update received:', {
          id: data.data.id,
          symbol: data.data.symbol,
          pnl: data.data.unrealized_pnl,
          count: positionUpdateCount.value
        })
        
        // Validate position update data
        if (data.data.id && data.data.symbol && typeof data.data.unrealized_pnl === 'number') {
          tradingStore.updatePosition(data.data)
          console.log('✅ Position P&L updated successfully')
        } else {
          console.warn('⚠️ Invalid position update data:', data.data)
        }
        break
      
      case 'subscription_confirmed':
        console.log('✅ Subscription confirmed for symbols:', data.symbols)
        break
      
      case 'trade_update':
        console.log('💼 Trade update received:', data.data)
        // Handle trade status updates (executed, cancelled, etc.)
        break
      
      case 'market_status':
        console.log('🏢 Market status update:', data.data)
        // Handle market open/close status
        break
      
      case 'pong':
        console.log('🏓 Pong received')
        break
      
      default:
        console.log('❓ Unhandled WebSocket message type:', data.type, data)
    }
  }

  const sendMessage = (message) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      const messageStr = JSON.stringify(message)
      socket.value.send(messageStr)
      console.log('📤 Message sent:', message)
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message:', message)
    }
  }

  // Ping function to keep connection alive
  const ping = () => {
    if (isConnected.value) {
      sendMessage({ type: 'ping' })
    }
  }

  // Start ping interval when connected
  let pingInterval = null
  
  const startPingInterval = () => {
    if (pingInterval) clearInterval(pingInterval)
    pingInterval = setInterval(ping, 30000) // Ping every 30 seconds
  }

  const stopPingInterval = () => {
    if (pingInterval) {
      clearInterval(pingInterval)
      pingInterval = null
    }
  }

  // Watch connection status
  const watchConnection = () => {
    if (isConnected.value) {
      startPingInterval()
    } else {
      stopPingInterval()
    }
  }

  // Force reconnect function
  const forceReconnect = () => {
    console.log('🔄 Force reconnecting...')
    disconnect()
    setTimeout(() => {
      reconnectAttempts.value = 0
      connect()
    }, 1000)
  }

  // 🆕 Request manual position updates
  const requestPositionUpdates = () => {
    if (isConnected.value) {
      sendMessage({
        type: 'request_position_updates',
        timestamp: new Date().toISOString()
      })
      console.log('📡 Requested position updates')
    }
  }

  // 🆕 Subscribe to specific symbol
  const subscribeToSymbol = (symbol) => {
    if (isConnected.value) {
      sendMessage({
        type: 'subscribe_symbol',
        symbol: symbol
      })
      console.log(`📡 Subscribed to ${symbol}`)
    }
  }

  // 🆕 Get connection statistics
  const getConnectionStats = () => {
    return {
      isConnected: isConnected.value,
      reconnectAttempts: reconnectAttempts.value,
      messageCount: messageCount.value,
      priceUpdateCount: priceUpdateCount.value,
      positionUpdateCount: positionUpdateCount.value,
      lastMessageTime: lastMessageTime.value,
      uptime: lastMessageTime.value ? Date.now() - lastMessageTime.value : 0
    }
  }

  return {
    // State
    isConnected: computed(() => isConnected.value),
    reconnectAttempts: computed(() => reconnectAttempts.value),
    lastMessageTime: computed(() => lastMessageTime.value),
    messageCount: computed(() => messageCount.value),
    priceUpdateCount: computed(() => priceUpdateCount.value),
    positionUpdateCount: computed(() => positionUpdateCount.value),
    
    // Actions
    connect,
    disconnect,
    sendMessage,
    forceReconnect,
    requestPositionUpdates,
    subscribeToSymbol,
    getConnectionStats,
    
    // Internal methods (exposed for debugging)
    _handleMessage: handleMessage,
    _watchConnection: watchConnection
  }
})