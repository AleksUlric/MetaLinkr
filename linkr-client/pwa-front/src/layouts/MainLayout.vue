<template>
  <div class="main-layout">
    <!-- 离线状态指示器 -->
    <div v-if="!isOnline" class="offline-indicator">
        <el-icon><Bell /></el-icon>
      <span>网络连接已断开，部分功能可能不可用</span>
    </div>

    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <el-button 
          v-if="showBackButton" 
          @click="goBack" 
          :icon="ArrowLeft" 
          circle 
          size="small"
        />
        <span class="page-title">{{ currentPageTitle }}</span>
      </div>
      <div class="nav-right">
        <el-button :icon="Search" circle size="small" @click="showSearch = true" />
        <el-button :icon="Bell" circle size="small" @click="showNotifications = true">
          <el-badge v-if="unreadNotifications > 0" :value="unreadNotifications" class="notification-badge" />
        </el-button>
        <el-button :icon="ChatDotRound" circle size="small" @click="showMessages = true">
          <el-badge v-if="unreadMessages > 0" :value="unreadMessages" class="message-badge" />
        </el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <router-view />
    </div>

    <!-- Soul风格的底部导航栏 -->
    <div class="soul-bottom-nav">
      <div class="nav-background">
        <div class="nav-blur"></div>
        <div class="nav-gradient"></div>
      </div>
      
      <div class="nav-content">
        <div 
          v-for="item in navItems" 
          :key="item.name"
          class="nav-item"
          :class="{ active: $route.name === item.name }"
          @click="navigateTo(item.name)"
        >
          <div class="nav-icon-container">
            <div class="nav-icon-wrapper">
              <div class="nav-icon-bg" :class="{ active: $route.name === item.name }">
                <el-icon :size="24">
                  <component :is="item.icon" />
                </el-icon>
              </div>
              <!-- Soul风格的波纹效果 -->
              <div class="nav-wave" v-if="$route.name === item.name"></div>
              <div class="nav-pulse" v-if="$route.name === item.name"></div>
            </div>
          </div>
          <span class="nav-label">{{ item.title }}</span>
          <!-- 现代化徽章 -->
          <div class="nav-badge" v-if="item.badge > 0">
            <span>{{ item.badge > 99 ? '99+' : item.badge }}</span>
          </div>
          <!-- 小红点提示 -->
          <div class="nav-dot" v-if="item.hasDot && item.badge === 0"></div>
        </div>
      </div>
    </div>

    <!-- 搜索弹窗 -->
    <el-dialog v-model="showSearch" title="搜索" width="90%" :show-close="false">
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户、内容、商品..."
        :prefix-icon="Search"
        size="large"
        @keyup.enter="performSearch"
      />
      <div v-if="searchResults.length > 0" class="search-results">
        <div 
          v-for="result in searchResults" 
          :key="result.id"
          class="search-result-item"
          @click="handleSearchResult(result)"
        >
          <el-avatar :src="result.avatar" :size="40" />
          <div class="result-info">
            <span class="result-name">{{ result.name }}</span>
            <span class="result-type">{{ result.type }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showSearch = false">取消</el-button>
        <el-button type="primary" @click="performSearch">搜索</el-button>
      </template>
    </el-dialog>

    <!-- 消息弹窗 -->
    <el-dialog v-model="showMessages" title="消息" width="90%" :show-close="false">
      <div class="message-list">
        <div 
          v-for="chat in mockChats" 
          :key="chat.id"
          class="message-item"
          @click="openChat(chat.id)"
        >
          <el-avatar :src="chat.avatar" :size="50" />
          <div class="message-info">
            <div class="message-header">
              <span class="username">{{ chat.username }}</span>
              <span class="time">{{ formatTime(chat.lastMessageTime) }}</span>
            </div>
            <div class="message-content">
              <span class="last-message">{{ chat.lastMessage }}</span>
              <el-badge v-if="chat.unreadCount > 0" :value="chat.unreadCount" class="unread-badge" />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showMessages = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 通知弹窗 -->
    <el-dialog v-model="showNotifications" title="通知" width="90%" :show-close="false">
      <div class="notification-list">
        <div class="notification-item">
          <el-icon :size="20" color="#409EFF">
            <Bell />
          </el-icon>
          <div class="notification-content">
            <p>您有新的匹配请求</p>
            <span class="time">2分钟前</span>
          </div>
        </div>
        <div class="notification-item">
          <el-icon :size="20" color="#67C23A">
            <Trophy />
          </el-icon>
          <div class="notification-content">
            <p>恭喜您获得新的成就徽章</p>
            <span class="time">1小时前</span>
          </div>
        </div>
        <div class="notification-item">
          <el-icon :size="20" color="#E6A23C">
            <ShoppingCart />
          </el-icon>
          <div class="notification-content">
            <p>您的订单已发货</p>
            <span class="time">3小时前</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showNotifications = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Search, Bell, ChatDotRound, Trophy, ShoppingCart } from '@element-plus/icons-vue'
