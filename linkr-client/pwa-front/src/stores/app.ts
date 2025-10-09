import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 应用状态
  const isLoading = ref(false)
  const isDarkMode = ref(false)
  const isOnline = ref(true)
  
  // 全局消息
  const globalMessage = ref<{
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    show: boolean
  }>({
    type: 'info',
    message: '',
    show: false
  })
  
  // 显示加载状态
  const showLoading = () => {
    isLoading.value = true
  }
  
  // 隐藏加载状态
  const hideLoading = () => {
    isLoading.value = false
  }
  
  // 切换深色模式
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    // 保存到本地存储
    localStorage.setItem('darkMode', isDarkMode.value.toString())
  }
  
  // 显示全局消息
  const showMessage = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    globalMessage.value = {
      type,
      message,
      show: true
    }
    
    // 3秒后自动隐藏
    setTimeout(() => {
      globalMessage.value.show = false
    }, 3000)
  }
  
  // 显示成功消息
  const showSuccess = (message: string) => {
    showMessage('success', message)
  }
  
  // 显示错误消息
  const showError = (message: string) => {
    showMessage('error', message)
  }
  
  // 显示警告消息
  const showWarning = (message: string) => {
    showMessage('warning', message)
  }
  
  // 显示信息消息
  const showInfo = (message: string) => {
    showMessage('info', message)
  }
  
  // 初始化应用设置
  const initAppSettings = () => {
    // 从本地存储恢复深色模式设置
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      isDarkMode.value = savedDarkMode === 'true'
    }
    
    // 监听网络状态
    window.addEventListener('online', () => {
      isOnline.value = true
    })
    
    window.addEventListener('offline', () => {
      isOnline.value = false
    })
  }
  
  return {
    // 状态
    isLoading,
    isDarkMode,
    isOnline,
    globalMessage,
    
    // 方法
    showLoading,
    hideLoading,
    toggleDarkMode,
    showMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    initAppSettings
  }
})