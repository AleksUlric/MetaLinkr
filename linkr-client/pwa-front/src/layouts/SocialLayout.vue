<template>
  <div class="social-layout">
    <!-- 主要内容区域 -->
    <div class="main-content" :class="{ 'with-tab-bar': showTabBar }">
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component 
            :is="Component" 
            v-if="route.meta.keepAlive" 
            :key="route.fullPath"
          />
        </keep-alive>
        <component 
          :is="Component" 
          v-if="!route.meta.keepAlive" 
          :key="route.fullPath"
        />
      </router-view>
    </div>
    
    <!-- 底部导航栏 -->
    <div v-if="showTabBar" class="tab-bar">
      <div 
        v-for="tab in tabBarItems" 
        :key="tab.path"
        class="tab-item"
        :class="{ active: $route.path === tab.path }"
        @click="navigateTo(tab.path)"
      >
        <el-icon :size="24">
          <component :is="tab.icon" />
        </el-icon>
        <span class="tab-label">{{ tab.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  HomeFilled, 
  Connection, 
  ChatDotRound, 
  Microphone, 
  Search, 
  User 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 底部导航栏配置
const tabBarItems = [
  { path: '/home', title: '广场', icon: 'HomeFilled' },
  { path: '/match', title: '匹配', icon: 'Connection' },
  { path: '/chat', title: '消息', icon: 'ChatDotRound' },
  { path: '/voice', title: '语音', icon: 'Microphone' },
  { path: '/discover', title: '发现', icon: 'Search' },
  { path: '/profile', title: '我的', icon: 'User' }
]

// 是否显示底部导航栏
const showTabBar = computed(() => {
  return route.meta.tabBar === true
})

// 导航到指定路径
const navigateTo = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
}
</script>

<style scoped lang="scss">
.social-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  overflow: hidden;
  
  &.with-tab-bar {
    padding-bottom: 60px; // 为底部导航栏留出空间
  }
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  border-top: 1px solid #e5e5e5;
  display: flex;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  
  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #999;
    
    &:hover {
      background-color: #f8f8f8;
    }
    
    &.active {
      color: #ff6b6b;
      
      .tab-label {
        font-weight: 600;
      }
    }
    
    .tab-label {
      font-size: 12px;
      margin-top: 2px;
      transition: all 0.3s ease;
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .social-layout {
    background-color: #1a1a1a;
  }
  
  .tab-bar {
    background: #2a2a2a;
    border-top-color: #333;
    
    .tab-item {
      color: #aaa;
      
      &:hover {
        background-color: #333;
      }
      
      &.active {
        color: #ff6b6b;
      }
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .tab-bar {
    height: 50px;
    
    .tab-item {
      .tab-label {
        font-size: 11px;
      }
    }
  }
  
  .main-content.with-tab-bar {
    padding-bottom: 50px;
  }
}
</style>