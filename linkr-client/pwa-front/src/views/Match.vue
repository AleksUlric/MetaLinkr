<template>
  <div class="modern-match-page">
    <!-- Soul风格的顶部状态栏 -->
    <div class="match-status-bar">
      <div class="status-info">
        <div class="user-avatar-container">
          <el-avatar :src="userAvatarUrl" :size="40" />
          <div class="online-indicator"></div>
        </div>
        <div class="user-stats">
          <span class="stat-item">💎{{ userStore.profile?.points || 1250 }}</span>
          <span class="stat-item">🎯{{ userMatches }}</span>
          <span class="stat-item">Lv.{{ userStore.profile?.level || 5 }}</span>
        </div>
      </div>
      <div class="match-mode-selector">
        <el-button 
          v-for="mode in quickModes" 
          :key="mode.id"
          :type="selectedMode === mode.id ? 'primary' : 'default'"
          size="small"
          @click="selectMode(mode.id)"
        >
          {{ mode.icon }} {{ mode.label }}
        </el-button>
      </div>
    </div>

    <!-- 智能匹配模式 -->
    <div class="match-modes">
      <h3 class="section-title">🎯 智能匹配模式</h3>
      <div class="mode-grid">
        <div 
          v-for="mode in matchModes" 
          :key="mode.id"
          class="mode-card"
          :class="{ 'active': selectedMode === mode.id }"
          @click="selectMode(mode.id)"
        >
          <div class="mode-icon-wrapper">
            <div class="mode-icon">{{ mode.emoji }}</div>
            <div class="mode-glow" v-if="selectedMode === mode.id"></div>
          </div>
          <span class="mode-label">{{ mode.label }}</span>
          <span class="mode-desc">{{ mode.description }}</span>
          <div class="mode-progress" v-if="mode.progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: mode.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ mode.progress }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 匹配条件 -->
    <div class="match-conditions">
      <h3 class="section-title">⚙️ 匹配条件</h3>
      <div class="conditions-list">
        <div class="condition-item">
          <span class="condition-label">• 年龄:</span>
          <span class="condition-value">{{ ageRange[0] }}-{{ ageRange[1] }}岁</span>
        </div>
        <div class="condition-item">
          <span class="condition-label">• 性别:</span>
          <span class="condition-value">{{ getGenderText(genderPreference) }}</span>
        </div>
        <div class="condition-item">
          <span class="condition-label">• 距离:</span>
          <span class="condition-value">{{ distanceRange }}km内</span>
        </div>
        <div class="condition-item">
          <span class="condition-label">• 兴趣:</span>
          <span class="condition-value">{{ selectedInterests.join('、') }}</span>
        </div>
      </div>
    </div>

    <!-- 伊对风格的滑动匹配卡片 -->
    <div v-if="recommendedUsers.length > 0" class="swipe-match-container">
      <div class="match-progress">
        <div class="progress-info">
          <span>今日已匹配 {{ todayMatches }} 人</span>
          <span>剩余推荐 {{ recommendedUsers.length }} 人</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: matchProgress + '%' }"></div>
        </div>
      </div>
      
      <div class="card-stack">
        <div 
          v-for="(user, index) in recommendedUsers.slice(0, 3)" 
          :key="user.id"
          class="swipe-card"
          :class="{ 'top-card': index === 0, 'middle-card': index === 1, 'bottom-card': index === 2 }"
          :style="{ zIndex: 3 - index, transform: getCardTransform(index) }"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div class="card-background">
            <img :src="user.avatar" :alt="user.name" class="card-image" />
            <div class="card-gradient"></div>
          </div>
          
          <div class="card-content">
            <div class="user-header">
              <div class="user-basic-info">
                <h3 class="user-name">{{ user.name }}</h3>
                <span class="user-age">{{ user.age }}岁</span>
                <span class="user-distance">{{ user.distance }}km</span>
              </div>
              <div class="match-score-badge">
                <span>{{ user.matchScore }}%</span>
              </div>
            </div>
            
            <div class="user-bio">
              <p>{{ user.bio }}</p>
            </div>
            
            <div class="user-tags">
              <span 
                v-for="tag in user.personalityTags" 
                :key="tag" 
                class="personality-tag"
              >{{ tag }}</span>
            </div>
            
            <div class="match-reasons" v-if="user.matchReasons">
              <div class="reasons-title">匹配理由</div>
              <div class="reasons-list">
                <div 
                  v-for="reason in user.matchReasons" 
                  :key="reason"
                  class="match-reason"
                >
                  <el-icon><Check /></el-icon>
                  <span>{{ reason }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 滑动提示 -->
          <div class="swipe-hints">
            <div class="swipe-hint left">
              <el-icon><Close /></el-icon>
              <span>跳过</span>
            </div>
            <div class="swipe-hint right">
              <el-icon><Star /></el-icon>
              <span>喜欢</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 底部操作按钮 -->
      <div class="action-buttons">
        <el-button 
          circle 
          size="large" 
          @click="passCurrentUser" 
          class="pass-action"
        >
          <el-icon><Close /></el-icon>
        </el-button>
        <el-button 
          circle 
          size="large" 
          @click="likeCurrentUser" 
          class="like-action"
        >
          <el-icon><Star /></el-icon>
        </el-button>
        <el-button 
          circle 
          size="large" 
          @click="superLikeCurrentUser" 
          class="super-like-action"
        >
          <el-icon><StarFilled /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 开始智能匹配 -->
    <div class="start-matching">
      <el-button 
        type="primary" 
        size="large" 
        class="match-btn"
        :loading="isMatching"
        @click="startMatching"
      >
        <el-icon><Connection /></el-icon>
        🚀 开始智能匹配
      </el-button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import { getUserAvatarUrl } from '@/utils/avatar'
import { Connection, Close, Star, StarFilled, Check } from '@element-plus/icons-vue'

const userStore = useUserStore()

// 计算用户头像URL（自动处理 OSS 默认头像转换）
const userAvatarUrl = computed(() => {
  const profile = userStore.profile as any
  return getUserAvatarUrl(profile?.avatar, profile?.gender || 'male')
})

// 响应式数据
const selectedMode = ref('appearance')
const ageRange = ref([20, 30])
const genderPreference = ref('all')
const distanceRange = ref(10)
const selectedInterests = ref(['音乐', '电影', '旅行'])
const isMatching = ref(false)
const recommendedUsers = ref<any[]>([])
const todayMatches = ref(12)
const matchProgress = ref(60)

// 触摸滑动相关
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchCurrentX = ref(0)
const touchCurrentY = ref(0)
const isDragging = ref(false)
const dragDirection = ref('')

// 快速匹配模式
const quickModes = ref([
  { id: 'appearance', label: '颜值', icon: '💕' },
  { id: 'interest', label: '兴趣', icon: '🎯' },
  { id: 'personality', label: '性格', icon: '🧠' },
  { id: 'voice', label: '语音', icon: '🎤' }
])

// 计算属性
const userMatches = computed(() => (userStore.profile as any)?.matches || 23)

// 智能匹配模式 - 参考伊对的匹配算法
const matchModes = ref([
  { 
    id: 'appearance', 
    label: '颜值匹配', 
    emoji: '💕',
    description: '基于外貌特征的智能匹配',
    progress: 85
  },
  { 
    id: 'interest', 
    label: '兴趣匹配', 
    emoji: '🎯',
    description: '共同兴趣爱好深度匹配',
    progress: 92
  },
  { 
    id: 'personality', 
    label: '性格匹配', 
    emoji: '🧠',
    description: '性格互补度智能分析',
    progress: 78
  },
  { 
    id: 'voice', 
    label: '语音匹配', 
    emoji: '🎤',
    description: '声音魅力值匹配',
    progress: 65
  },
  { 
    id: 'lifestyle', 
    label: '生活方式', 
    emoji: '🏠',
    description: '生活习惯和价值观匹配',
    progress: 88
  },
  { 
    id: 'location', 
    label: '地理位置', 
    emoji: '📍',
    description: '基于位置的智能推荐',
    progress: 95
  }
])

// 模拟推荐用户数据
const mockUsers = [
  {
    id: 1,
    name: '小美',
    age: 25,
    distance: 2.5,
    avatar: 'https://picsum.photos/100/100?random=1',
    matchScore: 85,
    commonInterests: ['音乐', '电影'],
    personalityTags: ['文艺青年', '夜猫子'],
    bio: '寻找志同道合的人，一起分享生活的美好'
  },
  {
    id: 2,
    name: '阿强',
    age: 28,
    distance: 1.8,
    avatar: 'https://picsum.photos/100/100?random=2',
    matchScore: 78,
    commonInterests: ['运动', '旅行'],
    personalityTags: ['阳光', '积极'],
    bio: '热爱生活，喜欢运动和旅行，希望找到一起探索世界的伙伴'
  },
  {
    id: 3,
    name: '小明',
    age: 26,
    distance: 3.2,
    avatar: 'https://picsum.photos/100/100?random=3',
    matchScore: 82,
    commonInterests: ['读书', '科技'],
    personalityTags: ['理性', '思考'],
    bio: '喜欢思考人生，热爱读书和科技，寻找精神层面的交流'
  }
]

// 方法
const selectMode = (modeId: string) => {
  selectedMode.value = modeId
  console.log('选择匹配模式:', modeId)
}

const getGenderText = (gender: string) => {
  const genderMap: Record<string, string> = {
    'all': '不限',
    'male': '男',
    'female': '女'
  }
  return genderMap[gender] || '不限'
}

// 智能匹配算法 - 参考伊对的匹配系统
const startMatching = async () => {
  isMatching.value = true
  
  // 显示匹配进度
  ElMessage.info('正在使用AI智能匹配...')
  
  // 模拟智能匹配过程
  const matchingSteps = [
    { step: '分析用户画像...', progress: 20 },
    { step: '计算兴趣相似度...', progress: 40 },
    { step: '评估性格匹配度...', progress: 60 },
    { step: '筛选地理位置...', progress: 80 },
    { step: '生成推荐列表...', progress: 100 }
  ]
  
  for (const matchingStep of matchingSteps) {
    await new Promise(resolve => setTimeout(resolve, 400))
    console.log(matchingStep.step)
  }
  
  // 使用智能算法生成推荐用户
  recommendedUsers.value = generateSmartRecommendations()
  isMatching.value = false
  ElMessage.success(`智能匹配完成！为您推荐了 ${recommendedUsers.value.length} 位用户`)
}

// 智能推荐算法
const generateSmartRecommendations = () => {
  const baseUsers = [...mockUsers]
  
  // 根据选择的匹配模式调整推荐权重
  const modeWeights = {
    appearance: 0.3,
    interest: 0.4,
    personality: 0.2,
    voice: 0.1
  }
  
  // 计算每个用户的综合匹配分数
  return baseUsers.map(user => {
    let totalScore = 0
    
    // 基础匹配分数
    totalScore += user.matchScore * 0.6
    
    // 根据选择的模式调整分数
    if (selectedMode.value === 'appearance') {
      totalScore += Math.random() * 20 + 10 // 颜值匹配加成
    } else if (selectedMode.value === 'interest') {
      totalScore += user.commonInterests.length * 5 // 共同兴趣加成
    } else if (selectedMode.value === 'personality') {
      totalScore += user.personalityTags.length * 3 // 性格标签加成
    }
    
    // 距离权重
    const distanceWeight = Math.max(0, 100 - user.distance * 10)
    totalScore += distanceWeight * 0.1
    
    // 年龄匹配度
    const ageDiff = Math.abs(user.age - 25) // 假设用户25岁
    const ageWeight = Math.max(0, 100 - ageDiff * 2)
    totalScore += ageWeight * 0.1
    
    return {
      ...user,
      matchScore: Math.min(99, Math.round(totalScore)),
      aiRecommendation: true,
      matchReasons: generateMatchReasons(user)
    }
  }).sort((a, b) => b.matchScore - a.matchScore)
}

// 生成匹配理由
const generateMatchReasons = (user: any) => {
  const reasons = []
  
  if (user.commonInterests.length >= 2) {
    reasons.push(`共同兴趣：${user.commonInterests.slice(0, 2).join('、')}`)
  }
  
  if (user.distance < 5) {
    reasons.push(`距离很近：${user.distance}km`)
  }
  
  if (user.personalityTags.includes('阳光') || user.personalityTags.includes('积极')) {
    reasons.push('性格阳光积极')
  }
  
  if (user.matchScore > 85) {
    reasons.push('高度匹配')
  }
  
  return reasons.slice(0, 3) // 最多显示3个理由
}

// 滑动相关方法
const handleTouchStart = (e: TouchEvent) => {
  if (recommendedUsers.value.length === 0) return
  
  isDragging.value = true
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  touchCurrentX.value = e.touches[0].clientX
  touchCurrentY.value = e.touches[0].clientY
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || recommendedUsers.value.length === 0) return
  
  touchCurrentX.value = e.touches[0].clientX
  touchCurrentY.value = e.touches[0].clientY
  
  const deltaX = touchCurrentX.value - touchStartX.value
  const deltaY = touchCurrentY.value - touchStartY.value
  
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    dragDirection.value = deltaX > 0 ? 'right' : 'left'
  } else {
    dragDirection.value = deltaY > 0 ? 'down' : 'up'
  }
}

