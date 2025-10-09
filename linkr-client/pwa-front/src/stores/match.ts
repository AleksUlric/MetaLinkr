import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface MatchUser {
  id: string
  name: string
  age: number
  avatar: string
  photos: string[]
  bio: string
  interests: string[]
  location: string
  distance: number
  isOnline: boolean
  lastActive: number
}

export interface MatchResult {
  id: string
  userId: string
  isMatch: boolean
  timestamp: number
  message?: string
}

export const useMatchStore = defineStore('match', () => {
  // 推荐用户列表
  const recommendedUsers = ref<MatchUser[]>([])
  
  // 匹配结果列表
  const matchResults = ref<MatchResult[]>([])
  
  // 当前滑动用户
  const currentUser = ref<MatchUser | null>(null)
  
  // 是否正在加载
  const isLoading = ref(false)
  
  // 获取推荐用户
  const getRecommendedUsers = async () => {
    isLoading.value = true
    
    try {
      // 模拟数据
      recommendedUsers.value = [
        {
          id: '1',
          name: '小雨',
          age: 22,
          avatar: 'https://via.placeholder.com/300x400',
          photos: [
            'https://via.placeholder.com/300x400',
            'https://via.placeholder.com/300x400',
            'https://via.placeholder.com/300x400'
          ],
          bio: '喜欢旅行和摄影，寻找志同道合的朋友',
          interests: ['旅行', '摄影', '美食'],
          location: '北京市朝阳区',
          distance: 2.5,
          isOnline: true,
          lastActive: Date.now() - 1000
        },
        {
          id: '2',
          name: '阳光',
          age: 25,
          avatar: 'https://via.placeholder.com/300x400',
          photos: [
            'https://via.placeholder.com/300x400',
            'https://via.placeholder.com/300x400'
          ],
          bio: '程序员，热爱运动和音乐',
          interests: ['编程', '运动', '音乐'],
          location: '北京市海淀区',
          distance: 5.2,
          isOnline: false,
          lastActive: Date.now() - 3600000
        }
      ]
      
      // 设置第一个用户为当前用户
      if (recommendedUsers.value.length > 0) {
        currentUser.value = recommendedUsers.value[0]
      }
      
    } catch (error) {
      console.error('获取推荐用户失败:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  // 喜欢用户
  const likeUser = async (userId: string) => {
    try {
      // 模拟API调用
      const result: MatchResult = {
        id: Date.now().toString(),
        userId,
        isMatch: Math.random() > 0.5, // 模拟匹配结果
        timestamp: Date.now()
      }
      
      matchResults.value.push(result)
      
      // 移除当前用户
      recommendedUsers.value = recommendedUsers.value.filter(u => u.id !== userId)
      
      // 设置下一个用户为当前用户
      if (recommendedUsers.value.length > 0) {
        currentUser.value = recommendedUsers.value[0]
      } else {
        currentUser.value = null
        // 重新获取推荐用户
        await getRecommendedUsers()
      }
      
      return result
      
    } catch (error) {
      console.error('喜欢用户失败:', error)
      throw error
    }
  }
  
  // 不喜欢用户
  const dislikeUser = async (userId: string) => {
    try {
      // 移除当前用户
      recommendedUsers.value = recommendedUsers.value.filter(u => u.id !== userId)
      
      // 设置下一个用户为当前用户
      if (recommendedUsers.value.length > 0) {
        currentUser.value = recommendedUsers.value[0]
      } else {
        currentUser.value = null
        // 重新获取推荐用户
        await getRecommendedUsers()
      }
      
    } catch (error) {
      console.error('不喜欢用户失败:', error)
      throw error
    }
  }
  
  // 获取匹配结果
  const getMatchResults = async () => {
    // 模拟数据
    matchResults.value = [
      {
        id: '1',
        userId: '1',
        isMatch: true,
        timestamp: Date.now() - 3600000,
        message: '你们互相喜欢了！'
      },
      {
        id: '2',
        userId: '2',
        isMatch: false,
        timestamp: Date.now() - 7200000
      }
    ]
  }
  
  // 初始化匹配数据
  const initMatch = async () => {
    await Promise.all([
      getRecommendedUsers(),
      getMatchResults()
    ])
  }
  
  return {
    // 状态
    recommendedUsers,
    matchResults,
    currentUser,
    isLoading,
    
    // 方法
    getRecommendedUsers,
    likeUser,
    dislikeUser,
    getMatchResults,
    initMatch
  }
})