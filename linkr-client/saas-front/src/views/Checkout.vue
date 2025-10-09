<template>
  <div class="checkout-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">结账</h1>
        <p class="page-subtitle">完成您的订单</p>
      </div>
      <div class="checkout-steps">
        <el-steps :active="currentStep" finish-status="success">
          <el-step title="配送信息" />
          <el-step title="支付方式" />
          <el-step title="确认订单" />
        </el-steps>
      </div>
    </div>
    
    <div class="checkout-content">
      <div class="checkout-main">
        <!-- 步骤1: 配送信息 -->
        <div v-if="currentStep === 0" class="step-content">
          <div class="step-header">
            <h2>配送信息</h2>
            <p>请填写收货地址和联系方式</p>
          </div>
          
          <el-form :model="shippingForm" :rules="shippingRules" ref="shippingFormRef" label-width="100px">
            <div class="form-section">
              <h3>收货地址</h3>
              
              <el-form-item label="收货人" prop="name">
                <el-input v-model="shippingForm.name" placeholder="请输入收货人姓名" />
              </el-form-item>
              
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="shippingForm.phone" placeholder="请输入手机号码" />
              </el-form-item>
              
              <el-form-item label="所在地区" prop="region">
                <el-cascader
                  v-model="shippingForm.region"
                  :options="regionOptions"
                  placeholder="请选择省市区"
                  style="width: 100%"
                />
              </el-form-item>
              
              <el-form-item label="详细地址" prop="address">
                <el-input
                  v-model="shippingForm.address"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入详细地址"
                />
              </el-form-item>
              
              <el-form-item label="邮政编码">
                <el-input v-model="shippingForm.postalCode" placeholder="请输入邮政编码" />
              </el-form-item>
            </div>
            
            <div class="form-section">
              <h3>配送方式</h3>
              
              <div class="shipping-options">
                <div 
                  v-for="option in shippingOptions" 
                  :key="option.id"
                  class="shipping-option"
                  :class="{ selected: shippingForm.shippingMethod === option.id }"
                  @click="selectShippingMethod(option.id)"
                >
                  <el-radio v-model="shippingForm.shippingMethod" :label="option.id">
                    <div class="option-content">
                      <div class="option-header">
                        <span class="option-name">{{ option.name }}</span>
                        <span class="option-price">
                          {{ option.price === 0 ? '免费' : `¥${option.price}` }}
                        </span>
                      </div>
                      <p class="option-desc">{{ option.description }}</p>
                      <p class="option-time">{{ option.deliveryTime }}</p>
                    </div>
                  </el-radio>
                </div>
              </div>
            </div>
            
            <div class="form-section">
              <h3>发票信息</h3>
              
              <el-form-item label="发票类型">
                <el-radio-group v-model="shippingForm.invoiceType">
                  <el-radio label="none">不需要发票</el-radio>
                  <el-radio label="personal">个人发票</el-radio>
                  <el-radio label="company">公司发票</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item v-if="shippingForm.invoiceType === 'company'" label="发票抬头" prop="invoiceTitle">
                <el-input v-model="shippingForm.invoiceTitle" placeholder="请输入发票抬头" />
              </el-form-item>
              
              <el-form-item v-if="shippingForm.invoiceType === 'company'" label="税号" prop="taxNumber">
                <el-input v-model="shippingForm.taxNumber" placeholder="请输入税号" />
              </el-form-item>
            </div>
          </el-form>
        </div>
        
        <!-- 步骤2: 支付方式 -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="step-header">
            <h2>支付方式</h2>
            <p>请选择支付方式</p>
          </div>
          
          <div class="payment-methods">
            <div 
              v-for="method in paymentMethods" 
              :key="method.id"
              class="payment-method"
              :class="{ selected: paymentForm.method === method.id, disabled: !method.enabled }"
              @click="selectPaymentMethod(method.id)"
            >
              <el-radio v-model="paymentForm.method" :label="method.id" :disabled="!method.enabled">
                <div class="method-content">
                  <div class="method-logo">
                    <img :src="method.logo" :alt="method.name" />
                  </div>
                  <div class="method-info">
                    <h4 class="method-name">{{ method.name }}</h4>
                    <p class="method-desc">{{ method.description }}</p>
                  </div>
                  <div class="method-status">
                    <el-tag v-if="method.enabled" type="success" size="small">可用</el-tag>
                    <el-tag v-else type="info" size="small">暂不可用</el-tag>
                  </div>
                </div>
              </el-radio>
            </div>
          </div>
          
          <!-- 支付表单 -->
          <div v-if="paymentForm.method" class="payment-form">
            <div v-if="paymentForm.method === 'creditcard'" class="credit-card-form">
              <h3>信用卡信息</h3>
              <el-form :model="paymentForm.cardInfo" label-width="100px">
                <el-form-item label="卡号">
                  <el-input v-model="paymentForm.cardInfo.number" placeholder="1234 5678 9012 3456" />
                </el-form-item>
                <el-form-item label="持卡人姓名">
                  <el-input v-model="paymentForm.cardInfo.name" placeholder="请输入持卡人姓名" />
                </el-form-item>
                <div class="form-row">
                  <el-form-item label="有效期">
                    <el-input v-model="paymentForm.cardInfo.expiry" placeholder="MM/YY" />
                  </el-form-item>
                  <el-form-item label="CVV">
                    <el-input v-model="paymentForm.cardInfo.cvv" placeholder="123" />
                  </el-form-item>
                </div>
              </el-form>
            </div>
            
            <div v-if="paymentForm.method === 'alipay'" class="alipay-form">
              <div class="payment-qr">
                <div class="qr-placeholder">
                  <el-icon class="qr-icon"><QrCode /></el-icon>
                  <p>请使用支付宝扫描二维码支付</p>
                </div>
              </div>
            </div>
            
            <div v-if="paymentForm.method === 'wechat'" class="wechat-form">
              <div class="payment-qr">
                <div class="qr-placeholder">
                  <el-icon class="qr-icon"><QrCode /></el-icon>
                  <p>请使用微信扫描二维码支付</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 步骤3: 确认订单 -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="step-header">
            <h2>确认订单</h2>
            <p>请确认您的订单信息</p>
          </div>
          
          <div class="order-summary">
            <div class="summary-section">
              <h3>收货信息</h3>
              <div class="shipping-info">
                <p><strong>{{ shippingForm.name }}</strong> {{ shippingForm.phone }}</p>
                <p>{{ getRegionText(shippingForm.region) }} {{ shippingForm.address }}</p>
              </div>
            </div>
            
            <div class="summary-section">
              <h3>商品清单</h3>
              <div class="order-items">
                <div 
                  v-for="item in orderItems" 
                  :key="item.id"
                  class="order-item"
                >
                  <el-image
                    :src="item.image"
                    fit="cover"
                    class="item-image"
                  >
                    <template #error>
                      <div class="image-error">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                  <div class="item-info">
                    <h4 class="item-name">{{ item.name }}</h4>
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
                  <div class="item-quantity">x{{ item.quantity }}</div>
                  <div class="item-price">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
                </div>
              </div>
            </div>
            
            <div class="summary-section">
              <h3>费用明细</h3>
              <div class="cost-breakdown">
                <div class="cost-row">
                  <span>商品总价</span>
                  <span>¥{{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="cost-row">
                  <span>运费</span>
                  <span>{{ selectedShipping.price === 0 ? '免费' : `¥${selectedShipping.price.toFixed(2)}` }}</span>
                </div>
                <div class="cost-row">
                  <span>税费</span>
                  <span>¥{{ tax.toFixed(2) }}</span>
                </div>
                <div v-if="discount > 0" class="cost-row discount">
                  <span>优惠</span>
                  <span>-¥{{ discount.toFixed(2) }}</span>
                </div>
                <el-divider />
                <div class="cost-row total">
                  <span>总计</span>
                  <span class="total-amount">¥{{ total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 订单摘要 -->
      <div class="checkout-sidebar">
        <div class="order-summary-card">
          <h3>订单摘要</h3>
          
          <div class="summary-items">
            <div 
              v-for="item in orderItems" 
              :key="item.id"
              class="summary-item"
            >
              <el-image
                :src="item.image"
                fit="cover"
                class="summary-image"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="summary-info">
                <h4 class="summary-name">{{ item.name }}</h4>
                <p class="summary-quantity">数量: {{ item.quantity }}</p>
              </div>
              <div class="summary-price">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
            </div>
          </div>
          
          <el-divider />
          
          <div class="summary-totals">
            <div class="total-row">
              <span>商品总价</span>
              <span>¥{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="total-row">
              <span>运费</span>
              <span>{{ selectedShipping.price === 0 ? '免费' : `¥${selectedShipping.price.toFixed(2)}` }}</span>
            </div>
            <div class="total-row">
              <span>税费</span>
              <span>¥{{ tax.toFixed(2) }}</span>
            </div>
            <div v-if="discount > 0" class="total-row discount">
              <span>优惠</span>
              <span>-¥{{ discount.toFixed(2) }}</span>
            </div>
            <el-divider />
            <div class="total-row final">
              <span>总计</span>
              <span class="final-amount">¥{{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="checkout-actions">
      <el-button v-if="currentStep > 0" @click="prevStep">
        上一步
      </el-button>
      <el-button 
        v-if="currentStep < 2" 
        type="primary" 
        @click="nextStep"
        :disabled="!canProceed"
      >
        下一步
      </el-button>
      <el-button 
        v-if="currentStep === 2" 
        type="primary" 
        size="large"
        @click="placeOrder"
        :loading="placingOrder"
      >
        确认下单
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { QrCode, Picture } from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const currentStep = ref(0)
const placingOrder = ref(false)

// 配送表单
const shippingForm = reactive({
  name: '',
  phone: '',
  region: [],
  address: '',
  postalCode: '',
  shippingMethod: '',
  invoiceType: 'none',
  invoiceTitle: '',
  taxNumber: ''
})

const shippingFormRef = ref()

// 支付表单
const paymentForm = reactive({
  method: '',
  cardInfo: {
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  }
})

// 订单商品
const orderItems = ref([
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    sku: 'IPH15PM-256',
    image: 'https://via.placeholder.com/60x60',
    price: 9999,
    quantity: 1,
    attributes: [
      { name: '颜色', value: '深空黑色' },
      { name: '存储', value: '256GB' }
    ]
  },
  {
    id: 2,
    name: 'MacBook Pro 16"',
    sku: 'MBP16-512',
    image: 'https://via.placeholder.com/60x60',
    price: 19999,
    quantity: 1,
    attributes: [
      { name: '颜色', value: '深空灰色' },
      { name: '存储', value: '512GB' }
    ]
  }
])

// 地区选项
const regionOptions = ref([
  {
    value: 'beijing',
    label: '北京市',
    children: [
      { value: 'dongcheng', label: '东城区' },
      { value: 'xicheng', label: '西城区' },
      { value: 'chaoyang', label: '朝阳区' }
    ]
  },
  {
    value: 'shanghai',
    label: '上海市',
    children: [
      { value: 'huangpu', label: '黄浦区' },
      { value: 'xuhui', label: '徐汇区' },
      { value: 'changning', label: '长宁区' }
    ]
  }
])

// 配送方式
const shippingOptions = ref([
  {
    id: 'standard',
    name: '标准配送',
    description: '3-5个工作日送达',
    deliveryTime: '预计3-5个工作日',
    price: 0
  },
  {
    id: 'express',
    name: '快递配送',
    description: '1-2个工作日送达',
    deliveryTime: '预计1-2个工作日',
    price: 20
  },
  {
    id: 'overnight',
    name: '次日达',
    description: '次日送达',
    deliveryTime: '预计次日送达',
    price: 50
  }
])

// 支付方式
const paymentMethods = ref([
  {
    id: 'creditcard',
    name: '信用卡/借记卡',
    description: '支持Visa、MasterCard、银联',
    logo: 'https://via.placeholder.com/40x25',
    enabled: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: '使用PayPal账户支付',
    logo: 'https://via.placeholder.com/40x25',
    enabled: true
  },
  {
    id: 'alipay',
    name: '支付宝',
    description: '使用支付宝扫码支付',
    logo: 'https://via.placeholder.com/40x25',
    enabled: true
  },
  {
    id: 'wechat',
    name: '微信支付',
    description: '使用微信扫码支付',
    logo: 'https://via.placeholder.com/40x25',
    enabled: true
  }
])

// 表单验证规则
const shippingRules = {
  name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  region: [
    { required: true, message: '请选择所在地区', trigger: 'change' }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
}

// 计算属性
const subtotal = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const selectedShipping = computed(() => {
  return shippingOptions.value.find(option => option.id === shippingForm.shippingMethod) || shippingOptions.value[0]
})

const tax = computed(() => {
  return subtotal.value * 0.1 // 10%税费
})

const discount = computed(() => {
  return 0 // 暂时没有优惠
})

const total = computed(() => {
  return subtotal.value + selectedShipping.value.price + tax.value - discount.value
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return shippingForm.name && shippingForm.phone && shippingForm.region.length > 0 && shippingForm.address && shippingForm.shippingMethod
    case 1:
      return paymentForm.method
    default:
      return true
  }
})

// 方法
const selectShippingMethod = (methodId: string) => {
  shippingForm.shippingMethod = methodId
}

const selectPaymentMethod = (methodId: string) => {
  const method = paymentMethods.value.find(m => m.id === methodId)
  if (method && method.enabled) {
    paymentForm.method = methodId
  }
}

const getRegionText = (region: string[]) => {
  // 这里应该根据region数组返回对应的地区文本
  return '北京市 朝阳区'
}

const nextStep = async () => {
  if (currentStep.value === 0) {
    // 验证配送信息
    try {
      await shippingFormRef.value.validate()
      currentStep.value++
    } catch (error) {
      ElMessage.error('请完善配送信息')
    }
  } else if (currentStep.value === 1) {
    // 验证支付方式
    if (!paymentForm.method) {
      ElMessage.error('请选择支付方式')
      return
    }
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const placeOrder = async () => {
  try {
    await ElMessageBox.confirm('确认提交订单吗？', '确认订单', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    placingOrder.value = true
    
    // 模拟下单过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('订单提交成功！')
    router.push('/dashboard/orders')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('订单提交失败，请重试')
    }
  } finally {
    placingOrder.value = false
  }
}

onMounted(() => {
  // 初始化默认值
  shippingForm.shippingMethod = shippingOptions.value[0].id
})
</script>

<style lang="scss" scoped>
.checkout-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
  
  .header-left {
    margin-bottom: 24px;
    
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
  
  .checkout-steps {
    :deep(.el-steps) {
      .el-step__title {
        font-size: 14px;
      }
    }
  }
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  margin-bottom: 32px;
}

.checkout-main {
  .step-content {
    background: var(--saas-bg-primary);
    border-radius: 12px;
    padding: 24px;
    box-shadow: var(--saas-shadow);
    border: 1px solid var(--saas-border-light);
    
    .step-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--saas-border-light);
      
      h2 {
        font-size: 20px;
        font-weight: 600;
        color: var(--saas-text-primary);
        margin-bottom: 8px;
      }
      
      p {
        font-size: 14px;
        color: var(--saas-text-secondary);
      }
    }
    
    .form-section {
      margin-bottom: 32px;
      
      h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--saas-text-primary);
        margin-bottom: 16px;
      }
    }
    
    .shipping-options {
      .shipping-option {
        border: 1px solid var(--saas-border-light);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          border-color: var(--saas-primary);
        }
        
        &.selected {
          border-color: var(--saas-primary);
          background: rgba(var(--saas-primary), 0.05);
        }
        
        .option-content {
          .option-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            
            .option-name {
              font-weight: 600;
              color: var(--saas-text-primary);
            }
            
            .option-price {
              font-weight: 600;
              color: var(--saas-primary);
            }
          }
          
          .option-desc {
            font-size: 14px;
            color: var(--saas-text-secondary);
            margin-bottom: 4px;
          }
          
          .option-time {
            font-size: 12px;
            color: var(--saas-text-tertiary);
          }
        }
      }
    }
    
    .payment-methods {
      .payment-method {
        border: 1px solid var(--saas-border-light);
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover:not(.disabled) {
          border-color: var(--saas-primary);
        }
        
        &.selected {
          border-color: var(--saas-primary);
          background: rgba(var(--saas-primary), 0.05);
        }
        
        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .method-content {
          display: flex;
          align-items: center;
          gap: 16px;
          
          .method-logo {
            width: 40px;
            height: 25px;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
          
          .method-info {
            flex: 1;
            
            .method-name {
              font-size: 16px;
              font-weight: 600;
              color: var(--saas-text-primary);
              margin-bottom: 4px;
            }
            
            .method-desc {
              font-size: 14px;
              color: var(--saas-text-secondary);
            }
          }
        }
      }
    }
    
    .payment-form {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--saas-border-light);
      
      h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--saas-text-primary);
        margin-bottom: 16px;
      }
      
      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      
      .payment-qr {
        text-align: center;
        padding: 40px;
        
        .qr-placeholder {
          .qr-icon {
            font-size: 64px;
            color: var(--saas-text-tertiary);
            margin-bottom: 16px;
          }
          
          p {
            font-size: 16px;
            color: var(--saas-text-secondary);
          }
        }
      }
    }
    
    .order-summary {
      .summary-section {
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--saas-border-light);
        
        &:last-child {
          border-bottom: none;
        }
        
        h3 {
          font-size: 16px;
          font-weight: 600;
          color: var(--saas-text-primary);
          margin-bottom: 12px;
        }
        
        .shipping-info {
          p {
            margin-bottom: 4px;
            color: var(--saas-text-secondary);
          }
        }
        
        .order-items {
          .order-item {
            display: grid;
            grid-template-columns: 60px 1fr auto auto;
            gap: 12px;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid var(--saas-border-light);
            
            &:last-child {
              border-bottom: none;
            }
            
            .item-image {
              width: 60px;
              height: 60px;
              border-radius: 6px;
              border: 1px solid var(--saas-border-light);
            }
            
            .item-info {
              .item-name {
                font-size: 14px;
                font-weight: 500;
                color: var(--saas-text-primary);
                margin-bottom: 4px;
              }
              
              .item-sku {
                font-size: 12px;
                color: var(--saas-text-tertiary);
                margin-bottom: 4px;
              }
              
              .item-attributes {
                display: flex;
                gap: 4px;
                flex-wrap: wrap;
              }
            }
            
            .item-quantity {
              text-align: center;
              color: var(--saas-text-secondary);
            }
            
            .item-price {
              text-align: right;
              font-weight: 600;
              color: var(--saas-text-primary);
            }
          }
        }
        
        .cost-breakdown {
          .cost-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            
            &.discount {
              color: var(--saas-success);
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
        }
      }
    }
  }
}

