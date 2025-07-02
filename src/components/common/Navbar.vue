<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 fixed bottom-0 w-full z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Left side -->
        <div class="flex items-center">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <!-- <router-link to="/dashboard" class="text-xl font-bold text-blue-600">
              MetaTrader
            </router-link> -->
          </div>
          
          <!-- Navigation Links -->
          <div class=" md:ml-8 flex space-x-4 md:space-x-8">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.to"
              :class="[
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'item-center  text- font-medium transition-colors',
                { 'border-blue-500 text-blue-600': $route.path === item.to }
              ]"
            >
            <div class="text-center">
              <component :is="item.icon" class="w-6 h-6 mr-1 leading-none inline-block" />
              <span class="text-xs">{{ item.name }}</span>
            </div>
            </router-link>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <!-- Balance Display -->
          <div class="hidden sm:flex items-center bg-green-50 px-3 py-1 rounded-full">
            <BanknotesIcon class="w-4 h-4 text-green-600 mr-1" />
            <span class="text-sm font-medium text-green-700">
              ${{ formatBalance(user?.balance || 0) }}
            </span>
          </div>

          <!-- Connection Status -->
          <!-- <div class="flex items-center">
            <div :class="[
              'w-2 h-2 rounded-full mr-2',
              isConnected ? 'bg-green-500' : 'bg-red-500'
            ]"></div>
            <span :class="[
              'text-xs font-medium',
              isConnected ? 'text-green-600' : 'text-red-600'
            ]">
              {{ isConnected ? 'Live' : 'Disconnected' }}
            </span>
          </div> -->

          <!-- Theme Toggle -->
          <!-- <button
            @click="toggleTheme"
            class="p-2 text-gray-400 hover:text-gray-500 transition-colors"
          >
            <SunIcon v-if="isDarkMode" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button> -->

          <!-- User Menu -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-medium">
                  {{ userInitials }}
                </span>
              </div>
            </button>

            <!-- User Dropdown -->
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="showUserMenu"
                class="origin-bottom-right absolute right-0 bottom-12 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div class="py-1">
                  <div class="px-4 py-2 text-sm text-gray-700 border-b">
                    <div class="font-medium">{{ user?.first_name }} {{ user?.last_name }}</div>
                    <div class="text-gray-500">{{ user?.username }}</div>
                  </div>
                  
                  <router-link
                    to="/profile"
                    @click="showUserMenu = false"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserIcon class="w-4 h-4 mr-2 inline-block" />
                    Profile
                  </router-link>
                  
                  <router-link
                    v-if="user?.is_admin"
                    to="/admin"
                    @click="showUserMenu = false"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <CogIcon class="w-4 h-4 mr-2 inline-block" />
                    Admin Panel
                  </router-link>
                  
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowRightOnRectangleIcon class="w-4 h-4 mr-2 inline-block" />
                    Sign out
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- Mobile menu button -->
          <!-- <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 text-gray-400 hover:text-gray-500"
          >
            <Bars3Icon class="w-6 h-6" />
          </button> -->
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.to"
          @click="showMobileMenu = false"
          :class="[
            'block pl-3 pr-4 py-2 text-base font-medium transition-colors',
            $route.path === item.to
              ? 'bg-blue-50 border-blue-500 text-blue-700 border-r-4'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-2 inline-block" />
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWebSocketStore } from '@/stores/websocket'
import { useUIStore } from '@/stores/ui'

import {
  HomeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const wsStore = useWebSocketStore()
const uiStore = useUIStore()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const userMenuRef = ref(null)

const user = computed(() => authStore.user)
const isConnected = computed(() => wsStore.isConnected)
const isDarkMode = computed(() => uiStore.isDarkMode)

const userInitials = computed(() => {
  if (!user.value) return 'U'
  const firstName = user.value.first_name || ''
  const lastName = user.value.last_name || ''
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
})

const navigationItems = computed(() => {
  const items = [
    { name: 'Quotes', to: '/dashboard', icon: HomeIcon },
    // { name: 'Trading', to: '/trading', icon: ChartBarIcon },
    { name: 'Positions', to: '/positions', icon: CurrencyDollarIcon },
    { name: 'History', to: '/history', icon: ClockIcon }
  ]

  if (user.value?.is_admin) {
    items.push({ name: 'Admin', to: '/admin', icon: CogIcon })
  }

  return items
})

const formatBalance = (balance) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(balance)
}

const toggleTheme = () => {
  uiStore.toggleTheme()
}

const handleLogout = () => {
  showUserMenu.value = false
  authStore.logout()
  router.push('/login')
}

// Close user menu when clicking outside
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>