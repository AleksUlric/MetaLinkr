export interface CheckInLocation {
  id: string
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  category: string
  rating: number
  visitCount: number
  images: string[]
  isVerified: boolean
  createdAt: string
}

export interface CheckInRecord {
  id: string
  userId: string
  locationId: string
  locationName: string
  locationAddress: string
  latitude: number
  longitude: number
  content: string
  images: string[]
  tags: string[]
  likes: number
  comments: number
  isPublic: boolean
  createdAt: string
}

export interface LocationBadge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requirement: string
  isUnlocked: boolean
  unlockedAt?: string
}
