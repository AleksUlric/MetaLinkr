<template>
  <div class="real-time-logs">
    <el-card class="log-card">
      <template #header>
        <div class="card-header">
          <span class="title">
            <el-icon><Monitor /></el-icon>
            实时日志监控
          </span>
          <div class="controls">
            <el-button 
              :type="isConnected ? 'success' : 'danger'"
              :icon="isConnected ? 'Check' : 'Close'"
              @click="toggleConnection"
            >
              {{ isConnected ? '已连接' : '未连接' }}
            </el-button>
            <el-button 
              type="warning" 
              icon="Delete"
              @click="clearLogs"
            >
              清空日志
            </el-button>
            <el-button 
              :type="autoScroll ? 'primary' : 'info'"
              @click="toggleAutoScroll"
            >
              {{ autoScroll ? '自动滚动' : '手动滚动' }}
            </el-button>
          </div>
        </div>
      </template>

      <!-- 过滤控制 -->
      <div class="filter-controls">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-input
              v-model="filterText"
              placeholder="输入过滤关键词..."
              clearable
              prefix-icon="Search"
            />
          </el-col>
          <el-col :span="4">
            <el-select v-model="filterLevel" placeholder="日志级别" clearable>
              <el-option label="全部" value="" />
              <el-option label="ERROR" value="ERROR" />
              <el-option label="WARN" value="WARN" />
              <el-option label="INFO" value="INFO" />
              <el-option label="DEBUG" value="DEBUG" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="filterModule" placeholder="模块" clearable>
              <el-option label="全部" value="" />
              <el-option label="admin" value="admin" />
              <el-option label="log" value="log" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-checkbox v-model="errorOnly">仅显示错误</el-checkbox>
          </el-col>
          <el-col :span="6">
            <el-text type="info">
              日志条数: {{ filteredLogs.length }} / {{ allLogs.length }}
            </el-text>
          </el-col>
        </el-row>
      </div>

      <!-- 日志显示区域 -->
      <div class="log-container" ref="logContainer">
        <div 
          v-for="log in filteredLogs" 
          :key="log.id"
          :class="['log-entry', `log-${log.level?.toLowerCase()}`]"
        >
          <div class="log-header">
            <span class="timestamp">{{ formatTime(log.createTime) }}</span>
            <el-tag 
              :type="getLevelType(log.level)" 
              size="small"
              class="level-tag"
            >
              {{ log.level }}
            </el-tag>
            <el-tag 
              type="info" 
              size="small"
              class="module-tag"
            >
              {{ log.module }}
            </el-tag>
            <span class="service-info">{{ log.serviceName }}:{{ log.servicePort }}</span>
          </div>
          <div class="log-content">
            <div class="operation">
              <strong>{{ log.operation }}</strong>
            </div>
            <div class="details">
              <span class="user">用户: {{ log.username || 'N/A' }}</span>
              <span class="method">方法: {{ log.method || 'N/A' }}</span>
              <span v-if="log.params" class="params">参数: {{ log.params }}</span>
              <span v-if="log.ip" class="ip">IP: {{ log.ip }}</span>
              <span v-if="log.executionTime" class="execution-time">
                执行时间: {{ log.executionTime }}ms
              </span>
            </div>
            <div v-if="log.errorMsg" class="error-message">
              <el-icon><Warning /></el-icon>
              错误: {{ log.errorMsg }}
            </div>
          </div>
        </div>
        
        <!-- 无日志提示 -->
        <div v-if="filteredLogs.length === 0" class="no-logs">
          <el-empty description="暂无日志数据">
            <el-text type="info">
              {{ isConnected ? '等待日志数据...' : '请先连接WebSocket' }}
            </el-text>
          </el-empty>
        </div>
      </div>

      <!-- 连接状态 -->
      <div class="connection-status">
        <el-alert
          :title="connectionStatus.title"
          :type="connectionStatus.type"
          :description="connectionStatus.description"
          show-icon
          :closable="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Monitor, Warning } from '@element-plus/icons-vue'
import type { LogVO } from '../types'

// 响应式数据
const isConnected = ref(false)
const autoScroll = ref(true)
const filterText = ref('')
const filterLevel = ref('')
const filterModule = ref('')
const errorOnly = ref(false)
const allLogs = ref<LogVO[]>([])
const logContainer = ref<HTMLElement>()

// WebSocket相关
let stompClient: any = null
let reconnectTimer: number | null = null
let reconnectAttempts = 0
const maxReconnectAttempts = 5

// 计算属性
const filteredLogs = computed(() => {
  let logs = allLogs.value

  // 文本过滤
  if (filterText.value) {
    const text = filterText.value.toLowerCase()
    logs = logs.filter(log => 
      log.operation?.toLowerCase().includes(text) ||
      log.params?.toLowerCase().includes(text) ||
      log.username?.toLowerCase().includes(text) ||
      log.method?.toLowerCase().includes(text)
    )
  }

  // 级别过滤
  if (filterLevel.value) {
    logs = logs.filter(log => log.level === filterLevel.value)
  }

  // 模块过滤
  if (filterModule.value) {
    logs = logs.filter(log => log.module === filterModule.value)
  }

  // 仅显示错误
  if (errorOnly.value) {
    logs = logs.filter(log => log.level === 'ERROR')
  }

  return logs
})

