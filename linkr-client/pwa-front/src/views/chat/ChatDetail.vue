<template>
  <div class="chat-detail">
    <div class="chat-header">
      <el-button type="text" :icon="ArrowLeft" @click="goBack" />
      <div class="chat-info" @click="goToUserSpace">
        <el-avatar :src="chatUser.avatar" :size="32" />
        <div class="user-info">
          <h3 class="user-name">{{ chatUser.name }}</h3>
          <p class="user-status">{{ chatUser.isOnline ? '在线' : '离线' }}</p>
          <p class="user-meta">{{ chatUser.age }}岁 · {{ chatUser.location }}</p>
        </div>
      </div>
      <el-button type="text" :icon="MoreFilled" />
    </div>
    
    <div class="chat-user-card">
      <div class="card-main">
        <div class="card-avatar" @click="goToUserSpace">
          <el-avatar :src="chatUser.avatar" :size="64" />
          <div class="status-chip">
            <span class="status-dot" :class="{ online: chatUser.isOnline }"></span>
            {{ chatUser.isOnline ? '此刻在线' : '刚刚离开' }}
          </div>
        </div>
        <div class="card-info">
          <div class="name-row">
            <span class="name">{{ chatUser.name }}</span>
            <span class="compatibility">{{ chatUser.compatibility }}% 灵犀</span>
          </div>
          <div class="meta-row">
            <span>{{ chatUser.age }}岁</span>
            <span class="dot">·</span>
            <span>{{ chatUser.location }}</span>
            <template v-if="chatUser.distance">
              <span class="dot">·</span>
              <span>{{ chatUser.distance }}</span>
            </template>
          </div>
          <div class="meta-row occupation" v-if="chatUser.occupation">
            {{ chatUser.occupation }}
          </div>
        </div>
      </div>
      <p class="card-bio">{{ chatUser.bio }}</p>
      <div class="card-tags" v-if="chatUser.tags?.length">
        <span v-for="tag in chatUser.tags" :key="tag" class="tag">#{{ tag }}</span>
      </div>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id" 
        class="message-item"
        :class="{ 'is-me': message.isFromMe }"
      >
        <div class="message-content">
          <p class="message-text">{{ message.content }}</p>
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <el-input
        v-model="inputMessage"
        placeholder="输入消息..."
        @keyup.enter="sendMessage"
      >
        <template #append>
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, MoreFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { storeToRefs } from 'pinia'
import { useMatchStore } from '../../stores/match'
import { useChatStore } from '../../stores/chat'
import { useUserStore } from '../../stores/user'
import type { MatchUser } from '../../types/match'

type ChatProfile = {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  age: number
  location: string
  distance: string
  occupation: string
  bio: string
  tags: string[]
  compatibility: number
}

const router = useRouter()
const route = useRoute()
const matchStore = useMatchStore()
const chatStore = useChatStore()
const userStore = useUserStore()
const { currentChatRoom } = storeToRefs(chatStore)
const lastMatchedUser = matchStore.lastMatchedUser
const messagesContainer = ref<HTMLElement>()
const inputMessage = ref('')

const fallbackAvatar = 'https://picsum.photos/200/200?random=30'

const mockProfiles: Record<string, ChatProfile> = {
  'soul-link': {
    id: 'soul-link',
    name: '灵犀推荐',
    avatar: 'https://picsum.photos/200/200?random=35',
    isOnline: true,
    age: 25,
    location: '上海 · 静安',
    distance: '约2.4 km',
    occupation: '体验设计师',
    bio: '热爱独立音乐与城市漫游，希望和你聊聊宇宙与热咖啡。',
    tags: ['夜猫子', '乐队控', '阅读控'],
    compatibility: 92
  },
  '1': {
    id: '1',
    name: '一点点晚风',
    avatar: 'https://picsum.photos/200/200?random=1',
    isOnline: true,
    age: 24,
    location: '杭州 · 西湖',
    distance: '约3.6 km',
    occupation: '插画师',
    bio: '画画、咖啡、慢跑和有趣的灵魂。',
    tags: ['画画', '慢跑', '咖啡控'],
    compatibility: 88
  }
}

const resolveRouteValue = (value?: string | string[]): string | undefined => {
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}

const resolveChatId = (value?: string | string[]): string => {
  return resolveRouteValue(value) ?? 'soul-link'
}

const queryUserId = computed(() =>
  resolveRouteValue(route.query.userId as string | string[] | undefined)
)

const createFallbackProfile = (id: string): ChatProfile => ({
  id,
  name: `神秘好友 ${id}`,
  avatar: fallbackAvatar,
  isOnline: false,
  age: 24,
  location: '未知星球',
  distance: '距离保密',
  occupation: '灵魂探索者',
  bio: '对方还没有完善资料，但你们可以从一段真诚的对话开始。',
  tags: ['灵犀星人'],
  compatibility: 80
})

