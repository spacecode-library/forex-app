<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <!-- 404 Icon -->
        <div class="mx-auto h-24 w-24 text-gray-400 mb-6">
          <ExclamationTriangleIcon class="h-full w-full" />
        </div>
        
        <!-- Error Message -->
        <h1 class="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p class="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The page may have been moved, deleted, or the URL might be incorrect.
        </p>
        
        <!-- Action Buttons -->
        <div class="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
          <button
            @click="goBack"
            class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeftIcon class="h-4 w-4 mr-2" />
            Go Back
          </button>
          
          <router-link
            to="/dashboard"
            class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <HomeIcon class="h-4 w-4 mr-2" />
            Go to Dashboard
          </router-link>
        </div>
        
        <!-- Help Text -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-500">
            If you think this is an error, please 
            <a href="mailto:support@tradingplatform.com" class="text-blue-600 hover:text-blue-500">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  HomeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}
</script>