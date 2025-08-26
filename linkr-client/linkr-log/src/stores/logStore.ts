import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LogEntry, LogOverview, ServiceInfo, AlertRule } from '@/types'

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
        level: 'ERROR' as any,
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
        level: 'INFO' as any,
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
        level: 'WARN' as any,
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
        status: 'running' as any,
        logPath: '/logs/backend/',
        lastUpdate: '2分钟前',
        logCount: 456,
        errorCount: 12
      },
      {
        id: '2',
        name: '前端服务',
        status: 'running' as any,
        logPath: '/logs/frontend/',
        lastUpdate: '1分钟前',
        logCount: 234,
        errorCount: 5
      },
      {
        id: '3',
        name: '数据库',
        status: 'running' as any,
        logPath: '/logs/database/',
        lastUpdate: '5分钟前',
        logCount: 789,
        errorCount: 23
      },
      {
        id: '4',
        name: 'Nacos服务',
        status: 'running' as any,
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
        level: 'ERROR' as any,
        notificationMethods: ['邮件', '短信'],
        enabled: true
      },
      {
        id: '2',
        name: '服务异常',
        condition: '服务状态=停止',
        level: 'FATAL' as any,
        notificationMethods: ['钉钉', '邮件'],
        enabled: true
      },
      {
        id: '3',
        name: '性能告警',
        condition: '响应时间>5秒',
        level: 'WARN' as any,
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
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      generateMockData()
    } finally {
      loading.value = false
    }
  }

  const searchLogs = async (params: any) => {
    loading.value = true
    try {
      // 模拟搜索逻辑
      await new Promise(resolve => setTimeout(resolve, 300))
      // 这里可以根据参数过滤日志
      return logEntries.value
    } finally {
      loading.value = false
    }
  }

  const getLogDetail = async (id: string) => {
    return logEntries.value.find(log => log.id === id)
  }

  return {
    // 状态
    logOverview,
    logEntries,
    services,
    alertRules,
    loading,
    
    // 计算属性
    errorRate,
    
    // 动作
    fetchLogOverview,
    searchLogs,
    getLogDetail
  }
})
