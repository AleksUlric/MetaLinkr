<template>
  <div class="soul-match-page">
    <div class="soul-header">
      <div class="title">
        灵犀链接
        <span class="badge">Beta</span>
      </div>
      <div class="online-pill">
        <span class="dot"></span>
        {{ onlineCount.toLocaleString() }} 人正在在线匹配
      </div>
    </div>

    <div class="match-container">
      <div class="matching-state" :class="{ 'is-queued': isRealtimeQueued }">
        <div class="matching-visual">
          <div class="orbit orbit-large"></div>
          <div class="orbit orbit-medium"></div>
          <div class="orbit orbit-small"></div>
          <div class="matching-avatar">
            <img :src="selfAvatar" alt="me" />
          </div>
          <div class="matching-spark"></div>
        </div>
        <div class="matching-title">
          {{ isRealtimeQueued ? '灵犀正在为你寻找缘分' : '已加入匹配队列' }}
        </div>
        <p class="matching-tip">
          {{ currentMatchingTip }}
        </p>
        <div class="matching-progress">
          <span
            v-for="n in 4"
            :key="n"
            class="progress-dot"
            :style="{ animationDelay: `${n * 0.15}s` }"
          ></span>
        </div>
        <div class="matching-cancel-btn">
          <el-button round @click="cancelMatching">
            <el-icon><Close /></el-icon>
            取消匹配
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { API_BASE_URL } from '@/utils/request'
import { useMatchStore } from '../../stores/match'
import { useUserStore } from '../../stores/user'
import type { MatchUser } from '../../types/match'
import type { UserProfile } from '../../types/user'
import type { SoulMatchUserResponse } from '../../services/soulMatch'
import {
  cancelRealtimeMatch,
  enqueueRealtimeMatch,
  sendRealtimeHeartbeat,
  type RealtimeMatchStatusResponse
} from '../../services/realtimeMatch'
import { getUserAvatarUrl } from '../../utils/avatar'

const router = useRouter()
const matchStore = useMatchStore()
const userStore = useUserStore()
const { profile } = storeToRefs(userStore)
const userProfile = profile as unknown as Ref<UserProfile | null>

const HEARTBEAT_INTERVAL = 25000
const NO_MATCH_HINT_DELAY = 10 * 60 * 1000
const STORAGE_DEVICE_KEY = 'soul_match_device_id'

const resolveDeviceId = () => {
  if (typeof window === 'undefined') {
    return `web-${Date.now()}`
  }
  try {
    const cached = window.localStorage.getItem(STORAGE_DEVICE_KEY)
    if (cached) {
      return cached
    }
    const generated =
      window.crypto?.randomUUID?.() ??
      `web-${Date.now()}-${Math.random().toString(16).slice(2)}`
    window.localStorage.setItem(STORAGE_DEVICE_KEY, generated)
    return generated
  } catch {
    return `web-${Date.now()}`
  }
}

const deviceId = resolveDeviceId()

const onlineCount = ref(1) // 初始值设为1，等待后端返回真实数据
const selfAvatar = computed(() => {
  const profile = userProfile.value
  const gender = profile?.gender || 'male'
  return getUserAvatarUrl(profile?.avatar, gender)
})

const realtimeStatus = ref<RealtimeMatchStatusResponse | null>(null)
const isRealtimeQueued = ref(false)
const realtimeFlowActive = ref(false)

const matchingTips = [
  'AI丘比特正在同步你们的心跳频率…',
  '正在扫描同城灵犀信号，匹配默契指数…',
  '为你挑选最懂你的人，请稍候…',
  '灵犀星球已收到请求，正在建立通道…'
]
const matchingTipIndex = ref(0)
const currentMatchingTip = ref(matchingTips[0])

let heartbeatTimer: number | null = null
let noMatchHintTimer: number | null = null
let matchingTipTimer: number | null = null
let matchStompClient: Client | null = null
let matchSubscription: StompSubscription | null = null