const handleTouchEnd = () => {
  if (!isDragging.value || recommendedUsers.value.length === 0) return
  
  const deltaX = touchCurrentX.value - touchStartX.value
  const threshold = 100
  
  if (Math.abs(deltaX) > threshold) {
    if (deltaX > 0) {
      likeCurrentUser()
    } else {
      passCurrentUser()
    }
  }
  
  isDragging.value = false
  dragDirection.value = ''
}

const getCardTransform = (index: number) => {
  if (index === 0 && isDragging.value) {
    const deltaX = touchCurrentX.value - touchStartX.value
    const rotation = deltaX * 0.1
    return `translateX(${deltaX}px) rotate(${rotation}deg)`
  }
  
  if (index === 1) {
    return 'scale(0.95) translateY(10px)'
  }
  
  if (index === 2) {
    return 'scale(0.9) translateY(20px)'
  }
  
  return 'none'
}

// 用户操作方法
const passCurrentUser = () => {
  if (recommendedUsers.value.length === 0) return
  
  const user = recommendedUsers.value[0]
  recommendedUsers.value.shift()
  ElMessage.info(`已跳过 ${user.name}`)
  
  // 更新匹配进度
  todayMatches.value++
  matchProgress.value = Math.min(100, matchProgress.value + 2)
}

