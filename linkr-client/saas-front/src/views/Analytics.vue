<template>
  <div class="analytics-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">数据分析</h1>
        <p class="page-subtitle">深入了解您的商店表现</p>
      </div>
      <div class="header-right">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="updateDateRange"
        />
        <el-button type="primary" @click="exportReport">
          <el-icon><Download /></el-icon>
          导出报告
        </el-button>
      </div>
    </div>

    <!-- 关键指标 -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon revenue">
          <el-icon><Money /></el-icon>
        </div>
        <div class="metric-content">
          <h3>总销售额</h3>
          <div class="metric-value">¥{{ formatNumber(analyticsData.revenue) }}</div>
          <div class="metric-change positive">
            <el-icon><ArrowUp /></el-icon>
            +{{ analyticsData.revenueChange }}%
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon orders">
          <el-icon><ShoppingCart /></el-icon>
        </div>
        <div class="metric-content">
          <h3>订单数量</h3>
          <div class="metric-value">{{ formatNumber(analyticsData.orders) }}</div>
          <div class="metric-change positive">
            <el-icon><ArrowUp /></el-icon>
            +{{ analyticsData.ordersChange }}%
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon customers">
          <el-icon><User /></el-icon>
        </div>
        <div class="metric-content">
          <h3>新客户</h3>
          <div class="metric-value">{{ formatNumber(analyticsData.newCustomers) }}</div>
          <div class="metric-change negative">
            <el-icon><ArrowDown /></el-icon>
            -{{ analyticsData.customersChange }}%
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon conversion">
          <el-icon><TrendCharts /></el-icon>
        </div>
        <div class="metric-content">
          <h3>转化率</h3>
          <div class="metric-value">{{ analyticsData.conversionRate }}%</div>
          <div class="metric-change positive">
            <el-icon><ArrowUp /></el-icon>
            +{{ analyticsData.conversionChange }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <!-- 销售趋势 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>销售趋势</h3>
          <el-radio-group v-model="salesChartPeriod" size="small">
            <el-radio-button label="7d">7天</el-radio-button>
            <el-radio-button label="30d">30天</el-radio-button>
            <el-radio-button label="90d">90天</el-radio-button>
          </el-radio-group>
        </div>
        <div class="chart-container">
          <v-chart
            class="chart"
            :option="salesChartOption"
            autoresize
          />
        </div>
      </div>

      <!-- 流量分析 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>流量分析</h3>
          <el-radio-group v-model="trafficChartPeriod" size="small">
            <el-radio-button label="7d">7天</el-radio-button>
            <el-radio-button label="30d">30天</el-radio-button>
            <el-radio-button label="90d">90天</el-radio-button>
          </el-radio-group>
        </div>
        <div class="chart-container">
          <v-chart
            class="chart"
            :option="trafficChartOption"
            autoresize
          />
        </div>
      </div>

      <!-- 销售漏斗 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>销售漏斗</h3>
        </div>
        <div class="chart-container">
          <v-chart
            class="chart"
            :option="funnelChartOption"
            autoresize
          />
        </div>
      </div>

      <!-- 设备分析 -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>设备分析</h3>
        </div>
        <div class="chart-container">
          <v-chart
            class="chart"
            :option="deviceChartOption"
            autoresize
          />
        </div>
      </div>
    </div>

    <!-- 详细数据表格 -->
    <div class="data-tables">
      <!-- 热门商品 -->
      <div class="table-card">
        <div class="table-header">
          <h3>热门商品</h3>
          <el-button type="primary" size="small" @click="viewAllProducts">查看全部</el-button>
        </div>
        <el-table :data="topProducts" style="width: 100%">
          <el-table-column prop="rank" label="排名" width="80" />
          <el-table-column label="商品" width="200">
            <template #default="{ row }">
              <div class="product-cell">
                <img :src="row.image" :alt="row.name" class="product-image" />
                <div class="product-info">
                  <div class="product-name">{{ row.name }}</div>
                  <div class="product-sku">{{ row.sku }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sales" label="销量" width="100" />
          <el-table-column prop="revenue" label="销售额" width="120">
            <template #default="{ row }">
              ¥{{ formatNumber(row.revenue) }}
            </template>
          </el-table-column>
          <el-table-column prop="growth" label="增长率" width="100">
            <template #default="{ row }">
              <span :class="row.growth >= 0 ? 'growth-positive' : 'growth-negative'">
                {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 客户分析 -->
      <div class="table-card">
        <div class="table-header">
          <h3>客户分析</h3>
          <el-button type="primary" size="small" @click="viewAllCustomers">查看全部</el-button>
        </div>
        <el-table :data="customerAnalytics" style="width: 100%">
          <el-table-column prop="segment" label="客户群体" width="150" />
          <el-table-column prop="count" label="客户数量" width="120" />
          <el-table-column prop="avgOrderValue" label="平均订单价值" width="150">
            <template #default="{ row }">
              ¥{{ formatNumber(row.avgOrderValue) }}
            </template>
          </el-table-column>
          <el-table-column prop="lifetimeValue" label="生命周期价值" width="150">
            <template #default="{ row }">
              ¥{{ formatNumber(row.lifetimeValue) }}
            </template>
          </el-table-column>
          <el-table-column prop="retentionRate" label="留存率" width="120">
            <template #default="{ row }">
              {{ row.retentionRate }}%
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart, FunnelChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import {
  Download, Money, ShoppingCart, User, TrendCharts, ArrowUp, ArrowDown
} from '@element-plus/icons-vue'

// 注册ECharts组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  FunnelChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 响应式数据
const dateRange = ref<[Date, Date]>([
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  new Date()
])

const salesChartPeriod = ref('30d')
const trafficChartPeriod = ref('30d')

const analyticsData = reactive({
  revenue: 1250000,
  revenueChange: 12.5,
  orders: 3420,
  ordersChange: 8.3,
  newCustomers: 890,
  customersChange: 5.2,
  conversionRate: 3.2,
  conversionChange: 0.8
})

const topProducts = ref([
  {
    rank: 1,
    name: 'iPhone 15 Pro Max',
    sku: 'IPH15PM-256',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=40&h=40&fit=crop&crop=center',
    sales: 156,
    revenue: 1558440,
    growth: 15.2
  },
  {
    rank: 2,
    name: 'MacBook Pro 16"',
    sku: 'MBP16-512',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=40&h=40&fit=crop&crop=center',
    sales: 89,
    revenue: 1779111,
    growth: 8.7
  },
  {
    rank: 3,
    name: 'AirPods Pro',
    sku: 'APP-2ND',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=40&h=40&fit=crop&crop=center',
    sales: 234,
    revenue: 467766,
    growth: 22.1
  }
])

const customerAnalytics = ref([
  {
    segment: '新客户',
    count: 890,
    avgOrderValue: 1250,
    lifetimeValue: 1250,
    retentionRate: 25
  },
  {
    segment: '回头客',
    count: 2340,
    avgOrderValue: 1890,
    lifetimeValue: 5670,
    retentionRate: 78
  },
  {
    segment: 'VIP客户',
    count: 190,
    avgOrderValue: 4500,
    lifetimeValue: 13500,
    retentionRate: 95
  }
])

// 销售趋势图表配置
const salesChartOption = computed(() => ({
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
      data: [120000, 150000, 180000, 220000, 250000, 280000, 320000],
      smooth: true,
      itemStyle: {
        color: '#409EFF'
      }
    },
    {
      name: '订单数',
      type: 'line',
      yAxisIndex: 1,
      data: [450, 520, 680, 750, 820, 880, 950],
      smooth: true,
      itemStyle: {
        color: '#67C23A'
      }
    }
  ]
}))

// 流量分析图表配置
const trafficChartOption = computed(() => ({
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
      data: [12000, 15000, 18000, 22000, 25000, 28000, 32000],
      itemStyle: {
        color: '#409EFF'
      }
    },
    {
      name: '访客数',
      type: 'bar',
      yAxisIndex: 0,
      data: [8000, 9500, 11000, 13000, 14500, 16000, 18000],
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
}))

// 销售漏斗图表配置
const funnelChartOption = computed(() => ({
  title: {
    text: '销售漏斗',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 'normal'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  series: [
    {
      name: '销售漏斗',
      type: 'funnel',
      left: '10%',
      top: 60,
      bottom: 60,
      width: '80%',
      min: 0,
      max: 100,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: {
        show: true,
        position: 'inside'
      },
      labelLine: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        label: {
          fontSize: 20
        }
      },
      data: [
        { value: 100, name: '访问者' },
        { value: 80, name: '浏览商品' },
        { value: 60, name: '加入购物车' },
        { value: 40, name: '开始结账' },
        { value: 20, name: '完成购买' }
      ]
    }
  ]
}))

// 设备分析图表配置
const deviceChartOption = computed(() => ({
  title: {
    text: '设备分析',
    left: 'center',
    textStyle: {
      fontSize: 16,
      fontWeight: 'normal'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle'
  },
  series: [
    {
      name: '设备类型',
      type: 'pie',
      radius: '50%',
      center: ['60%', '50%'],
      data: [
        { value: 45, name: '桌面端' },
        { value: 35, name: '移动端' },
        { value: 20, name: '平板端' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))

// 方法
const formatNumber = (num: number) => {
  return num.toLocaleString()
}

const updateDateRange = () => {
  ElMessage.success('日期范围已更新')
}

const exportReport = () => {
  ElMessage.success('报告导出中...')
}

const viewAllProducts = () => {
  ElMessage.info('查看所有商品')
}

const viewAllCustomers = () => {
  ElMessage.info('查看所有客户')
}
</script>

<style lang="scss" scoped>
.analytics-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
      margin: 0;
    }
  }
  
  .header-right {
    display: flex;
    gap: 16px;
    align-items: center;
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.metric-card {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  display: flex;
  align-items: center;
  
  .metric-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    
    &.revenue {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    &.orders {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }
    
    &.customers {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }
    
    &.conversion {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: white;
    }
    
    .el-icon {
      font-size: 24px;
    }
  }
  
  .metric-content {
    flex: 1;
    
    h3 {
      font-size: 14px;
      color: var(--saas-text-secondary);
      margin: 0 0 8px 0;
      font-weight: 500;
    }
    
    .metric-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--saas-text-primary);
      margin-bottom: 8px;
    }
    
    .metric-change {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
      
      &.positive {
        color: var(--saas-success);
      }
      
      &.negative {
        color: var(--saas-danger);
      }
      
      .el-icon {
        margin-right: 4px;
      }
    }
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--saas-text-primary);
      margin: 0;
    }
  }
  
  .chart-container {
    height: 300px;
    
    .chart {
      width: 100%;
      height: 100%;
    }
  }
}

.data-tables {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.table-card {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--saas-text-primary);
      margin: 0;
    }
  }
  
  .product-cell {
    display: flex;
    align-items: center;
    
    .product-image {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      margin-right: 12px;
      object-fit: cover;
    }
    
    .product-info {
      .product-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--saas-text-primary);
        margin-bottom: 2px;
      }
      
      .product-sku {
        font-size: 12px;
        color: var(--saas-text-secondary);
      }
    }
  }
  
  .growth-positive {
    color: var(--saas-success);
    font-weight: 600;
  }
  
  .growth-negative {
    color: var(--saas-danger);
    font-weight: 600;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .data-tables {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    padding: 16px;
  }
  
  .table-card {
    padding: 16px;
  }
}
</style>