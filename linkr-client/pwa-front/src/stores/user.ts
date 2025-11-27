import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserProfile } from '../types/user'
import { mockUser, mockUserProfile } from '../mock/user'
import { currentSmsApi } from '../services/sms'
import { get, post } from '@/utils/request'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const profile = ref<UserProfile | null>(null)

  // Session认证，不需要token
  const isLoggedIn = computed(() => !!user.value)

  const initUser = async () => {
    try {
      // 通过Session获取用户信息
      const userData = await get<User>('/api/user/current')
      if (userData) {
        user.value = userData
        // profile可以从user数据中提取或单独获取
        profile.value = mockUserProfile // 临时使用mock，后续可以改为从API获取
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // Session可能已过期，清除用户信息
      logout()
    }
  }

  const login = async (_username: string, _password: string) => {
    try {
      // 调用登录API（Session会自动设置）
      await post('/api/auth/login', {
        username: _username,
        password: _password
      })
      
      // 登录成功后获取用户信息
      await initUser()
      
      return { success: true }
    } catch (error: any) {
      console.error('登录失败:', error)
      return { success: false, message: error.message || '登录失败' }
    }
  }

  // 手机号登录
  const loginWithPhone = async (phone: string, code: string) => {
    try {
      // 调用短信登录API（Session会自动设置）
      await post('/api/auth/login/sms', {
        phone,
        code
      })
      
      // 登录成功后获取用户信息
      await initUser()
      
      return { success: true }
    } catch (error: any) {
      console.error('手机号登录失败:', error)
      return { success: false, message: error.message || '手机号登录失败' }
    }
  }

  // 发送短信验证码
  const sendSmsCode = async (phone: string, type: 'login' | 'register' | 'reset' = 'login') => {
    try {
      const result = await currentSmsApi.sendSmsCode(phone, type)
      return result
    } catch (error) {
      console.error('发送验证码失败:', error)
      return { success: false, message: '发送验证码失败' }
    }
  }

  // 验证短信验证码
  const verifySmsCode = async (phone: string, code: string) => {
    try {
      const result = await currentSmsApi.verifySmsCode(phone, code)
      return result
    } catch (error) {
      console.error('验证码验证失败:', error)
      return { success: false, message: '验证码错误' }
    }
  }

  const register = async (_userData: any) => {
    try {
      // 这里应该调用注册API
      // const response = await api.register(userData)
      
      return { success: true }
    } catch (error) {
      console.error('注册失败:', error)
      return { success: false, message: '注册失败' }
    }
  }

  const logout = async () => {
    try {
      // 调用登出API（清除服务端Session）
      await post('/api/auth/logout').catch(() => {
        // 即使登出API失败，也清除本地状态
      })
    } catch (error) {
      // 忽略错误
    } finally {
      user.value = null
      profile.value = null
      // 清除可能的本地存储（兼容旧代码）
      localStorage.removeItem('token')
    }
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      // 调用后端API更新用户信息（使用Session认证）
      await post('/api/user/complete-profile', profileData)
      
      // 更新本地用户信息
      if (profile.value) {
        Object.assign(profile.value, profileData)
      }
      if (user.value) {
        Object.assign(user.value, profileData)
      }
      
      return { success: true }
    } catch (error: any) {
      console.error('更新用户信息失败:', error)
      return { success: false, message: error.message || '更新失败，请稍后重试' }
    }
  }

  const addPoints = (points: number) => {
    if (profile.value) {
      profile.value.points += points
    }
  }

  const consumePoints = (points: number) => {
    if (profile.value && profile.value.points >= points) {
      profile.value.points -= points
      return true
    }
    return false
  }

  const updateAvatar = (avatarUrl: string) => {
    if (profile.value) {
      profile.value.avatar = avatarUrl
    }
  }

  // 游戏化功能 - 参考Soul的积分和等级系统
  const gainExperience = (exp: number) => {
    if (profile.value) {
      profile.value.experience = (profile.value.experience || 0) + exp
      checkLevelUp()
    }
  }

  const checkLevelUp = () => {
    if (profile.value) {
      const currentLevel = profile.value.level || 1
      const currentExp = profile.value.experience || 0
      const requiredExp = currentLevel * 100 // 每级需要100经验
      
      if (currentExp >= requiredExp) {
        profile.value.level = currentLevel + 1
        profile.value.experience = currentExp - requiredExp
        profile.value.points = (profile.value.points || 0) + 50 // 升级奖励50积分
        
        // 这里可以触发升级动画或通知
        console.log(`恭喜升级到 Lv.${profile.value.level}！`)
        return true
      }
    }
    return false
  }

  const earnAchievement = (achievementId: string) => {
    if (profile.value) {
      if (!profile.value.achievements) {
        profile.value.achievements = []
      }
      
      if (!profile.value.achievements.includes(achievementId)) {
        profile.value.achievements.push(achievementId)
        profile.value.points = (profile.value.points || 0) + 100 // 成就奖励100积分
        gainExperience(50) // 成就奖励50经验
        
        console.log(`获得成就: ${achievementId}`)
        return true
      }
    }
    return false
  }

  const getDailyReward = () => {
    if (profile.value) {
      const today = new Date().toDateString()
      const lastReward = profile.value.lastDailyReward
      
      if (lastReward !== today) {
        profile.value.lastDailyReward = today
        profile.value.points = (profile.value.points || 0) + 20 // 每日奖励20积分
        gainExperience(10) // 每日奖励10经验
        
        console.log('获得每日奖励！')
        return true
      }
    }
    return false
  }

  const getStreakDays = () => {
    if (profile.value) {
      return profile.value.streakDays || 0
    }
    return 0
  }

  const updateStreak = () => {
    if (profile.value) {
      const today = new Date().toDateString()
      const lastActive = profile.value.lastActiveDate
      
      if (lastActive !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toDateString()
        
        if (lastActive === yesterdayStr) {
          profile.value.streakDays = (profile.value.streakDays || 0) + 1
        } else {
          profile.value.streakDays = 1
        }
        
        profile.value.lastActiveDate = today
      }
    }
  }

  // Soul风格的等级系统
  const getLevelTitle = (level: number) => {
    if (level >= 10) return '传奇'
    if (level >= 8) return '大师'
    if (level >= 6) return '专家'
    if (level >= 4) return '进阶'
    return '新手'
  }

  const calculateLevelProgress = () => {
    if (profile.value) {
      const currentLevel = profile.value.level || 1
      const currentExp = profile.value.experience || 0
      const requiredExp = currentLevel * 100
      return Math.min((currentExp / requiredExp) * 100, 100)
    }
    return 0
  }

  // Uki风格的签到系统
  const dailyCheckin = () => {
    if (profile.value) {
      const today = new Date().toDateString()
      const lastCheckin = profile.value.lastCheckinDate

      if (lastCheckin !== today) {
        profile.value.lastCheckinDate = today
        profile.value.checkinStreak = (profile.value.checkinStreak || 0) + 1
        profile.value.points = (profile.value.points || 0) + 20
        gainExperience(10)

        // 连续签到奖励
        if (profile.value.checkinStreak % 7 === 0) {
          profile.value.points = (profile.value.points || 0) + 100
          gainExperience(50)
        }

        return true
      }
    }
    return false
  }

  const isCheckedInToday = () => {
    if (profile.value) {
      const today = new Date().toDateString()
      return profile.value.lastCheckinDate === today
    }
    return false
  }

  // 任务系统
  const completeTask = (_taskId: string, points: number, experience: number) => {
    if (profile.value) {
      profile.value.points = (profile.value.points || 0) + points
      gainExperience(experience)
      profile.value.totalTasksCompleted = (profile.value.totalTasksCompleted || 0) + 1
      return true
    }
    return false
  }

  // 排行榜系统
  const updateRank = (newRank: number) => {
    if (profile.value) {
      profile.value.rank = newRank
    }
  }

  const updateWeeklyRank = (newRank: number) => {
    if (profile.value) {
      profile.value.weeklyRank = newRank
    }
  }

  const updateMonthlyRank = (newRank: number) => {
    if (profile.value) {
      profile.value.monthlyRank = newRank
    }
  }

  // 游戏化统计
  const getTotalPointsEarned = () => {
    return profile.value?.totalPointsEarned || 0
  }

  const getTotalExperience = () => {
    return profile.value?.totalExperience || 0
  }

  const getTotalAchievements = () => {
    return profile.value?.achievements?.length || 0
  }

  const getTotalTasksCompleted = () => {
    return profile.value?.totalTasksCompleted || 0
  }

  return {
    user,
    profile,
    isLoggedIn,
    initUser,
    login,
    loginWithPhone,
    sendSmsCode,
    verifySmsCode,
    register,
    logout,
    updateProfile,
    addPoints,
    consumePoints,
    updateAvatar,
    gainExperience,
    checkLevelUp,
    earnAchievement,
    getDailyReward,
    getStreakDays,
    updateStreak,
    getLevelTitle,
    calculateLevelProgress,
    dailyCheckin,
    isCheckedInToday,
    completeTask,
    updateRank,
    updateWeeklyRank,
    updateMonthlyRank,
    getTotalPointsEarned,
    getTotalExperience,
    getTotalAchievements,
    getTotalTasksCompleted
  }
})
