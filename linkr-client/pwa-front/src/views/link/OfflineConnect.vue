<template>
  <div class="offline-connect-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="nav-title">线下连接</div>
      <div class="nav-right">
        <el-button :icon="Location" circle size="small" @click="refreshLocation" />
        <el-button :icon="Setting" circle size="small" @click="openSettings" />
      </div>
    </div>

    <!-- 位置信息 -->
    <div class="location-info">
      <div class="location-card">
        <div class="location-icon">📍</div>
        <div class="location-details">
          <div class="location-name">{{ currentLocation.name }}</div>
          <div class="location-address">{{ currentLocation.address }}</div>
          <div class="location-distance">精确度: {{ currentLocation.accuracy }}米</div>
        </div>
        <div class="location-status" :class="locationStatus">
          {{ locationStatusText }}
        </div>
      </div>
    </div>

    <!-- 附近的人 -->
    <div class="nearby-section">
      <div class="section-header">
        <h3>附近的人</h3>
        <div class="filter-options">
          <el-select v-model="distanceFilter" placeholder="距离" size="small">
            <el-option label="500米内" value="500" />
            <el-option label="1公里内" value="1000" />
            <el-option label="3公里内" value="3000" />
            <el-option label="5公里内" value="5000" />
          </el-select>
        </div>
      </div>
      
      <div class="nearby-list">
        <div 
          v-for="person in nearbyPeople" 
          :key="person.id"
          class="person-item"
          @click="viewPersonDetail(person)"
        >
          <div class="person-avatar">
            <img :src="person.avatar" :alt="person.name" />
            <div class="person-status" :class="person.status"></div>
            <div class="person-distance">{{ person.distance }}m</div>
          </div>
          <div class="person-info">
            <div class="person-name">{{ person.name }}</div>
            <div class="person-age">{{ person.age }}岁</div>
            <div class="person-tags">
              <span 
                v-for="tag in person.tags" 
                :key="tag"
                class="person-tag"
              >
                {{ tag }}
              </span>
            </div>
            <div class="person-location">
              <el-icon><Location /></el-icon>
              <span>{{ person.location }}</span>
            </div>
          </div>
          <div class="person-actions">
            <el-button 
              :icon="ChatDotRound" 
              circle 
              size="small"
              @click.stop="startChat(person)"
            />
            <el-button 
              :icon="Star" 
              circle 
              size="small"
              @click.stop="addToFavorites(person)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 附近的活动 -->
    <div class="activities-section">
      <div class="section-header">
        <h3>附近活动</h3>
        <el-button text @click="viewAllActivities">查看更多</el-button>
      </div>
      
      <div class="activities-grid">
        <div 
          v-for="activity in nearbyActivities" 
          :key="activity.id"
          class="activity-card"
          @click="joinActivity(activity)"
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
          </div>
          <div class="activity-action">
            <el-button 
              type="primary" 
              size="small"
              :disabled="activity.participants >= activity.maxParticipants"
            >
              {{ activity.participants >= activity.maxParticipants ? '已满' : '参与' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 附近的地点 -->
    <div class="places-section">
      <div class="section-header">
        <h3>附近地点</h3>
        <el-button text @click="viewAllPlaces">查看更多</el-button>
      </div>
      
      <div class="places-list">
        <div 
          v-for="place in nearbyPlaces" 
          :key="place.id"
          class="place-item"
          @click="viewPlaceDetail(place)"
        >
          <div class="place-image">
            <img :src="place.image" :alt="place.name" />
            <div class="place-rating">{{ place.rating }}⭐</div>
          </div>
          <div class="place-info">
            <div class="place-name">{{ place.name }}</div>
            <div class="place-category">{{ place.category }}</div>
            <div class="place-address">{{ place.address }}</div>
            <div class="place-meta">
              <div class="place-distance">
                <el-icon><Location /></el-icon>
                <span>{{ place.distance }}m</span>
              </div>
              <div class="place-checkins">
                <el-icon><User /></el-icon>
                <span>{{ place.checkins }} 人打卡</span>
              </div>
            </div>
          </div>
          <div class="place-action">
            <el-button 
              :icon="Location" 
              circle 
              size="small"
              @click.stop="navigateToPlace(place)"
            />
            <el-button 
              :icon="Star" 
              circle 
              size="small"
              @click.stop="checkIn(place)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 连接历史 -->
    <div class="connection-history">
      <div class="section-header">
        <h3>连接历史</h3>
        <el-button text @click="viewAllHistory">查看全部</el-button>
      </div>
      
      <div class="history-timeline">
        <div 
          v-for="history in connectionHistory" 
          :key="history.id"
          class="history-item"
          @click="reconnect(history)"
        >
          <div class="history-time">{{ formatTime(history.time) }}</div>
          <div class="history-content">
            <div class="history-type">{{ history.type }}</div>
            <div class="history-desc">{{ history.description }}</div>
            <div class="history-location">{{ history.location }}</div>
          </div>
          <div class="history-action">
            <el-button :icon="RefreshRight" circle size="small" />
          </div>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <el-dialog 
      v-model="showSettingsDialog" 
      title="线下连接设置"
      width="90%"
      class="settings-dialog"
    >
      <div class="settings-content">
        <div class="setting-group">
          <div class="setting-title">位置设置</div>
          <div class="setting-item">
            <span class="setting-label">自动更新位置</span>
            <el-switch v-model="autoUpdateLocation" />
          </div>
          <div class="setting-item">
            <span class="setting-label">位置共享</span>
            <el-switch v-model="shareLocation" />
          </div>
          <div class="setting-item">
            <span class="setting-label">精确位置</span>
            <el-switch v-model="preciseLocation" />
          </div>
        </div>
        
        <div class="setting-group">
          <div class="setting-title">隐私设置</div>
          <div class="setting-item">
            <span class="setting-label">对附近的人可见</span>
            <el-switch v-model="visibleToNearby" />
          </div>
          <div class="setting-item">
            <span class="setting-label">匿名模式</span>
            <el-switch v-model="anonymousMode" />
          </div>
        </div>
        
        <div class="setting-group">
          <div class="setting-title">通知设置</div>
          <div class="setting-item">
            <span class="setting-label">附近的人提醒</span>
            <el-switch v-model="nearbyAlert" />
          </div>
          <div class="setting-item">
            <span class="setting-label">活动提醒</span>
            <el-switch v-model="activityAlert" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Location, 
  Setting, 
  ChatDotRound, 
  Star, 
  Clock, 
  User, 
  RefreshRight 
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const router = useRouter()

// 响应式数据
const locationStatus = ref('active')
const locationStatusText = ref('已定位')
const distanceFilter = ref('1000')
const showSettingsDialog = ref(false)
const autoUpdateLocation = ref(true)
const shareLocation = ref(true)
const preciseLocation = ref(true)
const visibleToNearby = ref(true)
const anonymousMode = ref(false)
const nearbyAlert = ref(true)
const activityAlert = ref(true)

const currentLocation = ref({
  name: '市中心商业区',
  address: '北京市朝阳区建国门外大街1号',
  accuracy: 5
})

const nearbyPeople = ref([
  {
    id: 1,
    name: '小明',
    avatar: 'https://picsum.photos/200/200?random=1',
    age: 25,
    distance: 120,
    status: 'online',
    tags: ['摄影', '旅行'],
    location: '星巴克咖啡'
  },
  {
    id: 2,
    name: '小红',
    avatar: 'https://picsum.photos/200/200?random=2',
    age: 23,
    distance: 350,
    status: 'online',
    tags: ['音乐', '读书'],
    location: '图书馆'
  },
  {
    id: 3,
    name: '小芳',
    avatar: 'https://picsum.photos/200/200?random=3',
    age: 27,
    distance: 680,
    status: 'offline',
    tags: ['健身', '美食'],
    location: '健身房'
  }
])

const nearbyActivities = ref([
  {
    id: 1,
    title: '周末摄影活动',
    description: '一起探索城市美景',
    image: 'https://picsum.photos/300/200?random=4',
    type: '摄影',
    distance: 200,
    time: '明天 09:00',
    participants: 8,
    maxParticipants: 15,
    location: '朝阳公园'
  },
  {
    id: 2,
    title: '咖啡品鉴会',
    description: '分享咖啡文化',
    image: 'https://picsum.photos/300/200?random=5',
    type: '美食',
    distance: 450,
    time: '后天 14:00',
    participants: 12,
    maxParticipants: 20,
    location: '蓝山咖啡'
  }
])

const nearbyPlaces = ref([
  {
    id: 1,
    name: '朝阳公园',
    category: '公园',
    address: '朝阳区朝阳公园南路1号',
    image: 'https://picsum.photos/300/200?random=6',
    rating: 4.5,
    distance: 800,
    checkins: 156
  },
  {
    id: 2,
    name: '三里屯太古里',
    category: '购物中心',
    address: '朝阳区三里屯路19号',
    image: 'https://picsum.photos/300/200?random=7',
    rating: 4.8,
    distance: 1200,
    checkins: 892
  }
])

const connectionHistory = ref([
  {
    id: 1,
    type: '线下相遇',
    description: '在星巴克咖啡遇到小明',
    location: '星巴克咖啡',
    time: '2024-01-15 14:30:00'
  },
  {
    id: 2,
    type: '活动参与',
    description: '参加了摄影活动',
    location: '朝阳公园',
    time: '2024-01-14 09:00:00'
  },
  {
    id: 3,
    type: '地点打卡',
    description: '在三里屯太古里打卡',
    location: '三里屯太古里',
    time: '2024-01-13 16:20:00'
  }
])

// 方法
const goBack = () => {
  router.back()
}

const refreshLocation = () => {
  ElMessage.info('正在更新位置...')
  // 模拟位置更新
  setTimeout(() => {
    ElMessage.success('位置更新成功')
  }, 1000)
}

const openSettings = () => {
  showSettingsDialog.value = true
}

const viewPersonDetail = (person: any) => {
  router.push(`/user/${person.id}`)
}

const startChat = (person: any) => {
  ElMessage.success(`开始与${person.name}聊天`)
  router.push(`/chat/${person.id}`)
}

const addToFavorites = (person: any) => {
  ElMessage.success(`已将${person.name}添加到收藏`)
}

const joinActivity = (activity: any) => {
  if (activity.participants >= activity.maxParticipants) {
    ElMessage.warning('活动已满员')
    return
  }
  ElMessage.success(`成功参与${activity.title}`)
}

const viewPlaceDetail = (place: any) => {
  router.push(`/place/${place.id}`)
}

const navigateToPlace = (place: any) => {
  ElMessage.info(`正在导航到${place.name}`)
}

const checkIn = (place: any) => {
  ElMessage.success(`已在${place.name}打卡`)
}

const reconnect = (history: any) => {
  ElMessage.info(`重新连接${history.type}`)
}

const formatTime = (time: string) => {
  return dayjs(time).fromNow()
}

const viewAllActivities = () => {
  router.push('/activities')
}

const viewAllPlaces = () => {
  router.push('/places')
}

const viewAllHistory = () => {
  router.push('/history')
}

// 生命周期
onMounted(() => {
  // 模拟获取位置信息
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('位置获取成功:', position)
        locationStatus.value = 'active'
        locationStatusText.value = '已定位'
      },
      (error) => {
        console.error('位置获取失败:', error)
        locationStatus.value = 'error'
        locationStatusText.value = '定位失败'
      }
    )
  }
})
</script>

