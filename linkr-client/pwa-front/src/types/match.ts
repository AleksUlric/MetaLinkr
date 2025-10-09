export interface MatchUser {
  id: string
  name: string
  age: number
  avatar: string
  photos: string[]
  bio: string
  interests: string[]
  location: string
  distance: number
  isOnline: boolean
  lastActive: number
}

export interface MatchResult {
  id: string
  userId: string
  isMatch: boolean
  timestamp: number
  message?: string
}