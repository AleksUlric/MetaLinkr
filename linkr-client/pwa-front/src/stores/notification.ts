import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'like' | 'match' | 'message' | 'system' | 'friend_request'
  title: string
  content: string
  avatar?: string
  isRead: boolean
  timestamp: number
  actionUrl?: string
  userId?: string
}

export const useNotificationStore = defineStore('notification', () => {
  // 通知列表
  const notifications = ref<Notification[]>([])
  
  // 未读通知数量
  const unreadCount = ref(0)
  
  // 是否正在加载
  const isLoading = ref(false)
  
  // 获取通知列表
  const getNotifications = async () => {
    isLoading.value = true
    
    try {
      // 模拟数据
      notifications.value = [
        {
          id: '1',
          type: 'like',
          title: '有人喜欢了你',
          content: '小雨 喜欢了你的照片',
          avatar: 'https://via.placeholder.com/50',
          isRead: false,
          timestamp: Date.now() - 1000,
          actionUrl: '/user/1',
          userId: '1'
        },
        {
          id: '2',
          type: 'match',
          title: '匹配成功！',
          content: '你和 阳光 互相喜欢了',
          avatar: 'https://via.placeholder.com/50',
          isRead: false,
          timestamp: Date.now() - 2000,
          actionUrl: '/chat/2',
          userId: '2'
        },
        {
          id: '3',
          type: 'message',
          title: '新消息',
          content: '张三 给你发了一条消息',
          avatar: 'https://via.placeholder.com/50',
          isRead: true,
          timestamp: Date.now() - 3000,
          actionUrl: '/chat/1',
          userId: '3'
        },
        {
          id: '4',
          type: 'system',
          title: '系统通知',
          content: '欢迎使用 MetaLinkr！',
          isRead: true,
          timestamp: Date.now() - 4000
        }
      ]
      
      // 计算未读数量
      unreadCount.value = notifications.value.filter(n => !n.isRead).length
      
    } catch (error) {
      console.error('获取通知失败:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  // 标记通知为已读
  const markAsRead = (notificationId: string) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && !notification.isRead) {
      notification.isRead = true
      unreadCount.value--
    }
  }
  
  // 标记所有通知为已读
  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true
      }
    })
    unreadCount.value = 0
  }
  
  // 删除通知
  const deleteNotification = (notificationId: string) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index > -1) {
      const notification = notifications.value[index]
      if (!notification.isRead) {
        unreadCount.value--
      }
      notifications.value.splice(index, 1)
    }
  }
  
  // 添加新通知
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now()
    }
    
    notifications.value.unshift(newNotification)
    
    if (!newNotification.isRead) {
      unreadCount.value++
    }
  }
  
  // 清除所有通知
  const clearAllNotifications = () => {
    notifications.value = []
    unreadCount.value = 0
  }
  
  // 初始化通知数据
  const initNotification = async () => {
    await getNotifications()
  }
  
  return {
    // 状态
    notifications,
    unreadCount,
    isLoading,
    
    // 方法
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    clearAllNotifications,
    initNotification
  }
})