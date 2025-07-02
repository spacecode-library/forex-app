import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isLoading = ref(false)
  const isSidebarOpen = ref(true)
  const currentModal = ref(null)
  const theme = ref(localStorage.getItem('theme') || 'light')
  
  const isDarkMode = computed(() => theme.value === 'dark')

  // Loading state management
  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const withLoading = async (asyncFn) => {
    setLoading(true)
    try {
      return await asyncFn()
    } finally {
      setLoading(false)
    }
  }

  // Sidebar management
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const setSidebarOpen = (open) => {
    isSidebarOpen.value = open
  }

  // Modal management
  const openModal = (modalName, data = null) => {
    currentModal.value = { name: modalName, data }
  }

  const closeModal = () => {
    currentModal.value = null
  }

  // Theme management
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    
    // Apply theme to document
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize theme on store creation
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  }

  // Mobile detection
  const isMobile = computed(() => {
    return window.innerWidth < 768
  })

  // Screen size management
  const screenSize = ref({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const updateScreenSize = () => {
    screenSize.value = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  // Initialize screen size listener
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateScreenSize)
  }

  return {
    // State
    isLoading,
    isSidebarOpen,
    currentModal,
    theme,
    screenSize,
    
    // Computed
    isDarkMode,
    isMobile,
    
    // Actions
    setLoading,
    withLoading,
    toggleSidebar,
    setSidebarOpen,
    openModal,
    closeModal,
    toggleTheme,
    setTheme,
    updateScreenSize
  }
})