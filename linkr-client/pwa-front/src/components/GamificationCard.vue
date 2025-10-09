<template>
  <div class="gamification-card">
    <div class="card-background">
      <div class="bg-pattern"></div>
      <div class="bg-gradient"></div>
    </div>
    
    <div class="card-content">
      <div class="card-header">
        <div class="header-icon">
          <span>🎮</span>
        </div>
        <div class="header-info">
          <h3>游戏化系统</h3>
          <p>完成任务，获得奖励</p>
        </div>
        <div class="header-points">
          <span class="points-value">{{ userStore.profile?.points || 1250 }}</span>
          <span class="points-label">积分</span>
        </div>
      </div>

      <!-- Soul风格的等级进度 -->
      <div class="level-progress-section">
        <div class="level-info">
          <div class="current-level">
            <span class="level-text">Lv.{{ userStore.profile?.level || 5 }}</span>
            <div class="level-badge">
              <span>{{ getLevelTitle(userStore.profile?.level || 5) }}</span>
            </div>
          </div>
          <div class="next-level">
            <span class="next-level-text">Lv.{{ (userStore.profile?.level || 5) + 1 }}</span>
          </div>
        </div>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: levelProgress + '%' }"></div>
            <div class="progress-glow" :style="{ width: levelProgress + '%' }"></div>
          </div>
          <div class="progress-text">
            还需 {{ nextLevelPoints - currentPoints }} 积分升级
          </div>
        </div>
      </div>

      <!-- Uki风格的每日任务 -->
      <div class="daily-tasks-section">
        <div class="section-title">
          <span>📋 每日任务</span>
          <span class="task-count">{{ completedTasks }}/{{ totalTasks }}</span>
        </div>
        <div class="tasks-list">
          <div 
            v-for="task in dailyTasks" 
            :key="task.id"
            class="task-item"
            :class="{ 'completed': task.completed }"
            @click="completeTask(task)"
          >
            <div class="task-icon">
              <el-icon v-if="task.completed"><Check /></el-icon>
              <span v-else>{{ task.icon }}</span>
            </div>
            <div class="task-content">
              <div class="task-title">{{ task.title }}</div>
              <div class="task-desc">{{ task.description }}</div>
            </div>
            <div class="task-reward">
              <span class="reward-points">+{{ task.points }}</span>
              <span class="reward-label">积分</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Soul风格的成就系统 -->
      <div class="achievements-section">
        <div class="section-title">
          <span>🏆 最新成就</span>
          <el-button size="small" text @click="showAllAchievements">
            查看全部
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <div class="achievements-grid">
          <div 
            v-for="achievement in recentAchievements" 
            :key="achievement.id"
            class="achievement-item"
            :class="achievement.rarity"
            @click="viewAchievement(achievement)"
          >
            <div class="achievement-icon">
              <span>{{ achievement.icon }}</span>
              <div class="achievement-glow" v-if="achievement.isNew"></div>
            </div>
            <div class="achievement-info">
              <h4>{{ achievement.name }}</h4>
              <p>{{ achievement.description }}</p>
              <div class="achievement-date">{{ achievement.earnedAt }}</div>
            </div>
            <div class="achievement-points">
              <span>+{{ achievement.points }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Uki风格的签到系统 -->
      <div class="checkin-section">
        <div class="checkin-header">
          <div class="checkin-icon">
            <span>📅</span>
          </div>
          <div class="checkin-info">
            <h4>每日签到</h4>
            <p>连续签到 {{ streakDays }} 天</p>
          </div>
          <el-button 
            type="primary" 
            size="small"
            :disabled="isCheckedIn"
            @click="dailyCheckin"
            class="checkin-btn"
          >
            {{ isCheckedIn ? '已签到' : '签到' }}
          </el-button>
        </div>
        <div class="checkin-calendar">
          <div 
            v-for="day in checkinCalendar" 
            :key="day.date"
            class="calendar-day"
            :class="{ 
              'checked': day.checked, 
              'today': day.isToday,
              'future': day.isFuture 
            }"
          >
            <span class="day-number">{{ day.day }}</span>
            <div class="day-reward" v-if="day.reward">{{ day.reward }}</div>
          </div>
        </div>
      </div>

      <!-- Soul风格的排行榜 -->
      <div class="leaderboard-section">
        <div class="section-title">
          <span>👑 本周排行榜</span>
          <span class="my-rank">我的排名: #{{ myRank }}</span>
        </div>
        <div class="leaderboard-list">
          <div 
            v-for="(user, index) in leaderboard" 
            :key="user.id"
            class="leaderboard-item"
            :class="{ 'my-rank': user.isMe }"
          >
            <div class="rank-number">
              <span v-if="index < 3" class="top-rank">{{ getRankIcon(index) }}</span>
              <span v-else class="rank-text">{{ index + 1 }}</span>
            </div>
            <div class="user-avatar">
              <el-avatar :src="user.avatar" :size="40" />
              <div class="rank-badge" v-if="index < 3">
                <span>{{ getRankBadge(index) }}</span>
              </div>
            </div>
            <div class="user-info">
              <div class="username">{{ user.name }}</div>
              <div class="user-level">Lv.{{ user.level }}</div>
            </div>
            <div class="user-points">
              <span>{{ user.points }}</span>
              <span class="points-label">积分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { 
  Check, 
  ArrowRight 
} from '@element-plus/icons-vue'

