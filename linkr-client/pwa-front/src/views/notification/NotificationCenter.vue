<template>
  <div class="notification-center-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="nav-title">消息中心</div>
      <div class="nav-right">
        <el-button :icon="Setting" circle size="small" @click="showSettings" />
        <el-button :icon="Check" circle size="small" @click="markAllRead" />
      </div>
    </div>

    <!-- 通知分类 -->
    <div class="notification-tabs">
      <div class="tab-nav">
        <div 
          v-for="tab in notificationTabs" 
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <el-icon><component :is="tab.icon" /></el-icon>
          <span>{{ tab.name }}</span>
          <div v-if="tab.unread > 0" class="unread-badge">{{ tab.unread }}</div>
        </div>
      </div>
    </div>

    <!-- 通知列表 -->
    <div class="notification-list">
      <div v-if="filteredNotifications.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <div class="empty-text">暂无{{ getCurrentTabName() }}消息</div>
      </div>
      
      <div v-else class="notifications">
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id"
          class="notification-item"
          :class="{ 
            'unread': !notification.read,
            'important': notification.important,
            'system': notification.type === 'system'
          }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-avatar">
            <img v-if="notification.avatar" :src="notification.avatar" :alt="notification.sender" />
            <div v-else class="default-avatar">
              <el-icon><component :is="getNotificationIcon(notification.type)" /></el-icon>
            </div>
            <div v-if="!notification.read" class="unread-dot"></div>
          </div>
          
          <div class="notification-content">
            <div class="notification-header">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-time">{{ formatTime(notification.time) }}</div>
            </div>
            <div class="notification-message">{{ notification.message }}</div>
            <div v-if="notification.action" class="notification-action">
              <el-button 
                v-if="notification.action.type === 'button'"
                :type="notification.action.buttonType"
                size="small"
                @click.stop="handleAction(notification)"
              >
                {{ notification.action.text }}
              </el-button>
            </div>
          </div>
          
          <div class="notification-actions">
            <el-button 
              :icon="Delete" 
              circle 
              size="small" 
              @click.stop="deleteNotification(notification.id)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 通知设置弹窗 -->
    <el-dialog 
      v-model="showSettingsDialog" 
      title="通知设置"
      width="90%"
      class="settings-dialog"
    >
      <div class="settings-content">
        <div class="setting-section">
          <div class="section-title">推送通知</div>
          <div class="setting-items">
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-title">新消息通知</div>
                <div class="setting-desc">接收来自好友的新消息</div>
              </div>
              <el-switch v-model="settings.messages" />
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-title">点赞通知</div>
                <div class="setting-desc">有人点赞你的动态时通知</div>
              </div>
              <el-switch v-model="settings.likes" />
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-title">评论通知</div>
                <div class="setting-desc">有人评论你的动态时通知</div>
              </div>
              <el-switch v-model="settings.comments" />
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-title">关注通知</div>
                <div class="setting-desc">有人关注你时通知</div>
              </div>
              <el-switch v-model="settings.follows" />
            </div>
          </div>
        </div>
        
        <div class="setting-section">
          <div class="section-title">通知时间</div>
          <div class="setting-items">
            <div class="setting-item">
              <div class="setting-info">
                <div class="setting-title">免打扰时间</div>
                <div class="setting-desc">设置免打扰时间段</div>
              </div>
              <el-switch v-model="settings.dndEnabled" />
            </div>
            <div v-if="settings.dndEnabled" class="time-range">
              <el-time-picker
                v-model="settings.dndStart"
                placeholder="开始时间"
                format="HH:mm"
                value-format="HH:mm"
              />
              <span class="time-separator">至</span>
              <el-time-picker
                v-model="settings.dndEnd"
                placeholder="结束时间"
                format="HH:mm"
                value-format="HH:mm"
              />
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
  Setting, 
  Check, 
  Delete,
  ChatDotRound,
  StarFilled,
  User,
  Bell,
  Star,
  Location,
  VideoCamera
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const router = useRouter()

