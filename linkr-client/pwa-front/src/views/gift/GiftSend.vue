<template>
  <div class="gift-send-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="nav-title">发送礼物</div>
      <div class="nav-right">
        <div class="coin-balance">
          <el-icon><Money /></el-icon>
          <span>{{ userCoins }}</span>
        </div>
      </div>
    </div>

    <!-- 接收者信息 -->
    <div class="receiver-info">
      <div class="receiver-card">
        <img :src="receiverInfo.avatar" :alt="receiverInfo.name" class="receiver-avatar" />
        <div class="receiver-details">
          <div class="receiver-name">{{ receiverInfo.name }}</div>
          <div class="receiver-id">ID: {{ receiverInfo.id }}</div>
          <div class="receiver-level">
            <span class="level-badge">{{ receiverInfo.level }}</span>
            <span class="level-name">{{ receiverInfo.levelName }}</span>
          </div>
        </div>
        <div class="receiver-stats">
          <div class="stat-item">
            <span class="stat-value">{{ receiverInfo.receivedGifts }}</span>
            <span class="stat-label">收礼</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ receiverInfo.sentGifts }}</span>
            <span class="stat-label">送礼</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 礼物选择 -->
    <div class="gift-selection">
      <div class="selection-header">
        <h3>选择礼物</h3>
        <div class="quick-amounts">
          <span 
            v-for="amount in quickAmounts" 
            :key="amount"
            class="quick-amount"
            :class="{ active: selectedAmount === amount }"
            @click="selectedAmount = amount"
          >
            {{ amount }}
          </span>
        </div>
      </div>
      
      <div class="gifts-grid">
        <div 
          v-for="gift in availableGifts" 
          :key="gift.id"
          class="gift-item"
          :class="{ 
            'selected': selectedGift?.id === gift.id,
            'special': gift.isSpecial,
            'limited': gift.isLimited
          }"
          @click="selectGift(gift)"
        >
          <div class="gift-icon">{{ gift.icon }}</div>
          <div class="gift-name">{{ gift.name }}</div>
          <div class="gift-price">
            <el-icon><Money /></el-icon>
            <span>{{ gift.price }}</span>
          </div>
          <div v-if="gift.isLimited" class="limited-badge">限量</div>
          <div v-if="gift.isSpecial" class="special-badge">特效</div>
        </div>
      </div>
    </div>

    <!-- 祝福语 -->
    <div class="blessing-section">
      <div class="section-header">
        <h3>祝福语</h3>
        <el-button text @click="showBlessingTemplates">选择模板</el-button>
      </div>
      <div class="blessing-input">
        <el-input
          v-model="blessingMessage"
          type="textarea"
          placeholder="写下你的祝福..."
          :rows="3"
          maxlength="100"
          show-word-limit
        />
      </div>
    </div>

    <!-- 发送选项 -->
    <div class="send-options">
      <div class="option-item">
        <div class="option-info">
          <div class="option-title">匿名发送</div>
          <div class="option-desc">对方不会知道是谁送的礼物</div>
        </div>
        <el-switch v-model="isAnonymous" />
      </div>
      <div class="option-item">
        <div class="option-info">
          <div class="option-title">公开显示</div>
          <div class="option-desc">在动态中显示送礼记录</div>
        </div>
        <el-switch v-model="isPublic" />
      </div>
    </div>

    <!-- 发送按钮 -->
    <div class="send-action">
      <div class="total-cost">
        <span>总计: </span>
        <span class="cost-amount">{{ totalCost }} 金币</span>
        <span v-if="totalCost > userCoins" class="insufficient-funds">余额不足</span>
      </div>
      <el-button 
        type="primary" 
        size="large"
        @click="sendGift"
        :disabled="!selectedGift || totalCost > userCoins"
        class="send-button"
      >
        <el-icon><Present /></el-icon>
        发送礼物
      </el-button>
    </div>

    <!-- 祝福语模板弹窗 -->
    <el-dialog 
      v-model="showTemplatesDialog" 
      title="祝福语模板"
      width="90%"
      class="templates-dialog"
    >
      <div class="templates-content">
        <div class="template-categories">
          <div 
            v-for="category in templateCategories" 
            :key="category.id"
            class="template-category"
            :class="{ active: activeTemplateCategory === category.id }"
            @click="activeTemplateCategory = category.id"
          >
            {{ category.name }}
          </div>
        </div>
        <div class="templates-list">
          <div 
            v-for="template in filteredTemplates" 
            :key="template.id"
            class="template-item"
            @click="selectTemplate(template)"
          >
            <div class="template-text">{{ template.text }}</div>
            <div class="template-usage">
              使用次数: {{ template.usage }}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 发送成功弹窗 -->
    <el-dialog 
      v-model="showSuccessDialog" 
      title=""
      width="90%"
      class="success-dialog"
      :show-close="false"
    >
      <div class="success-content">
        <div class="success-animation">
          <div class="success-icon">🎉</div>
          <div class="success-effects">
            <div class="effect" v-for="i in 8" :key="i"></div>
          </div>
        </div>
        <div class="success-message">
          <div class="success-title">礼物发送成功！</div>
          <div class="success-desc">
            你的礼物已成功发送给 {{ receiverInfo.name }}
          </div>
        </div>
        <div class="success-actions">
          <el-button type="primary" @click="sendAnother">再送一个</el-button>
          <el-button @click="goBack">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Money, 
  Present 
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 响应式数据
const userCoins = ref(1500)
const selectedGift = ref<any>(null)
const selectedAmount = ref(1)
const blessingMessage = ref('')
const isAnonymous = ref(false)
const isPublic = ref(true)
const showTemplatesDialog = ref(false)
const showSuccessDialog = ref(false)
const activeTemplateCategory = ref('love')

