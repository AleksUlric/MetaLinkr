# Linkr-Dashboard PC端管理后台

## 概述

linkr-dashboard 是 MetaLinkr 项目的 PC 端管理后台，基于 Vue 3 + TypeScript 构建，提供完整的系统管理界面。

## 功能特性

- 🏠 **仪表盘**: 系统概览、数据统计、快速操作
- 👥 **用户管理**: 用户列表、添加/编辑用户、权限分配
- 🔐 **权限管理**: 角色管理、权限配置、访问控制
- 📊 **数据统计**: 图表展示、数据可视化
- ⚙️ **系统设置**: 系统配置、参数管理

## 技术栈

- **框架**: Vue 3.4.0
- **语言**: TypeScript
- **UI库**: Element Plus 2.8.8
- **状态管理**: Pinia 2.2.4
- **路由**: Vue Router 4.4.5
- **构建工具**: Vite 5.0.0

## 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
cd linkr-client/linkr-dashboard
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 访问地址
- **开发环境**: http://localhost:5173
- **生产环境**: 根据部署配置

## 项目结构

```
linkr-dashboard/
├── src/
│   ├── components/      # 公共组件
│   ├── layouts/         # 布局组件
│   ├── router/          # 路由配置
│   ├── services/        # API 服务
│   ├── stores/          # 状态管理
│   ├── styles/          # 样式文件
│   ├── types/           # TypeScript 类型
│   ├── views/           # 页面组件
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── public/              # 静态资源
├── dist/                # 构建输出
└── package.json         # 依赖配置
```

## 开发指南

### 组件开发
- 使用 Composition API
- 遵循 Vue 3 最佳实践
- 组件命名采用 PascalCase

### 状态管理
- 使用 Pinia 进行状态管理
- 按功能模块划分 store
- 支持 TypeScript 类型推导

### API 调用
- 统一使用 services 层
- 支持请求/响应拦截
- 错误处理统一化

## 路由配置

### 主要路由
- `/` - 仪表盘
- `/users` - 用户管理
- `/roles` - 角色管理
- `/settings` - 系统设置

### 路由守卫
- 登录状态检查
- 权限验证
- 路由重定向

## 样式规范

- 使用 Element Plus 组件库
- 支持主题定制
- 响应式设计
- 统一的颜色和字体规范

## 部署说明

### 开发环境
```bash
npm run dev
```

### 生产环境
```bash
npm run build
# 将 dist 目录部署到 Web 服务器
```

### Docker 部署
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npm", "run", "preview"]
```
