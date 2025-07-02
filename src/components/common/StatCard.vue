<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <component
            :is="iconComponent"
            :class="[
              'h-6 w-6',
              colorClasses[color]
            ]"
          />
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ title }}
            </dt>
            <dd class="text-lg font-medium text-gray-900">
              {{ value }}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  BanknotesIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: value => ['blue', 'green', 'red', 'yellow', 'purple', 'gray'].includes(value)
  }
})

const iconComponents = {
  BanknotesIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon
}

const colorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
  purple: 'text-purple-600',
  gray: 'text-gray-600'
}

const iconComponent = computed(() => {
  return iconComponents[props.icon] || ChartBarIcon
})
</script>