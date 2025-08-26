<template>
  <div class="log-overview">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ logStore.logOverview.totalLogs }}</div>
              <div class="stat-label">总日志数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon error">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ logStore.logOverview.errorLogs }}</div>
              <div class="stat-label">错误日志</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon warning">
              <el-icon><InfoFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ logStore.logOverview.warningLogs }}</div>
              <div class="stat-label">警告日志</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon today">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ logStore.logOverview.todayLogs }}</div>
              <div class="stat-label">今日新增</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>日志趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="24h">24小时</el-radio-button>
                <el-radio-button label="7d">7天</el-radio-button>
                <el-radio-button label="30d">30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div class="mock-chart">
              <div class="chart-placeholder">
                📊 日志趋势图表
                <br>
                <small>这里将显示日志数量随时间的变化趋势</small>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>错误率</span>
            </div>
          </template>
          <div class="error-rate">
            <div class="rate-circle">
              <div class="rate-number">{{ logStore.errorRate }}%</div>
              <div class="rate-label">错误率</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新告警 -->
    <el-card class="alerts-card">
      <template #header>
        <div class="card-header">
          <span>最新告警</span>
          <el-button type="primary" size="small" @click="viewAllAlerts">
            查看全部
          </el-button>
        </div>
      </template>
      <el-table :data="logStore.logOverview.recentAlerts" style="width: 100%">
        <el-table-column prop="timestamp" label="时间" width="150" />
        <el-table-column prop="service" label="服务" width="120" />
        <el-table-column prop="level" label="级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)" size="small">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="消息内容" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="viewLogDetail(row.id)">
              查看详情
            </el-button>
            <el-button type="text" size="small" @click="handleAlert(row.id)">
              处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLogStore } from '@/stores/logStore'
import type { LogLevel } from '@/types'

const router = useRouter()
const logStore = useLogStore()
const timeRange = ref('24h')

onMounted(() => {
  logStore.fetchLogOverview()
})

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

const viewLogDetail = (id: string) => {
  router.push(`/detail/${id}`)
}

const handleAlert = (id: string) => {
  console.log('处理告警:', id)
}

const viewAllAlerts = () => {
  router.push('/search')
}
</script>

<style scoped>
.log-overview {
  padding: 20px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  height: 120px;
}

.stat-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.error {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.warning {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.today {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-card {
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mock-chart {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: #909399;
  font-size: 16px;
}

.error-rate {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rate-circle {
  text-align: center;
}

.rate-number {
  font-size: 48px;
  font-weight: bold;
  color: #f56c6c;
  line-height: 1;
}

.rate-label {
  font-size: 16px;
  color: #909399;
  margin-top: 8px;
}

.alerts-card {
  margin-bottom: 20px;
}
</style>
