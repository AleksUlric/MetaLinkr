<template>
  <div class="link-home-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="nav-title">Linkr</div>
      <div class="nav-subtitle">连接一切可能</div>
      <div class="nav-actions">
        <el-button :icon="Search" circle size="small" @click="showSearch" />
        <el-button :icon="Bell" circle size="small" @click="showNotifications" />
      </div>
    </div>

    <!-- 连接状态卡片 -->
    <div class="connection-status">
      <div class="status-card online">
        <div class="status-icon">🌐</div>
        <div class="status-info">
          <div class="status-title">在线连接</div>
          <div class="status-count">{{ onlineUsers }} 人</div>
        </div>
        <div class="status-indicator active"></div>
      </div>
      <div class="status-card nearby">
        <div class="status-icon">📍</div>
        <div class="status-info">
          <div class="status-title">附近连接</div>
          <div class="status-count">{{ nearbyUsers }} 人</div>
        </div>
        <div class="status-indicator active"></div>
      </div>
    </div>

    <!-- 快速连接功能 -->
    <div class="quick-link-section">
      <div class="section-header">
        <h3>快速连接</h3>
        <el-button text @click="viewAllConnections">查看全部</el-button>
      </div>
      
      <div class="quick-link-grid">
        <div 
          v-for="link in quickLinks" 
          :key="link.id"
          class="quick-link-item"
          :class="link.type"
          @click="startConnection(link)"
        >
          <div class="link-icon">{{ link.icon }}</div>
          <div class="link-info">
            <div class="link-title">{{ link.title }}</div>
            <div class="link-desc">{{ link.description }}</div>
            <div class="link-count">{{ link.count }} 人使用</div>
          </div>
          <div class="link-status" :class="link.status">
            {{ link.statusText }}
          </div>
        </div>
      </div>
    </div>

    <!-- 连接方式分类 -->
    <div class="connection-methods">
      <div class="section-header">
        <h3>连接方式</h3>
      </div>
      
      <div class="methods-grid">
        <div 
          v-for="method in connectionMethods" 
          :key="method.id"
          class="method-card"
          :class="method.category"
          @click="selectMethod(method)"
        >
          <div class="method-background">
            <div class="method-pattern"></div>
          </div>
          <div class="method-content">
            <div class="method-icon">{{ method.icon }}</div>
            <div class="method-title">{{ method.title }}</div>
            <div class="method-desc">{{ method.description }}</div>
            <div class="method-features">
              <span 
                v-for="feature in method.features" 
                :key="feature"
                class="feature-tag"
              >
                {{ feature }}
              </span>
            </div>
          </div>
          <div class="method-stats">
            <div class="stat-item">
              <span class="stat-value">{{ method.activeUsers }}</span>
              <span class="stat-label">活跃</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ method.successRate }}%</span>
              <span class="stat-label">成功率</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门连接活动 -->
    <div class="hot-activities">
      <div class="section-header">
        <h3>热门连接活动</h3>
        <el-button text @click="viewAllActivities">查看更多</el-button>
      </div>
      
      <div class="activities-list">
        <div 
          v-for="activity in hotActivities" 
          :key="activity.id"
          class="activity-item"
          @click="joinActivity(activity)"
        >
          <div class="activity-image">
            <img :src="activity.image" :alt="activity.title" />
            <div class="activity-badge">{{ activity.badge }}</div>
          </div>
          <div class="activity-info">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-desc">{{ activity.description }}</div>
            <div class="activity-meta">
              <div class="activity-time">
                <el-icon><Clock /></el-icon>
                <span>{{ activity.time }}</span>
              </div>
              <div class="activity-participants">
                <el-icon><User /></el-icon>
                <span>{{ activity.participants }} 人参与</span>
              </div>
            </div>
          </div>
          <div class="activity-action">
            <el-button 
              type="primary" 
              size="small"
              :disabled="activity.isFull"
            >
              {{ activity.isFull ? '已满' : '参与' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 连接历史 -->
    <div class="connection-history">
      <div class="section-header">
        <h3>最近连接</h3>
        <el-button text @click="viewAllHistory">查看全部</el-button>
      </div>
      
      <div class="history-list">
        <div 
          v-for="history in recentConnections" 
          :key="history.id"
          class="history-item"
          @click="reconnect(history)"
        >
          <div class="history-avatar">
            <img :src="history.avatar" :alt="history.name" />
            <div class="history-status" :class="history.status"></div>
          </div>
          <div class="history-info">
            <div class="history-name">{{ history.name }}</div>
            <div class="history-method">{{ history.method }}</div>
            <div class="history-time">{{ formatTime(history.time) }}</div>
          </div>
          <div class="history-action">
            <el-button :icon="ChatDotRound" circle size="small" />
          </div>
        </div>
      </div>
    </div>

    <!-- 连接设置 -->
    <div class="connection-settings">
      <div class="settings-card">
        <div class="settings-header">
          <h4>连接偏好设置</h4>
          <el-button :icon="Setting" circle size="small" @click="openSettings" />
        </div>
        <div class="settings-content">
          <div class="setting-item">
            <span class="setting-label">自动接受连接</span>
            <el-switch v-model="autoAccept" />
          </div>
          <div class="setting-item">
            <span class="setting-label">附近连接提醒</span>
            <el-switch v-model="nearbyAlert" />
          </div>
          <div class="setting-item">
            <span class="setting-label">隐私模式</span>
            <el-switch v-model="privacyMode" />
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索弹窗 -->
    <el-dialog 
      v-model="showSearchDialog" 
      title="搜索连接"
      width="90%"
      class="search-dialog"
    >
      <div class="search-content">
        <div class="search-input">
          <el-input
            v-model="searchQuery"
            placeholder="搜索用户、活动或话题..."
            :prefix-icon="Search"
            size="large"
          />
        </div>
        <div class="search-filters">
          <el-select v-model="searchFilter" placeholder="筛选类型" size="small">
            <el-option label="全部" value="all" />
            <el-option label="用户" value="users" />
            <el-option label="活动" value="activities" />
            <el-option label="话题" value="topics" />
          </el-select>
        </div>
        <div class="search-results">
          <div v-if="searchResults.length === 0" class="empty-results">
            <div class="empty-icon">🔍</div>
            <div class="empty-text">暂无搜索结果</div>
          </div>
          <div v-else class="results-list">
            <div 
              v-for="result in searchResults" 
              :key="result.id"
              class="result-item"
              @click="selectResult(result)"
            >
              <div class="result-avatar">
                <img :src="result.avatar" :alt="result.name" />
              </div>
              <div class="result-info">
                <div class="result-name">{{ result.name }}</div>
                <div class="result-type">{{ result.type }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Search, 
  Bell, 
  Clock, 
  User, 
  ChatDotRound, 
  Setting 
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const router = useRouter()

// 响应式数据
const onlineUsers = ref(1286)
const nearbyUsers = ref(89)
const showSearchDialog = ref(false)
const searchQuery = ref('')
const searchFilter = ref('all')
const autoAccept = ref(true)
const nearbyAlert = ref(true)
const privacyMode = ref(false)

const quickLinks = ref([
  {
    id: 1,
    title: '即时连接',
    description: '快速找到附近的人',
    icon: '⚡',
    type: 'instant',
    status: 'active',
    statusText: '可用',
    count: 1234
  },
  {
    id: 2,
    title: '兴趣连接',
    description: '基于共同爱好',
    icon: '🎯',
    type: 'interest',
    status: 'active',
    statusText: '可用',
    count: 856
  },
  {
    id: 3,
    title: '职业连接',
    description: '职场人脉拓展',
    icon: '💼',
    type: 'career',
    status: 'busy',
    statusText: '繁忙',
    count: 567
  },
  {
    id: 4,
    title: '学习连接',
    description: '知识分享交流',
    icon: '📚',
    type: 'learning',
    status: 'active',
    statusText: '可用',
    count: 789
  }
])

const connectionMethods = ref([
  {
    id: 1,
    title: '语音连接',
    description: '通过语音建立连接',
    icon: '🎤',
    category: 'voice',
    features: ['实时语音', '语音识别', '情感分析'],
    activeUsers: 234,
    successRate: 85
  },
  {
    id: 2,
    title: '视频连接',
    description: '面对面视频交流',
    icon: '📹',
    category: 'video',
    features: ['高清视频', '美颜滤镜', '屏幕共享'],
    activeUsers: 189,
    successRate: 78
  },
  {
    id: 3,
    title: '文字连接',
    description: '文字聊天建立联系',
    icon: '💬',
    category: 'text',
    features: ['智能回复', '表情包', '语音转文字'],
    activeUsers: 456,
    successRate: 92
  },
  {
    id: 4,
    title: 'AR连接',
    description: '增强现实互动',
    icon: '🥽',
    category: 'ar',
    features: ['AR滤镜', '3D互动', '虚拟空间'],
    activeUsers: 67,
    successRate: 65
  }
])

const hotActivities = ref([
  {
    id: 1,
    title: '周末户外徒步',
    description: '一起探索城市周边美景',
    image: 'https://picsum.photos/300/200?random=1',
    badge: '热门',
    time: '明天 09:00',
    participants: 23,
    isFull: false
  },
  {
    id: 2,
    title: '咖啡品鉴会',
    description: '分享咖啡文化，品味生活',
    image: 'https://picsum.photos/300/200?random=2',
    badge: '推荐',
    time: '后天 14:00',
    participants: 15,
    isFull: false
  },
  {
    id: 3,
    title: '编程技术交流',
    description: '程序员技术分享会',
    image: 'https://picsum.photos/300/200?random=3',
    badge: '专业',
    time: '本周六 19:00',
    participants: 45,
    isFull: true
  }
])

const recentConnections = ref([
  {
    id: 1,
    name: '小明',
    avatar: 'https://picsum.photos/200/200?random=1',
    method: '语音连接',
    time: '2024-01-15 14:30:00',
    status: 'online'
  },
  {
    id: 2,
    name: '小红',
    avatar: 'https://picsum.photos/200/200?random=2',
    method: '兴趣连接',
    time: '2024-01-15 12:20:00',
    status: 'offline'
  },
  {
    id: 3,
    name: '小芳',
    avatar: 'https://picsum.photos/200/200?random=3',
    method: '职业连接',
    time: '2024-01-14 18:45:00',
    status: 'online'
  }
])

const searchResults = ref([
  {
    id: 1,
    name: '摄影爱好者',
    avatar: 'https://picsum.photos/200/200?random=4',
    type: '用户'
  },
  {
    id: 2,
    name: '摄影技巧分享',
    avatar: 'https://picsum.photos/200/200?random=5',
    type: '活动'
  }
])

// 计算属性
const filteredSearchResults = computed(() => {
  if (!searchQuery.value) return []
  
  return searchResults.value.filter(result => {
    if (searchFilter.value === 'all') return true
    return result.type.includes(searchFilter.value)
  })
})

// 方法
const showSearch = () => {
  showSearchDialog.value = true
}

const showNotifications = () => {
  router.push('/notifications')
}

const startConnection = (link: any) => {
  ElMessage.info(`开始${link.title}连接`)
  // 根据连接类型跳转到相应页面
  switch (link.type) {
    case 'instant':
      router.push('/match/instant')
      break
    case 'interest':
      router.push('/match/interest')
      break
    case 'career':
      router.push('/match/career')
      break
    case 'learning':
      router.push('/match/learning')
      break
  }
}

const selectMethod = (method: any) => {
  ElMessage.info(`选择${method.title}方式`)
  router.push(`/connect/${method.category}`)
}

const joinActivity = (activity: any) => {
  if (activity.isFull) {
    ElMessage.warning('活动已满员')
    return
  }
  ElMessage.success(`成功参与${activity.title}`)
}

const reconnect = (history: any) => {
  ElMessage.info(`重新连接${history.name}`)
  router.push(`/chat/${history.id}`)
}

const formatTime = (time: string) => {
  return dayjs(time).fromNow()
}

const viewAllConnections = () => {
  router.push('/connections')
}

const viewAllActivities = () => {
  router.push('/activities')
}

const viewAllHistory = () => {
  router.push('/history')
}

const openSettings = () => {
  router.push('/settings')
}

const selectResult = (result: any) => {
  ElMessage.info(`选择${result.name}`)
  showSearchDialog.value = false
}

// 生命周期
onMounted(() => {
  // 模拟实时更新在线人数
  setInterval(() => {
    onlineUsers.value += Math.floor(Math.random() * 10) - 5
    nearbyUsers.value += Math.floor(Math.random() * 5) - 2
  }, 5000)
})
</script>

<style lang="scss" scoped>
.link-home-page {
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
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(196, 181, 253, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;

  .nav-title {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-subtitle {
    font-size: 14px;
    color: #64748b;
    margin-top: 2px;
  }

  .nav-actions {
    display: flex;
    gap: 10px;

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

.connection-status {
  display: flex;
  gap: 15px;
  padding: 20px;
  margin-bottom: 20px;

  .status-card {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);
    position: relative;
    overflow: hidden;

    .status-icon {
      font-size: 32px;
      width: 50px;
      text-align: center;
    }

    .status-info {
      flex: 1;

      .status-title {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 5px;
      }

      .status-count {
        font-size: 18px;
        font-weight: 700;
        color: #1e293b;
      }
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #10b981;
      animation: pulse 2s infinite;

      &.active {
        background: #10b981;
      }
    }

    &.online {
      border-left: 4px solid #10b981;
    }

    &.nearby {
      border-left: 4px solid #f59e0b;
    }
  }
}

.quick-link-section, .connection-methods, .hot-activities, .connection-history {
  padding: 0 20px;
  margin-bottom: 30px;

  .section-header {
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

    .el-button {
      color: #8b5cf6;
      font-size: 14px;
    }
  }
}

.quick-link-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;

  .quick-link-item {
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
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

    .link-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .link-info {
      .link-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 5px;
      }

      .link-desc {
        font-size: 12px;
        color: #64748b;
        margin-bottom: 8px;
      }

      .link-count {
        font-size: 11px;
        color: #8b5cf6;
      }
    }

    .link-status {
      position: absolute;
      top: 15px;
      right: 15px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;

      &.active {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }

      &.busy {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
      }
    }

    &.instant {
      border-left: 4px solid #10b981;
    }

    &.interest {
      border-left: 4px solid #8b5cf6;
    }

    &.career {
      border-left: 4px solid #f59e0b;
    }

    &.learning {
      border-left: 4px solid #06b6d4;
    }
  }
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;

  .method-card {
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
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

    .method-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.05;

      .method-pattern {
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.1) 50%, transparent 70%);
      }
    }

    .method-content {
      position: relative;
      z-index: 2;

      .method-icon {
        font-size: 32px;
        margin-bottom: 10px;
      }

      .method-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 5px;
      }

      .method-desc {
        font-size: 12px;
        color: #64748b;
        margin-bottom: 10px;
      }

      .method-features {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;

        .feature-tag {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 10px;
        }
      }
    }

    .method-stats {
      position: absolute;
      bottom: 15px;
      right: 15px;
      display: flex;
      gap: 10px;

      .stat-item {
        text-align: center;

        .stat-value {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
        }

        .stat-label {
          font-size: 9px;
          color: #64748b;
        }
      }
    }

    &.voice {
      border-left: 4px solid #ef4444;
    }

    &.video {
      border-left: 4px solid #8b5cf6;
    }

    &.text {
      border-left: 4px solid #10b981;
    }

    &.ar {
      border-left: 4px solid #f59e0b;
    }
  }
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .activity-item {
    display: flex;
    gap: 15px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
    }

    .activity-image {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 12px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .activity-badge {
        position: absolute;
        top: 5px;
        right: 5px;
        background: #ef4444;
        color: white;
        padding: 2px 6px;
        border-radius: 8px;
        font-size: 10px;
        font-weight: 600;
      }
    }

    .activity-info {
      flex: 1;

      .activity-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 5px;
      }

      .activity-desc {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 10px;
      }

      .activity-meta {
        display: flex;
        gap: 15px;
        font-size: 12px;
        color: #64748b;

        .activity-time, .activity-participants {
          display: flex;
          align-items: center;
          gap: 5px;

          .el-icon {
            font-size: 14px;
          }
        }
      }
    }

    .activity-action {
      .el-button {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        border: none;
        color: white;
        font-weight: 600;

        &:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(139, 92, 246, 0.3);
        }

        &:disabled {
          background: rgba(148, 163, 184, 0.3);
          color: rgba(148, 163, 184, 0.8);
        }
      }
    }
  }
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .history-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.2);
    }

    .history-avatar {
      position: relative;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .history-status {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;

        &.online {
          background: #10b981;
        }

        &.offline {
          background: #64748b;
        }
      }
    }

    .history-info {
      flex: 1;

      .history-name {
        font-size: 15px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 3px;
      }

      .history-method {
        font-size: 12px;
        color: #8b5cf6;
        margin-bottom: 3px;
      }

      .history-time {
        font-size: 11px;
        color: #64748b;
      }
    }

    .history-action {
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
}

