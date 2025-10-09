import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/Products.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue')
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('@/views/Customers.vue')
      },
      {
        path: 'themes',
        name: 'Themes',
        component: () => import('@/views/Themes.vue')
      },
      {
        path: 'theme-editor',
        name: 'ThemeEditor',
        component: () => import('@/views/ThemeEditor.vue')
      },
      {
        path: 'theme-preview',
        name: 'ThemePreview',
        component: () => import('@/views/ThemePreview.vue')
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@/views/Analytics.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue')
      },
      {
        path: 'inquiries',
        name: 'Inquiries',
        component: () => import('@/views/Inquiries.vue')
      },
      {
        path: 'company-info',
        name: 'CompanyInfo',
        component: () => import('@/views/CompanyInfo.vue')
      },
      {
        path: 'payment-settings',
        name: 'PaymentSettings',
        component: () => import('@/views/PaymentSettings.vue')
      },
      {
        path: 'language-settings',
        name: 'LanguageSettings',
        component: () => import('@/views/LanguageSettings.vue')
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/Cart.vue')
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('@/views/Checkout.vue')
      },
      {
        path: 'marketing',
        name: 'Marketing',
        component: () => import('@/views/Marketing.vue')
      },
      {
        path: 'marketing-tools',
        name: 'MarketingTools',
        component: () => import('@/views/MarketingTools.vue')
      },
      {
        path: 'customer-service',
        name: 'CustomerService',
        component: () => import('@/views/CustomerService.vue')
      }
    ]
  },
  {
    path: '/store/:subdomain',
    name: 'StoreFront',
    component: () => import('@/views/StoreFront.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 调试信息
  console.log('路由守卫:', {
    to: to.path,
    requiresAuth: to.meta.requiresAuth,
    isAuthenticated: authStore.isAuthenticated,
    hasToken: !!authStore.token,
    hasUser: !!authStore.user
  })
  
  // 暂时禁用认证检查，允许访问所有页面
  // if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  //   next('/login')
  // } else if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
  //   next('/dashboard')
  // } else {
  //   next()
  // }
  
  // 直接允许访问
  next()
})

export default router
