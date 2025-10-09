<template>
  <div class="customers-page">
    <div class="page-header">
      <h1 class="page-title">客户管理</h1>
      <p class="page-subtitle">管理您的客户信息和订单历史</p>
    </div>
    
    <!-- 客户统计 -->
    <div class="customer-stats">
      <div class="stat-item">
        <div class="stat-value">1,234</div>
        <div class="stat-label">总客户</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">567</div>
        <div class="stat-label">活跃客户</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">89</div>
        <div class="stat-label">新客户</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">¥2,345</div>
        <div class="stat-label">平均消费</div>
      </div>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="filters-section">
      <div class="filters-left">
        <el-input
          v-model="searchQuery"
          placeholder="搜索客户姓名、邮箱..."
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select v-model="statusFilter" placeholder="客户状态" clearable>
          <el-option label="全部状态" value="" />
          <el-option label="活跃" value="active" />
          <el-option label="非活跃" value="inactive" />
          <el-option label="VIP" value="vip" />
        </el-select>
      </div>
      
      <div class="filters-right">
        <el-button @click="resetFilters">重置</el-button>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    
    <!-- 客户列表 -->
    <div class="customers-table">
      <el-table :data="customers" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="客户" width="200">
          <template #default="{ row }">
            <div class="customer-info">
              <el-avatar :src="row.avatar" :size="40">
                {{ row.name.charAt(0) }}
              </el-avatar>
              <div class="customer-details">
                <div class="customer-name">{{ row.name }}</div>
                <div class="customer-email">{{ row.email }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="订单数" width="100">
          <template #default="{ row }">
            <div class="order-count">{{ row.orderCount }}</div>
          </template>
        </el-table-column>
        
        <el-table-column label="总消费" width="120">
          <template #default="{ row }">
            <div class="total-spent">¥{{ row.totalSpent }}</div>
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="lastOrderDate" label="最后下单" width="120" />
        
        <el-table-column prop="createdAt" label="注册时间" width="120" />
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="viewCustomer(row)">
              查看
            </el-button>
            <el-button type="success" size="small" link @click="sendMessage(row)">
              发消息
            </el-button>
            <el-button type="warning" size="small" link @click="editCustomer(row)">
              编辑
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
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 模拟客户数据
const customers = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://via.placeholder.com/40x40',
    orderCount: 15,
    totalSpent: 12500,
    status: 'vip',
    lastOrderDate: '2024-01-15',
    createdAt: '2023-06-15'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    avatar: 'https://via.placeholder.com/40x40',
    orderCount: 8,
    totalSpent: 5600,
    status: 'active',
    lastOrderDate: '2024-01-14',
    createdAt: '2023-08-20'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    avatar: 'https://via.placeholder.com/40x40',
    orderCount: 3,
    totalSpent: 1200,
    status: 'active',
    lastOrderDate: '2024-01-10',
    createdAt: '2023-12-01'
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    avatar: 'https://via.placeholder.com/40x40',
    orderCount: 1,
    totalSpent: 299,
    status: 'inactive',
    lastOrderDate: '2023-11-15',
    createdAt: '2023-11-10'
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
  handleSearch()
}

const getStatusType = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'info'
    case 'vip': return 'warning'
    default: return 'info'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return '活跃'
    case 'inactive': return '非活跃'
    case 'vip': return 'VIP'
    default: return '未知'
  }
}

const viewCustomer = (customer: any) => {
  ElMessage.info(`查看客户: ${customer.name}`)
}

const sendMessage = (customer: any) => {
  ElMessage.info(`发送消息给: ${customer.name}`)
}

const editCustomer = (customer: any) => {
  ElMessage.info(`编辑客户: ${customer.name}`)
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
  total.value = customers.value.length
})
</script>

<style lang="scss" scoped>
.customers-page {
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

.customer-stats {
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

.customers-table {
  background: var(--saas-bg-primary);
  border-radius: 8px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  overflow: hidden;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .customer-details {
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
}

.order-count {
  font-weight: 500;
  color: var(--saas-text-primary);
}

.total-spent {
  font-weight: 600;
  color: var(--saas-primary);
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

// 响应式设计
@media (max-width: 768px) {
  .customers-page {
    padding: 16px;
  }
  
  .customer-stats {
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
