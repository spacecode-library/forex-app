<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Create New User</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              v-model="form.first_name"
              type="text"
              required
              minlength="1"
              maxlength="50"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="First name"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              v-model="form.last_name"
              type="text"
              required
              minlength="1"
              maxlength="50"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Username *
          </label>
          <input
            v-model="form.username"
            type="text"
            required
            minlength="3"
            maxlength="50"
            pattern="[a-zA-Z0-9_-]+"
            class="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Username (letters, numbers, _ and - only)"
            @input="validateUsername"
          />
          <p v-if="usernameError" class="mt-1 text-xs text-red-600">{{ usernameError }}</p>
          <p v-else class="mt-1 text-xs text-gray-500">
            At least 3 characters. Only letters, numbers, hyphens, and underscores allowed.
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="6"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password (minimum 6 characters)"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <EyeIcon v-if="!showPassword" class="h-4 w-4 text-gray-400" />
              <EyeSlashIcon v-else class="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <div class="mt-1 text-xs text-gray-500">
            Password strength: 
            <span :class="passwordStrengthClass">{{ passwordStrength }}</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Initial Balance
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
              max="1000000"
              class="block w-full pl-8 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10000.00"
            />
          </div>
          <p class="mt-1 text-xs text-gray-500">Default: $10,000.00</p>
        </div>

        <div class="space-y-3">
          <div class="flex items-center">
            <input
              v-model="form.is_admin"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">
              Administrator privileges
            </label>
          </div>

          <div class="flex items-center">
            <input
              v-model="form.is_fake"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">
              Demo account (fake trading)
            </label>
          </div>
        </div>

        <!-- Account Type Info -->
        <div class="bg-blue-50 rounded-lg p-3">
          <div class="flex">
            <InformationCircleIcon class="h-5 w-5 text-blue-400 mt-0.5" />
            <div class="ml-3 text-sm">
              <p class="text-blue-700 font-medium">Account Type Information</p>
              <p class="text-blue-600 mt-1">
                <strong>Demo Account:</strong> Practice trading with virtual money (safe for beginners)<br>
                <strong>Live Account:</strong> Real trading with actual money (requires experience)
              </p>
            </div>
          </div>
        </div>

        <!-- Generate Random Password Button -->
        <div class="flex justify-between items-center">
          <button
            type="button"
            @click="generateRandomPassword"
            class="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Generate Random Password
          </button>
          <span v-if="passwordGenerated" class="text-xs text-green-600">
            ✓ Password generated
          </span>
        </div>

        <!-- User Preview -->
        <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <h4 class="font-medium text-gray-900">User Preview</h4>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <span class="text-gray-600">Name:</span>
              <div class="font-medium">{{ form.first_name }} {{ form.last_name || '...' }}</div>
            </div>
            <div>
              <span class="text-gray-600">Username:</span>
              <div class="font-medium">{{ form.username || '...' }}</div>
            </div>
            <div>
              <span class="text-gray-600">Role:</span>
              <span :class="[
                'inline-flex px-2 py-0.5 rounded text-xs font-semibold',
                form.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              ]">
                {{ form.is_admin ? 'Administrator' : 'User' }}
              </span>
            </div>
            <div>
              <span class="text-gray-600">Account:</span>
              <span :class="[
                'inline-flex px-2 py-0.5 rounded text-xs font-semibold',
                form.is_fake ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              ]">
                {{ form.is_fake ? 'Demo' : 'Live' }}
              </span>
            </div>
          </div>
          <div>
            <span class="text-gray-600">Balance:</span>
            <span class="font-medium">${{ (form.balance || 0).toFixed(2) }}</span>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || !isFormValid"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div v-if="isSubmitting" class="flex items-center">
              <div class="spinner mr-2"></div>
              Creating...
            </div>
            <span v-else>Create User</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { adminAPI, handleApiError } from '@/services/api'
import { useToastStore } from '@/stores/toast'
import { 
  XMarkIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  InformationCircleIcon 
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['close', 'created'])
const toastStore = useToastStore()

const isSubmitting = ref(false)
const showPassword = ref(false)
const passwordGenerated = ref(false)
const usernameError = ref('')

const form = ref({
  first_name: '',
  last_name: '',
  username: '',
  password: '',
  balance: 10000,
  is_admin: false,
  is_fake: true
})

const isFormValid = computed(() => {
  return form.value.first_name &&
         form.value.last_name &&
         form.value.username.length >= 3 &&
         form.value.password.length >= 6 &&
         !usernameError.value
})

const passwordStrength = computed(() => {
  const password = form.value.password
  if (password.length < 6) return 'Too short'
  if (password.length < 8) return 'Weak'
  if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) return 'Strong'
  if (password.match(/^(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d)/)) return 'Medium'
  return 'Weak'
})

const passwordStrengthClass = computed(() => {
  switch (passwordStrength.value) {
    case 'Strong': return 'text-green-600 font-medium'
    case 'Medium': return 'text-yellow-600 font-medium'
    case 'Weak': return 'text-red-600 font-medium'
    default: return 'text-gray-500'
  }
})

const validateUsername = () => {
  const username = form.value.username
  usernameError.value = ''
  
  if (username.length > 0 && username.length < 3) {
    usernameError.value = 'Username must be at least 3 characters'
  } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    usernameError.value = 'Only letters, numbers, hyphens, and underscores allowed'
  }
  
  // Convert to lowercase as the backend expects
  form.value.username = username.toLowerCase()
}

const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'
  let password = ''
  
  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  password += '@#$%&*'[Math.floor(Math.random() * 6)]
  
  // Fill the rest randomly
  for (let i = password.length; i < 12; i++) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }
  
  // Shuffle the password
  form.value.password = password.split('').sort(() => Math.random() - 0.5).join('')
  passwordGenerated.value = true
  
  setTimeout(() => {
    passwordGenerated.value = false
  }, 2000)
}

const submitForm = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  try {
    const userData = {
      first_name: form.value.first_name.trim(),
      last_name: form.value.last_name.trim(),
      username: form.value.username.toLowerCase().trim(),
      password: form.value.password,
      is_admin: form.value.is_admin,
      balance: form.value.balance || 10000,
      is_fake: form.value.is_fake
    }

    const newUser = await adminAPI.createUser(userData)
    emit('created', newUser)
    
    toastStore.success(`User ${newUser.username} created successfully!`)
  } catch (error) {
    console.error('User creation error:', error)
    toastStore.error(handleApiError(error))
  } finally {
    isSubmitting.value = false
  }
}
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