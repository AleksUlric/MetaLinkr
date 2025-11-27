<template>
  <div class="forgot-password-page">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="forgot-password-container">
      <!-- 头部 -->
      <div class="header">
        <div class="back-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
        </div>
        <div class="title">找回密码</div>
      </div>

      <!-- 步骤指示器 -->
      <div class="step-indicator">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="step-item"
          :class="{ 
            'active': currentStep === index,
            'completed': currentStep > index
          }"
        >
          <div class="step-number">
            <el-icon v-if="currentStep > index"><Check /></el-icon>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="step-label">{{ step.label }}</div>
        </div>
      </div>

      <!-- 步骤内容 -->
      <div class="step-content">
        <!-- 步骤1: 验证手机号 -->
        <div v-if="currentStep === 0" class="step-panel">
          <div class="panel-header">
            <h3>验证手机号</h3>
            <p>请输入注册时使用的手机号</p>
          </div>
          
          <el-form
            ref="phoneFormRef"
            :model="phoneForm"
            :rules="phoneRules"
            class="form-content"
          >
            <el-form-item prop="phone">
              <el-input
                v-model="phoneForm.phone"
                placeholder="请输入手机号"
                :prefix-icon="Phone"
                size="large"
                maxlength="11"
              />
            </el-form-item>
            
            <el-button
              type="primary"
              size="large"
              :loading="isSendingCode"
              @click="sendVerificationCode"
              class="action-btn"
            >
              {{ isSendingCode ? '发送中...' : '发送验证码' }}
            </el-button>
          </el-form>
        </div>

        <!-- 步骤2: 输入验证码 -->
        <div v-if="currentStep === 1" class="step-panel">
          <div class="panel-header">
            <h3>输入验证码</h3>
            <p>验证码已发送至 {{ phoneForm.phone }}</p>
          </div>
          
          <el-form
            ref="codeFormRef"
            :model="codeForm"
            :rules="codeRules"
            class="form-content"
          >
            <el-form-item prop="verificationCode">
              <div class="verification-input">
                <el-input
                  v-model="codeForm.verificationCode"
                  placeholder="请输入6位验证码"
                  :prefix-icon="Message"
                  size="large"
                  maxlength="6"
                  class="code-input"
                />
                <el-button
                  :disabled="countdown > 0"
                  @click="resendCode"
                  class="resend-btn"
                >
                  {{ countdown > 0 ? `${countdown}s` : '重新发送' }}
                </el-button>
              </div>
            </el-form-item>
            
            <el-button
              type="primary"
              size="large"
              @click="verifyCode"
              class="action-btn"
            >
              验证
            </el-button>
          </el-form>
        </div>

        <!-- 步骤3: 重置密码 -->
        <div v-if="currentStep === 2" class="step-panel">
          <div class="panel-header">
            <h3>重置密码</h3>
            <p>请设置新密码</p>
          </div>
          
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            class="form-content"
          >
            <el-form-item prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="请输入新密码"
                :prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="请确认新密码"
                :prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            
            <el-button
              type="primary"
              size="large"
              :loading="isResetting"
              @click="resetPassword"
              class="action-btn"
            >
              {{ isResetting ? '重置中...' : '重置密码' }}
            </el-button>
          </el-form>
        </div>

        <!-- 步骤4: 完成 -->
        <div v-if="currentStep === 3" class="step-panel success-panel">
          <div class="success-content">
            <div class="success-icon">
              <el-icon><Check /></el-icon>
            </div>
            <h3>密码重置成功</h3>
            <p>您的密码已成功重置，请使用新密码登录</p>
            
            <div class="success-actions">
              <el-button
                type="primary"
                size="large"
                @click="goToLogin"
                class="action-btn"
              >
                立即登录
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部链接 -->
      <div class="footer-links">
        <el-button text @click="goToLogin">返回登录</el-button>
        <el-button text @click="goToRegister">注册账号</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Check, 
  Phone, 
  Message, 
  Lock 
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()

// 响应式数据
const currentStep = ref(0)
const isSendingCode = ref(false)
const isResetting = ref(false)
const countdown = ref(0)

const phoneFormRef = ref<FormInstance>()
const codeFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

const steps = ref([
  { label: '验证手机号' },
  { label: '输入验证码' },
  { label: '重置密码' },
  { label: '完成' }
])

const phoneForm = ref({
  phone: ''
})

const codeForm = ref({
  verificationCode: ''
})

const passwordForm = ref({
  newPassword: '',
  confirmPassword: ''
})

// 表单验证规则
const phoneRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const codeRules: FormRules = {
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位数字验证码', trigger: 'blur' }
  ]
}

const passwordRules: FormRules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: '密码必须包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 方法
const goBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  } else {
    router.back()
  }
}

