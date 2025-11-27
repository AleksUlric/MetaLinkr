import { ElMessage } from 'element-plus'
import { get, post } from '@/utils/request'

// 短信相关接口
export interface SmsSendRequest {
  phone: string
}

export interface SmsVerifyRequest {
  phone: string
  code: string
  type?: string
}

export interface SmsResponse {
  success: boolean
  message: string
  remainingCount: number
  nextSendTime: number
  code?: string
}

export interface SmsStatus {
  remainingCount: number
  nextSendTime: number
}

// 短信服务类
export class SmsService {
  private static instance: SmsService
  private baseURL = '/api/sms'

  public static getInstance(): SmsService {
    if (!SmsService.instance) {
      SmsService.instance = new SmsService()
    }
    return SmsService.instance
  }

  /**
   * 发送验证码
   */
  async sendCode(phone: string): Promise<SmsResponse> {
    try {
      const params = new URLSearchParams()
      params.append('phone', phone)
      
      const result = await post<{ code: number; data: SmsResponse; message?: string }>(
        `${this.baseURL}/send`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      
      if (result.code === 200 && result.data.success) {
        return result.data
      } else {
        throw new Error(result.message || result.data?.message || '发送验证码失败')
      }
    } catch (error: any) {
      console.error('发送验证码失败:', error)
      throw new Error(error.message || '发送验证码失败')
    }
  }

  /**
   * 验证验证码
   */
  async verifyCode(phone: string, code: string, type: string = 'register'): Promise<boolean> {
    try {
      const result = await post<{ code: number; data: boolean; message?: string }>(
        `${this.baseURL}/verify`,
        { phone, code, type }
      )
      
      if (result.code === 200 && result.data === true) {
        return true
      } else {
        throw new Error(result.message || '验证码验证失败')
      }
    } catch (error: any) {
      console.error('验证验证码失败:', error)
      throw new Error(error.message || '验证码验证失败')
    }
  }

  /**
   * 获取短信发送状态
   */
  async getStatus(phone: string): Promise<SmsStatus> {
    try {
      const result = await get<{ code: number; data: { success: boolean; remainingCount: number; nextSendTime: number }; message?: string }>(
        `${this.baseURL}/status`,
        {
          params: { phone }
        }
      )
      
      if (result.code === 200 && result.data.success) {
        return {
          remainingCount: result.data.remainingCount,
          nextSendTime: result.data.nextSendTime
        }
      } else {
        throw new Error(result.message || '获取状态失败')
      }
    } catch (error: any) {
      console.error('获取短信状态失败:', error)
      throw new Error(error.message || '获取状态失败')
    }
  }

  /**
   * 测试发送验证码
   */
  async testSend(phone: string): Promise<SmsResponse> {
    try {
      const params = new URLSearchParams()
      params.append('phone', phone)
      
      const result = await post<{ code: number; data: SmsResponse; message?: string }>(
        `${this.baseURL}/test`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      
      if (result.code === 200 && result.data.success) {
        return result.data
      } else {
        throw new Error(result.message || result.data?.message || '测试发送失败')
      }
    } catch (error: any) {
      console.error('测试发送验证码失败:', error)
      throw new Error(error.message || '测试发送失败')
    }
  }
}

// 导出单例实例
export const smsService = SmsService.getInstance()

// 短信工具类
export class SmsUtil {
  /**
   * 验证手机号格式
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  /**
   * 验证验证码格式
   */
  static isValidCode(code: string): boolean {
    const codeRegex = /^\d{6}$/
    return codeRegex.test(code)
  }

  /**
   * 格式化剩余时间
   */
  static formatRemainingTime(seconds: number): string {
    if (seconds <= 0) return '0秒'
    
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes}分${remainingSeconds}秒`
    } else {
      return `${remainingSeconds}秒`
    }
  }

  /**
   * 发送验证码（带用户提示）
   */
  static async sendCodeWithMessage(phone: string): Promise<boolean> {
    try {
      if (!this.isValidPhone(phone)) {
        ElMessage.error('手机号格式不正确')
        return false
      }

      ElMessage.info('正在发送验证码...')
      
      const result = await smsService.sendCode(phone)
      
      if (result.success) {
        ElMessage.success(`验证码发送成功，剩余${result.remainingCount}次`)
        return true
      } else {
        ElMessage.error(result.message)
        return false
      }
    } catch (error) {
      console.error('发送验证码失败:', error)
      ElMessage.error('发送验证码失败，请稍后重试')
      return false
    }
  }

  /**
   * 验证验证码（带用户提示）
   */
  static async verifyCodeWithMessage(phone: string, code: string): Promise<boolean> {
    try {
      if (!this.isValidPhone(phone)) {
        ElMessage.error('手机号格式不正确')
        return false
      }

      if (!this.isValidCode(code)) {
        ElMessage.error('验证码格式不正确')
        return false
      }

      const isValid = await smsService.verifyCode(phone, code)
      
      if (isValid) {
        ElMessage.success('验证码验证成功')
        return true
      } else {
        ElMessage.error('验证码错误或已过期')
        return false
      }
    } catch (error) {
      console.error('验证验证码失败:', error)
      ElMessage.error('验证码验证失败，请稍后重试')
      return false
    }
  }

  /**
   * 测试发送验证码（开发环境使用）
   */
  static async testSendCode(phone: string): Promise<string | null> {
    try {
      if (!this.isValidPhone(phone)) {
        ElMessage.error('手机号格式不正确')
        return null
      }

      ElMessage.info('测试模式：正在生成验证码...')
      
      const result = await smsService.testSend(phone)
      
      if (result.success && result.code) {
        ElMessage.success(`测试验证码：${result.code}`)
        return result.code
      } else {
        ElMessage.error('测试发送失败')
        return null
      }
    } catch (error) {
      console.error('测试发送验证码失败:', error)
      ElMessage.error('测试发送失败，请稍后重试')
      return null
    }
  }
}
