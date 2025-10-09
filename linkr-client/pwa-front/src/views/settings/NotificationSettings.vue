<template>
  <div class="notification-settings">
    <div class="settings-header">
      <el-button type="text" :icon="ArrowLeft" @click="goBack" />
      <h1 class="page-title">通知设置</h1>
      <div></div>
    </div>
    
    <div class="settings-content">
      <div class="settings-section">
        <div class="section-title">推送通知</div>
        <div class="settings-list">
          <div class="setting-item">
            <el-icon><Bell /></el-icon>
            <span>允许推送通知</span>
            <el-switch v-model="pushEnabled" />
          </div>
          <div class="setting-item">
            <el-icon><Message /></el-icon>
            <span>新消息通知</span>
            <el-switch v-model="messageNotification" />
          </div>
          <div class="setting-item">
            <el-icon><Star /></el-icon>
            <span>点赞通知</span>
            <el-switch v-model="likeNotification" />
          </div>
          <div class="setting-item">
            <el-icon><Connection /></el-icon>
            <span>匹配通知</span>
            <el-switch v-model="matchNotification" />
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <div class="section-title">通知时间</div>
        <div class="settings-list">
          <div class="setting-item">
            <el-icon><Clock /></el-icon>
            <span>免打扰时间</span>
            <el-time-picker
              v-model="quietHours"
              is-range
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Bell, Message, Star, Connection, Clock } from '@element-plus/icons-vue'

const router = useRouter()
const pushEnabled = ref(true)
const messageNotification = ref(true)
const likeNotification = ref(true)
const matchNotification = ref(true)
const quietHours = ref([])

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.notification-settings {
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
  .notification-settings {
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