const likeCurrentUser = () => {
  if (recommendedUsers.value.length === 0) return
  
  const user = recommendedUsers.value[0]
  recommendedUsers.value.shift()
  ElMessage.success(`已喜欢 ${user.name}！`)
  
  // 更新匹配进度
  todayMatches.value++
  matchProgress.value = Math.min(100, matchProgress.value + 2)
}

const superLikeCurrentUser = () => {
  if (recommendedUsers.value.length === 0) return
  
  const user = recommendedUsers.value[0]
  recommendedUsers.value.shift()
  ElMessage.success(`超级喜欢 ${user.name}！`)
  
  // 更新匹配进度
  todayMatches.value++
  matchProgress.value = Math.min(100, matchProgress.value + 3)
}

</script>

<style lang="scss" scoped>
.modern-match-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 16px;
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

// Soul风格的顶部状态栏
.match-status-bar {
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

  .match-mode-selector {
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

/* 用户信息卡片 */
.user-info-card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border-secondary);
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  position: relative;
}

.online-status {
  position: absolute;
  bottom: -2px;
  right: -2px;
  font-size: 12px;
  background: var(--bg-primary);
  padding: 2px 4px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-secondary);
}

.user-details {
  flex: 1;
}

.user-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.user-stats span {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* 匹配模式 */
.match-modes {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border-secondary);
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.mode-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-primary);
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
  }

  &.active {
    background: var(--gradient-primary);
    border-color: transparent;
    color: white;
    box-shadow: var(--shadow-md);
  }
}

