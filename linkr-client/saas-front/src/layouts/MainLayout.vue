<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <div class="logo">
          <el-icon class="logo-icon"><Shop /></el-icon>
          <span class="logo-text">ShopBuilder</span>
        </div>
        <nav class="nav-menu">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: $route.path.startsWith(item.path) }"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.name }}</span>
          </router-link>
        </nav>
      </div>
      
      <div class="header-right">
        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索商品、订单、客户..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <!-- 通知 -->
        <el-badge :value="notificationCount" class="notification-badge">
          <el-button circle class="icon-btn">
            <el-icon><Bell /></el-icon>
          </el-button>
        </el-badge>
        
        <!-- 用户菜单 -->
        <el-dropdown @command="handleUserCommand">
          <div class="user-menu">
            <el-avatar :src="user?.avatar" :size="32">
              {{ user?.name?.charAt(0) }}
            </el-avatar>
            <span class="user-name">{{ user?.name }}</span>
            <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人资料
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                设置
              </el-dropdown-item>
              <el-dropdown-item command="billing">
                <el-icon><CreditCard /></el-icon>
                账单
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <h3 class="sidebar-title">我的商店</h3>
        <el-button 
          circle 
          size="small" 
          class="collapse-btn"
          @click="toggleSidebar"
        >
          <el-icon><component :is="sidebarCollapsed ? 'Expand' : 'Fold'" /></el-icon>
        </el-button>
      </div>
      
      <nav class="sidebar-nav">
        <router-link 
          v-for="item in sidebarItems" 
          :key="item.path"
          :to="item.path"
          class="sidebar-item"
          :class="{ active: $route.path === item.path }"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span v-if="!sidebarCollapsed" class="item-text">{{ item.name }}</span>
          <el-badge 
            v-if="item.badge && !sidebarCollapsed" 
            :value="item.badge" 
            class="item-badge"
          />
        </router-link>
      </nav>
      
      <!-- 商店信息 -->
      <div v-if="!sidebarCollapsed" class="store-info">
        <div class="store-plan">
          <el-tag :type="getPlanType(tenant?.plan)" size="small">
            {{ getPlanName(tenant?.plan) }}
          </el-tag>
        </div>
        <div class="store-domain">
          <el-link :href="`https://${tenant?.subdomain}.shopbuilder.com`" target="_blank" class="domain-link">
            {{ tenant?.subdomain }}.shopbuilder.com
          </el-link>
        </div>
      </div>
    </aside>

    <!-- 主内容区域 -->
    <main class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="content-wrapper">
        <!-- 面包屑导航 -->
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item 
              v-for="item in breadcrumbItems" 
              :key="item.path"
              :to="item.path"
            >
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <!-- 页面内容 -->
        <div class="page-content">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Shop, Search, Bell, ArrowDown, User, Setting, CreditCard, SwitchButton,
  Expand, Fold, DataAnalysis, Goods, List, UserFilled, Brush, TrendCharts,
  Message, OfficeBuilding, Translation, ShoppingCart, Promotion, Service
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const searchQuery = ref('')
const sidebarCollapsed = ref(false)
const notificationCount = ref(3)

// 计算属性
const user = computed(() => authStore.user)
const tenant = computed(() => authStore.user?.tenantId ? { subdomain: 'demo', plan: 'professional' } : null)

// 导航菜单项
const navItems = [
  { path: '/dashboard', name: '仪表板', icon: 'DataAnalysis' },
  { path: '/dashboard/products', name: '商品', icon: 'Goods' },
  { path: '/dashboard/orders', name: '订单', icon: 'List' },
  { path: '/dashboard/customers', name: '客户', icon: 'UserFilled' },
  { path: '/dashboard/themes', name: '主题', icon: 'Brush' },
  { path: '/dashboard/analytics', name: '分析', icon: 'TrendCharts' }
]

// 侧边栏菜单项
const sidebarItems = [
  // 核心业务功能（高频使用）
  { path: '/dashboard', name: '概览', icon: 'DataAnalysis' },
  { path: '/dashboard/products', name: '商品管理', icon: 'Goods', badge: 12 },
  { path: '/dashboard/orders', name: '订单管理', icon: 'List', badge: 5 },
  { path: '/dashboard/customers', name: '客户管理', icon: 'UserFilled' },
  
  // 营销推广功能
  { path: '/dashboard/marketing', name: '营销活动', icon: 'Promotion' },
  { path: '/dashboard/marketing-tools', name: '营销工具', icon: 'TrendCharts' },
  
  // 客户服务
  { path: '/dashboard/inquiries', name: '询盘管理', icon: 'Message', badge: 3 },
  { path: '/dashboard/customer-service', name: '客服中心', icon: 'Service' },
  
  // 购物流程
  { path: '/dashboard/cart', name: '购物车', icon: 'ShoppingCart' },
  
  // 数据分析
  { path: '/dashboard/analytics', name: '数据分析', icon: 'TrendCharts' },
  
  // 商店配置
  { path: '/dashboard/themes', name: '主题设计', icon: 'Brush' },
  { path: '/dashboard/settings', name: '商店设置', icon: 'Setting' },
  { path: '/dashboard/payment-settings', name: '支付设置', icon: 'CreditCard' },
  { path: '/dashboard/company-info', name: '公司信息', icon: 'OfficeBuilding' },
  { path: '/dashboard/language-settings', name: '多语言', icon: 'Translation' }
]

// 面包屑导航
const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items = [{ name: '首页', path: '/dashboard' }]
  
  if (pathSegments.length > 1) {
    const currentItem = sidebarItems.find(item => item.path === route.path)
    if (currentItem) {
      items.push({ name: currentItem.name, path: currentItem.path })
    }
  }
  
  return items
})

