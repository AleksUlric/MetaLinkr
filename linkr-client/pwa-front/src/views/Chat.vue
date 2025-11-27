<template>
  <div class="uki-chat-page">
    <!-- Uki风格的顶部状态栏 -->
    <div class="chat-status-bar">
      <div class="status-info">
        <div class="user-avatar-container">
          <el-avatar :src="userAvatarUrl" :size="40" />
          <div class="online-indicator"></div>
        </div>
        <div class="user-stats">
          <span class="stat-item">💬{{ totalMessages }}</span>
          <span class="stat-item">🎤{{ voiceChats }}</span>
          <span class="stat-item">📹{{ videoChats }}</span>
        </div>
      </div>
      <div class="chat-mode-selector">
        <el-button 
          v-for="mode in chatModes" 
          :key="mode.id"
          :type="activeMode === mode.id ? 'primary' : 'default'"
          size="small"
          @click="setActiveMode(mode.id)"
        >
          {{ mode.icon }} {{ mode.label }}
        </el-button>
      </div>
    </div>

    <!-- Soul风格的匿名聊天入口 -->
    <div class="anonymous-chat-section">
      <div class="anonymous-header">
        <div class="anonymous-avatar">
          <div class="avatar-placeholder">
            <span>{{ getAnonymousAvatar() }}</span>
          </div>
          <div class="anonymous-badge">匿名</div>
        </div>
        <div class="anonymous-info">
          <h3>匿名聊天</h3>
          <p>与陌生人开启神秘对话</p>
        </div>
        <el-button 
          type="primary" 
          size="small" 
          @click="startAnonymousChat"
          class="anonymous-btn"
        >
          <el-icon><ChatDotRound /></el-icon>
          开始匿名聊天
        </el-button>
      </div>
      <div class="anonymous-features">
        <div class="feature-item" @click="startVoiceChat">
          <div class="feature-icon voice">
            <el-icon><Microphone /></el-icon>
          </div>
          <span>语音聊天</span>
        </div>
        <div class="feature-item" @click="startVideoChat">
          <div class="feature-icon video">
            <el-icon><VideoCamera /></el-icon>
          </div>
          <span>视频聊天</span>
        </div>
        <div class="feature-item" @click="startGameChat">
          <div class="feature-icon game">
            <el-icon><Trophy /></el-icon>
          </div>
          <span>游戏开黑</span>
        </div>
        <div class="feature-item" @click="startGroupChat">
          <div class="feature-icon group">
            <el-icon><UserFilled /></el-icon>
          </div>
          <span>群聊</span>
        </div>
      </div>
    </div>

    <!-- 聊天分类标签 -->
    <div class="chat-tabs">
      <div 
        v-for="tab in chatTabs" 
        :key="tab.id"
        class="tab-item"
        :class="{ 'active': activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <el-badge 
          v-if="tab.count > 0" 
          :value="tab.count" 
          class="tab-badge"
        />
      </div>
    </div>

    <!-- Uki风格的聊天列表 -->
    <div class="uki-chat-list">
      <!-- 置顶聊天 -->
      <div v-if="pinnedChats.length > 0" class="chat-section">
        <div class="section-header">
          <el-icon><StarFilled /></el-icon>
          <span>置顶聊天</span>
        </div>
        <div 
          v-for="chat in pinnedChats" 
          :key="chat.id"
          class="uki-chat-item pinned"
          @click="enterChat(chat)"
        >
          <div class="chat-avatar">
            <el-avatar :src="chat.avatar" :size="50" />
            <div class="online-status" v-if="chat.isOnline"></div>
            <div class="chat-type-badge" :class="chat.chatType">
              <el-icon v-if="chat.chatType === 'voice'"><Microphone /></el-icon>
              <el-icon v-else-if="chat.chatType === 'video'"><VideoCamera /></el-icon>
              <el-icon v-else-if="chat.chatType === 'group'"><UserFilled /></el-icon>
              <el-icon v-else><ChatDotRound /></el-icon>
            </div>
            <div class="pin-indicator">
              <el-icon><StarFilled /></el-icon>
            </div>
          </div>
          <div class="chat-content">
            <div class="chat-header-info">
              <span class="username">{{ chat.username }}</span>
              <span class="time">{{ chat.lastTime }}</span>
            </div>
            <div class="last-message">
              <div class="message-preview">
                <span class="message-text">{{ chat.lastMessage }}</span>
                <div v-if="chat.chatType === 'voice'" class="voice-indicator">
                  <el-icon><Microphone /></el-icon>
                  <span>{{ chat.voiceDuration || '15' }}s</span>
                </div>
                <div v-if="chat.chatType === 'video'" class="video-indicator">
                  <el-icon><VideoCamera /></el-icon>
                  <span>视频通话</span>
                </div>
              </div>
              <el-badge :value="chat.unreadCount" :hidden="chat.unreadCount === 0" class="unread-badge" />
            </div>
          </div>
          <div class="chat-actions">
            <el-button type="text" @click.stop="togglePin(chat.id)">
              <el-icon><Star /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 普通聊天 -->
      <div class="chat-section">
        <div class="section-header">
          <el-icon><ChatDotRound /></el-icon>
          <span>最近聊天</span>
        </div>
        <div 
          v-for="chat in filteredChats" 
          :key="chat.id"
          class="uki-chat-item"
          @click="enterChat(chat)"
        >
          <div class="chat-avatar">
            <el-avatar :src="chat.avatar" :size="50" />
            <div class="online-status" v-if="chat.isOnline"></div>
            <div class="chat-type-badge" :class="chat.chatType">
              <el-icon v-if="chat.chatType === 'voice'"><Microphone /></el-icon>
              <el-icon v-else-if="chat.chatType === 'video'"><VideoCamera /></el-icon>
              <el-icon v-else-if="chat.chatType === 'group'"><UserFilled /></el-icon>
              <el-icon v-else><ChatDotRound /></el-icon>
            </div>
          </div>
          <div class="chat-content">
            <div class="chat-header-info">
              <span class="username">{{ chat.username }}</span>
              <span class="time">{{ chat.lastTime }}</span>
            </div>
            <div class="last-message">
              <div class="message-preview">
                <span class="message-text">{{ chat.lastMessage }}</span>
                <div v-if="chat.chatType === 'voice'" class="voice-indicator">
                  <el-icon><Microphone /></el-icon>
                  <span>{{ chat.voiceDuration || '15' }}s</span>
                </div>
                <div v-if="chat.chatType === 'video'" class="video-indicator">
                  <el-icon><VideoCamera /></el-icon>
                  <span>视频通话</span>
                </div>
              </div>
              <el-badge :value="chat.unreadCount" :hidden="chat.unreadCount === 0" class="unread-badge" />
            </div>
          </div>
          <div class="chat-actions">
            <el-button type="text" @click.stop="togglePin(chat.id)">
              <el-icon><Star /></el-icon>
            </el-button>
            <el-button type="text" @click.stop="deleteChat(chat.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredChats.length === 0 && pinnedChats.length === 0" class="empty-state">
        <div class="empty-icon">
          <el-icon><ChatDotRound /></el-icon>
        </div>
        <h3>暂无聊天记录</h3>
        <p>开始与朋友聊天吧</p>
        <el-button type="primary" @click="startNewChat">
          开始聊天
        </el-button>
      </div>
    </div>

    <!-- 新建聊天对话框 -->
    <el-dialog v-model="showNewChatDialog" title="新建聊天" width="90%">
      <div class="new-chat-content">
        <div class="search-section">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户"
            prefix-icon="Search"
            clearable
          />
        </div>
        
        <div class="quick-actions">
          <h4>快速开始</h4>
          <div class="action-grid">
            <div class="action-item" @click="startGroupChat">
              <el-icon><UserFilled /></el-icon>
              <span>群聊</span>
            </div>
            <div class="action-item" @click="startVoiceChat">
              <el-icon><Microphone /></el-icon>
              <span>语音聊天</span>
            </div>
            <div class="action-item" @click="startVideoChat">
              <el-icon><VideoCamera /></el-icon>
              <span>视频聊天</span>
            </div>
            <div class="action-item" @click="startGameChat">
              <el-icon><Trophy /></el-icon>
              <span>游戏开黑</span>
            </div>
          </div>
        </div>

        <div class="suggested-users">
          <h4>推荐用户</h4>
          <div class="user-list">
            <div 
              v-for="user in suggestedUsers" 
              :key="user.id"
              class="user-item"
              @click="startChatWithUser(user)"
            >
              <el-avatar :src="user.avatar" :size="40" />
              <div class="user-info">
                <span class="user-name">{{ user.name }}</span>
                <span class="user-status">{{ user.status }}</span>
              </div>
              <el-button type="primary" size="small">聊天</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserAvatarUrl } from '@/utils/avatar'