.mode-card.active .mode-desc {
  color: rgba(255, 255, 255, 0.9);
}

.mode-card.active .progress-bar {
  background: rgba(255, 255, 255, 0.3);
}

.mode-card.active .progress-fill {
  background: rgba(255, 255, 255, 0.8);
}

.mode-card.active .progress-text {
  color: white;
}

.mode-card .mode-icon-wrapper {
  position: relative;
  margin-bottom: 12px;
}

.mode-card .mode-icon-wrapper .mode-icon {
  font-size: 32px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.mode-card .mode-icon-wrapper .mode-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 2s infinite;
}

.mode-card .mode-label {
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 6px;
  transition: all 0.3s ease;
}

.mode-card .mode-desc {
  font-size: 11px;
  text-align: center;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.mode-card .mode-progress {
  width: 100%;
  text-align: center;
}

.mode-card .mode-progress .progress-bar {
  width: 100%;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 6px;
}

.mode-card .mode-progress .progress-bar .progress-fill {
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 2px;
  transition: width 0.6s ease;
}

.mode-card .mode-progress .progress-text {
  font-size: 10px;
  color: var(--text-secondary);
  font-weight: 600;
}
}

/* 匹配条件 */
.match-conditions {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border-secondary);
}

.conditions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.condition-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.condition-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-right: 8px;
  min-width: 60px;
}

