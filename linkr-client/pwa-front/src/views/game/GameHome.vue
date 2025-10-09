<template>
  <div class="game-home">
    <div class="game-header">
      <el-button type="text" :icon="ArrowLeft" @click="goBack" />
      <h1 class="page-title">游戏中心</h1>
      <el-button type="text" :icon="Trophy" />
    </div>
    
    <div class="game-content">
      <div class="game-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="24" color="#ff6b6b">
              <Star />
            </el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-number">1,234</span>
            <span class="stat-label">积分</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="24" color="#52c41a">
              <Trophy />
            </el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-number">15</span>
            <span class="stat-label">成就</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="24" color="#1890ff">
              <Rank />
            </el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-number">8</span>
            <span class="stat-label">等级</span>
          </div>
        </div>
      </div>
      
      <div class="game-section">
        <div class="section-title">每日任务</div>
        <div class="task-list">
          <div class="task-item">
            <div class="task-info">
              <h3 class="task-name">每日签到</h3>
              <p class="task-desc">完成签到获得积分奖励</p>
            </div>
            <el-button type="primary" size="small">签到</el-button>
          </div>
          
          <div class="task-item">
            <div class="task-info">
              <h3 class="task-name">发布动态</h3>
              <p class="task-desc">发布一条动态获得积分</p>
            </div>
            <el-button type="primary" size="small">去发布</el-button>
          </div>
        </div>
      </div>
      
      <div class="game-section">
        <div class="section-title">排行榜</div>
        <div class="ranking-list">
          <div class="ranking-item">
            <span class="rank-number">1</span>
            <el-avatar :src="'https://via.placeholder.com/32'" :size="32" />
            <div class="user-info">
              <h3 class="user-name">用户1</h3>
              <p class="user-score">2,345 积分</p>
            </div>
          </div>
          
          <div class="ranking-item">
            <span class="rank-number">2</span>
            <el-avatar :src="'https://via.placeholder.com/32'" :size="32" />
            <div class="user-info">
              <h3 class="user-name">用户2</h3>
              <p class="user-score">2,123 积分</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, Trophy, Star, Rank } from '@element-plus/icons-vue'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.game-home {
  height: 100vh;
  background-color: #f5f5f5;
}

.game-header {
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

.game-content {
  padding: 20px;
}

.game-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  
  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    .stat-icon {
      margin-bottom: 8px;
    }
    
    .stat-info {
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

.game-section {
  margin-bottom: 24px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }
  
  .task-list, .ranking-list {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .task-item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .task-info {
      flex: 1;
      
      .task-name {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 4px 0;
        color: #333;
      }
      
      .task-desc {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }
  }
  
  .ranking-item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .rank-number {
      font-size: 18px;
      font-weight: 600;
      color: #ff6b6b;
      margin-right: 16px;
      min-width: 24px;
    }
    
    .user-info {
      margin-left: 12px;
      
      .user-name {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 4px 0;
        color: #333;
      }
      
      .user-score {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .game-home {
    background-color: #1a1a1a;
  }
  
  .game-header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .page-title {
      color: #fff;
    }
  }
  
  .game-stats .stat-card {
    background: #2a2a2a;
    
    .stat-info {
      .stat-number {
        color: #fff;
      }
      
      .stat-label {
        color: #aaa;
      }
    }
  }
  
  .game-section {
    .section-title {
      color: #fff;
    }
    
    .task-list, .ranking-list {
      background: #2a2a2a;
      
      .task-item {
        border-bottom-color: #333;
        
        .task-info {
          .task-name {
            color: #fff;
          }
          
          .task-desc {
            color: #aaa;
          }
        }
      }
      
      .ranking-item {
        border-bottom-color: #333;
        
        .user-info {
          .user-name {
            color: #fff;
          }
          
          .user-score {
            color: #aaa;
          }
        }
      }
    }
  }
}
</style>
