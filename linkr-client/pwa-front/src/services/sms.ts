import { post } from '@/utils/request'

// 短信验证码相关API接口
export interface SmsApi {
  // 发送短信验证码
  sendSmsCode(phone: string, type: 'login' | 'register' | 'reset'): Promise<{ success: boolean; message?: string }>
  
  // 验证短信验证码
  verifySmsCode(phone: string, code: string): Promise<{ success: boolean; message?: string }>
  
  // 手机号登录
  loginWithPhone(phone: string, code: string): Promise<{ success: boolean; token?: string; user?: any; message?: string }>
}

// 模拟短信API实现
export const smsApi: SmsApi = {
  // 发送短信验证码
  async sendSmsCode(phone: string, type: 'login' | 'register' | 'reset') {
    try {
      // 模拟API调用
      console.log(`发送短信验证码到 ${phone}，类型: ${type}`)
      
      // 这里应该调用真实的短信服务API
      // const response = await axios.post('/api/sms/send', { phone, type })
      
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟验证码存储（实际应该存储在服务端）
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      localStorage.setItem(`sms_code_${phone}`, code)
      localStorage.setItem(`sms_code_time_${phone}`, Date.now().toString())
      
      return { success: true }
    } catch (error) {
      console.error('发送短信验证码失败:', error)
      return { success: false, message: '发送验证码失败，请重试' }
    }
  },

  // 验证短信验证码
  async verifySmsCode(phone: string, code: string) {
    try {
      // 模拟API调用
      console.log(`验证手机号 ${phone} 的验证码: ${code}`)
      
      // 这里应该调用真实的验证API
      // const response = await axios.post('/api/sms/verify', { phone, code })
      
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟验证码验证（实际应该由服务端验证）
      const storedCode = localStorage.getItem(`sms_code_${phone}`)
      const storedTime = localStorage.getItem(`sms_code_time_${phone}`)
      
      if (!storedCode || !storedTime) {
        return { success: false, message: '验证码已过期，请重新获取' }
      }
      
      const timeDiff = Date.now() - parseInt(storedTime)
      if (timeDiff > 5 * 60 * 1000) { // 5分钟过期
        localStorage.removeItem(`sms_code_${phone}`)
        localStorage.removeItem(`sms_code_time_${phone}`)
        return { success: false, message: '验证码已过期，请重新获取' }
      }
      
      if (storedCode !== code) {
        return { success: false, message: '验证码错误' }
      }
      
      // 验证成功后清除验证码
      localStorage.removeItem(`sms_code_${phone}`)
      localStorage.removeItem(`sms_code_time_${phone}`)
      
      return { success: true }
    } catch (error) {
      console.error('验证短信验证码失败:', error)
      return { success: false, message: '验证失败，请重试' }
    }
  },

  // 手机号登录
  async loginWithPhone(phone: string, code: string) {
    try {
      // 先验证验证码
      const verifyResult = await this.verifySmsCode(phone, code)
      if (!verifyResult.success) {
        return verifyResult
      }
      
      // 模拟API调用
      console.log(`手机号 ${phone} 登录`)
      
      // 这里应该调用真实的登录API
      // const response = await axios.post('/api/auth/phone-login', { phone, code })
      
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟登录成功
      const token = 'phone-token-' + Date.now()
      const user = {
        id: 'user_' + Date.now(),
        phone,
        nickname: '用户' + phone.slice(-4),
        avatar: 'https://via.placeholder.com/100x100',
        createdAt: new Date().toISOString()
      }
      
      return { success: true, token, user }
    } catch (error) {
      console.error('手机号登录失败:', error)
      return { success: false, message: '登录失败，请重试' }
    }
  }
}

// 真实API实现（需要后端支持）
export const realSmsApi: SmsApi = {
  async sendSmsCode(phone: string, type: 'login' | 'register' | 'reset') {
    try {
      const result = await post<{ success: boolean; message?: string }>('/api/sms/send', { phone, type })
      return result
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || '发送验证码失败' 
      }
    }
  },

  async verifySmsCode(phone: string, code: string) {
    try {
      const result = await post<{ success: boolean; message?: string }>('/api/sms/verify', { phone, code })
      return result
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || '验证码验证失败' 
      }
    }
  },

  async loginWithPhone(phone: string, code: string) {
    try {
      const result = await post<{ success: boolean; token?: string; user?: any; message?: string }>(
        '/api/auth/phone-login',
        { phone, code }
      )
      return result
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || '登录失败' 
      }
    }
  }
}

// 导出当前使用的API（可以根据环境切换）
export const currentSmsApi = smsApi // 使用模拟API，生产环境可以切换为 realSmsApi
