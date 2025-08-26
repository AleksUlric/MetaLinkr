import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/overview',
    children: [
      {
        path: '/overview',
        name: 'LogOverview',
        component: () => import('../views/LogOverview.vue')
      },
      {
        path: '/search',
        name: 'LogSearch',
        component: () => import('../views/LogSearch.vue')
      },
      {
        path: '/detail/:id',
        name: 'LogDetail',
        component: () => import('../views/LogDetail.vue')
      },
      {
        path: '/services',
        name: 'ServiceManagement',
        component: () => import('../views/ServiceManagement.vue')
      },
      {
        path: '/alerts',
        name: 'AlertConfiguration',
        component: () => import('../views/AlertConfiguration.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
