<template>
  <div class="achievements-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="nav-title">成就系统</div>
      <div class="nav-right">
        <el-button :icon="Trophy" circle size="small" @click="showRanking" />
      </div>
    </div>

    <!-- 用户等级概览 -->
    <div class="level-overview">
      <div class="level-card">
        <div class="level-avatar">
          <img :src="getLevelAvatar(userLevel)" :alt="`等级${userLevel}`" />
          <div class="level-badge">{{ userLevel }}</div>
        </div>
        <div class="level-info">
          <div class="level-name">{{ getLevelName(userLevel) }}</div>
          <div class="level-progress">
            <el-progress 
              :percentage="levelProgress" 
              :stroke-width="8" 
              :show-text="false"
              color="linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)"
            />
            <div class="progress-text">
              <span>{{ currentExp }}</span>
              <span>/{{ nextLevelExp }} EXP</span>
            </div>
          </div>
          <div class="level-stats">
            <div class="stat-item">
              <span class="stat-value">{{ totalAchievements }}</span>
              <span class="stat-label">成就</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ completedAchievements }}</span>
              <span class="stat-label">已完成</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ achievementRate }}%</span>
              <span class="stat-label">完成率</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就分类 -->
    <div class="achievement-categories">
      <div class="category-nav">
        <div 
          v-for="category in categories" 
          :key="category.key"
          class="category-item"
          :class="{ active: activeCategory === category.key }"
          @click="activeCategory = category.key"
        >
          <el-icon><component :is="category.icon" /></el-icon>
          <span>{{ category.name }}</span>
          <div class="category-progress">
            <span>{{ getCategoryProgress(category.key) }}</span>
            <span>/{{ getCategoryTotal(category.key) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就列表 -->
    <div class="achievements-list">
      <div class="achievements-grid">
        <div 
          v-for="achievement in filteredAchievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="{ 
            'completed': achievement.completed, 
            'locked': achievement.locked,
            'rare': achievement.rarity === 'rare',
            'epic': achievement.rarity === 'epic',
            'legendary': achievement.rarity === 'legendary'
          }"
          @click="viewAchievement(achievement)"
        >
          <div class="achievement-icon">
            <img :src="achievement.icon" :alt="achievement.name" />
            <div v-if="achievement.completed" class="completed-badge">
              <el-icon><Check /></el-icon>
            </div>
            <div v-if="achievement.locked" class="locked-overlay">
              <el-icon><Lock /></el-icon>
            </div>
          </div>
          <div class="achievement-info">
            <div class="achievement-name">{{ achievement.name }}</div>
            <div class="achievement-desc">{{ achievement.description }}</div>
            <div class="achievement-progress" v-if="!achievement.completed && !achievement.locked">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: achievement.progress + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ achievement.current }}/{{ achievement.target }}</span>
            </div>
            <div class="achievement-reward">
              <span class="reward-exp">+{{ achievement.expReward }} EXP</span>
              <span v-if="achievement.coinReward" class="reward-coins">+{{ achievement.coinReward }} 金币</span>
            </div>
          </div>
          <div class="achievement-rarity" v-if="achievement.rarity !== 'common'">
            <span class="rarity-badge" :class="achievement.rarity">{{ getRarityName(achievement.rarity) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就详情弹窗 -->
    <el-dialog 
      v-model="showAchievementDetail" 
      :title="selectedAchievement?.name"
      width="90%"
      class="achievement-dialog"
    >
      <div v-if="selectedAchievement" class="achievement-detail">
        <div class="detail-icon">
          <img :src="selectedAchievement.icon" :alt="selectedAchievement.name" />
        </div>
        <div class="detail-info">
          <div class="detail-name">{{ selectedAchievement.name }}</div>
          <div class="detail-desc">{{ selectedAchievement.description }}</div>
          <div class="detail-progress" v-if="!selectedAchievement.completed && !selectedAchievement.locked">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: selectedAchievement.progress + '%' }"
              ></div>
            </div>
            <span class="progress-text">{{ selectedAchievement.current }}/{{ selectedAchievement.target }}</span>
          </div>
          <div class="detail-reward">
            <div class="reward-title">奖励</div>
            <div class="reward-items">
              <div class="reward-item">
                <el-icon><Star /></el-icon>
                <span>{{ selectedAchievement.expReward }} 经验值</span>
              </div>
              <div class="reward-item" v-if="selectedAchievement.coinReward">
                <el-icon><Money /></el-icon>
                <span>{{ selectedAchievement.coinReward }} 金币</span>
              </div>
            </div>
          </div>
          <div class="detail-tips" v-if="selectedAchievement.tips">
            <div class="tips-title">完成提示</div>
            <div class="tips-content">{{ selectedAchievement.tips }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Trophy, 
  Check, 
  Lock, 
  Star, 
  Money,
  User,
  ChatDotRound,
  StarFilled,
  Camera,
  Location,
  Clock
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const userLevel = ref(8)
const currentExp = ref(2450)
const nextLevelExp = ref(3000)
const levelProgress = ref(68)
const activeCategory = ref('all')
const showAchievementDetail = ref(false)
const selectedAchievement = ref<any>(null)

const categories = ref([
  { key: 'all', name: '全部', icon: 'Trophy' },
  { key: 'social', name: '社交', icon: 'User' },
  { key: 'content', name: '内容', icon: 'Camera' },
  { key: 'activity', name: '活动', icon: 'Location' },
  { key: 'time', name: '时间', icon: 'Clock' }
])

const achievements = ref([
  // 社交类成就
  {
    id: 1,
    name: '新人报到',
    description: '完成账号注册',
    icon: '🏆',
    category: 'social',
    rarity: 'common',
    completed: true,
    locked: false,
    progress: 100,
    current: 1,
    target: 1,
    expReward: 10,
    coinReward: 0,
    tips: '欢迎加入我们的社区！'
  },
  {
    id: 2,
    name: '社交达人',
    description: '添加10个好友',
    icon: '👥',
    category: 'social',
    rarity: 'common',
    completed: false,
    locked: false,
    progress: 70,
    current: 7,
    target: 10,
    expReward: 50,
    coinReward: 100,
    tips: '多参与聊天和互动，结识更多朋友'
  },
  {
    id: 3,
    name: '人气王',
    description: '获得1000个赞',
    icon: '⭐',
    category: 'social',
    rarity: 'rare',
    completed: false,
    locked: false,
    progress: 45,
    current: 450,
    target: 1000,
    expReward: 200,
    coinReward: 500,
    tips: '发布优质内容，积极互动'
  },
  {
    id: 4,
    name: '聊天高手',
    description: '发送1000条消息',
    icon: '💬',
    category: 'social',
    rarity: 'epic',
    completed: false,
    locked: false,
    progress: 30,
    current: 300,
    target: 1000,
    expReward: 300,
    coinReward: 800,
    tips: '多与朋友聊天，分享生活点滴'
  },
  
  // 内容类成就
  {
    id: 5,
    name: '内容创作者',
    description: '发布10条动态',
    icon: '📝',
    category: 'content',
    rarity: 'common',
    completed: true,
    locked: false,
    progress: 100,
    current: 10,
    target: 10,
    expReward: 30,
    coinReward: 50,
    tips: '继续分享你的生活吧！'
  },
  {
    id: 6,
    name: '摄影大师',
    description: '发布50张照片',
    icon: '📸',
    category: 'content',
    rarity: 'rare',
    completed: false,
    locked: false,
    progress: 60,
    current: 30,
    target: 50,
    expReward: 150,
    coinReward: 300,
    tips: '用镜头记录美好瞬间'
  },
  {
    id: 7,
    name: '视频达人',
    description: '发布20个视频',
    icon: '🎥',
    category: 'content',
    rarity: 'epic',
    completed: false,
    locked: false,
    progress: 25,
    current: 5,
    target: 20,
    expReward: 250,
    coinReward: 600,
    tips: '创作有趣的视频内容'
  },
  
  // 活动类成就
  {
    id: 8,
    name: '活动参与者',
    description: '参加5次活动',
    icon: '🎉',
    category: 'activity',
    rarity: 'common',
    completed: false,
    locked: false,
    progress: 40,
    current: 2,
    target: 5,
    expReward: 80,
    coinReward: 200,
    tips: '积极参与社区活动'
  },
  {
    id: 9,
    name: '派对常客',
    description: '参加20次语音派对',
    icon: '🎊',
    category: 'activity',
    rarity: 'rare',
    completed: false,
    locked: false,
    progress: 15,
    current: 3,
    target: 20,
    expReward: 180,
    coinReward: 400,
    tips: '多参与语音派对，结识新朋友'
  },
  
  // 时间类成就
  {
    id: 10,
    name: '早起鸟',
    description: '连续7天早起打卡',
    icon: '🌅',
    category: 'time',
    rarity: 'common',
    completed: false,
    locked: false,
    progress: 57,
    current: 4,
    target: 7,
    expReward: 60,
    coinReward: 150,
    tips: '保持良好的作息习惯'
  },
  {
    id: 11,
    name: '夜猫子',
    description: '连续30天深夜活跃',
    icon: '🌙',
    category: 'time',
    rarity: 'epic',
    completed: false,
    locked: false,
    progress: 10,
    current: 3,
    target: 30,
    expReward: 400,
    coinReward: 1000,
    tips: '注意休息，健康第一'
  },
  {
    id: 12,
    name: '传奇用户',
    description: '连续365天登录',
    icon: '👑',
    category: 'time',
    rarity: 'legendary',
    completed: false,
    locked: false,
    progress: 8,
    current: 30,
    target: 365,
    expReward: 1000,
    coinReward: 5000,
    tips: '坚持就是胜利！'
  }
])

// 计算属性
const totalAchievements = computed(() => achievements.value.length)
const completedAchievements = computed(() => achievements.value.filter(a => a.completed).length)
const achievementRate = computed(() => Math.round((completedAchievements.value / totalAchievements.value) * 100))

const filteredAchievements = computed(() => {
  if (activeCategory.value === 'all') {
    return achievements.value
  }
  return achievements.value.filter(a => a.category === activeCategory.value)
})

// 方法
const goBack = () => {
  router.back()
}

const showRanking = () => {
  ElMessage.info('排行榜功能开发中...')
}

const getLevelName = (level: number) => {
  const levelNames = ['新手', '初级', '中级', '高级', '专家', '大师', '传奇', '神话', '至尊', '无敌']
  return levelNames[Math.min(level - 1, levelNames.length - 1)] || '未知'
}

const getLevelAvatar = (level: number) => {
  return `https://picsum.photos/80/80?random=${level + 200}`
}

const getRarityName = (rarity: string) => {
  const rarityNames = {
    common: '普通',
    rare: '稀有',
    epic: '史诗',
    legendary: '传说'
  }
  return rarityNames[rarity as keyof typeof rarityNames] || '未知'
}

const getCategoryProgress = (category: string) => {
  if (category === 'all') {
    return completedAchievements.value
  }
  return achievements.value.filter(a => a.category === category && a.completed).length
}

const getCategoryTotal = (category: string) => {
  if (category === 'all') {
    return totalAchievements.value
  }
  return achievements.value.filter(a => a.category === category).length
}

const viewAchievement = (achievement: any) => {
  selectedAchievement.value = achievement
  showAchievementDetail.value = true
}
</script>

<style lang="scss" scoped>
.achievements-page {
  background: linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%);
  min-height: 100vh;
  color: #334155;
  position: relative;
  overflow-x: hidden;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(196, 181, 253, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;

  .back-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #8b5cf6;

    &:hover {
      background: rgba(139, 92, 246, 0.2);
    }
  }

  .nav-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }

  .nav-right {
    .el-button {
      background: rgba(139, 92, 246, 0.1);
      border: none;
      color: #8b5cf6;

      &:hover {
        background: rgba(139, 92, 246, 0.2);
      }
    }
  }
}

