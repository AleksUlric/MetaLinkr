import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, CartItem, Order, Review } from '@/types/shop'
import { mockProducts, mockCartItems, mockOrders, mockReviews } from '@/mock/shop'

export const useShopStore = defineStore('shop', () => {
  const products = ref<Product[]>(mockProducts)
  const cartItems = ref<CartItem[]>(mockCartItems)
  const orders = ref<Order[]>(mockOrders)
  const reviews = ref<Review[]>(mockReviews)

  // 计算属性
  const cartTotal = computed(() => {
    return cartItems.value
      .filter(item => item.selected)
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
  })

  const cartCount = computed(() => {
    return cartItems.value
      .filter(item => item.selected)
      .reduce((count, item) => count + item.quantity, 0)
  })

  const selectedCartItems = computed(() => {
    return cartItems.value.filter(item => item.selected)
  })

  // 商品相关
  const getProducts = async (category?: string, page = 1, limit = 20) => {
    let filteredProducts = products.value
    
    if (category) {
      filteredProducts = products.value.filter(p => p.category === category)
    }
    
    return filteredProducts.slice((page - 1) * limit, page * limit)
  }

  const getProductById = async (id: string) => {
    return products.value.find(p => p.id === id)
  }

  const searchProducts = async (keyword: string) => {
    return products.value.filter(p => 
      p.name.includes(keyword) || 
      p.description.includes(keyword) ||
      p.tags.some(tag => tag.includes(keyword))
    )
  }

  // 购物车相关
  const getCartItems = async () => {
    return cartItems.value
  }

  const addToCart = async (productId: string, quantity = 1) => {
    const existingItem = cartItems.value.find(item => item.productId === productId)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      const product = products.value.find(p => p.id === productId)
      if (product) {
        const newCartItem: CartItem = {
          id: Date.now().toString(),
          productId,
          product,
          quantity,
          selected: true
        }
        cartItems.value.push(newCartItem)
      }
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    const index = cartItems.value.findIndex(item => item.id === cartItemId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }

  const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
    const item = cartItems.value.find(item => item.id === cartItemId)
    if (item) {
      if (quantity <= 0) {
        await removeFromCart(cartItemId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const toggleCartItemSelection = async (cartItemId: string) => {
    const item = cartItems.value.find(item => item.id === cartItemId)
    if (item) {
      item.selected = !item.selected
    }
  }

  const selectAllCartItems = async () => {
    cartItems.value.forEach(item => {
      item.selected = true
    })
  }

  const unselectAllCartItems = async () => {
    cartItems.value.forEach(item => {
      item.selected = false
    })
  }

  const clearCart = async () => {
    cartItems.value = []
  }

  // 订单相关
  const getOrders = async (status?: string) => {
    if (status) {
      return orders.value.filter(order => order.status === status)
    }
    return orders.value
  }

  const getOrderById = async (id: string) => {
    return orders.value.find(order => order.id === id)
  }

  const createOrder = async (orderData: Partial<Order>) => {
    try {
      const newOrder: Order = {
        id: Date.now().toString(),
        orderNo: `ML${Date.now()}`,
        status: 'pending',
        items: selectedCartItems.value,
        totalAmount: cartTotal.value,
        shippingAddress: orderData.shippingAddress || '',
        paymentMethod: orderData.paymentMethod || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      orders.value.unshift(newOrder)
      
      // 清空购物车
      await clearCart()
      
      return { success: true, data: newOrder }
    } catch (error) {
      console.error('创建订单失败:', error)
      return { success: false, message: '创建订单失败' }
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
      order.updatedAt = new Date().toISOString()
    }
  }

  // 评价相关
  const getReviews = async (productId: string) => {
    return reviews.value.filter(r => r.productId === productId)
  }

  const addReview = async (productId: string, reviewData: Partial<Review>) => {
    try {
      const newReview: Review = {
        id: Date.now().toString(),
        productId,
        userId: '1',
        username: '测试用户',
        avatar: 'https://picsum.photos/200/200?random=1',
        rating: reviewData.rating || 5,
        content: reviewData.content || '',
        images: reviewData.images || [],
        createdAt: new Date().toISOString()
      }
      
      reviews.value.push(newReview)
      
      // 更新商品评分
      const product = products.value.find(p => p.id === productId)
      if (product) {
        const productReviews = reviews.value.filter(r => r.productId === productId)
        product.reviewCount = productReviews.length
        product.rating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
      }
      
      return { success: true, data: newReview }
    } catch (error) {
      console.error('添加评价失败:', error)
      return { success: false, message: '添加评价失败' }
    }
  }

  return {
    products,
    cartItems,
    orders,
    reviews,
    cartTotal,
    cartCount,
    selectedCartItems,
    getProducts,
    getProductById,
    searchProducts,
    getCartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    toggleCartItemSelection,
    selectAllCartItems,
    unselectAllCartItems,
    clearCart,
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    getReviews,
    addReview
  }
})