const mapRealtimeUser = (user: SoulMatchUserResponse): MatchUser => ({
  id: user.id,
  name: user.name ?? '灵犀星友',
  age: user.age ?? null,
  avatar: user.avatar ?? null,
  photos: user.photos ?? [],
  bio: user.bio ?? '这个人有点神秘，快去聊天了解TA吧～',
  interests: user.interests ?? [],
  location: user.location ?? '灵犀星球',
  distance: user.distance ?? 0,
  isOnline: user.isOnline ?? user.online ?? false,
  lastActive: user.lastActiveTimestamp ?? Date.now(),
  compatibility: user.compatibility ?? 80
})

const clearNoMatchHintTimer = () => {
  if (noMatchHintTimer !== null) {
    window.clearTimeout(noMatchHintTimer)
    noMatchHintTimer = null
  }
}

const startMatchingTipRotation = () => {
  if (typeof window === 'undefined' || matchingTipTimer !== null) return
  matchingTipTimer = window.setInterval(() => {
    matchingTipIndex.value = (matchingTipIndex.value + 1) % matchingTips.length
    currentMatchingTip.value = matchingTips[matchingTipIndex.value]
  }, 2400)
}

const stopMatchingTipRotation = () => {
  if (typeof window !== 'undefined' && matchingTipTimer !== null) {
    window.clearInterval(matchingTipTimer)
    matchingTipTimer = null
  }
  matchingTipIndex.value = 0
  currentMatchingTip.value = matchingTips[0]
}

const startNoMatchHintTimer = () => {
  clearNoMatchHintTimer()
  if (typeof window === 'undefined') return
  noMatchHintTimer = window.setTimeout(() => {
    ElMessage.info('已为你持续匹配 10 分钟，稍后再来可能更容易遇到心动对象～')
    noMatchHintTimer = null
  }, NO_MATCH_HINT_DELAY)
}

const navigateToChat = (user: MatchUser) => {
  const targetUser = { ...user }
  const targetUserId = targetUser.id?.toString?.()
  if (!targetUserId) {
    ElMessage.error('匹配用户信息缺失，请重新进入匹配')
    return
  }

  const query: Record<string, string> = {
    from: 'soul-match'
  }
  if (targetUser.chatRoomId) {
    query.chatRoomId = targetUser.chatRoomId.toString()
  }

  void router.push({
    path: `/chat/${targetUserId}`,
    query
  })
}

const handleMatchSuccess = (user: MatchUser) => {
  const targetUser = { ...user }
  matchStore.setLastMatchedUser(targetUser)

  clearNoMatchHintTimer()
  ElMessage.success('匹配成功，已为你们创建聊天通道')
  isRealtimeQueued.value = false

  void stopRealtimeFlow()
  navigateToChat(targetUser)
}

const cancelMatching = async () => {
  try {
    await stopRealtimeFlow()
    ElMessage.info('已取消匹配')
    router.push('/app/planet')
  } catch (error) {
    console.error('取消匹配失败:', error)
    ElMessage.error('取消匹配失败，请稍后重试')
  }
}

const sendHeartbeat = async (offline = false) => {
  try {
    const response = await sendRealtimeHeartbeat({
      deviceId,
      platform: 'web',
      offline
    })
    // 更新在线人数
    if (response && typeof response.onlineCount === 'number' && response.onlineCount >= 0) {
      onlineCount.value = Math.max(response.onlineCount, 1)
    }
  } catch (error) {
    console.error('实时心跳失败:', error)
  }
}