// 响应式数据
const activeTab = ref('all')
const showSettingsDialog = ref(false)

const notificationTabs = ref([
  { key: 'all', name: '全部', icon: 'Bell', unread: 12 },
  { key: 'message', name: '消息', icon: 'ChatDotRound', unread: 5 },
  { key: 'like', name: '点赞', icon: 'StarFilled', unread: 3 },
  { key: 'follow', name: '关注', icon: 'User', unread: 2 },
  { key: 'system', name: '系统', icon: 'Bell', unread: 2 }
])

const notifications = ref([
  {
    id: 1,
    type: 'message',
    title: '新消息',
    message: '小红 给你发了一条消息',
    sender: '小红',
    avatar: 'https://picsum.photos/200/200?random=1',
    time: '2024-01-15 14:30:00',
    read: false,
    important: false,
    action: {
      type: 'button',
      text: '查看',
      buttonType: 'primary'
    }
  },
  {
    id: 2,
    type: 'like',
    title: '点赞通知',
    message: '小明 点赞了你的动态「今天的夕阳真美」',
    sender: '小明',
    avatar: 'https://picsum.photos/200/200?random=2',
    time: '2024-01-15 13:45:00',
    read: false,
    important: false,
    action: {
      type: 'button',
      text: '查看',
      buttonType: 'primary'
    }
  },
  {
    id: 3,
    type: 'follow',
    title: '新关注',
    message: '小芳 关注了你',
    sender: '小芳',
    avatar: 'https://picsum.photos/200/200?random=3',
    time: '2024-01-15 12:20:00',
    read: false,
    important: false,
    action: {
      type: 'button',
      text: '回关',
      buttonType: 'success'
    }
  },
  {
    id: 4,
    type: 'system',
    title: '系统通知',
    message: '你的账号已通过实名认证',
    sender: '系统',
    avatar: null,
    time: '2024-01-15 10:15:00',
    read: true,
    important: true,
    action: null
  },
  {
    id: 5,
    type: 'message',
    title: '新消息',
    message: '大壮 邀请你加入语音派对',
    sender: '大壮',
    avatar: 'https://picsum.photos/200/200?random=4',
    time: '2024-01-15 09:30:00',
    read: true,
    important: false,
    action: {
      type: 'button',
      text: '加入',
      buttonType: 'primary'
    }
  },
  {
    id: 6,
    type: 'like',
    title: '点赞通知',
    message: '小丽 点赞了你的动态「周末的咖啡时光」',
    sender: '小丽',
    avatar: 'https://picsum.photos/200/200?random=5',
    time: '2024-01-14 18:20:00',
    read: true,
    important: false,
    action: {
      type: 'button',
      text: '查看',
      buttonType: 'primary'
    }
  }
])

const settings = ref({
  messages: true,
  likes: true,
  comments: true,
  follows: true,
  dndEnabled: false,
  dndStart: '22:00',
  dndEnd: '08:00'
})

// 计算属性
const filteredNotifications = computed(() => {
  if (activeTab.value === 'all') {
    return notifications.value
  }
  return notifications.value.filter(n => n.type === activeTab.value)
})

// 方法
const goBack = () => {
  router.back()
}

const showSettings = () => {
  showSettingsDialog.value = true
}

const markAllRead = () => {
  notifications.value.forEach(n => n.read = true)
  notificationTabs.value.forEach(tab => tab.unread = 0)
  ElMessage.success('已标记所有消息为已读')
}

const getCurrentTabName = () => {
  const tab = notificationTabs.value.find(t => t.key === activeTab.value)
  return tab ? tab.name : '全部'
}

const getNotificationIcon = (type: string) => {
  const iconMap = {
    message: 'ChatDotRound',
    like: 'StarFilled',
    follow: 'User',
    system: 'Bell'
  }
  return iconMap[type as keyof typeof iconMap] || 'Bell'
}

const formatTime = (time: string) => {
  return dayjs(time).fromNow()
}

