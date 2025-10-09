export interface ShortVideo {
  id: string
  title: string
  description: string
  videoUrl: string
  cover: string
  duration: number
  authorId: string
  authorName: string
  authorAvatar: string
  category: string
  tags: string[]
  likes: number
  comments: number
  shares: number
  views: number
  isLiked: boolean
  createdAt: string
  music?: {
    name: string
    author: string
    url: string
  }
}

export interface VideoComment {
  id: string
  videoId: string
  userId: string
  username: string
  avatar: string
  content: string
  likes: number
  isLiked: boolean
  createdAt: string
  replies?: VideoComment[]
}
