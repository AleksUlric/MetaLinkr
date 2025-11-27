<template>
  <div class="voice-party-page">
    <!-- 语音派对房间 -->
    <div class="party-room">
      <!-- 房间信息 -->
      <div class="room-header">
        <div class="room-info">
          <div class="room-title">{{ roomInfo.title }}</div>
          <div class="room-desc">{{ roomInfo.description }}</div>
          <div class="room-stats">
            <span class="stat-item">
              <el-icon><User /></el-icon>
              {{ roomInfo.memberCount }}人在线
            </span>
            <span class="stat-item">
              <el-icon><Microphone /></el-icon>
              {{ roomInfo.speakingCount }}人发言
            </span>
          </div>
        </div>
        <div class="room-actions">
          <div class="action-btn share-btn" @click="shareRoom">
            <el-icon><Share /></el-icon>
          </div>
          <div class="action-btn exit-btn" @click="exitRoom">
            <el-icon><Close /></el-icon>
          </div>
        </div>
      </div>
      
      <!-- 成员列表 -->
      <div class="members-section">
        <div class="section-title">房间成员</div>
        <div class="members-grid">
          <div 
            v-for="member in members" 
            :key="member.id"
            class="member-card"
            :class="{ 
              'speaking': member.isSpeaking, 
              'host': member.isHost,
              'muted': member.isMuted 
            }"
            @click="toggleMemberMute(member)"
          >
            <div class="member-avatar">
              <img :src="member.avatar" :alt="member.name" />
              <div class="member-status">
                <div v-if="member.isSpeaking" class="speaking-indicator"></div>
                <div v-if="member.isHost" class="host-badge">房主</div>
              </div>
            </div>
            <div class="member-info">
              <div class="member-name">{{ member.name }}</div>
              <div class="member-level">Lv.{{ member.level }}</div>
            </div>
            <div class="member-controls">
              <div class="control-btn" @click.stop="toggleMemberMute(member)">
                <el-icon :class="{ muted: member.isMuted }">
                  <Microphone />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 聊天区域 -->
      <div class="chat-section">
        <div class="section-title">聊天记录</div>
        <div class="chat-messages" ref="chatMessages">
          <div 
            v-for="message in messages" 
            :key="message.id"
            class="message-item"
            :class="{ 'system': message.type === 'system' }"
          >
            <div v-if="message.type !== 'system'" class="message-avatar">
              <img :src="message.avatar" :alt="message.name" />
            </div>
            <div class="message-content">
              <div v-if="message.type !== 'system'" class="message-header">
                <span class="message-name">{{ message.name }}</span>
                <span class="message-time">{{ message.time }}</span>
              </div>
              <div class="message-text">{{ message.text }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 输入区域 -->
      <div class="input-section">
        <div class="input-container">
          <el-input
            v-model="newMessage"
            placeholder="说点什么..."
            @keyup.enter="sendMessage"
            :disabled="!isJoined"
          >
            <template #append>
              <el-button 
                @click="sendMessage" 
                :disabled="!newMessage.trim() || !isJoined"
                type="primary"
              >
                发送
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
      
      <!-- 语音控制 -->
      <div class="voice-controls">
        <div class="control-btn mute-btn" @click="toggleMute">
          <el-icon :class="{ muted: isMuted }"><Microphone /></el-icon>
          <span>{{ isMuted ? '取消静音' : '静音' }}</span>
        </div>
        <div class="control-btn speaker-btn" @click="toggleSpeaker">
          <el-icon><VideoPlay /></el-icon>
          <span>{{ isSpeakerOn ? '关闭扬声器' : '开启扬声器' }}</span>
        </div>
        <div class="control-btn join-btn" @click="toggleJoin">
          <el-icon><Microphone /></el-icon>
          <span>{{ isJoined ? '离开语音' : '加入语音' }}</span>
        </div>
      </div>
      
      <!-- 语音可视化 -->
      <div v-if="isJoined" class="voice-visualizer">
        <div class="visualizer-title">语音活动</div>
        <div class="visualizer-bars">
          <div 
            v-for="i in 15" 
            :key="i"
            class="bar"
            :style="{ height: Math.random() * 40 + 20 + 'px' }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- 房间设置弹窗 -->
    <div v-if="showSettings" class="settings-modal">
      <div class="modal-background" @click="showSettings = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>房间设置</h3>
          <div class="close-btn" @click="showSettings = false">
            <el-icon><Close /></el-icon>
          </div>
        </div>
        <div class="modal-body">
          <div class="setting-item">
            <label>房间名称</label>
            <el-input v-model="roomInfo.title" placeholder="输入房间名称" />
          </div>
          <div class="setting-item">
            <label>房间描述</label>
            <el-input 
              v-model="roomInfo.description" 
              type="textarea" 
              placeholder="输入房间描述"
              :rows="3"
            />
          </div>
          <div class="setting-item">
            <label>最大人数</label>
            <el-select v-model="roomInfo.maxMembers" placeholder="选择最大人数">
              <el-option label="10人" :value="10" />
              <el-option label="20人" :value="20" />
              <el-option label="50人" :value="50" />
            </el-select>
          </div>
        </div>
        <div class="modal-footer">
          <el-button @click="showSettings = false">取消</el-button>
          <el-button type="primary" @click="saveSettings">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  User, 
  Microphone, 
  Share, 
  Close, 
  VideoPlay 
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 响应式数据
const isJoined = ref(false)
const isMuted = ref(false)
const isSpeakerOn = ref(true)
const newMessage = ref('')
const showSettings = ref(false)
const chatMessages = ref<HTMLElement>()

// 房间信息
const roomInfo = ref({
  title: '深夜聊天室',
  description: '欢迎来到深夜聊天室，让我们一起聊聊生活',
  memberCount: 8,
  speakingCount: 3,
  maxMembers: 20
})

// 成员列表
const members = ref([
  {
    id: 1,
    name: '小雨',
    avatar: 'https://picsum.photos/200/200?random=1',
    level: 15,
    isSpeaking: true,
    isHost: true,
    isMuted: false
  },
  {
    id: 2,
    name: '阳光',
    avatar: 'https://picsum.photos/200/200?random=2',
    level: 12,
    isSpeaking: false,
    isHost: false,
    isMuted: false
  },
  {
    id: 3,
    name: '星辰',
    avatar: 'https://picsum.photos/200/200?random=3',
    level: 8,
    isSpeaking: true,
    isHost: false,
    isMuted: false
  },
  {
    id: 4,
    name: '月光',
    avatar: 'https://picsum.photos/200/200?random=4',
    level: 20,
    isSpeaking: false,
    isHost: false,
    isMuted: true
  }
])

// 聊天消息
const messages = ref([
  {
    id: 1,
    type: 'system',
    text: '欢迎来到深夜聊天室！',
    time: '20:30'
  },
  {
    id: 2,
    type: 'user',
    name: '小雨',
    avatar: 'https://picsum.photos/200/200?random=1',
    text: '大家好，我是房主小雨',
    time: '20:31'
  },
  {
    id: 3,
    type: 'user',
    name: '阳光',
    avatar: 'https://picsum.photos/200/200?random=2',
    text: '晚上好！',
    time: '20:32'
  },
  {
    id: 4,
    type: 'user',
    name: '星辰',
    avatar: 'https://picsum.photos/200/200?random=3',
    text: '今天天气不错呢',
    time: '20:33'
  }
])

// 方法
const toggleMute = () => {
  isMuted.value = !isMuted.value
  ElMessage.info(isMuted.value ? '已静音' : '已取消静音')
}

const toggleSpeaker = () => {
  isSpeakerOn.value = !isSpeakerOn.value
  ElMessage.info(isSpeakerOn.value ? '已开启扬声器' : '已关闭扬声器')
}

const toggleJoin = () => {
  isJoined.value = !isJoined.value
  if (isJoined.value) {
    roomInfo.value.memberCount++
    roomInfo.value.speakingCount++
    ElMessage.success('已加入语音')
  } else {
    roomInfo.value.memberCount--
    roomInfo.value.speakingCount--
    ElMessage.info('已离开语音')
  }
}

const toggleMemberMute = (member: any) => {
  member.isMuted = !member.isMuted
  if (member.isMuted) {
    member.isSpeaking = false
    roomInfo.value.speakingCount--
  } else {
    roomInfo.value.speakingCount++
  }
  ElMessage.info(`${member.name} ${member.isMuted ? '已静音' : '已取消静音'}`)
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !isJoined.value) return
  
  const message = {
    id: Date.now(),
    type: 'user',
    name: '我',
    avatar: 'https://picsum.photos/200/200?random=5',
    text: newMessage.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  messages.value.push(message)
  newMessage.value = ''
  
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight
    }
  })
}

