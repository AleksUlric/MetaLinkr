<template>
  <div class="user-profile">
    <div class="profile-header">
      <el-button type="text" :icon="ArrowLeft" @click="goBack" />
      <h1 class="page-title">用户资料</h1>
      <el-button type="text" :icon="MoreFilled" />
    </div>
    
    <div class="profile-content">
      <div class="user-card">
        <div class="user-header">
          <el-avatar :src="userInfo.avatar" :size="80" />
          <div class="user-info">
            <h2 class="username">{{ userInfo.name }}</h2>
            <p class="user-id">ID: {{ userInfo.id }}</p>
            <p class="user-bio">{{ userInfo.bio }}</p>
          </div>
        </div>
        
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-number">{{ userInfo.followers }}</span>
            <span class="stat-label">关注者</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ userInfo.following }}</span>
            <span class="stat-label">关注中</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ userInfo.posts }}</span>
            <span class="stat-label">动态</span>
          </div>
        </div>
        
        <div class="user-actions">
          <el-button type="primary" @click="followUser">
            {{ userInfo.isFollowed ? '已关注' : '关注' }}
          </el-button>
          <el-button @click="sendMessage">私信</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, MoreFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const userInfo = ref({
  id: route.params.id as string,
  name: '用户',
  avatar: 'https://via.placeholder.com/80',
  bio: '这个人很懒，什么都没有写',
  followers: 0,
  following: 0,
  posts: 0,
  isFollowed: false
})

// 初始化数据
onMounted(() => {
  // 根据路由参数获取用户信息
  console.log('用户ID:', userInfo.value.id)
})

const followUser = () => {
  userInfo.value.isFollowed = !userInfo.value.isFollowed
}

const sendMessage = () => {
  router.push(`/chat/${userInfo.value.id}`)
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.user-profile {
  height: 100vh;
  background-color: #f5f5f5;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  
  .page-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }
}

.profile-content {
  padding: 20px;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  .user-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    .user-info {
      flex: 1;
      margin-left: 16px;
      
      .username {
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 4px 0;
        color: #333;
      }
      
      .user-id {
        font-size: 14px;
        color: #999;
        margin: 0 0 8px 0;
      }
      
      .user-bio {
        font-size: 14px;
        color: #666;
        margin: 0;
        line-height: 1.4;
      }
    }
  }
  
  .user-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    
    .stat-item {
      text-align: center;
      
      .stat-number {
        display: block;
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  .user-actions {
    display: flex;
    gap: 12px;
    
    .el-button {
      flex: 1;
      height: 40px;
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .user-profile {
    background-color: #1a1a1a;
  }
  
  .profile-header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .page-title {
      color: #fff;
    }
  }
  
  .user-card {
    background: #2a2a2a;
    
    .user-header .user-info {
      .username {
        color: #fff;
      }
      
      .user-id {
        color: #aaa;
      }
      
      .user-bio {
        color: #aaa;
      }
    }
    
    .user-stats .stat-item {
      .stat-number {
        color: #fff;
      }
      
      .stat-label {
        color: #aaa;
      }
    }
  }
}
</style>