import { 
  Search, 
  Plus, 
  Setting,
  StarFilled,
  Star,
  ChatDotRound,
  Delete,
  UserFilled,
  Microphone,
  VideoCamera,
  Trophy
} from '@element-plus/icons-vue'

const userStore = useUserStore()

// 计算用户头像URL（自动处理 OSS 默认头像转换）
const userAvatarUrl = computed(() => {
  const profile = userStore.profile as any
  return getUserAvatarUrl(profile?.avatar, profile?.gender || 'male')
})

interface ChatItem {
  id: string
  username: string
  avatar: string
  lastMessage: string
  lastTime: string
  unreadCount: number
  isOnline: boolean
  isPinned: boolean
  chatType: 'private' | 'group' | 'voice' | 'video'
  voiceDuration?: number
  isAnonymous?: boolean
}

interface ChatTab {
  id: string
  label: string
  count: number
}

interface SuggestedUser {
  id: string
  name: string
  avatar: string
  status: string
}

// 响应式数据
const activeTab = ref('all')
const activeMode = ref('all')
const showNewChatDialog = ref(false)
const searchKeyword = ref('')

// 聊天模式
const chatModes = ref([
  { id: 'all', label: '全部', icon: '💬' },
  { id: 'voice', label: '语音', icon: '🎤' },
  { id: 'video', label: '视频', icon: '📹' },
  { id: 'anonymous', label: '匿名', icon: '👤' }
])

