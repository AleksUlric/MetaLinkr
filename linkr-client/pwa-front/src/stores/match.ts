import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MatchResult, MatchUser } from '@/types/match'
import {
  fetchSoulRecommendations,
  fetchSoulMatchResults,
  likeSoulUser as likeSoulUserApi,
  passSoulUser,
  type SoulMatchUserResponse,
  type MatchResultResponse
} from '@/services/soulMatch'

const fallbackDistance = () => Math.round((4 + Math.random() * 6) * 10) / 10

const mapUser = (user: SoulMatchUserResponse): MatchUser => ({
  id: user.id,
  name: user.name ?? '灵犀星友',
  age: user.age ?? null,
  avatar: user.avatar ?? null,
  photos: user.photos ?? [],
  bio: user.bio ?? '这个人有点神秘，快去聊天了解TA吧～',
  interests: user.interests ?? [],
  location: user.location ?? '灵犀星球',
  distance: user.distance ?? fallbackDistance(),
  isOnline: user.isOnline ?? user.online ?? false,
  lastActive: user.lastActiveTimestamp ?? Date.now(),
  compatibility: user.compatibility ?? 80
})

const mapResult = (result: MatchResultResponse): MatchResult => ({
  id: result.recordId,
  userId: result.userId,
  isMatch: result.match,
  timestamp: result.timestamp ?? Date.now(),
  message: result.message,
  chatRoomId: result.chatRoomId,
  targetUser: result.targetUser ? mapUser(result.targetUser) : undefined
})

export const useMatchStore = defineStore('match', () => {
  const recommendedUsers = ref<MatchUser[]>([])
  const matchResults = ref<MatchResult[]>([])
  const currentUser = ref<MatchUser | null>(null)
  const lastMatchedUser = ref<MatchUser | null>(null)
  const isLoading = ref(false)

  const syncCurrentUser = () => {
    if (recommendedUsers.value.length > 0) {
      currentUser.value = recommendedUsers.value[0]
      return
    }
    currentUser.value = null
  }

  const getRecommendedUsers = async (limit = 10) => {
    isLoading.value = true
    try {
      const users = await fetchSoulRecommendations(limit)
      recommendedUsers.value = (users ?? []).map(mapUser)
      syncCurrentUser()
    } catch (error) {
      console.error('获取灵犀推荐失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const setLastMatchedUser = (user: MatchUser | null) => {
    lastMatchedUser.value = user
  }

  const removeFromRecommendations = (userId: number) => {
    recommendedUsers.value = recommendedUsers.value.filter((user) => user.id !== userId)
  }

  const ensureNextUser = async () => {
    if (recommendedUsers.value.length === 0) {
      currentUser.value = null
      try {
        await getRecommendedUsers()
      } catch {
        // swallow errors so UI can handle retry
      }
      return
    }
    syncCurrentUser()
  }

  const likeUser = async (userId: number, superLike = false) => {
    try {
      const action = await likeSoulUserApi(userId, superLike)
      const payload: MatchResult = action.result
        ? mapResult(action.result)
        : {
            id: Date.now(),
            userId,
            isMatch: action.match,
            timestamp: Date.now(),
            message: action.match ? '灵犀双向匹配成功' : undefined,
            chatRoomId: action.chatRoomId
          }

      if (!payload.targetUser && currentUser.value && currentUser.value.id === userId) {
        payload.targetUser = currentUser.value
      }

      matchResults.value.unshift(payload)
      removeFromRecommendations(userId)
      await ensureNextUser()

      return payload
    } catch (error) {
      console.error('喜欢用户失败:', error)
      throw error
    }
  }

  const dislikeUser = async (userId: number) => {
    try {
      await passSoulUser(userId)
      removeFromRecommendations(userId)
      await ensureNextUser()
    } catch (error) {
      console.error('跳过用户失败:', error)
      throw error
    }
  }

  const getMatchResults = async (limit = 20) => {
    try {
      const results = await fetchSoulMatchResults(limit)
      matchResults.value = (results ?? []).map(mapResult)
    } catch (error) {
      console.error('获取灵犀匹配结果失败:', error)
      throw error
    }
  }

  const initMatch = async () => {
    await Promise.all([getRecommendedUsers(), getMatchResults()])
  }

  return {
    recommendedUsers,
    matchResults,
    currentUser,
    lastMatchedUser,
    isLoading,
    getRecommendedUsers,
    likeUser,
    dislikeUser,
    getMatchResults,
    initMatch,
    setLastMatchedUser
  }
})

export type { MatchResult, MatchUser }