const shareRoom = () => {
  ElMessage.success('房间链接已复制到剪贴板')
}

const exitRoom = () => {
  ElMessage.info('已退出房间')
  router.back()
}

const saveSettings = () => {
  showSettings.value = false
  ElMessage.success('设置已保存')
}

// 生命周期
onMounted(() => {
  // 模拟自动滚动到最新消息
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight
    }
  })
})
</script>

<style lang="scss" scoped>
.voice-party-page {
  background: linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.party-room {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  
  .room-info {
    .room-title {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
    }
    
    .room-desc {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 12px;
    }
    
    .room-stats {
      display: flex;
      gap: 16px;
      
      .stat-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #64748b;
        
        .el-icon {
          font-size: 14px;
        }
      }
    }
  }
  
  .room-actions {
    display: flex;
    gap: 8px;
    
    .action-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.share-btn {
        background: rgba(255, 255, 255, 0.8);
        color: #64748b;
        border: 1px solid rgba(196, 181, 253, 0.2);
        
        &:hover {
          background: rgba(255, 255, 255, 0.9);
          color: #475569;
        }
      }
      
      &.exit-btn {
        background: #ef4444;
        color: white;
        
        &:hover {
          background: #dc2626;
        }
      }
    }
  }
}

.members-section {
  margin-bottom: 20px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 12px;
  }
  
  .members-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    
    .member-card {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(196, 181, 253, 0.2);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
      }
      
      &.speaking {
        border-color: #10b981;
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
      }
      
      &.muted {
        opacity: 0.6;
      }
      
      .member-avatar {
        position: relative;
        margin-bottom: 8px;
        
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .member-status {
          position: absolute;
          top: -2px;
          right: -2px;
          
          .speaking-indicator {
            width: 16px;
            height: 16px;
            background: #10b981;
            border-radius: 50%;
            border: 2px solid white;
            animation: pulse 2s infinite;
          }
          
          .host-badge {
            background: #8b5cf6;
            color: white;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 8px;
            border: 2px solid white;
          }
        }
      }
      
      .member-info {
        text-align: center;
        
        .member-name {
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2px;
        }
        
        .member-level {
          font-size: 10px;
          color: #64748b;
        }
      }
      
      .member-controls {
        display: flex;
        justify-content: center;
        margin-top: 8px;
        
        .control-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          
          .el-icon {
            font-size: 12px;
            color: #64748b;
            
            &.muted {
              color: #ef4444;
            }
          }
          
          &:hover {
            background: #e2e8f0;
          }
        }
      }
    }
  }
}

