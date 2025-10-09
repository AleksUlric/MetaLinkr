export interface VoiceRoom {
  id: string
  name: string
  description: string
  cover: string
  hostId: string
  hostName: string
  hostAvatar: string
  memberCount: number
  maxMembers: number
  isOnline: boolean
  category: string
  tags: string[]
  createdAt: number
}

export interface VoiceParty {
  id: string
  name: string
  description: string
  cover: string
  hostId: string
  hostName: string
  hostAvatar: string
  memberCount: number
  maxMembers: number
  isOnline: boolean
  category: string
  tags: string[]
  createdAt: number
}

export interface VoiceMember {
  id: string
  name: string
  avatar: string
  isHost: boolean
  isSpeaking: boolean
  isMuted: boolean
  joinTime: number
}