# MetaLinkr PWA 前端项目

## 项目简介

MetaLinkr 是一个综合性社交PWA应用，整合社交交友、电商购物、宠物服务和地点打卡等功能，通过积分养成系统增强用户粘性。

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **PWA功能**: Vite PWA Plugin
- **样式**: SCSS
- **图标**: Element Plus Icons

## 功能模块

### 1. 社交交友模块
- 文字聊天
- 视频连线
- 广场动态
- 智能匹配系统

### 2. 电商模块
- 商品浏览
- 购物功能
- 订单管理
- 推荐系统

### 3. 宠物店模块
- 宠物托管
- 宠物用品
- 宠物档案
- 服务预约

### 4. 地点打卡模块
- 位置分享
- 打卡记录
- 收集系统
- 社交地图

### 5. 直播模块
- 直播功能
- 直播分类
- 互动功能
- 直播管理

### 6. 短视频模块
- 视频创作
- 视频浏览
- 互动功能
- 创作工具

### 7. 游戏中心模块
- 游戏信息
- 段位显示
- 开黑房间
- 游戏社交

### 8. 积分养成系统
- 积分获取
- 皮肤系统
- 等级系统
- 任务系统

## 项目结构

```
src/
├── components/          # 公共组件
├── layouts/            # 布局组件
├── views/              # 页面组件
├── stores/             # 状态管理
├── router/             # 路由配置
├── types/              # 类型定义
├── mock/               # Mock数据
├── styles/             # 样式文件
├── utils/              # 工具函数
└── services/           # API服务
```

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 构建PWA版本
npm run build:pwa
```

## PWA特性

- ✅ 可安装到设备
- ✅ 离线功能支持
- ✅ 推送通知
- ✅ 响应式设计
- ✅ 快速加载
- ✅ 安全性 (HTTPS)

## 部署说明

1. 构建项目: `npm run build`
2. 将 `dist` 目录部署到静态文件服务器
3. 确保服务器支持HTTPS
4. 配置Service Worker缓存策略

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

## 许可证

MIT License