const sendVerificationCode = async () => {
  if (!phoneFormRef.value) return

  try {
    await phoneFormRef.value.validate()
    
    isSendingCode.value = true
    
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    ElMessage.success('验证码已发送')
    currentStep.value = 1
    startCountdown()
  } catch (error) {
    console.error('发送验证码失败:', error)
  } finally {
    isSendingCode.value = false
  }
}

const verifyCode = async () => {
  if (!codeFormRef.value) return

  try {
    await codeFormRef.value.validate()
    
    // 模拟验证验证码
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('验证码验证成功')
    currentStep.value = 2
  } catch (error) {
    console.error('验证码验证失败:', error)
  }
}

const resetPassword = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    
    isResetting.value = true
    
    // 模拟重置密码
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('密码重置成功')
    currentStep.value = 3
  } catch (error) {
    console.error('密码重置失败:', error)
  } finally {
    isResetting.value = false
  }
}

const resendCode = async () => {
  try {
    // 模拟重新发送验证码
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('验证码已重新发送')
    startCountdown()
  } catch (error) {
    ElMessage.error('发送失败，请重试')
  }
}

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style lang="scss" scoped>
.forgot-password-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;

  .floating-shapes {
    position: relative;
    width: 100%;
    height: 100%;

    .shape {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
      animation: float 6s ease-in-out infinite;

      &.shape-1 {
        width: 100px;
        height: 100px;
        top: 20%;
        left: 10%;
        animation-delay: 0s;
      }

      &.shape-2 {
        width: 80px;
        height: 80px;
        top: 60%;
        right: 15%;
        animation-delay: 2s;
      }

      &.shape-3 {
        width: 120px;
        height: 120px;
        bottom: 20%;
        left: 20%;
        animation-delay: 4s;
      }
    }
  }
}

.forgot-password-container {
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  padding: 40px 30px;
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(196, 181, 253, 0.3);
  position: relative;
  z-index: 1;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;

  .back-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #8b5cf6;
    margin-right: 15px;

    &:hover {
      background: rgba(139, 92, 246, 0.2);
    }
  }

  .title {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
  }
}

.step-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    height: 2px;
    background: rgba(196, 181, 253, 0.3);
    z-index: 0;
  }

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(196, 181, 253, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 8px;
      transition: all 0.3s ease;

      .el-icon {
        font-size: 20px;
        color: white;
      }
    }

    .step-label {
      font-size: 12px;
      color: #64748b;
      text-align: center;
      font-weight: 500;
    }

    &.active {
      .step-number {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        color: white;
      }

      .step-label {
        color: #8b5cf6;
        font-weight: 600;
      }
    }

    &.completed {
      .step-number {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
      }

      .step-label {
        color: #10b981;
        font-weight: 600;
      }
    }
  }
}

.step-content {
  .step-panel {
    .panel-header {
      text-align: center;
      margin-bottom: 30px;

      h3 {
        font-size: 20px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        color: #64748b;
      }
    }

    .form-content {
      .el-form-item {
        margin-bottom: 20px;

        .el-input {
          .el-input__inner {
            border-radius: 12px;
            background: rgba(139, 92, 246, 0.05);
            border: 1px solid rgba(139, 92, 246, 0.1);
            color: #334155;
            font-size: 16px;
            padding: 12px 16px;

            &::placeholder {
              color: #94a3b8;
            }

            &:focus {
              border-color: #8b5cf6;
              box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
            }
          }
        }

        .verification-input {
          display: flex;
          gap: 10px;

          .code-input {
            flex: 1;
          }

          .resend-btn {
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.3);
            color: #8b5cf6;
            font-weight: 600;
            border-radius: 12px;
            padding: 12px 20px;
            white-space: nowrap;

            &:hover:not(:disabled) {
              background: rgba(139, 92, 246, 0.2);
            }

            &:disabled {
              background: rgba(148, 163, 184, 0.3);
              color: rgba(148, 163, 184, 0.8);
              border-color: rgba(148, 163, 184, 0.3);
            }
          }
        }

        .action-btn {
          width: 100%;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          color: white;
          font-weight: 600;
          font-size: 16px;
          padding: 15px;
          border-radius: 12px;
          transition: all 0.3s ease;

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
          }

          &:disabled {
            background: rgba(148, 163, 184, 0.3);
            color: rgba(148, 163, 184, 0.8);
          }
        }
      }
    }

    &.success-panel {
      .success-content {
        text-align: center;

        .success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          animation: successPulse 2s infinite;

          .el-icon {
            font-size: 40px;
            color: white;
          }
        }

        h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 10px;
        }

        p {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 30px;
        }

        .success-actions {
          .action-btn {
            width: 100%;
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            border: none;
            color: white;
            font-weight: 600;
            font-size: 16px;
            padding: 15px;
            border-radius: 12px;
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
            }
          }
        }
      }
    }
  }
}

.footer-links {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(196, 181, 253, 0.2);

  .el-button {
    color: #8b5cf6;
    font-weight: 600;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes successPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