// 计算属性
const totalMessages = computed(() => chatList.value.length)
const voiceChats = computed(() => chatList.value.filter(chat => chat.chatType === 'voice').length)
const videoChats = computed(() => chatList.value.filter(chat => chat.chatType === 'video').length)

// 聊天标签
const chatTabs = ref<ChatTab[]>([
  { id: 'all', label: '全部', count: 0 },
  { id: 'unread', label: '未读', count: 0 },
  { id: 'pinned', label: '置顶', count: 0 },
  { id: 'groups', label: '群聊', count: 0 }
])

// 聊天列表数据
const chatList = ref<ChatItem[]>([
  {
    id: '1',
    username: '小美',
    avatar: 'https://picsum.photos/100/100?random=1',
    lastMessage: '今天天气真好呢~',
    lastTime: '2分钟前',
    unreadCount: 2,
    isOnline: true,
    isPinned: true,
    chatType: 'private',
    isAnonymous: false
  },
  {
    id: '2',
    username: '阿强',
    avatar: 'https://picsum.photos/100/100?random=2',
    lastMessage: '一起开黑吗？',
    lastTime: '10分钟前',
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    chatType: 'private',
    isAnonymous: false
  },
  {
    id: '3',
    username: '匿名用户001',
    avatar: 'https://picsum.photos/100/100?random=3',
    lastMessage: '你好，我们可以聊聊吗？',
    lastTime: '1小时前',
    unreadCount: 1,
    isOnline: true,
    isPinned: false,
    chatType: 'private',
    isAnonymous: true
  },
  {
    id: '4',
    username: '游戏开黑群',
    avatar: 'https://picsum.photos/100/100?random=4',
    lastMessage: '小明: 有人一起打王者吗？',
    lastTime: '30分钟前',
    unreadCount: 5,
    isOnline: true,
    isPinned: true,
    chatType: 'group',
    isAnonymous: false
  },
  {
    id: '5',
    username: '语音聊天室',
    avatar: 'https://picsum.photos/100/100?random=5',
    lastMessage: '正在语音聊天中...',
    lastTime: '1小时前',
    unreadCount: 0,
    isOnline: true,
    isPinned: false,
    chatType: 'voice',
    voiceDuration: 15,
    isAnonymous: false
  },
  {
    id: '6',
    username: '视频聊天',
    avatar: 'https://picsum.photos/100/100?random=6',
    lastMessage: '视频通话已结束',
    lastTime: '2小时前',
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    chatType: 'video',
    isAnonymous: false
  }
])

// 推荐用户
const suggestedUsers = ref<SuggestedUser[]>([
  {
    id: '6',
    name: '小红',
    avatar: 'https://picsum.photos/100/100?random=6',
    status: '在线'
  },
  {
    id: '7',
    name: '小李',
    avatar: 'https://picsum.photos/100/100?random=7',
    status: '5分钟前在线'
  },
  {
    id: '8',
    name: '小王',
    avatar: 'https://picsum.photos/100/100?random=8',
    status: '在线'
  }
])

