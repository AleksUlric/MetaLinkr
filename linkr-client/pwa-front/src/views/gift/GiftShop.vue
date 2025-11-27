<template>
  <div class="gift-shop-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="nav-title">礼物商城</div>
      <div class="nav-right">
        <div class="coin-balance">
          <el-icon><Money /></el-icon>
          <span>{{ userCoins }}</span>
        </div>
        <el-button :icon="ShoppingCart" circle size="small" @click="viewCart" />
      </div>
    </div>

    <!-- 礼物分类 -->
    <div class="gift-categories">
      <div class="category-nav">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          :class="{ active: activeCategory === category.id }"
          @click="activeCategory = category.id"
        >
          <div class="category-icon">{{ category.icon }}</div>
          <span>{{ category.name }}</span>
        </div>
      </div>
    </div>

    <!-- 热门推荐 -->
    <div v-if="activeCategory === 'hot'" class="hot-section">
      <div class="section-header">
        <h3>热门推荐</h3>
        <el-button text @click="viewAllHot">查看更多</el-button>
      </div>
      <div class="hot-gifts">
        <div 
          v-for="gift in hotGifts" 
          :key="gift.id"
          class="hot-gift-item"
          @click="viewGiftDetail(gift)"
        >
          <div class="gift-animation">
            <div class="gift-icon">{{ gift.icon }}</div>
            <div class="gift-effects">
              <div class="effect sparkle" v-for="i in 3" :key="i"></div>
            </div>
          </div>
          <div class="gift-info">
            <div class="gift-name">{{ gift.name }}</div>
            <div class="gift-price">
              <el-icon><Money /></el-icon>
              <span>{{ gift.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 礼物列表 -->
    <div class="gifts-section">
      <div class="section-header">
        <h3>{{ getCurrentCategoryName() }}</h3>
        <div class="sort-options">
          <el-select v-model="sortBy" placeholder="排序" size="small">
            <el-option label="价格从低到高" value="price-asc" />
            <el-option label="价格从高到低" value="price-desc" />
            <el-option label="热门程度" value="popular" />
            <el-option label="最新上架" value="newest" />
          </el-select>
        </div>
      </div>
      
      <div class="gifts-grid">
        <div 
          v-for="gift in filteredGifts" 
          :key="gift.id"
          class="gift-card"
          :class="{ 'special': gift.isSpecial, 'limited': gift.isLimited }"
          @click="viewGiftDetail(gift)"
        >
          <div class="gift-image">
            <div class="gift-icon-large">{{ gift.icon }}</div>
            <div v-if="gift.isLimited" class="limited-badge">限量</div>
            <div v-if="gift.isSpecial" class="special-badge">特效</div>
          </div>
          <div class="gift-content">
            <div class="gift-name">{{ gift.name }}</div>
            <div class="gift-desc">{{ gift.description }}</div>
            <div class="gift-price">
              <el-icon><Money /></el-icon>
              <span>{{ gift.price }}</span>
              <span v-if="gift.originalPrice" class="original-price">{{ gift.originalPrice }}</span>
            </div>
            <div class="gift-actions">
              <el-button 
                type="primary" 
                size="small" 
                @click.stop="addToCart(gift)"
                :disabled="gift.price > userCoins"
              >
                加入购物车
              </el-button>
              <el-button 
                type="success" 
                size="small" 
                @click.stop="buyNow(gift)"
                :disabled="gift.price > userCoins"
              >
                立即购买
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 礼物详情弹窗 -->
    <el-dialog 
      v-model="showGiftDetail" 
      :title="selectedGift?.name"
      width="90%"
      class="gift-detail-dialog"
    >
      <div v-if="selectedGift" class="gift-detail">
        <div class="detail-preview">
          <div class="gift-preview">{{ selectedGift.icon }}</div>
          <div class="preview-effects">
            <div class="effect-circle" v-for="i in 5" :key="i"></div>
          </div>
        </div>
        <div class="detail-info">
          <div class="detail-name">{{ selectedGift.name }}</div>
          <div class="detail-desc">{{ selectedGift.description }}</div>
          <div class="detail-price">
            <div class="price-current">
              <el-icon><Money /></el-icon>
              <span>{{ selectedGift.price }}</span>
            </div>
            <div v-if="selectedGift.originalPrice" class="price-original">
              原价: {{ selectedGift.originalPrice }}
            </div>
          </div>
          <div class="detail-features">
            <div class="feature-item">
              <el-icon><Star /></el-icon>
              <span>特效: {{ selectedGift.effect }}</span>
            </div>
            <div class="feature-item">
              <el-icon><Clock /></el-icon>
              <span>持续时间: {{ selectedGift.duration }}</span>
            </div>
            <div class="feature-item">
              <el-icon><Trophy /></el-icon>
              <span>稀有度: {{ selectedGift.rarity }}</span>
            </div>
          </div>
          <div class="detail-actions">
            <el-button 
              type="primary" 
              size="large"
              @click="addToCart(selectedGift)"
              :disabled="selectedGift.price > userCoins"
            >
              加入购物车
            </el-button>
            <el-button 
              type="success" 
              size="large"
              @click="buyNow(selectedGift)"
              :disabled="selectedGift.price > userCoins"
            >
              立即购买
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 购物车弹窗 -->
    <el-dialog 
      v-model="showCart" 
      title="购物车"
      width="90%"
      class="cart-dialog"
    >
      <div class="cart-content">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <div class="empty-icon">🛒</div>
          <div class="empty-text">购物车是空的</div>
        </div>
        <div v-else class="cart-items">
          <div 
            v-for="item in cartItems" 
            :key="item.id"
            class="cart-item"
          >
            <div class="item-icon">{{ item.icon }}</div>
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-price">
                <el-icon><Money /></el-icon>
                <span>{{ item.price }}</span>
              </div>
            </div>
            <div class="item-quantity">
              <el-input-number 
                v-model="item.quantity" 
                :min="1" 
                :max="99"
                size="small"
              />
            </div>
            <div class="item-total">
              {{ item.price * item.quantity }}
            </div>
            <el-button 
              :icon="Delete" 
              circle 
              size="small" 
              @click="removeFromCart(item.id)"
            />
          </div>
        </div>
        <div v-if="cartItems.length > 0" class="cart-summary">
          <div class="total-info">
            <span>总计: {{ cartTotal }} 金币</span>
            <span v-if="cartTotal > userCoins" class="insufficient-funds">
              余额不足
            </span>
          </div>
          <el-button 
            type="primary" 
            size="large"
            @click="checkout"
            :disabled="cartTotal > userCoins"
          >
            结算
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Money, 
  ShoppingCart, 
  Star, 
  Clock, 
  Trophy, 
  Delete 
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const activeCategory = ref('hot')
const sortBy = ref('price-asc')
const showGiftDetail = ref(false)
const showCart = ref(false)
const selectedGift = ref<any>(null)
const userCoins = ref(1500)

const categories = ref([
  { id: 'hot', name: '热门', icon: '🔥' },
  { id: 'love', name: '爱心', icon: '💖' },
  { id: 'celebration', name: '庆祝', icon: '🎉' },
  { id: 'animal', name: '动物', icon: '🐱' },
  { id: 'food', name: '美食', icon: '🍕' },
  { id: 'special', name: '特效', icon: '✨' }
])

const hotGifts = ref([
  { id: 1, name: '爱心炸弹', icon: '💖', price: 50, effect: '爱心雨', duration: '10秒' },
  { id: 2, name: '烟花', icon: '🎆', price: 100, effect: '烟花绽放', duration: '15秒' },
  { id: 3, name: '彩虹', icon: '🌈', price: 80, effect: '彩虹桥', duration: '12秒' }
])

const gifts = ref([
  // 爱心类
  {
    id: 101,
    name: '小爱心',
    icon: '💕',
    description: '表达你的爱意',
    price: 10,
    category: 'love',
    effect: '爱心飘落',
    duration: '5秒',
    rarity: '普通',
    isSpecial: false,
    isLimited: false
  },
  {
    id: 102,
    name: '大爱心',
    icon: '💖',
    description: '满满的爱意',
    price: 50,
    category: 'love',
    effect: '爱心雨',
    duration: '10秒',
    rarity: '稀有',
    isSpecial: true,
    isLimited: false
  },
  {
    id: 103,
    name: '钻石爱心',
    icon: '💎',
    description: '珍贵的爱意',
    price: 200,
    originalPrice: 250,
    category: 'love',
    effect: '钻石闪耀',
    duration: '20秒',
    rarity: '传说',
    isSpecial: true,
    isLimited: true
  },
  
  // 庆祝类
  {
    id: 201,
    name: '小烟花',
    icon: '🎆',
    description: '庆祝时刻',
    price: 30,
    category: 'celebration',
    effect: '烟花绽放',
    duration: '8秒',
    rarity: '普通',
    isSpecial: false,
    isLimited: false
  },
  {
    id: 202,
    name: '大烟花',
    icon: '🎇',
    description: '盛大庆祝',
    price: 100,
    category: 'celebration',
    effect: '烟花雨',
    duration: '15秒',
    rarity: '稀有',
    isSpecial: true,
    isLimited: false
  },
  
  // 动物类
  {
    id: 301,
    name: '小猫咪',
    icon: '🐱',
    description: '可爱的猫咪',
    price: 20,
    category: 'animal',
    effect: '猫咪跳跃',
    duration: '6秒',
    rarity: '普通',
    isSpecial: false,
    isLimited: false
  },
  {
    id: 302,
    name: '小狗狗',
    icon: '🐶',
    description: '忠诚的伙伴',
    price: 25,
    category: 'animal',
    effect: '狗狗摇尾',
    duration: '7秒',
    rarity: '普通',
    isSpecial: false,
    isLimited: false
  },
  
  // 美食类
  {
    id: 401,
    name: '小蛋糕',
    icon: '🍰',
    description: '甜蜜的祝福',
    price: 15,
    category: 'food',
    effect: '蛋糕旋转',
    duration: '5秒',
    rarity: '普通',
    isSpecial: false,
    isLimited: false
  },
  {
    id: 402,
    name: '大蛋糕',
    icon: '🎂',
    description: '生日祝福',
    price: 60,
    category: 'food',
    effect: '蜡烛闪烁',
    duration: '12秒',
    rarity: '稀有',
    isSpecial: true,
    isLimited: false
  },
  
  // 特效类
  {
    id: 501,
    name: '彩虹',
    icon: '🌈',
    description: '美丽的彩虹',
    price: 80,
    category: 'special',
    effect: '彩虹桥',
    duration: '12秒',
    rarity: '稀有',
    isSpecial: true,
    isLimited: false
  },
  {
    id: 502,
    name: '流星',
    icon: '☄️',
    description: '许愿流星',
    price: 150,
    category: 'special',
    effect: '流星雨',
    duration: '18秒',
    rarity: '传说',
    isSpecial: true,
    isLimited: true
  }
])

const cartItems = ref<any[]>([])

// 计算属性
const filteredGifts = computed(() => {
  let filtered = gifts.value.filter(gift => {
    if (activeCategory.value === 'hot') return false
    if (activeCategory.value === 'special') return gift.isSpecial
    return gift.category === activeCategory.value
  })
  
  // 排序
  switch (sortBy.value) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'popular':
      // 模拟热门程度排序
      filtered.sort((a, b) => b.id - a.id)
      break
    case 'newest':
      filtered.sort((a, b) => b.id - a.id)
      break
  }
  
  return filtered
})

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// 方法
const goBack = () => {
  router.back()
}

const getCurrentCategoryName = () => {
  if (activeCategory.value === 'hot') return '热门推荐'
  const category = categories.value.find(c => c.id === activeCategory.value)
  return category ? category.name : '全部'
}

const viewGiftDetail = (gift: any) => {
  selectedGift.value = gift
  showGiftDetail.value = true
}

const addToCart = (gift: any) => {
  const existingItem = cartItems.value.find(item => item.id === gift.id)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cartItems.value.push({
      ...gift,
      quantity: 1
    })
  }
  ElMessage.success(`已将 ${gift.name} 加入购物车`)
}

