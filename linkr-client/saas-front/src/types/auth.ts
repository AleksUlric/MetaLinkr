export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'merchant' | 'customer'
  tenantId?: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  storeName: string
  subdomain: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Tenant {
  id: string
  name: string
  subdomain: string
  domain?: string
  plan: 'basic' | 'professional' | 'enterprise'
  status: 'active' | 'suspended' | 'trial'
  createdAt: string
  updatedAt: string
}
