<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form">
        <div class="form-header">
          <div class="logo">
            <el-icon class="logo-icon"><Shop /></el-icon>
            <span class="logo-text">ShopBuilder</span>
          </div>
          <h1 class="title">欢迎回来</h1>
          <p class="subtitle">登录您的商店管理后台</p>
        </div>
        
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="email">
            <el-input
              v-model="loginForm.email"
              type="email"
              placeholder="邮箱地址"
              size="large"
              :prefix-icon="Message"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item>
            <div class="form-options">
              <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
              <el-link type="primary" class="forgot-link">忘记密码？</el-link>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="login-btn"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="form-footer">
          <p class="register-text">
            还没有账户？
            <el-link type="primary" @click="$router.push('/register')">
              立即注册
            </el-link>
          </p>
        </div>
      </div>
      
      <div class="login-banner">
        <div class="banner-content">
          <h2>开始您的电商之旅</h2>
          <p>ShopBuilder 为您提供完整的电商解决方案，让您轻松创建和管理在线商店。</p>
          <ul class="features">
            <li>
              <el-icon><Check /></el-icon>
              拖拽式主题编辑器
            </li>
            <li>
              <el-icon><Check /></el-icon>
              完整的订单管理系统
            </li>
            <li>
              <el-icon><Check /></el-icon>
              强大的数据分析工具
            </li>
            <li>
              <el-icon><Check /></el-icon>
              多渠道销售支持
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Shop, Message, Lock, Check
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 响应式数据
const loading = ref(false)
const loginForm = reactive({
  email: '',
  password: '',
  remember: false
})

// 表单验证规则
const loginRules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    await authStore.login({
      email: loginForm.email,
      password: loginForm.password
    })
    
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-form {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 24px;
    font-weight: 700;
    color: var(--saas-primary);
    margin-bottom: 24px;
    
    .logo-icon {
      font-size: 28px;
    }
  }
  
  .title {
    font-size: 32px;
    font-weight: 700;
    color: var(--saas-text-primary);
    margin-bottom: 8px;
  }
  
  .subtitle {
    font-size: 16px;
    color: var(--saas-text-secondary);
  }
}

.form {
  .el-form-item {
    margin-bottom: 24px;
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .forgot-link {
    font-size: 14px;
  }
  
  .login-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
  }
}

.form-footer {
  text-align: center;
  margin-top: 32px;
  
  .register-text {
    color: var(--saas-text-secondary);
    font-size: 14px;
  }
}

.login-banner {
  flex: 1;
  background: linear-gradient(135deg, var(--saas-primary) 0%, var(--saas-secondary) 100%);
  padding: 60px 40px;
  display: flex;
  align-items: center;
  color: white;
}

.banner-content {
  h2 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 32px;
    opacity: 0.9;
  }
  
  .features {
    list-style: none;
    
    li {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      font-size: 16px;
      
      .el-icon {
        font-size: 18px;
        color: #10b981;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  
  .login-form {
    padding: 40px 24px;
  }
  
  .login-banner {
    padding: 40px 24px;
    
    .banner-content h2 {
      font-size: 24px;
    }
  }
}
</style>
