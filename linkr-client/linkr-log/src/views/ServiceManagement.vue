<template>
  <div class="service-management">
      <!-- 服务列表 -->
      <el-card class="service-card">
        <template #header>
          <div class="card-header">
            <span>服务管理</span>
            <div class="header-actions">
              <el-button type="primary" @click="addService">
                <el-icon><Plus /></el-icon>
                添加服务
              </el-button>
              <el-button @click="importServices">批量导入</el-button>
              <el-button @click="exportServices">导出配置</el-button>
            </div>
          </div>
        </template>

        <el-table :data="services" style="width: 100%" v-loading="loading">
          <el-table-column prop="name" label="服务名称" width="150" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" size="small">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="logPath" label="日志路径" width="200" />
          <el-table-column prop="lastUpdate" label="最后更新" width="120" />
          <el-table-column prop="logCount" label="日志数量" width="100" />
          <el-table-column prop="errorCount" label="错误数量" width="100" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="editService(row)">
                配置
              </el-button>
              <el-button type="text" size="small" @click="viewLogs(row)">
                查看日志
              </el-button>
              <el-button type="text" size="small" @click="deleteService(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 添加/编辑服务对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="600px"
      >
        <el-form :model="serviceForm" label-width="100px">
          <el-form-item label="服务名称">
            <el-input v-model="serviceForm.name" placeholder="请输入服务名称" />
          </el-form-item>
          <el-form-item label="日志路径">
            <el-input v-model="serviceForm.logPath" placeholder="请输入日志路径" />
          </el-form-item>
          <el-form-item label="服务类型">
            <el-select v-model="serviceForm.type" placeholder="选择服务类型">
              <el-option label="Java应用" value="java" />
              <el-option label="Node.js应用" value="nodejs" />
              <el-option label="Python应用" value="python" />
              <el-option label="数据库" value="database" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="监控间隔">
            <el-input-number
              v-model="serviceForm.interval"
              :min="1"
              :max="60"
              placeholder="秒"
            />
            <span style="margin-left: 8px;">秒</span>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="serviceForm.description"
              type="textarea"
              :rows="3"
              placeholder="请输入服务描述"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveService">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLogStore } from '@/stores/logStore'
import type { ServiceStatus } from '@/types'

const router = useRouter()
const logStore = useLogStore()

const services = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)

const serviceForm = reactive({
  id: '',
  name: '',
  logPath: '',
  type: '',
  interval: 30,
  description: ''
})

const dialogTitle = computed(() => isEdit.value ? '编辑服务' : '添加服务')

onMounted(() => {
  loadServices()
})

const loadServices = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    services.value = logStore.services
  } finally {
    loading.value = false
  }
}

const addService = () => {
  isEdit.value = false
  Object.assign(serviceForm, {
    id: '',
    name: '',
    logPath: '',
    type: '',
    interval: 30,
    description: ''
  })
  dialogVisible.value = true
}

const editService = (service: any) => {
  isEdit.value = true
  Object.assign(serviceForm, service)
  dialogVisible.value = true
}

const saveService = () => {
  console.log('保存服务:', serviceForm)
  dialogVisible.value = false
  loadServices()
}

const deleteService = (service: any) => {
  console.log('删除服务:', service)
}

const viewLogs = (service: any) => {
  router.push(`/search?service=${service.name}`)
}

const importServices = () => {
  console.log('批量导入服务')
}

const exportServices = () => {
  console.log('导出服务配置')
}

const getStatusType = (status: ServiceStatus) => {
  switch (status) {
    case 'running':
      return 'success'
    case 'stopped':
      return 'danger'
    case 'error':
      return 'warning'
    default:
      return 'info'
  }
}

const getStatusText = (status: ServiceStatus) => {
  switch (status) {
    case 'running':
      return '运行中'
    case 'stopped':
      return '已停止'
    case 'error':
      return '异常'
    default:
      return '未知'
  }
}
</script>

<style scoped>
.service-management {
  padding: 20px;
}

.service-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
