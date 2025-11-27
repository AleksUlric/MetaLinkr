<template>
  <div class="live-room">
    <div class="live-container">
      <div class="live-video">
        <div class="video-placeholder">
          <el-icon size="80" color="#ccc">
            <VideoCamera />
          </el-icon>
          <p>直播画面</p>
        </div>
      </div>
      
      <div class="live-info">
        <div class="streamer-info">
          <el-avatar :src="streamer.avatar" :size="40" />
          <div class="streamer-details">
            <h3 class="streamer-name">{{ streamer.name }}</h3>
            <p class="streamer-title">{{ streamer.title }}</p>
          </div>
        </div>
        
        <div class="live-stats">
          <span class="viewer-count">{{ streamer.viewerCount }}人观看</span>
          <span class="like-count">{{ streamer.likeCount }}点赞</span>
        </div>
      </div>
      
      <div class="live-chat">
        <div class="chat-messages">
          <div 
            v-for="message in chatMessages" 
            :key="message.id" 
            class="chat-message"
          >
            <span class="username">{{ message.username }}:</span>
            <span class="message-content">{{ message.content }}</span>
          </div>
        </div>
        
        <div class="chat-input">
          <el-input
            v-model="inputMessage"
            placeholder="说点什么..."
            @keyup.enter="sendMessage"
          >
            <template #append>
              <el-button type="primary" @click="sendMessage">发送</el-button>
            </template>
          </el-input>
        </div>
      </div>
      
      <div class="live-controls">
        <el-button 
          type="danger"
          :icon="Star"
          circle
          size="large"
          @click="likeStreamer"
        />
        <el-button 
          type="primary"
          :icon="Share"
          circle
          size="large"
          @click="shareLive"
        />
        <el-button 
          type="success"
          :icon="Present"
          circle
          size="large"
          @click="sendPresent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { VideoCamera, Star, Share, Present } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const inputMessage = ref('')

const streamer = ref({
  id: route.params.id as string,
  name: '主播',
  title: '直播标题',
  avatar: 'https://via.placeholder.com/40',
  viewerCount: 1234,
  likeCount: 5678
})

const chatMessages = ref([
  {
    id: '1',
    username: '用户1',
    content: '主播好！'
  },
  {
    id: '2',
    username: '用户2',
    content: '666'
  },
  {
    id: '3',
    username: '用户3',
    content: '太棒了！'
  }
])

// 初始化数据
onMounted(() => {
  console.log('直播间ID:', streamer.value.id)
})

const sendMessage = () => {
  if (inputMessage.value.trim()) {
    const message = {
      id: Date.now().toString(),
      username: '我',
      content: inputMessage.value
    }
    chatMessages.value.push(message)
    inputMessage.value = ''
  }
}

const likeStreamer = () => {
  streamer.value.likeCount++
}

const shareLive = () => {
  console.log('分享直播')
}

const sendPresent = () => {
  console.log('发送礼物')
}
</script>

<style scoped lang="scss">
.live-room {
  height: 100vh;
  background: #000;
  position: relative;
  overflow: hidden;
}

.live-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.live-video {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .video-placeholder {
    text-align: center;
    color: #ccc;
    
    p {
      margin-top: 16px;
      font-size: 16px;
    }
  }
}

.live-info {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0,0,0,0.7);
  padding: 12px 16px;
  border-radius: 8px;
  color: white;
  
  .streamer-info {
    display: flex;
    align-items: center;
    
    .streamer-details {
      margin-left: 12px;
      
      .streamer-name {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 2px 0;
      }
      
      .streamer-title {
        font-size: 14px;
        opacity: 0.8;
        margin: 0;
      }
    }
  }
  
  .live-stats {
    display: flex;
    gap: 16px;
    
    .viewer-count, .like-count {
      font-size: 14px;
      opacity: 0.8;
    }
  }
}

.live-chat {
  position: absolute;
  bottom: 80px;
  right: 20px;
  width: 300px;
  background: rgba(0,0,0,0.7);
  border-radius: 8px;
  overflow: hidden;
  
  .chat-messages {
    height: 200px;
    padding: 12px;
    overflow-y: auto;
    
    .chat-message {
      margin-bottom: 8px;
      font-size: 14px;
      color: white;
      
      .username {
        color: #ff6b6b;
        margin-right: 4px;
      }
      
      .message-content {
        color: #fff;
      }
    }
  }
  
  .chat-input {
    padding: 12px;
    border-top: 1px solid rgba(255,255,255,0.2);
  }
}

.live-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  
  .el-button {
    width: 50px;
    height: 50px;
  }
}
</style>
