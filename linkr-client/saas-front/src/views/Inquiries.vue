<template>
  <div class="inquiries-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">询盘管理</h1>
        <p class="page-subtitle">管理来自客户的询盘和咨询</p>
      </div>
      <div class="header-right">
        <el-button type="primary" size="large" @click="exportInquiries">
          <el-icon><Download /></el-icon>
          导出询盘
        </el-button>
      </div>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <el-icon><Message /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalInquiries }}</div>
          <div class="stat-label">总询盘数</div>
          <div class="stat-change positive">+12.5%</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon pending">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ pendingInquiries }}</div>
          <div class="stat-label">待处理</div>
          <div class="stat-change warning">需关注</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon replied">
          <el-icon><ChatDotRound /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ repliedInquiries }}</div>
          <div class="stat-label">已回复</div>
          <div class="stat-change positive">+8.2%</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon converted">
          <el-icon><TrendCharts /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ convertedInquiries }}</div>
          <div class="stat-label">已转化</div>
          <div class="stat-change positive">+15.3%</div>
        </div>
      </div>
    </div>
    
    <!-- 筛选和搜索 -->
    <div class="filters-section">
      <div class="filters-left">
        <el-input
          v-model="searchQuery"
          placeholder="搜索客户名称、公司、产品..."
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select v-model="statusFilter" placeholder="选择状态" clearable>
          <el-option label="全部状态" value="" />
          <el-option label="待处理" value="pending" />
          <el-option label="已回复" value="replied" />
          <el-option label="已转化" value="converted" />
          <el-option label="已关闭" value="closed" />
        </el-select>
        
        <el-select v-model="priorityFilter" placeholder="选择优先级" clearable>
          <el-option label="全部优先级" value="" />
          <el-option label="高" value="high" />
          <el-option label="中" value="medium" />
          <el-option label="低" value="low" />
        </el-select>
        
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </div>
      
      <div class="filters-right">
        <el-button @click="resetFilters">重置筛选</el-button>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    
    <!-- 询盘列表 -->
    <div class="inquiries-table">
      <el-table :data="inquiries" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="客户信息" width="200">
          <template #default="{ row }">
            <div class="customer-info">
              <div class="customer-name">{{ row.customerName }}</div>
              <div class="customer-company">{{ row.company }}</div>
              <div class="customer-email">{{ row.email }}</div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="询盘内容" min-width="300">
          <template #default="{ row }">
            <div class="inquiry-content">
              <div class="inquiry-subject">{{ row.subject }}</div>
              <div class="inquiry-message">{{ row.message }}</div>
              <div class="inquiry-products">
                <el-tag 
                  v-for="product in row.products" 
                  :key="product" 
                  size="small" 
                  type="info"
                >
                  {{ product }}
                </el-tag>
              </div>
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
        
        <el-table-column label="优先级" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)" size="small">
              {{ getPriorityText(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createdAt" label="询盘时间" width="120" />
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="viewInquiry(row)">
              查看详情
            </el-button>
            <el-button type="success" size="small" link @click="replyInquiry(row)">
              回复
            </el-button>
            <el-button type="warning" size="small" link @click="markAsConverted(row)">
              标记转化
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
    
    <!-- 询盘详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="询盘详情"
      width="800px"
      :before-close="handleCloseDialog"
    >
      <div v-if="selectedInquiry" class="inquiry-detail">
        <div class="detail-section">
          <h3>客户信息</h3>
          <div class="detail-content">
            <p><strong>姓名：</strong>{{ selectedInquiry.customerName }}</p>
            <p><strong>公司：</strong>{{ selectedInquiry.company }}</p>
            <p><strong>邮箱：</strong>{{ selectedInquiry.email }}</p>
            <p><strong>电话：</strong>{{ selectedInquiry.phone }}</p>
            <p><strong>国家：</strong>{{ selectedInquiry.country }}</p>
          </div>
        </div>
        
        <div class="detail-section">
          <h3>询盘内容</h3>
          <div class="detail-content">
            <p><strong>主题：</strong>{{ selectedInquiry.subject }}</p>
            <p><strong>询盘内容：</strong></p>
            <div class="message-content">{{ selectedInquiry.message }}</div>
            <p><strong>感兴趣的产品：</strong></p>
            <div class="products-list">
              <el-tag 
                v-for="product in selectedInquiry.products" 
                :key="product" 
                type="info"
              >
                {{ product }}
              </el-tag>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h3>回复记录</h3>
          <div class="replies-list">
            <div 
              v-for="reply in selectedInquiry.replies" 
              :key="reply.id"
              class="reply-item"
            >
              <div class="reply-header">
                <span class="reply-author">{{ reply.author }}</span>
                <span class="reply-time">{{ reply.createdAt }}</span>
              </div>
              <div class="reply-content">{{ reply.content }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
        <el-button type="primary" @click="replyInquiry(selectedInquiry)">回复询盘</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Download, Message, Clock, ChatDotRound, TrendCharts, Search
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')
const dateRange = ref<[string, string] | null>(null)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const showDetailDialog = ref(false)
const selectedInquiry = ref<any>(null)

// 模拟询盘数据
const inquiries = ref([
  {
    id: 1,
    customerName: 'John Smith',
    company: 'ABC Trading Co.',
    email: 'john@abctrading.com',
    phone: '+1-555-0123',
    country: 'United States',
    subject: '询价：电子产品批量采购',
    message: '我们公司正在寻找可靠的电子产品供应商，希望了解贵公司的产品价格和最小起订量。我们每月需要采购约1000件产品。',
    products: ['iPhone 15 Pro', 'MacBook Pro', 'iPad Air'],
    status: 'pending',
    priority: 'high',
    createdAt: '2024-01-15',
    replies: []
  },
  {
    id: 2,
    customerName: 'Maria Garcia',
    company: 'Tech Solutions Ltd.',
    email: 'maria@techsolutions.com',
    phone: '+44-20-7946-0958',
    country: 'United Kingdom',
    subject: '合作咨询：智能家居产品',
    message: '我们是一家智能家居解决方案提供商，希望与贵公司建立长期合作关系。请提供产品目录和合作条件。',
    products: ['智能音箱', '智能灯泡', '智能门锁'],
    status: 'replied',
    priority: 'medium',
    createdAt: '2024-01-14',
    replies: [
      {
        id: 1,
        author: '销售经理',
        content: '感谢您的询盘，我们已经发送了产品目录和合作方案。',
        createdAt: '2024-01-14 15:30'
      }
    ]
  },
  {
    id: 3,
    customerName: '田中太郎',
    company: '日本贸易株式会社',
    email: 'tanaka@japantrade.jp',
    phone: '+81-3-1234-5678',
    country: 'Japan',
    subject: '询价：办公家具',
    message: '我们正在为新的办公楼采购办公家具，希望了解贵公司的产品系列和价格。',
    products: ['办公桌', '办公椅', '文件柜'],
    status: 'converted',
    priority: 'high',
    createdAt: '2024-01-13',
    replies: [
      {
        id: 1,
        author: '销售经理',
        content: '已发送详细报价单，客户表示满意。',
        createdAt: '2024-01-13 10:00'
      }
    ]
  }
])

// 计算属性
const totalInquiries = computed(() => inquiries.value.length)
const pendingInquiries = computed(() => inquiries.value.filter(i => i.status === 'pending').length)
const repliedInquiries = computed(() => inquiries.value.filter(i => i.status === 'replied').length)
const convertedInquiries = computed(() => inquiries.value.filter(i => i.status === 'converted').length)

// 方法
const handleSearch = () => {
  loading.value = true
  // 模拟搜索
  setTimeout(() => {
    loading.value = false
    ElMessage.success('搜索完成')
  }, 1000)
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  dateRange.value = null
  handleSearch()
}

const getStatusType = (status: string) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'replied': return 'info'
    case 'converted': return 'success'
    case 'closed': return 'danger'
    default: return 'info'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '待处理'
    case 'replied': return '已回复'
    case 'converted': return '已转化'
    case 'closed': return '已关闭'
    default: return '未知'
  }
}

const getPriorityType = (priority: string) => {
  switch (priority) {
    case 'high': return 'danger'
    case 'medium': return 'warning'
    case 'low': return 'info'
    default: return 'info'
  }
}

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return '高'
    case 'medium': return '中'
    case 'low': return '低'
    default: return '未知'
  }
}

