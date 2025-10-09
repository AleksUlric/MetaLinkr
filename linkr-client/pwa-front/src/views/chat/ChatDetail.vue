<template>
  <div class="chat-detail">
    <div class="chat-header">
      <el-button type="text" :icon="ArrowLeft" @click="goBack" />
      <div class="chat-info">
        <el-avatar :src="chatUser.avatar" :size="32" />
        <div class="user-info">
          <h3 class="user-name">{{ chatUser.name }}</h3>
          <p class="user-status">{{ chatUser.isOnline ? '在线' : '离线' }}</p>
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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, MoreFilled } from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const router = useRouter()
const route = useRoute()
const messagesContainer = ref<HTMLElement>()
const inputMessage = ref('')

const chatUser = ref({
  id: route.params.id as string,
  name: '用户',
  avatar: 'https://via.placeholder.com/32',
  isOnline: true
})

const messages = ref([
  {
    id: '1',
    content: '你好！',
    timestamp: Date.now() - 1000,
    isFromMe: false
  },
  {
    id: '2',
    content: '你好，很高兴认识你！',
    timestamp: Date.now() - 500,
    isFromMe: true
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
      isFromMe: true
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
    }
  }
  
  .chat-messages .message-item:not(.is-me) .message-content {
    background: #2a2a2a;
    color: #fff;
  }
  
  .chat-input {
    background: #2a2a2a;
    border-top-color: #333;
  }
}
</style>
