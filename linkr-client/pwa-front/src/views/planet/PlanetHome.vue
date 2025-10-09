<template>
  <div class="soul-planet-page">
    <!-- Soul风格顶部状态栏 -->
    <div class="soul-status-bar">
      <div class="status-left">
        <div class="time-info">
          <span class="time">{{ currentTime }}</span>
          <span class="date">{{ currentDate }}</span>
        </div>
      </div>
      <div class="status-center">
        <div class="soul-title">Soul</div>
        <div class="filter-btn" @click="showFilter">
          <el-icon><Filter /></el-icon>
          <span>筛选</span>
        </div>
      </div>
      <div class="status-right">
        <div class="network-info">
          <span class="speed">{{ networkSpeed }}</span>
          <span class="signal">5G</span>
          <div class="signal-bars">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
        </div>
        <div class="battery-info">
          <span class="battery-level">{{ batteryLevel }}%</span>
          <div class="battery-icon">
            <div class="battery-fill" :style="{ width: batteryLevel + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Soul风格功能按钮 -->
    <div class="soul-feature-buttons">
      <div class="feature-btn soul-test" @click="startSoulTest">
        <div class="btn-icon">🌀</div>
        <span>灵魂测试</span>
      </div>
      <div class="feature-btn zodiac" @click="showZodiac">
        <div class="btn-icon">♈</div>
        <span>星座</span>
      </div>
    </div>

    <!-- Soul风格在线人数 -->
    <div class="online-count">
      <span>当前{{ onlineCount }}人在线</span>
    </div>

    <!-- Soul风格卡片功能 -->
    <div class="soul-cards-section">
      <div class="cards-header">
        <span>同城卡/加速卡/定位卡 ></span>
        <div class="notification-dot"></div>
      </div>
    </div>

    <!-- Soul风格主要功能卡片 -->
    <div class="soul-main-cards">
      <div class="card-row">
        <!-- 灵魂匹配卡片 -->
        <div class="soul-card soul-match-card" @click="startSoulMatch">
          <div class="card-background soul-match-bg"></div>
          <div class="card-content">
            <div class="card-title">灵魂匹配</div>
            <div class="card-subtitle">今日剩余{{ matchCount }}次</div>
            <div class="card-button">开始匹配</div>
            <div class="card-character soul-match-char">💫</div>
          </div>
        </div>

        <!-- 语音匹配卡片 -->
        <div class="soul-card voice-match-card" @click="startVoiceMatch">
          <div class="card-background voice-match-bg"></div>
          <div class="card-content">
            <div class="card-title">语音匹配</div>
            <div class="card-subtitle">今日剩余{{ voiceCount }}次</div>
            <div class="card-character voice-match-char">🎵</div>
          </div>
        </div>
      </div>

      <div class="card-row">
        <!-- 群聊派对卡片 -->
        <div class="soul-card group-party-card" @click="joinGroupParty">
          <div class="card-background group-party-bg"></div>
          <div class="card-content">
            <div class="card-title">群聊派对</div>
            <div class="card-subtitle">cpdd-面基交友</div>
            <div class="participants">
              <div class="participant-avatar" v-for="i in 3" :key="i"></div>
              <div class="participant-count">+{{ partyCount }}</div>
            </div>
            <div class="card-button">进入派对</div>
            <div class="card-character group-party-char">🎉</div>
          </div>
        </div>

        <!-- 蒙面酒馆卡片 -->
        <div class="soul-card masked-bar-card" @click="enterMaskedBar">
          <div class="card-background masked-bar-bg"></div>
          <div class="card-content">
            <div class="card-title">蒙面酒馆</div>
            <div class="card-subtitle">仅匹配女生{{ barCount }}</div>
            <div class="card-character masked-bar-char">🍷</div>
          </div>
        </div>
      </div>

      <div class="card-row">
        <!-- 萌面匹配卡片 -->
        <div class="soul-card cute-match-card" @click="startCuteMatch">
          <div class="card-background cute-match-bg"></div>
          <div class="card-content">
            <div class="card-title">萌面匹配</div>
            <div class="card-subtitle">剩余{{ cuteCount }}次</div>
            <div class="card-character cute-match-char">😊</div>
          </div>
        </div>

        <!-- 星球实验室卡片 -->
        <div class="soul-card planet-lab-card" @click="enterPlanetLab">
          <div class="card-background planet-lab-bg"></div>
          <div class="card-content">
            <div class="card-title">星球实验室</div>
            <div class="card-subtitle">超多有趣新玩法</div>
            <div class="new-badge">new</div>
            <div class="card-character planet-lab-char">🧪</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Soul风格精选派对 -->
    <div class="soul-featured-parties">
      <div class="parties-header">
        <h3>精选派对</h3>
        <span class="parties-hall" @click="goToPartyHall">派对大厅 ></span>
      </div>
      <div class="parties-grid">
        <div 
          v-for="party in featuredParties" 
          :key="party.id"
          class="party-card"
          @click="joinParty(party)"
        >
          <div class="party-icon">📶</div>
          <div class="party-info">
            <div class="party-title">{{ party.title }}</div>
            <div class="party-desc">{{ party.description }}</div>
            <div class="party-participants">
              <div class="participant-avatars">
                <div 
                  v-for="avatar in party.avatars" 
                  :key="avatar"
                  class="participant-avatar"
                  :style="{ backgroundColor: avatar }"
                ></div>
              </div>
              <span class="participant-count">{{ party.onlineCount }}人在线</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Soul风格星空背景 -->
    <div class="starfield-background">
      <div 
        v-for="star in stars" 
        :key="star.id"
        class="star"
        :style="{
          left: star.x + '%',
          top: star.y + '%',
          animationDelay: star.delay + 's',
          animationDuration: star.duration + 's'
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Filter } from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const currentTime = ref('1:41')
const currentDate = ref('10月9日周四')
const networkSpeed = ref('1.24 K/s')
const batteryLevel = ref(64)
const onlineCount = ref(14424048)
const matchCount = ref(35)
const voiceCount = ref(10)
const partyCount = ref(16)
const barCount = ref(6)
const cuteCount = ref(13)

