import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy-loaded components
const Login = () => import('@/views/auth/Login.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const Trading = () => import('@/views/Trading.vue')
const Positions = () => import('@/views/Positions.vue')
const History = () => import('@/views/History.vue')
const Profile = () => import('@/views/Profile.vue')
const AdminDashboard = () => import('@/views/admin/AdminDashboard.vue')
const UserManagement = () => import('@/views/admin/UserManagement.vue')

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/trading',
    name: 'Trading',
    component: Trading,
    meta: { requiresAuth: true }
  },
  {
    path: '/positions',
    name: 'Positions',
    component: Positions,
    meta: { requiresAuth: true }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth if not already done
  if (!authStore.initialized) {
    await authStore.initializeAuth()
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check if route requires admin privileges
  if (to.meta.requiresAdmin && !authStore.user?.is_admin) {
    next({ name: 'Dashboard' })
    return
  }
  
  // Redirect authenticated users away from login
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }
  
  next()
})

export default router