const handleNotificationClick = (notification: any) => {
  if (!notification.read) {
    notification.read = true
    updateUnreadCount()
  }
  
  // 根据通知类型执行相应操作
  switch (notification.type) {
    case 'message':
      router.push(`/chat/${notification.sender}`)
      break
    case 'like':
    case 'follow':
      router.push(`/user/${notification.sender}`)
      break
    case 'system':
      // 系统通知通常不需要跳转
      break
  }
}

const handleAction = (notification: any) => {
  switch (notification.action.text) {
    case '查看':
      handleNotificationClick(notification)
      break
    case '回关':
      ElMessage.success(`已关注 ${notification.sender}`)
      break
    case '加入':
      ElMessage.success('正在加入语音派对...')
      router.push('/voice/party/1')
      break
  }
}

const deleteNotification = (id: number) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
    updateUnreadCount()
    ElMessage.success('通知已删除')
  }
}

const updateUnreadCount = () => {
  notificationTabs.value.forEach(tab => {
    if (tab.key === 'all') {
      tab.unread = notifications.value.filter(n => !n.read).length
    } else {
      tab.unread = notifications.value.filter(n => n.type === tab.key && !n.read).length
    }
  })
}

// 生命周期
onMounted(() => {
  updateUnreadCount()
})
</script>

<style lang="scss" scoped>
.notification-center-page {
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

.notification-tabs {
  padding: 0 20px;
  margin-bottom: 20px;

  .tab-nav {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 10px;

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
      white-space: nowrap;
      position: relative;
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
      }

      .el-icon {
        font-size: 16px;
      }

      span {
        font-size: 14px;
        font-weight: 600;
      }

      .unread-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ef4444;
        color: white;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 10px;
        border: 2px solid white;
        min-width: 16px;
        text-align: center;
      }
    }
  }
}

.notification-list {
  padding: 0 20px 20px;

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #64748b;

    .empty-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }

    .empty-text {
      font-size: 16px;
    }
  }

  .notifications {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .notification-item {
      display: flex;
      align-items: flex-start;
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

      &.unread {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
        border-color: rgba(139, 92, 246, 0.3);
      }

      &.important {
        border-left: 4px solid #f59e0b;
      }

      &.system {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
        border-color: rgba(59, 130, 246, 0.3);
      }

      .notification-avatar {
        position: relative;
        width: 50px;
        height: 50px;
        flex-shrink: 0;

        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .default-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;

          .el-icon {
            font-size: 24px;
          }
        }

        .unread-dot {
          position: absolute;
          top: 0;
          right: 0;
          width: 12px;
          height: 12px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
        }
      }

      .notification-content {
        flex: 1;
        min-width: 0;

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;

          .notification-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
          }

          .notification-time {
            font-size: 12px;
            color: #94a3b8;
            white-space: nowrap;
            margin-left: 10px;
          }
        }

        .notification-message {
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .notification-action {
          .el-button {
            padding: 6px 16px;
            border-radius: 16px;
            font-size: 13px;
            font-weight: 600;
          }
        }
      }

      .notification-actions {
        .el-button {
          background: rgba(239, 68, 68, 0.1);
          border: none;
          color: #ef4444;

          &:hover {
            background: rgba(239, 68, 68, 0.2);
          }
        }
      }
    }
  }
}

.settings-dialog {
  .settings-content {
    .setting-section {
      margin-bottom: 30px;

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 15px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(196, 181, 253, 0.2);
      }

      .setting-items {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(139, 92, 246, 0.1);

          .setting-info {
            flex: 1;

            .setting-title {
              font-size: 15px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 5px;
            }

            .setting-desc {
              font-size: 13px;
              color: #64748b;
              line-height: 1.4;
            }
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

        .time-range {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 15px;
          padding: 15px;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(139, 92, 246, 0.1);

          .time-separator {
            color: #64748b;
            font-size: 14px;
          }

          .el-time-picker {
            .el-input__inner {
              border-radius: 8px;
              background: rgba(255, 255, 255, 0.8);
              border: 1px solid rgba(139, 92, 246, 0.2);
            }
          }
        }
      }
    }
  }
}
</style>
