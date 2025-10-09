<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="page-title">仪表板</h1>
      <p class="page-subtitle">欢迎回来，{{ user?.name }}！这里是您商店的概览。</p>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon orders">
          <el-icon><List /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">1,234</div>
          <div class="stat-label">总订单</div>
          <div class="stat-change positive">+12.5%</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon revenue">
          <el-icon><Money /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥45,678</div>
          <div class="stat-label">总收入</div>
          <div class="stat-change positive">+8.2%</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon customers">
          <el-icon><UserFilled /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">567</div>
          <div class="stat-label">客户数量</div>
          <div class="stat-change positive">+15.3%</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon products">
          <el-icon><Goods /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">89</div>
          <div class="stat-label">商品数量</div>
          <div class="stat-change negative">-2.1%</div>
        </div>
      </div>
    </div>
    
    <!-- 图表和表格区域 -->
    <div class="dashboard-content">
      <div class="chart-section">
        <div class="section-header">
          <h2>销售趋势</h2>
          <el-select v-model="chartPeriod" size="small">
            <el-option label="最近7天" value="7d" />
            <el-option label="最近30天" value="30d" />
            <el-option label="最近90天" value="90d" />
          </el-select>
        </div>
        <div class="chart-container">
          <v-chart 
            class="chart" 
            :option="salesChartOption" 
            autoresize
          />
        </div>
      </div>
      
      <div class="chart-section">
        <div class="section-header">
          <h2>流量分析</h2>
          <el-select v-model="trafficPeriod" size="small">
            <el-option label="最近7天" value="7d" />
            <el-option label="最近30天" value="30d" />
            <el-option label="最近90天" value="90d" />
          </el-select>
        </div>
        <div class="chart-container">
          <v-chart 
            class="chart" 
            :option="trafficChartOption" 
            autoresize
          />
        </div>
      </div>
      
      <div class="recent-orders">
        <div class="section-header">
          <h2>最近订单</h2>
          <el-button type="primary" size="small" @click="$router.push('/dashboard/orders')">
            查看全部
          </el-button>
        </div>
        <div class="orders-table">
          <el-table :data="recentOrders" style="width: 100%">
            <el-table-column prop="id" label="订单号" width="120" />
            <el-table-column label="客户" width="150">
              <template #default="{ row }">
                <div class="customer-cell">
                  <el-avatar :src="row.avatar" :size="32">
                    {{ row.customer.charAt(0) }}
                  </el-avatar>
                  <span class="customer-name">{{ row.customer }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="100" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column label="操作" width="80">
              <template #default>
                <el-button type="primary" size="small" link>
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    
    <!-- 快速操作 -->
    <div class="quick-actions">
      <h2>快速操作</h2>
      <div class="actions-grid">
        <el-button type="primary" size="large" @click="$router.push('/dashboard/products')">
          <el-icon><Plus /></el-icon>
          添加商品
        </el-button>
        <el-button size="large" @click="$router.push('/dashboard/orders')">
          <el-icon><List /></el-icon>
          查看订单
        </el-button>
        <el-button size="large" @click="$router.push('/dashboard/themes')">
          <el-icon><Brush /></el-icon>
          自定义主题
        </el-button>
        <el-button size="large" @click="$router.push('/dashboard/analytics')">
          <el-icon><TrendCharts /></el-icon>
          查看分析
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import {
  List, Money, UserFilled, Goods, TrendCharts, Plus, Brush
} from '@element-plus/icons-vue'

// 注册ECharts组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const authStore = useAuthStore()

// 响应式数据
const chartPeriod = ref('30d')
const trafficPeriod = ref('30d')

// 计算属性
const user = computed(() => authStore.user)

// 销售趋势图表配置
const salesChartOption = reactive({
  title: {
    text: '销售趋势',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 'normal'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['销售额', '订单数'],
    top: 30
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
  },
  yAxis: [
    {
      type: 'value',
      name: '销售额(¥)',
      position: 'left'
    },
    {
      type: 'value',
      name: '订单数',
      position: 'right'
    }
  ],
  series: [
    {
      name: '销售额',
      type: 'line',
      yAxisIndex: 0,
      data: [12000, 15000, 18000, 22000, 25000, 28000, 32000],
      smooth: true,
      itemStyle: {
        color: '#409EFF'
      }
    },
    {
      name: '订单数',
      type: 'line',
      yAxisIndex: 1,
      data: [45, 52, 68, 75, 82, 88, 95],
      smooth: true,
      itemStyle: {
        color: '#67C23A'
      }
    }
  ]
})

// 流量分析图表配置
const trafficChartOption = reactive({
  title: {
    text: '流量分析',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 'normal'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['访问量', '访客数', '转化率'],
    top: 30
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
  },
  yAxis: [
    {
      type: 'value',
      name: '访问量/访客数',
      position: 'left'
    },
    {
      type: 'value',
      name: '转化率(%)',
      position: 'right',
      max: 10
    }
  ],
  series: [
    {
      name: '访问量',
      type: 'bar',
      yAxisIndex: 0,
      data: [1200, 1500, 1800, 2200, 2500, 2800, 3200],
      itemStyle: {
        color: '#409EFF'
      }
    },
    {
      name: '访客数',
      type: 'bar',
      yAxisIndex: 0,
      data: [800, 950, 1100, 1300, 1450, 1600, 1800],
      itemStyle: {
        color: '#67C23A'
      }
    },
    {
      name: '转化率',
      type: 'line',
      yAxisIndex: 1,
      data: [2.5, 3.2, 3.8, 4.2, 4.5, 4.8, 5.2],
      itemStyle: {
        color: '#E6A23C'
      }
    }
  ]
})

// 模拟数据
const recentOrders = ref([
  { id: '#1001', customer: '张三', amount: '¥299.00', status: 'pending', date: '2024-01-15', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
  { id: '#1002', customer: '李四', amount: '¥199.00', status: 'completed', date: '2024-01-14', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
  { id: '#1003', customer: '王五', amount: '¥399.00', status: 'shipped', date: '2024-01-13', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' },
  { id: '#1004', customer: '赵六', amount: '¥599.00', status: 'pending', date: '2024-01-12', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' },
  { id: '#1005', customer: '钱七', amount: '¥199.00', status: 'completed', date: '2024-01-11', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' }
])

// 方法
const getStatusType = (status: string) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'completed': return 'success'
    case 'shipped': return 'info'
    case 'cancelled': return 'danger'
    default: return 'info'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '待处理'
    case 'completed': return '已完成'
    case 'shipped': return '已发货'
    case 'cancelled': return '已取消'
    default: return '未知'
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 24px;
}

.dashboard-header {
  margin-bottom: 32px;
  
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
    
    &.orders {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    &.revenue {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    &.customers {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    &.products {
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
      
      &.negative {
        color: var(--saas-danger);
      }
    }
  }
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.chart-section,
.recent-orders {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    font-size: 20px;
    font-weight: 600;
    color: var(--saas-text-primary);
  }
}

.chart-container {
  height: 300px;
  
  .chart {
    width: 100%;
    height: 100%;
  }
}

.chart-placeholder {
  text-align: center;
  color: var(--saas-text-tertiary);
  
  .chart-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  small {
    font-size: 14px;
  }
}

.orders-table {
  .customer-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .customer-name {
      font-size: 14px;
      color: var(--saas-text-primary);
    }
  }
}

.quick-actions {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  
  h2 {
    font-size: 20px;
    font-weight: 600;
    color: var(--saas-text-primary);
    margin-bottom: 20px;
  }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  
  .el-button {
    height: 60px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
    
    .el-icon {
      margin-right: 8px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .dashboard-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
