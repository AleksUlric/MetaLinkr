import { get, post } from '@/utils/request'
import type { SoulMatchUserResponse } from './soulMatch'

export interface RealtimePresencePayload {
  deviceId?: string
  platform?: string
  latitude?: number
  longitude?: number
  offline?: boolean
}

export interface RealtimeMatchRequestPayload {
  preferredGender?: string
  minAge?: number
  maxAge?: number
  maxDistanceKm?: number
  interests?: string[]
}

export interface RealtimeMatchStatusResponse {
  queued: boolean
  matched: boolean
  queuePosition: number
  waitMillis: number
  onlineCount: number
  message?: string
  chatRoomId?: number | null
  partner?: SoulMatchUserResponse | null
}

export const sendRealtimeHeartbeat = (payload?: RealtimePresencePayload) => {
  return post<RealtimeMatchStatusResponse>(
    '/api/matching/soul/realtime/heartbeat',
    payload ?? {}
  )
}

export const enqueueRealtimeMatch = (payload?: RealtimeMatchRequestPayload) => {
  return post<RealtimeMatchStatusResponse>(
    '/api/matching/soul/realtime/enqueue',
    payload ?? {}
  )
}

export const cancelRealtimeMatch = () => {
  return post<void>('/api/matching/soul/realtime/cancel')
}