// 计算属性
const pinnedChats = computed(() => 
  chatList.value.filter(chat => chat.isPinned)
)

const filteredChats = computed(() => {
  let filtered = chatList.value.filter(chat => !chat.isPinned)
  
  switch (activeTab.value) {
    case 'unread':
      filtered = filtered.filter(chat => chat.unreadCount > 0)
      break
    case 'groups':
      filtered = filtered.filter(chat => chat.chatType === 'group')
      break
    case 'pinned':
      filtered = pinnedChats.value
      break
  }
  
  return filtered
})

// 方法
const switchTab = (tabId: string) => {
  activeTab.value = tabId
}

const setActiveMode = (modeId: string) => {
  activeMode.value = modeId
  console.log('切换聊天模式:', modeId)
}

const getAnonymousAvatar = () => {
  const avatars = ['👤', '🎭', '🎪', '🎨', '🎯', '🎲', '🎸', '🎺']
  return avatars[Math.floor(Math.random() * avatars.length)]
}

const startAnonymousChat = () => {
  // 创建匿名聊天
  const newChat: ChatItem = {
    id: Date.now().toString(),
    username: '匿名用户' + Math.floor(Math.random() * 1000),
    avatar: 'https://picsum.photos/100/100?random=' + Math.floor(Math.random() * 100),
    lastMessage: '开始匿名聊天...',
    lastTime: '刚刚',
    unreadCount: 0,
    isOnline: true,
    isPinned: false,
    chatType: 'private',
    isAnonymous: true
  }
  
  chatList.value.unshift(newChat)
  updateTabCounts()
  ElMessage.success('开始匿名聊天')
}

const enterChat = (chat: ChatItem) => {
  // 清除未读消息
  chat.unreadCount = 0
  updateTabCounts()
  
  // 进入聊天详情页面
  console.log('进入聊天:', chat.username)
  ElMessage.success(`进入与 ${chat.username} 的聊天`)
}

const togglePin = (chatId: string) => {
  const chat = chatList.value.find(c => c.id === chatId)
  if (chat) {
    chat.isPinned = !chat.isPinned
    updateTabCounts()
    ElMessage.success(chat.isPinned ? '已置顶' : '已取消置顶')
  }
}

const deleteChat = async (chatId: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个聊天吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = chatList.value.findIndex(c => c.id === chatId)
    if (index > -1) {
      chatList.value.splice(index, 1)
      updateTabCounts()
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

const startNewChat = () => {
  showNewChatDialog.value = true
}

const startGroupChat = () => {
  ElMessage.info('创建群聊功能开发中...')
  showNewChatDialog.value = false
}

const startVoiceChat = () => {
  ElMessage.info('语音聊天功能开发中...')
  showNewChatDialog.value = false
}

const startVideoChat = () => {
  ElMessage.info('视频聊天功能开发中...')
  showNewChatDialog.value = false
}

const startGameChat = () => {
  ElMessage.info('游戏开黑功能开发中...')
  showNewChatDialog.value = false
}

const startChatWithUser = (user: SuggestedUser) => {
  // 创建新聊天
  const newChat: ChatItem = {
    id: Date.now().toString(),
    username: user.name,
    avatar: user.avatar,
    lastMessage: '开始聊天吧~',
    lastTime: '刚刚',
    unreadCount: 0,
    isOnline: true,
    isPinned: false,
    chatType: 'private'
  }
  
  chatList.value.unshift(newChat)
  updateTabCounts()
  showNewChatDialog.value = false
  ElMessage.success(`开始与 ${user.name} 聊天`)
}

const updateTabCounts = () => {
  const unreadCount = chatList.value.reduce((sum, chat) => sum + chat.unreadCount, 0)
  const pinnedCount = chatList.value.filter(chat => chat.isPinned).length
  const groupCount = chatList.value.filter(chat => chat.chatType === 'group').length
  
  chatTabs.value[0].count = chatList.value.length
  chatTabs.value[1].count = unreadCount
  chatTabs.value[2].count = pinnedCount
  chatTabs.value[3].count = groupCount
}

onMounted(() => {
  updateTabCounts()
})
</script>

<style lang="scss" scoped>
.uki-chat-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 16px;
  padding-bottom: 80px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
    pointer-events: none;
  }
}

