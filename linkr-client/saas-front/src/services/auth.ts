import { request } from './request'
import { mockApi } from './mock'
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/auth'

// 是否使用Mock模式
const USE_MOCK = true

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> => {
    if (USE_MOCK) {
      return mockApi.login(data) as Promise<AuthResponse>
    }
    return request.post('/auth/login', data)
  },

  register: (data: RegisterRequest): Promise<AuthResponse> => {
    if (USE_MOCK) {
      return mockApi.register(data) as Promise<AuthResponse>
    }
    return request.post('/auth/register', data)
  },

  getCurrentUser: (): Promise<User> => {
    if (USE_MOCK) {
      return mockApi.getCurrentUser() as Promise<User>
    }
    return request.get('/auth/me')
  },

  logout: (): Promise<void> => {
    if (USE_MOCK) {
      return mockApi.logout() as Promise<void>
    }
    return request.post('/auth/logout')
  },

  refreshToken: (): Promise<AuthResponse> => {
    if (USE_MOCK) {
      return mockApi.login({ email: 'test@example.com', password: 'password' }) as Promise<AuthResponse>
    }
    return request.post('/auth/refresh')
  }
}
