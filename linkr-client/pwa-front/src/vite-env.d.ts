/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 路径别名类型声明 - 使用更通用的模式匹配
declare module '@/components/*' {
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

// 通用路径别名类型声明
declare module '@/stores/*'
declare module '@/types/*'
declare module '@/mock/*'
declare module '@/views/*'
declare module '@/layouts/*'
declare module '@/router/*'