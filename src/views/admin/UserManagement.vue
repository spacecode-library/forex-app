<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <p class="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Create User
          </button>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or username..."
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @input="debouncedSearch"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="statusFilter"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="applyFilters"
            >
              <option value="">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
            <select
              v-model="accountTypeFilter"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="applyFilters"
            >
              <option value="">All Types</option>
              <option value="demo">Demo</option>
              <option value="live">Live</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              v-model="roleFilter"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="applyFilters"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <XMarkIcon class="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">
            Users ({{ totalUsers }})
            <span v-if="isFiltered" class="text-sm text-gray-500 font-normal">
              - {{ filteredCount }} filtered
            </span>
          </h2>
          <div class="flex items-center space-x-3">
            <button
              @click="exportUsers"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentArrowDownIcon class="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              @click="refreshUsers"
              :disabled="isLoading"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowPathIcon :class="['h-4 w-4 mr-2', { 'animate-spin': isLoading }]" />
              Refresh
            </button>
          </div>
        </div>

        <div v-if="isLoading && users.length === 0" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-500">Loading users...</p>
        </div>

        <div v-else-if="users.length === 0" class="p-12 text-center">
          <UserGroupIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 class="text-sm font-medium text-gray-900 mb-2">No users found</h3>
          <p class="text-sm text-gray-500 mb-4">
            {{ isFiltered ? 'Try adjusting your filters.' : 'Get started by creating your first user.' }}
          </p>
          <button
            v-if="!isFiltered"
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Create First User
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button @click="sortBy('name')" class="flex items-center hover:text-gray-700">
                    User
                    <ChevronUpDownIcon class="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button @click="sortBy('username')" class="flex items-center hover:text-gray-700">
                    Username
                    <ChevronUpDownIcon class="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button @click="sortBy('balance')" class="flex items-center hover:text-gray-700">
                    Balance
                    <ChevronUpDownIcon class="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button @click="sortBy('created_at')" class="flex items-center hover:text-gray-700">
                    Created
                    <ChevronUpDownIcon class="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="user in paginatedUsers"
                :key="user.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span class="text-sm font-medium text-white">
                          {{ getUserInitials(user) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.first_name }} {{ user.last_name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        ID: {{ user.id.split('-')[0] }}...
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 font-medium">{{ user.username }}</div>
                  <div class="text-sm text-gray-500">
                    Last updated: {{ formatDate(user.updated_at || user.created_at) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="font-medium">{{ formatCurrency(user.balance) }}</div>
                  <div class="text-xs text-gray-500">
                    {{ getBalanceCategory(user.balance) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    user.is_fake ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  ]">
                    {{ user.is_fake ? 'Demo' : 'Live' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ user.is_admin ? 'Admin' : 'User' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{{ formatDate(user.created_at) }}</div>
                  <div class="text-xs">{{ formatTimeAgo(user.created_at) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="editUser(user)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Edit user"
                    >
                      <PencilIcon class="h-4 w-4" />
                    </button>
                    <button
                      @click="resetPassword(user)"
                      class="text-yellow-600 hover:text-yellow-900"
                      title="Reset password"
                    >
                      <KeyIcon class="h-4 w-4" />
                    </button>
                    <button
                      @click="toggleUserStatus(user)"
                      :class="[
                        'hover:font-semibold',
                        user.is_active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
                      ]"
                      :title="user.is_active ? 'Disable user' : 'Enable user'"
                    >
                      <PowerIcon class="h-4 w-4" />
                    </button>
                    <button
                      @click="deleteUser(user)"
                      class="text-red-600 hover:text-red-900"
                      title="Delete user"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to 
              {{ Math.min(currentPage * itemsPerPage, totalUsers) }} of 
              {{ totalUsers }} results
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create User Modal -->
    <CreateUserModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleUserCreated"
    />

    <!-- Edit User Modal -->
    <EditUserModal
      v-if="showEditModal && selectedUser"
      :user="selectedUser"
      @close="showEditModal = false"
      @updated="handleUserUpdated"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToastStore } from '@/stores/toast'
import { adminAPI, handleApiError } from '@/services/api'
import CreateUserModal from '@/views/admin/CreateUserModal.vue'
import EditUserModal from '@/views/admin/EditUserModal.vue'

import {
  PlusIcon,
  ArrowPathIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon,
  ChevronUpDownIcon,
  PencilIcon,
  KeyIcon,
  PowerIcon,
  TrashIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

const toastStore = useToastStore()

const users = ref([])
const isLoading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const selectedUser = ref(null) // Removed TypeScript type annotation

// Filters
const searchQuery = ref('')
const statusFilter = ref('')
const accountTypeFilter = ref('')
const roleFilter = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalUsers = ref(0)

// Sorting
const sortField = ref('created_at')
const sortDirection = ref('desc')

// Debounced search
let searchTimeout = null

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadUsers()
  }, 300)
}

const isFiltered = computed(() => {
  return searchQuery.value || statusFilter.value || accountTypeFilter.value || roleFilter.value
})

const filteredCount = computed(() => users.value.length)

const totalPages = computed(() => {
  return Math.ceil(totalUsers.value / itemsPerPage.value)
})

const paginatedUsers = computed(() => {
  return users.value
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const getUserInitials = (user) => {
  return (user.first_name.charAt(0) + user.last_name.charAt(0)).toUpperCase()
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
}

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`
}

const getBalanceCategory = (balance) => {
  if (balance < 1000) return 'Low'
  if (balance < 10000) return 'Medium'
  if (balance < 50000) return 'High'
  return 'Premium'
}

const loadUsers = async () => {
  isLoading.value = true
  try {
    const params = {
      limit: itemsPerPage.value,
      offset: (currentPage.value - 1) * itemsPerPage.value,
      active_only: false
    }

    if (searchQuery.value) params.search = searchQuery.value
    if (statusFilter.value === 'active') params.active_only = true
    if (statusFilter.value === 'inactive') params.active_only = false
    if (accountTypeFilter.value === 'demo') params.is_fake = true
    if (accountTypeFilter.value === 'live') params.is_fake = false
    if (roleFilter.value === 'admin') params.is_admin = true
    if (roleFilter.value === 'user') params.is_admin = false

    const response = await adminAPI.getUsers(params)
    users.value = response
    
    // For now, we'll estimate total users since the API doesn't return total count
    // In a real implementation, the API should return pagination metadata
    totalUsers.value = response.length < itemsPerPage.value 
      ? (currentPage.value - 1) * itemsPerPage.value + response.length
      : (currentPage.value - 1) * itemsPerPage.value + response.length + 1

  } catch (error) {
    console.error('Load users error:', error)
    toastStore.error(handleApiError(error))
  } finally {
    isLoading.value = false
  }
}

const refreshUsers = async () => {
  await loadUsers()
  toastStore.success('Users refreshed')
}

const applyFilters = () => {
  currentPage.value = 1
  loadUsers()
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  accountTypeFilter.value = ''
  roleFilter.value = ''
  currentPage.value = 1
  loadUsers()
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  loadUsers()
}

const editUser = (user) => {
  selectedUser.value = user
  showEditModal.value = true
}

const resetPassword = (user) => {
  selectedUser.value = user
  showPasswordModal.value = true
}

const toggleUserStatus = async (user) => {
  const action = user.is_active ? 'disable' : 'enable'
  if (!confirm(`Are you sure you want to ${action} ${user.username}?`)) {
    return
  }

  try {
    const result = await adminAPI.toggleUserStatus(user.id)
    
    // Update local state
    const userIndex = users.value.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users.value[userIndex] = result.user
    }
    
    toastStore.success(result.message)
  } catch (error) {
    console.error('Toggle status error:', error)
    toastStore.error(handleApiError(error))
  }
}

const deleteUser = async (user) => {
  if (!confirm(`Are you sure you want to delete ${user.username}? This action cannot be undone.`)) {
    return
  }

  try {
    await adminAPI.deleteUser(user.id)
    users.value = users.value.filter(u => u.id !== user.id)
    totalUsers.value--
    toastStore.success(`User ${user.username} deleted successfully`)
  } catch (error) {
    console.error('Delete user error:', error)
    toastStore.error(handleApiError(error))
  }
}

const exportUsers = () => {
  const csvContent = [
    ['First Name', 'Last Name', 'Username', 'Balance', 'Account Type', 'Status', 'Role', 'Created'].join(','),
    ...users.value.map(user => [
      user.first_name,
      user.last_name,
      user.username,
      user.balance,
      user.is_fake ? 'Demo' : 'Live',
      user.is_active ? 'Active' : 'Inactive',
      user.is_admin ? 'Admin' : 'User',
      formatDate(user.created_at)
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
  
  toastStore.success('Users exported to CSV')
}

const handleUserCreated = (newUser) => {
  showCreateModal.value = false
  users.value.unshift(newUser)
  totalUsers.value++
  toastStore.success(`User ${newUser.username} created successfully`)
}

const handleUserUpdated = (updatedUser) => {
  showEditModal.value = false
  const index = users.value.findIndex(u => u.id === updatedUser.id)
  if (index !== -1) {
    users.value[index] = updatedUser
  }
  toastStore.success(`User ${updatedUser.username} updated successfully`)
}

const handlePasswordReset = () => {
  showPasswordModal.value = false
  toastStore.success(`Password reset for ${selectedUser.value?.username}`)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadUsers()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadUsers()
  }
}

// Watch for page changes
watch(currentPage, () => {
  loadUsers()
})

onMounted(async () => {
  await loadUsers()
})
</script>