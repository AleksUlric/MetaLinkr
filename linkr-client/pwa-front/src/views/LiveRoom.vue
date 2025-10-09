<template>
  <div class="live-room-page">
    <div class="live-player">
      <el-image :src="liveInfo.cover" class="player-cover" />
      <div class="live-controls">
        <el-button type="text" @click="$router.back()" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="live-info">
          <h3>{{ liveInfo.title }}</h3>
          <div class="streamer-info">
            <el-avatar :src="liveInfo.streamerAvatar" :size="30" />
            <span class="streamer-name">{{ liveInfo.streamerName }}</span>
            <span class="viewer-count">{{ liveInfo.viewerCount }}人观看</span>
          </div>
        </div>
        <el-button type="text" class="more-btn">
          <el-icon><MoreFilled /></el-icon>
        </el-button>
      </div>
    </div>

    <div class="live-chat">
      <div class="chat-messages">
        <div class="message-item" v-for="message in chatMessages" :key="message.id">
          <span class="username">{{ message.username }}:</span>
          <span class="content">{{ message.content }}</span>
        </div>
      </div>
      <div class="chat-input">
        <el-input v-model="newMessage" placeholder="说点什么..." @keyup.enter="sendMessage">
          <template #append>
            <el-button type="primary" @click="sendMessage">发送</el-button>
          </template>
        </el-input>
      </div>
    </div>

    <div class="live-actions">
      <el-button type="primary" @click="followStreamer">
        <el-icon><Star /></el-icon>
        关注
      </el-button>
      <el-button type="danger" @click="sendGift">
        <el-icon><Present /></el-icon>
        送礼
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const liveInfo = {
  id: '1',
  title: '今天给大家唱首歌~',
  cover: 'https://picsum.photos/400/300?random=301',
  streamerName: '小美',
  streamerAvatar: 'https://picsum.photos/100/100?random=1',
  viewerCount: 1256
}

const chatMessages = ref([
  { id: '1', username: '用户1', content: '主播唱得真好听！' },
  { id: '2', username: '用户2', content: '666' }
])

const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim()) {
    chatMessages.value.push({
      id: Date.now().toString(),
      username: '我',
      content: newMessage.value
    })
    newMessage.value = ''
  }
}

const followStreamer = () => {
  console.log('关注主播')
}

const sendGift = () => {
  console.log('发送礼物')
}
</script>

<style scoped>
.live-room-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #000;
}

.live-player {
  position: relative;
  flex: 1;
}

.player-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.live-controls {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent);
}

.live-info h3 {
  color: white;
  margin: 0 0 8px 0;
  font-size: 16px;
}

.streamer-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
}

.viewer-count {
  background: rgba(0,0,0,0.5);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.back-btn, .more-btn {
  color: white;
}

.live-chat {
  background: white;
  height: 200px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.message-item {
  margin-bottom: 8px;
}

.username {
  color: #6366f1;
  font-weight: 600;
}

.chat-input {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.live-actions {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.live-actions .el-button {
  flex: 1;
}
</style>

