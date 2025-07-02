<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p class="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Information -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow-sm rounded-lg border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Personal Information</h2>
            </div>
            
            <form @submit.prevent="updateProfile" class="p-6 space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    v-model="profileForm.first_name"
                    type="text"
                    class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    v-model="profileForm.last_name"
                    type="text"
                    class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  :value="user?.username"
                  type="text"
                  disabled
                  class="block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p class="mt-1 text-sm text-gray-500">Username cannot be changed</p>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isUpdatingProfile"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <div v-if="isUpdatingProfile" class="spinner mr-2"></div>
                  {{ isUpdatingProfile ? 'Updating...' : 'Update Profile' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Account Security -->
          <div class="bg-white shadow-sm rounded-lg border border-gray-200 mt-8">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Account Security</h2>
            </div>
            
            <div class="p-6">
              <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div class="flex">
                  <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">
                      Password Management
                    </h3>
                    <div class="mt-2 text-sm text-yellow-700">
                      <p>Password changes are currently managed by the administrator. Please contact support if you need to change your password.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow-sm rounded-lg border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Account Summary</h2>
            </div>
            
            <div class="p-6 space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Account Balance</span>
                <span class="text-lg font-semibold text-gray-900">
                  {{ formatCurrency(user?.balance || 0) }}
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Account Type</span>
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  user?.is_fake ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                ]">
                  {{ user?.is_fake ? 'Demo' : 'Live' }}
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Account Status</span>
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ user?.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Member Since</span>
                <span class="text-sm text-gray-900">
                  {{ formatDate(user?.created_at) }}
                </span>
              </div>

              <div v-if="user?.is_admin" class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Privileges</span>
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                  Administrator
                </span>
              </div>
            </div>
          </div>

          <!-- Trading Statistics -->
          <div class="bg-white shadow-sm rounded-lg border border-gray-200 mt-6">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Trading Stats</h2>
            </div>
            
            <div class="p-6 space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Total Trades</span>
                <span class="text-sm font-semibold text-gray-900">
                  {{ tradingSummary.total_trades || 0 }}
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Winning Trades</span>
                <span class="text-sm font-semibold text-green-600">
                  {{ tradingSummary.winning_trades || 0 }}
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Win Rate</span>
                <span class="text-sm font-semibold text-gray-900">
                  {{ (tradingSummary.win_rate || 0).toFixed(1) }}%
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Total P&L</span>
                <span :class="[
                  'text-sm font-semibold',
                  (tradingSummary.total_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ formatCurrency(tradingSummary.total_profit || 0) }}
                </span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Open Positions</span>
                <span class="text-sm font-semibold text-gray-900">
                  {{ tradingSummary.open_positions || 0 }}
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white shadow-sm rounded-lg border border-gray-200 mt-6">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            
            <div class="p-6 space-y-3">
              <router-link
                to="/trading"
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ChartBarIcon class="w-4 h-4 mr-2" />
                Start Trading
              </router-link>
              
              <router-link
                to="/positions"
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <CurrencyDollarIcon class="w-4 h-4 mr-2" />
                View Positions
              </router-link>
              
              <router-link
                to="/history"
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ClockIcon class="w-4 h-4 mr-2" />
                Trade History
              </router-link>

              <router-link
                v-if="user?.is_admin"
                to="/admin"
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <CogIcon class="w-4 h-4 mr-2" />
                Admin Panel
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTradingStore } from '@/stores/trading'
import { useToastStore } from '@/stores/toast'
import { userAPI } from '@/services/api'

import {
  ExclamationTriangleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const tradingStore = useTradingStore()
const toastStore = useToastStore()

const isUpdatingProfile = ref(false)

const user = computed(() => authStore.user)
const tradingSummary = computed(() => tradingStore.tradingSummary)

const profileForm = ref({
  first_name: '',
  last_name: ''
})

const updateProfile = async () => {
  isUpdatingProfile.value = true
  try {
    const updatedUser = await userAPI.updateProfile(profileForm.value)
    authStore.updateUser(updatedUser)
    toastStore.success('Profile updated successfully')
  } catch (error) {
    toastStore.error('Failed to update profile')
  } finally {
    isUpdatingProfile.value = false
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  // Initialize form with current user data
  if (user.value) {
    profileForm.value = {
      first_name: user.value.first_name || '',
      last_name: user.value.last_name || ''
    }
  }

  // Fetch trading summary
  await tradingStore.fetchTradingSummary()
})
</script>