// 精选派对数据
const featuredParties = ref([
  {
    id: 1,
    title: '距离小于20km',
    description: '杭州-cpdd-面基交友',
    avatars: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
    onlineCount: 15
  },
  {
    id: 2,
    title: '交友扩列',
    description: '瞬间有照片的进, 进来包有对象',
    avatars: ['#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'],
    onlineCount: 49
  },
  {
    id: 3,
    title: '交友扩列',
    description: '看瞬间有照片进,',
    avatars: ['#00d2d3', '#ff9f43', '#ee5a24', '#0abde3'],
    onlineCount: 32
  },
  {
    id: 4,
    title: 'cpdd来男人',
    description: '',
    avatars: ['#a55eea', '#26de81', '#fd79a8', '#fdcb6e'],
    onlineCount: 28
  }
])

// 星空粒子数据
const stars = ref<Array<{
  id: number
  x: number
  y: number
  delay: number
  duration: number
}>>([])

// 生成星空粒子
const generateStars = () => {
  const starCount = 50
  stars.value = []
  for (let i = 0; i < starCount; i++) {
    stars.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 10
    })
  }
}

// 更新时间
const updateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
  
  const month = now.getMonth() + 1
  const date = now.getDate()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[now.getDay()]
  currentDate.value = `${month}月${date}日${weekday}`
}

// 方法
const showFilter = () => {
  ElMessage.info('筛选功能开发中...')
}

const startSoulTest = () => {
  ElMessage.success('开始灵魂测试')
  router.push('/soul-test')
}

const showZodiac = () => {
  ElMessage.info('星座功能开发中...')
}

const startSoulMatch = () => {
  ElMessage.success('开始灵魂匹配')
  router.push('/match/soul')
}

const startVoiceMatch = () => {
  ElMessage.success('开始语音匹配')
  router.push('/match/voice')
}

const joinGroupParty = () => {
  ElMessage.success('进入群聊派对')
  router.push('/party/group')
}

const enterMaskedBar = () => {
  ElMessage.success('进入蒙面酒馆')
  router.push('/bar/masked')
}

const startCuteMatch = () => {
  ElMessage.success('开始萌面匹配')
  router.push('/match/cute')
}

const enterPlanetLab = () => {
  ElMessage.success('进入星球实验室')
  router.push('/lab')
}

const goToPartyHall = () => {
  ElMessage.info('派对大厅功能开发中...')
}

const joinParty = (party: any) => {
  ElMessage.success(`加入派对: ${party.title}`)
  router.push(`/party/${party.id}`)
}

// 生命周期
onMounted(() => {
  updateTime()
  generateStars()
  
  // 每秒更新时间
  const timeInterval = setInterval(updateTime, 1000)
  
  onUnmounted(() => {
    clearInterval(timeInterval)
  })
})
</script>

<style lang="scss" scoped>
.soul-planet-page {
  background: #1a1a1a;
  min-height: 100vh;
  color: #ffffff;
  position: relative;
  overflow-x: hidden;
  
  // Soul风格的深色星空背景
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
      linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    z-index: -2;
    pointer-events: none;
  }
}

// Soul风格顶部状态栏
.soul-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  .status-left {
    .time-info {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .time {
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
      }

      .date {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }

  .status-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    .soul-title {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #ffffff;
      }
    }
  }

  .status-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .network-info {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);

      .signal-bars {
        display: flex;
        gap: 2px;
        margin-left: 4px;

        .bar {
          width: 3px;
          height: 8px;
          background: #00ff88;
          border-radius: 1px;

          &:nth-child(1) { height: 4px; }
          &:nth-child(2) { height: 6px; }
          &:nth-child(3) { height: 8px; }
          &:nth-child(4) { height: 10px; }
        }
      }
    }

    .battery-info {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);

      .battery-icon {
        width: 20px;
        height: 10px;
        border: 1px solid rgba(255, 255, 255, 0.6);
        border-radius: 2px;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          right: -3px;
          top: 2px;
          width: 2px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 0 1px 1px 0;
        }

        .battery-fill {
          height: 100%;
          background: #00ff88;
          border-radius: 1px;
          transition: width 0.3s ease;
        }
      }
    }
  }
}