const userStore = useUserStore()

// 响应式数据
const dailyTasks = ref([
  {
    id: '1',
    title: '每日登录',
    description: '登录应用获得积分奖励',
    icon: '📱',
    points: 10,
    completed: true
  },
  {
    id: '2',
    title: '发布动态',
    description: '分享你的生活动态',
    icon: '📝',
    points: 20,
    completed: false
  },
  {
    id: '3',
    title: '完成匹配',
    description: '与3个用户完成匹配',
    icon: '💕',
    points: 30,
    completed: false
  },
  {
    id: '4',
    title: '参与聊天',
    description: '发送10条聊天消息',
    icon: '💬',
    points: 25,
    completed: true
  }
])

const recentAchievements = ref([
  {
    id: '1',
    name: '初来乍到',
    description: '完成首次登录',
    icon: '🌟',
    points: 50,
    rarity: 'common',
    earnedAt: '今天',
    isNew: true
  },
  {
    id: '2',
    name: '社交达人',
    description: '获得100个赞',
    icon: '👑',
    points: 100,
    rarity: 'rare',
    earnedAt: '昨天',
    isNew: false
  },
  {
    id: '3',
    name: '匹配大师',
    description: '完成50次匹配',
    icon: '🎯',
    points: 200,
    rarity: 'epic',
    earnedAt: '3天前',
    isNew: false
  }
])

const streakDays = ref(7)
const isCheckedIn = ref(false)
const myRank = ref(15)

const leaderboard = ref([
  {
    id: '1',
    name: '阳光男孩',
    avatar: 'https://picsum.photos/100/100?random=1',
    level: 8,
    points: 2850,
    isMe: false
  },
  {
    id: '2',
    name: '甜美女孩',
    avatar: 'https://picsum.photos/100/100?random=2',
    level: 7,
    points: 2650,
    isMe: false
  },
  {
    id: '3',
    name: '文艺青年',
    avatar: 'https://picsum.photos/100/100?random=3',
    level: 6,
    points: 2450,
    isMe: false
  },
  {
    id: '4',
    name: '运动达人',
    avatar: 'https://picsum.photos/100/100?random=4',
    level: 6,
    points: 2250,
    isMe: false
  },
  {
    id: '5',
    name: '音乐爱好者',
    avatar: 'https://picsum.photos/100/100?random=5',
    level: 5,
    points: 2050,
    isMe: true
  }
])

// 计算属性
const currentPoints = computed(() => (userStore.profile as any)?.points || 1250)
const currentLevel = computed(() => (userStore.profile as any)?.level || 5)
const nextLevelPoints = computed(() => (currentLevel.value + 1) * 100)
const levelProgress = computed(() => {
  const progress = (currentPoints.value / nextLevelPoints.value) * 100
  return Math.min(progress, 100)
})

const completedTasks = computed(() => 
  dailyTasks.value.filter(task => task.completed).length
)

const totalTasks = computed(() => dailyTasks.value.length)

const checkinCalendar = computed(() => {
  const calendar = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    calendar.push({
      date: date.toDateString(),
      day: date.getDate(),
      checked: i < streakDays.value,
      isToday: i === 0,
      isFuture: i > 0,
      reward: i < streakDays.value ? '✓' : i === 0 ? '?' : ''
    })
  }
  
  return calendar
})

// 方法
const getLevelTitle = (level: number) => {
  if (level >= 10) return '传奇'
  if (level >= 8) return '大师'
  if (level >= 6) return '专家'
  if (level >= 4) return '进阶'
  return '新手'
}

const completeTask = (task: any) => {
  if (task.completed) return
  
  task.completed = true
  userStore.addPoints(task.points)
  ElMessage.success(`完成任务: ${task.title}，获得 ${task.points} 积分`)
}