const handleRealtimeStatus = (status?: RealtimeMatchStatusResponse | null) => {
  if (!status) return
  realtimeStatus.value = status
  // 每次收到状态更新时，都更新在线人数（确保实时性）
  if (typeof status.onlineCount === 'number' && status.onlineCount >= 0) {
    onlineCount.value = Math.max(status.onlineCount, 1)
    console.log('[SoulMatch] 更新在线人数:', onlineCount.value)
  }

  if (status.matched && status.partner) {
    const partnerUser = mapRealtimeUser(status.partner)
    if (status.chatRoomId) {
      partnerUser.chatRoomId = status.chatRoomId
    }
    handleMatchSuccess(partnerUser)
    return
  }

  const wasQueued = isRealtimeQueued.value
  isRealtimeQueued.value = status.queued
  if (status.queued) {
    if (!wasQueued) {
      startNoMatchHintTimer()
    }
  } else {
    clearNoMatchHintTimer()
  }

  if (!status.queued && realtimeFlowActive.value && typeof window !== 'undefined') {
    window.setTimeout(() => {
      if (realtimeFlowActive.value) {
        void enqueueRealtimeMatchRequest()
      }
    }, 500)
  }
}

const enqueueRealtimeMatchRequest = async () => {
  if (!realtimeFlowActive.value) return
  try {
    const status = await enqueueRealtimeMatch()
    handleRealtimeStatus(status)
  } catch (error) {
    console.error('实时匹配入队失败:', error)
  }
}

const connectMatchWebSocket = () => {
  if (matchStompClient && matchStompClient.connected) {
    return
  }

  if (matchStompClient && !matchStompClient.active) {
    matchStompClient.activate()
    return
  }

  const client = new Client({
    reconnectDelay: 4000,
    heartbeatIncoming: 20000,
    heartbeatOutgoing: 20000,
    webSocketFactory: () =>
      new SockJS(`${API_BASE_URL}/ws/chat`, undefined, {
        transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
        transportOptions: {
          'xhr-streaming': { withCredentials: true },
          'xhr-polling': { withCredentials: true }
        }
      }),
    debug: import.meta.env.DEV ? (message) => console.log('[MatchWS]', message) : undefined
  })

  client.onConnect = () => {
    console.log('[SoulMatch] WebSocket 已连接，订阅匹配消息')
    // 订阅用户专属的匹配消息队列
    if (matchSubscription) {
      matchSubscription.unsubscribe()
    }
    matchSubscription = client.subscribe('/user/queue/realtime/match', (message: IMessage) => {
      try {
        const status = JSON.parse(message.body) as RealtimeMatchStatusResponse
        console.log('[SoulMatch] 收到匹配状态更新:', status)
        handleRealtimeStatus(status)
      } catch (error) {
        console.error('[SoulMatch] 解析匹配消息失败:', error, message.body)
      }
    })
  }

  client.onDisconnect = () => {
    console.log('[SoulMatch] WebSocket 已断开')
    matchSubscription = null
  }

  client.onStompError = (frame) => {
    console.error('[SoulMatch] WebSocket STOMP 错误:', frame.headers['message'], frame.body)
  }

  client.onWebSocketError = (event) => {
    console.error('[SoulMatch] WebSocket 连接错误:', event)
  }

  matchStompClient = client
  client.activate()
}

const disconnectMatchWebSocket = () => {
  if (matchSubscription) {
    matchSubscription.unsubscribe()
    matchSubscription = null
  }
  if (matchStompClient) {
    matchStompClient.deactivate()
    matchStompClient = null
  }
}

const startRealtimeFlow = async () => {
  if (realtimeFlowActive.value) return
  realtimeFlowActive.value = true
  
  // 连接 WebSocket 以接收匹配结果
  connectMatchWebSocket()
  
  await sendHeartbeat()

  if (typeof window !== 'undefined') {
    heartbeatTimer = window.setInterval(() => {
      void sendHeartbeat()
    }, HEARTBEAT_INTERVAL)
  }

  await enqueueRealtimeMatchRequest()
}

const stopRealtimeFlow = async () => {
  if (!realtimeFlowActive.value) return
  realtimeFlowActive.value = false

  clearNoMatchHintTimer()
  if (heartbeatTimer !== null) {
    window.clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }

  // 断开 WebSocket 连接
  disconnectMatchWebSocket()

  try {
    await cancelRealtimeMatch()
  } catch (error) {
    console.warn('取消实时匹配失败', error)
  }

  await sendHeartbeat(true)
}