const buyNow = (gift: any) => {
  if (gift.price > userCoins.value) {
    ElMessage.warning('金币余额不足')
    return
  }
  
  userCoins.value -= gift.price
  ElMessage.success(`成功购买 ${gift.name}`)
  showGiftDetail.value = false
}

const viewCart = () => {
  showCart.value = true
}

const removeFromCart = (giftId: number) => {
  const index = cartItems.value.findIndex(item => item.id === giftId)
  if (index > -1) {
    cartItems.value.splice(index, 1)
    ElMessage.success('已从购物车移除')
  }
}

const checkout = () => {
  if (cartTotal.value > userCoins.value) {
    ElMessage.warning('金币余额不足')
    return
  }
  
  userCoins.value -= cartTotal.value
  cartItems.value = []
  showCart.value = false
  ElMessage.success('购买成功！')
}

const viewAllHot = () => {
  ElMessage.info('查看更多热门礼物')
}
</script>

<style lang="scss" scoped>
.gift-shop-page {
  background: linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%);
  min-height: 100vh;
  color: #334155;
  position: relative;
  overflow-x: hidden;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(196, 181, 253, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;

  .back-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #8b5cf6;

    &:hover {
      background: rgba(139, 92, 246, 0.2);
    }
  }

  .nav-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 15px;

    .coin-balance {
      display: flex;
      align-items: center;
      gap: 5px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;

      .el-icon {
        font-size: 16px;
      }
    }

    .el-button {
      background: rgba(139, 92, 246, 0.1);
      border: none;
      color: #8b5cf6;

      &:hover {
        background: rgba(139, 92, 246, 0.2);
      }
    }
  }
}

