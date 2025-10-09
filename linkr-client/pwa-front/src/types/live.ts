export interface LiveRoom {
  id: string
  title: string
  description: string
  cover: string
  streamUrl: string
  hostId: string
  hostName: string
  hostAvatar: string
  category: string
  tags: string[]
  viewerCount: number
  likeCount: number
  isLive: boolean
  startTime: string
  endTime?: string
  quality: 'HD' | 'SD' | '4K'
}

export interface LiveMessage {
  id: string
  roomId: string
  userId: string
  username: string
  avatar: string
  content: string
  type: 'text' | 'gift' | 'system'
  timestamp: string
  giftInfo?: {
    name: string
    price: number
    count: number
  }
}

export interface Gift {
  id: string
  name: string
  price: number
  image: string
  animation: string
  category: string
}
