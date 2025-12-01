/**
 * 聊天API服务
 */

import { get, post, put } from '@/utils/request'

export interface SendMessageRequest {
  roomId: number
  content: string
  type?: 'text' | 'image' | 'voice' | 'video' | 'system'
  fileUrl?: string
  fileSize?: number
  duration?: number
}

export interface ChatMessageResponse {
  id: number
  roomId: number
  senderId: number
  sender?: {
    id: number
    nickname: string
    avatar: string
  }
  content: string
  type: string
  fileUrl?: string
  fileSize?: number
  duration?: number
  isRead: number
  isFromMe?: boolean
  createdAt: string
}

/**
 * 发送消息
 */
export async function sendMessage(request: SendMessageRequest): Promise<ChatMessageResponse> {
  return post<ChatMessageResponse>('/api/chat/messages', request)
}

/**
 * 获取聊天室消息列表
 */
export async function getChatMessages(
  roomId: number,
  page: number = 1,
  size: number = 50
): Promise<ChatMessageResponse[]> {
  return get<ChatMessageResponse[]>('/api/chat/messages', {
    params: { roomId, page, size }
  })
}

/**
 * 标记消息为已读
 */
export async function markMessageAsRead(messageId: number): Promise<boolean> {
  return put<boolean>(`/api/chat/messages/${messageId}/read`)
}

/**
 * 标记房间所有消息为已读
 */
export async function markRoomMessagesAsRead(roomId: number): Promise<number> {
  return put<number>(`/api/chat/rooms/${roomId}/read-all`)
}

/**
 * 根据用户ID获取或创建聊天室
 */
export async function getOrCreateChatRoomByUserId(targetUserId: number): Promise<{ roomId: number }> {
  return post<{ roomId: number }>('/api/matching/soul/chat-room', { targetUserId })
}

/**
 * 聊天室响应DTO
 */
export interface ChatRoomResponse {
  id: number
  name: string
  avatar: string
  type: string
  lastMessage?: ChatMessageResponse | null
  unreadCount: number
  isOnline: boolean
  partnerId?: number
  partner?: {
    id: number
    nickname: string
    avatar: string
  }
  createdAt: string
  updatedAt: string
}

/**
 * 根据匹配记录获取聊天室列表
 */
export async function getChatRoomsByMatches(): Promise<ChatRoomResponse[]> {
  return get<ChatRoomResponse[]>('/api/matching/soul/chat-rooms')
}