const mapMatchUserToChatProfile = (user: MatchUser): ChatProfile => ({
  id: user.id.toString(),
  name: user.name,
  avatar: user.photos?.[0] ?? user.avatar ?? fallbackAvatar,
  isOnline: user.isOnline,
  age: user.age,
  location: user.location,
  distance: `${user.distance.toFixed(1)} km`,
  occupation: '',
  bio: user.bio,
  tags: user.interests ?? [],
  compatibility: Math.min(100, Math.max(70, 80 + Math.floor(Math.random() * 15)))
})

const getProfileById = (id: string): ChatProfile => {
  if (id === 'new') {
    if (lastMatchedUser.value) {
      return mapMatchUserToChatProfile(lastMatchedUser.value)
    }
    if (queryUserId.value) {
      return mockProfiles[queryUserId.value] ?? createFallbackProfile(queryUserId.value)
    }
    return createFallbackProfile('new')
  }

  if (lastMatchedUser.value && lastMatchedUser.value.id.toString() === id) {
    return mapMatchUserToChatProfile(lastMatchedUser.value)
  }

  return mockProfiles[id] ?? createFallbackProfile(id)
}

const currentChatId = computed(() => resolveChatId(route.params.id))
const chatUser = ref<ChatProfile>(getProfileById(currentChatId.value))

watch(
  [() => currentChatId.value, () => lastMatchedUser.value, () => queryUserId.value],
  () => {
    chatUser.value = getProfileById(currentChatId.value)
  }
)

// 使用chat store的消息
const messages = computed(() => {
  return chatStore.currentMessages.map(msg => ({
    id: msg.id,
    content: msg.content,
    timestamp: msg.timestamp,
    isFromMe: msg.isFromMe
  }))
})

const formatTime = (timestamp: number) => {
  return formatDistanceToNow(new Date(timestamp), { 
    addSuffix: true, 
    locale: zhCN 
  })
}

const sendMessage = async () => {
  const content = inputMessage.value.trim()
  if (!content) {
    ElMessage.warning('请输入想发送的内容')
    return
  }

  if (!currentChatRoom.value) {
    ElMessage.warning('聊天通道尚未建立，请稍等片刻~')
    return
  }
  
  inputMessage.value = ''
  
  try {
    // 使用chat store发送消息
    const result = await chatStore.sendMessage(content, 'text')
    
    if (!result.success) {
      // 如果发送失败，恢复输入内容
      inputMessage.value = content
      ElMessage.error(result.error || '发送消息失败')
      return
    }
    
    nextTick(() => {
      scrollToBottom()
    })
  } catch (error: any) {
    // 发送失败，恢复输入内容
    inputMessage.value = content
    console.error('发送消息失败:', error)
    ElMessage.error(error.message || '发送消息失败，请稍后再试')
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const goBack = () => {
  router.back()
}

const goToUserSpace = () => {
  router.push(`/user/${chatUser.value.id}`)
}

// 初始化聊天室
const initChatRoom = async () => {
  const chatId = currentChatId.value
  
  try {
    // 优先从路由查询参数中获取 chatRoomId
    let chatRoomId: number | null | undefined = undefined
    const queryChatRoomId = route.query.chatRoomId
    if (queryChatRoomId) {
      const parsed = typeof queryChatRoomId === 'string' 
        ? parseInt(queryChatRoomId, 10) 
        : parseInt(queryChatRoomId[0], 10)
      if (!isNaN(parsed) && parsed > 0) {
        chatRoomId = parsed
        console.log('[ChatDetail] 从路由查询参数获取 chatRoomId:', chatRoomId)
      }
    }
    
    // 如果没有从查询参数获取到，则从匹配用户中获取 chatRoomId
    if (!chatRoomId && lastMatchedUser.value && lastMatchedUser.value.id.toString() === chatId) {
      chatRoomId = lastMatchedUser.value.chatRoomId
      console.log('[ChatDetail] 从匹配用户获取 chatRoomId:', chatRoomId)
    }
    
    // 使用chat store的方法创建或获取聊天室
    const chatRoom = await chatStore.getOrCreateChatRoom(
      chatId,
      chatUser.value.name,
      chatUser.value.avatar,
      chatUser.value.isOnline,
      chatRoomId
    )
    
    // 设置当前聊天室
    chatStore.setCurrentChatRoom(chatRoom)
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  } catch (error: any) {
    console.error('初始化聊天室失败:', error)
    ElMessage.error(error.message || '无法初始化聊天室，请稍后再试')
    // 可以选择返回上一页
    // router.back()
  }
}

watch(
  () => currentChatId.value,
  () => {
    initChatRoom()
  },
  { immediate: true }
)

onMounted(() => {
  initChatRoom()
})
</script>

<style scoped lang="scss">
.chat-detail {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  
  .chat-info {
    flex: 1;
    display: flex;
    align-items: center;
    margin-left: 16px;
    cursor: pointer;
    
    .user-info {
      margin-left: 12px;
      
      .user-name {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 2px 0;
        color: #333;
      }
      
      .user-status {
        font-size: 12px;
        color: #999;
        margin: 0;
      }

      .user-meta {
        font-size: 12px;
        color: #666;
        margin: 2px 0 0;
      }
    }
  }
}

.chat-user-card {
  margin: 12px 16px 0;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  
  .card-main {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  
  .card-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    
    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #475569;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(99, 102, 241, 0.08);
      
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #94a3b8;
        
        &.online {
          background: #34d399;
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.7);
        }
      }
    }
  }
  
  .card-info {
    flex: 1;
    
    .name-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
      
      .name {
        font-size: 18px;
        font-weight: 600;
        color: #0f172a;
      }
      
      .compatibility {
        font-size: 13px;
        color: #6366f1;
        background: rgba(99, 102, 241, 0.12);
        padding: 4px 10px;
        border-radius: 12px;
        font-weight: 600;
      }
    }
    
    .meta-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #475569;
      
      .dot {
        opacity: 0.6;
      }
      
      &.occupation {
        margin-top: 2px;
        color: #6366f1;
        font-weight: 500;
      }
    }
  }
  
  .card-bio {
    margin: 12px 0 0;
    font-size: 14px;
    color: #475569;
    line-height: 1.5;
  }
  
  .card-tags {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .tag {
      font-size: 12px;
      color: #6366f1;
      background: rgba(99, 102, 241, 0.12);
      border-radius: 999px;
      padding: 4px 12px;
    }
  }
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  
  .message-item {
    margin-bottom: 16px;
    
    &.is-me {
      text-align: right;
      
      .message-content {
        background: #007bff;
        color: white;
        margin-left: auto;
      }
    }
    
    &:not(.is-me) {
      text-align: left;
      
      .message-content {
        background: white;
        color: #333;
        margin-right: auto;
      }
    }
    
    .message-content {
      display: inline-block;
      max-width: 70%;
      padding: 12px 16px;
      border-radius: 18px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      
      .message-text {
        margin: 0 0 4px 0;
        word-wrap: break-word;
      }
      
      .message-time {
        font-size: 12px;
        opacity: 0.7;
      }
    }
  }
}

