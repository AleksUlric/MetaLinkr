<template>
  <div class="profile-home">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-header">
        <el-avatar :src="userInfo.avatar" :size="80" />
        <div class="user-info">
          <h2 class="username">{{ userInfo.name }}</h2>
          <p class="user-id">ID: {{ userInfo.id }}</p>
          <p class="user-bio">{{ userInfo.bio }}</p>
        </div>
        <el-button type="text" :icon="Edit" @click="editProfile" />
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
    </div>
    
    <!-- 功能菜单 -->
    <div class="menu-section">
      <div class="menu-group">
        <div class="menu-item" @click="goToSettings">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="menu-item" @click="goToPrivacy">
          <el-icon><Lock /></el-icon>
          <span>隐私设置</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="menu-item" @click="goToNotification">
          <el-icon><Bell /></el-icon>
          <span>通知设置</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
      
      <div class="menu-group">
        <div class="menu-item" @click="goToGame">
          <el-icon><Trophy /></el-icon>
          <span>游戏中心</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="menu-item" @click="goToShop">
          <el-icon><ShoppingCart /></el-icon>
          <span>商城</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="menu-item" @click="goToLive">
          <el-icon><VideoCamera /></el-icon>
          <span>直播</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
      
      <div class="menu-group">
        <div class="menu-item" @click="goToHelp">
          <el-icon><QuestionFilled /></el-icon>
          <span>帮助与反馈</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="menu-item" @click="goToAbout">
          <el-icon><InfoFilled /></el-icon>
          <span>关于我们</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="menu-item logout" @click="logout">
          <el-icon><SwitchButton /></el-icon>
          <span>退出登录</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Edit, 
  Setting, 
  Lock, 
  Bell, 
  Trophy, 
  ShoppingCart, 
  VideoCamera, 
  QuestionFilled, 
  InfoFilled, 
  SwitchButton, 
  ArrowRight 
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const userInfo = ref({
  id: '123456',
  name: '用户',
  avatar: 'https://via.placeholder.com/80',
  bio: '这个人很懒，什么都没有写',
  followers: 0,
  following: 0,
  posts: 0
})

// 初始化数据
onMounted(() => {
  // 从用户store获取信息
  if (userStore.user) {
    userInfo.value = {
      ...userInfo.value,
      ...userStore.user
    }
  }
})

// 编辑资料
const editProfile = () => {
  router.push('/user/edit')
}

// 跳转到设置
const goToSettings = () => {
  router.push('/settings')
}

// 跳转到隐私设置
const goToPrivacy = () => {
  router.push('/settings/privacy')
}

// 跳转到通知设置
const goToNotification = () => {
  router.push('/settings/notification')
}

// 跳转到游戏中心
const goToGame = () => {
  router.push('/game')
}

// 跳转到商城
const goToShop = () => {
  router.push('/shop')
}

// 跳转到直播
const goToLive = () => {
  router.push('/live')
}

// 跳转到帮助
const goToHelp = () => {
  console.log('帮助与反馈')
}

// 跳转到关于我们
const goToAbout = () => {
  console.log('关于我们')
}

// 退出登录
const logout = () => {
  userStore.logout()
  // 退出登录，返回启动页
  router.push('/splash')
}
</script>

<style scoped lang="scss">
.profile-home {
  height: 100%;
  background-color: #f5f5f5;
  padding-bottom: 80px; // 为底部导航栏留出空间
}

.user-card {
  background: white;
  padding: 24px 20px;
  margin-bottom: 16px;
  
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
}

.menu-section {
  .menu-group {
    background: white;
    margin-bottom: 16px;
    border-radius: 12px;
    overflow: hidden;
    
    .menu-item {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.3s ease;
      
      &:last-child {
        border-bottom: none;
      }
      
      &:hover {
        background-color: #f8f8f8;
      }
      
      &.logout {
        color: #ff6b6b;
        
        &:hover {
          background-color: #fff2f2;
        }
      }
      
      .el-icon {
        margin-right: 12px;
        color: #666;
      }
      
      span {
        flex: 1;
        font-size: 16px;
        color: #333;
      }
      
      .el-icon:last-child {
        margin-right: 0;
        color: #ccc;
      }
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .profile-home {
    background-color: #1a1a1a;
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
  
  .menu-section .menu-group {
    background: #2a2a2a;
    
    .menu-item {
      border-bottom-color: #333;
      
      &:hover {
        background-color: #333;
      }
      
      &.logout {
        color: #ff6b6b;
        
        &:hover {
          background-color: #3a2a2a;
        }
      }
      
      .el-icon {
        color: #aaa;
      }
      
      span {
        color: #fff;
      }
      
      .el-icon:last-child {
        color: #666;
      }
    }
  }
}
</style>