<template>
  <div class="marketing-tools-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">营销工具</h1>
        <p class="page-subtitle">提升您的商店营销效果</p>
      </div>
    </div>

    <div class="marketing-grid">
      <!-- SEO优化 -->
      <div class="marketing-card">
        <div class="card-header">
          <div class="card-icon seo">
            <el-icon><Search /></el-icon>
          </div>
          <div class="card-title">
            <h3>SEO优化</h3>
            <p>提升搜索引擎排名</p>
          </div>
        </div>
        <div class="card-content">
          <div class="seo-stats">
            <div class="stat-item">
              <span class="stat-label">页面标题</span>
              <el-tag :type="seoData.titleScore > 80 ? 'success' : seoData.titleScore > 60 ? 'warning' : 'danger'">
                {{ seoData.titleScore }}分
              </el-tag>
            </div>
            <div class="stat-item">
              <span class="stat-label">元描述</span>
              <el-tag :type="seoData.descriptionScore > 80 ? 'success' : seoData.descriptionScore > 60 ? 'warning' : 'danger'">
                {{ seoData.descriptionScore }}分
              </el-tag>
            </div>
            <div class="stat-item">
              <span class="stat-label">关键词密度</span>
              <el-tag :type="seoData.keywordScore > 80 ? 'success' : seoData.keywordScore > 60 ? 'warning' : 'danger'">
                {{ seoData.keywordScore }}分
              </el-tag>
            </div>
          </div>
          <div class="card-actions">
            <el-button type="primary" @click="openSEOOptimizer">优化SEO</el-button>
            <el-button @click="viewSEOReport">查看报告</el-button>
          </div>
        </div>
      </div>

      <!-- 社交媒体集成 -->
      <div class="marketing-card">
        <div class="card-header">
          <div class="card-icon social">
            <el-icon><Share /></el-icon>
          </div>
          <div class="card-title">
            <h3>社交媒体</h3>
            <p>连接社交媒体平台</p>
          </div>
        </div>
        <div class="card-content">
          <div class="social-platforms">
            <div class="platform-item">
              <div class="platform-info">
                <img src="https://logos-world.net/wp-content/uploads/2021/02/Facebook-Logo.png" alt="Facebook" class="platform-logo" />
                <span>Facebook</span>
              </div>
              <el-switch v-model="socialData.facebook.connected" />
            </div>
            <div class="platform-item">
              <div class="platform-info">
                <img src="https://logos-world.net/wp-content/uploads/2021/08/Instagram-Logo.png" alt="Instagram" class="platform-logo" />
                <span>Instagram</span>
              </div>
              <el-switch v-model="socialData.instagram.connected" />
            </div>
            <div class="platform-item">
              <div class="platform-info">
                <img src="https://logos-world.net/wp-content/uploads/2021/08/Twitter-Logo.png" alt="Twitter" class="platform-logo" />
                <span>Twitter</span>
              </div>
              <el-switch v-model="socialData.twitter.connected" />
            </div>
            <div class="platform-item">
              <div class="platform-info">
                <img src="https://logos-world.net/wp-content/uploads/2021/08/YouTube-Logo.png" alt="YouTube" class="platform-logo" />
                <span>YouTube</span>
              </div>
              <el-switch v-model="socialData.youtube.connected" />
            </div>
          </div>
          <div class="card-actions">
            <el-button type="primary" @click="manageSocialMedia">管理连接</el-button>
          </div>
        </div>
      </div>

      <!-- 邮件营销 -->
      <div class="marketing-card">
        <div class="card-header">
          <div class="card-icon email">
            <el-icon><Message /></el-icon>
          </div>
          <div class="card-title">
            <h3>邮件营销</h3>
            <p>发送营销邮件和通知</p>
          </div>
        </div>
        <div class="card-content">
          <div class="email-stats">
            <div class="stat-row">
              <span class="stat-label">订阅用户</span>
              <span class="stat-value">{{ emailData.subscribers.toLocaleString() }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">打开率</span>
              <span class="stat-value">{{ emailData.openRate }}%</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">点击率</span>
              <span class="stat-value">{{ emailData.clickRate }}%</span>
            </div>
          </div>
          <div class="card-actions">
            <el-button type="primary" @click="createEmailCampaign">创建邮件</el-button>
            <el-button @click="viewEmailAnalytics">查看分析</el-button>
          </div>
        </div>
      </div>

      <!-- 推广活动 -->
      <div class="marketing-card">
        <div class="card-header">
          <div class="card-icon promotion">
            <el-icon><Promotion /></el-icon>
          </div>
          <div class="card-title">
            <h3>推广活动</h3>
            <p>创建和管理促销活动</p>
          </div>
        </div>
        <div class="card-content">
          <div class="promotion-list">
            <div class="promotion-item" v-for="promotion in activePromotions" :key="promotion.id">
              <div class="promotion-info">
                <h4>{{ promotion.name }}</h4>
                <p>{{ promotion.description }}</p>
                <div class="promotion-meta">
                  <el-tag :type="promotion.type === 'discount' ? 'success' : 'warning'" size="small">
                    {{ promotion.type === 'discount' ? '折扣' : '满减' }}
                  </el-tag>
                  <span class="promotion-date">{{ promotion.endDate }}</span>
                </div>
              </div>
              <div class="promotion-actions">
                <el-button size="small" @click="editPromotion(promotion)">编辑</el-button>
                <el-button size="small" type="danger" @click="deletePromotion(promotion)">删除</el-button>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <el-button type="primary" @click="createPromotion">创建活动</el-button>
          </div>
        </div>
      </div>

      <!-- 广告管理 -->
      <div class="marketing-card">
        <div class="card-header">
          <div class="card-icon ads">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="card-title">
            <h3>广告管理</h3>
            <p>管理在线广告投放</p>
          </div>
        </div>
        <div class="card-content">
          <div class="ads-overview">
            <div class="ads-stat">
              <span class="ads-label">总花费</span>
              <span class="ads-value">¥{{ adsData.totalSpent.toLocaleString() }}</span>
            </div>
            <div class="ads-stat">
              <span class="ads-label">点击次数</span>
              <span class="ads-value">{{ adsData.clicks.toLocaleString() }}</span>
            </div>
            <div class="ads-stat">
              <span class="ads-label">转化率</span>
              <span class="ads-value">{{ adsData.conversionRate }}%</span>
            </div>
          </div>
          <div class="card-actions">
            <el-button type="primary" @click="createAdCampaign">创建广告</el-button>
            <el-button @click="viewAdsAnalytics">查看分析</el-button>
          </div>
        </div>
      </div>

      <!-- 内容营销 -->
      <div class="marketing-card">
        <div class="card-header">
          <div class="card-icon content">
            <el-icon><Document /></el-icon>
          </div>
          <div class="card-title">
            <h3>内容营销</h3>
            <p>创建和管理营销内容</p>
          </div>
        </div>
        <div class="card-content">
          <div class="content-types">
            <div class="content-type" @click="createContent('blog')">
              <el-icon><Document /></el-icon>
              <span>博客文章</span>
            </div>
            <div class="content-type" @click="createContent('video')">
              <el-icon><VideoPlay /></el-icon>
              <span>视频内容</span>
            </div>
            <div class="content-type" @click="createContent('banner')">
              <el-icon><Picture /></el-icon>
              <span>横幅广告</span>
            </div>
            <div class="content-type" @click="createContent('popup')">
              <el-icon><Bell /></el-icon>
              <span>弹窗广告</span>
            </div>
          </div>
          <div class="card-actions">
            <el-button type="primary" @click="viewContentLibrary">内容库</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search, Share, Message, Promotion, TrendCharts, Document, VideoPlay, Picture, Bell
} from '@element-plus/icons-vue'

