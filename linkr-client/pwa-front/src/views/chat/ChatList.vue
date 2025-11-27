<template>
  <div class="soul-chat-page">
    <!-- Soul风格顶部导航 -->
    <div class="soul-nav-bar">
      <div class="nav-left">
        <div class="back-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
        </div>
        <div class="nav-title">通讯录</div>
      </div>
      <div class="nav-center">
        <div class="nav-tabs">
          <div 
            v-for="tab in navTabs" 
            :key="tab.key"
            class="tab-item"
            :class="{ active: activeTab === tab.key }"
            @click="switchTab(tab.key)"
          >
            {{ tab.label }}
          </div>
        </div>
      </div>
      <div class="nav-right">
        <div class="add-btn" @click="addChat">
          <el-icon><Plus /></el-icon>
        </div>
      </div>
    </div>

    <!-- Soul风格搜索栏 -->
    <div class="search-section">
      <div class="search-bar">
        <el-icon class="search-icon"><Search /></el-icon>
        <input 
          type="text" 
          placeholder="搜索备注、昵称或者聊天记录"
          v-model="searchQuery"
          @input="handleSearch"
        />
        <div class="filter-btn" @click="showFilter">
          <el-icon><Filter /></el-icon>
        </div>
      </div>
    </div>

    <!-- Soul风格聊天列表 -->
    <div class="chat-list">
      <div 
        v-for="chat in filteredChats" 
        :key="chat.id"
        class="chat-item"
        @click="openChat(chat)"
      >
        <div class="chat-avatar">
          <img v-if="chat.avatar" :src="chat.avatar" :alt="chat.name" />
          <div v-else class="default-avatar" :style="{ backgroundColor: chat.color }">
            {{ chat.name.charAt(0) }}
          </div>
          <div v-if="chat.isOnline" class="online-indicator"></div>
        </div>

        <div class="chat-content">
          <div class="chat-header">
            <div class="chat-name">{{ chat.name }}</div>
            <div class="chat-time">{{ chat.lastMessageTime }}</div>
          </div>
          
          <div class="chat-preview">
            <div class="message-preview">
              <span v-if="chat.lastMessageType === 'voice'" class="voice-indicator">
                <el-icon><Microphone /></el-icon>
                [语音]
              </span>
              <span v-else-if="chat.lastMessageType === 'image'" class="image-indicator">
                <el-icon><Picture /></el-icon>
                [图片]
              </span>
              <span v-else>{{ chat.lastMessage }}</span>
            </div>
            <div v-if="chat.unreadCount > 0" class="unread-badge">
              {{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
            </div>
          </div>

          <div v-if="chat.tags && chat.tags.length > 0" class="chat-tags">
            <span 
              v-for="tag in chat.tags" 
              :key="tag" 
              class="tag"
            >{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Soul风格浮动按钮 -->
    <div class="floating-action-btn" @click="showMeetAgain">
      <span>再遇见 {{ meetAgainCount }}></span>
    </div>

    <!-- Soul风格底部导航占位 -->
    <div class="bottom-spacer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Microphone, 
  Picture 
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const activeTab = ref('chat')
const searchQuery = ref('')
const meetAgainCount = ref(4)

// 导航标签
const navTabs = ref([
  { key: 'chat', label: '聊天' }
])

// 聊天列表数据
const chats = ref([
  {
    id: 1,
    name: '一点点晚风',
    avatar: 'https://picsum.photos/200/200?random=1',
    color: '#ff6b6b',
    lastMessage: '好的,我是帮女生找的女生在萧...',
    lastMessageTime: '10月4日',
    lastMessageType: 'text',
    unreadCount: 1,
    isOnline: true,
    tags: ['广场']
  },
  {
    id: 2,
    name: '奇遇铃-稍后再聊',
    avatar: null,
    color: '#4ecdc4',
    lastMessage: '有新朋友等你和Ta开启对...',
    lastMessageTime: '13:41',
    lastMessageType: 'text',
    unreadCount: 0,
    isOnline: false,
    tags: []
  },
  {
    id: 3,
    name: 'Soul空间站',
    avatar: null,
    color: '#45b7d1',
    lastMessage: '[活动] 🎵🎧🎤这里有复...',
    lastMessageTime: '10:00',
    lastMessageType: 'text',
    unreadCount: 0,
    isOnline: false,
    tags: []
  },
  {
    id: 4,
    name: '官方号消息',
    avatar: null,
    color: '#96ceb4',
    lastMessage: '哇,你的灵魂伴侣长这样...',
    lastMessageTime: '09:50',
    lastMessageType: 'text',
    unreadCount: 0,
    isOnline: false,
    tags: []
  },
  {
    id: 5,
    name: '一个美女罢了',
    avatar: 'https://picsum.photos/200/200?random=2',
    color: '#feca57',
    lastMessage: '🐸和今日份奇遇打个招呼吧',
    lastMessageTime: '01:26',
    lastMessageType: 'text',
    unreadCount: 1,
    isOnline: true,
    tags: ['匹配']
  },
  {
    id: 6,
    name: '系统通知',
    avatar: null,
    color: '#ff9ff3',
    lastMessage: '关注☔创建了【打桌球】...',
    lastMessageTime: '昨天',
    lastMessageType: 'text',
    unreadCount: 0,
    isOnline: false,
    tags: []
  },
  {
    id: 7,
    name: '林兰',
    avatar: 'https://picsum.photos/200/200?random=3',
    color: '#54a0ff',
    lastMessage: '[语音]',
    lastMessageTime: '昨天',
    lastMessageType: 'voice',
    unreadCount: 2,
    isOnline: false,
    tags: ['虚拟达人']
  },
  {
    id: 8,
    name: 'Siren',
    avatar: 'https://picsum.photos/200/200?random=4',
    color: '#5f27cd',
    lastMessage: '',
    lastMessageTime: '昨天',
    lastMessageType: 'text',
    unreadCount: 1,
    isOnline: false,
    tags: ['匹配']
  }
])

// 计算属性
const filteredChats = computed(() => {
  if (!searchQuery.value) {
    return chats.value
  }
  
  return chats.value.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 方法
const goBack = () => {
  router.back()
}

const switchTab = (tabKey: string) => {
  activeTab.value = tabKey
}

const addChat = () => {
  ElMessage.info('添加聊天功能开发中...')
}

const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const showFilter = () => {
  ElMessage.info('筛选功能开发中...')
}

const openChat = (chat: any) => {
  router.push(`/chat/${chat.id}`)
}

const showMeetAgain = () => {
  ElMessage.info('再遇见功能开发中...')
}

// 生命周期
onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss" scoped>
.soul-chat-page {
  background: linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%);
  min-height: 100vh;
  color: #334155;
  position: relative;
}

// Soul风格顶部导航
.soul-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;

  .nav-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .back-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #666666;

      &:hover {
        background: #e9ecef;
        color: #333333;
      }
    }

    .nav-title {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
    }
  }

  .nav-center {
    .nav-tabs {
      display: flex;
      gap: 24px;

      .tab-item {
        position: relative;
        font-size: 16px;
        font-weight: 600;
        color: #666666;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 8px 0;

        &:hover {
          color: #333333;
        }

        &.active {
          color: #333333;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: #00ff88;
            border-radius: 2px;
          }
        }
      }
    }
  }

  .nav-right {
    .add-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #666666;

      &:hover {
        background: #e9ecef;
        color: #333333;
      }
    }
  }
}

