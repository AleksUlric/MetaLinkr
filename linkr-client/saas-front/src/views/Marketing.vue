<template>
  <div class="marketing-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">营销活动</h1>
        <p class="page-subtitle">管理您的营销活动和推广策略</p>
      </div>
      <div class="header-right">
        <el-button type="primary" size="large" @click="createCampaign">
          <el-icon><Plus /></el-icon>
          创建活动
        </el-button>
      </div>
    </div>
    
    <!-- 营销概览 -->
    <div class="marketing-overview">
      <div class="overview-cards">
        <div class="overview-card">
          <div class="card-icon active">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-value">{{ activeCampaigns }}</div>
            <div class="card-label">进行中的活动</div>
            <div class="card-change positive">+12.5%</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon conversion">
            <el-icon><DataAnalysis /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-value">{{ conversionRate }}%</div>
            <div class="card-label">平均转化率</div>
            <div class="card-change positive">+8.2%</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon revenue">
            <el-icon><Money /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-value">¥{{ campaignRevenue }}</div>
            <div class="card-label">活动收入</div>
            <div class="card-change positive">+15.3%</div>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon customers">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-value">{{ newCustomers }}</div>
            <div class="card-label">新增客户</div>
            <div class="card-change positive">+22.1%</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 活动类型选择 -->
    <div class="campaign-types">
      <div class="section-header">
        <h2>活动类型</h2>
        <p>选择适合您业务的营销活动类型</p>
      </div>
      
      <div class="types-grid">
        <div 
          v-for="type in campaignTypes" 
          :key="type.id"
          class="type-card"
          @click="selectCampaignType(type.id)"
        >
          <div class="type-icon">
            <el-icon><component :is="type.icon" /></el-icon>
          </div>
          <div class="type-info">
            <h3 class="type-name">{{ type.name }}</h3>
            <p class="type-desc">{{ type.description }}</p>
            <div class="type-features">
              <el-tag 
                v-for="feature in type.features" 
                :key="feature"
                size="small"
                type="info"
              >
                {{ feature }}
              </el-tag>
            </div>
          </div>
          <div class="type-action">
            <el-button type="primary" size="small">创建</el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 活动列表 -->
    <div class="campaigns-section">
      <div class="section-header">
        <h2>活动管理</h2>
        <div class="header-actions">
          <el-select v-model="statusFilter" placeholder="筛选状态" clearable>
            <el-option label="全部状态" value="" />
            <el-option label="进行中" value="active" />
            <el-option label="已暂停" value="paused" />
            <el-option label="已结束" value="ended" />
            <el-option label="草稿" value="draft" />
          </el-select>
          <el-select v-model="typeFilter" placeholder="筛选类型" clearable>
            <el-option label="全部类型" value="" />
            <el-option label="折扣活动" value="discount" />
            <el-option label="满减活动" value="free_shipping" />
            <el-option label="优惠券" value="coupon" />
            <el-option label="限时抢购" value="flash_sale" />
          </el-select>
        </div>
      </div>
      
      <div class="campaigns-list">
        <div 
          v-for="campaign in filteredCampaigns" 
          :key="campaign.id"
          class="campaign-card"
        >
          <div class="campaign-header">
            <div class="campaign-info">
              <h3 class="campaign-name">{{ campaign.name }}</h3>
              <p class="campaign-desc">{{ campaign.description }}</p>
            </div>
            <div class="campaign-status">
              <el-tag :type="getStatusType(campaign.status)" size="small">
                {{ getStatusText(campaign.status) }}
              </el-tag>
            </div>
          </div>
          
          <div class="campaign-details">
            <div class="detail-item">
              <span class="detail-label">类型:</span>
              <span class="detail-value">{{ getTypeText(campaign.type) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">时间:</span>
              <span class="detail-value">{{ campaign.startDate }} - {{ campaign.endDate }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">参与商品:</span>
              <span class="detail-value">{{ campaign.productCount }} 个商品</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">参与客户:</span>
              <span class="detail-value">{{ campaign.customerCount }} 人</span>
            </div>
          </div>
          
          <div class="campaign-stats">
            <div class="stat-item">
              <div class="stat-value">{{ campaign.orders }}</div>
              <div class="stat-label">订单数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">¥{{ campaign.revenue }}</div>
              <div class="stat-label">收入</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ campaign.conversion }}%</div>
              <div class="stat-label">转化率</div>
            </div>
          </div>
          
          <div class="campaign-actions">
            <el-button type="primary" size="small" @click="editCampaign(campaign)">
              编辑
            </el-button>
            <el-button size="small" @click="viewCampaign(campaign)">
              查看详情
            </el-button>
            <el-button 
              :type="campaign.status === 'active' ? 'warning' : 'success'"
              size="small" 
              @click="toggleCampaign(campaign)"
            >
              {{ campaign.status === 'active' ? '暂停' : '启动' }}
            </el-button>
            <el-button type="danger" size="small" @click="deleteCampaign(campaign)">
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 创建活动对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="创建营销活动"
      width="800px"
      :before-close="handleCloseDialog"
    >
      <div class="create-campaign-form">
        <el-form :model="newCampaign" label-width="120px">
          <el-form-item label="活动名称" required>
            <el-input v-model="newCampaign.name" placeholder="请输入活动名称" />
          </el-form-item>
          
          <el-form-item label="活动类型" required>
            <el-select v-model="newCampaign.type" placeholder="选择活动类型">
              <el-option label="折扣活动" value="discount" />
              <el-option label="满减活动" value="free_shipping" />
              <el-option label="优惠券" value="coupon" />
              <el-option label="限时抢购" value="flash_sale" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="活动描述">
            <el-input
              v-model="newCampaign.description"
              type="textarea"
              :rows="3"
              placeholder="请输入活动描述"
            />
          </el-form-item>
          
          <el-form-item label="活动时间" required>
            <el-date-picker
              v-model="newCampaign.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
            />
          </el-form-item>
          
          <el-form-item label="参与商品">
            <el-select v-model="newCampaign.products" multiple placeholder="选择参与商品">
              <el-option label="全部商品" value="all" />
              <el-option label="iPhone 15 Pro Max" value="iphone" />
              <el-option label="MacBook Pro 16" value="macbook" />
              <el-option label="AirPods Pro" value="airpods" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="目标客户">
            <el-select v-model="newCampaign.customers" multiple placeholder="选择目标客户">
              <el-option label="全部客户" value="all" />
              <el-option label="新客户" value="new" />
              <el-option label="VIP客户" value="vip" />
              <el-option label="活跃客户" value="active" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="saveCampaign">创建活动</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, TrendCharts, DataAnalysis, Money, UserFilled,
  Discount, Gift, Ticket, Timer
} from '@element-plus/icons-vue'

