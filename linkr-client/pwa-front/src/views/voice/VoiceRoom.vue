<template>
  <div class="voice-room">
    <div class="room-header">
      <el-button type="text" :icon="ArrowLeft" @click="leaveRoom" />
      <div class="room-info">
        <h2 class="room-name">{{ roomInfo.name }}</h2>
        <p class="room-description">{{ roomInfo.description }}</p>
      </div>
      <el-button type="text" :icon="MoreFilled" />
    </div>
    
    <div class="room-content">
      <div class="members-grid">
        <div 
          v-for="member in members" 
          :key="member.id" 
          class="member-card"
          :class="{ 
            'is-speaking': member.isSpeaking,
            'is-muted': member.isMuted,
            'is-host': member.isHost
          }"
        >
          <el-avatar :src="member.avatar" :size="60" />
          <div class="member-info">
            <h3 class="member-name">{{ member.name }}</h3>
            <div class="member-status">
              <el-icon v-if="member.isSpeaking" color="#52c41a">
                <Microphone />
              </el-icon>
              <el-icon v-if="member.isMuted" color="#ff6b6b">
                <Mute />
              </el-icon>
              <span v-if="member.isHost" class="host-badge">房主</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="room-controls">
      <el-button 
        :type="isMuted ? 'danger' : 'primary'"
        :icon="isMuted ? 'Mute' : 'Microphone'"
        circle
        size="large"
        @click="toggleMute"
      />
      <el-button 
        type="danger"
        :icon="Close"
        circle
        size="large"
        @click="leaveRoom"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, MoreFilled, Microphone, Mute, Close } from '@element-plus/icons-vue'
import { useVoiceStore } from '@/stores/voice'

const router = useRouter()
const route = useRoute()
const voiceStore = useVoiceStore()

const roomInfo = ref({
  id: route.params.id as string,
  name: '语音房间',
  description: '欢迎来到语音房间'
})

const members = ref([
  {
    id: '1',
    name: '房主',
    avatar: 'https://via.placeholder.com/60',
    isHost: true,
    isSpeaking: false,
    isMuted: false
  },
  {
    id: '2',
    name: '用户1',
    avatar: 'https://via.placeholder.com/60',
    isHost: false,
    isSpeaking: true,
    isMuted: false
  },
  {
    id: '3',
    name: '用户2',
    avatar: 'https://via.placeholder.com/60',
    isHost: false,
    isSpeaking: false,
    isMuted: true
  }
])

const isMuted = ref(false)

// 初始化数据
onMounted(async () => {
  await voiceStore.joinVoiceRoom(roomInfo.value.id)
})

const toggleMute = () => {
  isMuted.value = !isMuted.value
  voiceStore.toggleMute()
}

const leaveRoom = () => {
  voiceStore.leaveVoiceRoom()
  router.back()
}
</script>

<style scoped lang="scss">
.voice-room {
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.room-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  
  .room-info {
    flex: 1;
    margin-left: 16px;
    
    .room-name {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #333;
    }
    
    .room-description {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }
}

.room-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.member-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;
  
  &.is-speaking {
    border: 2px solid #52c41a;
    box-shadow: 0 0 10px rgba(82, 196, 26, 0.3);
  }
  
  &.is-muted {
    opacity: 0.6;
  }
  
  &.is-host {
    border: 2px solid #ff6b6b;
  }
  
  .member-info {
    margin-top: 12px;
    
    .member-name {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #333;
    }
    
    .member-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      
      .host-badge {
        background: #ff6b6b;
        color: white;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 10px;
      }
    }
  }
}

.room-controls {
  padding: 20px;
  display: flex;
  justify-content: center;
  gap: 24px;
  background: white;
  border-top: 1px solid #e5e5e5;
  
  .el-button {
    width: 60px;
    height: 60px;
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .voice-room {
    background: #1a1a1a;
  }
  
  .room-header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .room-info {
      .room-name {
        color: #fff;
      }
      
      .room-description {
        color: #aaa;
      }
    }
  }
  
  .member-card {
    background: #2a2a2a;
    
    .member-info .member-name {
      color: #fff;
    }
  }
  
  .room-controls {
    background: #2a2a2a;
    border-top-color: #333;
  }
}
</style>
