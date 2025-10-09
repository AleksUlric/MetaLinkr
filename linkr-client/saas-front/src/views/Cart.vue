<template>
  <div class="cart-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">购物车</h1>
        <p class="page-subtitle">查看和管理您的购物车商品</p>
      </div>
      <div class="header-right">
        <el-button type="primary" size="large" @click="proceedToCheckout" :disabled="cartItems.length === 0">
          <el-icon><ShoppingCart /></el-icon>
          去结算
        </el-button>
      </div>
    </div>
    
    <div v-if="cartItems.length === 0" class="empty-cart">
      <div class="empty-content">
        <el-icon class="empty-icon"><ShoppingCart /></el-icon>
        <h2>购物车是空的</h2>
        <p>您还没有添加任何商品到购物车</p>
        <el-button type="primary" size="large" @click="$router.push('/dashboard/products')">
          去购物
        </el-button>
      </div>
    </div>
    
    <div v-else class="cart-content">
      <div class="cart-main">
        <!-- 购物车商品列表 -->
        <div class="cart-items">
          <div class="items-header">
            <el-checkbox 
              v-model="selectAll" 
              :indeterminate="isIndeterminate"
              @change="handleSelectAll"
            >
              全选
            </el-checkbox>
            <span class="selected-count">已选择 {{ selectedItems.length }} 件商品</span>
          </div>
          
          <div class="items-list">
            <div 
              v-for="item in cartItems" 
              :key="item.id"
              class="cart-item"
              :class="{ selected: selectedItems.includes(item.id) }"
            >
              <el-checkbox 
                v-model="item.selected" 
                @change="handleItemSelect(item)"
              />
              
              <div class="item-image">
                <el-image
                  :src="item.image"
                  fit="cover"
                  class="product-image"
                >
                  <template #error>
                    <div class="image-error">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
              
              <div class="item-info">
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-sku">SKU: {{ item.sku }}</p>
                <div class="item-attributes">
                  <el-tag 
                    v-for="attr in item.attributes" 
                    :key="attr.name"
                    size="small"
                    type="info"
                  >
                    {{ attr.name }}: {{ attr.value }}
                  </el-tag>
                </div>
              </div>
              
              <div class="item-price">
                <div class="current-price">¥{{ item.price }}</div>
                <div v-if="item.comparePrice" class="compare-price">¥{{ item.comparePrice }}</div>
              </div>
              
              <div class="item-quantity">
                <el-input-number
                  v-model="item.quantity"
                  :min="1"
                  :max="item.stock"
                  size="small"
                  @change="updateQuantity(item)"
                />
                <div class="stock-info">
                  <span v-if="item.stock < 10" class="low-stock">库存不足</span>
                </div>
              </div>
              
              <div class="item-total">
                <div class="total-price">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
              </div>
              
              <div class="item-actions">
                <el-button type="primary" size="small" link @click="moveToWishlist(item)">
                  <el-icon><Star /></el-icon>
                  移入收藏
                </el-button>
                <el-button type="danger" size="small" link @click="removeItem(item)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 推荐商品 -->
        <div class="recommendations">
          <h3>为您推荐</h3>
          <div class="recommendation-grid">
            <div 
              v-for="product in recommendedProducts" 
              :key="product.id"
              class="recommendation-item"
              @click="addToCart(product)"
            >
              <el-image
                :src="product.image"
                fit="cover"
                class="rec-image"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="rec-info">
                <h4 class="rec-name">{{ product.name }}</h4>
                <div class="rec-price">¥{{ product.price }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 购物车摘要 -->
      <div class="cart-summary">
        <div class="summary-card">
          <h3>订单摘要</h3>
          
          <div class="summary-row">
            <span>商品总价</span>
            <span>¥{{ subtotal.toFixed(2) }}</span>
          </div>
          
          <div class="summary-row">
            <span>运费</span>
            <span v-if="shippingFee === 0" class="free-shipping">免费</span>
            <span v-else>¥{{ shippingFee.toFixed(2) }}</span>
          </div>
          
          <div class="summary-row">
            <span>税费</span>
            <span>¥{{ tax.toFixed(2) }}</span>
          </div>
          
          <div class="summary-row discount">
            <span>优惠券折扣</span>
            <span class="discount-amount">-¥{{ discount.toFixed(2) }}</span>
          </div>
          
          <el-divider />
          
          <div class="summary-row total">
            <span>总计</span>
            <span class="total-amount">¥{{ total.toFixed(2) }}</span>
          </div>
          
          <!-- 优惠券 -->
          <div class="coupon-section">
            <el-input
              v-model="couponCode"
              placeholder="输入优惠券代码"
              class="coupon-input"
            >
              <template #append>
                <el-button @click="applyCoupon">应用</el-button>
              </template>
            </el-input>
            <div v-if="appliedCoupon" class="applied-coupon">
              <el-tag type="success" closable @close="removeCoupon">
                {{ appliedCoupon.name }} - 已应用
              </el-tag>
            </div>
          </div>
          
          <el-button 
            type="primary" 
            size="large" 
            class="checkout-btn"
            @click="proceedToCheckout"
            :disabled="selectedItems.length === 0"
          >
            去结算 ({{ selectedItems.length }} 件商品)
          </el-button>
          
          <div class="security-info">
            <el-icon><Lock /></el-icon>
            <span>安全支付保障</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ShoppingCart, Picture, Star, Delete, Lock
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const cartItems = ref([
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    sku: 'IPH15PM-256',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=100&h=100&fit=crop&crop=center',
    price: 9999,
    comparePrice: 10999,
    quantity: 1,
    stock: 25,
    selected: true,
    attributes: [
      { name: '颜色', value: '深空黑色' },
      { name: '存储', value: '256GB' }
    ]
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    sku: 'MBP16-512',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop&crop=center',
    price: 19999,
    comparePrice: null,
    quantity: 1,
    stock: 8,
    selected: true,
    attributes: [
      { name: '颜色', value: '深空灰色' },
      { name: '存储', value: '512GB' }
    ]
  },
  {
    id: 3,
    name: 'AirPods Pro',
    sku: 'APP-2ND',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop&crop=center',
    price: 1999,
    comparePrice: 2199,
    quantity: 2,
    stock: 50,
    selected: false,
    attributes: [
      { name: '颜色', value: '白色' }
    ]
  }
])

