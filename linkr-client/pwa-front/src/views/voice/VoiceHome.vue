<template>
  <div class="voice-home">
    <!-- 顶部导航 -->
    <div class="header">
      <h1 class="title">语音</h1>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="createRoom" />
      </div>
    </div>
    
    <!-- 语音房间列表 -->
    <div class="voice-container">
      <div class="section-title">推荐房间</div>
      <div class="room-list">
        <div 
          v-for="room in voiceRooms" 
          :key="room.id" 
          class="room-item"
          @click="joinRoom(room)"
        >
          <div class="room-cover">
            <el-image :src="room.cover" fit="cover" />
            <div class="room-overlay">
              <div class="room-info">
                <h3 class="room-name">{{ room.name }}</h3>
                <p class="room-description">{{ room.description }}</p>
              </div>
              <div class="room-stats">
                <span class="member-count">{{ room.memberCount }}/{{ room.maxMembers }}</span>
                <el-icon v-if="room.isOnline" color="#52c41a">
                  <CircleCheck />
                </el-icon>
              </div>
            </div>
          </div>
          
          <div class="room-footer">
            <div class="host-info">
              <el-avatar :src="room.hostAvatar" :size="24" />
              <span class="host-name">{{ room.hostName }}</span>
            </div>
            <div class="room-tags">
              <el-tag 
                v-for="tag in room.tags" 
                :key="tag"
                size="small"
                class="room-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 语音派对 -->
      <div class="section-title">语音派对</div>
      <div class="party-list">
        <div 
          v-for="party in voiceParties" 
          :key="party.id" 
          class="party-item"
          @click="joinParty(party)"
        >
          <div class="party-cover">
            <el-image :src="party.cover" fit="cover" />
            <div class="party-overlay">
              <div class="party-info">
                <h3 class="party-name">{{ party.name }}</h3>
                <p class="party-description">{{ party.description }}</p>
              </div>
              <div class="party-stats">
                <span class="member-count">{{ party.memberCount }}/{{ party.maxMembers }}</span>
                <el-icon v-if="party.isOnline" color="#52c41a">
                  <CircleCheck />
                </el-icon>
              </div>
            </div>
          </div>
          
          <div class="party-footer">
            <div class="host-info">
              <el-avatar :src="party.hostAvatar" :size="24" />
              <span class="host-name">{{ party.hostName }}</span>
            </div>
            <div class="party-tags">
              <el-tag 
                v-for="tag in party.tags" 
                :key="tag"
                size="small"
                class="party-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, CircleCheck } from '@element-plus/icons-vue'
import { useVoiceStore } from '@/stores/voice'

const router = useRouter()
const voiceStore = useVoiceStore()
const voiceRooms = ref(voiceStore.voiceRooms)
const voiceParties = ref(voiceStore.voiceParties)

// 初始化数据
onMounted(async () => {
  await voiceStore.initVoice()
  voiceRooms.value = voiceStore.voiceRooms
  voiceParties.value = voiceStore.voiceParties
})

// 加入房间
const joinRoom = async (room: any) => {
  try {
    await voiceStore.joinVoiceRoom(room.id)
    router.push(`/voice/room/${room.id}`)
  } catch (error) {
    console.error('加入房间失败:', error)
  }
}

// 加入派对
const joinParty = async (party: any) => {
  try {
    await voiceStore.joinVoiceRoom(party.id)
    router.push(`/voice/party/${party.id}`)
  } catch (error) {
    console.error('加入派对失败:', error)
  }
}

// 创建房间
const createRoom = () => {
  console.log('创建房间')
}
</script>

<style scoped lang="scss">
.voice-home {
  height: 100%;
  background-color: #f5f5f5;
  padding-bottom: 80px; // 为底部导航栏留出空间
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

.voice-container {
  padding: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.room-list, .party-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.room-item, .party-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  .room-cover, .party-cover {
    position: relative;
    height: 120px;
    
    .el-image {
      width: 100%;
      height: 100%;
    }
    
    .room-overlay, .party-overlay {
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
      
      .room-info, .party-info {
        .room-name, .party-name {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin: 0 0 4px 0;
        }
        
        .room-description, .party-description {
          font-size: 12px;
          color: rgba(255,255,255,0.8);
          margin: 0;
        }
      }
      
      .room-stats, .party-stats {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .member-count {
          font-size: 12px;
          color: white;
        }
      }
    }
  }
  
  .room-footer, .party-footer {
    padding: 12px;
    
    .host-info {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      .host-name {
        font-size: 14px;
        color: #666;
        margin-left: 8px;
      }
    }
    
    .room-tags, .party-tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      
      .room-tag, .party-tag {
        background: #f0f0f0;
        color: #666;
        border: none;
        font-size: 12px;
      }
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .voice-home {
    background-color: #1a1a1a;
  }
  
  .header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .title {
      color: #fff;
    }
  }
  
  .section-title {
    color: #fff;
  }
  
  .room-item, .party-item {
    background: #2a2a2a;
    
    .room-footer, .party-footer {
      .host-info .host-name {
        color: #aaa;
      }
      
      .room-tags .room-tag, .party-tags .party-tag {
        background: #333;
        color: #aaa;
      }
    }
  }
}
</style>