const viewInquiry = (inquiry: any) => {
  selectedInquiry.value = inquiry
  showDetailDialog.value = true
}

const replyInquiry = (inquiry: any) => {
  ElMessage.info(`回复询盘: ${inquiry.subject}`)
  // 这里可以打开回复对话框
}

const markAsConverted = async (inquiry: any) => {
  try {
    await ElMessageBox.confirm(`确定要将询盘 "${inquiry.subject}" 标记为已转化吗？`, '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    inquiry.status = 'converted'
    ElMessage.success('标记成功')
  } catch {
    // 用户取消
  }
}

const exportInquiries = () => {
  ElMessage.success('导出功能开发中...')
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}

const handleCloseDialog = () => {
  showDetailDialog.value = false
  selectedInquiry.value = null
}

onMounted(() => {
  total.value = inquiries.value.length
})
</script>

<style lang="scss" scoped>
.inquiries-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  display: flex;
  align-items: center;
  gap: 16px;
  
  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    
    &.total {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    &.pending {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    &.replied {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    &.converted {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }
  }
  
  .stat-content {
    flex: 1;
    
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--saas-text-primary);
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 14px;
      color: var(--saas-text-secondary);
      margin-bottom: 8px;
    }
    
    .stat-change {
      font-size: 12px;
      font-weight: 600;
      
      &.positive {
        color: var(--saas-success);
      }
      
      &.warning {
        color: var(--saas-warning);
      }
    }
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

.inquiries-table {
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
  
  .customer-company {
    font-size: 12px;
    color: var(--saas-text-secondary);
    margin-bottom: 2px;
  }
  
  .customer-email {
    font-size: 12px;
    color: var(--saas-text-tertiary);
  }
}

.inquiry-content {
  .inquiry-subject {
    font-weight: 500;
    color: var(--saas-text-primary);
    margin-bottom: 8px;
  }
  
  .inquiry-message {
    font-size: 14px;
    color: var(--saas-text-secondary);
    margin-bottom: 8px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .inquiry-products {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.inquiry-detail {
  .detail-section {
    margin-bottom: 24px;
    
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--saas-text-primary);
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--saas-border-light);
    }
    
    .detail-content {
      p {
        margin-bottom: 8px;
        color: var(--saas-text-secondary);
        
        strong {
          color: var(--saas-text-primary);
        }
      }
      
      .message-content {
        background: var(--saas-bg-tertiary);
        padding: 12px;
        border-radius: 6px;
        margin: 8px 0;
        line-height: 1.5;
      }
      
      .products-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }
    }
  }
  
  .replies-list {
    .reply-item {
      background: var(--saas-bg-tertiary);
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 12px;
      
      .reply-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        
        .reply-author {
          font-weight: 500;
          color: var(--saas-text-primary);
        }
        
        .reply-time {
          font-size: 12px;
          color: var(--saas-text-tertiary);
        }
      }
      
      .reply-content {
        color: var(--saas-text-secondary);
        line-height: 1.5;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .inquiries-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
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
