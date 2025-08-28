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
        <el-form :model="serviceForm" :rules="serviceRules" ref="serviceFormRef" label-width="100px">
          <el-form-item label="服务名称" prop="name">
            <el-input v-model="serviceForm.name" placeholder="请输入服务名称" />
          </el-form-item>
          <el-form-item label="日志路径" prop="logPath">
            <el-input v-model="serviceForm.logPath" placeholder="请输入日志路径" />
          </el-form-item>
          <el-form-item label="服务类型" prop="type">
            <el-select v-model="serviceForm.type" placeholder="选择服务类型">
              <el-option label="Java应用" value="java" />
              <el-option label="Node.js应用" value="nodejs" />
              <el-option label="Python应用" value="python" />
              <el-option label="数据库" value="database" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="监控间隔" prop="interval">
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

      <!-- 批量导入对话框 -->
      <el-dialog
        v-model="importDialogVisible"
        title="批量导入服务"
        width="500px"
      >
        <el-form label-width="100px">
          <el-form-item label="导入方式">
            <el-radio-group v-model="importType">
              <el-radio label="file">文件导入</el-radio>
              <el-radio label="text">文本输入</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item v-if="importType === 'file'" label="选择文件">
            <el-upload
              ref="uploadRef"
              :auto-upload="false"
              :on-change="handleFileChange"
              :show-file-list="false"
              accept=".json,.yaml,.yml"
            >
              <el-button type="primary">选择配置文件</el-button>
            </el-upload>
            <div v-if="selectedFile" style="margin-top: 8px; color: #666;">
              已选择: {{ selectedFile.name }}
            </div>
          </el-form-item>
          
          <el-form-item v-if="importType === 'text'" label="配置内容">
            <el-input
              v-model="importText"
              type="textarea"
              :rows="10"
              placeholder="请输入JSON或YAML格式的服务配置"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="importDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmImport">导入</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { serviceApi } from '@/services/api'
import type { ServiceStatus, ServiceInfo } from '@/types'

const router = useRouter()

const services = ref<ServiceInfo[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const importDialogVisible = ref(false)
const isEdit = ref(false)
const importType = ref('file')
const selectedFile = ref<File | null>(null)
const importText = ref('')
const serviceFormRef = ref()

const serviceForm = reactive({
  id: '',
  name: '',
  logPath: '',
  type: '',
  interval: 30,
  description: ''
})

const serviceRules = {
  name: [
    { required: true, message: '请输入服务名称', trigger: 'blur' }
  ],
  logPath: [
    { required: true, message: '请输入日志路径', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择服务类型', trigger: 'change' }
  ],
  interval: [
    { required: true, message: '请输入监控间隔', trigger: 'blur' }
  ]
}

const dialogTitle = computed(() => isEdit.value ? '编辑服务' : '添加服务')

onMounted(() => {
  loadServices()
})

const loadServices = async () => {
  loading.value = true
  try {
    const response = await serviceApi.getAllServices()
          services.value = response as unknown as ServiceInfo[]
  } catch (error) {
    console.error('加载服务列表失败:', error)
    ElMessage.error('加载服务列表失败')
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

const editService = (service: ServiceInfo) => {
  isEdit.value = true
  Object.assign(serviceForm, service)
  dialogVisible.value = true
}

const saveService = async () => {
  try {
    await serviceFormRef.value?.validate()
    
    if (isEdit.value) {
      // 编辑服务
      const response = await serviceApi.updateService(serviceForm.id, serviceForm)
      if (response) {
        ElMessage.success('服务更新成功')
        dialogVisible.value = false
        loadServices()
      }
    } else {
      // 添加服务
      const newService = {
        name: serviceForm.name,
        logPath: serviceForm.logPath,
        type: serviceForm.type,
        interval: serviceForm.interval,
        description: serviceForm.description,
        status: 'running'
      }
      const response = await serviceApi.createService(newService)
      if (response) {
        ElMessage.success('服务添加成功')
        dialogVisible.value = false
        loadServices()
      }
    }
  } catch (error) {
    console.error('保存服务失败:', error)
    ElMessage.error('保存服务失败')
  }
}

const deleteService = async (service: ServiceInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除服务 "${service.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await serviceApi.deleteService(service.id)
    if (response) {
      ElMessage.success('服务删除成功')
      loadServices()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除服务失败:', error)
      ElMessage.error('删除服务失败')
    }
  }
}

const viewLogs = (service: ServiceInfo) => {
  router.push(`/search?service=${encodeURIComponent(service.name)}`)
}

const importServices = () => {
  importDialogVisible.value = true
  importType.value = 'file'
  selectedFile.value = null
  importText.value = ''
}

const handleFileChange = (file: any) => {
  selectedFile.value = file.raw
}

const confirmImport = async () => {
  try {
    let configData: any[] = []
    
    if (importType.value === 'file' && selectedFile.value) {
      // 从文件读取配置
      const text = await selectedFile.value.text()
      configData = JSON.parse(text)
    } else if (importType.value === 'text' && importText.value) {
      // 从文本解析配置
      configData = JSON.parse(importText.value)
    }
    
    // 验证配置格式
    if (!Array.isArray(configData)) {
      throw new Error('配置格式错误，应为数组格式')
    }
    
    // 转换配置数据格式
    const importServices = configData.map((item) => ({
      name: item.name || '未命名服务',
      logPath: item.logPath || '',
      type: item.type || 'java',
      interval: item.interval || 30,
      description: item.description || '',
      status: 'running'
    }))
    
    const response = await serviceApi.batchImportServices(importServices)
    if (response) {
      ElMessage.success(`成功导入 ${importServices.length} 个服务`)
      importDialogVisible.value = false
      loadServices()
    }
  } catch (error) {
    ElMessage.error(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

const exportServices = () => {
  try {
    const exportData = services.value.map(service => ({
      name: service.name,
      logPath: service.logPath,
      type: service.type || 'java',
      interval: service.interval || 30,
      description: service.description || ''
    }))
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `services-config-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    ElMessage.success('配置导出成功')
  } catch (error) {
    ElMessage.error('配置导出失败')
  }
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