.gift-categories {
  padding: 0 20px;
  margin-bottom: 20px;

  .category-nav {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 10px;

    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 15px 20px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #64748b;
      white-space: nowrap;
      min-width: 80px;
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(196, 181, 253, 0.2);

      &:hover {
        color: #475569;
        transform: translateY(-2px);
      }

      &.active {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
      }

      .category-icon {
        font-size: 24px;
      }

      span {
        font-size: 13px;
        font-weight: 600;
      }
    }
  }
}

.hot-section {
  padding: 0 20px;
  margin-bottom: 30px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .el-button {
      color: #8b5cf6;
      font-size: 14px;
    }
  }

  .hot-gifts {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding-bottom: 10px;

    .hot-gift-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(196, 181, 253, 0.2);
      min-width: 120px;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
      }

      .gift-animation {
        position: relative;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;

        .gift-icon {
          font-size: 32px;
          z-index: 2;
        }

        .gift-effects {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

          .effect {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #f59e0b;
            border-radius: 50%;
            animation: sparkle 2s infinite;

            &:nth-child(1) {
              top: 10px;
              left: 20px;
              animation-delay: 0s;
            }

            &:nth-child(2) {
              top: 30px;
              right: 15px;
              animation-delay: 0.5s;
            }

            &:nth-child(3) {
              bottom: 15px;
              left: 30px;
              animation-delay: 1s;
            }
          }
        }
      }

      .gift-info {
        text-align: center;

        .gift-name {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 5px;
        }

        .gift-price {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: #f59e0b;
          font-weight: 600;
          font-size: 13px;

          .el-icon {
            font-size: 14px;
          }
        }
      }
    }
  }
}