const recommendedProducts = ref([
  {
    id: 4,
    name: 'Apple Watch Series 9',
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=100&h=100&fit=crop&crop=center',
    price: 2999
  },
  {
    id: 5,
    name: 'iPad Air',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop&crop=center',
    price: 4399
  },
  {
    id: 6,
    name: 'Magic Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&h=100&fit=crop&crop=center',
    price: 2399
  }
])

const couponCode = ref('')
const appliedCoupon = ref(null)
const shippingFee = ref(0)
const tax = ref(0)

// 计算属性
const selectedItems = computed(() => {
  return cartItems.value.filter(item => item.selected).map(item => item.id)
})

const selectAll = computed({
  get: () => cartItems.value.length > 0 && cartItems.value.every(item => item.selected),
  set: (value) => {
    cartItems.value.forEach(item => {
      item.selected = value
    })
  }
})

const isIndeterminate = computed(() => {
  const selectedCount = cartItems.value.filter(item => item.selected).length
  return selectedCount > 0 && selectedCount < cartItems.value.length
})

const subtotal = computed(() => {
  return cartItems.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const discount = computed(() => {
  if (appliedCoupon.value) {
    return appliedCoupon.value.discount
  }
  return 0
})

const total = computed(() => {
  return subtotal.value + shippingFee.value + tax.value - discount.value
})

// 方法
const handleSelectAll = (value: boolean) => {
  cartItems.value.forEach(item => {
    item.selected = value
  })
}

const handleItemSelect = (item: any) => {
  // 更新选中状态
}

const updateQuantity = (item: any) => {
  if (item.quantity > item.stock) {
    ElMessage.warning('库存不足')
    item.quantity = item.stock
  }
  ElMessage.success('数量已更新')
}

const removeItem = async (item: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除商品 "${item.name}" 吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = cartItems.value.findIndex(cartItem => cartItem.id === item.id)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
    
    ElMessage.success('商品已删除')
  } catch {
    // 用户取消
  }
}

const moveToWishlist = (item: any) => {
  ElMessage.success(`已将 "${item.name}" 移入收藏夹`)
  removeItem(item)
}

const addToCart = (product: any) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cartItems.value.push({
      ...product,
      quantity: 1,
      selected: true,
      attributes: []
    })
  }
  ElMessage.success(`已将 "${product.name}" 添加到购物车`)
}

const applyCoupon = () => {
  if (!couponCode.value.trim()) {
    ElMessage.warning('请输入优惠券代码')
    return
  }
  
  // 模拟优惠券验证
  const validCoupons = {
    'WELCOME10': { name: '新用户优惠', discount: 100 },
    'SAVE20': { name: '满减优惠', discount: 200 },
    'FREESHIP': { name: '免运费', discount: 0 }
  }
  
  const coupon = validCoupons[couponCode.value.toUpperCase()]
  if (coupon) {
    appliedCoupon.value = coupon
    if (coupon.name === '免运费') {
      shippingFee.value = 0
    }
    ElMessage.success('优惠券应用成功')
  } else {
    ElMessage.error('优惠券代码无效')
  }
}

const removeCoupon = () => {
  appliedCoupon.value = null
  couponCode.value = ''
  ElMessage.info('优惠券已移除')
}

const proceedToCheckout = () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要结算的商品')
    return
  }
  
  router.push('/dashboard/checkout')
}

onMounted(() => {
  // 计算运费和税费
  if (subtotal.value >= 500) {
    shippingFee.value = 0 // 满500免运费
  } else {
    shippingFee.value = 20
  }
  
  tax.value = subtotal.value * 0.1 // 10%税费
})
</script>