// 响应式数据
const seoData = reactive({
  titleScore: 85,
  descriptionScore: 72,
  keywordScore: 68
})

const socialData = reactive({
  facebook: { connected: true, followers: 12500 },
  instagram: { connected: true, followers: 8900 },
  twitter: { connected: false, followers: 0 },
  youtube: { connected: true, followers: 3200 }
})

const emailData = reactive({
  subscribers: 15420,
  openRate: 24.5,
  clickRate: 3.2
})

const activePromotions = ref([
  {
    id: 1,
    name: '春季大促销',
    description: '全场商品8折优惠',
    type: 'discount',
    endDate: '2024-03-31'
  },
  {
    id: 2,
    name: '满减活动',
    description: '满500减50，满1000减120',
    type: 'coupon',
    endDate: '2024-04-15'
  }
])

const adsData = reactive({
  totalSpent: 12500,
  clicks: 45600,
  conversionRate: 2.8
})

// 方法
const openSEOOptimizer = () => {
  ElMessage.info('打开SEO优化工具')
}

const viewSEOReport = () => {
  ElMessage.info('查看SEO报告')
}

const manageSocialMedia = () => {
  ElMessage.info('管理社交媒体连接')
}

const createEmailCampaign = () => {
  ElMessage.info('创建邮件营销活动')
}