.gifts-section {
  padding: 0 20px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .sort-options {
      .el-select {
        .el-select__input {
          border-radius: 12px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.1);
          color: #334155;
        }
      }
    }
  }

  .gifts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;

    .gift-card {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(196, 181, 253, 0.2);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
      }

      &.special {
        border-color: rgba(168, 85, 247, 0.3);
        box-shadow: 0 4px 16px rgba(168, 85, 247, 0.1);
      }

      &.limited {
        border-color: rgba(245, 158, 11, 0.3);
        box-shadow: 0 4px 16px rgba(245, 158, 11, 0.1);
      }

      .gift-image {
        position: relative;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);

        .gift-icon-large {
          font-size: 48px;
        }

        .limited-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #f59e0b;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .special-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #a855f7;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 12px;
        }
      }

      .gift-content {
        padding: 20px;

        .gift-name {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .gift-desc {
          font-size: 14px;
          color: #64748b;
          line-height: 1.4;
          margin-bottom: 12px;
        }

        .gift-price {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 15px;
          color: #f59e0b;
          font-weight: 600;

          .el-icon {
            font-size: 16px;
          }

          .original-price {
            color: #94a3b8;
            text-decoration: line-through;
            font-size: 12px;
            margin-left: 8px;
          }
        }

        .gift-actions {
          display: flex;
          gap: 10px;

          .el-button {
            flex: 1;
            border-radius: 12px;
            font-weight: 600;
            font-size: 13px;

            &.el-button--primary {
              background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
              border: none;
              color: white;

              &:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 3px 10px rgba(139, 92, 246, 0.3);
              }
            }

            &.el-button--success {
              background: rgba(16, 185, 129, 0.1);
              border: 1px solid rgba(16, 185, 129, 0.3);
              color: #10b981;

              &:hover:not(:disabled) {
                background: rgba(16, 185, 129, 0.2);
              }
            }

            &:disabled {
              background: rgba(148, 163, 184, 0.3);
              color: rgba(148, 163, 184, 0.8);
              border-color: rgba(148, 163, 184, 0.3);
            }
          }
        }
      }
    }
  }
}

