<template>
  <div class="privacy-settings">
    <div class="settings-header">
      <el-button type="text" :icon="ArrowLeft" @click="goBack" />
      <h1 class="page-title">隐私设置</h1>
      <div></div>
    </div>
    
    <div class="settings-content">
      <div class="settings-section">
        <div class="section-title">个人信息</div>
        <div class="settings-list">
          <div class="setting-item">
            <el-icon><User /></el-icon>
            <span>个人资料可见性</span>
            <el-select v-model="profileVisibility" size="small">
              <el-option label="所有人" value="public" />
              <el-option label="仅好友" value="friends" />
              <el-option label="仅自己" value="private" />
            </el-select>
          </div>
          <div class="setting-item">
            <el-icon><Location /></el-icon>
            <span>位置信息</span>
            <el-switch v-model="locationEnabled" />
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <div class="section-title">社交功能</div>
        <div class="settings-list">
          <div class="setting-item">
            <el-icon><Search /></el-icon>
            <span>允许被搜索</span>
            <el-switch v-model="searchEnabled" />
          </div>
          <div class="setting-item">
            <el-icon><ChatDotRound /></el-icon>
            <span>允许陌生人私信</span>
            <el-switch v-model="messageEnabled" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, User, Location, Search, ChatDotRound } from '@element-plus/icons-vue'

const router = useRouter()
const profileVisibility = ref('public')
const locationEnabled = ref(true)
const searchEnabled = ref(true)
const messageEnabled = ref(false)

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.privacy-settings {
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
      
      &:last-child {
        border-bottom: none;
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
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .privacy-settings {
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
        
        .el-icon {
          color: #aaa;
        }
        
        span {
          color: #fff;
        }
      }
    }
  }
}
</style>
