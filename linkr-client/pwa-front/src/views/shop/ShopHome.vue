<template>
  <div class="shop-home">
    <div class="shop-header">
      <el-button type="text" :icon="ArrowLeft" @click="goBack" />
      <h1 class="page-title">商城</h1>
      <el-button type="text" :icon="ShoppingCart" />
    </div>
    
    <div class="shop-content">
      <div class="balance-card">
        <div class="balance-info">
          <h2 class="balance-title">我的余额</h2>
          <p class="balance-amount">¥128.50</p>
        </div>
        <el-button type="primary" size="small">充值</el-button>
      </div>
      
      <div class="shop-section">
        <div class="section-title">热门商品</div>
        <div class="products-grid">
          <div 
            v-for="product in products" 
            :key="product.id" 
            class="product-item"
            @click="viewProduct(product)"
          >
            <div class="product-image">
              <el-image :src="product.image" fit="cover" />
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-price">¥{{ product.price }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="shop-section">
        <div class="section-title">分类</div>
        <div class="categories-grid">
          <div 
            v-for="category in categories" 
            :key="category.id" 
            class="category-item"
            @click="viewCategory(category)"
          >
            <div class="category-icon">
              <el-icon :size="32" :color="category.color">
                <component :is="category.icon" />
              </el-icon>
            </div>
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ShoppingCart, Star, Heart, Trophy, Gift } from '@element-plus/icons-vue'

const router = useRouter()

const products = ref([
  {
    id: '1',
    name: '会员套餐',
    price: 29.9,
    image: 'https://via.placeholder.com/150x150'
  },
  {
    id: '2',
    name: '虚拟礼物',
    price: 9.9,
    image: 'https://via.placeholder.com/150x150'
  },
  {
    id: '3',
    name: '表情包',
    price: 6.9,
    image: 'https://via.placeholder.com/150x150'
  },
  {
    id: '4',
    name: '主题皮肤',
    price: 12.9,
    image: 'https://via.placeholder.com/150x150'
  }
])

const categories = ref([
  { id: '1', name: '会员', icon: 'Star', color: '#ff6b6b' },
  { id: '2', name: '礼物', icon: 'Gift', color: '#52c41a' },
  { id: '3', name: '表情', icon: 'Heart', color: '#1890ff' },
  { id: '4', name: '道具', icon: 'Trophy', color: '#722ed1' }
])

const viewProduct = (product: any) => {
  router.push(`/shop/product/${product.id}`)
}

const viewCategory = (category: any) => {
  console.log('查看分类:', category.name)
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.shop-home {
  height: 100vh;
  background-color: #f5f5f5;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  
  .page-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }
}

.shop-content {
  padding: 20px;
}

.balance-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .balance-info {
    .balance-title {
      font-size: 16px;
      margin: 0 0 8px 0;
      opacity: 0.9;
    }
    
    .balance-amount {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
  }
}

.shop-section {
  margin-bottom: 24px;
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    
    .product-item {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      .product-image {
        height: 120px;
        
        .el-image {
          width: 100%;
          height: 100%;
        }
      }
      
      .product-info {
        padding: 12px;
        
        .product-name {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #333;
        }
        
        .product-price {
          font-size: 16px;
          font-weight: 600;
          color: #ff6b6b;
          margin: 0;
        }
      }
    }
  }
  
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    
    .category-item {
      background: white;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      
      &:hover {
        transform: translateY(-2px);
      }
      
      .category-icon {
        margin-bottom: 8px;
      }
      
      .category-name {
        font-size: 12px;
        color: #333;
      }
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .shop-home {
    background-color: #1a1a1a;
  }
  
  .shop-header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .page-title {
      color: #fff;
    }
  }
  
  .shop-section {
    .section-title {
      color: #fff;
    }
    
    .products-grid .product-item {
      background: #2a2a2a;
      
      .product-info {
        .product-name {
          color: #fff;
        }
      }
    }
    
    .categories-grid .category-item {
      background: #2a2a2a;
      
      .category-name {
        color: #fff;
      }
    }
  }
}
</style>