.gift-detail-dialog {
  .gift-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .detail-preview {
      position: relative;
      width: 120px;
      height: 120px;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      justify-content: center;

      .gift-preview {
        font-size: 64px;
        z-index: 2;
      }

      .preview-effects {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        .effect-circle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #f59e0b;
          border-radius: 50%;
          animation: rotate 3s infinite linear;

          &:nth-child(1) {
            top: 20px;
            left: 20px;
            animation-delay: 0s;
          }

          &:nth-child(2) {
            top: 20px;
            right: 20px;
            animation-delay: 0.5s;
          }

          &:nth-child(3) {
            bottom: 20px;
            left: 20px;
            animation-delay: 1s;
          }

          &:nth-child(4) {
            bottom: 20px;
            right: 20px;
            animation-delay: 1.5s;
          }

          &:nth-child(5) {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation-delay: 2s;
          }
        }
      }
    }

    .detail-info {
      width: 100%;

      .detail-name {
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 10px;
      }

      .detail-desc {
        font-size: 16px;
        color: #64748b;
        line-height: 1.5;
        margin-bottom: 20px;
      }

      .detail-price {
        margin-bottom: 20px;

        .price-current {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 700;
          color: #f59e0b;
          margin-bottom: 5px;

          .el-icon {
            font-size: 20px;
          }
        }

        .price-original {
          font-size: 14px;
          color: #94a3b8;
          text-decoration: line-through;
        }
      }

      .detail-features {
        margin-bottom: 30px;

        .feature-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 10px;
          font-size: 14px;
          color: #64748b;

          .el-icon {
            color: #8b5cf6;
          }
        }
      }

      .detail-actions {
        display: flex;
        gap: 15px;

        .el-button {
          flex: 1;
          padding: 15px 25px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 16px;

          &.el-button--primary {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            border: none;
            color: white;

            &:hover:not(:disabled) {
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
            }
          }

          &.el-button--success {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #10b981;

            &:hover:not(:disabled) {
              background: rgba(16, 185, 129, 0.2);
            }
          }

          &:disabled {
            background: rgba(148, 163, 184, 0.3);
            color: rgba(148, 163, 184, 0.8);
            border-color: rgba(148, 163, 184, 0.3);
          }
        }
      }
    }
  }
}

.cart-dialog {
  .cart-content {
    .empty-cart {
      text-align: center;
      padding: 60px 20px;
      color: #64748b;

      .empty-icon {
        font-size: 48px;
        margin-bottom: 20px;
      }

      .empty-text {
        font-size: 16px;
      }
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 20px;

      .cart-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: rgba(139, 92, 246, 0.05);
        border-radius: 12px;
        border: 1px solid rgba(139, 92, 246, 0.1);

        .item-icon {
          font-size: 32px;
          width: 50px;
          text-align: center;
        }

        .item-info {
          flex: 1;

          .item-name {
            font-size: 15px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 5px;
          }

          .item-price {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #f59e0b;
            font-weight: 600;
            font-size: 14px;

            .el-icon {
              font-size: 14px;
            }
          }
        }

        .item-quantity {
          .el-input-number {
            .el-input__inner {
              border-radius: 8px;
              background: rgba(255, 255, 255, 0.8);
              border: 1px solid rgba(139, 92, 246, 0.2);
            }
          }
        }

        .item-total {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          min-width: 60px;
          text-align: right;
        }

        .el-button {
          background: rgba(239, 68, 68, 0.1);
          border: none;
          color: #ef4444;

          &:hover {
            background: rgba(239, 68, 68, 0.2);
          }
        }
      }
    }

    .cart-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: rgba(139, 92, 246, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(139, 92, 246, 0.1);

      .total-info {
        display: flex;
        flex-direction: column;
        gap: 5px;

        span {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }

        .insufficient-funds {
          font-size: 12px;
          color: #ef4444;
        }
      }

      .el-button {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        border: none;
        color: white;
        font-weight: 600;
        padding: 12px 25px;
        border-radius: 20px;
        font-size: 16px;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
        }

        &:disabled {
          background: rgba(148, 163, 184, 0.3);
          color: rgba(148, 163, 184, 0.8);
        }
      }
    }
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
