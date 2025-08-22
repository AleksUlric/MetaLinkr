<template>
  <div class="login">
    <div class="login-bg">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>
    
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <el-icon size="32"><Grid /></el-icon>
            <h1>LinkrWeb</h1>
          </div>
          <p class="subtitle">欢迎回来，请登录您的账户</p>
        </div>
        
        <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
          <el-form-item prop="account">
            <el-input 
              v-model="form.account" 
              placeholder="请输入账号" 
              size="large"
              :prefix-icon="User"
              class="modern-input"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="请输入密码" 
              size="large"
              :prefix-icon="Lock"
              class="modern-input"
              show-password
            />
          </el-form-item>
          
          <div class="form-options">
            <el-checkbox>记住我</el-checkbox>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>
          
          <el-form-item>
            <el-button 
              type="primary" 
              :loading="loading" 
              @click="onSubmit"
              size="large"
              class="login-btn"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="login-footer">
          <p>还没有账户？ <a href="#" class="register-link">立即注册</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Grid, User, Lock } from '@element-plus/icons-vue'

interface LoginForm { account: string; password: string }

const router = useRouter()
const route = useRoute()
const formRef = ref()
const loading = ref(false)
const form = reactive<LoginForm>({ account: '', password: '' })

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const onSubmit = async () => {
  await formRef.value?.validate()
  loading.value = true
  try {
    // 模拟登录成功
    setTimeout(() => {
      localStorage.setItem('token', 'demo-token')
      router.replace((route.query.redirect as string) || '/')
      loading.value = false
    }, 1000)
  } catch (error) {
    ElMessage.error('登录失败，请检查网络连接')
    loading.value = false
  }
}
</script>

<style scoped>
/* 年轻化登录页面样式 */
.login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 40%;
  left: 80%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.login-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 420px;
  padding: 0 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  padding: 48px 40px;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeIn 0.6s ease-out;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
  color: var(--primary-color);
}

.logo h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 0;
}

.login-form {
  margin-bottom: 24px;
}

.modern-input :deep(.el-input__wrapper) {
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-light);
  transition: all 0.3s ease;
  background: var(--bg-secondary);
}

.modern-input :deep(.el-input__wrapper:hover) {
  border-color: var(--primary-light);
}

.modern-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: var(--primary-dark);
}

.login-btn {
  width: 100%;
  height: 48px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.login-footer {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: var(--primary-dark);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }
  
  .logo h1 {
    font-size: 24px;
  }
}
</style>


