<template>
  <div class="order-detail-page">
    <div class="order-header">
      <el-button type="text" @click="$router.back()" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <h2>订单详情</h2>
      <div></div>
    </div>

    <div class="order-status">
      <div class="status-icon">
        <el-icon size="40" color="#10b981">
          <Check />
        </el-icon>
      </div>
      <div class="status-info">
        <h3>订单已完成</h3>
        <p>感谢您的购买，期待下次光临</p>
      </div>
    </div>

    <div class="order-info">
      <div class="info-section">
        <h4>订单信息</h4>
        <div class="info-item">
          <span class="label">订单号:</span>
          <span class="value">{{ orderInfo.orderNo }}</span>
        </div>
        <div class="info-item">
          <span class="label">下单时间:</span>
          <span class="value">{{ orderInfo.orderTime }}</span>
        </div>
        <div class="info-item">
          <span class="label">支付方式:</span>
          <span class="value">{{ orderInfo.paymentMethod }}</span>
        </div>
      </div>

      <div class="info-section">
        <h4>收货信息</h4>
        <div class="info-item">
          <span class="label">收货人:</span>
          <span class="value">{{ orderInfo.receiverName }}</span>
        </div>
        <div class="info-item">
          <span class="label">联系电话:</span>
          <span class="value">{{ orderInfo.phone }}</span>
        </div>
        <div class="info-item">
          <span class="label">收货地址:</span>
          <span class="value">{{ orderInfo.address }}</span>
        </div>
      </div>
    </div>

    <div class="order-items">
      <h4>商品清单</h4>
      <div class="item-list">
        <div class="item-card" v-for="item in orderItems" :key="item.id">
          <el-image :src="item.image" class="item-image" />
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-spec">{{ item.spec }}</div>
            <div class="item-price">¥{{ item.price }}</div>
          </div>
          <div class="item-quantity">x{{ item.quantity }}</div>
        </div>
      </div>
    </div>

    <div class="order-summary">
      <div class="summary-item">
        <span class="label">商品总价:</span>
        <span class="value">¥{{ orderInfo.itemTotal }}</span>
      </div>
      <div class="summary-item">
        <span class="label">运费:</span>
        <span class="value">¥{{ orderInfo.shippingFee }}</span>
      </div>
      <div class="summary-item total">
        <span class="label">实付金额:</span>
        <span class="value">¥{{ orderInfo.totalAmount }}</span>
      </div>
    </div>

    <div class="order-actions">
      <el-button @click="contactService">联系客服</el-button>
      <el-button type="primary" @click="buyAgain">再次购买</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface OrderItem {
  id: string
  name: string
  image: string
  spec: string
  price: number
  quantity: number
}

const orderInfo = {
  orderNo: 'ML202401280001',
  orderTime: '2024-01-28 14:30:25',
  paymentMethod: '微信支付',
  receiverName: '张三',
  phone: '138****8888',
  address: '北京市朝阳区xxx街道xxx号',
  itemTotal: 298.00,
  shippingFee: 10.00,
  totalAmount: 308.00
}

const orderItems: OrderItem[] = [
  {
    id: '1',
    name: '宠物玩具球',
    image: 'https://picsum.photos/100/100?random=401',
    spec: '颜色: 红色, 尺寸: 中号',
    price: 29.90,
    quantity: 2
  },
  {
    id: '2',
    name: '宠物零食',
    image: 'https://picsum.photos/100/100?random=402',
    spec: '口味: 牛肉味',
    price: 39.90,
    quantity: 1
  }
]

const contactService = () => {
  console.log('联系客服')
}

const buyAgain = () => {
  console.log('再次购买')
}
</script>

<style scoped>
.order-detail-page {
  height: 100vh;
  background: #f9fafb;
  padding-bottom: 100px;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.order-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.back-btn {
  color: #6b7280;
}

.order-status {
  display: flex;
  align-items: center;
  padding: 24px 16px;
  background: white;
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.status-icon {
  margin-right: 16px;
}

.status-info h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.status-info p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.order-info {
  margin: 16px;
}

.info-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #6b7280;
  font-size: 14px;
}

.value {
  color: #1f2937;
  font-size: 14px;
  font-weight: 500;
}

.order-items {
  margin: 16px;
}

.order-items h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.item-list {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.item-card {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.item-card:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 12px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
  margin-bottom: 4px;
}

.item-spec {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.item-price {
  color: #ef4444;
  font-weight: 600;
  font-size: 16px;
}

.item-quantity {
  color: #6b7280;
  font-size: 14px;
}

.order-summary {
  background: white;
  margin: 16px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-item.total {
  font-weight: 600;
  font-size: 18px;
  color: #ef4444;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.order-actions {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.order-actions .el-button {
  flex: 1;
}
</style>

