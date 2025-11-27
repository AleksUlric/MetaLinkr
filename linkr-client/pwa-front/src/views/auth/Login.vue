<template>
  <div class="login-page">
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
    <div class="login-container">
      <!-- 头部 -->
      <div class="login-header">
        <div class="logo-section">
          <div class="logo">linkr</div>
          <div class="slogan">连接心灵，分享美好</div>
        </div>
      </div>

      <!-- 登录表单 -->
      <div class="login-form">
        <div class="form-header">
          <h2>欢迎使用</h2>
          <p>输入手机号验证码，即可登录或注册</p>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="form-content"
          @submit.prevent="handleLogin"
        >
          <!-- 手机号 -->
          <el-form-item prop="phone">
            <el-input
              v-model="loginForm.phone"
              placeholder="请输入手机号"
              :prefix-icon="Phone"
              size="large"
              maxlength="11"
              class="custom-input"
            />
          </el-form-item>

          <!-- 验证码 -->
          <el-form-item prop="verificationCode">
            <div class="verification-input">
              <el-input
                v-model="loginForm.verificationCode"
                placeholder="请输入验证码"
                :prefix-icon="Message"
                size="large"
                maxlength="6"
                class="custom-input"
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

          <!-- 登录选项 -->
          <div class="form-options">
            <el-checkbox v-model="loginForm.rememberMe" class="remember-checkbox">
              记住我
            </el-checkbox>
            <el-button text @click="goToRegister">完善个人信息</el-button>
          </div>

          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="isLoggingIn"
              @click="handleLogin"
              class="login-btn"
            >
              {{ isLoggingIn ? '登录中...' : '登录/注册' }}
            </el-button>
          </el-form-item>

          <!-- 测试按钮 -->
          <el-form-item>
            <el-button
              type="success"
              size="large"
              @click="handleTestLogin"
              class="test-btn"
            >
              测试登录
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 第三方登录 -->
        <div class="third-party-login">
          <div class="divider">
            <span>或使用以下方式登录</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Phone, 
  Message, 
  ChatDotRound, 
  User, 
  Share 
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '../../stores/auth'
import { SmsUtil } from '../../services/smsService'

const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const loginFormRef = ref<FormInstance>()
const isLoggingIn = ref(false)
const countdown = ref(0)
const isSendingCode = ref(false)

const loginForm = ref({
  phone: '',
  verificationCode: '',
  rememberMe: false
})

// 表单验证规则
const loginRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位数字验证码', trigger: 'blur' }
  ]
}

// 计算属性
const canSendCode = computed(() => {
  return /^1[3-9]\d{9}$/.test(loginForm.value.phone)
})

// 方法
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    
    isLoggingIn.value = true
    
    // 使用短信验证码登录
    const success = await authStore.smsLogin(loginForm.value)
    
    if (success) {
      router.push('/app/planet')
    }
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    isLoggingIn.value = false
  }
}

// 发送验证码
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
    const success = await SmsUtil.sendCodeWithMessage(loginForm.value.phone)
    
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

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 生成随机手机号
const generateRandomPhone = (): string => {
  // 手机号前缀（1开头，第二位3-9）
  const prefixes = ['13', '14', '15', '16', '17', '18', '19']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  
  // 生成后9位随机数字
  const suffix = Math.floor(100000000 + Math.random() * 900000000).toString()
  
  return prefix + suffix
}

