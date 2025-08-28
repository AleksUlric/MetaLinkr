<template>
  <div class="alert-configuration">
      <!-- 告警规则 -->
      <el-card class="alert-card">
        <template #header>
          <div class="card-header">
            <span>告警规则</span>
            <el-button type="primary" @click="addAlertRule">
              <el-icon><Plus /></el-icon>
              添加规则
            </el-button>
          </div>
        </template>

        <el-table :data="alertRules" style="width: 100%" v-loading="loading">
          <el-table-column prop="name" label="规则名称" width="150" />
          <el-table-column prop="condition" label="触发条件" width="200" />
          <el-table-column prop="level" label="级别" width="100">
            <template #default="{ row }">
              <el-tag :type="getLevelType(row.level)" size="small">
                {{ row.level }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="notificationMethods" label="通知方式" width="150">
            <template #default="{ row }">
              <el-tag
                v-for="method in row.notificationMethods"
                :key="method"
                size="small"
                style="margin-right: 4px"
              >
                {{ method }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="enabled" label="状态" width="100">
            <template #default="{ row }">
              <el-switch v-model="row.enabled" @change="toggleAlertRule(row)" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="editAlertRule(row)">
                编辑
              </el-button>
              <el-button type="text" size="small" @click="deleteAlertRule(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 通知配置 -->
      <el-card class="notification-card">
        <template #header>
          <div class="card-header">
            <span>通知配置</span>
          </div>
        </template>

        <el-tabs v-model="activeTab">
          <el-tab-pane label="邮件配置" name="email">
            <el-form :model="emailConfig" label-width="120px">
              <el-form-item label="SMTP服务器">
                <el-input v-model="emailConfig.smtpServer" placeholder="smtp.example.com" />
              </el-form-item>
              <el-form-item label="端口">
                <el-input-number v-model="emailConfig.port" :min="1" :max="65535" />
              </el-form-item>
              <el-form-item label="用户名">
                <el-input v-model="emailConfig.username" placeholder="your-email@example.com" />
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="emailConfig.password" type="password" placeholder="邮箱密码" />
              </el-form-item>
              <el-form-item label="收件人">
                <el-input v-model="emailConfig.recipients" placeholder="多个邮箱用逗号分隔" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveEmailConfig">保存配置</el-button>
                <el-button @click="testEmail">测试邮件</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="钉钉配置" name="dingtalk">
            <el-form :model="dingtalkConfig" label-width="120px">
              <el-form-item label="Webhook地址">
                <el-input v-model="dingtalkConfig.webhook" placeholder="https://oapi.dingtalk.com/robot/send?access_token=xxx" />
              </el-form-item>
              <el-form-item label="关键词">
                <el-input v-model="dingtalkConfig.keyword" placeholder="告警关键词" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveDingtalkConfig">保存配置</el-button>
                <el-button @click="testDingtalk">测试消息</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="短信配置" name="sms">
            <el-form :model="smsConfig" label-width="120px">
              <el-form-item label="服务商">
                <el-select v-model="smsConfig.provider" placeholder="选择短信服务商">
                  <el-option label="阿里云" value="aliyun" />
                  <el-option label="腾讯云" value="tencent" />
                  <el-option label="华为云" value="huawei" />
                </el-select>
              </el-form-item>
              <el-form-item label="AccessKey">
                <el-input v-model="smsConfig.accessKey" placeholder="AccessKey" />
              </el-form-item>
              <el-form-item label="SecretKey">
                <el-input v-model="smsConfig.secretKey" type="password" placeholder="SecretKey" />
              </el-form-item>
              <el-form-item label="手机号码">
                <el-input v-model="smsConfig.phoneNumbers" placeholder="多个号码用逗号分隔" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveSmsConfig">保存配置</el-button>
                <el-button @click="testSms">测试短信</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 添加/编辑告警规则对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="600px"
      >
        <el-form :model="alertForm" label-width="100px">
          <el-form-item label="规则名称">
            <el-input v-model="alertForm.name" placeholder="请输入规则名称" />
          </el-form-item>
          <el-form-item label="触发条件">
            <el-input v-model="alertForm.condition" placeholder="例如：错误日志>10条/分钟" />
          </el-form-item>
          <el-form-item label="日志级别">
            <el-select v-model="alertForm.level" placeholder="选择级别">
              <el-option label="DEBUG" value="DEBUG" />
              <el-option label="INFO" value="INFO" />
              <el-option label="WARN" value="WARN" />
              <el-option label="ERROR" value="ERROR" />
              <el-option label="FATAL" value="FATAL" />
            </el-select>
          </el-form-item>
          <el-form-item label="通知方式">
            <el-checkbox-group v-model="alertForm.notificationMethods">
              <el-checkbox label="邮件" />
              <el-checkbox label="短信" />
              <el-checkbox label="钉钉" />
              <el-checkbox label="微信" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="启用状态">
            <el-switch v-model="alertForm.enabled" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveAlertRule">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useLogStore } from '../stores/logStore'
import type { LogLevel } from '../types'
import { Plus } from '@element-plus/icons-vue'

const logStore = useLogStore()

const alertRules = ref<any[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const activeTab = ref('email')

const alertForm = reactive({
  id: '',
  name: '',
  condition: '',
  level: '',
  notificationMethods: [],
  enabled: true
})

const emailConfig = reactive({
  smtpServer: '',
  port: 587,
  username: '',
  password: '',
  recipients: ''
})

const dingtalkConfig = reactive({
  webhook: '',
  keyword: ''
})

const smsConfig = reactive({
  provider: '',
  accessKey: '',
  secretKey: '',
  phoneNumbers: ''
})

const dialogTitle = computed(() => isEdit.value ? '编辑告警规则' : '添加告警规则')

onMounted(() => {
  loadAlertRules()
})

const loadAlertRules = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    alertRules.value = logStore.alertRules
  } finally {
    loading.value = false
  }
}

const addAlertRule = () => {
  isEdit.value = false
  Object.assign(alertForm, {
    id: '',
    name: '',
    condition: '',
    level: '',
    notificationMethods: [],
    enabled: true
  })
  dialogVisible.value = true
}

const editAlertRule = (rule: any) => {
  isEdit.value = true
  Object.assign(alertForm, rule)
  dialogVisible.value = true
}

const saveAlertRule = () => {
  console.log('保存告警规则:', alertForm)
  dialogVisible.value = false
  loadAlertRules()
}

const deleteAlertRule = (rule: any) => {
  console.log('删除告警规则:', rule)
}

const toggleAlertRule = (rule: any) => {
  console.log('切换告警规则状态:', rule)
}

const saveEmailConfig = () => {
  console.log('保存邮件配置:', emailConfig)
}

const testEmail = () => {
  console.log('测试邮件发送')
}

const saveDingtalkConfig = () => {
  console.log('保存钉钉配置:', dingtalkConfig)
}

const testDingtalk = () => {
  console.log('测试钉钉消息')
}

const saveSmsConfig = () => {
  console.log('保存短信配置:', smsConfig)
}

const testSms = () => {
  console.log('测试短信发送')
}

const getLevelType = (level: string) => {
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
.alert-configuration {
  padding: 20px;
}

.alert-card,
.notification-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
