<template>
  <div class="orders-page">
    <div class="page-header">
      <h1 class="page-title">订单管理</h1>
      <p class="page-subtitle">管理您的订单和发货</p>
    </div>
    
    <!-- 订单统计 -->
    <div class="order-stats">
      <div class="stat-item">
        <div class="stat-value">1,234</div>
        <div class="stat-label">总订单</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">¥45,678</div>
        <div class="stat-label">总金额</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">89</div>
        <div class="stat-label">待处理</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">1,145</div>
        <div class="stat-label">已完成</div>
      </div>
    </div>
    
    <!-- 筛选和搜索 -->
    <div class="filters-section">
      <div class="filters-left">
        <el-input
          v-model="searchQuery"
          placeholder="搜索订单号、客户名称..."
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select v-model="statusFilter" placeholder="订单状态" clearable>
          <el-option label="全部状态" value="" />
          <el-option label="待付款" value="pending" />
          <el-option label="已付款" value="paid" />
          <el-option label="已发货" value="shipped" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
        
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      
      <div class="filters-right">
        <el-button @click="resetFilters">重置</el-button>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    
    <!-- 订单列表 -->
    <div class="orders-table">
      <el-table :data="orders" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="id" label="订单号" width="120" />
        
        <el-table-column label="客户" width="150">
          <template #default="{ row }">
            <div class="customer-info">
              <div class="customer-name">{{ row.customer.name }}</div>
              <div class="customer-email">{{ row.customer.email }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="商品" width="200">
          <template #default="{ row }">
            <div class="products-info">
              <div v-for="item in row.products" :key="item.id" class="product-item">
                <span class="product-name">{{ item.name }}</span>
                <span class="product-quantity">x{{ item.quantity }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="金额" width="120">
          <template #default="{ row }">
            <div class="amount-info">
              <div class="total-amount">¥{{ row.total }}</div>
              <div class="shipping-fee">含运费 ¥{{ row.shipping }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createdAt" label="下单时间" width="120" />
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="viewOrder(row)">
              查看
            </el-button>
            <el-button 
              v-if="row.status === 'paid'" 
              type="success" 
              size="small" 
              link 
              @click="shipOrder(row)"
            >
              发货
            </el-button>
            <el-button 
              v-if="row.status === 'pending'" 
              type="warning" 
              size="small" 
              link 
              @click="cancelOrder(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 模拟订单数据
const orders = ref([
  {
    id: '#1001',
    customer: {
      name: '张三',
      email: 'zhangsan@example.com'
    },
    products: [
      { id: 1, name: 'iPhone 15 Pro Max', quantity: 1 },
      { id: 2, name: 'AirPods Pro', quantity: 1 }
    ],
    total: 11998,
    shipping: 0,
    status: 'paid',
    createdAt: '2024-01-15 14:30'
  },
  {
    id: '#1002',
    customer: {
      name: '李四',
      email: 'lisi@example.com'
    },
    products: [
      { id: 3, name: 'MacBook Pro 16"', quantity: 1 }
    ],
    total: 19999,
    shipping: 50,
    status: 'shipped',
    createdAt: '2024-01-14 10:20'
  },
  {
    id: '#1003',
    customer: {
      name: '王五',
      email: 'wangwu@example.com'
    },
    products: [
      { id: 4, name: 'Nike Air Max 270', quantity: 2 }
    ],
    total: 1798,
    shipping: 20,
    status: 'completed',
    createdAt: '2024-01-13 16:45'
  }
])

// 方法
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('搜索完成')
  }, 1000)
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  dateRange.value = []
  handleSearch()
}

const getStatusType = (status: string) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'paid': return 'success'
    case 'shipped': return 'info'
    case 'completed': return 'success'
    case 'cancelled': return 'danger'
    default: return 'info'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '待付款'
    case 'paid': return '已付款'
    case 'shipped': return '已发货'
    case 'completed': return '已完成'
    case 'cancelled': return '已取消'
    default: return '未知'
  }
}

const viewOrder = (order: any) => {
  ElMessage.info(`查看订单: ${order.id}`)
}

const shipOrder = async (order: any) => {
  try {
    await ElMessageBox.confirm(`确定要发货订单 "${order.id}" 吗？`, '确认发货', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    ElMessage.success('发货成功')
  } catch {
    // 用户取消
  }
}

const cancelOrder = async (order: any) => {
  try {
    await ElMessageBox.confirm(`确定要取消订单 "${order.id}" 吗？`, '确认取消', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    ElMessage.success('订单已取消')
  } catch {
    // 用户取消
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

onMounted(() => {
  total.value = orders.value.length
})
</script>

<style lang="scss" scoped>
.orders-page {
  padding: 24px;
}

.page-header {
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

.order-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  background: var(--saas-bg-primary);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  
  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--saas-primary);
    margin-bottom: 8px;
  }
  
  .stat-label {
    font-size: 14px;
    color: var(--saas-text-secondary);
  }
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: var(--saas-bg-primary);
  border-radius: 8px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
}

.filters-left {
  display: flex;
  gap: 16px;
  align-items: center;
  
  .search-input {
    width: 300px;
  }
  
  .el-select {
    width: 150px;
  }
}

.filters-right {
  display: flex;
  gap: 12px;
}

.orders-table {
  background: var(--saas-bg-primary);
  border-radius: 8px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  overflow: hidden;
}

.customer-info {
  .customer-name {
    font-weight: 500;
    color: var(--saas-text-primary);
    margin-bottom: 4px;
  }
  
  .customer-email {
    font-size: 12px;
    color: var(--saas-text-tertiary);
  }
}

.products-info {
  .product-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    
    .product-name {
      color: var(--saas-text-primary);
    }
    
    .product-quantity {
      color: var(--saas-text-secondary);
      font-size: 12px;
    }
  }
}

.amount-info {
  .total-amount {
    font-weight: 600;
    color: var(--saas-text-primary);
    margin-bottom: 4px;
  }
  
  .shipping-fee {
    font-size: 12px;
    color: var(--saas-text-tertiary);
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

// 响应式设计
@media (max-width: 768px) {
  .orders-page {
    padding: 16px;
  }
  
  .order-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters-section {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filters-left {
    flex-direction: column;
    gap: 12px;
    
    .search-input {
      width: 100%;
    }
    
    .el-select {
      width: 100%;
    }
  }
  
  .filters-right {
    justify-content: center;
  }
}
</style>
