import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  type: 'text' | 'image' | 'voice' | 'video'
  timestamp: number
  isRead: boolean
  isFromMe: boolean
}

export interface ChatRoom {
  id: string
  name: string
  avatar: string
  lastMessage: ChatMessage | null
  unreadCount: number
  isOnline: boolean
  isGroup: boolean
  members: string[]
}

export const useChatStore = defineStore('chat', () => {
  // 聊天室列表
  const chatRooms = ref<ChatRoom[]>([])
  
  // 当前聊天室
  const currentChatRoom = ref<ChatRoom | null>(null)
  
  // 当前聊天室的消息
  const currentMessages = ref<ChatMessage[]>([])
  
  // 是否正在发送消息
  const isSending = ref(false)
  
  // 获取聊天室列表
  const getChatRooms = async () => {
    // 模拟数据
    chatRooms.value = [
      {
        id: '1',
        name: '张三',
        avatar: 'https://via.placeholder.com/50',
        lastMessage: {
          id: '1',
          senderId: '1',
          receiverId: '2',
          content: '你好！',
          type: 'text',
          timestamp: Date.now() - 1000,
          isRead: false,
          isFromMe: false
        },
        unreadCount: 2,
        isOnline: true,
        isGroup: false,
        members: ['1', '2']
      },
      {
        id: '2',
        name: '李四',
        avatar: 'https://via.placeholder.com/50',
        lastMessage: {
          id: '2',
          senderId: '2',
          receiverId: '1',
          content: '在干嘛？',
          type: 'text',
          timestamp: Date.now() - 2000,
          isRead: true,
          isFromMe: true
        },
        unreadCount: 0,
        isOnline: false,
        isGroup: false,
        members: ['2', '1']
      }
    ]
  }
  
  // 获取聊天室消息
  const getChatMessages = async (roomId: string) => {
    // 模拟数据
    currentMessages.value = [
      {
        id: '1',
        senderId: '1',
        receiverId: '2',
        content: '你好！',
        type: 'text',
        timestamp: Date.now() - 1000,
        isRead: true,
        isFromMe: false
      },
      {
        id: '2',
        senderId: '2',
        receiverId: '1',
        content: '你好，很高兴认识你！',
        type: 'text',
        timestamp: Date.now() - 500,
        isRead: true,
        isFromMe: true
      }
    ]
  }
  
  // 发送消息
  const sendMessage = async (content: string, type: 'text' | 'image' | 'voice' | 'video' = 'text') => {
    if (!currentChatRoom.value) return
    
    isSending.value = true
    
    try {
      const message: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'current-user',
        receiverId: currentChatRoom.value.id,
        content,
        type,
        timestamp: Date.now(),
        isRead: false,
        isFromMe: true
      }
      
      // 添加到当前消息列表
      currentMessages.value.push(message)
      
      // 更新聊天室最后消息
      const room = chatRooms.value.find(r => r.id === currentChatRoom.value!.id)
      if (room) {
        room.lastMessage = message
      }
      
      // 这里应该调用API发送消息
      // await api.sendMessage(message)
      
    } catch (error) {
      console.error('发送消息失败:', error)
    } finally {
      isSending.value = false
    }
  }
  
  // 设置当前聊天室
  const setCurrentChatRoom = (room: ChatRoom) => {
    currentChatRoom.value = room
    getChatMessages(room.id)
  }
  
  // 标记消息为已读
  const markAsRead = (messageId: string) => {
    const message = currentMessages.value.find(m => m.id === messageId)
    if (message) {
      message.isRead = true
    }
  }
  
  // 初始化聊天数据
  const initChat = async () => {
    await getChatRooms()
  }
  
  return {
    // 状态
    chatRooms,
    currentChatRoom,
    currentMessages,
    isSending,
    
    // 方法
    getChatRooms,
    getChatMessages,
    sendMessage,
    setCurrentChatRoom,
    markAsRead,
    initChat
  }
})