.level-overview {
  padding: 20px;

  .level-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 25px;
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(196, 181, 253, 0.3);
    display: flex;
    align-items: center;
    gap: 20px;

    .level-avatar {
      position: relative;
      width: 80px;
      height: 80px;

      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid rgba(139, 92, 246, 0.3);
      }

      .level-badge {
        position: absolute;
        bottom: -5px;
        right: -5px;
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        color: white;
        font-size: 12px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 12px;
        border: 2px solid white;
      }
    }

    .level-info {
      flex: 1;

      .level-name {
        font-size: 20px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 15px;
      }

      .level-progress {
        margin-bottom: 15px;

        .progress-text {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #64748b;
          margin-top: 5px;
        }
      }

      .level-stats {
        display: flex;
        gap: 20px;

        .stat-item {
          text-align: center;

          .stat-value {
            display: block;
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 3px;
          }

          .stat-label {
            font-size: 12px;
            color: #64748b;
          }
        }
      }
    }
  }
}

.achievement-categories {
  padding: 0 20px;
  margin-bottom: 20px;

  .category-nav {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 10px;

    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 15px 20px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #64748b;
      min-width: 100px;
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(196, 181, 253, 0.2);

      &:hover {
        color: #475569;
        transform: translateY(-2px);
      }

      &.active {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);

        .category-progress {
          color: rgba(255, 255, 255, 0.8);
        }
      }

      .el-icon {
        font-size: 24px;
      }

      span {
        font-size: 13px;
        font-weight: 600;
        text-align: center;
      }

      .category-progress {
        font-size: 11px;
        color: #94a3b8;
        display: flex;
        gap: 2px;
      }
    }
  }
}

