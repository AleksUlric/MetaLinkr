import { defineStore } from 'pinia'
import { request } from '@/services/request'

interface LoginPayload { username: string; password: string }

interface AuthState {
  token: string | null
  displayName: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    displayName: null,
  }),
  actions: {
    async login(payload: LoginPayload) {
      const { token } = await request.post<{ token: string }>('/api/admin/login', payload)
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.token = null
      localStorage.removeItem('token')
    },
    async fetchDisplayName(username: string) {
      // 示例：对接后端 Dubbo 网关或 HTTP 接口
      const { displayName } = await request.get<{ displayName: string }>(`/api/admin/user/${encodeURIComponent(username)}/displayName`)
      this.displayName = displayName
    },
  },
})


