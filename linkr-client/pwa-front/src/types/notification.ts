export interface Notification {
  id: string
  type: 'like' | 'match' | 'message' | 'system' | 'friend_request'
  title: string
  content: string
  avatar?: string
  isRead: boolean
  timestamp: number
  actionUrl?: string
  userId?: string
}