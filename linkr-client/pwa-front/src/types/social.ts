export interface Post {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  images: string[]
  location?: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  postId: string
  userId: string
  username: string
  avatar: string
  content: string
  likes: number
  isLiked: boolean
  createdAt: string
}

export interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  receiverId: string
  content: string
  type: 'text' | 'image' | 'voice' | 'video'
  timestamp: string
  isRead: boolean
}

export interface Chat {
  id: string
  userId: string
  username: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
}

export interface MatchUser {
  id: string
  username: string
  nickname: string
  avatar: string
  age: number
  location: string
  interests: string[]
  bio: string
  isOnline: boolean
  distance?: number
  matchScore: number
}
