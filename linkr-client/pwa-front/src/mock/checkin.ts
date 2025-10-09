import type { CheckInLocation, CheckInRecord, LocationBadge } from '@/types/checkin'

export const mockCheckInLocations: CheckInLocation[] = [
  {
    id: '1',
    name: '天安门广场',
    description: '中华人民共和国首都北京的城市中心广场',
    address: '北京市东城区东长安街',
    latitude: 39.9042,
    longitude: 116.4074,
    category: '地标建筑',
    rating: 4.8,
    visitCount: 125000,
    images: [
      'https://picsum.photos/400/300?random=1301',
      'https://picsum.photos/400/300?random=1302'
    ],
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '外滩',
    description: '上海最著名的旅游景点之一',
    address: '上海市黄浦区中山东一路',
    latitude: 31.2397,
    longitude: 121.4999,
    category: '旅游景点',
    rating: 4.7,
    visitCount: 89000,
    images: [
      'https://picsum.photos/400/300?random=1303'
    ],
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: '星巴克咖啡店',
    description: '环境优雅的咖啡店',
    address: '北京市朝阳区三里屯太古里',
    latitude: 39.9378,
    longitude: 116.4447,
    category: '餐饮',
    rating: 4.3,
    visitCount: 5600,
    images: [
      'https://picsum.photos/400/300?random=1304'
    ],
    isVerified: false,
    createdAt: '2024-01-01T00:00:00Z'
  }
]

export const mockCheckInRecords: CheckInRecord[] = [
  {
    id: '1',
    userId: '1',
    locationId: '1',
    locationName: '天安门广场',
    locationAddress: '北京市东城区东长安街',
    latitude: 39.9042,
    longitude: 116.4074,
    content: '今天天气真好，来天安门广场走走',
    images: [
      'https://picsum.photos/400/300?random=1401'
    ],
    tags: ['旅游', '地标'],
    likes: 25,
    comments: 8,
    isPublic: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    locationId: '2',
    locationName: '外滩',
    locationAddress: '上海市黄浦区中山东一路',
    latitude: 31.2397,
    longitude: 121.4999,
    content: '外滩夜景真美！',
    images: [
      'https://picsum.photos/400/300?random=1402',
      'https://picsum.photos/400/300?random=1403'
    ],
    tags: ['夜景', '旅游'],
    likes: 42,
    comments: 15,
    isPublic: true,
    createdAt: '2024-01-14T20:00:00Z'
  },
  {
    id: '3',
    userId: '1',
    locationId: '3',
    locationName: '星巴克咖啡店',
    locationAddress: '北京市朝阳区三里屯太古里',
    latitude: 39.9378,
    longitude: 116.4447,
    content: '工作之余来喝杯咖啡',
    images: [],
    tags: ['咖啡', '工作'],
    likes: 8,
    comments: 3,
    isPublic: false,
    createdAt: '2024-01-13T15:30:00Z'
  }
]

export const mockLocationBadges: LocationBadge[] = [
  {
    id: '1',
    name: '初来乍到',
    description: '完成第一次打卡',
    icon: 'https://picsum.photos/100/100?random=1501',
    rarity: 'common',
    requirement: '完成1次打卡',
    isUnlocked: true,
    unlockedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '探索者',
    description: '打卡5个不同地点',
    icon: 'https://picsum.photos/100/100?random=1502',
    rarity: 'rare',
    requirement: '打卡5个不同地点',
    isUnlocked: true,
    unlockedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '3',
    name: '旅行达人',
    description: '打卡20个不同地点',
    icon: 'https://picsum.photos/100/100?random=1503',
    rarity: 'epic',
    requirement: '打卡20个不同地点',
    isUnlocked: false
  },
  {
    id: '4',
    name: '地标收集者',
    description: '打卡所有地标建筑',
    icon: 'https://picsum.photos/100/100?random=1504',
    rarity: 'legendary',
    requirement: '打卡所有地标建筑',
    isUnlocked: false
  }
]
