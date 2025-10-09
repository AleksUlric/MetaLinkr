<template>
  <div class="match-swipe">
    <div class="swipe-container">
      <div class="user-card" v-if="currentUser">
        <div class="card-image">
          <el-image :src="currentUser.avatar" fit="cover" />
        </div>
        
        <div class="card-info">
          <h2 class="user-name">{{ currentUser.name }}</h2>
          <p class="user-age">{{ currentUser.age }}岁</p>
          <p class="user-bio">{{ currentUser.bio }}</p>
          
          <div class="user-interests">
            <el-tag 
              v-for="interest in currentUser.interests" 
              :key="interest"
              size="small"
              class="interest-tag"
            >
              {{ interest }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <div v-else class="no-more-users">
        <el-icon size="60" color="#ccc">
          <User />
        </el-icon>
        <p>暂时没有更多推荐用户</p>
        <el-button type="primary" @click="refreshUsers">刷新</el-button>
      </div>
    </div>
    
    <div class="swipe-actions">
      <el-button 
        type="danger" 
        :icon="Close" 
        circle 
        size="large"
        @click="dislikeUser"
      />
      <el-button 
        type="primary" 
        :icon="Star" 
        circle 
        size="large"
        @click="likeUser"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Close, Star, User } from '@element-plus/icons-vue'
import { useMatchStore } from '@/stores/match'

const matchStore = useMatchStore()
const currentUser = ref(matchStore.currentUser)

// 初始化数据
onMounted(async () => {
  await matchStore.initMatch()
  currentUser.value = matchStore.currentUser
})

// 喜欢用户
const likeUser = async () => {
  if (currentUser.value) {
    try {
      const result = await matchStore.likeUser(currentUser.value.id)
      if (result.isMatch) {
        // 显示匹配成功提示
        console.log('匹配成功！')
      }
      currentUser.value = matchStore.currentUser
    } catch (error) {
      console.error('喜欢用户失败:', error)
    }
  }
}

// 不喜欢用户
const dislikeUser = async () => {
  if (currentUser.value) {
    try {
      await matchStore.dislikeUser(currentUser.value.id)
      currentUser.value = matchStore.currentUser
    } catch (error) {
      console.error('不喜欢用户失败:', error)
    }
  }
}

// 刷新用户列表
const refreshUsers = async () => {
  await matchStore.getRecommendedUsers()
  currentUser.value = matchStore.currentUser
}
</script>

<style scoped lang="scss">
.match-swipe {
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.swipe-container {
  flex: 1;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 350px;
  
  .card-image {
    height: 400px;
    
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
  
  .card-info {
    padding: 20px;
    
    .user-name {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #333;
    }
    
    .user-age {
      font-size: 16px;
      color: #666;
      margin: 0 0 12px 0;
    }
    
    .user-bio {
      font-size: 14px;
      color: #666;
      margin: 0 0 16px 0;
      line-height: 1.4;
    }
    
    .user-interests {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .interest-tag {
        background: #f0f0f0;
        color: #666;
        border: none;
      }
    }
  }
}

.no-more-users {
  text-align: center;
  color: #999;
  
  p {
    font-size: 16px;
    margin: 16px 0;
  }
}

.swipe-actions {
  padding: 20px;
  display: flex;
  justify-content: center;
  gap: 24px;
  
  .el-button {
    width: 60px;
    height: 60px;
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .match-swipe {
    background: #1a1a1a;
  }
  
  .user-card {
    background: #2a2a2a;
    
    .card-info {
      .user-name {
        color: #fff;
      }
      
      .user-age, .user-bio {
        color: #aaa;
      }
      
      .user-interests .interest-tag {
        background: #333;
        color: #aaa;
      }
    }
  }
  
  .no-more-users {
    color: #aaa;
  }
}
</style>