const receiverInfo = ref({
  id: route.params.id as string || '123456789',
  name: '小红',
  avatar: 'https://picsum.photos/200/200?random=1',
  level: 8,
  levelName: '高级用户',
  receivedGifts: 156,
  sentGifts: 89
})

const quickAmounts = ref([1, 3, 5, 10])

const availableGifts = ref([
  {
    id: 1,
    name: '小爱心',
    icon: '💕',
    price: 10,
    isSpecial: false,
    isLimited: false
  },
  {
    id: 2,
    name: '大爱心',
    icon: '💖',
    price: 50,
    isSpecial: true,
    isLimited: false
  },
  {
    id: 3,
    name: '钻石爱心',
    icon: '💎',
    price: 200,
    isSpecial: true,
    isLimited: true
  },
  {
    id: 4,
    name: '小烟花',
    icon: '🎆',
    price: 30,
    isSpecial: false,
    isLimited: false
  },
  {
    id: 5,
    name: '大烟花',
    icon: '🎇',
    price: 100,
    isSpecial: true,
    isLimited: false
  },
  {
    id: 6,
    name: '彩虹',
    icon: '🌈',
    price: 80,
    isSpecial: true,
    isLimited: false
  },
  {
    id: 7,
    name: '小蛋糕',
    icon: '🍰',
    price: 15,
    isSpecial: false,
    isLimited: false
  },
  {
    id: 8,
    name: '大蛋糕',
    icon: '🎂',
    price: 60,
    isSpecial: true,
    isLimited: false
  },
  {
    id: 9,
    name: '小猫咪',
    icon: '🐱',
    price: 20,
    isSpecial: false,
    isLimited: false
  },
  {
    id: 10,
    name: '小狗狗',
    icon: '🐶',
    price: 25,
    isSpecial: false,
    isLimited: false
  },
  {
    id: 11,
    name: '流星',
    icon: '☄️',
    price: 150,
    isSpecial: true,
    isLimited: true
  },
  {
    id: 12,
    name: '星星',
    icon: '⭐',
    price: 40,
    isSpecial: false,
    isLimited: false
  }
])

const templateCategories = ref([
  { id: 'love', name: '爱情' },
  { id: 'birthday', name: '生日' },
  { id: 'celebration', name: '庆祝' },
  { id: 'encouragement', name: '鼓励' },
  { id: 'friendship', name: '友谊' }
])

