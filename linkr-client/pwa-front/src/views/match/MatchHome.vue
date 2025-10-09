<template>
  <div class="match-home">
    <!-- 顶部导航 -->
    <div class="header">
      <h1 class="title">匹配</h1>
      <div class="header-actions">
        <el-button type="text" :icon="Setting" @click="openSettings" />
      </div>
    </div>
    
    <!-- 匹配内容 -->
    <div class="match-content">
      <!-- 当前用户卡片 -->
      <div v-if="currentUser" class="user-card">
        <div class="card-header">
          <el-avatar :src="currentUser.avatar" :size="80" />
          <div class="user-info">
            <h2 class="username">{{ currentUser.name }}</h2>
            <p class="user-age">{{ currentUser.age }}岁</p>
            <p class="user-location">{{ currentUser.location }}</p>
          </div>
        </div>
        
        <div class="card-content">
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
        
        <!-- 操作按钮 -->
        <div class="card-actions">
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
      
      <!-- 没有更多用户 -->
      <div v-else class="no-more-users">
        <el-icon size="60" color="#ccc">
          <User />
        </el-icon>
        <p>暂时没有更多推荐用户</p>
        <el-button type="primary" @click="refreshUsers">刷新</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Setting, Close, Star, User } from '@element-plus/icons-vue'
import { useMatchStore } from '@/stores/match'
import type { MatchUser } from '@/types/match'

const matchStore = useMatchStore()
const currentUser = ref<MatchUser | null>(null)

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

// 打开设置
const openSettings = () => {
  console.log('打开匹配设置')
}
</script>

<style scoped lang="scss">
.match-home {
  height: 100%;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  
  .title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }
}

.match-content {
  padding: 20px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
  
  .card-header {
    margin-bottom: 20px;
    
    .user-info {
      margin-top: 16px;
      
      .username {
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #333;
      }
      
      .user-age {
        font-size: 16px;
        color: #666;
        margin: 0 0 4px 0;
      }
      
      .user-location {
        font-size: 14px;
        color: #999;
        margin: 0;
      }
    }
  }
  
  .card-content {
    margin-bottom: 24px;
    
    .user-bio {
      font-size: 16px;
      line-height: 1.5;
      color: #333;
      margin: 0 0 16px 0;
    }
    
    .user-interests {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      
      .interest-tag {
        background: #f0f0f0;
        color: #666;
        border: none;
      }
    }
  }
  
  .card-actions {
    display: flex;
    justify-content: center;
    gap: 24px;
    
    .el-button {
      width: 60px;
      height: 60px;
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

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .match-home {
    background-color: #1a1a1a;
  }
  
  .header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .title {
      color: #fff;
    }
  }
  
  .user-card {
    background: #2a2a2a;
    
    .card-header .user-info {
      .username {
        color: #fff;
      }
      
      .user-age {
        color: #aaa;
      }
      
      .user-location {
        color: #888;
      }
    }
    
    .card-content {
      .user-bio {
        color: #fff;
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