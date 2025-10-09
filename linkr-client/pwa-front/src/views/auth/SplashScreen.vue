<template>
  <div class="splash-screen">
    <div class="splash-content">
      <div class="logo-container">
        <div class="logo">
          <el-icon size="80" color="#ff6b6b">
            <Connection />
          </el-icon>
        </div>
        <h1 class="app-name">MetaLinkr</h1>
        <p class="app-slogan">连接你我，分享美好</p>
      </div>
      
      <div class="loading-container">
        <el-progress 
          :percentage="loadingProgress" 
          :show-text="false"
          :stroke-width="4"
          color="#ff6b6b"
        />
        <p class="loading-text">{{ loadingText }}</p>
      </div>
    </div>
    
    <div class="splash-footer">
      <p class="version">v2.0.0</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { Connection } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const loadingProgress = ref(0)
const loadingText = ref('正在启动...')

const loadingSteps = [
  { progress: 20, text: '正在初始化...' },
  { progress: 40, text: '正在加载配置...' },
  { progress: 60, text: '正在连接服务器...' },
  { progress: 80, text: '正在准备界面...' },
  { progress: 100, text: '启动完成!' }
]

let currentStep = 0

const updateLoading = async () => {
  if (currentStep < loadingSteps.length) {
    const step = loadingSteps[currentStep]
    loadingProgress.value = step.progress
    loadingText.value = step.text
    currentStep++
    
    setTimeout(() => {
      updateLoading()
    }, 800)
  } else {
    // 启动完成，检查用户状态并跳转
    setTimeout(() => {
      if (userStore.isLoggedIn) {
        router.push('/app/planet')
      } else {
        // 如果未登录，跳转到登录页
        router.push('/login')
      }
    }, 1000)
  }
}

onMounted(() => {
  updateLoading()
})
</script>

<style scoped lang="scss">
.splash-screen {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
}

.splash-content {
  text-align: center;
  z-index: 1;
  max-width: 300px;
  width: 100%;
  padding: 0 20px;
}

.logo-container {
  margin-bottom: 60px;
  
  .logo {
    margin-bottom: 20px;
    animation: pulse 2s infinite;
  }
  
  .app-name {
    font-size: 32px;
    font-weight: bold;
    color: white;
    margin: 0 0 10px 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  .app-slogan {
    font-size: 16px;
    color: rgba(255,255,255,0.8);
    margin: 0;
    font-weight: 300;
  }
}

.loading-container {
  margin-bottom: 40px;
  
  .loading-text {
    color: rgba(255,255,255,0.9);
    font-size: 14px;
    margin-top: 15px;
    font-weight: 300;
  }
}

.splash-footer {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  
  .version {
    color: rgba(255,255,255,0.6);
    font-size: 12px;
    margin: 0;
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

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .splash-screen {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  }
}
</style>
