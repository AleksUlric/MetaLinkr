<template>
  <div class="register-page">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="register-container">
      <!-- 头部 -->
      <div class="register-header">
        <div class="logo-section">
          <div class="logo">linkr</div>
          <div class="slogan">连接心灵，分享美好</div>
        </div>
        <div class="back-to-login">
          <span>已有账号？</span>
          <el-button text @click="goToLogin">立即登录</el-button>
        </div>
      </div>

      <!-- 注册表单 -->
      <div class="register-form">
        <div class="form-header">
          <h2>创建账号</h2>
          <p>加入我们，开启你的社交之旅</p>
        </div>

        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="form-content"
          @submit.prevent="handleRegister"
        >
          <!-- 手机号 -->
          <el-form-item prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="请输入手机号"
              :prefix-icon="Phone"
              size="large"
              maxlength="11"
            />
          </el-form-item>

          <!-- 验证码 -->
          <el-form-item prop="verificationCode">
            <div class="verification-input">
              <el-input
                v-model="registerForm.verificationCode"
                placeholder="请输入验证码"
                :prefix-icon="Message"
                size="large"
                maxlength="6"
              />
              <el-button
                :disabled="!canSendCode || countdown > 0 || isSendingCode"
                :loading="isSendingCode"
                @click="sendVerificationCode"
                class="send-code-btn"
              >
                {{ isSendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请设置密码"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>

          <!-- 昵称 -->
          <el-form-item prop="nickname">
            <el-input
              v-model="registerForm.nickname"
              placeholder="请设置昵称"
              :prefix-icon="User"
              size="large"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>

          <!-- 性别 -->
          <el-form-item prop="gender">
            <div class="gender-selection">
              <div class="gender-label">性别</div>
              <el-radio-group v-model="registerForm.gender" class="gender-options">
                <el-radio value="male" class="gender-option">
                  <div class="gender-icon">👨</div>
                </el-radio>
                <el-radio value="female" class="gender-option">
                  <div class="gender-icon">👩</div>
                </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>

          <!-- 生日 -->
          <el-form-item prop="birthday">
            <el-date-picker
              v-model="registerForm.birthday"
              type="date"
              placeholder="请选择生日"
              size="large"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledDate"
              class="birthday-picker"
            />
          </el-form-item>

          <!-- 协议同意 -->
          <el-form-item prop="agreement">
            <div class="agreement-section">
              <el-checkbox v-model="registerForm.agreement" class="agreement-checkbox">
                我已阅读并同意
              </el-checkbox>
              <el-button text @click="showUserAgreement">《用户协议》</el-button>
              <span>和</span>
              <el-button text @click="showPrivacyPolicy">《隐私政策》</el-button>
            </div>
          </el-form-item>

          <!-- 注册按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="isRegistering"
              @click="handleRegister"
              class="register-btn"
            >
              {{ isRegistering ? '注册中...' : '立即注册' }}
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 第三方登录 -->
        <div class="third-party-login">
          <div class="divider">
            <span>或使用以下方式注册</span>
          </div>
          <div class="third-party-buttons">
            <el-button class="third-party-btn wechat" @click="loginWithWechat">
              <el-icon><ChatDotRound /></el-icon>
              微信
            </el-button>
            <el-button class="third-party-btn qq" @click="loginWithQQ">
              <el-icon><User /></el-icon>
              QQ
            </el-button>
            <el-button class="third-party-btn weibo" @click="loginWithWeibo">
              <el-icon><Share /></el-icon>
              微博
            </el-button>
          </div>
          
          <!-- QQ登录按钮容器 -->
          <div id="qqLoginBtn" style="display: none;"></div>
        </div>
      </div>
    </div>

    <!-- 用户协议弹窗 -->
    <el-dialog 
      v-model="showAgreementDialog" 
      title="用户协议"
      width="90%"
      class="agreement-dialog"
    >
      <div class="agreement-content">
        <h3>用户服务协议</h3>
        <div class="agreement-text">
          <p>欢迎使用linkr社交平台！</p>
          <p>在使用我们的服务之前，请仔细阅读以下条款：</p>
          
          <h4>1. 服务说明</h4>
          <p>linkr是一个专注于陌生人社交的平台，为用户提供安全、有趣的社交体验。</p>
          
          <h4>2. 用户责任</h4>
          <p>用户应当：</p>
          <ul>
            <li>提供真实、准确的个人信息</li>
            <li>遵守相关法律法规</li>
            <li>尊重其他用户</li>
            <li>不发布违法违规内容</li>
          </ul>
          
          <h4>3. 隐私保护</h4>
          <p>我们重视用户隐私，会采取适当措施保护用户信息安全。</p>
          
          <h4>4. 服务变更</h4>
          <p>我们保留随时修改或终止服务的权利。</p>
        </div>
      </div>
    </el-dialog>

    <!-- 隐私政策弹窗 -->
    <el-dialog 
      v-model="showPrivacyDialog" 
      title="隐私政策"
      width="90%"
      class="privacy-dialog"
    >
      <div class="privacy-content">
        <h3>隐私政策</h3>
        <div class="privacy-text">
          <p>我们深知隐私对您的重要性，特此说明我们如何收集、使用和保护您的信息。</p>
          
          <h4>1. 信息收集</h4>
          <p>我们可能收集以下信息：</p>
          <ul>
            <li>注册时提供的基本信息</li>
            <li>使用服务时产生的数据</li>
            <li>设备信息和日志</li>
          </ul>
          
          <h4>2. 信息使用</h4>
          <p>我们使用收集的信息用于：</p>
          <ul>
            <li>提供和改进服务</li>
            <li>个性化用户体验</li>
            <li>安全保障</li>
          </ul>
          
          <h4>3. 信息保护</h4>
          <p>我们采用行业标准的安全措施保护您的信息。</p>
          
          <h4>4. 信息共享</h4>
          <p>未经您同意，我们不会与第三方分享您的个人信息。</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Phone, 
  Message, 
  Lock, 
  User, 
  ChatDotRound, 
  Share 
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '../../stores/auth'
import { SmsUtil } from '../../services/smsService'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const registerFormRef = ref<FormInstance>()
const isRegistering = ref(false)
const countdown = ref(0)
const showAgreementDialog = ref(false)
const showPrivacyDialog = ref(false)

const registerForm = ref({
  phone: '',
  verificationCode: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  gender: 'male',
  birthday: '',
  agreement: false
})

// 表单验证规则
const registerRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位数字验证码', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: '密码必须包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度为2-20位', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  birthday: [
    { required: true, message: '请选择生日', trigger: 'change' }
  ],
  agreement: [
    {
      validator: (_rule, value, callback) => {
        if (!value) {
          callback(new Error('请同意用户协议和隐私政策'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 计算属性
const canSendCode = computed(() => {
  return /^1[3-9]\d{9}$/.test(registerForm.value.phone)
})

// 短信验证码相关
const isSendingCode = ref(false)
const remainingCount = ref(10)
const nextSendTime = ref(0)

// 方法
const goToLogin = () => {
  router.push('/login')
}

const sendVerificationCode = async () => {
  if (!canSendCode.value) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  if (isSendingCode.value) {
    return
  }

  try {
    isSendingCode.value = true
    
    // 使用短信服务发送验证码
    const success = await SmsUtil.sendCodeWithMessage(registerForm.value.phone)
    
    if (success) {
      startCountdown()
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    ElMessage.error('发送失败，请重试')
  } finally {
    isSendingCode.value = false
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

const disabledDate = (time: Date) => {
  const today = new Date()
  const minDate = new Date()
  minDate.setFullYear(today.getFullYear() - 100) // 100年前
  const maxDate = new Date()
  maxDate.setFullYear(today.getFullYear() - 13) // 13年前
  
  return time.getTime() < minDate.getTime() || time.getTime() > maxDate.getTime()
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    
    // 验证短信验证码
    const isValidCode = await SmsUtil.verifyCodeWithMessage(
      registerForm.value.phone, 
      registerForm.value.verificationCode
    )
    
    if (!isValidCode) {
      return
    }
    
    isRegistering.value = true
    
    // 调用注册接口
    const success = await authStore.register(registerForm.value)
    
    if (success) {
      ElMessage.success('注册成功！')
      router.push('/app/planet')
    }
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error('注册失败，请重试')
  } finally {
    isRegistering.value = false
  }
}

const showUserAgreement = () => {
  showAgreementDialog.value = true
}

const showPrivacyPolicy = () => {
  showPrivacyDialog.value = true
}

const loginWithWechat = () => {
  ElMessage.info('微信登录功能开发中...')
}

const loginWithQQ = async () => {
  try {
    // 检查QQ SDK是否加载
    if (typeof window.QC === 'undefined' || !window.QC.check()) {
      ElMessage.error('QQ登录SDK未加载，请刷新页面重试')
      return
    }

    // 使用QQ SDK进行登录
    window.QC.Login({
      btnId: "qqLoginBtn",
      scope: "get_user_info",
      size: "A_M",
      display: "pc"
    })

    // 监听QQ登录成功
    window.QC.Api.get_user_info(async (openId: string, userInfo: any) => {
      if (openId && userInfo) {
        try {
          // 这里需要获取授权码，QQ SDK不直接提供，需要通过其他方式
          // 暂时使用测试接口
          const { get } = await import('@/utils/request')
          const result = await get<{ success: boolean; data: any; message?: string }>('/api/auth/qq/test')
          
          if (result.success) {
            ElMessage.success('QQ登录成功')
            // 这里应该处理登录成功后的逻辑
            console.log('QQ登录成功:', result.data)
          } else {
            ElMessage.error('QQ登录失败')
          }
        } catch (error) {
          console.error('QQ登录处理失败:', error)
          ElMessage.error('QQ登录失败')
        }
      }
    })

  } catch (error) {
    console.error('QQ登录失败:', error)
    ElMessage.error('QQ登录失败')
  }
}

const loginWithWeibo = () => {
  ElMessage.info('微博登录功能开发中...')
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
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
        width: 80px;
        height: 80px;
        top: 20%;
        left: 10%;
        animation-delay: 0s;
      }

      &.shape-2 {
        width: 120px;
        height: 120px;
        top: 60%;
        right: 15%;
        animation-delay: 2s;
      }

      &.shape-3 {
        width: 60px;
        height: 60px;
        bottom: 20%;
        left: 20%;
        animation-delay: 4s;
      }

      &.shape-4 {
        width: 100px;
        height: 100px;
        top: 30%;
        right: 30%;
        animation-delay: 1s;
      }
    }
  }
}

.register-container {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  padding: 40px 30px;
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(196, 181, 253, 0.3);
  position: relative;
  z-index: 1;
  margin: 20px 0;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;

  .logo-section {
    margin-bottom: 20px;

    .logo {
      font-size: 32px;
      font-weight: 700;
      background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }

    .slogan {
      font-size: 14px;
      color: #64748b;
    }
  }

  .back-to-login {
    font-size: 14px;
    color: #64748b;

    .el-button {
      color: #8b5cf6;
      font-weight: 600;
    }
  }
}

.register-form {
  .form-header {
    text-align: center;
    margin-bottom: 30px;

    h2 {
      font-size: 24px;
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
        .el-input__wrapper {
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: none;
          
          .el-input__inner {
            color: #1e293b !important;
            font-size: 16px;
            padding: 12px 16px;
            background: transparent;
            border: none;

            &::placeholder {
              color: #64748b !important;
            }
          }

          &:hover {
            border-color: rgba(139, 92, 246, 0.3);
            background: rgba(255, 255, 255, 0.9);
          }

          &.is-focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
            background: rgba(255, 255, 255, 0.95);
          }
        }
      }

      .verification-input {
        display: flex;
        gap: 10px;

        .el-input {
          flex: 1;
        }

        .send-code-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          color: white;
          font-weight: 600;
          border-radius: 12px;
          padding: 12px 20px;
          white-space: nowrap;

          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 3px 10px rgba(139, 92, 246, 0.3);
          }

          &:disabled {
            background: rgba(148, 163, 184, 0.3);
            color: rgba(148, 163, 184, 0.8);
          }
        }
      }

      .gender-selection {
        .gender-label {
          font-size: 14px;
          color: #475569;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .gender-options {
          display: flex;
          gap: 15px;
          justify-content: center;

          .gender-option {
            flex: 0 0 100px;
            margin: 0;
            padding: 20px;
            border: 2px solid rgba(139, 92, 246, 0.1);
            border-radius: 12px;
            background: rgba(139, 92, 246, 0.05);
            transition: all 0.3s ease;
            cursor: pointer;
            min-height: 80px;

            &:hover {
              border-color: rgba(139, 92, 246, 0.3);
              background: rgba(139, 92, 246, 0.1);
            }

            &.is-checked {
              border-color: #8b5cf6;
              background: rgba(139, 92, 246, 0.1);
            }

            .el-radio__label {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: #334155;
              font-weight: 600;
              width: 100%;
              height: 100%;

              .gender-icon {
                font-size: 32px;
              }
            }
          }
        }
      }

      .birthday-picker {
        width: 100%;

        .el-input__wrapper {
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: none;
          
          .el-input__inner {
            color: #1e293b !important;
            font-size: 16px;
            padding: 12px 16px;
            background: transparent;
            border: none;
          }

          &:hover {
            border-color: rgba(139, 92, 246, 0.3);
            background: rgba(255, 255, 255, 0.9);
          }

          &.is-focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
            background: rgba(255, 255, 255, 0.95);
          }
        }
      }

      .agreement-section {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        color: #64748b;

        .agreement-checkbox {
          .el-checkbox__label {
            color: #64748b;
          }
        }

        .el-button {
          color: #8b5cf6;
          font-weight: 600;
          padding: 0;
        }
      }

      .register-btn {
        width: 100%;
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        border: none;
        color: white;
        font-weight: 600;
        font-size: 16px;
        padding: 15px;
        border-radius: 12px;
        transition: all 0.3s ease;
        margin-top: 10px;

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
}

.third-party-login {
  margin-top: 30px;
  margin-bottom: 20px;

  .divider {
    text-align: center;
    margin-bottom: 20px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(196, 181, 253, 0.3);
    }

    span {
      background: rgba(255, 255, 255, 0.9);
      padding: 0 15px;
      font-size: 14px;
      color: #64748b;
    }
  }

  .third-party-buttons {
    display: flex;
    gap: 15px;

    .third-party-btn {
      flex: 1;
      padding: 12px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;

      &.wechat {
        background: rgba(9, 187, 7, 0.1);
        border: 1px solid rgba(9, 187, 7, 0.3);
        color: #09bb07;

        &:hover {
          background: rgba(9, 187, 7, 0.2);
          transform: translateY(-1px);
        }
      }

      &.qq {
        background: rgba(18, 183, 245, 0.1);
        border: 1px solid rgba(18, 183, 245, 0.3);
        color: #12b7f5;

        &:hover {
          background: rgba(18, 183, 245, 0.2);
          transform: translateY(-1px);
        }
      }

      &.weibo {
        background: rgba(230, 22, 45, 0.1);
        border: 1px solid rgba(230, 22, 45, 0.3);
        color: #e6162d;

        &:hover {
          background: rgba(230, 22, 45, 0.2);
          transform: translateY(-1px);
        }
      }

      .el-icon {
        margin-right: 8px;
      }
    }
  }
}

.agreement-dialog, .privacy-dialog {
  .agreement-content, .privacy-content {
    h3 {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 20px;
      text-align: center;
    }

    .agreement-text, .privacy-text {
      font-size: 14px;
      color: #334155;
      line-height: 1.6;

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin: 20px 0 10px 0;
      }

      p {
        margin-bottom: 10px;
      }

      ul {
        margin: 10px 0;
        padding-left: 20px;

        li {
          margin-bottom: 5px;
        }
      }
    }
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
</style>