// Soul风格搜索栏
.search-section {
  padding: 16px 20px;
  background: #ffffff;

  .search-bar {
    position: relative;
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border-radius: 20px;
    padding: 12px 16px;
    border: 1px solid #e9ecef;

    .search-icon {
      color: #666666;
      margin-right: 8px;
    }

    input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      color: #333333;

      &::placeholder {
        color: #999999;
      }
    }

    .filter-btn {
      color: #666666;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: #333333;
      }
    }
  }
}

// Soul风格聊天列表
.chat-list {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 0;

  .chat-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #f8f9fa;
    }

    &:last-child {
      border-bottom: none;
    }

    .chat-avatar {
      position: relative;
      flex-shrink: 0;

      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
      }

      .default-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
        font-weight: 600;
      }

      .online-indicator {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        background: #00ff88;
        border: 2px solid #ffffff;
        border-radius: 50%;
      }
    }

    .chat-content {
      flex: 1;
      min-width: 0;

      .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;

        .chat-name {
          font-size: 16px;
          font-weight: 600;
          color: #333333;
        }

        .chat-time {
          font-size: 12px;
          color: #999999;
        }
      }

      .chat-preview {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .message-preview {
          flex: 1;
          font-size: 14px;
          color: #666666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .voice-indicator,
          .image-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #4facfe;
          }
        }

        .unread-badge {
          background: #ff4757;
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 8px;
        }
      }

      .chat-tags {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;

        .tag {
          background: #f0f8ff;
          color: #4facfe;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          border: 1px solid #e6f3ff;
        }
      }
    }
  }
}

// Soul风格浮动按钮
.floating-action-btn {
  position: fixed;
  bottom: 100px;
  left: 20px;
  right: 20px;
  background: #f8f9fa;
  color: #666666;
  padding: 12px 16px;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  z-index: 1000;

  &:hover {
    background: #e9ecef;
    color: #333333;
  }

  span {
    font-size: 14px;
    font-weight: 500;
  }
}

// 底部占位
.bottom-spacer {
  height: 80px;
}

// 响应式设计
@media screen and (max-width: 768px) {
  .soul-chat-page {
    .soul-nav-bar {
      padding: 12px 16px;

      .nav-center {
        .nav-tabs {
          gap: 16px;

          .tab-item {
            font-size: 14px;
          }
        }
      }
    }

    .search-section {
      padding: 12px 16px;
    }

    .chat-list {
      padding: 0 16px;

      .chat-item {
        padding: 12px 0;
        gap: 12px;

        .chat-avatar {
          img,
          .default-avatar {
            width: 40px;
            height: 40px;
          }

          .online-indicator {
            width: 10px;
            height: 10px;
          }
        }

        .chat-content {
          .chat-header {
            .chat-name {
              font-size: 14px;
            }
          }

          .chat-preview {
            .message-preview {
              font-size: 13px;
            }
          }
        }
      }
    }

    .floating-action-btn {
      bottom: 90px;
      left: 16px;
      right: 16px;
      padding: 10px 14px;

      span {
        font-size: 13px;
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .soul-nav-bar {
    .nav-center {
      .nav-tabs {
        gap: 12px;

        .tab-item {
          font-size: 13px;
        }
      }
    }
  }

  .chat-list {
    .chat-item {
      .chat-content {
        .chat-preview {
          .unread-badge {
            font-size: 10px;
            padding: 1px 6px;
            min-width: 16px;
            height: 16px;
          }
        }
      }
    }
  }
}
</style>