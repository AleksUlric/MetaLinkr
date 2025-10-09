export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  tags: string[]
  stock: number
  sales: number
  rating: number
  reviewCount: number
  brand?: string
  specifications?: Record<string, string>
  createdAt: string
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  selected: boolean
}

export interface Order {
  id: string
  orderNo: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  items: CartItem[]
  totalAmount: number
  shippingAddress: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  username: string
  avatar: string
  rating: number
  content: string
  images: string[]
  createdAt: string
}
