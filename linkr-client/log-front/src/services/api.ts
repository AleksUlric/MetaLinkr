import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const apiBase = import.meta.env?.VITE_API_BASE || '/api'
const request = axios.create({
  baseURL: apiBase,
  timeout: 15000,
})

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const status = error?.response?.status
    const message = error?.response?.data?.message || error.message
    if (status === 401) {
      localStorage.removeItem('token')
      ElMessage.error('登录已过期，请重新登录')
    } else if (message) {
      ElMessage.error(message)
    }
    return Promise.reject(error)
  }
)

// 服务管理API
export const serviceApi = {
  // 获取所有服务
  getAllServices: () => request.get('/services'),
  
  // 根据ID获取服务
  getServiceById: (id: string) => request.get(`/services/${id}`),
  
  // 创建服务
  createService: (service: any) => request.post('/services', service),
  
  // 更新服务
  updateService: (id: string, service: any) => request.put(`/services/${id}`, service),
  
  // 删除服务
  deleteService: (id: string) => request.delete(`/services/${id}`),
  
  // 批量导入服务
  batchImportServices: (services: any[]) => request.post('/services/batch-import', services),
  
  // 更新服务状态
  updateServiceStatus: (id: string, status: string) => request.put(`/services/${id}/status`, { status }),
  
  // 更新服务统计信息
  updateServiceStats: (id: string, logCount: number, errorCount: number) => 
    request.put(`/services/${id}/stats`, { logCount, errorCount })
}

// 日志管理API
export const logApi = {
  // 获取日志概览
  getLogOverview: () => request.get('/logs/overview'),
  
  // 搜索日志
  searchLogs: (params: any) => request.post('/logs/search', params),
  
  // 获取日志详情
  getLogDetail: (id: string) => request.get(`/logs/${id}`),
  
  // 保存日志
  saveLog: (logEntry: any) => request.post('/logs', logEntry)
}

export default request