// Uki风格的顶部状态栏
.chat-status-bar {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 16px 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;

  .status-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;

    .user-avatar-container {
      position: relative;

      .online-indicator {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        background: #10b981;
        border: 2px solid white;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
    }

    .user-stats {
      display: flex;
      gap: 12px;
      flex: 1;

      .stat-item {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
  }

  .chat-mode-selector {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .el-button {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 16px;
      backdrop-filter: blur(10px);

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      &.el-button--primary {
        background: rgba(255, 255, 255, 0.9);
        color: #667eea;
        border: none;
      }
    }
  }
}

// Soul风格的匿名聊天入口
.anonymous-chat-section {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;

  .anonymous-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;

    .anonymous-avatar {
      position: relative;

      .avatar-placeholder {
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
      }

      .anonymous-badge {
        position: absolute;
        top: -2px;
        right: -2px;
        background: #10b981;
        color: white;
        font-size: 10px;
        padding: 2px 4px;
        border-radius: 8px;
        border: 1px solid white;
      }
    }

    .anonymous-info {
      flex: 1;

      h3 {
        margin: 0 0 4px 0;
        color: white;
        font-size: 18px;
        font-weight: 700;
      }

      p {
        margin: 0;
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
      }
    }

    .anonymous-btn {
      background: rgba(255, 255, 255, 0.9);
      color: #667eea;
      border: none;
      border-radius: 16px;
      padding: 8px 16px;
      font-weight: 600;
      backdrop-filter: blur(10px);

      &:hover {
        background: white;
        transform: translateY(-2px);
      }
    }
  }

  .anonymous-features {
    display: flex;
    gap: 12px;
    justify-content: space-around;

    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 12px 8px;
      border-radius: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      flex: 1;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      &:active {
        transform: scale(0.95);
      }

      .feature-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        &.voice {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        &.video {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        &.game {
          background: rgba(168, 85, 247, 0.2);
          color: #a855f7;
        }

        &.group {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .el-icon {
          font-size: 18px;
        }
      }

      span {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
      }

      &:hover .feature-icon {
        transform: scale(1.1);
      }

      &:hover span {
        color: white;
      }
    }
  }
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #eee;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
  font-size: 14px;
}

.nav-center h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 聊天分类标签 */
.chat-tabs {
  display: flex;
  background: white;
  border-bottom: 1px solid #eee;
  padding: 0 16px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  position: relative;
}

.tab-item:hover {
  background: #f8f9fa;
}

.tab-item.active {
  color: #409eff;
  border-bottom-color: #409eff;
}

.tab-label {
  font-size: 14px;
  font-weight: 500;
}

.tab-badge {
  font-size: 12px;
}

// Uki风格的聊天列表
.uki-chat-list {
  position: relative;
  z-index: 2;

  .chat-section {
    margin-bottom: 24px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    margin-bottom: 8px;
  }

  .uki-chat-item {
    display: flex;
    align-items: center;
    padding: 16px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      border-color: rgba(102, 126, 234, 0.3);
    }

    &.pinned {
      background: linear-gradient(135deg, rgba(255, 249, 230, 0.95) 0%, rgba(255, 251, 240, 0.95) 100%);
      border-color: rgba(255, 234, 167, 0.5);
    }

    .chat-avatar {
      position: relative;
      margin-right: 16px;

      .online-status {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        background: #10b981;
        border: 2px solid white;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }

      .chat-type-badge {
        position: absolute;
        top: -2px;
        left: -2px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        border: 2px solid white;

        &.voice {
          background: #f59e0b;
        }

        &.video {
          background: #3b82f6;
        }

        &.group {
          background: #10b981;
        }

        &.private {
          background: #667eea;
        }
      }

      .pin-indicator {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 16px;
        height: 16px;
        background: #f39c12;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 8px;
        border: 1px solid white;
      }
    }

    .chat-content {
      flex: 1;
      min-width: 0;

      .chat-header-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;

        .username {
          font-weight: 600;
          color: #333;
          font-size: 16px;
        }

        .time {
          font-size: 12px;
          color: #999;
        }
      }

      .last-message {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .message-preview {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;

          .message-text {
            color: #666;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
          }

          .voice-indicator, .video-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: #999;
            background: rgba(0, 0, 0, 0.05);
            padding: 2px 6px;
            border-radius: 8px;

            .el-icon {
              font-size: 10px;
            }
          }

          .voice-indicator {
            color: #f59e0b;
            background: rgba(245, 158, 11, 0.1);
          }

          .video-indicator {
            color: #3b82f6;
            background: rgba(59, 130, 246, 0.1);
          }
        }

        .unread-badge {
          margin-left: 8px;
        }
      }
    }

    .chat-actions {
      display: flex;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.3s;

      .el-button {
        padding: 4px;
        min-height: auto;
        color: #999;

        &:hover {
          color: #667eea;
        }
      }
    }

    &:hover .chat-actions {
      opacity: 1;
    }
  }
}

