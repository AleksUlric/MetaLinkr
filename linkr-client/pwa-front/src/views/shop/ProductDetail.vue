<template>
  <div class="product-detail">
    <div class="product-header">
      <el-button type="text" :icon="ArrowLeft" @click="goBack" />
      <h1 class="page-title">商品详情</h1>
      <el-button type="text" :icon="Share" />
    </div>
    
    <div class="product-content">
      <div class="product-image">
        <el-image :src="product.image" fit="cover" />
      </div>
      
      <div class="product-info">
        <h2 class="product-name">{{ product.name }}</h2>
        <p class="product-price">¥{{ product.price }}</p>
        <p class="product-desc">{{ product.description }}</p>
        
        <div class="product-features">
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>永久有效</span>
          </div>
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>立即到账</span>
          </div>
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>支持退款</span>
          </div>
        </div>
      </div>
      
      <div class="purchase-section">
        <div class="quantity-selector">
          <span class="label">数量：</span>
          <el-input-number v-model="quantity" :min="1" :max="10" />
        </div>
        
        <div class="total-price">
          <span class="label">总计：</span>
          <span class="price">¥{{ (product.price * quantity).toFixed(2) }}</span>
        </div>
        
        <div class="purchase-actions">
          <el-button type="primary" @click="addToCart">加入购物车</el-button>
          <el-button type="danger" @click="buyNow">立即购买</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Share, Check } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const quantity = ref(1)

const product = ref({
  id: route.params.id as string,
  name: '会员套餐',
  price: 29.9,
  image: 'https://via.placeholder.com/300x300',
  description: '享受更多特权功能，提升用户体验'
})

// 初始化数据
onMounted(() => {
  console.log('商品ID:', product.value.id)
})

const addToCart = () => {
  console.log('加入购物车')
}

const buyNow = () => {
  console.log('立即购买')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.product-detail {
  height: 100vh;
  background-color: #f5f5f5;
}

.product-header {
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

.product-content {
  padding: 20px;
}

.product-image {
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  .el-image {
    width: 100%;
    height: 300px;
  }
}

.product-info {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  .product-name {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #333;
  }
  
  .product-price {
    font-size: 24px;
    font-weight: 600;
    color: #ff6b6b;
    margin: 0 0 12px 0;
  }
  
  .product-desc {
    font-size: 14px;
    color: #666;
    margin: 0 0 20px 0;
    line-height: 1.5;
  }
  
  .product-features {
    .feature-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      .el-icon {
        color: #52c41a;
        margin-right: 8px;
      }
      
      span {
        font-size: 14px;
        color: #333;
      }
    }
  }
}

.purchase-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  .quantity-selector, .total-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .label {
      font-size: 16px;
      color: #333;
    }
    
    .price {
      font-size: 18px;
      font-weight: 600;
      color: #ff6b6b;
    }
  }
  
  .purchase-actions {
    display: flex;
    gap: 12px;
    
    .el-button {
      flex: 1;
      height: 45px;
      font-size: 16px;
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .product-detail {
    background-color: #1a1a1a;
  }
  
  .product-header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .page-title {
      color: #fff;
    }
  }
  
  .product-image, .product-info, .purchase-section {
    background: #2a2a2a;
  }
  
  .product-info {
    .product-name {
      color: #fff;
    }
    
    .product-desc {
      color: #aaa;
    }
    
    .product-features .feature-item span {
      color: #fff;
    }
  }
  
  .purchase-section {
    .quantity-selector, .total-price {
      .label {
        color: #fff;
      }
    }
  }
}
</style>
