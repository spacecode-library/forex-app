<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="text-gray-600 font-medium">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script>