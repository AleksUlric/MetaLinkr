<template>
  <div class="payment-settings-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">支付设置</h1>
        <p class="page-subtitle">配置您的支付方式和收款设置</p>
      </div>
      <div class="header-right">
        <el-button type="primary" size="large" @click="savePaymentSettings">
          <el-icon><Check /></el-icon>
          保存设置
        </el-button>
      </div>
    </div>
    
    <div class="content-grid">
      <!-- PayPal设置 -->
      <div class="payment-section">
        <div class="section-header">
          <div class="header-left">
            <div class="payment-logo">
              <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" />
            </div>
            <div class="payment-info">
              <h2>PayPal</h2>
              <p>全球领先的在线支付平台</p>
            </div>
          </div>
          <el-switch v-model="paymentSettings.paypal.enabled" />
        </div>
        
        <div v-if="paymentSettings.paypal.enabled" class="payment-config">
          <el-form :model="paymentSettings.paypal" label-width="120px">
            <el-form-item label="PayPal账户">
              <el-input v-model="paymentSettings.paypal.email" placeholder="请输入PayPal邮箱" />
            </el-form-item>
            
            <el-form-item label="账户类型">
              <el-radio-group v-model="paymentSettings.paypal.accountType">
                <el-radio label="personal">个人账户</el-radio>
                <el-radio label="business">企业账户</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="支付方式">
              <el-checkbox-group v-model="paymentSettings.paypal.methods">
                <el-checkbox label="paypal">PayPal账户</el-checkbox>
                <el-checkbox label="creditcard">信用卡/借记卡</el-checkbox>
                <el-checkbox label="paylater">Pay Later</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            
            <el-form-item label="货币">
              <el-select v-model="paymentSettings.paypal.currency" placeholder="选择货币">
                <el-option label="美元 (USD)" value="USD" />
                <el-option label="欧元 (EUR)" value="EUR" />
                <el-option label="英镑 (GBP)" value="GBP" />
                <el-option label="人民币 (CNY)" value="CNY" />
                <el-option label="日元 (JPY)" value="JPY" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="测试模式">
              <el-switch v-model="paymentSettings.paypal.sandbox" />
              <span class="form-tip">开启后将使用PayPal沙盒环境进行测试</span>
            </el-form-item>
          </el-form>
          
          <div class="payment-status">
            <el-tag :type="paymentSettings.paypal.connected ? 'success' : 'warning'">
              {{ paymentSettings.paypal.connected ? '已连接' : '未连接' }}
            </el-tag>
            <el-button type="primary" size="small" @click="connectPayPal">
              {{ paymentSettings.paypal.connected ? '重新连接' : '连接PayPal' }}
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- Stripe设置 -->
      <div class="payment-section">
        <div class="section-header">
          <div class="header-left">
            <div class="payment-logo">
              <img src="https://stripe.com/img/v3/home/social.png" alt="Stripe" />
            </div>
            <div class="payment-info">
              <h2>Stripe</h2>
              <p>现代化的在线支付处理平台</p>
            </div>
          </div>
          <el-switch v-model="paymentSettings.stripe.enabled" />
        </div>
        
        <div v-if="paymentSettings.stripe.enabled" class="payment-config">
          <el-form :model="paymentSettings.stripe" label-width="120px">
            <el-form-item label="发布密钥">
              <el-input 
                v-model="paymentSettings.stripe.publishableKey" 
                placeholder="pk_test_..." 
                type="password"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="密钥">
              <el-input 
                v-model="paymentSettings.stripe.secretKey" 
                placeholder="sk_test_..." 
                type="password"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="支付方式">
              <el-checkbox-group v-model="paymentSettings.stripe.methods">
                <el-checkbox label="card">信用卡/借记卡</el-checkbox>
                <el-checkbox label="alipay">支付宝</el-checkbox>
                <el-checkbox label="wechat">微信支付</el-checkbox>
                <el-checkbox label="bank_transfer">银行转账</el-checkbox>
                <el-checkbox label="klarna">Klarna</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            
            <el-form-item label="支持货币">
              <el-select v-model="paymentSettings.stripe.currencies" multiple placeholder="选择支持的货币">
                <el-option label="美元 (USD)" value="usd" />
                <el-option label="欧元 (EUR)" value="eur" />
                <el-option label="英镑 (GBP)" value="gbp" />
                <el-option label="人民币 (CNY)" value="cny" />
                <el-option label="日元 (JPY)" value="jpy" />
                <el-option label="澳元 (AUD)" value="aud" />
                <el-option label="加元 (CAD)" value="cad" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="测试模式">
              <el-switch v-model="paymentSettings.stripe.testMode" />
              <span class="form-tip">开启后将使用Stripe测试环境</span>
            </el-form-item>
          </el-form>
          
          <div class="payment-status">
            <el-tag :type="paymentSettings.stripe.connected ? 'success' : 'warning'">
              {{ paymentSettings.stripe.connected ? '已连接' : '未连接' }}
            </el-tag>
            <el-button type="primary" size="small" @click="connectStripe">
              {{ paymentSettings.stripe.connected ? '重新连接' : '连接Stripe' }}
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 本地支付方式 -->
      <div class="payment-section">
        <div class="section-header">
          <div class="header-left">
            <div class="payment-logo">
              <el-icon class="local-payment-icon"><CreditCard /></el-icon>
            </div>
            <div class="payment-info">
              <h2>本地支付</h2>
              <p>支持各国本地支付方式</p>
            </div>
          </div>
          <el-switch v-model="paymentSettings.local.enabled" />
        </div>
        
        <div v-if="paymentSettings.local.enabled" class="payment-config">
          <el-form :model="paymentSettings.local" label-width="120px">
            <el-form-item label="支付方式">
              <el-checkbox-group v-model="paymentSettings.local.methods">
                <el-checkbox label="alipay">支付宝</el-checkbox>
                <el-checkbox label="wechat">微信支付</el-checkbox>
                <el-checkbox label="unionpay">银联</el-checkbox>
                <el-checkbox label="apple_pay">Apple Pay</el-checkbox>
                <el-checkbox label="google_pay">Google Pay</el-checkbox>
                <el-checkbox label="amazon_pay">Amazon Pay</el-checkbox>
                <el-checkbox label="klarna">Klarna</el-checkbox>
                <el-checkbox label="sepa">SEPA</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            
            <el-form-item label="银行转账">
              <el-switch v-model="paymentSettings.local.bankTransfer" />
            </el-form-item>
            
            <el-form-item v-if="paymentSettings.local.bankTransfer" label="银行信息">
              <el-input
                v-model="paymentSettings.local.bankInfo"
                type="textarea"
                :rows="4"
                placeholder="请输入银行账户信息"
              />
            </el-form-item>
            
            <el-form-item label="货到付款">
              <el-switch v-model="paymentSettings.local.cod" />
            </el-form-item>
            
            <el-form-item v-if="paymentSettings.local.cod" label="COD费用">
              <el-input-number 
                v-model="paymentSettings.local.codFee" 
                :min="0" 
                :precision="2"
                placeholder="0.00"
              />
              <span class="form-tip">货到付款手续费</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <!-- 支付配置 -->
      <div class="payment-section">
        <div class="section-header">
          <div class="header-left">
            <div class="payment-info">
              <h2>支付配置</h2>
              <p>通用支付设置</p>
            </div>
          </div>
        </div>
        
        <el-form :model="paymentSettings.general" label-width="120px">
          <el-form-item label="默认货币">
            <el-select v-model="paymentSettings.general.defaultCurrency" placeholder="选择默认货币">
              <el-option label="美元 (USD)" value="USD" />
              <el-option label="欧元 (EUR)" value="EUR" />
              <el-option label="英镑 (GBP)" value="GBP" />
              <el-option label="人民币 (CNY)" value="CNY" />
              <el-option label="日元 (JPY)" value="JPY" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="自动汇率">
            <el-switch v-model="paymentSettings.general.autoExchange" />
            <span class="form-tip">自动根据实时汇率转换价格</span>
          </el-form-item>
          
          <el-form-item label="支付超时">
            <el-input-number 
              v-model="paymentSettings.general.timeout" 
              :min="5" 
              :max="60"
              placeholder="15"
            />
            <span class="form-tip">分钟</span>
          </el-form-item>
          
          <el-form-item label="退款政策">
            <el-input
              v-model="paymentSettings.general.refundPolicy"
              type="textarea"
              :rows="3"
              placeholder="请输入退款政策说明"
            />
          </el-form-item>
          
          <el-form-item label="支付成功页面">
            <el-input v-model="paymentSettings.general.successUrl" placeholder="支付成功后的跳转页面" />
          </el-form-item>
          
          <el-form-item label="支付失败页面">
            <el-input v-model="paymentSettings.general.failureUrl" placeholder="支付失败后的跳转页面" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    
    <!-- 支付测试 -->
    <div class="payment-test-section">
      <div class="section-header">
        <h2>支付测试</h2>
        <p>测试您的支付配置是否正常工作</p>
      </div>
      
      <div class="test-options">
        <el-button type="primary" @click="testPayPal">
          <el-icon><CreditCard /></el-icon>
          测试PayPal支付
        </el-button>
        <el-button type="success" @click="testStripe">
          <el-icon><CreditCard /></el-icon>
          测试Stripe支付
        </el-button>
        <el-button type="warning" @click="testLocalPayment">
          <el-icon><CreditCard /></el-icon>
          测试本地支付
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, CreditCard } from '@element-plus/icons-vue'

