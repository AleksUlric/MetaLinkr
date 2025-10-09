<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="logo">
          <div class="logo-icon">🔗</div>
        </div>
        <h1 class="app-name">MetaLinkr</h1>
        <p class="app-slogan">连接你我，分享美好</p>
      </div>

      <div class="login-form">
        <div class="form-content">
          <div class="input-group">
            <input
              v-model="phoneForm.phone"
              placeholder="请输入手机号"
              maxlength="11"
              class="form-input"
            />
            <div v-if="phoneError" class="error-text">{{ phoneError }}</div>
          </div>
          
          <div class="input-group">
            <input
              v-model="phoneForm.code"
              placeholder="请输入验证码"
              maxlength="6"
              class="form-input"
            />
            <button
              :disabled="!canSendCode || countdown > 0"
              @click="sendCode"
              class="code-btn"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>
          
          <button
            :disabled="!canLogin"
            @click="loginWithPhone"
            class="login-btn"
          >
            登录
          </button>
          
          <button
            @click="quickLogin"
            class="quick-login-btn"
          >
            快速登录（测试用）
          </button>
        </div>

        <div class="login-footer">
          <div class="agreement">
            <label class="checkbox-label">
              <input type="checkbox" v-model="agreeTerms" />
              我已阅读并同意用户协议和隐私政策
            </label>
          </div>
          
          <div class="register-link">
            还没有账号？<a href="#" @click="goToRegister">立即注册</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

let router: any = null
const userStore = useUserStore()

onMounted(() => {
  console.log('Login.vue mounted')
  // 在组件挂载后获取router实例
  router = useRouter()
})

const agreeTerms = ref(false)

// 手机登录表单
const phoneForm = ref({
  phone: '',
  code: ''
})

const phoneError = ref('')
const countdown = ref(0)

// 计算属性
const canSendCode = computed(() => {
  return phoneForm.value.phone.length === 11 && /^1[3-9]\d{9}$/.test(phoneForm.value.phone)
})

const canLogin = computed(() => {
  return phoneForm.value.phone.length === 11 && 
         phoneForm.value.code.length === 6 && 
         agreeTerms.value
})

// 方法
const validatePhone = () => {
  if (phoneForm.value.phone && !/^1[3-9]\d{9}$/.test(phoneForm.value.phone)) {
    phoneError.value = '请输入正确的手机号'
  } else {
    phoneError.value = ''
  }
}

const sendCode = async () => {
  if (!canSendCode.value) return
  
  try {
    // Mock发送验证码：直接成功
    alert('验证码已发送（Mock: 任意6位数字即可登录）')
    startCountdown()
  } catch (error) {
    alert('发送失败，请重试')
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

const loginWithPhone = async () => {
  if (!canLogin.value) return
  
  try {
    // 设置用户登录状态
    const result = await userStore.loginWithPhone(phoneForm.value.phone, phoneForm.value.code)
    
    if (result.success) {
      alert('登录成功')
      
      if (router) {
        router.push('/app/planet')
      } else {
        // 如果router还没初始化，使用window.location
        window.location.href = '/app/planet'
      }
    } else {
      alert('登录失败: ' + (result.message || '验证码错误'))
    }
  } catch (error) {
    console.error('登录错误:', error)
    alert('登录失败，请重试')
  }
}

const goToRegister = () => {
  alert('注册功能开发中...')
}

const quickLogin = async () => {
  // 快速登录：直接设置登录状态，跳过验证码验证
  phoneForm.value.phone = '13800138000'
  phoneForm.value.code = '123456'
  agreeTerms.value = true
  
  try {
    // 直接设置token和用户信息
    const token = 'quick-login-token-' + Date.now()
    localStorage.setItem('token', token)
    
    // 设置mock用户信息
    const { mockUser, mockUserProfile } = await import('../../mock/user')
    userStore.token = token
    userStore.user = mockUser
    userStore.profile = mockUserProfile
    
    alert('快速登录成功')
    
    // 登录成功后跳转
    if (router) {
      router.push('/app/planet')
    } else {
      window.location.href = '/app/planet'
    }
  } catch (error) {
    console.error('快速登录失败:', error)
    alert('快速登录失败')
  }
}
</script>

<style scoped lang="scss">
.login-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 0 20px;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  
  .logo {
    margin-bottom: 20px;
    
    .logo-icon {
      font-size: 60px;
      animation: pulse 2s infinite;
    }
  }
  
  .app-name {
    font-size: 28px;
    font-weight: bold;
    color: white;
    margin: 0 0 10px 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  .app-slogan {
    font-size: 14px;
    color: rgba(255,255,255,0.8);
    margin: 0;
    font-weight: 300;
  }
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  
  .form-content {
    .input-group {
      margin-bottom: 16px;
      position: relative;
      
      .form-input {
        width: 100%;
        height: 48px;
        border-radius: 12px;
        border: 1px solid #e0e0e0;
        background: white;
        color: #333;
        font-size: 16px;
        padding: 0 16px;
        box-sizing: border-box;
        
        &:focus {
          outline: none;
          border-color: #ff6b6b;
          box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
        }
        
        &::placeholder {
          color: #999;
        }
      }
      
      .code-btn {
        position: absolute;
        right: 8px;
        top: 8px;
        width: 100px;
        height: 32px;
        border-radius: 8px;
        border: none;
        background: #ff6b6b;
        color: white;
        font-size: 12px;
        cursor: pointer;
        
        &:disabled {
          background: #e0e0e0;
          color: #999;
          cursor: not-allowed;
        }
      }
      
      .error-text {
        color: #ff4757;
        font-size: 12px;
        margin-top: 4px;
      }
    }
    
    .login-btn {
      width: 100%;
      height: 48px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      border: none;
      color: white;
      cursor: pointer;
      margin-bottom: 12px;
      
      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #ff5252 0%, #e53935 100%);
      }
      
      &:disabled {
        background: #e0e0e0;
        color: #999;
        cursor: not-allowed;
      }
    }
    
    .quick-login-btn {
      width: 100%;
      height: 40px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
      border: none;
      color: white;
      cursor: pointer;
      
      &:hover {
        background: linear-gradient(135deg, #3db5ac 0%, #3a8b7a 100%);
      }
    }
  }
}

.login-footer {
  margin-top: 20px;
  
  .agreement {
    margin-bottom: 16px;
    
    .checkbox-label {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
      display: flex;
      align-items: center;
      cursor: pointer;
      
      input[type="checkbox"] {
        margin-right: 8px;
      }
    }
  }
  
  .register-link {
    text-align: center;
    font-size: 14px;
    color: #666;
    
    a {
      color: #ff6b6b;
      text-decoration: none;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

// 移动端适配
@media screen and (max-width: 480px) {
  .login-container {
    padding: 0 16px;
  }
  
  .login-form {
    padding: 20px;
    border-radius: 16px;
  }
  
  .login-header {
    margin-bottom: 30px;
    
    .app-name {
      font-size: 24px;
    }
  }
}
</style>
