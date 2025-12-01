export interface MatchUser {
  id: number
  name: string
  age: number | null
  avatar: string | null
  photos: string[]
  bio: string | null
  interests: string[]
  location: string
  distance: number
  isOnline: boolean
  lastActive: number
  compatibility: number
  chatRoomId?: number | null
}

export interface MatchResult {
  id: number
  userId: number
  isMatch: boolean
  timestamp: number
  message?: string
  chatRoomId?: number | null
  targetUser?: MatchUser
}