<style lang="scss" scoped>
.cart-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  
  .header-left {
    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: var(--saas-text-primary);
      margin-bottom: 8px;
    }
    
    .page-subtitle {
      font-size: 16px;
      color: var(--saas-text-secondary);
    }
  }
  
  .header-right {
    .el-button {
      height: 40px;
      padding: 0 20px;
      font-weight: 500;
      
      .el-icon {
        margin-right: 8px;
      }
    }
  }
}

.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  
  .empty-content {
    text-align: center;
    
    .empty-icon {
      font-size: 64px;
      color: var(--saas-text-tertiary);
      margin-bottom: 16px;
    }
    
    h2 {
      font-size: 24px;
      font-weight: 600;
      color: var(--saas-text-primary);
      margin-bottom: 8px;
    }
    
    p {
      font-size: 16px;
      color: var(--saas-text-secondary);
      margin-bottom: 24px;
    }
  }
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

.cart-main {
  .cart-items {
    background: var(--saas-bg-primary);
    border-radius: 12px;
    padding: 24px;
    box-shadow: var(--saas-shadow);
    border: 1px solid var(--saas-border-light);
    margin-bottom: 24px;
    
    .items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--saas-border-light);
      
      .selected-count {
        font-size: 14px;
        color: var(--saas-text-secondary);
      }
    }
    
    .items-list {
      .cart-item {
        display: grid;
        grid-template-columns: auto 100px 1fr auto auto auto auto;
        gap: 16px;
        align-items: center;
        padding: 20px 0;
        border-bottom: 1px solid var(--saas-border-light);
        transition: background 0.2s;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:hover {
          background: var(--saas-bg-tertiary);
        }
        
        &.selected {
          background: rgba(var(--saas-primary), 0.05);
        }
        
        .item-image {
          .product-image {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            border: 1px solid var(--saas-border-light);
          }
          
          .image-error {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--saas-bg-tertiary);
            color: var(--saas-text-tertiary);
            border-radius: 8px;
            font-size: 24px;
          }
        }
        
        .item-info {
          .item-name {
            font-size: 16px;
            font-weight: 600;
            color: var(--saas-text-primary);
            margin-bottom: 4px;
          }
          
          .item-sku {
            font-size: 12px;
            color: var(--saas-text-tertiary);
            margin-bottom: 8px;
          }
          
          .item-attributes {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;
          }
        }
        
        .item-price {
          text-align: right;
          
          .current-price {
            font-size: 16px;
            font-weight: 600;
            color: var(--saas-text-primary);
          }
          
          .compare-price {
            font-size: 12px;
            color: var(--saas-text-tertiary);
            text-decoration: line-through;
          }
        }
        
        .item-quantity {
          .stock-info {
            margin-top: 4px;
            text-align: center;
            
            .low-stock {
              font-size: 12px;
              color: var(--saas-warning);
            }
          }
        }
        
        .item-total {
          text-align: right;
          
          .total-price {
            font-size: 16px;
            font-weight: 600;
            color: var(--saas-primary);
          }
        }
        
        .item-actions {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
      }
    }
  }
  
  .recommendations {
    background: var(--saas-bg-primary);
    border-radius: 12px;
    padding: 24px;
    box-shadow: var(--saas-shadow);
    border: 1px solid var(--saas-border-light);
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--saas-text-primary);
      margin-bottom: 16px;
    }
    
    .recommendation-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 16px;
      
      .recommendation-item {
        cursor: pointer;
        transition: transform 0.2s;
        
        &:hover {
          transform: translateY(-2px);
        }
        
        .rec-image {
          width: 100%;
          height: 100px;
          border-radius: 8px;
          border: 1px solid var(--saas-border-light);
          margin-bottom: 8px;
        }
        
        .rec-info {
          .rec-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--saas-text-primary);
            margin-bottom: 4px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .rec-price {
            font-size: 14px;
            font-weight: 600;
            color: var(--saas-primary);
          }
        }
      }
    }
  }
}

.cart-summary {
  .summary-card {
    background: var(--saas-bg-primary);
    border-radius: 12px;
    padding: 24px;
    box-shadow: var(--saas-shadow);
    border: 1px solid var(--saas-border-light);
    position: sticky;
    top: 24px;
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--saas-text-primary);
      margin-bottom: 20px;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 14px;
      
      &.discount {
        color: var(--saas-success);
        
        .discount-amount {
          font-weight: 600;
        }
      }
      
      &.total {
        font-size: 16px;
        font-weight: 600;
        color: var(--saas-text-primary);
        
        .total-amount {
          color: var(--saas-primary);
          font-size: 18px;
        }
      }
    }
    
    .free-shipping {
      color: var(--saas-success);
      font-weight: 500;
    }
    
    .coupon-section {
      margin: 20px 0;
      
      .coupon-input {
        margin-bottom: 12px;
      }
      
      .applied-coupon {
        text-align: center;
      }
    }
    
    .checkout-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    
    .security-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 12px;
      color: var(--saas-text-tertiary);
      
      .el-icon {
        color: var(--saas-success);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .cart-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .cart-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .cart-item {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
    text-align: center;
    
    .item-image {
      justify-self: center;
    }
    
    .item-actions {
      flex-direction: row !important;
      justify-content: center;
    }
  }
  
  .recommendation-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
</style>
