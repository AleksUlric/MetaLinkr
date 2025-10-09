<template>
  <div class="game-room">
    <div class="room-header">
      <el-button type="text" :icon="ArrowLeft" @click="leaveRoom" />
      <div class="room-info">
        <h2 class="room-name">{{ roomInfo.name }}</h2>
        <p class="room-description">{{ roomInfo.description }}</p>
      </div>
      <el-button type="text" :icon="MoreFilled" />
    </div>
    
    <div class="room-content">
      <div class="game-area">
        <div class="game-board">
          <div class="game-placeholder">
            <el-icon size="80" color="#ccc">
              <Trophy />
            </el-icon>
            <p>游戏区域</p>
          </div>
        </div>
      </div>
      
      <div class="players-section">
        <div class="section-title">玩家列表</div>
        <div class="players-list">
          <div 
            v-for="player in players" 
            :key="player.id" 
            class="player-item"
            :class="{ 'is-host': player.isHost }"
          >
            <el-avatar :src="player.avatar" :size="40" />
            <div class="player-info">
              <h3 class="player-name">{{ player.name }}</h3>
              <p class="player-score">{{ player.score }} 分</p>
            </div>
            <div v-if="player.isHost" class="host-badge">房主</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="room-controls">
      <el-button type="primary" @click="startGame">开始游戏</el-button>
      <el-button type="danger" @click="leaveRoom">离开房间</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, MoreFilled, Trophy } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const roomInfo = ref({
  id: route.params.id as string,
  name: '游戏房间',
  description: '欢迎来到游戏房间'
})

const players = ref([
  {
    id: '1',
    name: '房主',
    avatar: 'https://via.placeholder.com/40',
    score: 1200,
    isHost: true
  },
  {
    id: '2',
    name: '玩家1',
    avatar: 'https://via.placeholder.com/40',
    score: 800,
    isHost: false
  },
  {
    id: '3',
    name: '玩家2',
    avatar: 'https://via.placeholder.com/40',
    score: 600,
    isHost: false
  }
])

// 初始化数据
onMounted(() => {
  console.log('游戏房间ID:', roomInfo.value.id)
})

const startGame = () => {
  console.log('开始游戏')
}

const leaveRoom = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.game-room {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.room-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  
  .room-info {
    flex: 1;
    margin-left: 16px;
    
    .room-name {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #333;
    }
    
    .room-description {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }
}

.room-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.game-area {
  margin-bottom: 24px;
  
  .game-board {
    background: white;
    border-radius: 12px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    .game-placeholder {
      text-align: center;
      color: #999;
      
      p {
        margin-top: 16px;
        font-size: 16px;
      }
    }
  }
}

.players-section {
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }
  
  .players-list {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    .player-item {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      &.is-host {
        background: #fff2f2;
      }
      
      .player-info {
        flex: 1;
        margin-left: 12px;
        
        .player-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #333;
        }
        
        .player-score {
          font-size: 14px;
          color: #666;
          margin: 0;
        }
      }
      
      .host-badge {
        background: #ff6b6b;
        color: white;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 10px;
      }
    }
  }
}

.room-controls {
  padding: 20px;
  display: flex;
  gap: 12px;
  background: white;
  border-top: 1px solid #e5e5e5;
  
  .el-button {
    flex: 1;
    height: 45px;
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .game-room {
    background-color: #1a1a1a;
  }
  
  .room-header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .room-info {
      .room-name {
        color: #fff;
      }
      
      .room-description {
        color: #aaa;
      }
    }
  }
  
  .game-area .game-board {
    background: #2a2a2a;
    
    .game-placeholder {
      color: #aaa;
    }
  }
  
  .players-section {
    .section-title {
      color: #fff;
    }
    
    .players-list {
      background: #2a2a2a;
      
      .player-item {
        border-bottom-color: #333;
        
        &.is-host {
          background: #3a2a2a;
        }
        
        .player-info {
          .player-name {
            color: #fff;
          }
          
          .player-score {
            color: #aaa;
          }
        }
      }
    }
  }
  
  .room-controls {
    background: #2a2a2a;
    border-top-color: #333;
  }
}
</style>