watch(
  () => isRealtimeQueued.value,
  (queued) => {
    if (queued) {
      startMatchingTipRotation()
    } else {
      stopMatchingTipRotation()
    }
  },
  { immediate: true }
)

onMounted(async () => {
  await startRealtimeFlow()
})

onBeforeUnmount(() => {
  clearNoMatchHintTimer()
  stopMatchingTipRotation()
  disconnectMatchWebSocket()
  void stopRealtimeFlow()
})
</script>

<style scoped lang="scss">
.soul-match-page {
  min-height: 100vh;
  padding: 24px 16px 120px;
  background: radial-gradient(circle at 20% 20%, #f8f4ff, #ecebff 45%, #e8f4ff);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.3) 2px, transparent 2px);
    background-size: 120px 120px;
    opacity: 0.4;
    pointer-events: none;
  }
}

.soul-header {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;

  .title {
    font-size: 28px;
    font-weight: 700;
    color: #1e1b4b;

    .badge {
      font-size: 12px;
      margin-left: 8px;
      padding: 2px 8px;
      border-radius: 999px;
      background: rgba(139, 92, 246, 0.15);
      color: #8b5cf6;
    }
  }

  .subtitle {
    margin: 8px 0 16px;
    color: #5b6178;
    font-size: 14px;
  }

  .online-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 4px 18px rgba(79, 70, 229, 0.15);
    font-size: 13px;
    color: #4c1d95;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 8px rgba(52, 211, 153, 0.8);
    }
  }
}

.match-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

.matching-state {
  width: 100%;
  max-width: 360px;
  padding: 36px 24px 40px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.95);
  text-align: center;
  box-shadow: 0 25px 50px rgba(79, 70, 229, 0.2);
  position: relative;
  overflow: hidden;
}

.matching-visual {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.matching-visual .orbit {
  position: absolute;
  border-radius: 50%;
  border: 1px dashed rgba(139, 92, 246, 0.5);
  animation: orbitPulse 4s linear infinite;
}

.orbit-large {
  width: 100%;
  height: 100%;
}

.orbit-medium {
  width: 70%;
  height: 70%;
  animation-duration: 3.4s;
}

.orbit-small {
  width: 45%;
  height: 45%;
  animation-duration: 2.8s;
}

.matching-avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.25);
  animation: floatAvatar 3s ease-in-out infinite;
}

.matching-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.matching-spark {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fcd34d, #f97316);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.8);
  animation: sparkMove 2.4s ease-in-out infinite;
}

.matching-title {
  font-size: 20px;
  font-weight: 600;
  color: #4338ca;
  margin-bottom: 8px;
}

.matching-tip {
  margin: 0 auto 20px;
  width: 90%;
  color: #6b21a8;
  line-height: 1.5;
}

.matching-progress {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
}

.progress-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #a78bfa;
  opacity: 0.3;
  animation: dotPulse 1.2s ease-in-out infinite;
}

.matching-cancel-btn {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  
  .el-button {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(139, 92, 246, 0.3);
    color: #6b21a8;
    font-weight: 500;
    padding: 10px 24px;
    
    &:hover {
      background: rgba(255, 255, 255, 1);
      border-color: rgba(139, 92, 246, 0.5);
      color: #4c1d95;
    }
  }
}

@keyframes orbitPulse {
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
}

@keyframes dotPulse {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

@keyframes floatAvatar {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes sparkMove {
  0% {
    transform: translate(-60px, -40px) scale(0.8);
  }
  50% {
    transform: translate(50px, 30px) scale(1.2);
  }
  100% {
    transform: translate(-60px, -40px) scale(0.8);
  }
}

@media (max-width: 768px) {
  .soul-match-page {
    padding: 16px 12px 32px;
  }

  .matching-state {
    max-width: 320px;
  }
}
</style>
