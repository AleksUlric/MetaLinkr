<template>
  <div class="log-detail">
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">
            <span>日志详情</span>
            <el-button @click="goBack">返回</el-button>
          </div>
        </template>

        <div v-if="logDetail" class="detail-content">
          <!-- 基本信息 -->
          <el-descriptions title="基本信息" :column="2" border>
            <el-descriptions-item label="时间戳">
              {{ logDetail.timestamp }}
            </el-descriptions-item>
            <el-descriptions-item label="日志级别">
              <el-tag :type="getLevelType(logDetail.level)" size="small">
                {{ logDetail.level }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="服务名称">
              {{ logDetail.service }}
            </el-descriptions-item>
            <el-descriptions-item label="模块">
              {{ logDetail.module }}
            </el-descriptions-item>
            <el-descriptions-item label="线程" v-if="logDetail.thread">
              {{ logDetail.thread }}
            </el-descriptions-item>
            <el-descriptions-item label="类名" v-if="logDetail.className">
              {{ logDetail.className }}
            </el-descriptions-item>
            <el-descriptions-item label="行号" v-if="logDetail.lineNumber">
              {{ logDetail.lineNumber }}
            </el-descriptions-item>
          </el-descriptions>

          <!-- 日志消息 -->
          <el-card class="message-card">
            <template #header>
              <span>日志消息</span>
            </template>
            <div class="message-content">
              {{ logDetail.message }}
            </div>
          </el-card>

          <!-- 堆栈跟踪 -->
          <el-card v-if="logDetail.stackTrace" class="stack-card">
            <template #header>
              <span>堆栈跟踪</span>
            </template>
            <pre class="stack-trace">{{ logDetail.stackTrace }}</pre>
          </el-card>

          <!-- 相关日志 -->
          <el-card class="related-card">
            <template #header>
              <span>相关日志</span>
            </template>
            <el-table :data="relatedLogs" style="width: 100%">
              <el-table-column prop="timestamp" label="时间" width="180" />
              <el-table-column prop="level" label="级别" width="100">
                <template #default="{ row }">
                  <el-tag :type="getLevelType(row.level)" size="small">
                    {{ row.level }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="message" label="消息内容" show-overflow-tooltip />
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button type="text" size="small" @click="viewRelatedLog(row.id)">
                    查看详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>

        <div v-else class="loading-content">
          <el-empty description="日志详情加载中..." />
        </div>
      </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLogStore } from '@/stores/logStore'
import type { LogEntry, LogLevel } from '@/types'

const route = useRoute()
const router = useRouter()
const logStore = useLogStore()

const logDetail = ref<LogEntry | null>(null)
const relatedLogs = ref<LogEntry[]>([])

onMounted(async () => {
  const logId = route.params.id as string
  await loadLogDetail(logId)
})

const loadLogDetail = async (id: string) => {
  try {
    const detail = await logStore.getLogDetail(id)
    if (detail && typeof detail === 'object' && 'service' in detail && 'id' in detail) {
      logDetail.value = detail
      // 模拟相关日志
      relatedLogs.value = logStore.logEntries.filter(log => 
        log.service === detail.service && log.id !== detail.id
      ).slice(0, 5)
    }
  } catch (error) {
    console.error('加载日志详情失败:', error)
  }
}

const getLevelType = (level: LogLevel) => {
  switch (level) {
    case 'ERROR':
    case 'FATAL':
      return 'danger'
    case 'WARN':
      return 'warning'
    case 'INFO':
      return 'info'
    default:
      return 'info'
  }
}

const goBack = () => {
  router.back()
}

const viewRelatedLog = (id: string) => {
  router.push(`/detail/${id}`)
}
</script>

<style scoped>
.log-detail {
  padding: 20px;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-card,
.stack-card,
.related-card {
  margin-top: 20px;
}

.message-content {
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.stack-trace {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  color: #606266;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 300px;
  overflow-y: auto;
}

.loading-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
</style>
