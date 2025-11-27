<template>
  <div class="online-connect-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="nav-title">线上连接</div>
      <div class="nav-right">
        <el-button :icon="Search" circle size="small" @click="showSearch" />
        <el-button :icon="Plus" circle size="small" @click="createActivity" />
      </div>
    </div>

    <!-- 连接方式选择 -->
    <div class="connection-methods">
      <div class="methods-header">
        <h3>选择连接方式</h3>
        <p>通过共同兴趣或相近地点建立联系</p>
      </div>
      
      <div class="methods-grid">
        <div 
          v-for="method in connectionMethods" 
          :key="method.id"
          class="method-card"
          :class="method.type"
          @click="selectMethod(method)"
        >
          <div class="method-icon">{{ method.icon }}</div>
          <div class="method-title">{{ method.title }}</div>
          <div class="method-desc">{{ method.description }}</div>
          <div class="method-stats">
            <div class="stat-item">
              <span class="stat-value">{{ method.activeUsers }}</span>
              <span class="stat-label">活跃用户</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ method.successRate }}%</span>
              <span class="stat-label">匹配率</span>
            </div>
          </div>
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
      </div>
    </div>

    <!-- 兴趣匹配 -->
    <div v-if="selectedMethod === 'interest'" class="interest-matching">
      <div class="section-header">
        <h3>兴趣匹配</h3>
        <el-button text @click="editInterests">编辑兴趣</el-button>
      </div>
      
      <div class="interest-categories">
        <div 
          v-for="category in interestCategories" 
          :key="category.id"
          class="category-item"
          :class="{ active: activeCategory === category.id }"
          @click="activeCategory = category.id"
        >
          <div class="category-icon">{{ category.icon }}</div>
          <div class="category-name">{{ category.name }}</div>
          <div class="category-count">{{ category.count }}</div>
        </div>
      </div>
      
      <div class="matched-users">
        <div 
          v-for="user in matchedUsers" 
          :key="user.id"
          class="user-card"
          @click="viewUserProfile(user)"
        >
          <div class="user-avatar">
            <img :src="user.avatar" :alt="user.name" />
            <div class="user-status" :class="user.status"></div>
          </div>
          <div class="user-info">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-age">{{ user.age }}岁</div>
            <div class="user-interests">
              <span 
                v-for="interest in user.interests" 
                :key="interest"
                class="interest-tag"
              >
                {{ interest }}
              </span>
            </div>
            <div class="user-location">
              <el-icon><Location /></el-icon>
              <span>{{ user.location }}</span>
            </div>
          </div>
          <div class="user-actions">
            <el-button 
              :icon="ChatDotRound" 
              circle 
              size="small"
              @click.stop="startChat(user)"
            />
            <el-button 
              :icon="Star" 
              circle 
              size="small"
              @click.stop="addToFavorites(user)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 地点匹配 -->
    <div v-if="selectedMethod === 'location'" class="location-matching">
      <div class="section-header">
        <h3>地点匹配</h3>
        <el-button text @click="updateLocation">更新位置</el-button>
      </div>
      
      <div class="location-filters">
        <el-select v-model="distanceFilter" placeholder="距离范围" size="small">
          <el-option label="1公里内" value="1000" />
          <el-option label="3公里内" value="3000" />
          <el-option label="5公里内" value="5000" />
          <el-option label="10公里内" value="10000" />
        </el-select>
        <el-select v-model="activityFilter" placeholder="活动类型" size="small">
          <el-option label="全部" value="all" />
          <el-option label="运动健身" value="sports" />
          <el-option label="美食聚餐" value="food" />
          <el-option label="文化娱乐" value="culture" />
          <el-option label="学习交流" value="learning" />
        </el-select>
      </div>
      
      <div class="nearby-activities">
        <div 
          v-for="activity in nearbyActivities" 
          :key="activity.id"
          class="activity-card"
          @click="viewActivityDetail(activity)"
        >
          <div class="activity-image">
            <img :src="activity.image" :alt="activity.title" />
            <div class="activity-badge">{{ activity.type }}</div>
            <div class="activity-distance">{{ activity.distance }}m</div>
          </div>
          <div class="activity-content">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-desc">{{ activity.description }}</div>
            <div class="activity-meta">
              <div class="activity-time">
                <el-icon><Clock /></el-icon>
                <span>{{ activity.time }}</span>
              </div>
              <div class="activity-participants">
                <el-icon><User /></el-icon>
                <span>{{ activity.participants }}/{{ activity.maxParticipants }}</span>
              </div>
            </div>
            <div class="activity-location">
              <el-icon><Location /></el-icon>
              <span>{{ activity.location }}</span>
            </div>
            <div class="activity-organizer">
              <img :src="activity.organizer.avatar" :alt="activity.organizer.name" class="organizer-avatar" />
              <span>发起人: {{ activity.organizer.name }}</span>
            </div>
          </div>
          <div class="activity-action">
            <el-button 
              type="primary" 
              size="small"
              :disabled="activity.participants >= activity.maxParticipants"
              @click.stop="joinActivity(activity)"
            >
              {{ activity.participants >= activity.maxParticipants ? '已满' : '参与' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 活动创建 -->
    <div v-if="selectedMethod === 'create'" class="activity-creation">
      <div class="section-header">
        <h3>发起活动</h3>
        <p>创建活动，邀请志同道合的人参与</p>
      </div>
      
      <el-form
        ref="activityFormRef"
        :model="activityForm"
        :rules="activityRules"
        class="activity-form"
        @submit.prevent="createActivity"
      >
        <el-form-item prop="title">
          <el-input
            v-model="activityForm.title"
            placeholder="活动标题"
            size="large"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item prop="description">
          <el-input
            v-model="activityForm.description"
            type="textarea"
            placeholder="活动描述"
            :rows="3"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item prop="type">
          <el-select v-model="activityForm.type" placeholder="活动类型" size="large">
            <el-option label="运动健身" value="sports" />
            <el-option label="美食聚餐" value="food" />
            <el-option label="文化娱乐" value="culture" />
            <el-option label="学习交流" value="learning" />
            <el-option label="户外探险" value="outdoor" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        
        <el-form-item prop="location">
          <el-input
            v-model="activityForm.location"
            placeholder="活动地点"
            size="large"
            :prefix-icon="Location"
          />
        </el-form-item>
        
        <el-form-item prop="datetime">
          <el-date-picker
            v-model="activityForm.datetime"
            type="datetime"
            placeholder="活动时间"
            size="large"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>
        
        <el-form-item prop="maxParticipants">
          <el-input-number
            v-model="activityForm.maxParticipants"
            :min="2"
            :max="50"
            placeholder="最大参与人数"
            size="large"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="isCreating"
            @click="submitActivity"
            class="submit-btn"
          >
            {{ isCreating ? '创建中...' : '发起活动' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 我的活动 -->
    <div class="my-activities">
      <div class="section-header">
        <h3>我的活动</h3>
        <el-button text @click="viewAllMyActivities">查看全部</el-button>
      </div>
      
      <div class="activities-tabs">
        <div 
          v-for="tab in activityTabs" 
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <span>{{ tab.title }}</span>
          <div v-if="tab.count > 0" class="tab-count">{{ tab.count }}</div>
        </div>
      </div>
      
      <div class="activities-list">
        <div 
          v-for="activity in filteredMyActivities" 
          :key="activity.id"
          class="my-activity-item"
          @click="viewMyActivityDetail(activity)"
        >
          <div class="activity-image">
            <img :src="activity.image" :alt="activity.title" />
            <div class="activity-status" :class="activity.status">
              {{ activity.statusText }}
            </div>
          </div>
          <div class="activity-info">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-desc">{{ activity.description }}</div>
            <div class="activity-meta">
              <div class="activity-time">
                <el-icon><Clock /></el-icon>
                <span>{{ activity.time }}</span>
              </div>
              <div class="activity-location">
                <el-icon><Location /></el-icon>
                <span>{{ activity.location }}</span>
              </div>
              <div class="activity-participants">
                <el-icon><User /></el-icon>
                <span>{{ activity.participants }}/{{ activity.maxParticipants }}</span>
              </div>
            </div>
          </div>
          <div class="activity-actions">
            <el-button 
              v-if="activity.status === 'upcoming'"
              :icon="Edit" 
              circle 
              size="small"
              @click.stop="editActivity(activity)"
            />
            <el-button 
              v-if="activity.status === 'upcoming'"
              :icon="Delete" 
              circle 
              size="small"
              @click.stop="cancelActivity(activity)"
            />
            <el-button 
              v-if="activity.status === 'ongoing'"
              :icon="ChatDotRound" 
              circle 
              size="small"
              @click.stop="openActivityChat(activity)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索弹窗 -->
    <el-dialog 
      v-model="showSearchDialog" 
      title="搜索活动"
      width="90%"
      class="search-dialog"
    >
      <div class="search-content">
        <div class="search-input">
          <el-input
            v-model="searchQuery"
            placeholder="搜索活动、用户或话题..."
            :prefix-icon="Search"
            size="large"
          />
        </div>
        <div class="search-filters">
          <el-select v-model="searchFilter" placeholder="筛选类型" size="small">
            <el-option label="全部" value="all" />
            <el-option label="活动" value="activities" />
            <el-option label="用户" value="users" />
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
  ArrowLeft, 
  Search, 
  Plus, 
  Location, 
  ChatDotRound, 
  Star, 
  Clock, 
  User, 
  Edit, 
  Delete 
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()

// 响应式数据
const selectedMethod = ref('interest')
const activeCategory = ref(1)
const activeTab = ref('upcoming')
const showSearchDialog = ref(false)
const searchQuery = ref('')
const searchFilter = ref('all')
const distanceFilter = ref('3000')
const activityFilter = ref('all')
const isCreating = ref(false)

const connectionMethods = ref([
  {
    id: 1,
    title: '兴趣匹配',
    description: '基于共同爱好建立连接',
    icon: '🎯',
    type: 'interest',
    activeUsers: 1234,
    successRate: 85,
    features: ['智能推荐', '兴趣标签', '精准匹配']
  },
  {
    id: 2,
    title: '地点匹配',
    description: '通过相近地点发现活动',
    icon: '📍',
    type: 'location',
    activeUsers: 856,
    successRate: 78,
    features: ['附近活动', '地点推荐', '实时更新']
  },
  {
    id: 3,
    title: '发起活动',
    description: '创建活动邀请他人参与',
    icon: '🎉',
    type: 'create',
    activeUsers: 567,
    successRate: 92,
    features: ['活动创建', '邀请管理', '参与统计']
  }
])

const interestCategories = ref([
  { id: 1, name: '运动健身', icon: '🏃', count: 234 },
  { id: 2, name: '美食聚餐', icon: '🍕', count: 189 },
  { id: 3, name: '文化娱乐', icon: '🎭', count: 156 },
  { id: 4, name: '学习交流', icon: '📚', count: 123 },
  { id: 5, name: '户外探险', icon: '🏔️', count: 98 },
  { id: 6, name: '艺术创作', icon: '🎨', count: 87 }
])

const matchedUsers = ref([
  {
    id: 1,
    name: '小明',
    avatar: 'https://picsum.photos/200/200?random=1',
    age: 25,
    status: 'online',
    interests: ['摄影', '旅行', '美食'],
    location: '朝阳区'
  },
  {
    id: 2,
    name: '小红',
    avatar: 'https://picsum.photos/200/200?random=2',
    age: 23,
    status: 'online',
    interests: ['音乐', '读书', '运动'],
    location: '海淀区'
  },
  {
    id: 3,
    name: '小芳',
    avatar: 'https://picsum.photos/200/200?random=3',
    age: 27,
    status: 'offline',
    interests: ['健身', '美食', '电影'],
    location: '西城区'
  }
])

const nearbyActivities = ref([
  {
    id: 1,
    title: '周末摄影活动',
    description: '一起探索城市美景，记录美好瞬间',
    image: 'https://picsum.photos/300/200?random=4',
    type: '摄影',
    distance: 800,
    time: '明天 09:00',
    participants: 8,
    maxParticipants: 15,
    location: '朝阳公园',
    organizer: {
      name: '摄影达人',
      avatar: 'https://picsum.photos/200/200?random=5'
    }
  },
  {
    id: 2,
    title: '咖啡品鉴会',
    description: '分享咖啡文化，品味生活',
    image: 'https://picsum.photos/300/200?random=6',
    type: '美食',
    distance: 1200,
    time: '后天 14:00',
    participants: 12,
    maxParticipants: 20,
    location: '蓝山咖啡',
    organizer: {
      name: '咖啡师',
      avatar: 'https://picsum.photos/200/200?random=7'
    }
  },
  {
    id: 3,
    title: '编程技术交流',
    description: '程序员技术分享会',
    image: 'https://picsum.photos/300/200?random=8',
    type: '学习',
    distance: 2000,
    time: '本周六 19:00',
    participants: 25,
    maxParticipants: 30,
    location: '中关村',
    organizer: {
      name: '技术大牛',
      avatar: 'https://picsum.photos/200/200?random=9'
    }
  }
])

const activityTabs = ref([
  { key: 'upcoming', title: '即将开始', count: 3 },
  { key: 'ongoing', title: '进行中', count: 1 },
  { key: 'completed', title: '已完成', count: 5 }
])

const myActivities = ref([
  {
    id: 1,
    title: '周末摄影活动',
    description: '一起探索城市美景',
    image: 'https://picsum.photos/300/200?random=10',
    time: '明天 09:00',
    location: '朝阳公园',
    participants: 8,
    maxParticipants: 15,
    status: 'upcoming',
    statusText: '即将开始'
  },
  {
    id: 2,
    title: '咖啡品鉴会',
    description: '分享咖啡文化',
    image: 'https://picsum.photos/300/200?random=11',
    time: '今天 14:00',
    location: '蓝山咖啡',
    participants: 12,
    maxParticipants: 20,
    status: 'ongoing',
    statusText: '进行中'
  },
  {
    id: 3,
    title: '编程技术交流',
    description: '程序员技术分享会',
    image: 'https://picsum.photos/300/200?random=12',
    time: '上周六 19:00',
    location: '中关村',
    participants: 25,
    maxParticipants: 30,
    status: 'completed',
    statusText: '已完成'
  }
])

const activityForm = ref({
  title: '',
  description: '',
  type: '',
  location: '',
  datetime: '',
  maxParticipants: 10
})

const activityRules: FormRules = {
  title: [
    { required: true, message: '请输入活动标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度为2-50位', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入活动描述', trigger: 'blur' },
    { min: 10, max: 200, message: '描述长度为10-200位', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择活动类型', trigger: 'change' }
  ],
  location: [
    { required: true, message: '请输入活动地点', trigger: 'blur' }
  ],
  datetime: [
    { required: true, message: '请选择活动时间', trigger: 'change' }
  ],
  maxParticipants: [
    { required: true, message: '请设置最大参与人数', trigger: 'blur' }
  ]
}

const searchResults = ref([
  {
    id: 1,
    name: '摄影爱好者',
    avatar: 'https://picsum.photos/200/200?random=13',
    type: '用户'
  },
  {
    id: 2,
    name: '摄影技巧分享',
    avatar: 'https://picsum.photos/200/200?random=14',
    type: '活动'
  }
])

// 计算属性
const filteredMyActivities = computed(() => {
  return myActivities.value.filter(activity => activity.status === activeTab.value)
})

// 方法
const goBack = () => {
  router.back()
}

const selectMethod = (method: any) => {
  selectedMethod.value = method.type
  ElMessage.info(`选择${method.title}方式`)
}

const editInterests = () => {
  router.push('/profile/interests')
}

const updateLocation = () => {
  ElMessage.info('正在更新位置...')
}

const viewUserProfile = (user: any) => {
  router.push(`/user/${user.id}`)
}

const startChat = (user: any) => {
  ElMessage.success(`开始与${user.name}聊天`)
  router.push(`/chat/${user.id}`)
}

const addToFavorites = (user: any) => {
  ElMessage.success(`已将${user.name}添加到收藏`)
}

const viewActivityDetail = (activity: any) => {
  router.push(`/activity/${activity.id}`)
}

const joinActivity = (activity: any) => {
  if (activity.participants >= activity.maxParticipants) {
    ElMessage.warning('活动已满员')
    return
  }
  ElMessage.success(`成功参与${activity.title}`)
}

const createActivity = () => {
  selectedMethod.value = 'create'
}

const submitActivity = async () => {
  try {
    isCreating.value = true
    // 模拟创建活动
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('活动创建成功')
    selectedMethod.value = 'interest'
  } catch (error) {
    ElMessage.error('活动创建失败')
  } finally {
    isCreating.value = false
  }
}

const viewMyActivityDetail = (activity: any) => {
  router.push(`/activity/${activity.id}`)
}

const editActivity = (activity: any) => {
  ElMessage.info(`编辑活动: ${activity.title}`)
}

const cancelActivity = (activity: any) => {
  ElMessage.warning(`取消活动: ${activity.title}`)
}

const openActivityChat = (activity: any) => {
  ElMessage.info(`打开活动聊天: ${activity.title}`)
}

const showSearch = () => {
  showSearchDialog.value = true
}

const selectResult = (result: any) => {
  ElMessage.info(`选择${result.name}`)
  showSearchDialog.value = false
}

const viewAllMyActivities = () => {
  router.push('/my-activities')
}

// 生命周期
onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss" scoped>
.online-connect-page {
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

.connection-methods {
  padding: 20px;

  .methods-header {
    text-align: center;
    margin-bottom: 30px;

    h3 {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
    }

    p {
      font-size: 14px;
      color: #64748b;
    }
  }

  .methods-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;

    .method-card {
      padding: 25px;
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

      .method-icon {
        font-size: 48px;
        margin-bottom: 15px;
        text-align: center;
      }

      .method-title {
        font-size: 18px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 8px;
        text-align: center;
      }

      .method-desc {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 20px;
        text-align: center;
        line-height: 1.4;
      }

      .method-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 15px;

        .stat-item {
          text-align: center;

          .stat-value {
            display: block;
            font-size: 16px;
            font-weight: 700;
            color: #8b5cf6;
            margin-bottom: 3px;
          }

          .stat-label {
            font-size: 12px;
            color: #64748b;
          }
        }
      }

      .method-features {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;

        .feature-tag {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }
      }

      &.interest {
        border-left: 4px solid #10b981;
      }

      &.location {
        border-left: 4px solid #f59e0b;
      }

      &.create {
        border-left: 4px solid #8b5cf6;
      }
    }
  }
}

.interest-matching, .location-matching, .activity-creation {
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

    p {
      font-size: 14px;
      color: #64748b;
      margin: 5px 0 0 0;
    }

    .el-button {
      color: #8b5cf6;
      font-size: 14px;
    }
  }
}

.interest-categories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;

  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px 15px;
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

    &.active {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
      border-color: rgba(139, 92, 246, 0.5);
    }

    .category-icon {
      font-size: 32px;
    }

    .category-name {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }

    .category-count {
      font-size: 12px;
      color: #8b5cf6;
    }
  }
}

.matched-users {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .user-card {
    display: flex;
    align-items: center;
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

    .user-avatar {
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .user-status {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 16px;
        height: 16px;
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

    .user-info {
      flex: 1;

      .user-name {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 3px;
      }

      .user-age {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 8px;
      }

      .user-interests {
        display: flex;
        gap: 5px;
        margin-bottom: 8px;

        .interest-tag {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 11px;
        }
      }

      .user-location {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        color: #64748b;

        .el-icon {
          font-size: 12px;
        }
      }
    }

    .user-actions {
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
}

.location-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;

  .el-select {
    flex: 1;

    .el-select__input {
      border-radius: 12px;
      background: rgba(139, 92, 246, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.1);
      color: #334155;
    }
  }
}

.nearby-activities {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .activity-card {
    display: flex;
    gap: 20px;
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
      width: 120px;
      height: 120px;
      border-radius: 12px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .activity-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        background: #8b5cf6;
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }

      .activity-distance {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }
    }

    .activity-content {
      flex: 1;

      .activity-title {
        font-size: 18px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 8px;
      }

      .activity-desc {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 15px;
        line-height: 1.4;
      }

      .activity-meta {
        display: flex;
        gap: 20px;
        margin-bottom: 10px;
        font-size: 12px;
        color: #64748b;

        .activity-time, .activity-participants {
          display: flex;
          align-items: center;
          gap: 5px;

          .el-icon {
            font-size: 12px;
          }
        }
      }

      .activity-location {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        color: #8b5cf6;
        margin-bottom: 10px;

        .el-icon {
          font-size: 12px;
        }
      }

      .activity-organizer {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #64748b;

        .organizer-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          object-fit: cover;
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

.activity-form {
  .el-form-item {
    margin-bottom: 20px;

    .el-input, .el-select, .el-date-picker {
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

    .el-textarea {
      .el-textarea__inner {
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

    .submit-btn {
      width: 100%;
      background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
      border: none;
      color: white;
      font-weight: 600;
      font-size: 16px;
      padding: 15px;
      border-radius: 12px;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
      }

      &:disabled {
        background: rgba(148, 163, 184, 0.3);
        color: rgba(148, 163, 184, 0.8);
      }
    }
  }
}

.my-activities {
  padding: 0 20px 20px;

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

  .activities-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .tab-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
      position: relative;

      &:hover {
        color: #475569;
        transform: translateY(-1px);
      }

      &.active {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        color: white;
        transform: translateY(-1px);
      }

      .tab-count {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 600;
        min-width: 16px;
        text-align: center;
      }
    }
  }

  .activities-list {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .my-activity-item {
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

        .activity-status {
          position: absolute;
          top: 5px;
          right: 5px;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 600;

          &.upcoming {
            background: #f59e0b;
            color: white;
          }

          &.ongoing {
            background: #10b981;
            color: white;
          }

          &.completed {
            background: #64748b;
            color: white;
          }
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

          .activity-time, .activity-location, .activity-participants {
            display: flex;
            align-items: center;
            gap: 5px;

            .el-icon {
              font-size: 12px;
            }
          }
        }
      }

      .activity-actions {
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
</style>
