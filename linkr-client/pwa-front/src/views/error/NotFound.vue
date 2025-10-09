<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="error-icon">
        <el-icon size="120" color="#ccc">
          <Warning />
        </el-icon>
      </div>
      
      <h1 class="error-title">404</h1>
      <p class="error-message">页面不存在</p>
      
      <div class="error-actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Warning } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/home')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.not-found-page {
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-container {
  text-align: center;
  padding: 40px;
  
  .error-icon {
    margin-bottom: 20px;
  }
  
  .error-title {
    font-size: 72px;
    font-weight: bold;
    color: #333;
    margin: 0 0 16px 0;
  }
  
  .error-message {
    font-size: 18px;
    color: #666;
    margin: 0 0 30px 0;
  }
  
  .error-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .not-found-page {
    background: #1a1a1a;
  }
  
  .not-found-container {
    .error-title {
      color: #fff;
    }
    
    .error-message {
      color: #aaa;
    }
  }
}
</style>
