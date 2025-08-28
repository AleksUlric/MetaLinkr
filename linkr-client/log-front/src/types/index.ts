// 日志级别枚举
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

// 服务状态枚举
export enum ServiceStatus {
  RUNNING = 'running',
  STOPPED = 'stopped',
  ERROR = 'error'
}

// 日志条目接口
export interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  service: string
  module: string
  message: string
  stackTrace?: string
  thread?: string
  className?: string
  lineNumber?: number
}

// 服务信息接口
export interface ServiceInfo {
  id: string
  name: string
  status: ServiceStatus
  logPath: string
  lastUpdate: string
  logCount: number
  errorCount: number
  type?: string
  interval?: number
  description?: string
}

// 告警规则接口
export interface AlertRule {
  id: string
  name: string
  condition: string
  level: LogLevel
  notificationMethods: string[]
  enabled: boolean
}

// 统计概览接口
export interface LogOverview {
  totalLogs: number
  errorLogs: number
  warningLogs: number
  todayLogs: number
  recentAlerts: LogEntry[]
  logTrend: Array<{
    time: string
    count: number
  }>
}
