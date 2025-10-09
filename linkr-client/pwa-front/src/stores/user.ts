import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserProfile } from '../types/user'
import { mockUser, mockUserProfile } from '../mock/user'
import { currentSmsApi } from '../services/sms'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const profile = ref<UserProfile | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  const initUser = async () => {
    if (token.value) {
      try {
        // 这里应该调用API获取用户信息
        // const response = await api.getUserInfo()
        // user.value = response.data
        
        // 临时使用mock数据
        user.value = mockUser
        profile.value = mockUserProfile
      } catch (error) {
        console.error('获取用户信息失败:', error)
        logout()
      }
    }
    // 如果没有token，不自动设置用户，保持未登录状态
  }

  const login = async (_username: string, _password: string) => {
    try {
      // 这里应该调用登录API
      // const response = await api.login({ username, password })
      // token.value = response.data.token
      
      // 临时使用mock数据
      token.value = 'mock-token-' + Date.now()
      localStorage.setItem('token', token.value)
      
      user.value = mockUser
      profile.value = mockUserProfile
      
      return { success: true }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, message: '登录失败' }
    }
  }

  // 手机号登录
  const loginWithPhone = async (phone: string, code: string) => {
    try {
      const result = await currentSmsApi.loginWithPhone(phone, code)
      
      if (result.success && result.token && result.user) {
        token.value = result.token
        localStorage.setItem('token', token.value)
        
        user.value = result.user
        profile.value = mockUserProfile
        
        return { success: true }
      } else {
        return { success: false, message: result.message || '登录失败' }
      }
    } catch (error) {
      console.error('手机号登录失败:', error)
      return { success: false, message: '手机号登录失败' }
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

  const logout = () => {
    user.value = null
    profile.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      // 这里应该调用更新用户信息API
      // const response = await api.updateProfile(profileData)
      
      if (profile.value) {
        Object.assign(profile.value, profileData)
      }
      
      return { success: true }
    } catch (error) {
      console.error('更新用户信息失败:', error)
      return { success: false, message: '更新失败' }
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
    token,
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
