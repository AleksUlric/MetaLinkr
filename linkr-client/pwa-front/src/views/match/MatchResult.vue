<template>
  <div class="match-result">
    <div class="result-container">
      <div class="result-icon">
        <el-icon size="80" color="#52c41a">
          <CircleCheck />
        </el-icon>
      </div>
      
      <h1 class="result-title">匹配成功！</h1>
      <p class="result-message">你们互相喜欢了</p>
      
      <div class="user-cards">
        <div class="user-card">
          <el-avatar :src="user1.avatar" :size="80" />
          <h3 class="user-name">{{ user1.name }}</h3>
        </div>
        
        <div class="heart-icon">
          <el-icon size="40" color="#ff6b6b">
            <Heart />
          </el-icon>
        </div>
        
        <div class="user-card">
          <el-avatar :src="user2.avatar" :size="80" />
          <h3 class="user-name">{{ user2.name }}</h3>
        </div>
      </div>
      
      <div class="result-actions">
        <el-button type="primary" @click="startChat">开始聊天</el-button>
        <el-button @click="continueMatch">继续匹配</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CircleCheck, Heart } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const user1 = ref({
  name: '用户1',
  avatar: 'https://via.placeholder.com/80'
})

const user2 = ref({
  name: '用户2',
  avatar: 'https://via.placeholder.com/80'
})

// 初始化数据
onMounted(() => {
  // 根据路由参数获取用户信息
  const userId = route.params.id
  console.log('匹配结果用户ID:', userId)
})

const startChat = () => {
  router.push('/chat/1')
}

const continueMatch = () => {
  router.push('/match')
}
</script>

<style scoped lang="scss">
.match-result {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-container {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.result-icon {
  margin-bottom: 20px;
}

.result-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.result-message {
  font-size: 16px;
  color: #666;
  margin: 0 0 30px 0;
}

.user-cards {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  
  .user-card {
    text-align: center;
    
    .user-name {
      font-size: 16px;
      font-weight: 600;
      margin: 12px 0 0 0;
      color: #333;
    }
  }
  
  .heart-icon {
    margin: 0 20px;
    animation: heartbeat 1.5s infinite;
  }
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .el-button {
    width: 100%;
    height: 45px;
    font-size: 16px;
  }
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .result-container {
    background: #2a2a2a;
    
    .result-title {
      color: #fff;
    }
    
    .result-message {
      color: #aaa;
    }
    
    .user-cards .user-card .user-name {
      color: #fff;
    }
  }
}
</style>