// 响应式数据
const paymentSettings = reactive({
  paypal: {
    enabled: false,
    email: '',
    accountType: 'business',
    methods: ['paypal', 'creditcard'],
    currency: 'USD',
    sandbox: true,
    connected: false
  },
  stripe: {
    enabled: false,
    publishableKey: '',
    secretKey: '',
    methods: ['card'],
    currencies: ['usd'],
    testMode: true,
    connected: false
  },
  local: {
    enabled: false,
    methods: ['alipay', 'wechat'],
    bankTransfer: false,
    bankInfo: '',
    cod: false,
    codFee: 0
  },
  general: {
    defaultCurrency: 'USD',
    autoExchange: true,
    timeout: 15,
    refundPolicy: '我们提供30天无理由退款服务',
    successUrl: '/payment/success',
    failureUrl: '/payment/failure'
  }
})

// 方法
const savePaymentSettings = async () => {
  try {
    // 验证必填字段
    if (paymentSettings.paypal.enabled && !paymentSettings.paypal.email) {
      ElMessage.error('请输入PayPal邮箱')
      return
    }
    if (paymentSettings.stripe.enabled && (!paymentSettings.stripe.publishableKey || !paymentSettings.stripe.secretKey)) {
      ElMessage.error('请输入Stripe密钥')
      return
    }
    
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('支付设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  }
}

const connectPayPal = async () => {
  try {
    await ElMessageBox.confirm('这将跳转到PayPal进行账户连接，确定继续吗？', '连接PayPal', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    // 模拟连接过程
    ElMessage.info('正在连接PayPal...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    paymentSettings.paypal.connected = true
    ElMessage.success('PayPal连接成功')
  } catch {
    // 用户取消
  }
}

const connectStripe = async () => {
  try {
    await ElMessageBox.confirm('这将跳转到Stripe进行账户连接，确定继续吗？', '连接Stripe', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    // 模拟连接过程
    ElMessage.info('正在连接Stripe...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    paymentSettings.stripe.connected = true
    ElMessage.success('Stripe连接成功')
  } catch {
    // 用户取消
  }
}

const testPayPal = () => {
  if (!paymentSettings.paypal.enabled) {
    ElMessage.warning('请先启用PayPal支付')
    return
  }
  
  ElMessage.info('PayPal支付测试功能开发中...')
}

const testStripe = () => {
  if (!paymentSettings.stripe.enabled) {
    ElMessage.warning('请先启用Stripe支付')
    return
  }
  
  ElMessage.info('Stripe支付测试功能开发中...')
}

const testLocalPayment = () => {
  if (!paymentSettings.local.enabled) {
    ElMessage.warning('请先启用本地支付')
    return
  }
  
  ElMessage.info('本地支付测试功能开发中...')
}

onMounted(() => {
  // 加载支付设置
  loadPaymentSettings()
})

const loadPaymentSettings = () => {
  // 模拟加载数据
  Object.assign(paymentSettings, {
    paypal: {
      enabled: true,
      email: 'merchant@example.com',
      accountType: 'business',
      methods: ['paypal', 'creditcard'],
      currency: 'USD',
      sandbox: true,
      connected: true
    },
    stripe: {
      enabled: true,
      publishableKey: 'pk_test_...',
      secretKey: 'sk_test_...',
      methods: ['card', 'alipay'],
      currencies: ['usd', 'eur'],
      testMode: true,
      connected: true
    },
    local: {
      enabled: true,
      methods: ['alipay', 'wechat', 'apple_pay'],
      bankTransfer: true,
      bankInfo: '中国银行\n账户名：示例科技有限公司\n账号：1234567890123456',
      cod: true,
      codFee: 10.00
    }
  })
}
</script>

<style lang="scss" scoped>
.payment-settings-page {
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.payment-section {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--saas-border-light);
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
      
      .payment-logo {
        width: 60px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--saas-bg-tertiary);
        border-radius: 8px;
        border: 1px solid var(--saas-border-light);
        
        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .local-payment-icon {
          font-size: 24px;
          color: var(--saas-primary);
        }
      }
      
      .payment-info {
        h2 {
          font-size: 20px;
          font-weight: 600;
          color: var(--saas-text-primary);
          margin-bottom: 4px;
        }
        
        p {
          font-size: 14px;
          color: var(--saas-text-secondary);
        }
      }
    }
  }
}

.payment-config {
  .el-form-item {
    margin-bottom: 20px;
  }
  
  .form-tip {
    font-size: 12px;
    color: var(--saas-text-tertiary);
    margin-left: 8px;
  }
}

.payment-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--saas-border-light);
}

.payment-test-section {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  
  .section-header {
    margin-bottom: 24px;
    
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
  
  .test-options {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    
    .el-button {
      .el-icon {
        margin-right: 8px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .payment-settings-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .payment-section {
    .section-header {
      .header-left {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  }
  
  .test-options {
    flex-direction: column;
    
    .el-button {
      width: 100%;
    }
  }
}
</style>
