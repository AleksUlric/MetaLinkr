import type { ShortVideo, VideoComment } from '@/types/video'

export const mockShortVideos: ShortVideo[] = [
  {
    id: '1',
    title: '可爱的小猫咪日常',
    description: '记录小猫咪的日常生活，太可爱了！',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    cover: 'https://picsum.photos/400/600?random=801',
    duration: 30,
    authorId: '3',
    authorName: '小红',
    authorAvatar: 'https://picsum.photos/200/200?random=3',
    category: '宠物',
    tags: ['宠物', '猫咪', '日常'],
    likes: 1250,
    comments: 89,
    shares: 156,
    views: 8900,
    isLiked: true,
    createdAt: '2024-01-15T10:30:00Z',
    music: {
      name: '可爱的小猫咪',
      author: '音乐人A',
      url: 'https://example.com/music/cute-cat.mp3'
    }
  },
  {
    id: '2',
    title: '美食制作教程',
    description: '简单易学的家常菜做法',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    cover: 'https://picsum.photos/400/600?random=802',
    duration: 45,
    authorId: '4',
    authorName: '小李',
    authorAvatar: 'https://picsum.photos/200/200?random=4',
    category: '美食',
    tags: ['美食', '烹饪', '教程'],
    likes: 890,
    comments: 67,
    shares: 123,
    views: 5600,
    isLiked: false,
    createdAt: '2024-01-15T09:15:00Z',
    music: {
      name: '轻松的背景音乐',
      author: '音乐人B',
      url: 'https://example.com/music/relaxing.mp3'
    }
  },
  {
    id: '3',
    title: '旅行vlog：美丽的风景',
    description: '分享旅行中的美好时光',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
    cover: 'https://picsum.photos/400/600?random=803',
    duration: 60,
    authorId: '5',
    authorName: '小张',
    authorAvatar: 'https://picsum.photos/200/200?random=5',
    category: '旅行',
    tags: ['旅行', '风景', 'vlog'],
    likes: 2100,
    comments: 145,
    shares: 289,
    views: 12800,
    isLiked: true,
    createdAt: '2024-01-14T20:45:00Z'
  }
]

export const mockVideoComments: VideoComment[] = [
  {
    id: '1',
    videoId: '1',
    userId: '6',
    username: '观众A',
    avatar: 'https://picsum.photos/200/200?random=6',
    content: '太可爱了！',
    likes: 25,
    isLiked: false,
    createdAt: '2024-01-15T11:00:00Z',
    replies: [
      {
        id: '1-1',
        videoId: '1',
        userId: '3',
        username: '小红',
        avatar: 'https://picsum.photos/200/200?random=3',
        content: '谢谢喜欢！',
        likes: 5,
        isLiked: true,
        createdAt: '2024-01-15T11:05:00Z'
      }
    ]
  },
  {
    id: '2',
    videoId: '1',
    userId: '7',
    username: '观众B',
    avatar: 'https://picsum.photos/200/200?random=7',
    content: '这是什么品种的猫？',
    likes: 12,
    isLiked: true,
    createdAt: '2024-01-15T11:30:00Z'
  }
]