// 响应式数据
const statusFilter = ref('')
const typeFilter = ref('')
const showCreateDialog = ref(false)

// 营销概览数据
const activeCampaigns = ref(8)
const conversionRate = ref(12.5)
const campaignRevenue = ref(45678)
const newCustomers = ref(234)

// 活动类型
const campaignTypes = ref([
  {
    id: 'discount',
    name: '折扣活动',
    description: '为商品设置折扣价格，吸引客户购买',
    icon: 'Discount',
    features: ['灵活折扣', '批量设置', '时间控制']
  },
  {
    id: 'free_shipping',
    name: '满减活动',
    description: '设置满额免运费或满减优惠',
    icon: 'Gift',
    features: ['满额免邮', '阶梯优惠', '自动计算']
  },
  {
    id: 'coupon',
    name: '优惠券',
    description: '创建优惠券，客户可领取使用',
    icon: 'Ticket',
    features: ['多种类型', '使用限制', '批量发放']
  },
  {
    id: 'flash_sale',
    name: '限时抢购',
    description: '限时特价活动，营造紧迫感',
    icon: 'Timer',
    features: ['限时特价', '库存控制', '倒计时']
  }
])

// 活动列表
const campaigns = ref([
  {
    id: 1,
    name: '新年大促销',
    description: '全场商品8折优惠，限时3天',
    type: 'discount',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-01-03',
    productCount: 25,
    customerCount: 156,
    orders: 89,
    revenue: 12500,
    conversion: 15.2
  },
  {
    id: 2,
    name: '满500免运费',
    description: '单笔订单满500元免运费',
    type: 'free_shipping',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    productCount: 50,
    customerCount: 234,
    orders: 67,
    revenue: 8900,
    conversion: 12.8
  },
  {
    id: 3,
    name: '新用户优惠券',
    description: '新用户注册即送50元优惠券',
    type: 'coupon',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    productCount: 100,
    customerCount: 89,
    orders: 45,
    revenue: 5600,
    conversion: 18.5
  },
  {
    id: 4,
    name: 'iPhone限时抢购',
    description: 'iPhone 15 Pro Max限时特价',
    type: 'flash_sale',
    status: 'ended',
    startDate: '2023-12-25',
    endDate: '2023-12-26',
    productCount: 1,
    customerCount: 45,
    orders: 12,
    revenue: 12000,
    conversion: 26.7
  }
])

