import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { post, get } from '@/utils/request'

export interface User {
  id: string
  phone: string
  nickname: string
  avatar: string
  gender: 'male' | 'female' | 'other'
  birthday: string
  location?: string
  bio?: string
  level: number
  exp: number
  coins: number
  isVerified: boolean
  createdAt: string
  lastLoginAt: string
}

export interface LoginForm {
  phone: string
  password: string
  rememberMe: boolean
}

export interface SmsLoginForm {
  phone: string
  verificationCode: string
  rememberMe: boolean
}

export interface RegisterForm {
  phone: string
  verificationCode: string
  password: string
  confirmPassword: string
  nickname: string
  gender: 'male' | 'female' | 'other'
  birthday: string
  agreement: boolean
}

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // 计算属性 - 改为仅检查用户信息（Session认证不需要token）
  const isLoggedIn = computed(() => !!user.value)
  const userLevel = computed(() => user.value?.level || 1)
  const userCoins = computed(() => user.value?.coins || 0)
  const isVerified = computed(() => user.value?.isVerified || false)

  // 方法
  const initUser = async (force = false) => {
    // 如果已经初始化且不是强制刷新，则跳过
    if (isInitialized.value && !force) return

    try {
      isLoading.value = true
      
      // 清除旧的用户信息，确保从后端获取最新信息
      if (force) {
        user.value = null
      }
      
      // 尝试从Session获取用户信息（通过API调用）
      await fetchUserInfo()
    } catch (error) {
      console.error('初始化用户信息失败:', error)
      // 清除用户信息（Session可能已过期）
      clearAuth()
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  const fetchUserInfo = async () => {
    try {
      // 调用API获取当前用户信息（通过Session认证）
      const userData = await get<User>('/api/user/current')
      
      if (userData) {
        const newUser = {
          id: userData.id?.toString() || '',
          phone: userData.phone || '',
          nickname: userData.nickname || '',
          avatar: userData.avatar || '',
          gender: userData.gender || 'male',
          birthday: userData.birthday || '',
          location: userData.location,
          bio: userData.bio,
          level: userData.level || 1,
          exp: userData.exp || 0,
          coins: userData.coins || 0,
          isVerified: userData.isVerified || false,
          createdAt: userData.createdAt || new Date().toISOString(),
          lastLoginAt: userData.lastLoginAt || new Date().toISOString()
        }
        
        console.log('获取用户信息成功:', {
          id: newUser.id,
          nickname: newUser.nickname,
          avatar: newUser.avatar,
          gender: newUser.gender,
          oldAvatar: user.value?.avatar
        })
        
        user.value = newUser
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果401，说明未登录，清除用户信息
      if (error instanceof Error && error.message.includes('未授权')) {
        clearAuth()
      }
      throw error
    }
  }

  const login = async (loginForm: LoginForm) => {
    try {
      isLoading.value = true
      
      // 调用登录API（Session会自动设置）
      await post('/api/auth/login', {
        phone: loginForm.phone,
        password: loginForm.password
      })
      
      // 登录成功后获取用户信息
      await fetchUserInfo()
      
      ElMessage.success('登录成功')
      return true
    } catch (error: any) {
      console.error('登录失败:', error)
      ElMessage.error(error.message || '登录失败，请检查手机号和密码')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const smsLogin = async (loginForm: SmsLoginForm) => {
    try {
      isLoading.value = true
      
      // 调用短信登录API（Session会自动设置）
      const loginResult = await post<{
        user: any
        isFirstLogin: boolean
      }>('/api/auth/login/sms', {
        phone: loginForm.phone,
        code: loginForm.verificationCode
      })
      
      // 保存用户信息
      if (loginResult.user) {
        user.value = {
          id: loginResult.user.id?.toString() || '',
          phone: loginResult.user.phone || '',
          nickname: loginResult.user.nickname || '',
          avatar: loginResult.user.avatar || '',
          gender: loginResult.user.gender || 'male',
          birthday: loginResult.user.birthday || '',
          level: loginResult.user.level || 1,
          exp: loginResult.user.experience || 0,
          coins: loginResult.user.points || 0,
          isVerified: loginResult.user.isVerified || false,
          createdAt: loginResult.user.createdAt || new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        }
      }
      
      // 根据是否首次登录显示不同消息和处理
      if (loginResult.isFirstLogin) {
        ElMessage.success('注册成功，欢迎加入MetaLinkr！')
        // 首次登录跳转到完善个人信息页面
        setTimeout(() => {
          window.location.href = '/complete-profile'
        }, 1500)
      } else {
        ElMessage.success('登录成功')
      }
      return true
    } catch (error: any) {
      console.error('短信登录失败:', error)
      ElMessage.error(error.message || '登录失败，请稍后重试')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (registerForm: RegisterForm) => {
    try {
      isLoading.value = true
      
      // 调用注册API（注册成功后会自动登录并设置Session）
      await post('/api/auth/register', {
        phone: registerForm.phone,
        code: registerForm.verificationCode,
        password: registerForm.password,
        nickname: registerForm.nickname,
        gender: registerForm.gender,
        birthday: registerForm.birthday
      })
      
      // 注册成功后获取用户信息
      await fetchUserInfo()
      
      ElMessage.success('注册成功')
      return true
    } catch (error: any) {
      console.error('注册失败:', error)
      ElMessage.error(error.message || '注册失败，请重试')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      isLoading.value = true
      
      // 调用登出API（清除服务端Session）
      try {
        await post('/api/auth/logout')
      } catch (error) {
        // 即使登出API失败，也清除本地状态
        console.warn('登出API调用失败:', error)
      }
      
      // 清除认证信息
      clearAuth()
      
      ElMessage.success('已退出登录')
      return true
    } catch (error) {
      console.error('登出失败:', error)
      // 即使出错也清除本地状态
      clearAuth()
      ElMessage.error('登出失败')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearAuth = () => {
    user.value = null
  }

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      isLoading.value = true
      
      // 模拟更新用户信息API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (user.value) {
        user.value = { ...user.value, ...profileData }
      }
      
      ElMessage.success('资料更新成功')
      return true
    } catch (error) {
      console.error('更新资料失败:', error)
      ElMessage.error('更新资料失败')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const updateCoins = (amount: number) => {
    if (user.value) {
      user.value.coins = Math.max(0, user.value.coins + amount)
    }
  }

  const updateExp = (amount: number) => {
    if (user.value) {
      user.value.exp += amount
      
      // 检查是否升级
      const newLevel = Math.floor(user.value.exp / 500) + 1
      if (newLevel > user.value.level) {
        user.value.level = newLevel
        ElMessage.success(`恭喜升级到 ${newLevel} 级！`)
      }
    }
  }

  const sendVerificationCode = async (phone: string) => {
    try {
      // 模拟发送验证码API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      ElMessage.success('验证码已发送')
      return true
    } catch (error) {
      console.error('发送验证码失败:', error)
      ElMessage.error('发送验证码失败')
      return false
    }
  }

  const verifyCode = async (phone: string, code: string) => {
    try {
      // 模拟验证验证码API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟验证成功
      return true
    } catch (error) {
      console.error('验证码验证失败:', error)
      ElMessage.error('验证码错误')
      return false
    }
  }

  const resetPassword = async (phone: string, newPassword: string) => {
    try {
      isLoading.value = true
      
      // 模拟重置密码API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      ElMessage.success('密码重置成功')
      return true
    } catch (error) {
      console.error('重置密码失败:', error)
      ElMessage.error('重置密码失败')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Session认证不需要刷新token，改为检查Session状态
  const checkAuthStatus = async () => {
    try {
      // 通过获取用户信息来检查Session是否有效
      await fetchUserInfo()
      return isLoggedIn.value
    } catch (error) {
      console.error('认证状态检查失败:', error)
      clearAuth()
      return false
    }
  }

  return {
    // 状态
    user,
    isLoading,
    isInitialized,
    
    // 计算属性
    isLoggedIn,
    userLevel,
    userCoins,
    isVerified,
    
    // 方法
    initUser,
    fetchUserInfo,
    login,
    smsLogin,
    register,
    logout,
    clearAuth,
    updateProfile,
    updateCoins,
    updateExp,
    sendVerificationCode,
    verifyCode,
    resetPassword,
    checkAuthStatus
  }
})
