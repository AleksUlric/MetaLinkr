import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, RegisterRequest } from '@/types/auth'
import { authApi } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const login = async (credentials: LoginRequest) => {
    loading.value = true
    try {
      const response = await authApi.login(credentials)
      // 适配Mock数据格式
      const data = response.data || response
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (data: RegisterRequest) => {
    loading.value = true
    try {
      const response = await authApi.register(data)
      // 适配Mock数据格式
      const responseData = response.data || response
      token.value = responseData.token
      user.value = responseData.user
      localStorage.setItem('token', responseData.token)
      return responseData
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const initialize = async () => {
    if (token.value) {
      try {
        const response = await authApi.getCurrentUser()
        // 适配Mock数据格式
        user.value = response.data || response
      } catch (error) {
        console.log('初始化用户信息失败:', error)
        // 不自动登出，保持token
        // logout()
      }
    } else {
      // 如果没有token，设置一个默认用户用于演示
      console.log('没有token，设置默认用户')
      user.value = {
        id: 'demo-user',
        email: 'demo@example.com',
        name: '演示用户',
        avatar: 'https://via.placeholder.com/40x40',
        role: 'merchant',
        tenantId: 'demo-tenant',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      token.value = 'demo-token'
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    initialize
  }
})
