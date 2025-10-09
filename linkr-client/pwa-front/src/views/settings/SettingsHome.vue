<template>
  <div class="settings-home">
    <div class="settings-header">
      <el-button type="text" :icon="ArrowLeft" @click="goBack" />
      <h1 class="page-title">设置</h1>
      <div></div>
    </div>
    
    <div class="settings-content">
      <div class="settings-section">
        <div class="section-title">账户设置</div>
        <div class="settings-list">
          <div class="setting-item" @click="goToEditProfile">
            <el-icon><User /></el-icon>
            <span>编辑资料</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
          <div class="setting-item" @click="goToPrivacy">
            <el-icon><Lock /></el-icon>
            <span>隐私设置</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
          <div class="setting-item" @click="goToNotification">
            <el-icon><Bell /></el-icon>
            <span>通知设置</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <div class="section-title">应用设置</div>
        <div class="settings-list">
          <div class="setting-item" @click="toggleDarkMode">
            <el-icon><Moon /></el-icon>
            <span>深色模式</span>
            <el-switch v-model="isDarkMode" />
          </div>
          <div class="setting-item" @click="goToAbout">
            <el-icon><InfoFilled /></el-icon>
            <span>关于我们</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <div class="section-title">其他</div>
        <div class="settings-list">
          <div class="setting-item" @click="logout">
            <el-icon><SwitchButton /></el-icon>
            <span>退出登录</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, User, Lock, Bell, Moon, InfoFilled, SwitchButton, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const isDarkMode = ref(false)

const goBack = () => {
  router.back()
}

const goToEditProfile = () => {
  router.push('/user/edit')
}

const goToPrivacy = () => {
  router.push('/settings/privacy')
}

const goToNotification = () => {
  router.push('/settings/notification')
}

const goToAbout = () => {
  console.log('关于我们')
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}

const logout = () => {
  // 退出登录，返回启动页
  router.push('/splash')
}
</script>

<style scoped lang="scss">
.settings-home {
  height: 100vh;
  background-color: #f5f5f5;
}

.settings-header {
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

.settings-content {
  padding: 20px;
}

.settings-section {
  margin-bottom: 24px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }
  
  .settings-list {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    
    .setting-item {
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
  .settings-home {
    background-color: #1a1a1a;
  }
  
  .settings-header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .page-title {
      color: #fff;
    }
  }
  
  .settings-section {
    .section-title {
      color: #fff;
    }
    
    .settings-list {
      background: #2a2a2a;
      
      .setting-item {
        border-bottom-color: #333;
        
        &:hover {
          background-color: #333;
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
}
</style>
