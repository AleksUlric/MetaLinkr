<template>
  <div class="voice-call">
    <div class="call-container">
      <div class="call-info">
        <el-avatar :src="callUser.avatar" :size="120" />
        <h2 class="user-name">{{ callUser.name }}</h2>
        <p class="call-status">{{ callStatus }}</p>
      </div>
      
      <div class="call-controls">
        <el-button 
          type="danger"
          :icon="Close"
          circle
          size="large"
          @click="endCall"
        />
        <el-button 
          :type="isMuted ? 'danger' : 'primary'"
          :icon="isMuted ? 'Mute' : 'Microphone'"
          circle
          size="large"
          @click="toggleMute"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Close, Microphone, Mute } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const callUser = ref({
  name: '用户',
  avatar: 'https://via.placeholder.com/120'
})

const callStatus = ref('通话中...')
const isMuted = ref(false)

// 初始化数据
onMounted(() => {
  const userId = route.params.id
  console.log('语音通话用户ID:', userId)
})

const endCall = () => {
  router.back()
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
}
</script>

<style scoped lang="scss">
.voice-call {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.call-container {
  text-align: center;
  color: white;
}

.call-info {
  margin-bottom: 60px;
  
  .user-name {
    font-size: 28px;
    font-weight: 600;
    margin: 20px 0 8px 0;
  }
  
  .call-status {
    font-size: 16px;
    opacity: 0.8;
    margin: 0;
  }
}

.call-controls {
  display: flex;
  justify-content: center;
  gap: 24px;
  
  .el-button {
    width: 60px;
    height: 60px;
  }
}
</style>
