<template>
  <div class="voice-match-page">
    <!-- 语音匹配界面 -->
    <div class="match-container">
      <!-- 匹配状态 -->
      <div class="match-status">
        <div class="status-icon">
          <div class="pulse-animation"></div>
          <el-icon class="microphone-icon"><Microphone /></el-icon>
        </div>
        <div class="status-text">{{ statusText }}</div>
        <div class="status-subtitle">{{ statusSubtitle }}</div>
      </div>
      
      <!-- 匹配进度 -->
      <div class="match-progress">
        <div class="progress-circle">
          <div class="progress-text">{{ matchProgress }}%</div>
        </div>
        <div class="progress-info">
          <div class="info-item">
            <span class="label">已匹配:</span>
            <span class="value">{{ matchedCount }}人</span>
          </div>
          <div class="info-item">
            <span class="label">等待时间:</span>
            <span class="value">{{ waitTime }}s</span>
          </div>
        </div>
      </div>
      
      <!-- 匹配到的用户信息 -->
      <div v-if="matchedUser" class="matched-user">
        <div class="user-avatar">
          <img :src="matchedUser.avatar" :alt="matchedUser.name" />
          <div class="online-indicator"></div>
        </div>
        <div class="user-info">
          <div class="user-name">{{ matchedUser.name }}</div>
          <div class="user-age">{{ matchedUser.age }}岁</div>
          <div class="user-location">
            <el-icon><Location /></el-icon>
            <span>{{ matchedUser.location }}</span>
          </div>
        </div>
        <div class="match-score">
          <div class="score-text">{{ matchedUser.matchScore }}%</div>
          <div class="score-label">匹配度</div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <div class="action-btn cancel-btn" @click="cancelMatch">
          <el-icon><Close /></el-icon>
          <span>取消</span>
        </div>
        
        <div class="action-btn start-btn" @click="startVoiceChat" :disabled="!matchedUser">
          <el-icon><Microphone /></el-icon>
          <span>开始语音</span>
        </div>
      </div>
      
      <!-- 语音聊天界面 -->
      <div v-if="showVoiceChat" class="voice-chat-modal">
        <div class="chat-background" @click="closeVoiceChat"></div>
        <div class="chat-content">
          <div class="chat-header">
            <div class="user-info">
              <div class="user-avatar">
                <img :src="matchedUser.avatar" :alt="matchedUser.name" />
              </div>
              <div class="user-details">
                <div class="user-name">{{ matchedUser.name }}</div>
                <div class="chat-status">正在语音聊天中...</div>
              </div>
            </div>
            <div class="chat-actions">
              <div class="action-btn mute-btn" @click="toggleMute">
                <el-icon><Microphone /></el-icon>
              </div>
              <div class="action-btn close-btn" @click="closeVoiceChat">
                <el-icon><Close /></el-icon>
              </div>
            </div>
          </div>
          
          <div class="voice-visualizer">
            <div class="visualizer-bars">
              <div 
                v-for="i in 20" 
                :key="i"
                class="bar"
                :style="{ height: Math.random() * 60 + 20 + 'px' }"
              ></div>
            </div>
          </div>
          
          <div class="chat-controls">
            <div class="control-btn" @click="toggleMute">
              <el-icon :class="{ muted: isMuted }"><Microphone /></el-icon>
              <span>{{ isMuted ? '取消静音' : '静音' }}</span>
            </div>
            <div class="control-btn" @click="toggleSpeaker">
              <el-icon><VideoPlay /></el-icon>
              <span>{{ isSpeakerOn ? '关闭扬声器' : '开启扬声器' }}</span>
            </div>
          </div>
          
          <div class="chat-timer">
            <div class="timer-text">{{ chatTime }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 匹配历史 -->
    <div class="match-history">
      <div class="history-header">
        <h3>今日匹配</h3>
        <span class="history-count">{{ todayMatches }}人</span>
      </div>
      <div class="history-list">
        <div 
          v-for="match in matchHistory" 
          :key="match.id"
          class="history-item"
          @click="viewMatchHistory(match)"
        >
          <div class="user-avatar">
            <img :src="match.avatar" :alt="match.name" />
          </div>
          <div class="match-info">
            <div class="user-name">{{ match.name }}</div>
            <div class="match-time">{{ match.time }}</div>
          </div>
          <div class="match-duration">{{ match.duration }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Microphone, 
  Location, 
  Close, 
  VideoPlay 
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const statusText = ref('正在寻找匹配...')
const statusSubtitle = ref('请保持安静，系统正在为您匹配')
const matchProgress = ref(0)
const matchedCount = ref(0)
const waitTime = ref(0)
const matchedUser = ref<any>(null)
const showVoiceChat = ref(false)
const isMuted = ref(false)
const isSpeakerOn = ref(true)
const chatTime = ref('00:00')
const todayMatches = ref(5)

// 匹配历史数据
const matchHistory = ref([
  {
    id: 1,
    name: '小雨',
    avatar: 'https://picsum.photos/200/200?random=1',
    time: '2小时前',
    duration: '3分45秒'
  },
  {
    id: 2,
    name: '阳光',
    avatar: 'https://picsum.photos/200/200?random=2',
    time: '4小时前',
    duration: '1分20秒'
  },
  {
    id: 3,
    name: '星辰',
    avatar: 'https://picsum.photos/200/200?random=3',
    time: '6小时前',
    duration: '5分12秒'
  }
])

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    name: '小雨',
    age: 24,
    location: '杭州市',
    avatar: 'https://picsum.photos/200/200?random=1',
    matchScore: 85
  },
  {
    id: 2,
    name: '阳光',
    age: 26,
    location: '杭州市',
    avatar: 'https://picsum.photos/200/200?random=2',
    matchScore: 92
  },
  {
    id: 3,
    name: '星辰',
    age: 23,
    location: '杭州市',
    avatar: 'https://picsum.photos/200/200?random=3',
    matchScore: 78
  }
]

