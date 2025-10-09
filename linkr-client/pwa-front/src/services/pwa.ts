import { ref } from 'vue'

// PWA状态管理
export const isOnline = ref(navigator.onLine)
export const isInstalled = ref(false)
export const canInstall = ref(false)
export const installPrompt = ref<any>(null)

// 网络状态监听
export const initNetworkStatus = () => {
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
    console.log('网络状态:', isOnline.value ? '在线' : '离线')
  }

  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  
  return () => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  }
}

// PWA安装提示
export const initInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    installPrompt.value = e
    canInstall.value = true
    console.log('PWA可以安装')
  })

  window.addEventListener('appinstalled', () => {
    isInstalled.value = true
    canInstall.value = false
    installPrompt.value = null
    console.log('PWA已安装')
  })
}

// 安装PWA
export const installPWA = async () => {
  if (!installPrompt.value) {
    throw new Error('PWA安装提示不可用')
  }

  const result = await installPrompt.value.prompt()
  console.log('安装结果:', result)
  
  installPrompt.value = null
  canInstall.value = false
}

// 推送通知权限
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    throw new Error('此浏览器不支持通知')
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    throw new Error('通知权限被拒绝')
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

// 发送推送通知
export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: 'metalinkr-notification',
      requireInteraction: false,
      ...options
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    return notification
  }
}

// 注册Service Worker
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker注册成功:', registration)
      
      // 监听更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 有新版本可用
              console.log('新版本可用，请刷新页面')
              showUpdateNotification()
            }
          })
        }
      })

      return registration
    } catch (error) {
      console.error('Service Worker注册失败:', error)
    }
  }
}

// 显示更新通知
const showUpdateNotification = () => {
  if (confirm('发现新版本，是否立即更新？')) {
    window.location.reload()
  }
}

// 离线数据存储
export const offlineStorage = {
  // 存储数据到IndexedDB
  async setItem(key: string, value: any) {
    try {
      const db = await openDB()
      const transaction = db.transaction(['offlineData'], 'readwrite')
      const store = transaction.objectStore('offlineData')
      await store.put({ key, value, timestamp: Date.now() })
    } catch (error) {
      console.error('离线存储失败:', error)
    }
  },

  // 从IndexedDB获取数据
  async getItem(key: string) {
    try {
      const db = await openDB()
      const transaction = db.transaction(['offlineData'], 'readonly')
      const store = transaction.objectStore('offlineData')
      const result = await store.get(key)
      return result?.value
    } catch (error) {
      console.error('离线数据获取失败:', error)
      return null
    }
  },

  // 删除数据
  async removeItem(key: string) {
    try {
      const db = await openDB()
      const transaction = db.transaction(['offlineData'], 'readwrite')
      const store = transaction.objectStore('offlineData')
      await store.delete(key)
    } catch (error) {
      console.error('离线数据删除失败:', error)
    }
  },

  // 清空所有数据
  async clear() {
    try {
      const db = await openDB()
      const transaction = db.transaction(['offlineData'], 'readwrite')
      const store = transaction.objectStore('offlineData')
      await store.clear()
    } catch (error) {
      console.error('离线数据清空失败:', error)
    }
  }
}

// 打开IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MetaLinkrOffline', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('offlineData')) {
        const store = db.createObjectStore('offlineData', { keyPath: 'key' })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
  })
}

// 同步离线数据到服务器
export const syncOfflineData = async () => {
  if (!isOnline.value) {
    console.log('离线状态，跳过数据同步')
    return
  }

  try {
    const db = await openDB()
    const transaction = db.transaction(['offlineData'], 'readonly')
    const store = transaction.objectStore('offlineData')
    const allData = await store.getAll()

    for (const item of allData) {
      try {
        // 这里应该调用实际的API同步数据
        console.log('同步数据:', item.key, item.value)
        // await api.syncData(item.key, item.value)
        
        // 同步成功后删除离线数据
        await offlineStorage.removeItem(item.key)
      } catch (error) {
        console.error('数据同步失败:', error)
      }
    }
  } catch (error) {
    console.error('离线数据同步失败:', error)
  }
}

// 初始化PWA功能
export const initPWA = async () => {
  try {
    // 初始化网络状态监听
    initNetworkStatus()
    
    // 初始化安装提示
    initInstallPrompt()
    
    // 注册Service Worker
    await registerServiceWorker()
    
    // 请求通知权限
    await requestNotificationPermission()
    
    // 定期同步离线数据
    setInterval(syncOfflineData, 30000) // 每30秒同步一次
    
    console.log('PWA初始化完成')
  } catch (error) {
    console.error('PWA初始化失败:', error)
  }
}

// 导出PWA状态
export const usePWA = () => {
  return {
    isOnline,
    isInstalled,
    canInstall,
    installPrompt,
    installPWA,
    sendNotification,
    offlineStorage,
    syncOfflineData
  }
}

