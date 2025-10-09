<template>
  <div class="chat-group">
    <div class="chat-header">
      <el-button type="text" :icon="ArrowLeft" @click="goBack" />
      <div class="chat-info">
        <el-avatar :src="groupInfo.avatar" :size="32" />
        <div class="group-info">
          <h3 class="group-name">{{ groupInfo.name }}</h3>
          <p class="member-count">{{ groupInfo.memberCount }}人</p>
        </div>
      </div>
      <el-button type="text" :icon="MoreFilled" />
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id" 
        class="message-item"
        :class="{ 'is-me': message.isFromMe }"
      >
        <div v-if="!message.isFromMe" class="sender-avatar">
          <el-avatar :src="message.senderAvatar" :size="24" />
        </div>
        <div class="message-content">
          <div v-if="!message.isFromMe" class="sender-name">{{ message.senderName }}</div>
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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, MoreFilled } from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const router = useRouter()
const route = useRoute()
const messagesContainer = ref<HTMLElement>()
const inputMessage = ref('')

const groupInfo = ref({
  id: route.params.id as string,
  name: '群聊',
  avatar: 'https://via.placeholder.com/32',
  memberCount: 5
})

const messages = ref([
  {
    id: '1',
    content: '大家好！',
    timestamp: Date.now() - 1000,
    isFromMe: false,
    senderName: '张三',
    senderAvatar: 'https://via.placeholder.com/24'
  },
  {
    id: '2',
    content: '你好！',
    timestamp: Date.now() - 500,
    isFromMe: true,
    senderName: '',
    senderAvatar: ''
  }
])

const formatTime = (timestamp: number) => {
  return formatDistanceToNow(new Date(timestamp), { 
    addSuffix: true, 
    locale: zhCN 
  })
}

const sendMessage = () => {
  if (inputMessage.value.trim()) {
    const message = {
      id: Date.now().toString(),
      content: inputMessage.value,
      timestamp: Date.now(),
      isFromMe: true,
      senderName: '',
      senderAvatar: ''
    }
    messages.value.push(message)
    inputMessage.value = ''
    
    nextTick(() => {
      scrollToBottom()
    })
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

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped lang="scss">
.chat-group {
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
    
    .group-info {
      margin-left: 12px;
      
      .group-name {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 2px 0;
        color: #333;
      }
      
      .member-count {
        font-size: 12px;
        color: #999;
        margin: 0;
      }
    }
  }
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  
  .message-item {
    display: flex;
    margin-bottom: 16px;
    
    &.is-me {
      flex-direction: row-reverse;
      
      .message-content {
        background: #007bff;
        color: white;
        margin-right: 12px;
      }
    }
    
    &:not(.is-me) {
      .message-content {
        background: white;
        color: #333;
        margin-left: 12px;
      }
    }
    
    .sender-avatar {
      flex-shrink: 0;
    }
    
    .message-content {
      max-width: 70%;
      padding: 12px 16px;
      border-radius: 18px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      
      .sender-name {
        font-size: 12px;
        color: #666;
        margin: 0 0 4px 0;
      }
      
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
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .chat-group {
    background: #1a1a1a;
  }
  
  .chat-header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .chat-info .group-info {
      .group-name {
        color: #fff;
      }
      
      .member-count {
        color: #aaa;
      }
    }
  }
  
  .chat-messages .message-item:not(.is-me) .message-content {
    background: #2a2a2a;
    color: #fff;
    
    .sender-name {
      color: #aaa;
    }
  }
  
  .chat-input {
    background: #2a2a2a;
    border-top-color: #333;
  }
}
</style>