const handleTestLogin = async () => {
  try {
    // 生成随机手机号
    const randomPhone = generateRandomPhone()
    
    ElMessage.info('正在获取测试验证码...')
    
    // 调用测试发送验证码接口获取验证码
    const { post: requestPost } = await import('@/utils/request')
    let smsResult: { code?: string } | null = null
    
    try {
      smsResult = await requestPost<{ code: string }>('/api/sms/test', 
        new URLSearchParams({ phone: randomPhone }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
    } catch (error) {
      console.warn('测试接口调用失败，使用默认验证码:', error)
    }
    
    if (smsResult && smsResult.code) {
      // 自动填充手机号和验证码
      loginForm.value.phone = randomPhone
      loginForm.value.verificationCode = smsResult.code
      loginForm.value.rememberMe = true
      
      ElMessage.success(`已填充手机号: ${randomPhone.substring(0, 3)}****${randomPhone.substring(7)}`)
      
      // 等待一下让用户看到填充的内容，然后自动登录
      setTimeout(async () => {
        await handleLogin()
      }, 500)
    } else {
      // 如果测试接口失败，使用默认测试验证码
      loginForm.value.phone = randomPhone
      loginForm.value.verificationCode = '123456'
      loginForm.value.rememberMe = true
      
      ElMessage.warning('使用默认测试验证码')
      await handleLogin()
    }
  } catch (error) {
    console.error('测试登录失败:', error)
    // 如果出错，使用默认值
    const randomPhone = generateRandomPhone()
    loginForm.value.phone = randomPhone
    loginForm.value.verificationCode = '123456'
    loginForm.value.rememberMe = true
    
    ElMessage.warning('使用默认测试账号')
    await handleLogin()
  }
}

const goToRegister = () => {
  router.push('/complete-profile')
}


const loginWithWechat = () => {
  ElMessage.info('微信登录功能开发中...')
}

const loginWithQQ = async () => {
  try {
    ElMessage.info('正在使用测试模式登录...')
    
    // 直接调用测试接口（自测阶段使用）
    const { get: requestGet } = await import('@/utils/request')
    const result = await requestGet<{ success: boolean; data: string }>('/api/auth/qq/test')
    
    if (result.success) {
      ElMessage.success('QQ登录成功（测试模式）')
      
      // Session已自动设置，获取用户信息
      await authStore.fetchUserInfo()
      
      // 跳转到首页
      router.push('/')
    } else {
      ElMessage.error('QQ登录失败')
    }
  } catch (error: any) {
    console.error('QQ登录失败:', error)
    ElMessage.error(error.message || 'QQ登录失败，请检查后端服务是否启动')
  }
}

const loginWithWeibo = () => {
  ElMessage.info('微博登录功能开发中...')
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  // 自定义输入框样式
  .custom-input {
    .el-input__wrapper {
      background: rgba(255, 255, 255, 0.8) !important;
      border: 1px solid rgba(139, 92, 246, 0.2) !important;
      
      .el-input__inner {
        color: #1e293b !important;
        background: transparent !important;
        
        &::placeholder {
          color: #64748b !important;
        }
      }
      
      &:hover {
        background: rgba(255, 255, 255, 0.9) !important;
        border-color: rgba(139, 92, 246, 0.3) !important;
      }
      
      &.is-focus {
        background: rgba(255, 255, 255, 0.95) !important;
        border-color: #8b5cf6 !important;
      }
    }
    
    .el-input__suffix {
      .el-input__suffix-inner {
        .el-icon {
          color: #64748b !important;
        }
      }
    }
  }

  // 强制设置输入文字颜色 - 使用更具体的选择器
  .el-input .el-input__wrapper .el-input__inner {
    color: #1e293b !important;
  }

  .el-input .el-input__wrapper .el-input__inner::placeholder {
    color: #64748b !important;
  }

  // 针对登录容器内的输入框
  .login-container .el-input .el-input__wrapper .el-input__inner {
    color: #1e293b !important;
  }

  .login-container .el-input .el-input__wrapper .el-input__inner::placeholder {
    color: #64748b !important;
  }
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

.login-container {
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
}

.login-header {
  text-align: center;
  margin-bottom: 30px;

  .logo-section {
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
}

.login-form {
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
            background: rgba(255, 255, 255, 0.8) !important;
            border: 1px solid rgba(139, 92, 246, 0.2) !important;
            box-shadow: none;
            
            .el-input__inner {
              color: #1e293b !important;
              font-size: 16px;
              padding: 12px 16px;
              background: transparent !important;
              border: none;

              &::placeholder {
                color: #64748b !important;
              }
            }

            &:hover {
              border-color: rgba(139, 92, 246, 0.3) !important;
              background: rgba(255, 255, 255, 0.9) !important;
            }

            &.is-focus {
              border-color: #8b5cf6 !important;
              box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
              background: rgba(255, 255, 255, 0.95) !important;
            }
          }

          // 图标样式
          .el-input__suffix {
            .el-input__suffix-inner {
              .el-icon {
                color: #64748b !important;
              }
            }
          }
        }

        // 验证码输入框样式
        .verification-input {
          display: flex;
          gap: 12px;
          align-items: flex-start;

          .el-input {
            flex: 1;
          }

          .send-code-btn {
            flex-shrink: 0;
            padding: 12px 20px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.3);
            color: #8b5cf6;
            transition: all 0.3s ease;

            &:hover:not(:disabled) {
              background: rgba(139, 92, 246, 0.2);
              border-color: rgba(139, 92, 246, 0.4);
              transform: translateY(-1px);
            }

            &:disabled {
              background: rgba(148, 163, 184, 0.1);
              border-color: rgba(148, 163, 184, 0.2);
              color: rgba(148, 163, 184, 0.8);
              cursor: not-allowed;
            }
          }
        }

      .login-btn {
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

      .test-btn {
        width: 100%;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        }

        &:disabled {
          background: rgba(148, 163, 184, 0.3);
          color: rgba(148, 163, 184, 0.8);
        }
      }
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .remember-checkbox {
        .el-checkbox__label {
          color: #64748b !important;
          font-size: 14px;
        }

        .el-checkbox__input {
          .el-checkbox__inner {
            background-color: rgba(255, 255, 255, 0.8) !important;
            border-color: rgba(139, 92, 246, 0.2) !important;
            
            &:hover {
              border-color: rgba(139, 92, 246, 0.3) !important;
            }
          }

          &.is-checked {
            .el-checkbox__inner {
              background-color: #8b5cf6 !important;
              border-color: #8b5cf6 !important;
            }
          }
        }
      }

      .el-button {
        color: #8b5cf6;
        font-weight: 600;
        font-size: 14px;
      }
    }
  }

  .third-party-login {
    margin-top: 30px;

    .divider {
      text-align: center;
      margin-bottom: 24px;
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

  .register-link {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid rgba(196, 181, 253, 0.2);
    font-size: 14px;
    color: #64748b;

    .el-button {
      color: #8b5cf6;
      font-weight: 600;
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

<style lang="scss">
// 全局样式覆盖 - 专门针对登录页
.login-page {
  .el-input__inner {
    color: #1e293b !important;
  }
  
  .el-input__inner::placeholder {
    color: #64748b !important;
  }
  
  .custom-input .el-input__inner {
    color: #1e293b !important;
  }
  
  .custom-input .el-input__inner::placeholder {
    color: #64748b !important;
  }
}
</style>
