/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 路径别名类型声明
declare module '@/stores/*'
declare module '@/types/*'
declare module '@/mock/*'
declare module '@/views/*'
declare module '@/layouts/*'
declare module '@/router/*'