.achievements-list {
  padding: 0 20px 20px;

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;

    .achievement-card {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(196, 181, 253, 0.2);
      position: relative;
      overflow: hidden;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
      }

      &.completed {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
        border-color: rgba(16, 185, 129, 0.3);
      }

      &.locked {
        opacity: 0.6;
        background: rgba(148, 163, 184, 0.1);
      }

      &.rare {
        border-color: rgba(59, 130, 246, 0.3);
        box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
      }

      &.epic {
        border-color: rgba(168, 85, 247, 0.3);
        box-shadow: 0 4px 16px rgba(168, 85, 247, 0.1);
      }

      &.legendary {
        border-color: rgba(245, 158, 11, 0.3);
        box-shadow: 0 4px 16px rgba(245, 158, 11, 0.1);
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%);
      }

      .achievement-icon {
        position: relative;
        width: 60px;
        height: 60px;
        margin-bottom: 15px;

        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }

        .completed-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 24px;
          height: 24px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          border: 2px solid white;
        }

        .locked-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
        }
      }

      .achievement-info {
        .achievement-name {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .achievement-desc {
          font-size: 14px;
          color: #64748b;
          line-height: 1.4;
          margin-bottom: 15px;
        }

        .achievement-progress {
          margin-bottom: 15px;

          .progress-bar {
            width: 100%;
            height: 6px;
            background: rgba(139, 92, 246, 0.1);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 5px;

            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);
              border-radius: 3px;
              transition: width 0.3s ease;
            }
          }

          .progress-text {
            font-size: 12px;
            color: #64748b;
          }
        }

        .achievement-reward {
          display: flex;
          gap: 10px;
          font-size: 12px;

          .reward-exp {
            color: #8b5cf6;
            font-weight: 600;
          }

          .reward-coins {
            color: #f59e0b;
            font-weight: 600;
          }
        }
      }

      .achievement-rarity {
        position: absolute;
        top: 15px;
        right: 15px;

        .rarity-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;

          &.rare {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
          }

          &.epic {
            background: rgba(168, 85, 247, 0.1);
            color: #a855f7;
          }

          &.legendary {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
          }
        }
      }
    }
  }
}