.chat-input {
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e5e5;
  
  :deep(.el-input__wrapper) {
    background-color: #f5f5f5;
    box-shadow: 0 0 0 1px #e0e0e0 inset;
    
    .el-input__inner {
      color: #333;
      
      &::placeholder {
        color: #999;
      }
    }
  }
  
  :deep(.el-input-group__append) {
    background-color: #007bff;
    border-color: #007bff;
    
    .el-button {
      color: white;
      border-color: #007bff;
      
      &:hover {
        background-color: #0056b3;
        border-color: #0056b3;
      }
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .chat-detail {
    background: #1a1a1a;
  }
  
  .chat-header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .chat-info .user-info {
      .user-name {
        color: #fff;
      }
      
      .user-status {
        color: #aaa;
      }

      .user-meta {
        color: #bbb;
      }
    }
  }
  
  .chat-user-card {
    background: #2a2a2a;
    border-color: #333;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    
    .card-avatar .status-chip {
      color: #cbd5f5;
      background: rgba(99, 102, 241, 0.2);
    }
    
    .card-info {
      .name-row .name {
        color: #fff;
      }
      
      .meta-row {
        color: #cbd5f5;
      }
    }
    
    .card-bio {
      color: #cbd5f5;
    }
    
    .card-tags .tag {
      background: rgba(99, 102, 241, 0.25);
      color: #dbeafe;
    }
  }
  
  .chat-messages .message-item:not(.is-me) .message-content {
    background: #2a2a2a;
    color: #fff;
  }
  
  .chat-input {
    background: #2a2a2a;
    border-top-color: #333;
    
    :deep(.el-input__wrapper) {
      background-color: #1a1a1a;
      box-shadow: 0 0 0 1px #444 inset;
      
      .el-input__inner {
        color: #fff;
        
        &::placeholder {
          color: #888;
        }
      }
    }
    
    :deep(.el-input-group__append) {
      background-color: #007bff;
      border-color: #007bff;
      
      .el-button {
        color: white;
        border-color: #007bff;
        
        &:hover {
          background-color: #0056b3;
          border-color: #0056b3;
        }
      }
    }
  }
}
</style>
