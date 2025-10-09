import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface VoiceRoom {
  id: string
  name: string
  description: string
  cover: string
  hostId: string
  hostName: string
  hostAvatar: string
  memberCount: number
  maxMembers: number
  isOnline: boolean
  category: string
  tags: string[]
  createdAt: number
}

export interface VoiceParty {
  id: string
  name: string
  description: string
  cover: string
  hostId: string
  hostName: string
  hostAvatar: string
  memberCount: number
  maxMembers: number
  isOnline: boolean
  category: string
  tags: string[]
  createdAt: number
}

export interface VoiceMember {
  id: string
  name: string
  avatar: string
  isHost: boolean
  isSpeaking: boolean
  isMuted: boolean
  joinTime: number
}

export const useVoiceStore = defineStore('voice', () => {
  // 语音房间列表
  const voiceRooms = ref<VoiceRoom[]>([])
  
  // 语音派对列表
  const voiceParties = ref<VoiceParty[]>([])
  
  // 当前房间
  const currentRoom = ref<VoiceRoom | null>(null)
  
  // 当前房间成员
  const currentMembers = ref<VoiceMember[]>([])
  
  // 是否正在录音
  const isRecording = ref(false)
  
  // 是否静音
  const isMuted = ref(false)
  
  // 是否正在加载
  const isLoading = ref(false)
  
  // 获取语音房间列表
  const getVoiceRooms = async () => {
    isLoading.value = true
    
    try {
      // 模拟数据
      voiceRooms.value = [
        {
          id: '1',
          name: '深夜聊天室',
          description: '夜深人静，聊聊心事',
          cover: 'https://via.placeholder.com/300x200',
          hostId: '1',
          hostName: '小雨',
          hostAvatar: 'https://via.placeholder.com/50',
          memberCount: 15,
          maxMembers: 50,
          isOnline: true,
          category: '聊天',
          tags: ['深夜', '聊天', '情感'],
          createdAt: Date.now() - 3600000
        },
        {
          id: '2',
          name: '音乐分享',
          description: '分享你喜欢的音乐',
          cover: 'https://via.placeholder.com/300x200',
          hostId: '2',
          hostName: '阳光',
          hostAvatar: 'https://via.placeholder.com/50',
          memberCount: 8,
          maxMembers: 30,
          isOnline: true,
          category: '音乐',
          tags: ['音乐', '分享', '娱乐'],
          createdAt: Date.now() - 1800000
        }
      ]
      
    } catch (error) {
      console.error('获取语音房间失败:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  // 获取语音派对列表
  const getVoiceParties = async () => {
    try {
      // 模拟数据
      voiceParties.value = [
        {
          id: '1',
          name: '游戏语音派对',
          description: '一起玩游戏，语音交流',
          cover: 'https://via.placeholder.com/300x200',
          hostId: '1',
          hostName: '游戏达人',
          hostAvatar: 'https://via.placeholder.com/50',
          memberCount: 12,
          maxMembers: 20,
          isOnline: true,
          category: '游戏',
          tags: ['游戏', '语音', '娱乐'],
          createdAt: Date.now() - 1800000
        }
      ]
      
    } catch (error) {
      console.error('获取语音派对失败:', error)
    }
  }
  
  // 加入语音房间
  const joinVoiceRoom = async (roomId: string) => {
    try {
      const room = voiceRooms.value.find(r => r.id === roomId)
      if (room) {
        currentRoom.value = room
        
        // 模拟获取房间成员
        currentMembers.value = [
          {
            id: '1',
            name: '小雨',
            avatar: 'https://via.placeholder.com/50',
            isHost: true,
            isSpeaking: false,
            isMuted: false,
            joinTime: Date.now() - 3600000
          },
          {
            id: '2',
            name: '阳光',
            avatar: 'https://via.placeholder.com/50',
            isHost: false,
            isSpeaking: true,
            isMuted: false,
            joinTime: Date.now() - 1800000
          }
        ]
        
        // 更新房间成员数
        room.memberCount++
      }
      
    } catch (error) {
      console.error('加入语音房间失败:', error)
      throw error
    }
  }
  
  // 离开语音房间
  const leaveVoiceRoom = () => {
    if (currentRoom.value) {
      // 更新房间成员数
      const room = voiceRooms.value.find(r => r.id === currentRoom.value!.id)
      if (room) {
        room.memberCount--
      }
    }
    
    currentRoom.value = null
    currentMembers.value = []
    isRecording.value = false
    isMuted.value = false
  }
  
  // 开始录音
  const startRecording = () => {
    isRecording.value = true
  }
  
  // 停止录音
  const stopRecording = () => {
    isRecording.value = false
  }
  
  // 切换静音
  const toggleMute = () => {
    isMuted.value = !isMuted.value
  }
  
  // 初始化语音数据
  const initVoice = async () => {
    await Promise.all([
      getVoiceRooms(),
      getVoiceParties()
    ])
  }
  
  return {
    // 状态
    voiceRooms,
    voiceParties,
    currentRoom,
    currentMembers,
    isRecording,
    isMuted,
    isLoading,
    
    // 方法
    getVoiceRooms,
    getVoiceParties,
    joinVoiceRoom,
    leaveVoiceRoom,
    startRecording,
    stopRecording,
    toggleMute,
    initVoice
  }
})