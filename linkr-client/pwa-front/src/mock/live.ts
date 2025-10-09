import type { LiveRoom, LiveMessage, Gift } from '@/types/live'

export const mockLiveRooms: LiveRoom[] = [
  {
    id: '1',
    title: '游戏直播：王者荣耀上分',
    description: '今天带大家上王者，欢迎观看',
    cover: 'https://picsum.photos/400/300?random=601',
    streamUrl: 'rtmp://live.example.com/stream1',
    hostId: '2',
    hostName: '小明',
    hostAvatar: 'https://picsum.photos/200/200?random=2',
    category: '游戏',
    tags: ['王者荣耀', '上分', '游戏'],
    viewerCount: 1250,
    likeCount: 8900,
    isLive: true,
    startTime: '2024-01-15T19:00:00Z',
    quality: 'HD'
  },
  {
    id: '2',
    title: '美食制作：家常菜教学',
    description: '教你做几道简单的家常菜',
    cover: 'https://picsum.photos/400/300?random=602',
    streamUrl: 'rtmp://live.example.com/stream2',
    hostId: '3',
    hostName: '小红',
    hostAvatar: 'https://picsum.photos/200/200?random=3',
    category: '美食',
    tags: ['美食', '烹饪', '教学'],
    viewerCount: 856,
    likeCount: 5600,
    isLive: true,
    startTime: '2024-01-15T18:30:00Z',
    quality: 'HD'
  },
  {
    id: '3',
    title: '音乐分享：民谣专场',
    description: '分享好听的民谣歌曲',
    cover: 'https://picsum.photos/400/300?random=603',
    streamUrl: 'rtmp://live.example.com/stream3',
    hostId: '4',
    hostName: '小李',
    hostAvatar: 'https://picsum.photos/200/200?random=4',
    category: '音乐',
    tags: ['音乐', '民谣', '分享'],
    viewerCount: 642,
    likeCount: 3200,
    isLive: true,
    startTime: '2024-01-15T20:00:00Z',
    quality: 'SD'
  }
]

export const mockLiveMessages: LiveMessage[] = [
  {
    id: '1',
    roomId: '1',
    userId: '5',
    username: '观众1',
    avatar: 'https://picsum.photos/200/200?random=5',
    content: '主播技术真棒！',
    type: 'text',
    timestamp: '2024-01-15T19:05:00Z'
  },
  {
    id: '2',
    roomId: '1',
    userId: '6',
    username: '观众2',
    avatar: 'https://picsum.photos/200/200?random=6',
    content: '666',
    type: 'text',
    timestamp: '2024-01-15T19:06:00Z'
  },
  {
    id: '3',
    roomId: '1',
    userId: '7',
    username: '观众3',
    avatar: 'https://picsum.photos/200/200?random=7',
    content: '',
    type: 'gift',
    timestamp: '2024-01-15T19:07:00Z',
    giftInfo: {
      name: '玫瑰花',
      price: 10,
      count: 5
    }
  }
]

export const mockGifts: Gift[] = [
  {
    id: '1',
    name: '玫瑰花',
    price: 10,
    image: 'https://picsum.photos/100/100?random=701',
    animation: 'rose',
    category: '浪漫'
  },
  {
    id: '2',
    name: '跑车',
    price: 100,
    image: 'https://picsum.photos/100/100?random=702',
    animation: 'car',
    category: '豪华'
  },
  {
    id: '3',
    name: '火箭',
    price: 1000,
    image: 'https://picsum.photos/100/100?random=703',
    animation: 'rocket',
    category: '超级'
  }
]