const viewEmailAnalytics = () => {
  ElMessage.info('查看邮件分析')
}

const createPromotion = () => {
  ElMessage.info('创建推广活动')
}

const editPromotion = (promotion: any) => {
  ElMessage.info(`编辑活动: ${promotion.name}`)
}

const deletePromotion = async (promotion: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除活动"${promotion.name}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const index = activePromotions.value.findIndex(p => p.id === promotion.id)
    if (index > -1) {
      activePromotions.value.splice(index, 1)
      ElMessage.success('活动已删除')
    }
  } catch (error) {
    // 用户取消
  }
}

const createAdCampaign = () => {
  ElMessage.info('创建广告活动')
}

const viewAdsAnalytics = () => {
  ElMessage.info('查看广告分析')
}

const createContent = (type: string) => {
  ElMessage.info(`创建${type}内容`)
}

const viewContentLibrary = () => {
  ElMessage.info('查看内容库')
}
</script>

<style lang="scss" scoped>
.marketing-tools-page {
  padding: 24px;
}

.page-header {
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
}

.marketing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.marketing-card {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      
      &.seo {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      
      &.social {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
      }
      
      &.email {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
      }
      
      &.promotion {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        color: white;
      }
      
      &.ads {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        color: white;
      }
      
      &.content {
        background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        color: #333;
      }
    }
    
    .card-title {
      h3 {
        font-size: 18px;
        font-weight: 600;
        color: var(--saas-text-primary);
        margin: 0 0 4px 0;
      }
      
      p {
        font-size: 14px;
        color: var(--saas-text-secondary);
        margin: 0;
      }
    }
  }
  
  .card-content {
    .seo-stats {
      .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        .stat-label {
          font-size: 14px;
          color: var(--saas-text-secondary);
        }
      }
    }
    
    .social-platforms {
      .platform-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        
        .platform-info {
          display: flex;
          align-items: center;
          
          .platform-logo {
            width: 24px;
            height: 24px;
            margin-right: 12px;
            border-radius: 4px;
          }
          
          span {
            font-size: 14px;
            color: var(--saas-text-primary);
          }
        }
      }
    }
    
    .email-stats {
      .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        .stat-label {
          font-size: 14px;
          color: var(--saas-text-secondary);
        }
        
        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: var(--saas-text-primary);
        }
      }
    }
    
    .promotion-list {
      .promotion-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: var(--saas-bg-secondary);
        border-radius: 8px;
        margin-bottom: 12px;
        
        .promotion-info {
          flex: 1;
          
          h4 {
            font-size: 14px;
            font-weight: 600;
            color: var(--saas-text-primary);
            margin: 0 0 4px 0;
          }
          
          p {
            font-size: 12px;
            color: var(--saas-text-secondary);
            margin: 0 0 8px 0;
          }
          
          .promotion-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .promotion-date {
              font-size: 12px;
              color: var(--saas-text-tertiary);
            }
          }
        }
        
        .promotion-actions {
          display: flex;
          gap: 8px;
        }
      }
    }
    
    .ads-overview {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      
      .ads-stat {
        text-align: center;
        
        .ads-label {
          display: block;
          font-size: 12px;
          color: var(--saas-text-secondary);
          margin-bottom: 4px;
        }
        
        .ads-value {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: var(--saas-text-primary);
        }
      }
    }
    
    .content-types {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      
      .content-type {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px;
        background: var(--saas-bg-secondary);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: var(--saas-bg-tertiary);
          transform: translateY(-2px);
        }
        
        .el-icon {
          font-size: 24px;
          color: var(--saas-primary);
          margin-bottom: 8px;
        }
        
        span {
          font-size: 12px;
          color: var(--saas-text-primary);
          text-align: center;
        }
      }
    }
  }
  
  .card-actions {
    margin-top: 20px;
    display: flex;
    gap: 12px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .marketing-grid {
    grid-template-columns: 1fr;
  }
  
  .marketing-card {
    padding: 16px;
  }
}
</style>
