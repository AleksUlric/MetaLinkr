<template>
  <div class="live-home">
    <div class="live-header">
      <el-button type="text" :icon="ArrowLeft" @click="goBack" />
      <h1 class="page-title">直播</h1>
      <el-button type="text" :icon="VideoCamera" />
    </div>
    
    <div class="live-content">
      <div class="live-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="24" color="#ff6b6b">
              <VideoCamera />
            </el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-number">12</span>
            <span class="stat-label">正在直播</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon size="24" color="#52c41a">
              <User />
            </el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-number">1,234</span>
            <span class="stat-label">在线观众</span>
          </div>
        </div>
      </div>
      
      <div class="live-section">
        <div class="section-title">热门直播</div>
        <div class="live-list">
          <div 
            v-for="live in liveRooms" 
            :key="live.id" 
            class="live-item"
            @click="enterLive(live)"
          >
            <div class="live-cover">
              <el-image :src="live.cover" fit="cover" />
              <div class="live-overlay">
                <div class="live-info">
                  <h3 class="live-title">{{ live.title }}</h3>
                  <p class="live-author">{{ live.author }}</p>
                </div>
                <div class="live-stats">
                  <span class="viewer-count">{{ live.viewerCount }}人观看</span>
                  <el-icon v-if="live.isOnline" color="#52c41a">
                    <CircleCheck />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="live-section">
        <div class="section-title">推荐主播</div>
        <div class="streamers-list">
          <div 
            v-for="streamer in streamers" 
            :key="streamer.id" 
            class="streamer-item"
            @click="viewStreamer(streamer)"
          >
            <el-avatar :src="streamer.avatar" :size="50" />
            <div class="streamer-info">
              <h3 class="streamer-name">{{ streamer.name }}</h3>
              <p class="streamer-desc">{{ streamer.description }}</p>
            </div>
            <div class="streamer-status">
              <div v-if="streamer.isOnline" class="online-indicator"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, VideoCamera, User, CircleCheck } from '@element-plus/icons-vue'

const router = useRouter()

const liveRooms = ref([
  {
    id: '1',
    title: '音乐分享',
    author: '音乐达人',
    cover: 'https://via.placeholder.com/300x200',
    viewerCount: 1234,
    isOnline: true
  },
  {
    id: '2',
    title: '游戏直播',
    author: '游戏高手',
    cover: 'https://via.placeholder.com/300x200',
    viewerCount: 856,
    isOnline: true
  },
  {
    id: '3',
    title: '聊天互动',
    author: '聊天主播',
    cover: 'https://via.placeholder.com/300x200',
    viewerCount: 642,
    isOnline: false
  }
])

const streamers = ref([
  {
    id: '1',
    name: '音乐达人',
    avatar: 'https://via.placeholder.com/50',
    description: '分享好听的音乐',
    isOnline: true
  },
  {
    id: '2',
    name: '游戏高手',
    avatar: 'https://via.placeholder.com/50',
    description: '专业游戏解说',
    isOnline: true
  },
  {
    id: '3',
    name: '聊天主播',
    avatar: 'https://via.placeholder.com/50',
    description: '互动聊天',
    isOnline: false
  }
])

const enterLive = (live: any) => {
  router.push(`/live/room/${live.id}`)
}

const viewStreamer = (streamer: any) => {
  console.log('查看主播:', streamer.name)
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.live-home {
  height: 100vh;
  background-color: #f5f5f5;
}

.live-header {
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

.live-content {
  padding: 20px;
}

.live-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  
  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    .stat-icon {
      margin-right: 12px;
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

.live-section {
  margin-bottom: 24px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }
  
  .live-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    
    .live-item {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      .live-cover {
        position: relative;
        height: 120px;
        
        .el-image {
          width: 100%;
          height: 100%;
        }
        
        .live-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 12px;
          
          .live-info {
            .live-title {
              font-size: 16px;
              font-weight: 600;
              color: white;
              margin: 0 0 4px 0;
            }
            
            .live-author {
              font-size: 12px;
              color: rgba(255,255,255,0.8);
              margin: 0;
            }
          }
          
          .live-stats {
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            .viewer-count {
              font-size: 12px;
              color: white;
            }
          }
        }
      }
    }
  }
  
  .streamers-list {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    
    .streamer-item {
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
      
      .streamer-info {
        flex: 1;
        margin-left: 12px;
        
        .streamer-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #333;
        }
        
        .streamer-desc {
          font-size: 14px;
          color: #666;
          margin: 0;
        }
      }
      
      .streamer-status {
        position: relative;
        
        .online-indicator {
          width: 12px;
          height: 12px;
          background: #52c41a;
          border: 2px solid white;
          border-radius: 50%;
        }
      }
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .live-home {
    background-color: #1a1a1a;
  }
  
  .live-header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .page-title {
      color: #fff;
    }
  }
  
  .live-stats .stat-card {
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
  
  .live-section {
    .section-title {
      color: #fff;
    }
    
    .live-list .live-item {
      background: #2a2a2a;
    }
    
    .streamers-list {
      background: #2a2a2a;
      
      .streamer-item {
        border-bottom-color: #333;
        
        &:hover {
          background-color: #333;
        }
        
        .streamer-info {
          .streamer-name {
            color: #fff;
          }
          
          .streamer-desc {
            color: #aaa;
          }
        }
      }
    }
  }
}
</style>
