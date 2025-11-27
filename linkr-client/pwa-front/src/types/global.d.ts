// 全局类型声明
declare module '@/stores/user' {
  import { DefineStoreOptionsInPlugin } from 'pinia'
  export function useUserStore(): any
}

declare module '@/stores/social' {
  export function useSocialStore(): any
}

declare module '@/stores/shop' {
  export function useShopStore(): any
}

declare module '@/stores/live' {
  export function useLiveStore(): any
}

declare module '@/types/user' {
  export interface User {
    id: string
    username: string
    nickname: string
    avatar: string
    phone?: string
    email?: string
    gender: 'male' | 'female' | 'other'
    birthday?: string
    location?: string
    bio?: string
    level: number
    points: number
    vipLevel: number
    createdAt: string
    updatedAt: string
  }
  
  export interface UserProfile extends User {
    interests: string[]
    gameAccounts: any[]
    pets: any[]
    checkInCount: number
    followCount: number
    fanCount: number
    postCount: number
  }
}

declare module '@/mock/user' {
  export const mockUser: any
  export const mockUserProfile: any
}

declare module '@/components/*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/utils/avatar' {
  export function getDefaultAvatarUrl(gender?: string): string
  export function getUserAvatarUrl(avatar?: string, gender?: string): string
  export function fetchDefaultAvatarUrl(gender?: string): Promise<string>
  export function preloadDefaultAvatars(): Promise<void>
  export function getLocalDefaultAvatarUrl(gender?: string): string
  export function isDefaultAvatar(avatarUrl: string): boolean
}

