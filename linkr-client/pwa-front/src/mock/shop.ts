import type { Product, CartItem, Order, Review } from '@/types/shop'

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: '全新iPhone 15 Pro Max，钛金属设计，A17 Pro芯片',
    price: 9999,
    originalPrice: 10999,
    images: [
      'https://picsum.photos/400/400?random=401',
      'https://picsum.photos/400/400?random=402'
    ],
    category: '手机数码',
    tags: ['iPhone', '苹果', '5G'],
    stock: 50,
    sales: 128,
    rating: 4.8,
    reviewCount: 256,
    brand: 'Apple',
    specifications: {
      '屏幕尺寸': '6.7英寸',
      '存储容量': '256GB',
      '颜色': '深空黑色'
    },
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'MacBook Pro 14英寸',
    description: 'M3 Pro芯片，14英寸Liquid Retina XDR显示屏',
    price: 15999,
    originalPrice: 17999,
    images: [
      'https://picsum.photos/400/400?random=403'
    ],
    category: '电脑办公',
    tags: ['MacBook', '苹果', '笔记本'],
    stock: 25,
    sales: 89,
    rating: 4.9,
    reviewCount: 156,
    brand: 'Apple',
    specifications: {
      '处理器': 'M3 Pro',
      '内存': '16GB',
      '存储': '512GB SSD'
    },
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'AirPods Pro 2',
    description: '主动降噪，空间音频，H2芯片',
    price: 1899,
    originalPrice: 1999,
    images: [
      'https://picsum.photos/400/400?random=404'
    ],
    category: '数码配件',
    tags: ['AirPods', '苹果', '耳机'],
    stock: 100,
    sales: 456,
    rating: 4.7,
    reviewCount: 892,
    brand: 'Apple',
    createdAt: '2024-01-01T00:00:00Z'
  }
]

export const mockCartItems: CartItem[] = [
  {
    id: '1',
    productId: '1',
    product: mockProducts[0],
    quantity: 1,
    selected: true
  },
  {
    id: '2',
    productId: '3',
    product: mockProducts[2],
    quantity: 2,
    selected: true
  }
]

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNo: 'ML202401150001',
    status: 'delivered',
    items: [mockCartItems[0]],
    totalAmount: 9999,
    shippingAddress: '北京市朝阳区xxx街道xxx号',
    paymentMethod: '微信支付',
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-12T14:20:00Z'
  },
  {
    id: '2',
    orderNo: 'ML202401150002',
    status: 'shipped',
    items: [mockCartItems[1]],
    totalAmount: 3798,
    shippingAddress: '上海市浦东新区xxx路xxx号',
    paymentMethod: '支付宝',
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-14T09:30:00Z'
  }
]

export const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: '2',
    username: '小明',
    avatar: 'https://picsum.photos/200/200?random=2',
    rating: 5,
    content: '手机很好用，拍照效果很棒！',
    images: ['https://picsum.photos/300/300?random=501'],
    createdAt: '2024-01-12T15:30:00Z'
  },
  {
    id: '2',
    productId: '1',
    userId: '3',
    username: '小红',
    avatar: 'https://picsum.photos/200/200?random=3',
    rating: 4,
    content: '整体不错，就是价格有点贵',
    images: [],
    createdAt: '2024-01-11T10:20:00Z'
  }
]