const blessingTemplates = ref([
  {
    id: 1,
    category: 'love',
    text: '愿你的每一天都充满爱与温暖 💖',
    usage: 1234
  },
  {
    id: 2,
    category: 'love',
    text: '你是我心中最亮的星 ⭐',
    usage: 892
  },
  {
    id: 3,
    category: 'birthday',
    text: '生日快乐！愿你永远年轻美丽 🎂',
    usage: 567
  },
  {
    id: 4,
    category: 'birthday',
    text: '祝你生日快乐，心想事成！🎉',
    usage: 445
  },
  {
    id: 5,
    category: 'celebration',
    text: '恭喜恭喜！为你感到高兴 🎊',
    usage: 334
  },
  {
    id: 6,
    category: 'celebration',
    text: '值得庆祝的时刻！干杯！🥂',
    usage: 223
  },
  {
    id: 7,
    category: 'encouragement',
    text: '加油！相信你可以的！💪',
    usage: 678
  },
  {
    id: 8,
    category: 'encouragement',
    text: '困难只是暂时的，坚持就是胜利！🌟',
    usage: 456
  },
  {
    id: 9,
    category: 'friendship',
    text: '友谊长存，永远的朋友！🤝',
    usage: 789
  },
  {
    id: 10,
    category: 'friendship',
    text: '有你这样的朋友真好！👫',
    usage: 345
  }
])

// 计算属性
const totalCost = computed(() => {
  if (!selectedGift.value) return 0
  return selectedGift.value.price * selectedAmount.value
})

const filteredTemplates = computed(() => {
  return blessingTemplates.value.filter(template => 
    template.category === activeTemplateCategory.value
  )
})

// 方法
const goBack = () => {
  router.back()
}

const selectGift = (gift: any) => {
  selectedGift.value = gift
}

const showBlessingTemplates = () => {
  showTemplatesDialog.value = true
}

const selectTemplate = (template: any) => {
  blessingMessage.value = template.text
  showTemplatesDialog.value = false
}

const sendGift = () => {
  if (!selectedGift.value) {
    ElMessage.warning('请选择礼物')
    return
  }
  
  if (totalCost.value > userCoins.value) {
    ElMessage.warning('金币余额不足')
    return
  }
  
  // 模拟发送礼物
  userCoins.value -= totalCost.value
  showSuccessDialog.value = true
  
  // 更新接收者统计
  receiverInfo.value.receivedGifts += selectedAmount.value
  
  ElMessage.success(`成功发送 ${selectedAmount.value} 个 ${selectedGift.value.name}`)
}

const sendAnother = () => {
  showSuccessDialog.value = false
  selectedGift.value = null
  selectedAmount.value = 1
  blessingMessage.value = ''
}
</script>

<style lang="scss" scoped>
.gift-send-page {
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
  }
}

.receiver-info {
  padding: 20px;

  .receiver-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 25px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(196, 181, 253, 0.3);

    .receiver-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid rgba(139, 92, 246, 0.3);
      box-shadow: 0 5px 20px rgba(139, 92, 246, 0.2);
    }

    .receiver-details {
      flex: 1;

      .receiver-name {
        font-size: 20px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 5px;
      }

      .receiver-id {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 10px;
      }

      .receiver-level {
        display: flex;
        align-items: center;
        gap: 10px;

        .level-badge {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .level-name {
          font-size: 14px;
          color: #64748b;
        }
      }
    }

    .receiver-stats {
      display: flex;
      gap: 20px;

      .stat-item {
        text-align: center;

        .stat-value {
          display: block;
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 3px;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
        }
      }
    }
  }
}

.gift-selection {
  padding: 0 20px;
  margin-bottom: 30px;

  .selection-header {
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

    .quick-amounts {
      display: flex;
      gap: 10px;

      .quick-amount {
        padding: 8px 16px;
        background: rgba(139, 92, 246, 0.1);
        color: #8b5cf6;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(139, 92, 246, 0.2);
        }

        &.active {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
        }
      }
    }
  }

  .gifts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;

    .gift-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px 15px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(196, 181, 253, 0.2);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
      }

      &.selected {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
        border-color: rgba(139, 92, 246, 0.5);
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(139, 92, 246, 0.3);
      }

      &.special {
        border-color: rgba(168, 85, 247, 0.3);
      }

      &.limited {
        border-color: rgba(245, 158, 11, 0.3);
      }

      .gift-icon {
        font-size: 32px;
      }

      .gift-name {
        font-size: 13px;
        font-weight: 600;
        color: #1e293b;
        text-align: center;
      }

      .gift-price {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #f59e0b;
        font-weight: 600;
        font-size: 12px;

        .el-icon {
          font-size: 12px;
        }
      }

      .limited-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #f59e0b;
        color: white;
        font-size: 9px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 8px;
      }

      .special-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        background: #a855f7;
        color: white;
        font-size: 9px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 8px;
      }
    }
  }
}

