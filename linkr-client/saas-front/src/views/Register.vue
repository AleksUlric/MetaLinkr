<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-form">
        <div class="form-header">
          <div class="logo">
            <el-icon class="logo-icon"><Shop /></el-icon>
            <span class="logo-text">ShopBuilder</span>
          </div>
          <h1 class="title">创建您的商店</h1>
          <p class="subtitle">开始您的电商之旅</p>
        </div>
        
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="form"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="name">
            <el-input
              v-model="registerForm.name"
              placeholder="您的姓名"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              type="email"
              placeholder="邮箱地址"
              size="large"
              :prefix-icon="Message"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="确认密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item prop="storeName">
            <el-input
              v-model="registerForm.storeName"
              placeholder="商店名称"
              size="large"
              :prefix-icon="Shop"
            />
          </el-form-item>
          
          <el-form-item prop="subdomain">
            <el-input
              v-model="registerForm.subdomain"
              placeholder="商店域名"
              size="large"
              :prefix-icon="Link"
            >
              <template #append>.shopbuilder.com</template>
            </el-input>
          </el-form-item>
          
          <el-form-item>
            <el-checkbox v-model="registerForm.agree">
              我同意
              <el-link type="primary">服务条款</el-link>
              和
              <el-link type="primary">隐私政策</el-link>
            </el-checkbox>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="register-btn"
              :loading="loading"
              @click="handleRegister"
            >
              开始免费试用
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="form-footer">
          <p class="login-text">
            已有账户？
            <el-link type="primary" @click="$router.push('/login')">
              立即登录
            </el-link>
          </p>
        </div>
      </div>
      
      <div class="register-banner">
        <div class="banner-content">
          <h2>为什么选择 ShopBuilder？</h2>
          <ul class="features">
            <li>
              <el-icon><Check /></el-icon>
              <div>
                <h3>快速搭建</h3>
                <p>5分钟创建专业在线商店</p>
              </div>
            </li>
            <li>
              <el-icon><Check /></el-icon>
              <div>
                <h3>拖拽编辑</h3>
                <p>可视化主题编辑器，无需编程</p>
              </div>
            </li>
            <li>
              <el-icon><Check /></el-icon>
              <div>
                <h3>完整功能</h3>
                <p>订单、支付、物流一站式解决</p>
              </div>
            </li>
            <li>
              <el-icon><Check /></el-icon>
              <div>
                <h3>专业支持</h3>
                <p>7x24小时技术支持服务</p>
              </div>
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
  Shop, User, Message, Lock, Link, Check
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const registerFormRef = ref<FormInstance>()

// 响应式数据
const loading = ref(false)
const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  storeName: '',
  subdomain: '',
  agree: false
})

// 表单验证规则
const registerRules: FormRules = {
  name: [
    { required: true, message: '请输入您的姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  storeName: [
    { required: true, message: '请输入商店名称', trigger: 'blur' }
  ],
  subdomain: [
    { required: true, message: '请输入商店域名', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: '域名只能包含小写字母、数字和连字符', trigger: 'blur' }
  ],
  agree: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请同意服务条款和隐私政策'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    await registerFormRef.value.validate()
    loading.value = true
    
    await authStore.register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      storeName: registerForm.storeName,
      subdomain: registerForm.subdomain
    })
    
    ElMessage.success('注册成功，欢迎使用 ShopBuilder！')
    router.push('/dashboard')
  } catch (error: any) {
    ElMessage.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.register-form {
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
    margin-bottom: 20px;
  }
  
  .register-btn {
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
  
  .login-text {
    color: var(--saas-text-secondary);
    font-size: 14px;
  }
}

.register-banner {
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
    margin-bottom: 32px;
  }
  
  .features {
    list-style: none;
    
    li {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
      
      .el-icon {
        font-size: 20px;
        color: #10b981;
        margin-top: 4px;
        flex-shrink: 0;
      }
      
      div {
        h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        p {
          font-size: 14px;
          opacity: 0.9;
          line-height: 1.5;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }
  
  .register-form {
    padding: 40px 24px;
  }
  
  .register-banner {
    padding: 40px 24px;
    
    .banner-content h2 {
      font-size: 24px;
    }
  }
}
</style>