let progressInterval: any = null
let waitTimer: any = null
let chatTimer: any = null
let chatSeconds = 0

// 方法
const startMatching = () => {
  statusText.value = '正在寻找匹配...'
  statusSubtitle.value = '请保持安静，系统正在为您匹配'
  matchProgress.value = 0
  waitTime.value = 0
  matchedUser.value = null
  
  // 模拟匹配进度
  progressInterval = setInterval(() => {
    matchProgress.value += Math.random() * 10
    if (matchProgress.value >= 100) {
      matchProgress.value = 100
      findMatch()
    }
  }, 500)
  
  // 等待时间计时器
  waitTimer = setInterval(() => {
    waitTime.value++
  }, 1000)
}

const findMatch = () => {
  clearInterval(progressInterval)
  clearInterval(waitTimer)
  
  statusText.value = '找到匹配！'
  statusSubtitle.value = '正在连接语音...'
  
  setTimeout(() => {
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    matchedUser.value = randomUser
    matchedCount.value++
    statusText.value = '匹配成功！'
    statusSubtitle.value = '可以开始语音聊天了'
  }, 1000)
}

const cancelMatch = () => {
  clearInterval(progressInterval)
  clearInterval(waitTimer)
  ElMessage.info('已取消匹配')
  router.back()
}

const startVoiceChat = () => {
  if (!matchedUser.value) return
  
  showVoiceChat.value = true
  startChatTimer()
  ElMessage.success('开始语音聊天')
}

const closeVoiceChat = () => {
  showVoiceChat.value = false
  clearInterval(chatTimer)
  chatSeconds = 0
  chatTime.value = '00:00'
  ElMessage.info('语音聊天已结束')
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  ElMessage.info(isMuted.value ? '已静音' : '已取消静音')
}

const toggleSpeaker = () => {
  isSpeakerOn.value = !isSpeakerOn.value
  ElMessage.info(isSpeakerOn.value ? '已开启扬声器' : '已关闭扬声器')
}

const startChatTimer = () => {
  chatTimer = setInterval(() => {
    chatSeconds++
    const minutes = Math.floor(chatSeconds / 60)
    const seconds = chatSeconds % 60
    chatTime.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, 1000)
}

const viewMatchHistory = (match: any) => {
  ElMessage.info(`查看与${match.name}的匹配记录`)
}

// 生命周期
onMounted(() => {
  startMatching()
})

onUnmounted(() => {
  clearInterval(progressInterval)
  clearInterval(waitTimer)
  clearInterval(chatTimer)
})
</script>

<style lang="scss" scoped>
.voice-match-page {
  background: linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%);
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.match-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.match-status {
  margin-bottom: 40px;
  
  .status-icon {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
    border-radius: 50%;
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
    
    .pulse-animation {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      background: rgba(139, 92, 246, 0.3);
      animation: pulse 2s infinite;
    }
    
    .microphone-icon {
      font-size: 48px;
      color: white;
      z-index: 2;
    }
  }
  
  .status-text {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
  }
  
  .status-subtitle {
    font-size: 14px;
    color: #64748b;
  }
}

.match-progress {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
  
  .progress-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: conic-gradient(#8b5cf6 0deg, #8b5cf6 var(--progress, 0deg), #e2e8f0 var(--progress, 0deg));
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      background: white;
      border-radius: 50%;
    }
    
    .progress-text {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      z-index: 2;
    }
  }
  
  .progress-info {
    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      
      .label {
        font-size: 14px;
        color: #64748b;
      }
      
      .value {
        font-size: 14px;
        font-weight: 600;
        color: #1e293b;
      }
    }
  }
}