// 新活动表单
const newCampaign = reactive({
  name: '',
  type: '',
  description: '',
  dateRange: [],
  products: [],
  customers: []
})

// 计算属性
const filteredCampaigns = computed(() => {
  let filtered = campaigns.value
  
  if (statusFilter.value) {
    filtered = filtered.filter(campaign => campaign.status === statusFilter.value)
  }
  
  if (typeFilter.value) {
    filtered = filtered.filter(campaign => campaign.type === typeFilter.value)
  }
  
  return filtered
})

// 方法
const selectCampaignType = (typeId: string) => {
  newCampaign.type = typeId
  showCreateDialog.value = true
}

const createCampaign = () => {
  showCreateDialog.value = true
}

const saveCampaign = async () => {
  try {
    // 验证表单
    if (!newCampaign.name) {
      ElMessage.error('请输入活动名称')
      return
    }
    if (!newCampaign.type) {
      ElMessage.error('请选择活动类型')
      return
    }
    if (!newCampaign.dateRange || newCampaign.dateRange.length !== 2) {
      ElMessage.error('请选择活动时间')
      return
    }
    
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 添加到活动列表
    const newId = Math.max(...campaigns.value.map(c => c.id)) + 1
    campaigns.value.unshift({
      id: newId,
      name: newCampaign.name,
      description: newCampaign.description,
      type: newCampaign.type,
      status: 'draft',
      startDate: newCampaign.dateRange[0],
      endDate: newCampaign.dateRange[1],
      productCount: newCampaign.products.length,
      customerCount: 0,
      orders: 0,
      revenue: 0,
      conversion: 0
    })
    
    // 重置表单
    Object.assign(newCampaign, {
      name: '',
      type: '',
      description: '',
      dateRange: [],
      products: [],
      customers: []
    })
    
    showCreateDialog.value = false
    ElMessage.success('活动创建成功')
  } catch (error) {
    ElMessage.error('创建失败，请重试')
  }
}

const editCampaign = (campaign: any) => {
  ElMessage.info(`编辑活动: ${campaign.name}`)
}

const viewCampaign = (campaign: any) => {
  ElMessage.info(`查看活动详情: ${campaign.name}`)
}

const toggleCampaign = async (campaign: any) => {
  const action = campaign.status === 'active' ? '暂停' : '启动'
  try {
    await ElMessageBox.confirm(`确定要${action}活动 "${campaign.name}" 吗？`, `确认${action}`, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    campaign.status = campaign.status === 'active' ? 'paused' : 'active'
    ElMessage.success(`活动已${action}`)
  } catch {
    // 用户取消
  }
}

const deleteCampaign = async (campaign: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除活动 "${campaign.name}" 吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = campaigns.value.findIndex(c => c.id === campaign.id)
    if (index > -1) {
      campaigns.value.splice(index, 1)
    }
    
    ElMessage.success('活动已删除')
  } catch {
    // 用户取消
  }
}

const getStatusType = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'paused': return 'warning'
    case 'ended': return 'info'
    case 'draft': return 'info'
    default: return 'info'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return '进行中'
    case 'paused': return '已暂停'
    case 'ended': return '已结束'
    case 'draft': return '草稿'
    default: return '未知'
  }
}