const connectionStatus = computed(() => {
  if (isConnected.value) {
    return {
      title: '连接正常',
      type: 'success' as const,
      description: `已接收 ${allLogs.value.length} 条日志`
    }
  } else {
    return {
      title: '连接断开',
      type: 'error' as const,
      description: '正在尝试重新连接...'
    }
  }
})

// 方法
const connectWebSocket = () => {
  try {
    // 检查是否支持WebSocket
    if (!window.WebSocket) {
      ElMessage.error('浏览器不支持WebSocket')
      return
    }

    // 创建WebSocket连接
    const socket = new WebSocket(`ws://${window.location.host}/ws/logs`)
    
    socket.onopen = () => {
      console.log('WebSocket连接已建立')
      isConnected.value = true
      reconnectAttempts = 0
      ElMessage.success('WebSocket连接成功')
    }

    socket.onmessage = (event) => {
      try {
        const logData = JSON.parse(event.data)
        addLog(logData)
      } catch (error) {
        console.error('解析日志数据失败:', error)
      }
    }

    socket.onclose = () => {
      console.log('WebSocket连接已关闭')
      isConnected.value = false
      handleReconnect()
    }

    socket.onerror = (error) => {
      console.error('WebSocket连接错误:', error)
      isConnected.value = false
      ElMessage.error('WebSocket连接错误')
    }

    stompClient = socket
  } catch (error) {
    console.error('连接WebSocket失败:', error)
    ElMessage.error('连接WebSocket失败')
  }
}

const handleReconnect = () => {
  if (reconnectAttempts >= maxReconnectAttempts) {
    ElMessage.error('重连次数已达上限，请手动重连')
    return
  }

  reconnectAttempts++
  const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000) // 指数退避，最大30秒

  ElMessage.warning(`连接断开，${delay / 1000}秒后尝试重连 (${reconnectAttempts}/${maxReconnectAttempts})`)

  reconnectTimer = setTimeout(() => {
    connectWebSocket()
  }, delay)
}

const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.close()
    stompClient = null
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  isConnected.value = false
}

const toggleConnection = () => {
  if (isConnected.value) {
    disconnectWebSocket()
    ElMessage.info('已断开WebSocket连接')
  } else {
    connectWebSocket()
  }
}

const addLog = (log: LogVO) => {
  // 添加时间戳
  if (!log.createTime) {
    log.createTime = new Date().toISOString()
  }

  // 添加到日志列表开头
  allLogs.value.unshift(log)

  // 限制日志条数，防止内存溢出
  if (allLogs.value.length > 1000) {
    allLogs.value = allLogs.value.slice(0, 1000)
  }

  // 自动滚动
  if (autoScroll.value) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const clearLogs = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有日志吗？此操作不可恢复。',
      '确认清空',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    allLogs.value = []
    ElMessage.success('日志已清空')
  } catch {
    // 用户取消
  }
}

const toggleAutoScroll = () => {
  autoScroll.value = !autoScroll.value
  ElMessage.info(autoScroll.value ? '已启用自动滚动' : '已禁用自动滚动')
}

const scrollToBottom = () => {
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
}

const formatTime = (time: string | Date | undefined) => {
  if (!time) return 'N/A'
  
  const date = new Date(time)
  return date.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getLevelType = (level: string | undefined) => {
  switch (level?.toUpperCase()) {
    case 'ERROR': return 'danger'
    case 'WARN': return 'warning'
    case 'INFO': return 'success'
    case 'DEBUG': return 'info'
    default: return 'info'
  }
}

// 生命周期
onMounted(() => {
  // 自动连接WebSocket
  connectWebSocket()
})

onUnmounted(() => {
  disconnectWebSocket()
})
</script>

<style scoped>
.real-time-logs {
  padding: 20px;
}

.log-card {
  height: calc(100vh - 120px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.title .el-icon {
  margin-right: 8px;
  font-size: 20px;
}

.controls {
  display: flex;
  gap: 12px;
}

.filter-controls {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.log-container {
  height: 500px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.log-entry {
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.log-entry.log-error {
  border-left-color: #f56c6c;
  background-color: #fef0f0;
}

.log-entry.log-warn {
  border-left-color: #e6a23c;
  background-color: #fdf6ec;
}

.log-entry.log-info {
  border-left-color: #67c23a;
  background-color: #f0f9ff;
}

.log-entry.log-debug {
  border-left-color: #909399;
  background-color: #f4f4f5;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.timestamp {
  font-weight: bold;
  color: #606266;
}

.level-tag {
  font-size: 11px;
}

.module-tag {
  font-size: 11px;
}

.service-info {
  color: #909399;
  font-size: 12px;
}

.log-content {
  line-height: 1.5;
}

.operation {
  margin-bottom: 6px;
  color: #303133;
}

.details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 6px;
  font-size: 12px;
  color: #606266;
}

.details span {
  display: inline-flex;
  align-items: center;
}

.error-message {
  color: #f56c6c;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
}

.no-logs {
  text-align: center;
  padding: 40px;
  color: #909399;
}

.connection-status {
  margin-top: 16px;
}

/* 滚动条样式 */
.log-container::-webkit-scrollbar {
  width: 8px;
}

.log-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.log-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.log-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    gap: 8px;
  }
  
  .filter-controls .el-row {
    margin: 0;
  }
  
  .filter-controls .el-col {
    margin-bottom: 8px;
  }
  
  .log-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .details {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