.matched-user {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
  margin-bottom: 40px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(196, 181, 253, 0.2);
  
  .user-avatar {
    position: relative;
    
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .online-indicator {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 16px;
      height: 16px;
      background: #10b981;
      border-radius: 50%;
      border: 3px solid white;
    }
  }
  
  .user-info {
    flex: 1;
    text-align: left;
    
    .user-name {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }
    
    .user-age {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 4px;
    }
    
    .user-location {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #64748b;
    }
  }
  
  .match-score {
    text-align: center;
    
    .score-text {
      font-size: 20px;
      font-weight: 700;
      color: #8b5cf6;
      margin-bottom: 2px;
    }
    
    .score-label {
      font-size: 12px;
      color: #64748b;
    }
  }
}

.action-buttons {
  display: flex;
  gap: 20px;
  
  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 24px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
    font-size: 14px;
    font-weight: 600;
    
    .el-icon {
      font-size: 24px;
    }
    
    &.cancel-btn {
      background: #6b7280;
      box-shadow: 0 4px 16px rgba(107, 114, 128, 0.3);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4);
      }
    }
    
    &.start-btn {
      background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

.voice-chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .chat-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
  }
  
  .chat-content {
    position: relative;
    background: white;
    border-radius: 20px;
    padding: 30px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      
      .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .user-avatar {
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
          }
        }
        
        .user-details {
          .user-name {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 2px;
          }
          
          .chat-status {
            font-size: 12px;
            color: #64748b;
          }
        }
      }
      
      .chat-actions {
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
          
          &.mute-btn {
            background: #f3f4f6;
            color: #6b7280;
            
            &:hover {
              background: #e5e7eb;
            }
          }
          
          &.close-btn {
            background: #ef4444;
            color: white;
            
            &:hover {
              background: #dc2626;
            }
          }
        }
      }
    }
    
    .voice-visualizer {
      margin-bottom: 30px;
      
      .visualizer-bars {
        display: flex;
        align-items: end;
        justify-content: center;
        gap: 2px;
        height: 80px;
        
        .bar {
          width: 4px;
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
    
    .chat-controls {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
      
      .control-btn {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: #e2e8f0;
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
        }
      }
    }
    
    .chat-timer {
      text-align: center;
      
      .timer-text {
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;
      }
    }
  }
}

.match-history {
  margin-top: 40px;
  
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h3 {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
    
    .history-count {
      font-size: 14px;
      color: #64748b;
    }
  }
  
  .history-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .history-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
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
      
      .user-avatar {
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      
      .match-info {
        flex: 1;
        
        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2px;
        }
        
        .match-time {
          font-size: 12px;
          color: #64748b;
        }
      }
      
      .match-duration {
        font-size: 12px;
        color: #8b5cf6;
        font-weight: 600;
      }
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
  .voice-match-page {
    padding: 16px;
  }
  
  .match-status {
    .status-icon {
      width: 100px;
      height: 100px;
      
      .microphone-icon {
        font-size: 40px;
      }
    }
    
    .status-text {
      font-size: 20px;
    }
  }
  
  .match-progress {
    gap: 20px;
    
    .progress-circle {
      width: 80px;
      height: 80px;
      
      .progress-text {
        font-size: 16px;
      }
    }
  }
  
  .matched-user {
    padding: 16px;
    
    .user-avatar {
      img {
        width: 50px;
        height: 50px;
      }
    }
    
    .user-info {
      .user-name {
        font-size: 16px;
      }
    }
  }
  
  .action-buttons {
    gap: 16px;
    
    .action-btn {
      padding: 12px 20px;
      
      .el-icon {
        font-size: 20px;
      }
    }
  }
}
</style>
