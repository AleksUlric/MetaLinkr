import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { API_BASE_URL } from '@/utils/request'
import * as chatApi from '@/services/chat'
import type { ChatMessageResponse } from '@/services/chat'
import { useUserStore } from './user'

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  type: 'text' | 'image' | 'voice' | 'video' | 'system'
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
  const userStore = useUserStore()

  // 聊天室列表
  const chatRooms = ref<ChatRoom[]>([])
  
  // 当前聊天室
  const currentChatRoom = ref<ChatRoom | null>(null)
  
  // 当前聊天室的消息
  const currentMessages = ref<ChatMessage[]>([])
  
  // 是否正在发送消息
  const isSending = ref(false)

  // WebSocket 状态
  const stompClient = ref<Client | null>(null)
  const roomSubscription = ref<StompSubscription | null>(null)
  const isSocketConnected = ref(false)
  const pendingRoomId = ref<string | null>(null)
  const subscribedRoomId = ref<string | null>(null)

  const getCurrentUserId = () => {
    const id = userStore.user?.id
    return typeof id === 'number' ? id.toString() : undefined
  }

  // 将后端消息格式转换为前端格式
  const convertMessageFromApi = (msg: ChatMessageResponse, roomId: string): ChatMessage => {
    const currentUserId = getCurrentUserId()
    const computedIsFromMe =
      typeof msg.isFromMe === 'boolean'
        ? msg.isFromMe
        : (currentUserId ? msg.senderId?.toString() === currentUserId : false)

    return {
      id: msg.id.toString(),
      senderId: msg.senderId.toString(),
      receiverId: roomId,
      content: msg.content,
      type: (msg.type as ChatMessage['type']) || 'text',
      timestamp: new Date(msg.createdAt).getTime(),
      isRead: msg.isRead === 1,
      isFromMe: computedIsFromMe
    }
  }

  const handleIncomingMessage = (rawMessage: IMessage) => {
    try {
      const payload: ChatMessageResponse = JSON.parse(rawMessage.body)
      const roomId = payload.roomId?.toString()
      if (!roomId) {
        return
      }
      const normalized = convertMessageFromApi(payload, roomId)
      const exists = currentMessages.value.some(msg => msg.id === normalized.id)
      const targetRoom = chatRooms.value.find(room => room.id === roomId)

      if (currentChatRoom.value && currentChatRoom.value.id === roomId) {
        if (!exists) {
          currentMessages.value.push(normalized)
        }
        if (targetRoom) {
          targetRoom.lastMessage = normalized
          targetRoom.unreadCount = 0
        }
        if (!normalized.isFromMe) {
          const roomIdNum = Number(roomId)
          if (!Number.isNaN(roomIdNum)) {
            chatApi.markRoomMessagesAsRead(roomIdNum).catch(() => {
              // 忽略读取失败
            })
          }
        }
      } else if (targetRoom) {
        if (!normalized.isFromMe) {
          targetRoom.unreadCount = (targetRoom.unreadCount || 0) + 1
        }
        targetRoom.lastMessage = normalized
      } else {
        chatRooms.value.push({
          id: roomId,
          name: payload.sender?.nickname || '新聊天',
          avatar: payload.sender?.avatar || '',
          lastMessage: normalized,
          unreadCount: normalized.isFromMe ? 0 : 1,
          isOnline: false,
          isGroup: false,
          members: payload.senderId ? [payload.senderId.toString()] : []
        })
      }
    } catch (error) {
      console.error('[ChatStore] 解析实时消息失败:', error)
    }
  }

  const connectSocket = () => {
    if (stompClient.value) {
      if (!stompClient.value.active) {
        stompClient.value.activate()
      }
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
      debug: import.meta.env.DEV ? (message) => console.log('[ChatWS]', message) : undefined
    })

    client.onConnect = () => {
      isSocketConnected.value = true
      const targetRoomId = pendingRoomId.value || currentChatRoom.value?.id
      if (targetRoomId) {
        subscribeToRoom(targetRoomId, true)
      }
    }

    client.onDisconnect = () => {
      isSocketConnected.value = false
    }

    client.onStompError = (frame) => {
      console.error('[ChatStore] WebSocket STOMP 错误:', frame.headers['message'], frame.body)
    }

    client.onWebSocketError = (event) => {
      console.error('[ChatStore] WebSocket 连接错误:', event)
    }

    stompClient.value = client
    client.activate()
  }

  const subscribeToRoom = (roomId: string, force = false) => {
    if (!roomId) {
      return
    }
    pendingRoomId.value = roomId

    if (!stompClient.value) {
      connectSocket()
    }

    if (!stompClient.value?.connected) {
      return
    }

    if (!force && roomSubscription.value && subscribedRoomId.value === roomId) {
      return
    }

    if (roomSubscription.value) {
      roomSubscription.value.unsubscribe()
    }
    roomSubscription.value = null
    subscribedRoomId.value = null
    roomSubscription.value = stompClient.value.subscribe(`/topic/chat/${roomId}`, handleIncomingMessage)
    subscribedRoomId.value = roomId
    pendingRoomId.value = null
  }
  
  // 获取聊天室列表（基于匹配记录）
  const getChatRooms = async () => {
    try {
      console.log('[ChatStore] 获取聊天室列表（基于匹配记录）')
      const rooms = await chatApi.getChatRoomsByMatches()
      
      // 转换为前端格式
      chatRooms.value = rooms.map(room => {
        // 转换最后一条消息
        let lastMessage: ChatMessage | null = null
        if (room.lastMessage) {
          lastMessage = {
            id: room.lastMessage.id.toString(),
            senderId: room.lastMessage.senderId.toString(),
            receiverId: room.partnerId?.toString() || '',
            content: room.lastMessage.content,
            type: room.lastMessage.type as 'text' | 'image' | 'voice' | 'video' | 'system',
            timestamp: new Date(room.lastMessage.createdAt).getTime(),
            isRead: room.lastMessage.isRead === 1,
            isFromMe: room.lastMessage.isFromMe
          }
        }
        
        return {
          id: room.id.toString(),
          name: room.name,
          avatar: room.avatar,
          lastMessage,
          unreadCount: room.unreadCount || 0,
          isOnline: room.isOnline || false,
          isGroup: room.type === 'group',
          members: room.partnerId ? [room.partnerId.toString()] : []
        }
      })
      
      console.log('[ChatStore] 成功获取聊天室列表，数量:', chatRooms.value.length)
    } catch (error) {
      console.error('[ChatStore] 获取聊天室列表失败:', error)
      chatRooms.value = []
    }
  }
  
  // 获取聊天室消息
  const getChatMessages = async (roomId: string) => {
    try {
      const roomIdNum = Number(roomId)
      if (isNaN(roomIdNum)) {
        console.error('无效的房间ID:', roomId)
        currentMessages.value = []
        return
      }

      // 调用后端API获取消息
      const messages = await chatApi.getChatMessages(roomIdNum, 1, 50)
      
      // 转换为前端格式
      currentMessages.value = messages.map(msg => convertMessageFromApi(msg, roomId))
      
      // 标记房间消息为已读
      await chatApi.markRoomMessagesAsRead(roomIdNum)
      
    } catch (error) {
      console.error('获取消息列表失败:', error)
      currentMessages.value = []
    }
  }
  
  
  // 发送消息
  const sendMessage = async (content: string, type: 'text' | 'image' | 'voice' | 'video' = 'text') => {
    const trimmedContent = content.trim()
    if (!trimmedContent) {
      return { success: false, error: '请输入想发送的内容' }
    }

    if (!currentChatRoom.value) {
      return { success: false, error: '聊天通道尚未建立，请稍后重试' }
    }
    
    console.log('[ChatStore] sendMessage:', { 
      roomId: currentChatRoom.value.id, 
      roomIdType: typeof currentChatRoom.value.id,
      content: trimmedContent.substring(0, 20) + '...'
    })
    
    isSending.value = true
    
    try {
      const roomIdNum = Number(currentChatRoom.value.id)
      if (isNaN(roomIdNum) || roomIdNum <= 0) {
        console.error('[ChatStore] 无效的房间ID:', currentChatRoom.value.id, '转换为数字:', roomIdNum)
        // 尝试重新获取聊天室
        const userId = currentChatRoom.value.members?.[0]
        if (userId) {
          try {
            const newRoom = await getOrCreateChatRoom(
              userId,
              currentChatRoom.value.name,
              currentChatRoom.value.avatar,
              currentChatRoom.value.isOnline
            )
            currentChatRoom.value = newRoom
            const newRoomIdNum = Number(newRoom.id)
            if (isNaN(newRoomIdNum) || newRoomIdNum <= 0) {
              throw new Error('无法获取有效的房间ID')
            }
            
            // 使用新的房间ID发送消息
            const response = await chatApi.sendMessage({
              roomId: newRoomIdNum,
              content: trimmedContent,
              type: type as 'text' | 'image' | 'voice' | 'video' | 'system'
            })
            
            const message = convertMessageFromApi(response, newRoom.id)
            currentMessages.value.push(message)
            
            const room = chatRooms.value.find(r => r.id === newRoom.id)
            if (room) {
              room.lastMessage = message
            }
            
            return { success: true, message }
          } catch (retryError: any) {
            throw new Error(`无法获取聊天室: ${retryError.message || '未知错误'}`)
          }
        } else {
          throw new Error('无效的房间ID，且无法重新获取聊天室')
        }
      }

      const payload: chatApi.SendMessageRequest = {
        roomId: roomIdNum,
        content: trimmedContent,
        type: type as chatApi.SendMessageRequest['type']
      }

      // 优先通过 WebSocket 发送，实现实时广播
      connectSocket()
      if (stompClient.value?.connected) {
        stompClient.value.publish({
          destination: '/app/chat/send',
          body: JSON.stringify(payload)
        })
        return { success: true }
      }

      // 如果实时通道尚未建立，则回退为 HTTP 发送，避免阻塞
      const response = await chatApi.sendMessage(payload)
      
      // 转换为前端格式
      const message = convertMessageFromApi(response, currentChatRoom.value.id)
      
      // 添加到当前消息列表
      currentMessages.value.push(message)
      
      // 更新聊天室最后消息
      const room = chatRooms.value.find(r => r.id === currentChatRoom.value!.id)
      if (room) {
        room.lastMessage = message
      }
      
      return { success: true, message }
    } catch (error: any) {
      console.error('发送消息失败:', error)
      return { success: false, error: error.message || '发送消息失败' }
    } finally {
      isSending.value = false
    }
  }
  
  // 设置当前聊天室
  const setCurrentChatRoom = (room: ChatRoom) => {
    currentChatRoom.value = room
    getChatMessages(room.id)
    subscribeToRoom(room.id)
  }
  
  // 创建或获取聊天室
  const getOrCreateChatRoom = async (
    userId: string | number,
    userName: string,
    userAvatar: string,
    isOnline: boolean = false,
    chatRoomId?: number | null
  ): Promise<ChatRoom> => {
    let roomId: string
    let roomIdNum: number
    
    console.log('[ChatStore] getOrCreateChatRoom:', { userId, userName, chatRoomId })
    
    // 如果提供了 chatRoomId，使用它
    if (chatRoomId) {
      roomIdNum = chatRoomId
      roomId = chatRoomId.toString()
      console.log('[ChatStore] 使用提供的 chatRoomId:', roomId)
    } else {
      // 尝试从后端获取或创建聊天室
      const userIdNum = typeof userId === 'string' ? Number(userId) : userId
      if (isNaN(userIdNum)) {
        console.error('[ChatStore] 无效的用户ID:', userId)
        throw new Error(`无效的用户ID: ${userId}`)
      }
      
      try {
        console.log('[ChatStore] 从后端获取或创建聊天室，userId:', userIdNum)
        const response = await chatApi.getOrCreateChatRoomByUserId(userIdNum)
        roomIdNum = response.roomId
        roomId = response.roomId.toString()
        console.log('[ChatStore] 成功获取聊天室，roomId:', roomId)
      } catch (error) {
        console.error('[ChatStore] 获取聊天室失败:', error)
        // 如果获取失败，抛出错误而不是使用临时ID
        throw new Error(`无法获取聊天室: ${error instanceof Error ? error.message : '未知错误'}`)
      }
    }
    
    // 验证 roomId 是有效的数字
    if (isNaN(roomIdNum) || roomIdNum <= 0) {
      console.error('[ChatStore] 无效的房间ID:', roomId, 'roomIdNum:', roomIdNum)
      throw new Error(`无效的房间ID: ${roomId}`)
    }
    
    let room = chatRooms.value.find(r => r.id === roomId && !r.isGroup)
    
    if (!room) {
      console.log('[ChatStore] 创建新的聊天室对象:', roomId)
      room = {
        id: roomId,
        name: userName,
        avatar: userAvatar,
        lastMessage: null,
        unreadCount: 0,
        isOnline,
        isGroup: false,
        members: [userId.toString()]
      }
      chatRooms.value.push(room)
    } else {
      console.log('[ChatStore] 更新现有聊天室:', roomId)
      // 更新在线状态和头像
      room.isOnline = isOnline
      room.avatar = userAvatar
      room.name = userName
    }
    
    return room
  }
  
  // 标记消息为已读
  const markAsRead = async (messageId: string) => {
    try {
      const messageIdNum = Number(messageId)
      if (isNaN(messageIdNum)) {
        console.error('无效的消息ID:', messageId)
        return
      }

      // 调用后端API标记已读
      await chatApi.markMessageAsRead(messageIdNum)
      
      // 更新本地状态
      const message = currentMessages.value.find(m => m.id === messageId)
      if (message) {
        message.isRead = true
      }
    } catch (error) {
      console.error('标记消息已读失败:', error)
    }
  }
  
  // 初始化聊天数据
  const initChat = async () => {
    connectSocket()
    await getChatRooms()
    if (currentChatRoom.value) {
      subscribeToRoom(currentChatRoom.value.id)
    }
  }
  
  return {
    // 状态
    chatRooms,
    currentChatRoom,
    currentMessages,
    isSending,
    isSocketConnected,
    
    // 方法
    getChatRooms,
    getChatMessages,
    sendMessage,
    setCurrentChatRoom,
    getOrCreateChatRoom,
    markAsRead,
    initChat
  }
})