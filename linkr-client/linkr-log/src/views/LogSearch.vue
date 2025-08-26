<template>
  <div class="log-search">
    <!-- 搜索条件 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="服务选择">
          <el-select v-model="searchForm.service" placeholder="选择服务" clearable>
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
          />
        </el-form-item>
        <el-form-item label="日志级别">
          <el-select v-model="searchForm.levels" multiple placeholder="选择级别" clearable>
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
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button @click="exportLogs">导出</el-button>
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
      >
        <el-table-column prop="timestamp" label="时间戳" width="180" sortable />
        <el-table-column prop="level" label="级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)" size="small">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="service" label="服务" width="120" />
        <el-table-column prop="module" label="模块" width="120" />
        <el-table-column prop="message" label="消息内容" show-overflow-tooltip />
        <el-table-column label="操作" width="120" fixed="right">
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
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
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
import { useLogStore } from '@/stores/logStore'
import type { LogLevel } from '@/types'

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
const logList = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const autoRefresh = ref(false)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    logList.value = logStore.logEntries
    total.value = logStore.logEntries.length
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
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.log-list-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
