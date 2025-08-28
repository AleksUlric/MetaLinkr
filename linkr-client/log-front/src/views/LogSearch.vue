<template>
  <div class="log-search">
    <!-- 搜索条件 -->
    <el-card class="search-card">
             <el-form :model="searchForm" inline size="small">
        <el-form-item label="服务选择">
          <el-select v-model="searchForm.service" placeholder="选择服务" clearable style="width: 200px">
            <el-option label="全部服务" value="" />
            <el-option label="后端服务" value="backend" />
            <el-option label="前端服务" value="frontend" />
            <el-option label="数据库" value="database" />
            <el-option label="Nacos服务" value="nacos" />
          </el-select>
        </el-form-item>
                 <el-form-item label="时间范围">
                       <el-date-picker
              v-model="searchForm.timeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              :shortcuts="timeShortcuts"
              style="width: 350px"
            />
         </el-form-item>
        <el-form-item label="日志级别">
          <el-select v-model="searchForm.levels" multiple placeholder="选择级别" clearable style="width: 200px">
            <el-option label="DEBUG" value="DEBUG" />
            <el-option label="INFO" value="INFO" />
            <el-option label="WARN" value="WARN" />
            <el-option label="ERROR" value="ERROR" />
            <el-option label="FATAL" value="FATAL" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="输入关键词搜索"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
                       <el-button type="primary" size="small" @click="handleSearch">
               <el-icon><Search /></el-icon>
               搜索
             </el-button>
             <el-button size="small" @click="resetSearch">重置</el-button>
             <el-button size="small" @click="exportLogs">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 日志列表 -->
    <el-card class="log-list-card">
      <template #header>
        <div class="card-header">
          <span>日志列表 (共 {{ total }} 条)</span>
          <div class="header-actions">
            <el-switch
              v-model="autoRefresh"
              active-text="自动刷新"
              inactive-text="手动刷新"
            />
            <el-button type="primary" size="small" @click="refreshData">
              刷新
            </el-button>
          </div>
        </div>
      </template>
      
             <el-table
         :data="logList"
         style="width: 100%"
         v-loading="loading"
         @row-click="handleRowClick"
         :max-height="500"
       >
        <el-table-column prop="timestamp" label="时间戳" width="160" sortable>
          <template #default="{ row }">
            {{ formatTimestamp(row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column prop="level" label="级别" width="80">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)" size="small">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="service" label="服务" width="100" />
        <el-table-column prop="module" label="模块" width="100" />
        <el-table-column prop="message" label="消息内容" min-width="300" show-overflow-tooltip />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click.stop="viewDetail(row.id)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLogStore } from '../stores/logStore'
import type { LogLevel } from '../types'

const router = useRouter()
const logStore = useLogStore()

// 搜索表单
const searchForm = reactive({
  service: '',
  timeRange: [],
  levels: [],
  keyword: ''
})

// 列表数据
const logList = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const autoRefresh = ref(false)

// 时间快捷选项
const timeShortcuts = [
  {
    text: '最近1小时',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000)
      return [start, end]
    }
  },
  {
    text: '最近24小时',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      return [start, end]
    }
  },
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  }
]

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    // 构建搜索参数
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      application: searchForm.service || '',  // 修正字段名：service -> application
      level: searchForm.levels?.length > 0 ? searchForm.levels[0] : '',  // 修正字段名和类型：levels数组 -> level字符串
      keyword: searchForm.keyword || '',      // 修正字段名：message -> keyword
      startTime: searchForm.timeRange?.[0] || null,
      endTime: searchForm.timeRange?.[1] || null
    }
    
    console.log('发送搜索参数:', params) // 添加调试日志
    
    const result = await logStore.searchLogs(params)
    console.log('接收到的结果:', result) // 添加调试日志
    
    // 修正数据获取逻辑 - 后端返回的是PageResult格式，数据在data字段中
    if (result && (result as any).data) {
      logList.value = (result as any).data || []
      total.value = (result as any).total || 0
    } else if (result && result.list) {
      // 兼容其他可能的格式
      logList.value = result.list || []
      total.value = result.total || 0
    } else {
      logList.value = []
      total.value = 0
    }
    
    console.log('处理后的数据:', { list: logList.value, total: total.value }) // 添加调试日志
  } catch (error) {
    console.error('加载日志数据失败:', error)
    logList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const resetSearch = () => {
  Object.assign(searchForm, {
    service: '',
    timeRange: [],
    levels: [],
    keyword: ''
  })
  handleSearch()
}

const exportLogs = () => {
  console.log('导出日志')
}

const refreshData = () => {
  loadData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  loadData()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadData()
}

const handleRowClick = (row: any) => {
  viewDetail(row.id)
}

const viewDetail = (id: string) => {
  router.push(`/detail/${id}`)
}

const formatTimestamp = (timestamp: string | Date) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
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
</script>

<style scoped>
.log-search {
  padding: 12px;
}

.search-card {
  margin-bottom: 12px;
}

.log-list-card {
  margin-bottom: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-wrapper {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}

/* 优化下拉框样式 */
:deep(.el-select-dropdown__item) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-select .el-select__tags) {
  max-width: 180px;
}

/* 紧凑布局优化 */
:deep(.el-form-item) {
  margin-bottom: 8px;
  margin-right: 16px;
}

:deep(.el-card__body) {
  padding: 8px 12px;
}

:deep(.el-card__header) {
  padding: 8px 12px;
}

:deep(.el-table) {
  font-size: 13px;
}

:deep(.el-table th) {
  padding: 8px 0;
}

:deep(.el-table td) {
  padding: 6px 0;
}

/* 隐藏表格滚动条 */
:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  display: none;
}

:deep(.el-table__body-wrapper) {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
