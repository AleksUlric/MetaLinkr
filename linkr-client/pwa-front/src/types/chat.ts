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