.chat-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.chat-item:hover {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px 12px;
  margin: 0 -12px;
}

.chat-item.pinned {
  background: linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%);
  border-radius: 8px;
  padding: 16px 12px;
  margin: 0 -12px 8px -12px;
  border: 1px solid #ffeaa7;
}

.avatar {
  position: relative;
  margin-right: 12px;
}

.online-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.pin-indicator {
  position: absolute;
  top: -2px;
  left: -2px;
  width: 16px;
  height: 16px;
  background: #f39c12;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
}

.chat-content {
  flex: 1;
  min-width: 0;
}

.chat-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.username {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.time {
  font-size: 12px;
  color: #999;
}

.last-message {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-text {
  color: #666;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.unread-badge {
  margin-left: 8px;
}

.chat-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.chat-item:hover .chat-actions {
  opacity: 1;
}

.chat-actions .el-button {
  padding: 4px;
  min-height: auto;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  color: #ddd;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #666;
}

.empty-state p {
  margin: 0 0 20px 0;
  font-size: 14px;
}

/* 新建聊天对话框 */
.new-chat-content {
  padding: 20px 0;
}

.search-section {
  margin-bottom: 24px;
}

.quick-actions {
  margin-bottom: 24px;
}

.quick-actions h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.action-item .el-icon {
  font-size: 24px;
  color: #409eff;
  margin-bottom: 8px;
}

.action-item span {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.suggested-users h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.user-item:hover {
  background: #e9ecef;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.user-status {
  font-size: 12px;
  color: #999;
}

// 动画效果
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .uki-chat-page {
    padding: 12px;
  }

  .chat-status-bar {
    padding: 12px 16px;
    margin-bottom: 16px;

    .status-info {
      gap: 12px;
      margin-bottom: 8px;

      .user-stats {
        gap: 8px;

        .stat-item {
          padding: 3px 6px;
          font-size: 11px;
        }
      }
    }

    .chat-mode-selector {
      gap: 6px;

      .el-button {
        font-size: 11px;
        padding: 4px 8px;
      }
    }
  }

  .anonymous-chat-section {
    padding: 16px;
    margin-bottom: 16px;

    .anonymous-header {
      gap: 12px;
      margin-bottom: 12px;

      .anonymous-avatar {
        .avatar-placeholder {
          width: 40px;
          height: 40px;
          font-size: 20px;
        }

        .anonymous-badge {
          font-size: 8px;
          padding: 1px 3px;
        }
      }

      .anonymous-info {
        h3 {
          font-size: 16px;
        }

        p {
          font-size: 12px;
        }
      }

      .anonymous-btn {
        padding: 6px 12px;
        font-size: 12px;
      }
    }

    .anonymous-features {
      gap: 8px;

      .feature-item {
        padding: 8px 4px;

        .feature-icon {
          width: 32px;
          height: 32px;

          .el-icon {
            font-size: 16px;
          }
        }

        span {
          font-size: 11px;
        }
      }
    }
  }

  .uki-chat-list {
    .uki-chat-item {
      padding: 12px;

      .chat-avatar {
        margin-right: 12px;

        .chat-type-badge {
          width: 18px;
          height: 18px;
          font-size: 9px;
        }

        .pin-indicator {
          width: 14px;
          height: 14px;
          font-size: 7px;
        }
      }

      .chat-content {
        .chat-header-info {
          margin-bottom: 4px;

          .username {
            font-size: 14px;
          }

          .time {
            font-size: 11px;
          }
        }

        .last-message {
          .message-preview {
            gap: 6px;

            .message-text {
              font-size: 13px;
            }

            .voice-indicator, .video-indicator {
              font-size: 11px;
              padding: 1px 4px;

              .el-icon {
                font-size: 9px;
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .anonymous-chat-section {
    .anonymous-features {
      .feature-item {
        span {
          display: none;
        }
      }
    }
  }

  .uki-chat-list {
    .uki-chat-item {
      .chat-content {
        .last-message {
          .message-preview {
            .message-text {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>