const getTypeText = (type: string) => {
  switch (type) {
    case 'discount': return '折扣活动'
    case 'free_shipping': return '满减活动'
    case 'coupon': return '优惠券'
    case 'flash_sale': return '限时抢购'
    default: return '未知'
  }
}

const handleCloseDialog = () => {
  showCreateDialog.value = false
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss" scoped>
.marketing-page {
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

.marketing-overview {
  margin-bottom: 32px;
  
  .overview-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    
    .overview-card {
      background: var(--saas-bg-primary);
      border-radius: 12px;
      padding: 24px;
      box-shadow: var(--saas-shadow);
      border: 1px solid var(--saas-border-light);
      display: flex;
      align-items: center;
      gap: 16px;
      
      .card-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        
        &.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        &.conversion {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        &.revenue {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        &.customers {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }
      
      .card-content {
        flex: 1;
        
        .card-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--saas-text-primary);
          margin-bottom: 4px;
        }
        
        .card-label {
          font-size: 14px;
          color: var(--saas-text-secondary);
          margin-bottom: 8px;
        }
        
        .card-change {
          font-size: 12px;
          font-weight: 600;
          
          &.positive {
            color: var(--saas-success);
          }
        }
      }
    }
  }
}

.campaign-types,
.campaigns-section {
  margin-bottom: 32px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    
    h2 {
      font-size: 24px;
      font-weight: 600;
      color: var(--saas-text-primary);
      margin-bottom: 8px;
    }
    
    p {
      font-size: 14px;
      color: var(--saas-text-secondary);
    }
    
    .header-actions {
      display: flex;
      gap: 12px;
    }
  }
}

.types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  
  .type-card {
    background: var(--saas-bg-primary);
    border-radius: 12px;
    padding: 24px;
    box-shadow: var(--saas-shadow);
    border: 1px solid var(--saas-border-light);
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--saas-shadow-lg);
    }
    
    .type-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: var(--saas-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 16px;
    }
    
    .type-info {
      margin-bottom: 16px;
      
      .type-name {
        font-size: 18px;
        font-weight: 600;
        color: var(--saas-text-primary);
        margin-bottom: 8px;
      }
      
      .type-desc {
        font-size: 14px;
        color: var(--saas-text-secondary);
        margin-bottom: 12px;
        line-height: 1.5;
      }
      
      .type-features {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
    }
    
    .type-action {
      text-align: right;
    }
  }
}

.campaigns-list {
  display: grid;
  gap: 20px;
  
  .campaign-card {
    background: var(--saas-bg-primary);
    border-radius: 12px;
    padding: 24px;
    box-shadow: var(--saas-shadow);
    border: 1px solid var(--saas-border-light);
    
    .campaign-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      
      .campaign-info {
        .campaign-name {
          font-size: 18px;
          font-weight: 600;
          color: var(--saas-text-primary);
          margin-bottom: 4px;
        }
        
        .campaign-desc {
          font-size: 14px;
          color: var(--saas-text-secondary);
        }
      }
    }
    
    .campaign-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
      
      .detail-item {
        display: flex;
        gap: 8px;
        
        .detail-label {
          font-size: 14px;
          color: var(--saas-text-secondary);
        }
        
        .detail-value {
          font-size: 14px;
          color: var(--saas-text-primary);
          font-weight: 500;
        }
      }
    }
    
    .campaign-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 20px;
      padding: 16px;
      background: var(--saas-bg-tertiary);
      border-radius: 8px;
      
      .stat-item {
        text-align: center;
        
        .stat-value {
          font-size: 20px;
          font-weight: 600;
          color: var(--saas-primary);
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 12px;
          color: var(--saas-text-secondary);
        }
      }
    }
    
    .campaign-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
  }
}

.create-campaign-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .marketing-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .types-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    
    .header-actions {
      flex-direction: column;
    }
  }
  
  .campaign-details {
    grid-template-columns: 1fr !important;
  }
  
  .campaign-stats {
    grid-template-columns: 1fr !important;
  }
  
  .campaign-actions {
    flex-direction: column;
    
    .el-button {
      width: 100%;
    }
  }
}
</style>