.condition-value {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

// 伊对风格的滑动匹配容器
.swipe-match-container {
  position: relative;
  z-index: 2;
  margin-bottom: 24px;

  .match-progress {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      color: white;
      font-size: 14px;
      font-weight: 500;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border-radius: 3px;
        transition: width 0.3s ease;
      }
    }
  }

  .card-stack {
    position: relative;
    height: 500px;
    margin-bottom: 20px;

    .swipe-card {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: grab;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);

      &:active {
        cursor: grabbing;
      }

      &.top-card {
        z-index: 3;
      }

      &.middle-card {
        z-index: 2;
        opacity: 0.8;
      }

      &.bottom-card {
        z-index: 1;
        opacity: 0.6;
      }

      .card-background {
        position: relative;
        height: 60%;
        overflow: hidden;

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-gradient {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        }
      }

      .card-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 24px;
        color: white;

        .user-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;

          .user-basic-info {
            .user-name {
              font-size: 28px;
              font-weight: 700;
              margin: 0 0 8px 0;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }

            .user-age, .user-distance {
              font-size: 16px;
              opacity: 0.9;
              margin-right: 12px;
            }
          }

          .match-score-badge {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }
        }

        .user-bio {
          margin-bottom: 16px;

          p {
            font-size: 16px;
            line-height: 1.5;
            margin: 0;
            opacity: 0.9;
          }
        }

        .user-tags {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;

          .personality-tag {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 600;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
        }

        .match-reasons {
          .reasons-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
            opacity: 0.9;
          }

          .reasons-list {
            display: flex;
            flex-direction: column;
            gap: 6px;

            .match-reason {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 13px;
              background: rgba(16, 185, 129, 0.2);
              padding: 6px 12px;
              border-radius: 12px;
              border: 1px solid rgba(16, 185, 129, 0.3);
              backdrop-filter: blur(10px);

              .el-icon {
                color: #10b981;
                font-size: 14px;
              }
            }
          }
        }
      }

      .swipe-hints {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-between;
        padding: 0 24px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;

        .swipe-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          border-radius: 16px;
          backdrop-filter: blur(20px);
          border: 2px solid;

          &.left {
            background: rgba(255, 107, 107, 0.2);
            border-color: rgba(255, 107, 107, 0.5);
            color: #ff6b6b;
          }

          &.right {
            background: rgba(16, 185, 129, 0.2);
            border-color: rgba(16, 185, 129, 0.5);
            color: #10b981;
          }

          .el-icon {
            font-size: 32px;
          }

          span {
            font-size: 14px;
            font-weight: 600;
          }
        }
      }

      &:hover .swipe-hints {
        opacity: 1;
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 24px;
    padding: 20px;

    .el-button {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: none;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }

      &.pass-action {
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        color: white;
      }

      &.like-action {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
      }

      &.super-like-action {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
    }
  }
}

// 开始匹配按钮
.start-matching {
  position: relative;
  z-index: 2;

  .match-btn {
    width: 100%;
    height: 56px;
    font-size: 18px;
    font-weight: 700;
    border-radius: 28px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);

      &::before {
        left: 100%;
      }
    }

    &:active {
      transform: translateY(-2px);
    }
  }
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
  .modern-match-page {
    padding: 12px;
  }

  .match-status-bar {
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

    .match-mode-selector {
      gap: 6px;

      .el-button {
        font-size: 11px;
        padding: 4px 8px;
      }
    }
  }

  .swipe-match-container {
    .card-stack {
      height: 450px;

      .swipe-card {
        .card-content {
          padding: 20px;

          .user-header {
            margin-bottom: 12px;

            .user-basic-info {
              .user-name {
                font-size: 24px;
              }

              .user-age, .user-distance {
                font-size: 14px;
              }
            }

            .match-score-badge {
              padding: 6px 12px;
              font-size: 14px;
            }
          }

          .user-bio p {
            font-size: 14px;
          }

          .user-tags {
            gap: 6px;
            margin-bottom: 12px;

            .personality-tag {
              padding: 4px 8px;
              font-size: 11px;
            }
          }

          .match-reasons {
            .reasons-title {
              font-size: 12px;
            }

            .reasons-list {
              gap: 4px;

              .match-reason {
                padding: 4px 8px;
                font-size: 12px;
              }
            }
          }
        }
      }
    }

    .action-buttons {
      gap: 16px;
      padding: 16px;

      .el-button {
        width: 56px;
        height: 56px;
      }
    }
  }

  .start-matching {
    .match-btn {
      height: 48px;
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 480px) {
  .match-status-bar {
    .match-mode-selector {
      .el-button {
        font-size: 10px;
        padding: 3px 6px;
      }
    }
  }

  .swipe-match-container {
    .card-stack {
      height: 400px;

      .swipe-card {
        .card-content {
          padding: 16px;

          .user-header {
            .user-basic-info {
              .user-name {
                font-size: 20px;
              }
            }
          }
        }
      }
    }

    .action-buttons {
      gap: 12px;

      .el-button {
        width: 48px;
        height: 48px;
      }
    }
  }
}
</style>

