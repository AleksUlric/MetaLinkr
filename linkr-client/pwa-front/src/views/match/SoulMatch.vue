<template>
  <div class="soul-match-page">
    <!-- 匹配界面 -->
    <div class="match-container">
      <!-- 用户卡片 -->
      <div class="user-card" v-if="currentUser">
        <div class="card-background">
          <img :src="currentUser.avatar" :alt="currentUser.name" />
        </div>
        
        <div class="card-content">
          <div class="user-info">
            <div class="user-name">{{ currentUser.name }}</div>
            <div class="user-age">{{ currentUser.age }}岁</div>
            <div class="user-location">
              <el-icon><Location /></el-icon>
              <span>{{ currentUser.location }}</span>
            </div>
          </div>
          
          <div class="user-tags">
            <span 
              v-for="tag in currentUser.tags" 
              :key="tag"
              class="tag"
            >{{ tag }}</span>
          </div>
          
          <div class="user-description">
            {{ currentUser.description }}
          </div>
          
          <!-- 兴趣匹配度 -->
          <div class="match-score">
            <div class="score-circle">
              <div class="score-text">{{ matchScore }}%</div>
              <div class="score-label">匹配度</div>
            </div>
            <div class="match-reasons">
              <div 
                v-for="reason in matchReasons" 
                :key="reason"
                class="reason-item"
              >
                <el-icon><Check /></el-icon>
                <span>{{ reason }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <div class="action-btn pass-btn" @click="passUser">
          <el-icon><Close /></el-icon>
          <span>跳过</span>
        </div>
        
        <div class="action-btn super-like-btn" @click="superLike">
          <el-icon><Star /></el-icon>
          <span>超级喜欢</span>
        </div>
        
        <div class="action-btn like-btn" @click="likeUser">
          <el-icon><StarFilled /></el-icon>
          <span>喜欢</span>
        </div>
      </div>
      
      <!-- 匹配成功弹窗 -->
      <div v-if="showMatchSuccess" class="match-success-modal">
        <div class="modal-background" @click="closeMatchSuccess"></div>
        <div class="modal-content">
          <div class="success-animation">
            <div class="heart-animation">💕</div>
            <div class="success-text">匹配成功！</div>
            <div class="success-subtitle">你们互相喜欢了对方</div>
          </div>
          
          <div class="matched-users">
            <div class="user-avatar">
              <img :src="currentUser.avatar" :alt="currentUser.name" />
            </div>
            <div class="heart-icon">💕</div>
            <div class="user-avatar">
              <img :src="userAvatar" :alt="userName" />
            </div>
          </div>
          
          <div class="success-actions">
            <el-button type="primary" size="large" @click="startChat">
              开始聊天
            </el-button>
            <el-button size="large" @click="continueMatching">
              继续匹配
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 匹配统计 -->
    <div class="match-stats">
      <div class="stat-item">
        <div class="stat-number">{{ todayMatches }}</div>
        <div class="stat-label">今日匹配</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ totalLikes }}</div>
        <div class="stat-label">总喜欢数</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ remainingLikes }}</div>
        <div class="stat-label">剩余喜欢</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Location, 
  Check, 
  Close, 
  Star, 
  StarFilled 
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const currentUser = ref<any>(null)
const matchScore = ref(0)
const matchReasons = ref<string[]>([])
const showMatchSuccess = ref(false)
const userAvatar = ref('')
const userName = ref('')
const todayMatches = ref(3)
const totalLikes = ref(156)
const remainingLikes = ref(12)

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    name: '小雨',
    age: 24,
    location: '杭州市',
    avatar: 'https://picsum.photos/300/400?random=1',
    tags: ['摄影', '旅行', '咖啡'],
    description: '喜欢摄影和旅行的文艺青年，希望找到志同道合的朋友一起探索世界。'
  },
  {
    id: 2,
    name: '阳光',
    age: 26,
    location: '杭州市',
    avatar: 'https://picsum.photos/300/400?random=2',
    tags: ['运动', '音乐', '美食'],
    description: '热爱生活的阳光男孩，喜欢运动和音乐，希望能遇到有趣的灵魂。'
  },
  {
    id: 3,
    name: '星辰',
    age: 23,
    location: '杭州市',
    avatar: 'https://picsum.photos/300/400?random=3',
    tags: ['读书', '电影', '绘画'],
    description: '安静内敛的文艺女孩，喜欢读书和绘画，寻找心灵相通的伴侣。'
  }
]

// 方法
const loadNextUser = () => {
  const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
  currentUser.value = randomUser
  matchScore.value = Math.floor(Math.random() * 40) + 60 // 60-100%
  
  // 随机生成匹配原因
  const reasons = [
    '都喜欢摄影',
    '年龄相近',
    '都在杭州',
    '兴趣相似',
    '性格互补'
  ]
  matchReasons.value = reasons.slice(0, Math.floor(Math.random() * 3) + 2)
}

const passUser = () => {
  ElMessage.info('已跳过')
  loadNextUser()
}