.chat-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 12px;
  }
  
  .chat-messages {
    flex: 1;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    padding: 16px;
    overflow-y: auto;
    max-height: 200px;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(196, 181, 253, 0.2);
    
    .message-item {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      
      &.system {
        justify-content: center;
        
        .message-content {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 12px;
        }
      }
      
      .message-avatar {
        img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      
      .message-content {
        flex: 1;
        
        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          
          .message-name {
            font-size: 12px;
            font-weight: 600;
            color: #1e293b;
          }
          
          .message-time {
            font-size: 10px;
            color: #64748b;
          }
        }
        
        .message-text {
          font-size: 14px;
          color: #334155;
          line-height: 1.4;
        }
      }
    }
  }
}

.input-section {
  margin-bottom: 20px;
  
  .input-container {
    .el-input {
      border-radius: 12px;
      
      :deep(.el-input__wrapper) {
        border-radius: 12px;
        border: 1px solid rgba(196, 181, 253, 0.2);
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px);
      }
      
      :deep(.el-input__inner) {
        border: none;
        background: transparent;
      }
    }
  }
}

.voice-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  
  .control-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(196, 181, 253, 0.2);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    }
    
    .el-icon {
      font-size: 20px;
      color: #64748b;
      
      &.muted {
        color: #ef4444;
      }
    }
    
    span {
      font-size: 12px;
      color: #64748b;
      text-align: center;
    }
    
    &.join-btn {
      background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
      color: white;
      border: none;
      
      .el-icon {
        color: white;
      }
      
      span {
        color: white;
      }
    }
  }
}

.voice-visualizer {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(196, 181, 253, 0.2);
  
  .visualizer-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 12px;
    text-align: center;
  }
  
  .visualizer-bars {
    display: flex;
    align-items: end;
    justify-content: center;
    gap: 2px;
    height: 60px;
    
    .bar {
      width: 3px;
      background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
      border-radius: 2px;
      animation: visualizer 1s ease-in-out infinite;
      
      &:nth-child(odd) {
        animation-delay: 0.1s;
      }
      
      &:nth-child(even) {
        animation-delay: 0.2s;
      }
    }
  }
}

.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .modal-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  }
  
  .modal-content {
    position: relative;
    background: white;
    border-radius: 16px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h3 {
        font-size: 18px;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
      }
      
      .close-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: #e2e8f0;
        }
      }
    }
    
    .modal-body {
      .setting-item {
        margin-bottom: 16px;
        
        label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }
      }
    }
    
    .modal-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

@keyframes visualizer {
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .party-room {
    padding: 16px;
  }
  
  .room-header {
    .room-info {
      .room-title {
        font-size: 20px;
      }
    }
  }
  
  .members-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
    
    .member-card {
      padding: 8px;
      
      .member-avatar {
        img {
          width: 40px;
          height: 40px;
        }
      }
    }
  }
  
  .voice-controls {
    gap: 8px;
    
    .control-btn {
      padding: 12px;
      
      .el-icon {
        font-size: 18px;
      }
      
      span {
        font-size: 11px;
      }
    }
  }
}
</style>