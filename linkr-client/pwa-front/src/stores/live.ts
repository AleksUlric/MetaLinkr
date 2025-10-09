import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LiveRoom, LiveMessage, Gift } from '@/types/live'
import { mockLiveRooms, mockLiveMessages, mockGifts } from '@/mock/live'

export const useLiveStore = defineStore('live', () => {
  const liveRooms = ref<LiveRoom[]>(mockLiveRooms)
  const currentRoom = ref<LiveRoom | null>(null)
  const roomMessages = ref<LiveMessage[]>([])
  const gifts = ref<Gift[]>(mockGifts)

  // 直播间相关
  const getLiveRooms = async (category?: string, page = 1, limit = 20) => {
    let filteredRooms = liveRooms.value.filter(room => room.isLive)
    
    if (category) {
      filteredRooms = filteredRooms.filter(room => room.category === category)
    }
    
    return filteredRooms.slice((page - 1) * limit, page * limit)
  }

  const getLiveRoomById = async (id: string) => {
    const room = liveRooms.value.find(r => r.id === id)
    if (room) {
      currentRoom.value = room
      roomMessages.value = mockLiveMessages.filter(m => m.roomId === id)
    }
    return room
  }

  const joinLiveRoom = async (roomId: string) => {
    const room = liveRooms.value.find(r => r.id === roomId)
    if (room) {
      room.viewerCount++
      currentRoom.value = room
      roomMessages.value = mockLiveMessages.filter(m => m.roomId === roomId)
    }
  }

  const leaveLiveRoom = async (roomId: string) => {
    const room = liveRooms.value.find(r => r.id === roomId)
    if (room && room.viewerCount > 0) {
      room.viewerCount--
    }
    
    if (currentRoom.value?.id === roomId) {
      currentRoom.value = null
      roomMessages.value = []
    }
  }

  const createLiveRoom = async (roomData: Partial<LiveRoom>) => {
    try {
      const newRoom: LiveRoom = {
        id: Date.now().toString(),
        title: roomData.title || '',
        description: roomData.description || '',
        cover: roomData.cover || '',
        streamUrl: roomData.streamUrl || '',
        hostId: '1',
        hostName: '测试用户',
        hostAvatar: 'https://picsum.photos/200/200?random=1',
        category: roomData.category || '其他',
        tags: roomData.tags || [],
        viewerCount: 0,
        likeCount: 0,
        isLive: true,
        startTime: new Date().toISOString(),
        quality: roomData.quality || 'HD'
      }
      
      liveRooms.value.unshift(newRoom)
      return { success: true, data: newRoom }
    } catch (error) {
      console.error('创建直播间失败:', error)
      return { success: false, message: '创建直播间失败' }
    }
  }

  // 消息相关
  const getRoomMessages = async (roomId: string) => {
    return roomMessages.value.filter(m => m.roomId === roomId)
  }

  const sendMessage = async (roomId: string, content: string, type: 'text' | 'gift' | 'system' = 'text', giftInfo?: any) => {
    try {
      const newMessage: LiveMessage = {
        id: Date.now().toString(),
        roomId,
        userId: '1',
        username: '测试用户',
        avatar: 'https://picsum.photos/200/200?random=1',
        content,
        type,
        timestamp: new Date().toISOString(),
        giftInfo
      }
      
      roomMessages.value.push(newMessage)
      return { success: true, data: newMessage }
    } catch (error) {
      console.error('发送消息失败:', error)
      return { success: false, message: '发送消息失败' }
    }
  }

  const sendGift = async (roomId: string, giftId: string, count = 1) => {
    try {
      const gift = gifts.value.find(g => g.id === giftId)
      if (!gift) {
        return { success: false, message: '礼物不存在' }
      }

      const giftInfo = {
        name: gift.name,
        price: gift.price,
        count
      }

      const newMessage: LiveMessage = {
        id: Date.now().toString(),
        roomId,
        userId: '1',
        username: '测试用户',
        avatar: 'https://picsum.photos/200/200?random=1',
        content: `送出了${count}个${gift.name}`,
        type: 'gift',
        timestamp: new Date().toISOString(),
        giftInfo
      }
      
      roomMessages.value.push(newMessage)
      
      // 更新直播间点赞数
      const room = liveRooms.value.find(r => r.id === roomId)
      if (room) {
        room.likeCount += gift.price * count
      }
      
      return { success: true, data: newMessage }
    } catch (error) {
      console.error('发送礼物失败:', error)
      return { success: false, message: '发送礼物失败' }
    }
  }

  const likeRoom = async (roomId: string) => {
    const room = liveRooms.value.find(r => r.id === roomId)
    if (room) {
      room.likeCount++
    }
  }

  // 礼物相关
  const getGifts = async () => {
    return gifts.value
  }

  const getGiftById = async (id: string) => {
    return gifts.value.find(g => g.id === id)
  }

  return {
    liveRooms,
    currentRoom,
    roomMessages,
    gifts,
    getLiveRooms,
    getLiveRoomById,
    joinLiveRoom,
    leaveLiveRoom,
    createLiveRoom,
    getRoomMessages,
    sendMessage,
    sendGift,
    likeRoom,
    getGifts,
    getGiftById
  }
})