// Soul风格功能按钮
.soul-feature-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  margin-bottom: 20px;

  .feature-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .btn-icon {
      font-size: 32px;
      animation: rotate 10s linear infinite;
    }

    span {
      font-size: 14px;
      color: #ffffff;
      font-weight: 500;
    }

    &.soul-test {
      background: linear-gradient(135deg, rgba(43, 233, 123, 0.2) 0%, rgba(56, 249, 215, 0.2) 100%);
      border-color: rgba(43, 233, 123, 0.3);
    }

    &.zodiac {
      background: linear-gradient(135deg, rgba(250, 112, 154, 0.2) 0%, rgba(254, 225, 64, 0.2) 100%);
      border-color: rgba(250, 112, 154, 0.3);
    }
  }
}

// Soul风格在线人数
.online-count {
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

// Soul风格卡片功能
.soul-cards-section {
  padding: 0 20px;
  margin-bottom: 20px;

  .cards-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;

    span {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
    }

    .notification-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: #ff4757;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
  }
}

// Soul风格主要功能卡片
.soul-main-cards {
  padding: 0 20px;
  margin-bottom: 20px;

  .card-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .soul-card {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    }

    .card-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.8;

      &.soul-match-bg {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.voice-match-bg {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
      }

      &.group-party-bg {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      }

      &.masked-bar-bg {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.cute-match-bg {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.planet-lab-bg {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
    }

    .card-content {
      position: relative;
      z-index: 2;
      padding: 20px;
      color: white;

      .card-title {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 8px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .card-subtitle {
        font-size: 12px;
        opacity: 0.9;
        margin-bottom: 12px;
      }

      .card-button {
        background: rgba(255, 255, 255, 0.2);
        padding: 8px 16px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        margin-bottom: 12px;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }

      .participants {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;

        .participant-avatars {
          display: flex;
          gap: -4px;

          .participant-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid white;
            margin-left: -4px;

            &:first-child {
              margin-left: 0;
            }
          }
        }

        .participant-count {
          font-size: 11px;
          opacity: 0.8;
        }
      }

      .card-character {
        position: absolute;
        right: 16px;
        bottom: 16px;
        font-size: 32px;
        opacity: 0.8;
        animation: float 3s ease-in-out infinite;
      }

      .new-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: #ff4757;
        color: white;
        font-size: 10px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 12px;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
      }
    }
  }
}

// Soul风格精选派对
.soul-featured-parties {
  padding: 0 20px;
  margin-bottom: 20px;

  .parties-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .parties-hall {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: #ffffff;
      }
    }
  }

  .parties-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .party-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .party-icon {
        font-size: 20px;
        margin-bottom: 12px;
        opacity: 0.8;
      }

      .party-info {
        .party-title {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .party-desc {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .party-participants {
          display: flex;
          align-items: center;
          gap: 8px;

          .participant-avatars {
            display: flex;
            gap: -4px;

            .participant-avatar {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 2px solid white;
              margin-left: -4px;

              &:first-child {
                margin-left: 0;
              }
            }
          }

          .participant-count {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }
    }
  }
}

// Soul风格星空背景
.starfield-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;

  .star {
    position: absolute;
    width: 2px;
    height: 2px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: twinkle 3s ease-in-out infinite;

    &:nth-child(odd) {
      background: rgba(120, 219, 255, 0.6);
    }

    &:nth-child(even) {
      background: rgba(255, 119, 198, 0.6);
    }
  }
}

// 动画效果
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .soul-planet-page {
    .soul-status-bar {
      padding: 12px 16px;

      .status-center {
        .soul-title {
          font-size: 20px;
        }
      }
    }

    .soul-feature-buttons {
      padding: 16px;
      gap: 12px;

      .feature-btn {
        padding: 12px 16px;

        .btn-icon {
          font-size: 28px;
        }

        span {
          font-size: 12px;
        }
      }
    }

    .soul-main-cards {
      padding: 0 16px;

      .card-row {
        gap: 12px;
      }

      .soul-card {
        .card-content {
          padding: 16px;

          .card-title {
            font-size: 14px;
          }

          .card-subtitle {
            font-size: 11px;
          }

          .card-character {
            font-size: 28px;
          }
        }
      }
    }

    .soul-featured-parties {
      padding: 0 16px;

      .parties-grid {
        gap: 8px;

        .party-card {
          padding: 12px;

          .party-info {
            .party-title {
              font-size: 13px;
            }

            .party-desc {
              font-size: 11px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .soul-main-cards {
    .card-row {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }

  .soul-featured-parties {
    .parties-grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }
}
</style>
