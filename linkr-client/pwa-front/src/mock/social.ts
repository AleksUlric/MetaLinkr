import type { Post, Comment, Chat, ChatMessage, MatchUser } from '@/types/social'

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '2',
    username: '小明',
    avatar: 'https://picsum.photos/200/200?random=2',
    content: '今天天气真好，出去走走~ #生活 #美好',
    images: [
      'https://picsum.photos/400/300?random=301',
      'https://picsum.photos/400/300?random=302'
    ],
    location: '北京市朝阳区',
    likes: 25,
    comments: 8,
    shares: 3,
    isLiked: false,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    userId: '3',
    username: '小红',
    avatar: 'https://picsum.photos/200/200?random=3',
    content: '新买的小猫咪太可爱了！',
    images: [
      'https://picsum.photos/400/400?random=303'
    ],
    likes: 42,
    comments: 15,
    shares: 7,
    isLiked: true,
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    userId: '4',
    username: '小李',
    avatar: 'https://picsum.photos/200/200?random=4',
    content: '周末和朋友一起打游戏，太爽了！',
    images: [],
    location: '上海市',
    likes: 18,
    comments: 5,
    shares: 2,
    isLiked: false,
    createdAt: '2024-01-14T20:45:00Z',
    updatedAt: '2024-01-14T20:45:00Z'
  }
]

export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    userId: '5',
    username: '小张',
    avatar: 'https://picsum.photos/200/200?random=5',
    content: '确实天气不错！',
    likes: 3,
    isLiked: false,
    createdAt: '2024-01-15T11:00:00Z'
  },
  {
    id: '2',
    postId: '1',
    userId: '6',
    username: '小王',
    avatar: 'https://picsum.photos/200/200?random=6',
    content: '羡慕了，我也想去',
    likes: 1,
    isLiked: true,
    createdAt: '2024-01-15T11:30:00Z'
  }
]

export const mockChats: Chat[] = [
  {
    id: '1',
    userId: '2',
    username: '小明',
    avatar: 'https://picsum.photos/200/200?random=2',
    lastMessage: '你好，很高兴认识你！',
    lastMessageTime: '2024-01-15T11:30:00Z',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    userId: '3',
    username: '小红',
    avatar: 'https://picsum.photos/200/200?random=3',
    lastMessage: '好的，明天见！',
    lastMessageTime: '2024-01-15T10:15:00Z',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '3',
    userId: '4',
    username: '小李',
    avatar: 'https://picsum.photos/200/200?random=4',
    lastMessage: '这个游戏真好玩',
    lastMessageTime: '2024-01-14T20:50:00Z',
    unreadCount: 1,
    isOnline: true
  }
]

export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    chatId: '1',
    senderId: '2',
    receiverId: '1',
    content: '你好，很高兴认识你！',
    type: 'text',
    timestamp: '2024-01-15T11:25:00Z',
    isRead: true
  },
  {
    id: '2',
    chatId: '1',
    senderId: '1',
    receiverId: '2',
    content: '你好！我也很高兴认识你',
    type: 'text',
    timestamp: '2024-01-15T11:26:00Z',
    isRead: true
  },
  {
    id: '3',
    chatId: '1',
    senderId: '2',
    receiverId: '1',
    content: '你是做什么工作的？',
    type: 'text',
    timestamp: '2024-01-15T11:28:00Z',
    isRead: false
  }
]

export const mockMatchUsers: MatchUser[] = [
  {
    id: '2',
    username: 'xiaoming',
    nickname: '小明',
    avatar: 'https://picsum.photos/200/200?random=2',
    age: 25,
    location: '上海市',
    interests: ['游戏', '音乐', '旅行'],
    bio: '喜欢打游戏和听音乐，希望能找到志同道合的朋友',
    isOnline: true,
    distance: 15.2,
    matchScore: 85
  },
  {
    id: '3',
    username: 'xiaohong',
    nickname: '小红',
    avatar: 'https://picsum.photos/200/200?random=3',
    age: 23,
    location: '广州市',
    interests: ['旅行', '摄影', '宠物'],
    bio: '热爱旅行和摄影，家有可爱的小猫咪',
    isOnline: false,
    distance: 28.5,
    matchScore: 78
  },
  {
    id: '4',
    username: 'xiaoli',
    nickname: '小李',
    avatar: 'https://picsum.photos/200/200?random=4',
    age: 27,
    location: '深圳市',
    interests: ['宠物', '健身', '美食'],
    bio: '宠物爱好者，健身达人，喜欢尝试各种美食',
    isOnline: true,
    distance: 35.8,
    matchScore: 72
  }
]
