import type { User, UserProfile } from '../types/user'

export const mockUser: User = {
  id: '1',
  username: 'testuser',
  nickname: '测试用户',
  avatar: 'https://picsum.photos/200/200?random=1',
  phone: '13800138000',
  email: 'test@example.com',
  gender: 'male',
  birthday: '1995-01-01',
  location: '北京市',
  bio: '热爱生活，喜欢交友',
  level: 15,
  points: 2580,
  vipLevel: 2,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z'
}

export const mockUserProfile: UserProfile = {
  ...mockUser,
  interests: ['游戏', '音乐', '旅行', '宠物', '摄影'],
  gameAccounts: [
    {
      id: '1',
      gameName: '王者荣耀',
      gameId: 'test123',
      level: '钻石',
      rank: '钻石III',
      winRate: 65.5,
      avatar: 'https://picsum.photos/100/100?random=101'
    },
    {
      id: '2',
      gameName: '英雄联盟',
      gameId: 'test456',
      level: '黄金',
      rank: '黄金I',
      winRate: 58.2,
      avatar: 'https://picsum.photos/100/100?random=102'
    }
  ],
  pets: [
    {
      id: '1',
      name: '小白',
      type: '猫',
      breed: '英短',
      age: 2,
      avatar: 'https://picsum.photos/150/150?random=201',
      health: '健康',
      description: '活泼可爱的小猫咪'
    }
  ],
  checkInCount: 28,
  followCount: 156,
  fanCount: 89,
  postCount: 42,
  // 游戏化字段
  experience: 1250,
  achievements: ['新手', '活跃用户', '社交达人'],
  streakDays: 7,
  lastDailyReward: new Date().toDateString(),
  lastActiveDate: new Date().toDateString(),
  matches: 23,
  likes: 156,
  fans: 89,
  // 社交统计
  totalMatches: 156,
  totalLikes: 1250,
  totalFans: 890,
  // 活跃度统计
  weeklyActiveDays: 5,
  monthlyActiveDays: 22
}

export const mockRecommendedUsers = [
  {
    id: '2',
    nickname: '小明',
    avatar: 'https://picsum.photos/200/200?random=2',
    location: '上海市',
    age: 25,
    interests: ['游戏', '音乐'],
    bio: '喜欢打游戏和听音乐'
  },
  {
    id: '3',
    nickname: '小红',
    avatar: 'https://picsum.photos/200/200?random=3',
    location: '广州市',
    age: 23,
    interests: ['旅行', '摄影'],
    bio: '热爱旅行和摄影'
  },
  {
    id: '4',
    nickname: '小李',
    avatar: 'https://picsum.photos/200/200?random=4',
    location: '深圳市',
    age: 27,
    interests: ['宠物', '健身'],
    bio: '宠物爱好者，健身达人'
  }
]
