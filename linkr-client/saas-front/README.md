# ShopBuilder SaaS 前端应用

这是一个基于 Vue 3 + TypeScript + Element Plus 的电商SaaS平台前端应用。

## 功能特性

- 🎨 **拖拽式主题编辑器** - 可视化自定义商店外观
- 📦 **商品管理** - 完整的商品CRUD功能
- 📋 **订单管理** - 订单处理和状态跟踪
- 👥 **客户管理** - 客户信息和消费记录
- 📊 **数据分析** - 销售数据可视化
- 🎯 **多租户支持** - SaaS多租户架构
- 📱 **响应式设计** - 支持桌面、平板和移动设备

## 技术栈

- **框架**: Vue 3.4+ (Composition API)
- **语言**: TypeScript 5.3+
- **构建工具**: Vite 5.0+
- **UI框架**: Element Plus 2.4+
- **状态管理**: Pinia 2.1+
- **路由**: Vue Router 4.2+
- **HTTP客户端**: Axios 1.6+
- **样式**: SCSS

## 项目结构

```
saas-front/
├── public/                # 静态资源
├── src/
│   ├── assets/           # 资源文件（图片、图标）
│   ├── components/       # 通用组件
│   ├── layouts/          # 布局组件
│   │   └── MainLayout.vue  # 主布局
│   ├── router/           # 路由配置
│   │   └── index.ts
│   ├── services/         # API服务
│   │   ├── auth.ts       # 认证服务
│   │   └── request.ts    # HTTP请求封装
│   ├── stores/           # Pinia状态管理
│   │   └── auth.ts       # 认证状态
│   ├── styles/           # 全局样式
│   │   ├── index.scss    # 主样式文件
│   │   ├── variables.scss # 变量定义
│   │   ├── mixins.scss   # Mixins
│   │   └── base.scss     # 基础样式
│   ├── types/            # TypeScript类型定义
│   │   └── auth.ts
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   │   ├── Login.vue     # 登录页
│   │   ├── Register.vue  # 注册页
│   │   ├── Dashboard.vue # 仪表板
│   │   ├── Products.vue  # 商品管理
│   │   ├── Orders.vue    # 订单管理
│   │   ├── Customers.vue # 客户管理
│   │   ├── Themes.vue    # 主题选择
│   │   ├── ThemeEditor.vue # 主题编辑器
│   │   ├── Analytics.vue # 数据分析
│   │   ├── Settings.vue  # 设置
│   │   ├── NotFound.vue  # 404页面
│   │   └── StoreFront.vue # 商店前台
│   ├── App.vue           # 根组件
│   ├── main.ts           # 应用入口
│   └── vite-env.d.ts     # Vite类型定义
├── index.html            # HTML模板
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript配置
├── vite.config.ts        # Vite配置
└── README.md             # 项目说明

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 页面路由

- `/login` - 登录页面
- `/register` - 注册页面
- `/dashboard` - 仪表板（需要认证）
- `/dashboard/products` - 商品管理
- `/dashboard/orders` - 订单管理
- `/dashboard/customers` - 客户管理
- `/dashboard/themes` - 主题选择
- `/dashboard/theme-editor` - 主题编辑器
- `/dashboard/analytics` - 数据分析
- `/dashboard/settings` - 设置
- `/store/:subdomain` - 商店前台

## 主要功能模块

### 1. 认证系统
- 用户登录/注册
- JWT Token认证
- 路由守卫

### 2. 仪表板
- 关键指标展示
- 销售趋势图表
- 最近订单列表
- 快速操作入口

### 3. 商品管理
- 商品列表展示
- 商品搜索和筛选
- 商品添加/编辑/删除
- 库存管理

### 4. 订单管理
- 订单列表
- 订单状态更新
- 订单搜索和筛选
- 发货操作

### 5. 客户管理
- 客户列表
- 客户详情查看
- 客户标签管理
- 客户消息发送

### 6. 主题设计
- 预设主题选择
- 主题预览
- 自定义主题创建
- 拖拽式主题编辑器

### 7. 数据分析
- 销售数据统计
- 客户行为分析
- 商品销售排行
- 图表可视化

## 开发指南

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 最佳实践
- 使用 ESLint 进行代码检查
- 使用 SCSS 编写样式

### 组件开发

```vue
<template>
  <div class="my-component">
    <!-- 组件内容 -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 组件逻辑
const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

<style lang="scss" scoped>
.my-component {
  // 组件样式
}
</style>
```

### API 请求

```typescript
import { request } from '@/services/request'

// GET 请求
const getData = async () => {
  const data = await request.get('/api/data')
  return data
}

// POST 请求
const postData = async (payload: any) => {
  const data = await request.post('/api/data', payload)
  return data
}
```

### 状态管理

```typescript
import { defineStore } from 'pinia'

export const useMyStore = defineStore('myStore', () => {
  const state = ref({})
  
  const actions = {
    // 操作
  }
  
  return {
    state,
    ...actions
  }
})
```

## 环境变量

创建 `.env.local` 文件配置环境变量：

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=ShopBuilder
```

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## License

MIT

## 联系方式

如有问题，请联系开发团队。
```