const showAllAchievements = () => {
  ElMessage.info('查看全部成就')
}

const viewAchievement = (achievement: any) => {
  ElMessage.info(`查看成就: ${achievement.name}`)
}

const dailyCheckin = () => {
  if (isCheckedIn.value) return
  
  isCheckedIn.value = true
  streakDays.value += 1
  userStore.addPoints(20)
  ElMessage.success('签到成功！获得 20 积分')
}

const getRankIcon = (index: number) => {
  const icons = ['🥇', '🥈', '🥉']
  return icons[index] || ''
}

const getRankBadge = (index: number) => {
  const badges = ['冠军', '亚军', '季军']
  return badges[index] || ''
}

onMounted(() => {
  // 初始化游戏化数据
})
</script>

<style scoped>
.gamification-card {
  position: relative;
  margin: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ff6b6b" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23667eea" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="%2343e97b" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="%23ffa500" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(255, 107, 107, 0.05) 100%);
}

.card-content {
  position: relative;
  z-index: 1;
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.header-info h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.header-points {
  margin-left: auto;
  text-align: right;
}

.points-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.points-label {
  font-size: 12px;
  color: #666;
}

/* 等级进度 */
.level-progress-section {
  margin-bottom: 24px;
}

.level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.current-level {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-text {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.level-badge {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.next-level-text {
  font-size: 16px;
  color: #666;
}

.progress-container {
  position: relative;
}

.progress-bar {
  height: 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  border-radius: 4px;
  animation: glow 2s ease-in-out infinite alternate;
}

.progress-text {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* 每日任务 */
.daily-tasks-section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title span:first-child {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.task-count {
  font-size: 12px;
  color: #666;
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.task-item:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-1px);
}

.task-item.completed {
  background: rgba(67, 233, 123, 0.1);
}

.task-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.task-item:not(.completed) .task-icon {
  background: rgba(102, 126, 234, 0.1);
}

.task-item.completed .task-icon {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.task-desc {
  font-size: 12px;
  color: #666;
}

.task-reward {
  text-align: right;
}

.reward-points {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #667eea;
}

.reward-label {
  font-size: 10px;
  color: #666;
}

/* 成就系统 */
.achievements-section {
  margin-bottom: 24px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.achievement-item {
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.achievement-item:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-2px);
}

.achievement-item.common {
  border-left: 4px solid #43e97b;
}

.achievement-item.rare {
  border-left: 4px solid #667eea;
}

.achievement-item.epic {
  border-left: 4px solid #ff6b6b;
}

.achievement-icon {
  position: relative;
  width: 40px;
  height: 40px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 8px;
}

.achievement-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #ff6b6b, #ffa500, #43e97b, #667eea);
  border-radius: 50%;
  z-index: -1;
  animation: rotate 2s linear infinite;
}

.achievement-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.achievement-info p {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #666;
}

.achievement-date {
  font-size: 10px;
  color: #999;
}

.achievement-points {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
}

/* 签到系统 */
.checkin-section {
  margin-bottom: 24px;
}

.checkin-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.checkin-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.checkin-info h4 {
  margin: 0 0 2px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.checkin-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.checkin-btn {
  margin-left: auto;
  border-radius: 20px;
  font-weight: 600;
}

.checkin-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.calendar-day.checked {
  background: rgba(67, 233, 123, 0.2);
  color: #43e97b;
}

.calendar-day.today {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  font-weight: 600;
}

.calendar-day.future {
  opacity: 0.5;
}

.day-number {
  font-size: 14px;
  font-weight: 600;
}

.day-reward {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 10px;
}

/* 排行榜 */
.leaderboard-section {
  margin-bottom: 24px;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.leaderboard-item.my-rank {
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.rank-number {
  width: 32px;
  text-align: center;
}

.top-rank {
  font-size: 20px;
}

.rank-text {
  font-size: 16px;
  font-weight: 700;
  color: #667eea;
}

.user-avatar {
  position: relative;
}

.rank-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
  color: white;
  font-size: 8px;
  padding: 2px 4px;
  border-radius: 6px;
  font-weight: 600;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.user-level {
  font-size: 12px;
  color: #666;
}

.user-points {
  text-align: right;
}

.user-points span:first-child {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #667eea;
}

.points-label {
  font-size: 10px;
  color: #666;
}

/* 动画 */
@keyframes glow {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gamification-card {
    margin: 8px;
  }
  
  .card-content {
    padding: 16px;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  
  .checkin-calendar {
    gap: 4px;
  }
}
</style>