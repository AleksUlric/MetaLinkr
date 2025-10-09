import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Post, Comment, Chat, ChatMessage, MatchUser } from '@/types/social'
import { mockPosts, mockComments, mockChats, mockMessages, mockMatchUsers } from '@/mock/social'

export const useSocialStore = defineStore('social', () => {
  const posts = ref<Post[]>(mockPosts)
  const comments = ref<Comment[]>(mockComments)
  const chats = ref<Chat[]>(mockChats)
  const messages = ref<ChatMessage[]>(mockMessages)
  const matchUsers = ref<MatchUser[]>(mockMatchUsers)
  const currentChatId = ref<string | null>(null)

  // 动态相关
  const getPosts = async (page = 1, limit = 10) => {
    // 这里应该调用API获取动态
    return posts.value.slice((page - 1) * limit, page * limit)
  }

  const createPost = async (postData: Partial<Post>) => {
    try {
      // 这里应该调用API创建动态
      const newPost: Post = {
        id: Date.now().toString(),
        userId: '1',
        username: '测试用户',
        avatar: 'https://picsum.photos/200/200?random=1',
        content: postData.content || '',
        images: postData.images || [],
        location: postData.location,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      posts.value.unshift(newPost)
      return { success: true, data: newPost }
    } catch (error) {
      console.error('创建动态失败:', error)
      return { success: false, message: '创建动态失败' }
    }
  }

  const likePost = async (postId: string) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      if (post.isLiked) {
        post.likes--
        post.isLiked = false
      } else {
        post.likes++
        post.isLiked = true
      }
    }
  }

  const getComments = async (postId: string) => {
    return comments.value.filter(c => c.postId === postId)
  }

  const addComment = async (postId: string, content: string) => {
    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        postId,
        userId: '1',
        username: '测试用户',
        avatar: 'https://picsum.photos/200/200?random=1',
        content,
        likes: 0,
        isLiked: false,
        createdAt: new Date().toISOString()
      }
      
      comments.value.push(newComment)
      
      // 更新动态评论数
      const post = posts.value.find(p => p.id === postId)
      if (post) {
        post.comments++
      }
      
      return { success: true, data: newComment }
    } catch (error) {
      console.error('添加评论失败:', error)
      return { success: false, message: '添加评论失败' }
    }
  }

  // 聊天相关
  const getChats = async () => {
    return chats.value
  }

  const getChatMessages = async (chatId: string) => {
    return messages.value.filter(m => m.chatId === chatId)
  }

  const sendMessage = async (chatId: string, content: string, type: 'text' | 'image' | 'voice' | 'video' = 'text') => {
    try {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        chatId,
        senderId: '1',
        receiverId: chatId,
        content,
        type,
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      messages.value.push(newMessage)
      
      // 更新聊天记录
      const chat = chats.value.find(c => c.id === chatId)
      if (chat) {
        chat.lastMessage = content
        chat.lastMessageTime = new Date().toISOString()
      }
      
      return { success: true, data: newMessage }
    } catch (error) {
      console.error('发送消息失败:', error)
      return { success: false, message: '发送消息失败' }
    }
  }

  const markMessagesAsRead = (chatId: string) => {
    const chat = chats.value.find(c => c.id === chatId)
    if (chat) {
      chat.unreadCount = 0
    }
    
    messages.value.forEach(message => {
      if (message.chatId === chatId && message.receiverId === '1') {
        message.isRead = true
      }
    })
  }

  // 匹配相关
  const getMatchUsers = async () => {
    return matchUsers.value
  }

  const likeUser = async (userId: string) => {
    // 这里应该调用API喜欢用户
    console.log('喜欢用户:', userId)
    return { success: true }
  }

  const dislikeUser = async (userId: string) => {
    // 这里应该调用API不喜欢用户
    console.log('不喜欢用户:', userId)
    return { success: true }
  }

  const superLikeUser = async (userId: string) => {
    // 这里应该调用API超级喜欢用户
    console.log('超级喜欢用户:', userId)
    return { success: true }
  }

  return {
    posts,
    comments,
    chats,
    messages,
    matchUsers,
    currentChatId,
    getPosts,
    createPost,
    likePost,
    getComments,
    addComment,
    getChats,
    getChatMessages,
    sendMessage,
    markMessagesAsRead,
    getMatchUsers,
    likeUser,
    dislikeUser,
    superLikeUser
  }
})
