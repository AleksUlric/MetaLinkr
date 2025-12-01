/**
 * 统一的HTTP请求工具
 * 支持Session认证（通过Cookie）
 * 基于 axios 实现
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const BASE_URL = 'http://localhost:8082'
export const API_BASE_URL = BASE_URL

// 创建 axios 实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true, // 重要：启用以发送Cookie（Session认证）
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response

    // 处理业务状态码
    if (data && typeof data === 'object' && 'code' in data) {
      if (data.code === 200 || data.code === 0) {
        return data.data !== undefined ? data.data : data
      } else {
        throw new Error(data.message || '请求失败')
      }
    }

    return data
  },
  (error: AxiosError) => {
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response

      // 401未授权，清除本地状态并跳转登录
      if (status === 401) {
        // 跳转到登录页（如果不是在登录页）
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
        
        throw new Error('未授权，请先登录')
      }

      // 其他错误
      const errorMessage = (data as any)?.message || (data as any)?.error || `请求失败: ${status}`
      throw new Error(errorMessage)
    } else if (error.request) {
      // 请求已发出但没有收到响应
      if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时')
      }
      throw new Error('网络错误，请检查网络连接')
    } else {
      // 其他错误
      throw error
    }
  }
)

export interface RequestOptions extends Omit<AxiosRequestConfig, 'url'> {
  baseUrl?: string
}

/**
 * 统一的请求封装
 * 自动处理Session认证（通过withCredentials）
 */
export async function request<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    baseUrl,
    ...axiosConfig
  } = options

  // 如果提供了 baseUrl 或 URL 是完整的，需要构建完整 URL
  let requestUrl = url
  if (baseUrl || url.startsWith('http')) {
    requestUrl = url.startsWith('http') ? url : `${baseUrl || BASE_URL}${url}`
  }

  try {
    const response = await axiosInstance.request<T>({
      ...axiosConfig,
      url: requestUrl
    })
    return response as any
  } catch (error: any) {
    throw error
  }
}

/**
 * GET请求
 */
export function get<T = any>(url: string, options?: RequestOptions): Promise<T> {
  return request<T>(url, { ...options, method: 'GET' })
}

/**
 * POST请求
 */
export function post<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'POST',
    data
  })
}

/**
 * PUT请求
 */
export function put<T = any>(url: string, data?: any, options?: RequestOptions): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'PUT',
    data
  })
}

/**
 * DELETE请求
 */
export function del<T = any>(url: string, options?: RequestOptions): Promise<T> {
  return request<T>(url, { ...options, method: 'DELETE' })
}

/**
 * 文件上传（FormData）
 */
export function upload<T = any>(
  url: string,
  formData: FormData,
  options?: RequestOptions
): Promise<T> {
  const { headers = {}, ...restOptions } = options || {}
  
  // axios 会自动处理 FormData 的 Content-Type（包含 boundary）
  return request<T>(url, {
    ...restOptions,
    method: 'POST',
    data: formData,
    headers: {
      ...headers,
      // 移除 Content-Type，让 axios 自动设置
      'Content-Type': undefined
    } as any
  })
}

