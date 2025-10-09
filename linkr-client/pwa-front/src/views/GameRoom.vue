<template>
  <div class="game-room-page">
    <div class="room-header">
      <el-button type="text" @click="$router.back()" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <div class="room-title">
        <h2>{{ roomInfo.roomName }}</h2>
        <span class="game-name">{{ roomInfo.gameName }}</span>
      </div>
      <el-button type="text" class="more-btn">
        <el-icon><MoreFilled /></el-icon>
      </el-button>
    </div>

    <div class="room-status">
      <div class="status-info">
        <span class="players-count">{{ roomInfo.currentPlayers }}/{{ roomInfo.maxPlayers }}</span>
        <span class="status-text">等待中</span>
      </div>
      <div class="voice-controls">
        <el-button :type="isMuted ? 'danger' : 'primary'" size="small" @click="toggleMute">
          <el-icon><Microphone /></el-icon>
        </el-button>
        <el-button type="primary" size="small" @click="toggleSpeaker">
          <el-icon><Headphone /></el-icon>
        </el-button>
      </div>
    </div>

    <div class="players-list">
      <h3>房间成员</h3>
      <div class="member-list">
        <div class="member-item" v-for="member in roomMembers" :key="member.id">
          <div class="member-avatar">
            <el-avatar :src="member.avatar" :size="40" />
            <div class="voice-indicator" v-if="member.isSpeaking"></div>
          </div>
          <div class="member-info">
            <div class="member-name">{{ member.username }}</div>
            <div class="member-game-id">{{ member.gameId }}</div>
          </div>
          <div class="member-status">
            <span class="rank">{{ member.rank }}</span>
            <span class="role" v-if="member.isHost">房主</span>
          </div>
        </div>
      </div>
    </div>

    <div class="room-chat">
      <h3>房间聊天</h3>
      <div class="chat-messages">
        <div class="message-item" v-for="message in chatMessages" :key="message.id">
          <span class="sender">{{ message.sender }}:</span>
          <span class="content">{{ message.content }}</span>
        </div>
      </div>
      <div class="chat-input">
        <el-input v-model="newMessage" placeholder="输入消息..." @keyup.enter="sendMessage">
          <template #append>
            <el-button type="primary" @click="sendMessage">发送</el-button>
          </template>
        </el-input>
      </div>
    </div>

    <div class="room-actions">
      <el-button type="danger" @click="leaveRoom">离开房间</el-button>
      <el-button type="primary" @click="startGame" :disabled="roomInfo.currentPlayers < roomInfo.maxPlayers">
        开始游戏
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface RoomInfo {
  id: string
  roomName: string
  gameName: string
  currentPlayers: number
  maxPlayers: number
}

interface RoomMember {
  id: string
  username: string
  avatar: string
  gameId: string
  rank: string
  isHost: boolean
  isSpeaking: boolean
}

interface ChatMessage {
  id: string
  sender: string
  content: string
  timestamp: string
}

const roomInfo: RoomInfo = {
  id: '1',
  roomName: '王者荣耀开黑',
  gameName: '王者荣耀',
  currentPlayers: 3,
  maxPlayers: 5
}

const roomMembers: RoomMember[] = [
  {
    id: '1',
    username: '房主小明',
    avatar: 'https://picsum.photos/100/100?random=1',
    gameId: 'test123',
    rank: '钻石III',
    isHost: true,
    isSpeaking: false
  },
  {
    id: '2',
    username: '小美',
    avatar: 'https://picsum.photos/100/100?random=2',
    gameId: 'test456',
    rank: '铂金I',
    isHost: false,
    isSpeaking: true
  },
  {
    id: '3',
    username: '阿强',
    avatar: 'https://picsum.photos/100/100?random=3',
    gameId: 'test789',
    rank: '钻石V',
    isHost: false,
    isSpeaking: false
  }
]

const chatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: '房主小明',
    content: '欢迎来到我的房间！',
    timestamp: '10:30'
  },
  {
    id: '2',
    sender: '小美',
    content: '大家好~',
    timestamp: '10:31'
  }
]

const isMuted = ref(false)
const newMessage = ref('')

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const toggleSpeaker = () => {
  // 切换扬声器
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    chatMessages.push({
      id: Date.now().toString(),
      sender: '我',
      content: newMessage.value,
      timestamp: new Date().toLocaleTimeString()
    })
    newMessage.value = ''
  }
}

const leaveRoom = () => {
  // 离开房间
  console.log('离开房间')
}

const startGame = () => {
  // 开始游戏
  console.log('开始游戏')
}
</script>

<style scoped>
.game-room-page {
  height: 100vh;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
}

.room-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.room-title h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.game-name {
  font-size: 12px;
  color: #6b7280;
}

.back-btn, .more-btn {
  color: #6b7280;
}

.room-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.status-info {
  display: flex;
  flex-direction: column;
}

.players-count {
  font-size: 20px;
  font-weight: 600;
  color: #6366f1;
}

.status-text {
  font-size: 12px;
  color: #6b7280;
}

.voice-controls {
  display: flex;
  gap: 8px;
}

.players-list, .room-chat {
  margin: 16px;
}

.players-list h3, .room-chat h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.member-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.member-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.member-item:last-child {
  border-bottom: none;
}

.member-avatar {
  position: relative;
  margin-right: 12px;
}

.voice-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
  margin-bottom: 2px;
}

.member-game-id {
  font-size: 12px;
  color: #9ca3af;
}

.member-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.rank {
  background: #6366f1;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.role {
  background: #f59e0b;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.room-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  background: white;
  border-radius: 12px;
  padding: 16px;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-item {
  margin-bottom: 8px;
}

.sender {
  font-weight: 600;
  color: #6366f1;
}

.content {
  color: #1f2937;
}

.room-actions {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.room-actions .el-button {
  flex: 1;
}
</style>