<style lang="scss" scoped>
.offline-connect-page {
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

.location-info {
  padding: 20px;

  .location-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);

    .location-icon {
      font-size: 32px;
      width: 50px;
      text-align: center;
    }

    .location-details {
      flex: 1;

      .location-name {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 5px;
      }

      .location-address {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 3px;
      }

      .location-distance {
        font-size: 12px;
        color: #8b5cf6;
      }
    }

    .location-status {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;

      &.active {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }

      &.error {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }
    }
  }
}

.nearby-section, .activities-section, .places-section, .connection-history {
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

    .filter-options {
      .el-select {
        .el-select__input {
          border-radius: 12px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.1);
          color: #334155;
        }
      }
    }
  }
}

.nearby-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .person-item {
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

    .person-avatar {
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

      .person-status {
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

      .person-distance {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #8b5cf6;
        color: white;
        padding: 2px 6px;
        border-radius: 8px;
        font-size: 10px;
        font-weight: 600;
      }
    }

    .person-info {
      flex: 1;

      .person-name {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 3px;
      }

      .person-age {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 8px;
      }

      .person-tags {
        display: flex;
        gap: 5px;
        margin-bottom: 8px;

        .person-tag {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 11px;
        }
      }

      .person-location {
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

    .person-actions {
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

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  .activity-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
    }

    .activity-image {
      position: relative;
      height: 120px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .activity-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background: #8b5cf6;
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }

      .activity-distance {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }
    }

    .activity-content {
      padding: 20px;

      .activity-title {
        font-size: 16px;
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
        gap: 15px;
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
        margin-bottom: 15px;

        .el-icon {
          font-size: 12px;
        }
      }
    }

    .activity-action {
      padding: 0 20px 20px;

      .el-button {
        width: 100%;
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

.places-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .place-item {
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

    .place-image {
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

      .place-rating {
        position: absolute;
        bottom: 5px;
        right: 5px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 2px 6px;
        border-radius: 8px;
        font-size: 10px;
        font-weight: 600;
      }
    }

    .place-info {
      flex: 1;

      .place-name {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 3px;
      }

      .place-category {
        font-size: 12px;
        color: #8b5cf6;
        margin-bottom: 5px;
      }

      .place-address {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 10px;
      }

      .place-meta {
        display: flex;
        gap: 15px;
        font-size: 12px;
        color: #64748b;

        .place-distance, .place-checkins {
          display: flex;
          align-items: center;
          gap: 5px;

          .el-icon {
            font-size: 12px;
          }
        }
      }
    }

    .place-action {
      display: flex;
      flex-direction: column;
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

.history-timeline {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .history-item {
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

    .history-time {
      font-size: 12px;
      color: #8b5cf6;
      font-weight: 600;
      min-width: 80px;
    }

    .history-content {
      flex: 1;

      .history-type {
        font-size: 14px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 3px;
      }

      .history-desc {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 3px;
      }

      .history-location {
        font-size: 12px;
        color: #8b5cf6;
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

.settings-dialog {
  .settings-content {
    .setting-group {
      margin-bottom: 30px;

      .setting-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(196, 181, 253, 0.2);
      }

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
</style>