const likeUser = () => {
  if (remainingLikes.value <= 0) {
    ElMessage.warning('今日喜欢次数已用完')
    return
  }
  
  remainingLikes.value--
  totalLikes.value++
  
  // 模拟匹配成功
  if (Math.random() > 0.7) {
    showMatchSuccess.value = true
    userAvatar.value = currentUser.value.avatar
    userName.value = currentUser.value.name
    todayMatches.value++
  } else {
    ElMessage.success('已喜欢')
    loadNextUser()
  }
}

const superLike = () => {
  if (remainingLikes.value <= 0) {
    ElMessage.warning('今日喜欢次数已用完')
    return
  }
  
  remainingLikes.value--
  totalLikes.value++
  
  // 超级喜欢匹配成功率更高
  if (Math.random() > 0.5) {
    showMatchSuccess.value = true
    userAvatar.value = currentUser.value.avatar
    userName.value = currentUser.value.name
    todayMatches.value++
  } else {
    ElMessage.success('已超级喜欢')
    loadNextUser()
  }
}

const closeMatchSuccess = () => {
  showMatchSuccess.value = false
}

const startChat = () => {
  showMatchSuccess.value = false
  ElMessage.success('开始聊天')
  router.push('/chat/new')
}

const continueMatching = () => {
  showMatchSuccess.value = false
  loadNextUser()
}

// 生命周期
onMounted(() => {
  loadNextUser()
})
</script>

<style lang="scss" scoped>
.soul-match-page {
  background: linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%);
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.match-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
}

.user-card {
  position: relative;
  width: 100%;
  max-width: 350px;
  height: 600px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
  margin-bottom: 30px;
  
  .card-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        transparent 60%,
        rgba(0, 0, 0, 0.7) 100%
      );
    }
  }
  
  .card-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30px 20px 20px;
    color: white;
    z-index: 2;
    
    .user-info {
      margin-bottom: 16px;
      
      .user-name {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 4px;
      }
      
      .user-age {
        font-size: 18px;
        opacity: 0.9;
        margin-bottom: 8px;
      }
      
      .user-location {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        opacity: 0.8;
      }
    }
    
    .user-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 16px;
      
      .tag {
        background: rgba(255, 255, 255, 0.2);
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
    
    .user-description {
      font-size: 14px;
      line-height: 1.5;
      opacity: 0.9;
      margin-bottom: 20px;
    }
    
    .match-score {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .score-circle {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
        padding: 12px;
        border-radius: 50%;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
        
        .score-text {
          font-size: 18px;
          font-weight: 700;
        }
        
        .score-label {
          font-size: 10px;
          opacity: 0.8;
        }
      }
      
      .match-reasons {
        flex: 1;
        
        .reason-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          margin-bottom: 4px;
          opacity: 0.9;
          
          .el-icon {
            color: #00ff88;
          }
        }
      }
    }
  }
}

.action-buttons {
  display: flex;
  gap: 20px;
  align-items: center;
  
  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
    font-size: 12px;
    font-weight: 600;
    
    .el-icon {
      font-size: 24px;
    }
    
    &.pass-btn {
      background: #6b7280;
      box-shadow: 0 4px 16px rgba(107, 114, 128, 0.3);
      
      &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4);
      }
    }
    
    &.super-like-btn {
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
      
      &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
      }
    }
    
    &.like-btn {
      background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
      box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
      
      &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
      }
    }
  }
}

.match-success-modal {
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
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
  }
  
  .modal-content {
    position: relative;
    background: white;
    border-radius: 20px;
    padding: 40px 30px;
    text-align: center;
    max-width: 350px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    
    .success-animation {
      margin-bottom: 30px;
      
      .heart-animation {
        font-size: 60px;
        animation: bounce 1s infinite;
        margin-bottom: 16px;
      }
      
      .success-text {
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 8px;
      }
      
      .success-subtitle {
        font-size: 14px;
        color: #64748b;
      }
    }
    
    .matched-users {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-bottom: 30px;
      
      .user-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid #8b5cf6;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .heart-icon {
        font-size: 24px;
        animation: pulse 2s infinite;
      }
    }
    
    .success-actions {
      display: flex;
      gap: 12px;
      
      .el-button {
        flex: 1;
        border-radius: 12px;
        font-weight: 600;
      }
    }
  }
}

.match-stats {
  display: flex;
  gap: 30px;
  margin-top: 20px;
  
  .stat-item {
    text-align: center;
    
    .stat-number {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 12px;
      color: #64748b;
    }
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .soul-match-page {
    padding: 16px;
  }
  
  .user-card {
    height: 500px;
    max-width: 300px;
    
    .card-content {
      padding: 20px 16px 16px;
      
      .user-info {
        .user-name {
          font-size: 24px;
        }
        
        .user-age {
          font-size: 16px;
        }
      }
    }
  }
  
  .action-buttons {
    gap: 16px;
    
    .action-btn {
      padding: 12px;
      
      .el-icon {
        font-size: 20px;
      }
    }
  }
  
  .match-stats {
    gap: 20px;
    
    .stat-item {
      .stat-number {
        font-size: 18px;
      }
    }
  }
}
</style>