import { mockChats } from '../mock/social'
import { isOnline } from '../services/pwa'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const router = useRouter()
const route = useRoute()

const showSearch = ref(false)
const showMessages = ref(false)
const showNotifications = ref(false)
const searchQuery = ref('')
const searchResults = ref<any[]>([])

// Soul风格导航项配置
const navItems = [
  { name: 'Planet', title: '星球', icon: 'Star', badge: 0, hasDot: false },
  { name: 'Square', title: '广场', icon: 'HomeFilled', badge: 0, hasDot: false },
  { name: 'Chat', title: '聊天', icon: 'ChatDotRound', badge: 11, hasDot: false },
  { name: 'Profile', title: '自己', icon: 'User', badge: 0, hasDot: false }
]

// 所有功能模块配置
const allFeatures = [
  // 社交娱乐类
  { name: 'Live', title: '直播', icon: 'VideoCamera', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', category: 'social' },
  { name: 'Video', title: '短视频', icon: 'VideoPlay', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', category: 'social' },
  { name: 'Game', title: '游戏', icon: 'Trophy', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', category: 'social' },
  { name: 'VoiceParty', title: '语音派对', icon: 'Microphone', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', category: 'social' },
  
  // 生活服务类
  { name: 'Pet', title: '宠物服务', icon: 'Avatar', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', category: 'life' },
  { name: 'CheckIn', title: '地点打卡', icon: 'Location', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', category: 'life' },
  
  // 其他功能
  { name: 'Settings', title: '设置', icon: 'Setting', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', category: 'other' }
]

// 计算属性
const currentPageTitle = computed(() => {
  const currentItem = navItems.find(item => item.name === route.name)
  return currentItem?.title || 'MetaLinkr'
})

const showBackButton = computed(() => {
  return !navItems.some(item => item.name === route.name)
})

const unreadNotifications = computed(() => {
  return 3 // 模拟未读通知数量
})

const unreadMessages = computed(() => {
  return mockChats.reduce((total, chat) => total + chat.unreadCount, 0)
})

// 方法
const navigateTo = (routeName: string) => {
  router.push({ name: routeName })
}

const goBack = () => {
  router.back()
}

const openChat = (chatId: string) => {
  router.push({ name: 'Chat', params: { id: chatId } })
  showMessages.value = false
}

const performSearch = () => {
  // 这里应该调用搜索API
  // 临时使用模拟数据
  searchResults.value = [
    {
      id: '1',
      name: '小明',
      avatar: 'https://picsum.photos/200/200?random=2',
      type: '用户'
    },
    {
      id: '2',
      name: 'iPhone 15 Pro Max',
      avatar: 'https://picsum.photos/200/200?random=401',
      type: '商品'
    }
  ]
}

const handleSearchResult = (result: any) => {
  if (result.type === '用户') {
    // 跳转到用户详情页
    console.log('跳转到用户详情页:', result.id)
  } else if (result.type === '商品') {
    // 跳转到商品详情页
    router.push({ name: 'ProductDetail', params: { id: result.id } })
  }
  showSearch.value = false
}

const formatTime = (time: string) => {
  return dayjs(time).fromNow()
}
</script>

<style lang="scss" scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
}

.offline-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #F56C6C;
  color: white;
  text-align: center;
  padding: 8px;
  font-size: 14px;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.top-nav {
  height: 56px;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-secondary);
  z-index: 1000;

  .nav-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .page-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  .nav-right {
    display: flex;
    gap: 8px;

    .el-button {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      transition: all 0.2s ease;

      &:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
      }
    }

    .notification-badge,
    .message-badge {
      :deep(.el-badge__content) {
        top: 5px;
        right: 5px;
        background: var(--danger-gradient);
        border: 2px solid white;
        font-weight: 600;
      }
    }
  }
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 88px;
}

.soul-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  z-index: 1000;
  overflow: hidden;

  .nav-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .nav-blur {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(26, 26, 26, 0.9);
      backdrop-filter: blur(30px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 119, 198, 0.1) 0%, rgba(120, 119, 198, 0.1) 100%);
    }
  }

  .nav-content {
    position: relative;
    z-index: 2;
    display: flex;
    height: 100%;
    padding: 12px 0 16px 0;
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.1);

    .nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      .nav-icon-container {
        position: relative;
        margin-bottom: 6px;

        .nav-icon-wrapper {
          position: relative;
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;

          .nav-icon-bg {
            width: 48px;
            height: 48px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: transparent;
            color: rgba(255, 255, 255, 0.6);
            position: relative;
            z-index: 3;

            &.active {
              background: linear-gradient(135deg, #ff77c6 0%, #7877c6 100%);
              color: white;
              transform: scale(1.15);
              box-shadow: 0 8px 24px rgba(255, 119, 198, 0.4);
            }
          }

          .nav-wave {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(255, 119, 198, 0.3) 0%, rgba(120, 119, 198, 0.3) 100%);
            transform: translate(-50%, -50%) scale(0);
            animation: wave 1.2s ease-out;
            z-index: 1;
          }

          .nav-pulse {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(255, 119, 198, 0.2) 0%, rgba(120, 119, 198, 0.2) 100%);
            transform: translate(-50%, -50%);
            animation: pulse 2s infinite;
            z-index: 2;
          }
        }
      }

      .nav-label {
        font-size: 11px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.6);
        transition: all 0.3s ease;
        text-align: center;
        line-height: 1.2;
      }

      &.active .nav-label {
        color: #ff77c6;
        font-weight: 700;
        transform: scale(1.05);
      }

      .nav-badge {
        position: absolute;
        top: 8px;
        right: 16px;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        color: white;
        font-size: 10px;
        font-weight: 700;
        padding: 3px 7px;
        border-radius: 12px;
        min-width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
        animation: badgePulse 2s infinite;
        border: 2px solid white;

        span {
          font-size: 9px;
          line-height: 1;
        }
      }

      .nav-dot {
        position: absolute;
        top: 10px;
        right: 18px;
        width: 8px;
        height: 8px;
        background: #ff3b30;
        border-radius: 50%;
        animation: dotPulse 2s infinite;
        border: 2px solid white;
      }

      &:hover {
        transform: translateY(-2px);

        .nav-icon-bg {
          transform: scale(1.05);
          background: rgba(255, 119, 198, 0.1);
          color: #ff77c6;
        }

        .nav-label {
          color: #ff77c6;
        }
      }

      &.active:hover {
        .nav-icon-bg {
          transform: scale(1.2);
        }
      }
    }
  }
}

@keyframes wave {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes dotPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.7;
  }
}

.search-results {
  margin-top: 16px;
  max-height: 300px;
  overflow-y: auto;

  .search-result-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }

    .result-info {
      margin-left: 12px;
      flex: 1;

      .result-name {
        display: block;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }

      .result-type {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.message-list {
  max-height: 400px;
  overflow-y: auto;

  .message-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }

    .message-info {
      flex: 1;
      margin-left: 12px;

      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;

        .username {
          font-weight: 600;
          color: #333;
        }

        .time {
          font-size: 12px;
          color: #999;
        }
      }

      .message-content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .last-message {
          color: #666;
          font-size: 14px;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .unread-badge {
          margin-left: 8px;
        }
      }
    }
  }
}

.notification-list {
  max-height: 400px;
  overflow-y: auto;

  .notification-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    .notification-content {
      flex: 1;
      margin-left: 12px;

      p {
        margin: 0 0 4px 0;
        color: #333;
      }

      .time {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .top-nav {
    padding: 0 12px;
  }

  .bottom-nav {
    .nav-item {
      .nav-label {
        font-size: 10px;
      }
    }
  }
}
</style>