.checkout-sidebar {
  .order-summary-card {
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
    
    .summary-items {
      .summary-item {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
        
        .summary-image {
          width: 50px;
          height: 50px;
          border-radius: 6px;
          border: 1px solid var(--saas-border-light);
        }
        
        .summary-info {
          flex: 1;
          
          .summary-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--saas-text-primary);
            margin-bottom: 4px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .summary-quantity {
            font-size: 12px;
            color: var(--saas-text-tertiary);
          }
        }
        
        .summary-price {
          font-size: 14px;
          font-weight: 600;
          color: var(--saas-text-primary);
        }
      }
    }
    
    .summary-totals {
      .total-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 14px;
        
        &.discount {
          color: var(--saas-success);
        }
        
        &.final {
          font-size: 16px;
          font-weight: 600;
          color: var(--saas-text-primary);
          
          .final-amount {
            color: var(--saas-primary);
            font-size: 18px;
          }
        }
      }
    }
  }
}

.checkout-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-top: 1px solid var(--saas-border-light);
}

// 响应式设计
@media (max-width: 768px) {
  .checkout-page {
    padding: 16px;
  }
  
  .checkout-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .checkout-main {
    .step-content {
      padding: 16px;
      
      .form-row {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      
      .order-items {
        .order-item {
          grid-template-columns: 1fr;
          gap: 8px;
          text-align: center;
        }
      }
    }
  }
  
  .checkout-actions {
    flex-direction: column;
    gap: 12px;
    
    .el-button {
      width: 100%;
    }
  }
}
</style>
