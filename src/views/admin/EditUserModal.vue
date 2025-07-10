<!-- <template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Edit User</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              v-model="form.first_name"
              type="text"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="First name"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              v-model="form.last_name"
              type="text"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            :value="user.username"
            type="text"
            disabled
            class="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p class="mt-1 text-xs text-gray-500">Username cannot be changed</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Balance
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              v-model.number="form.balance"
              type="number"
              step="0.01"
              min="0"
              class="block w-full pl-8 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">
                Account active
              </label>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="form.is_fake"
                type="checkbox"
                :disabled="hasOpenPositions"
                :class="[
                  'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
                  { 'opacity-50 cursor-not-allowed': hasOpenPositions }
                ]"
              />
              <label :class="[
                'ml-2 block text-sm',
                hasOpenPositions ? 'text-gray-500' : 'text-gray-900'
              ]">
                Demo account (fake trading)
              </label>
            </div>
          </div>
          
          <div v-if="hasOpenPositions" class="text-xs text-amber-600">
            <ExclamationTriangleIcon class="h-4 w-4 inline mr-1" />
            Cannot change account type while user has open positions
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 class="text-sm font-medium text-gray-900">User Statistics</h4>
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span class="text-gray-600">Member since:</span>
              <div class="font-medium">{{ formatDate(user.created_at) }}</div>
            </div>
            <div>
              <span class="text-gray-600">Last updated:</span>
              <div class="font-medium">{{ formatDate(user.updated_at) }}</div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <div v-if="isSubmitting" class="flex items-center">
              <div class="spinner mr-2"></div>
              Updating...
            </div>
            <span v-else>Update User</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminAPI } from '@/services/api'
import { useToastStore } from '@/stores/toast'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])
const toastStore = useToastStore()

const isSubmitting = ref(false)
const hasOpenPositions = ref(false) // This would need to be fetched from API

const form = ref({
  first_name: '',
  last_name: '',
  balance: 0,
  is_active: true,
  is_fake: true
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
}

const submitForm = async () => {
  isSubmitting.value = true
  try {
    const updatedUser = await adminAPI.updateUser(props.user.id, form.value)
    emit('updated', updatedUser)
  } catch (error) {
    if (error.response?.status === 400) {
      toastStore.error(error.response.data.detail || 'Update failed')
    } else {
      toastStore.error('Failed to update user')
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  // Initialize form with user data
  form.value = {
    first_name: props.user.first_name || '',
    last_name: props.user.last_name || '',
    balance: props.user.balance || 0,
    is_active: props.user.is_active,
    is_fake: props.user.is_fake
  }
  
  // TODO: Check if user has open positions
  // This would require an API call to check for open trades
  hasOpenPositions.value = false
})
</script> -->

<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Edit User</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              v-model="form.first_name"
              type="text"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="First name"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              v-model="form.last_name"
              type="text"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            :value="user.username"
            type="text"
            disabled
            class="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p class="mt-1 text-xs text-gray-500">Username cannot be changed</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Balance
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              v-model.number="form.balance"
              type="number"
              step="0.01"
              min="0"
              class="block w-full pl-8 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- NEW: Leverage Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Leverage
          </label>
          <div class="relative">
            <input
              v-model.number="form.leverage"
              type="number"
              min="1"
              max="1000"
              :disabled="hasOpenPositions"
              :class="[
                'block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
                { 'opacity-50 cursor-not-allowed bg-gray-50': hasOpenPositions }
              ]"
              placeholder="100"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">:1</span>
            </div>
          </div>
          <div v-if="hasOpenPositions" class="mt-1 text-xs text-amber-600">
            <ExclamationTriangleIcon class="h-4 w-4 inline mr-1" />
            Cannot change leverage while user has open positions
          </div>
          <div v-else class="mt-1 text-xs text-gray-500">
            Range: 1:1 to 1000:1
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="form.is_active"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">
                Account active
              </label>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="form.is_fake"
                type="checkbox"
                :disabled="hasOpenPositions"
                :class="[
                  'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
                  { 'opacity-50 cursor-not-allowed': hasOpenPositions }
                ]"
              />
              <label :class="[
                'ml-2 block text-sm',
                hasOpenPositions ? 'text-gray-500' : 'text-gray-900'
              ]">
                Demo account (fake trading)
              </label>
            </div>
          </div>
          
          <div v-if="hasOpenPositions" class="text-xs text-amber-600">
            <ExclamationTriangleIcon class="h-4 w-4 inline mr-1" />
            Cannot change account type while user has open positions
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 class="text-sm font-medium text-gray-900">User Statistics</h4>
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span class="text-gray-600">Member since:</span>
              <div class="font-medium">{{ formatDate(user.created_at) }}</div>
            </div>
            <div>
              <span class="text-gray-600">Last updated:</span>
              <div class="font-medium">{{ formatDate(user.updated_at) }}</div>
            </div>
            <!-- NEW: Show current leverage -->
            <div>
              <span class="text-gray-600">Current leverage:</span>
              <div class="font-medium">{{ user.leverage || 100 }}:1</div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <div v-if="isSubmitting" class="flex items-center">
              <div class="spinner mr-2"></div>
              Updating...
            </div>
            <span v-else>Update User</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminAPI } from '@/services/api'
import { useToastStore } from '@/stores/toast'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])
const toastStore = useToastStore()

const isSubmitting = ref(false)
const hasOpenPositions = ref(false)

const form = ref({
  first_name: '',
  last_name: '',
  balance: 0,
  leverage: 100, // NEW: Add leverage to form
  is_active: true,
  is_fake: true
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
}

const submitForm = async () => {
  // Validate leverage range
  if (form.value.leverage < 1 || form.value.leverage > 1000) {
    toastStore.error('Leverage must be between 1 and 1000')
    return
  }

  isSubmitting.value = true
  try {
    const updatedUser = await adminAPI.updateUser(props.user.id, form.value)
    emit('updated', updatedUser)
    toastStore.success('User updated successfully')
  } catch (error) {
    if (error.response?.status === 400) {
      toastStore.error(error.response.data.detail || 'Update failed')
    } else {
      toastStore.error('Failed to update user')
    }
  } finally {
    isSubmitting.value = false
  }
}

const checkOpenPositions = async () => {
  try {
    // You can implement this API call to check for open positions
    // For now, we'll assume no open positions
    hasOpenPositions.value = false
  } catch (error) {
    console.error('Failed to check open positions:', error)
  }
}

onMounted(async () => {
  // Initialize form with user data
  form.value = {
    first_name: props.user.first_name || '',
    last_name: props.user.last_name || '',
    balance: props.user.balance || 0,
    leverage: props.user.leverage || 100, // NEW: Initialize leverage
    is_active: props.user.is_active,
    is_fake: props.user.is_fake
  }
  
  // Check if user has open positions
  await checkOpenPositions()
})
</script>

<style scoped>
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>