.blessing-section {
  padding: 0 20px;
  margin-bottom: 30px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

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

  .blessing-input {
    .el-textarea {
      .el-textarea__inner {
        border-radius: 12px;
        background: rgba(139, 92, 246, 0.05);
        border: 1px solid rgba(139, 92, 246, 0.1);
        color: #334155;

        &::placeholder {
          color: #94a3b8;
        }
      }
    }
  }
}

.send-options {
  padding: 0 20px;
  margin-bottom: 30px;

  .option-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    margin-bottom: 15px;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);

    .option-info {
      flex: 1;

      .option-title {
        font-size: 15px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 5px;
      }

      .option-desc {
        font-size: 13px;
        color: #64748b;
        line-height: 1.4;
      }
    }

    .el-switch {
      &.is-checked {
        .el-switch__core {
          background-color: #8b5cf6;
          border-color: #8b5cf6;
        }
      }
    }
  }
}

.send-action {
  padding: 0 20px 20px;
  position: sticky;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(196, 181, 253, 0.2);

  .total-cost {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
    font-size: 18px;
    color: #1e293b;

    .cost-amount {
      font-weight: 700;
      color: #f59e0b;
    }

    .insufficient-funds {
      font-size: 12px;
      color: #ef4444;
    }
  }

  .send-button {
    width: 100%;
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
    border: none;
    color: white;
    font-weight: 600;
    padding: 15px 25px;
    border-radius: 20px;
    font-size: 16px;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
    }

    &:disabled {
      background: rgba(148, 163, 184, 0.3);
      color: rgba(148, 163, 184, 0.8);
    }

    .el-icon {
      margin-right: 8px;
    }
  }
}

.templates-dialog {
  .templates-content {
    .template-categories {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      overflow-x: auto;
      padding-bottom: 10px;

      .template-category {
        padding: 10px 20px;
        background: rgba(139, 92, 246, 0.1);
        color: #8b5cf6;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;

        &:hover {
          background: rgba(139, 92, 246, 0.2);
        }

        &.active {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
        }
      }
    }

    .templates-list {
      display: flex;
      flex-direction: column;
      gap: 15px;

      .template-item {
        padding: 15px;
        background: rgba(139, 92, 246, 0.05);
        border-radius: 12px;
        border: 1px solid rgba(139, 92, 246, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(139, 92, 246, 0.1);
          transform: translateY(-1px);
        }

        .template-text {
          font-size: 15px;
          color: #1e293b;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .template-usage {
          font-size: 12px;
          color: #64748b;
        }
      }
    }
  }
}

.success-dialog {
  .success-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .success-animation {
      position: relative;
      width: 120px;
      height: 120px;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      justify-content: center;

      .success-icon {
        font-size: 64px;
        z-index: 2;
      }

      .success-effects {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        .effect {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #f59e0b;
          border-radius: 50%;
          animation: celebrate 2s infinite;

          &:nth-child(1) {
            top: 20px;
            left: 20px;
            animation-delay: 0s;
          }

          &:nth-child(2) {
            top: 20px;
            right: 20px;
            animation-delay: 0.2s;
          }

          &:nth-child(3) {
            bottom: 20px;
            left: 20px;
            animation-delay: 0.4s;
          }

          &:nth-child(4) {
            bottom: 20px;
            right: 20px;
            animation-delay: 0.6s;
          }

          &:nth-child(5) {
            top: 50%;
            left: 10px;
            animation-delay: 0.8s;
          }

          &:nth-child(6) {
            top: 50%;
            right: 10px;
            animation-delay: 1s;
          }

          &:nth-child(7) {
            top: 10px;
            left: 50%;
            animation-delay: 1.2s;
          }

          &:nth-child(8) {
            bottom: 10px;
            left: 50%;
            animation-delay: 1.4s;
          }
        }
      }
    }

    .success-message {
      margin-bottom: 30px;

      .success-title {
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 10px;
      }

      .success-desc {
        font-size: 16px;
        color: #64748b;
        line-height: 1.5;
      }
    }

    .success-actions {
      display: flex;
      gap: 15px;

      .el-button {
        padding: 12px 25px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 16px;

        &.el-button--primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border: none;
          color: white;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
          }
        }

        &:not(.el-button--primary) {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #8b5cf6;

          &:hover {
            background: rgba(139, 92, 246, 0.2);
          }
        }
      }
    }
  }
}

@keyframes celebrate {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
