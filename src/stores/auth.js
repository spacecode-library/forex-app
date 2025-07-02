// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// import { authAPI } from '@/services/api'
// import { useWebSocketStore } from './websocket'
// import { useToastStore } from './toast'

// export const useAuthStore = defineStore('auth', () => {
//   const user = ref(null)
//   const token = ref(localStorage.getItem('auth_token'))
//   const isLoading = ref(false)
//   const initialized = ref(false)

//   const isAuthenticated = computed(() => !!token.value && !!user.value)
//   const isAdmin = computed(() => user.value?.is_admin || false)

//   // Initialize authentication state
//   const initializeAuth = async () => {
//     if (token.value) {
//       try {
//         const userData = await authAPI.getCurrentUser()
//         user.value = userData
//       } catch (error) {
//         console.error('Failed to get current user:', error)
//         logout()
//       }
//     }
//     initialized.value = true
//   }

//   // Login
//   const login = async (credentials) => {
//     isLoading.value = true
//     try {
//       const response = await authAPI.login(credentials)
//       token.value = response.access_token
//       localStorage.setItem('auth_token', response.access_token)
      
//       // Get user data
//       const userData = await authAPI.getCurrentUser()
//       user.value = userData
      
//       // Connect WebSocket
//       const wsStore = useWebSocketStore()
//       wsStore.connect()
      
//       const toastStore = useToastStore()
//       toastStore.success('Login successful!')
      
//       return response
//     } catch (error) {
//       const toastStore = useToastStore()
//       toastStore.error(error.response?.data?.detail || 'Login failed')
//       throw error
//     } finally {
//       isLoading.value = false
//     }
//   }

//   // Logout
//   const logout = () => {
//     user.value = null
//     token.value = null
//     localStorage.removeItem('auth_token')
    
//     // Disconnect WebSocket
//     const wsStore = useWebSocketStore()
//     wsStore.disconnect()
    
//     const toastStore = useToastStore()
//     toastStore.info('Logged out successfully')
//   }

//   // Update user data
//   const updateUser = (userData) => {
//     user.value = { ...user.value, ...userData }
//   }

//   // Get auth header for API calls
//   const getAuthHeader = () => {
//     return token.value ? `Bearer ${token.value}` : null
//   }

//   return {
//     user,
//     token,
//     isLoading,
//     initialized,
//     isAuthenticated,
//     isAdmin,
//     initializeAuth,
//     login,
//     logout,
//     updateUser,
//     getAuthHeader
//   }
// })

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, handleApiError } from '@/services/api'
import { useWebSocketStore } from './websocket'
import { useToastStore } from './toast'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.is_admin || false)

  // Initialize authentication state
  const initializeAuth = async () => {
    if (token.value) {
      try {
        const userData = await authAPI.getCurrentUser()
        user.value = userData
      } catch (error) {
        console.error('Failed to get current user:', error)
        logout()
      }
    }
    initialized.value = true
  }

  // Login
  const login = async (credentials) => {
    isLoading.value = true
    try {
      const response = await authAPI.login(credentials)
      token.value = response.access_token
      localStorage.setItem('auth_token', response.access_token)
      
      // Handle both old and new response formats
      if (response.user) {
        // New format: user data included in login response
        user.value = response.user
      } else {
        // Old format: fetch user data separately
        const userData = await authAPI.getCurrentUser()
        user.value = userData
      }
      
      // Connect WebSocket
      const wsStore = useWebSocketStore()
      wsStore.connect()
      
      const toastStore = useToastStore()
      toastStore.success(`Welcome back, ${user.value.first_name}!`)
      
      return response
    } catch (error) {
      const toastStore = useToastStore()
      toastStore.error(handleApiError(error) || 'Login failed')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    
    // Disconnect WebSocket
    const wsStore = useWebSocketStore()
    wsStore.disconnect()
    
    const toastStore = useToastStore()
    toastStore.info('Logged out successfully')
  }

  // Update user data
  const updateUser = (userData) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    if (!token.value) return
    
    try {
      const userData = await authAPI.getCurrentUser()
      user.value = userData
    } catch (error) {
      console.error('Failed to refresh user data:', error)
      // Don't logout on refresh failure, might be temporary network issue
    }
  }

  // Get auth header for API calls
  const getAuthHeader = () => {
    return token.value ? `Bearer ${token.value}` : null
  }

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user.value) return false
    if (user.value.is_admin) return true // Admins have all permissions
    
    // Add more specific permission logic here as needed
    return false
  }

  return {
    user,
    token,
    isLoading,
    initialized,
    isAuthenticated,
    isAdmin,
    initializeAuth,
    login,
    logout,
    updateUser,
    refreshUser,
    getAuthHeader,
    hasPermission
  }
})