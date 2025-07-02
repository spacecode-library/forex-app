// // import axios from 'axios'

// // // Create axios instance
// // const api = axios.create({
// //   baseURL: 'http://localhost:8000/api',
// //   timeout: 10000,
// //   headers: {
// //     'Content-Type': 'application/json'
// //   }
// // })

// // // Request interceptor to add auth token
// // api.interceptors.request.use(
// //   (config) => {
// //     const token = localStorage.getItem('auth_token')
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`
// //     }
// //     return config
// //   },
// //   (error) => {
// //     return Promise.reject(error)
// //   }
// // )

// // // Response interceptor for error handling
// // api.interceptors.response.use(
// //   (response) => {
// //     return response.data
// //   },
// //   (error) => {
// //     if (error.response?.status === 401) {
// //       // Token expired or invalid
// //       localStorage.removeItem('auth_token')
// //       window.location.href = '/login'
// //     }
// //     return Promise.reject(error)
// //   }
// // )

// // // Auth API
// // export const authAPI = {
// //   login: (credentials) => api.post('/auth/login', credentials),
// //   getCurrentUser: () => api.get('/auth/me')
// // }

// // // User API
// // export const userAPI = {
// //   getProfile: () => api.get('/users/profile'),
// //   updateProfile: (data) => api.put('/users/profile', data),
// //   getBalance: () => api.get('/users/balance')
// // }

// // // Trading API
// // export const tradingAPI = {
// //   placeTrade: (tradeData) => api.post('/trades/place', tradeData),
// //   closeTrade: (tradeId) => api.post(`/trades/close/${tradeId}`),
// //   getTradeHistory: (limit = 50, offset = 0) => 
// //     api.get(`/trades/history?limit=${limit}&offset=${offset}`),
// //   getPositions: () => api.get('/trades/positions'),
// //   getTradingSummary: () => api.get('/trades/summary')
// // }

// // // Admin API
// // export const adminAPI = {
// //   getDashboard: () => api.get('/admin/dashboard'),
// //   getUsers: (params = {}) => {
// //     const queryString = new URLSearchParams(params).toString()
// //     return api.get(`/admin/users?${queryString}`)
// //   },
// //   createUser: (userData) => api.post('/admin/users', userData),
// //   updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
// //   deleteUser: (userId) => api.delete(`/admin/users/${userId}`)
// // }

// // // Price API (if needed for historical data)
// // export const priceAPI = {
// //   getHistoricalPrices: (symbol, timeframe, from, to) => 
// //     api.get(`/prices/historical/${symbol}?timeframe=${timeframe}&from=${from}&to=${to}`)
// // }

// // export default api
// import axios from 'axios'

// // Create axios instance
// const api = axios.create({
//   baseURL: 'http://localhost:8000/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('auth_token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => {
//     return response.data
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem('auth_token')
//       window.location.href = '/login'
//     }
//     return Promise.reject(error)
//   }
// )

// // Auth API
// export const authAPI = {
//   login: (credentials) => 
//     api.post('/auth/login', credentials),
//   getCurrentUser: () => api.get('/auth/me')
// }

// // User API
// export const userAPI = {
//   getProfile: () => api.get('/users/profile'),
//   updateProfile: (data) => api.put('/users/profile', data),
//   getBalance: () => api.get('/users/balance')
// }

// // Trading API
// export const tradingAPI = {
//   placeTrade: (tradeData) => api.post('/trades/place', tradeData),
//   closeTrade: (tradeId) => api.post(`/trades/close/${tradeId}`),
//   getTradeHistory: (limit = 50, offset = 0) => 
//     api.get(`/trades/history?limit=${limit}&offset=${offset}`),
//   getPositions: () => api.get('/trades/positions'),
//   getTradingSummary: () => api.get('/trades/summary')
// }

// // Enhanced Admin API with all new endpoints
// export const adminAPI = {
//   // Dashboard
//   getDashboard: () => api.get('/admin/dashboard'),
  
//   // Initial Admin Setup
//   createInitialAdmin: (data) => api.post('/admin/setup/create-admin', data),
  
//   // Admin Management
//   createAdditionalAdmin: (userData) => api.post('/admin/create-admin', userData),
  
//   // User Profile Management
//   createUser: (userData) => api.post('/admin/users', userData),
  
//   getUsers: (params = {}) => {
//     const queryString = new URLSearchParams(
//       Object.entries(params)
//         .filter(([_, value]) => value !== undefined && value !== null)
//         .map(([key, value]) => [key, String(value)])
//     ).toString()
//     return api.get(`/admin/users?${queryString}`)
//   },
  
//   updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  
//   resetUserPassword: (userId, newPassword) => 
//     api.post(`/admin/users/${userId}/reset-password`, { new_password: newPassword }),
  
//   toggleUserStatus: (userId) => 
//     api.post(`/admin/users/${userId}/toggle-status`),
  
//   deleteUser: (userId) => api.delete(`/admin/users/${userId}`)
// }

// // System API
// export const systemAPI = {
//   getHealth: () => api.get('/health', { baseURL: 'http://localhost:8000' }),
//   getInfo: () => api.get('/info', { baseURL: 'http://localhost:8000' })
// }

// // Price API (if needed for historical data)
// export const priceAPI = {
//   getHistoricalPrices: (symbol, timeframe, from, to) => 
//     api.get(`/prices/historical/${symbol}?timeframe=${timeframe}&from=${from}&to=${to}`)
// }

// // Utility function for handling API errors
// export const handleApiError = (error) => {
//   if (error.response?.data?.detail) {
//     return error.response.data.detail
//   }
//   if (error.message) {
//     return error.message
//   }
//   return 'An unexpected error occurred'
// }

// export default api

import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => 
    api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me')
}

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getBalance: () => api.get('/users/balance')
}

// Enhanced Trading API with position sync capabilities
export const tradingAPI = {
  placeTrade: (tradeData) => api.post('/trades/place', tradeData),
  closeTrade: (tradeId) => api.post(`/trades/close/${tradeId}`),
  
  getTradeHistory: (limit = 50, offset = 0) => 
    api.get(`/trades/history?limit=${limit}&offset=${offset}`),
  
  // Enhanced position fetching with better error handling
  getPositions: async () => {
    try {
      console.log('📡 Fetching positions from API...')
      const positions = await api.get('/trades/positions')
      
      console.log('📡 API Response - Positions:', {
        count: positions.length,
        data: positions.map(p => ({
          id: p.id,
          symbol: p.symbol,
          user_type: p.user_type,
          volume: p.volume,
          unrealized_pnl: p.unrealized_pnl
        }))
      })
      
      return positions
    } catch (error) {
      console.error('❌ Failed to fetch positions:', error)
      throw error
    }
  },
  
  // Get specific position by ID
  getPosition: async (positionId) => {
    try {
      console.log('📡 Fetching specific position:', positionId)
      const position = await api.get(`/trades/position/${positionId}`)
      console.log('📡 Position fetched:', position)
      return position
    } catch (error) {
      console.error('❌ Failed to fetch position:', positionId, error)
      throw error
    }
  },
  
  getTradingSummary: () => api.get('/trades/summary'),
  
  // Sync positions - force refresh from server
  syncPositions: async () => {
    try {
      console.log('🔄 Syncing positions with server...')
      const positions = await api.get('/trades/positions?force_refresh=true')
      console.log('✅ Positions synced:', positions.length)
      return positions
    } catch (error) {
      console.error('❌ Position sync failed:', error)
      throw error
    }
  }
}

// Enhanced Admin API with all new endpoints
export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Initial Admin Setup
  createInitialAdmin: (data) => api.post('/admin/setup/create-admin', data),
  
  // Admin Management
  createAdditionalAdmin: (userData) => api.post('/admin/create-admin', userData),
  
  // User Profile Management
  createUser: (userData) => api.post('/admin/users', userData),
  
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString()
    return api.get(`/admin/users?${queryString}`)
  },
  
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  
  resetUserPassword: (userId, newPassword) => 
    api.post(`/admin/users/${userId}/reset-password`, { new_password: newPassword }),
  
  toggleUserStatus: (userId) => 
    api.post(`/admin/users/${userId}/toggle-status`),
  
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`)
}

// System API
export const systemAPI = {
  getHealth: () => api.get('/health', { baseURL: 'http://localhost:8000' }),
  getInfo: () => api.get('/info', { baseURL: 'http://localhost:8000' })
}

// Price API
export const priceAPI = {
  getHistoricalPrices: (symbol, timeframe, from, to) => 
    api.get(`/prices/historical/${symbol}?timeframe=${timeframe}&from=${from}&to=${to}`)
}

// Utility function for handling API errors
export const handleApiError = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail
  }
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Debug utility for API calls
export const debugAPI = {
  // Test position endpoint
  testPositions: async () => {
    try {
      const positions = await tradingAPI.getPositions()
      console.log('🧪 Position API Test Result:', {
        success: true,
        count: positions.length,
        positions: positions
      })
      return positions
    } catch (error) {
      console.error('🧪 Position API Test Failed:', error)
      throw error
    }
  },
  
  // Test specific position
  testPosition: async (positionId) => {
    try {
      const position = await tradingAPI.getPosition(positionId)
      console.log('🧪 Single Position API Test Result:', position)
      return position
    } catch (error) {
      console.error('🧪 Single Position API Test Failed:', error)
      throw error
    }
  }
}

export default api