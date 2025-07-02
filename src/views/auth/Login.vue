<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center bg-blue-600 rounded-xl">
          <ChartBarIcon class="h-8 w-8 text-white" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Access your trading platform
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div v-if="isLoading" class="spinner"></div>
              <LockClosedIcon v-else class="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
            </span>
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <!-- Demo credentials -->
        <div class="mt-6 border-t border-gray-200 pt-6">
          <div class="text-center">
            <h3 class="text-sm font-medium text-gray-900 mb-4">Demo Credentials</h3>
            <div class="grid grid-cols-2 gap-4 text-xs">
              <div class="bg-gray-50 p-3 rounded">
                <div class="font-medium text-gray-700">Admin User</div>
                <div class="text-gray-600 mt-1">
                  <div>Username: admin</div>
                  <div>Password: admin123</div>
                </div>
                <button
                  type="button"
                  @click="fillDemoCredentials('admin')"
                  class="mt-2 text-blue-600 hover:text-blue-500 text-xs"
                >
                  Use these credentials
                </button>
              </div>
              <div class="bg-gray-50 p-3 rounded">
                <div class="font-medium text-gray-700">Regular User</div>
                <div class="text-gray-600 mt-1">
                  <div>Username: trader</div>
                  <div>Password: trader123</div>
                </div>
                <button
                  type="button"
                  @click="fillDemoCredentials('trader')"
                  class="mt-2 text-blue-600 hover:text-blue-500 text-xs"
                >
                  Use these credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ChartBarIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: '',
  rememberMe: false
})

const isLoading = computed(() => authStore.isLoading)

const handleSubmit = async () => {
  try {
    await authStore.login({
      username: form.value.username,
      password: form.value.password
    })

    // Redirect to intended page or dashboard
    const redirectTo = route.query.redirect || '/dashboard'
    router.push(redirectTo)
  } catch (error) {
    // Error is handled in the store
    console.error('Login failed:', error)
  }
}

const fillDemoCredentials = (type) => {
  if (type === 'admin') {
    form.value.username = 'admin'
    form.value.password = 'admin123'
  } else {
    form.value.username = 'trader'
    form.value.password = 'trader123'
  }
}
</script>