import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘' },
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        meta: { title: '用户管理' },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound.vue'), meta: { public: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 验证token是否有效
const isValidToken = (token: string | null): boolean => {
  if (!token) return false
  try {
    // 这里可以添加JWT token验证逻辑
    // 暂时简单检查token是否存在且不为空
    return token.trim().length > 0
  } catch (error) {
    console.error('Token验证失败:', error)
    return false
  }
}

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  
  // 如果是公开页面，直接通过
  if (to.meta.public) {
    return next()
  }
  
  // 检查token是否存在且有效
  if (!isValidToken(token)) {
    console.log('未找到有效token，重定向到登录页')
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }
  
  next()
})

router.afterEach((to) => {
  const base = 'Linkr Admin'
  const title = (to.meta?.title as string) || ''
  document.title = title ? `${base} - ${title}` : base
})

export default router