.connection-settings {
  padding: 0 20px 20px;

  .settings-card {
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);

    .settings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin: 0;
      }

      .el-button {
        background: rgba(139, 92, 246, 0.1);
        border: none;
        color: #8b5cf6;

        &:hover {
          background: rgba(139, 92, 246, 0.2);
        }
      }
    }

    .settings-content {
      .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;

        .setting-label {
          font-size: 14px;
          color: #334155;
        }

        .el-switch {
          &.is-checked {
            .el-switch__core {
              background-color: #8b5cf6;
              border-color: #8b5cf6;
            }
          }
        }
      }
    }
  }
}

.search-dialog {
  .search-content {
    .search-input {
      margin-bottom: 20px;

      .el-input {
        .el-input__inner {
          border-radius: 12px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.1);
          color: #334155;

          &:focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
          }
        }
      }
    }

    .search-filters {
      margin-bottom: 20px;

      .el-select {
        width: 100%;

        .el-select__input {
          border-radius: 12px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.1);
          color: #334155;
        }
      }
    }

    .search-results {
      .empty-results {
        text-align: center;
        padding: 40px 20px;
        color: #64748b;

        .empty-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .empty-text {
          font-size: 16px;
        }
      }

      .results-list {
        display: flex;
        flex-direction: column;
        gap: 15px;

        .result-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(139, 92, 246, 0.1);
            transform: translateY(-1px);
          }

          .result-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .result-info {
            flex: 1;

            .result-name {
              font-size: 15px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 3px;
            }

            .result-type {
              font-size: 12px;
              color: #64748b;
            }
          }
        }
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
