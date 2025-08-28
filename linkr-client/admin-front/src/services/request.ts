import axios, { AxiosInstance, AxiosResponse } from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

const apiBase = (import.meta as any).env?.VITE_API_BASE || '/api'
const instance: AxiosInstance = axios.create({
  baseURL: apiBase,
  timeout: 15000,
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    const status = error?.response?.status
    const message = error?.response?.data?.message || error.message
    if (status === 401) {
      localStorage.removeItem('token')
      if (router.currentRoute.value.path !== '/login') {
        ElMessage.error('登录已过期，请重新登录')
        router.replace({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
      }
    } else if (message) {
      ElMessage.error(message)
    }
    return Promise.reject(error)
  }
)

export const request = instance