.achievement-dialog {
  .achievement-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .detail-icon {
      margin-bottom: 20px;

      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .detail-info {
      width: 100%;

      .detail-name {
        font-size: 20px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 10px;
      }

      .detail-desc {
        font-size: 15px;
        color: #64748b;
        line-height: 1.5;
        margin-bottom: 20px;
      }

      .detail-progress {
        margin-bottom: 20px;

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(139, 92, 246, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);
            border-radius: 4px;
          }
        }

        .progress-text {
          font-size: 14px;
          color: #64748b;
        }
      }

      .detail-reward {
        margin-bottom: 20px;

        .reward-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .reward-items {
          display: flex;
          justify-content: center;
          gap: 20px;

          .reward-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: rgba(139, 92, 246, 0.1);
            border-radius: 20px;
            color: #8b5cf6;
            font-size: 14px;
            font-weight: 600;

            .el-icon {
              font-size: 16px;
            }
          }
        }
      }

      .detail-tips {
        padding: 15px;
        background: rgba(139, 92, 246, 0.05);
        border-radius: 12px;
        border: 1px solid rgba(139, 92, 246, 0.1);

        .tips-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .tips-content {
          font-size: 13px;
          color: #64748b;
          line-height: 1.4;
        }
      }
    }
  }
}
</style>
