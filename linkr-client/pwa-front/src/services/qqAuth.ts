import { ElMessage } from 'element-plus'
import { get, post } from '@/utils/request'

// QQ登录相关接口
export interface QQLoginRequest {
  code: string
  state?: string
}

export interface QQLoginResult {
  token: string
  user: {
    id: number
    phone: string
    nickname: string
    avatar: string
    gender: string
    birthday: string
    location: string
    level: number
    points: number
    experience: number
    isVerified: boolean
  }
  isFirstLogin: boolean
}

// QQ登录服务类
export class QQAuthService {
  private static instance: QQAuthService
  private baseURL = '/api/auth/qq'

  public static getInstance(): QQAuthService {
    if (!QQAuthService.instance) {
      QQAuthService.instance = new QQAuthService()
    }
    return QQAuthService.instance
  }

  /**
   * 获取QQ授权URL
   */
  async getAuthUrl(): Promise<string> {
    try {
      const result = await get<{ success: boolean; data: string; message?: string }>(`${this.baseURL}/login`)
      
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.message || '获取授权URL失败')
      }
    } catch (error: any) {
      console.error('获取QQ授权URL失败:', error)
      throw new Error(error.message || '获取授权URL失败')
    }
  }

  /**
   * QQ登录回调处理
   */
  async handleCallback(code: string, state?: string): Promise<QQLoginResult> {
    try {
      const result = await post<{ success: boolean; data: QQLoginResult; message?: string }>(
        `${this.baseURL}/callback`,
        { code, state }
      )
      
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.message || 'QQ登录失败')
      }
    } catch (error: any) {
      console.error('QQ登录回调处理失败:', error)
      throw new Error(error.message || 'QQ登录失败')
    }
  }

  /**
   * 测试QQ登录
   */
  async testLogin(): Promise<string> {
    try {
      const result = await get<{ success: boolean; data: string; message?: string }>(`${this.baseURL}/test`)
      
      if (result.success) {
        return result.data
      } else {
        throw new Error(result.message || '测试QQ登录失败')
      }
    } catch (error: any) {
      console.error('测试QQ登录失败:', error)
      throw new Error(error.message || '测试QQ登录失败')
    }
  }
}

// 导出单例实例
export const qqAuthService = QQAuthService.getInstance()

// QQ SDK类型声明
declare global {
  interface Window {
    QC: {
      Login: (options: {
        btnId: string
        scope?: string
        size?: string
        display?: string
      }) => void
      Api: {
        get_user_info: (callback: (openId: string, userInfo: any) => void) => void
      }
      check: () => boolean
    }
  }
}

// QQ登录工具类
export class QQLoginUtil {
  /**
   * 检查QQ SDK是否加载
   */
  static isSDKLoaded(): boolean {
    return typeof window !== 'undefined' && typeof window.QC !== 'undefined' && window.QC.check()
  }

  /**
   * 初始化QQ登录按钮
   */
  static initLoginButton(btnId: string): void {
    if (!this.isSDKLoaded()) {
      ElMessage.error('QQ登录SDK未加载，请刷新页面重试')
      return
    }

    try {
      window.QC.Login({
        btnId: btnId,
        scope: 'get_user_info',
        size: 'A_M',
        display: 'pc'
      })
    } catch (error) {
      console.error('初始化QQ登录按钮失败:', error)
      ElMessage.error('初始化QQ登录按钮失败')
    }
  }

  /**
   * 获取QQ用户信息
   */
  static getUserInfo(): Promise<{ openId: string; userInfo: any }> {
    return new Promise((resolve, reject) => {
      if (!this.isSDKLoaded()) {
        reject(new Error('QQ SDK未加载'))
        return
      }

      try {
        window.QC.Api.get_user_info((openId: string, userInfo: any) => {
          if (openId && userInfo) {
            resolve({ openId, userInfo })
          } else {
            reject(new Error('获取QQ用户信息失败'))
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 跳转到QQ授权页面
   */
  static async redirectToAuth(): Promise<void> {
    try {
      const authUrl = await qqAuthService.getAuthUrl()
      window.location.href = authUrl
    } catch (error) {
      console.error('跳转QQ授权页面失败:', error)
      ElMessage.error('跳转QQ授权页面失败')
    }
  }
}
