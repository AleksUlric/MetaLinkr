import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LogEntry, LogOverview, ServiceInfo, AlertRule } from '@/types'
import { LogLevel, ServiceStatus } from '@/types'
import { logApi, serviceApi } from '@/services/api'

export const useLogStore = defineStore('log', () => {
  // 状态
  const logOverview = ref<LogOverview>({
    totalLogs: 1234,
    errorLogs: 56,
    warningLogs: 89,
    todayLogs: 123,
    recentAlerts: [],
    logTrend: []
  })

  const logEntries = ref<LogEntry[]>([])
  const services = ref<ServiceInfo[]>([])
  const alertRules = ref<AlertRule[]>([])
  const loading = ref(false)
  const total = ref(0)

  // 计算属性
  const errorRate = computed(() => {
    if (logOverview.value.totalLogs === 0) return 0
    return ((logOverview.value.errorLogs / logOverview.value.totalLogs) * 100).toFixed(2)
  })

  // 模拟数据生成
  const generateMockData = () => {
    // 生成模拟日志条目
    const mockLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: '2024-01-15 12:30:15',
        level: LogLevel.ERROR,
        service: '后端服务',
        module: '用户模块',
        message: '用户登录失败，用户名或密码错误',
        stackTrace: 'at UserController.login(UserController.java:45)\nat UserService.validateUser(UserService.java:123)',
        thread: 'main',
        className: 'UserController',
        lineNumber: 45
      },
      {
        id: '2',
        timestamp: '2024-01-15 12:29:45',
        level: LogLevel.INFO,
        service: '前端服务',
        module: '登录模块',
        message: '用户尝试登录',
        thread: 'main',
        className: 'LoginComponent',
        lineNumber: 23
      },
      {
        id: '3',
        timestamp: '2024-01-15 12:29:30',
        level: LogLevel.WARN,
        service: '数据库',
        module: '连接池',
        message: '数据库连接池使用率超过80%',
        thread: 'db-pool-1',
        className: 'ConnectionPool',
        lineNumber: 67
      }
    ]

    // 生成模拟服务信息
    const mockServices: ServiceInfo[] = [
      {
        id: '1',
        name: '后端服务',
        status: ServiceStatus.RUNNING,
        logPath: '/logs/backend/',
        lastUpdate: '2分钟前',
        logCount: 456,
        errorCount: 12
      },
      {
        id: '2',
        name: '前端服务',
        status: ServiceStatus.RUNNING,
        logPath: '/logs/frontend/',
        lastUpdate: '1分钟前',
        logCount: 234,
        errorCount: 5
      },
      {
        id: '3',
        name: '数据库',
        status: ServiceStatus.RUNNING,
        logPath: '/logs/database/',
        lastUpdate: '5分钟前',
        logCount: 789,
        errorCount: 23
      },
      {
        id: '4',
        name: 'Nacos服务',
        status: ServiceStatus.RUNNING,
        logPath: '/logs/nacos/',
        lastUpdate: '30秒前',
        logCount: 123,
        errorCount: 2
      }
    ]

    // 生成模拟告警规则
    const mockAlertRules: AlertRule[] = [
      {
        id: '1',
        name: '错误率过高',
        condition: '错误日志>10条/分钟',
        level: LogLevel.ERROR,
        notificationMethods: ['邮件', '短信'],
        enabled: true
      },
      {
        id: '2',
        name: '服务异常',
        condition: '服务状态=停止',
        level: LogLevel.FATAL,
        notificationMethods: ['钉钉', '邮件'],
        enabled: true
      },
      {
        id: '3',
        name: '性能告警',
        condition: '响应时间>5秒',
        level: LogLevel.WARN,
        notificationMethods: ['邮件'],
        enabled: true
      }
    ]

    // 生成模拟趋势数据
    const mockTrend = Array.from({ length: 24 }, (_, i) => ({
      time: `${i.toString().padStart(2, '0')}:00`,
      count: Math.floor(Math.random() * 100) + 20
    }))

    // 更新状态
    logEntries.value = mockLogs
    services.value = mockServices
    alertRules.value = mockAlertRules
    logOverview.value.logTrend = mockTrend
    logOverview.value.recentAlerts = mockLogs.filter(log => log.level === 'ERROR' || log.level === 'FATAL')
  }

  // 动作
  const fetchLogOverview = async () => {
    loading.value = true
    try {
      const response = await logApi.getLogOverview()
      logOverview.value = response as unknown as LogOverview
    } catch (error) {
      console.error('获取日志概览失败:', error)
      // 如果API调用失败，使用模拟数据作为fallback
      generateMockData()
    } finally {
      loading.value = false
    }
  }

  const searchLogs = async (params: any) => {
    loading.value = true
    try {
      console.log('Store: 发送搜索请求，参数:', params)
      const result = await logApi.searchLogs(params)
      console.log('Store: 收到API响应:', result)
      
      // 处理返回的数据结构 - 后端返回的是PageResult格式
      let pageInfo: { list: LogEntry[], total: number }
      if (result && typeof result === 'object') {
        // 后端返回的是PageResult格式，数据在data字段中
        if ('data' in result && Array.isArray(result.data)) {
          pageInfo = {
            list: result.data as LogEntry[],
            total: (result as any).total || 0
          }
        } else if ('list' in result && Array.isArray(result.list)) {
          // 兼容其他可能的格式
          pageInfo = {
            list: result.list as LogEntry[],
            total: (result as any).total || 0
          }
        } else {
          // 如果返回的是数组，直接使用
          pageInfo = {
            list: Array.isArray(result) ? result as LogEntry[] : [],
            total: Array.isArray(result) ? result.length : 0
          }
        }
      } else {
        pageInfo = { list: [], total: 0 }
      }
      
      console.log('Store: 处理后的分页信息:', pageInfo)
      logEntries.value = pageInfo.list || []
      total.value = pageInfo.total || 0
      return pageInfo
    } catch (error) {
      console.error('搜索日志失败:', error)
      // 如果API调用失败，使用模拟数据作为fallback
      generateMockData()
      return { list: logEntries.value, total: logEntries.value.length }
    } finally {
      loading.value = false
    }
  }

  const getLogDetail = async (id: string) => {
    try {
      const detail = await logApi.getLogDetail(id)
      return detail
    } catch (error) {
      console.error('获取日志详情失败:', error)
      return logEntries.value.find(log => log.id === id)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await serviceApi.getAllServices()
      services.value = response as unknown as ServiceInfo[]
    } catch (error) {
      console.error('获取服务列表失败:', error)
      // 如果API调用失败，使用模拟数据作为fallback
      generateMockData()
    }
  }

  return {
    // 状态
    logOverview,
    logEntries,
    services,
    alertRules,
    loading,
    total,
    
    // 计算属性
    errorRate,
    
    // 动作
    fetchLogOverview,
    searchLogs,
    getLogDetail,
    fetchServices
  }
})
