import type { PetService, PetProduct, PetAppointment } from '@/types/pet'

export const mockPetServices: PetService[] = [
  {
    id: '1',
    name: '宠物美容服务',
    description: '专业的宠物美容服务，包括洗澡、修剪、造型等',
    type: 'grooming',
    price: 150,
    duration: 120,
    provider: '宠物美容店A',
    providerAvatar: 'https://picsum.photos/200/200?random=1001',
    rating: 4.8,
    reviewCount: 156,
    images: [
      'https://picsum.photos/400/300?random=1101',
      'https://picsum.photos/400/300?random=1102'
    ],
    location: '北京市朝阳区',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '宠物托管服务',
    description: '24小时宠物托管，专业照顾您的爱宠',
    type: 'boarding',
    price: 80,
    duration: 1440,
    provider: '宠物托管中心B',
    providerAvatar: 'https://picsum.photos/200/200?random=1002',
    rating: 4.9,
    reviewCount: 89,
    images: [
      'https://picsum.photos/400/300?random=1103'
    ],
    location: '上海市浦东新区',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: '宠物医疗检查',
    description: '全面的宠物健康检查服务',
    type: 'medical',
    price: 200,
    duration: 60,
    provider: '宠物医院C',
    providerAvatar: 'https://picsum.photos/200/200?random=1003',
    rating: 4.7,
    reviewCount: 234,
    images: [
      'https://picsum.photos/400/300?random=1104'
    ],
    location: '广州市天河区',
    isAvailable: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
]

export const mockPetProducts: PetProduct[] = [
  {
    id: '1',
    name: '皇家猫粮 成猫专用',
    description: '营养均衡的成猫专用猫粮',
    price: 89,
    originalPrice: 99,
    images: [
      'https://picsum.photos/400/400?random=1201'
    ],
    category: '宠物食品',
    brand: '皇家',
    stock: 100,
    sales: 256,
    rating: 4.6,
    reviewCount: 89,
    specifications: {
      '净含量': '1.5kg',
      '适用年龄': '成猫',
      '口味': '鸡肉味'
    },
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '宠物玩具 逗猫棒',
    description: '互动性强的逗猫棒玩具',
    price: 25,
    originalPrice: 35,
    images: [
      'https://picsum.photos/400/400?random=1202'
    ],
    category: '宠物玩具',
    brand: 'PetFun',
    stock: 50,
    sales: 128,
    rating: 4.4,
    reviewCount: 67,
    specifications: {
      '材质': '塑料+羽毛',
      '长度': '50cm',
      '适用宠物': '猫咪'
    },
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: '宠物洗护用品 沐浴露',
    description: '温和无刺激的宠物专用沐浴露',
    price: 45,
    images: [
      'https://picsum.photos/400/400?random=1203'
    ],
    category: '宠物用品',
    brand: 'PetCare',
    stock: 80,
    sales: 189,
    rating: 4.5,
    reviewCount: 123,
    specifications: {
      '净含量': '500ml',
      '适用宠物': '全犬种',
      '功效': '清洁去味'
    },
    createdAt: '2024-01-01T00:00:00Z'
  }
]

export const mockPetAppointments: PetAppointment[] = [
  {
    id: '1',
    petId: '1',
    serviceId: '1',
    serviceName: '宠物美容服务',
    provider: '宠物美容店A',
    appointmentDate: '2024-01-20',
    appointmentTime: '14:00',
    status: 'confirmed',
    notes: '希望修剪得短一些',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    petId: '1',
    serviceId: '3',
    serviceName: '宠物医疗检查',
    provider: '宠物医院C',
    appointmentDate: '2024-01-25',
    appointmentTime: '10:00',
    status: 'pending',
    notes: '定期体检',
    createdAt: '2024-01-14T15:20:00Z'
  }
]