// 方法
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 实现搜索逻辑
    console.log('搜索:', searchQuery.value)
  }
}

const handleUserCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/dashboard/profile')
      break
    case 'settings':
      router.push('/dashboard/settings')
      break
    case 'billing':
      router.push('/dashboard/billing')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        authStore.logout()
        router.push('/login')
        ElMessage.success('已退出登录')
      } catch {
        // 用户取消
      }
      break
  }
}

const getPlanType = (plan?: string) => {
  switch (plan) {
    case 'basic': return 'info'
    case 'professional': return 'success'
    case 'enterprise': return 'warning'
    default: return 'info'
  }
}

const getPlanName = (plan?: string) => {
  switch (plan) {
    case 'basic': return '基础版'
    case 'professional': return '专业版'
    case 'enterprise': return '企业版'
    default: return '免费版'
  }
}

// 监听侧边栏状态变化
watch(sidebarCollapsed, (newVal) => {
  localStorage.setItem('sidebar-collapsed', JSON.stringify(newVal))
})

onMounted(() => {
  // 初始化侧边栏状态
  const saved = localStorage.getItem('sidebar-collapsed')
  if (saved) {
    sidebarCollapsed.value = JSON.parse(saved)
  }
})
</script>

<style lang="scss" scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--saas-bg-secondary);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  background: var(--saas-bg-primary);
  border-bottom: 1px solid var(--saas-border-light);
  box-shadow: var(--saas-shadow-sm);
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: var(--saas-primary);
  
  .logo-icon {
    font-size: 24px;
  }
}

.nav-menu {
  display: flex;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  color: var(--saas-text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background: var(--saas-bg-tertiary);
    color: var(--saas-text-primary);
  }
  
  &.active {
    background: var(--saas-primary);
    color: white;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  width: 300px;
}

.search-input {
  :deep(.el-input__wrapper) {
    border-radius: 20px;
  }
}

.notification-badge {
  .icon-btn {
    border: none;
    background: transparent;
    color: var(--saas-text-secondary);
    
    &:hover {
      background: var(--saas-bg-tertiary);
      color: var(--saas-text-primary);
    }
  }
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: var(--saas-bg-tertiary);
  }
  
  .user-name {
    font-weight: 500;
    color: var(--saas-text-primary);
  }
  
  .dropdown-icon {
    font-size: 12px;
    color: var(--saas-text-tertiary);
  }
}

.sidebar {
  position: fixed;
  left: 0;
  top: 64px;
  width: 240px;
  height: calc(100vh - 64px);
  background: var(--saas-bg-primary);
  border-right: 1px solid var(--saas-border-light);
  transition: width 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;
  
  &.collapsed {
    width: 64px;
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--saas-border-light);
  
  .sidebar-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--saas-text-primary);
    white-space: nowrap;
    overflow: hidden;
  }
  
  .collapse-btn {
    border: none;
    background: transparent;
    color: var(--saas-text-secondary);
    
    &:hover {
      background: var(--saas-bg-tertiary);
      color: var(--saas-text-primary);
    }
  }
}

.sidebar-nav {
  padding: 16px 0;
  flex: 1;
  overflow-y: auto;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--saas-text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
  
  &:hover {
    background: var(--saas-bg-tertiary);
    color: var(--saas-text-primary);
  }
  
  &.active {
    background: rgba(var(--saas-primary), 0.1);
    color: var(--saas-primary);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--saas-primary);
    }
  }
  
  .item-text {
    white-space: nowrap;
    overflow: hidden;
  }
  
  .item-badge {
    margin-left: auto;
  }
}

.store-info {
  margin-top: auto;
  padding: 16px 20px;
  background: var(--saas-bg-tertiary);
  border-radius: 8px;
  border: 1px solid var(--saas-border-light);
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  
  .store-plan {
    margin-bottom: 8px;
  }
  
  .store-domain {
    font-size: 12px;
    color: var(--saas-text-secondary);
    
    .domain-link {
      word-break: break-all;
      text-decoration: none;
      
      &:hover {
        color: var(--saas-primary);
      }
    }
  }
}

.main-content {
  margin-left: 240px;
  transition: margin-left 0.3s ease;
  
  &.sidebar-collapsed {
    margin-left: 64px;
  }
}

.content-wrapper {
  padding: 24px;
  min-height: calc(100vh - 64px);
}

.breadcrumb {
  margin-bottom: 24px;
  
  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      color: var(--saas-text-secondary);
      
      &:hover {
        color: var(--saas-primary);
      }
    }
    
    &:last-child .el-breadcrumb__inner {
      color: var(--saas-text-primary);
      font-weight: 500;
    }
  }
}

.page-content {
  background: var(--saas-bg-primary);
  border-radius: 8px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  min-height: calc(100vh - 140px);
  /* 确保内容可以正常滚动 */
  overflow: visible;
}

// 响应式设计
@media (max-width: 768px) {
  .header-left {
    gap: 16px;
  }
  
  .nav-menu {
    display: none;
  }
  
  .search-box {
    width: 200px;
  }
  
  .sidebar {
    transform: translateX(-100%);
    
    &:not(.collapsed) {
      transform: translateX(0);
    }
    
    .store-info {
      margin-left: 16px;
      margin-right: 16px;
      padding: 12px;
      
      .store-domain .domain-link {
        font-size: 11px;
      }
    }
  }
  
  .main-content {
    margin-left: 0;
    
    &.sidebar-collapsed {
      margin-left: 0;
    }
  }
}
</style>
