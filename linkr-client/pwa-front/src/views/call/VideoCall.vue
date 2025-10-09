<template>
  <div class="video-call">
    <div class="call-container">
      <div class="remote-video">
        <div class="video-placeholder">
          <el-icon size="80" color="#ccc">
            <VideoCamera />
          </el-icon>
          <p>等待对方接听...</p>
        </div>
      </div>
      
      <div class="local-video">
        <div class="video-placeholder">
          <el-icon size="40" color="#ccc">
            <User />
          </el-icon>
        </div>
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
        <el-button 
          :type="isVideoOff ? 'danger' : 'primary'"
          :icon="isVideoOff ? 'VideoCamera' : 'VideoCamera'"
          circle
          size="large"
          @click="toggleVideo"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { VideoCamera, User, Close, Microphone, Mute } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const isMuted = ref(false)
const isVideoOff = ref(false)

// 初始化数据
onMounted(() => {
  const userId = route.params.id
  console.log('视频通话用户ID:', userId)
})

const endCall = () => {
  router.back()
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const toggleVideo = () => {
  isVideoOff.value = !isVideoOff.value
}
</script>

<style scoped lang="scss">
.video-call {
  height: 100vh;
  background: #000;
  position: relative;
  overflow: hidden;
}

.call-container {
  height: 100%;
  position: relative;
}

.remote-video {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .video-placeholder {
    text-align: center;
    color: #ccc;
    
    p {
      margin-top: 16px;
      font-size: 16px;
    }
  }
}

.local-video {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 120px;
  height: 160px;
  background: #333;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .video-placeholder {
    color: #ccc;
  }
}

.call-controls {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 24px;
  
  .el-button {
    width: 60px;
    height: 60px;
  }
}
</style>
