import { get, post } from '@/utils/request'

export interface SoulMatchUserResponse {
  id: number
  name: string
  age: number | null
  avatar: string | null
  photos: string[] | null
  bio: string | null
  interests: string[] | null
  location: string | null
  distance: number | null
  isOnline?: boolean
  online?: boolean
  lastActiveTimestamp: number | null
  compatibility: number | null
}

export interface MatchResultResponse {
  recordId: number
  userId: number
  match: boolean
  timestamp: number | null
  message?: string
  chatRoomId?: number | null
  targetUser?: SoulMatchUserResponse | null
}

export interface SoulMatchActionResponse {
  match: boolean
  chatRoomId?: number | null
  result?: MatchResultResponse | null
}

export const fetchSoulRecommendations = (limit = 10) => {
  return get<SoulMatchUserResponse[]>('/api/matching/soul/recommendations', {
    params: { limit }
  })
}

export const likeSoulUser = (targetUserId: number, superLike = false) => {
  return post<SoulMatchActionResponse>(
    `/api/matching/soul/${targetUserId}/like`,
    null,
    { params: { superLike } }
  )
}

export const passSoulUser = (targetUserId: number) => {
  return post<void>(`/api/matching/soul/${targetUserId}/pass`)
}

export const fetchSoulMatchResults = (limit = 20) => {
  return get<MatchResultResponse[]>('/api/matching/soul/results', {
    params: { limit }
  })
}

