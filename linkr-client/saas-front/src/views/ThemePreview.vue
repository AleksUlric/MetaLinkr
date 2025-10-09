<template>
  <div class="theme-preview">
    <!-- 预览头部 -->
    <div class="preview-header">
      <div class="preview-info">
        <h2>{{ previewData.name || '主题预览' }}</h2>
        <p>{{ previewData.description || '实时预览您的主题设计' }}</p>
      </div>
      <div class="preview-controls">
        <el-button @click="refreshPreview">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        <el-button @click="closePreview">
          <el-icon><Close /></el-icon>
          关闭
        </el-button>
      </div>
    </div>

    <!-- 预览内容 -->
    <div class="preview-content" :style="getPreviewStyles()">
      <!-- 头部区域 -->
      <div class="preview-header-demo" :style="getHeaderStyles()">
        <div class="logo" :style="getLogoStyles()">LOGO</div>
        <div class="nav" :style="getNavStyles()">导航菜单</div>
        <div class="search" :style="getSearchStyles()" v-if="theme?.header?.showSearch">搜索框</div>
        <div class="cart" :style="getCartStyles()" v-if="theme?.header?.showCart">购物车</div>
      </div>
      
      <!-- 组件内容区域 -->
      <div class="preview-body" :style="getBodyStyles()">
        <!-- 英雄区域 -->
        <div v-for="component in components" :key="component.id" class="preview-component">
          <!-- 英雄区域 -->
          <div v-if="component.type === 'hero'" class="hero-section">
            <h1 :style="getHeadingStyles()">{{ component.title || '欢迎来到我们的商店' }}</h1>
            <p :style="getTextStyles()">{{ component.subtitle || '这是一个主题预览' }}</p>
            <el-button :style="getButtonStyles()">{{ component.buttonText || '立即购买' }}</el-button>
          </div>

          <!-- 商品网格 -->
          <div v-else-if="component.type === 'products'" class="products-section">
            <h2 :style="getHeadingStyles()">{{ component.title || '热门商品' }}</h2>
            <div class="products-grid" :style="getProductsGridStyles(component.columns || 3)">
              <div v-for="i in (component.productCount || 6)" :key="i" class="product-card" :style="getProductCardStyles()">
                <div class="product-image" :style="getProductImageStyles()">
                  <img :src="`https://picsum.photos/300/200?random=${i}`" alt="商品图片" />
                </div>
                <div class="product-info">
                  <h3 :style="getProductTitleStyles()">商品名称 {{ i }}</h3>
                  <p :style="getPriceStyles()">¥{{ (99 + i * 10).toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 特色功能 -->
          <div v-else-if="component.type === 'features'" class="features-section">
            <h2 :style="getHeadingStyles()">{{ component.title || '我们的特色' }}</h2>
            <div class="features-grid">
              <div v-for="(feature, index) in (component.features || defaultFeatures)" :key="index" class="feature-item" :style="getFeatureItemStyles()">
                <div class="feature-icon">
                  <el-icon><component :is="feature.icon" /></el-icon>
                </div>
                <h3 :style="getFeatureTitleStyles()">{{ feature.title }}</h3>
                <p :style="getTextStyles()">{{ feature.description }}</p>
              </div>
            </div>
          </div>

          <!-- 文本内容 -->
          <div v-else-if="component.type === 'text'" class="text-section">
            <h2 :style="getHeadingStyles()">{{ component.title || '关于我们' }}</h2>
            <p :style="getTextStyles()">{{ component.content || '这里可以添加您的文本内容，介绍您的商店、产品或服务。' }}</p>
          </div>

          <!-- 横幅广告 -->
          <div v-else-if="component.type === 'banner'" class="banner-section" :style="getBannerStyles()">
            <h2 :style="getBannerTitleStyles()">{{ component.title || '特别优惠' }}</h2>
            <p :style="getBannerTextStyles()">{{ component.subtitle || '限时优惠，立即购买' }}</p>
            <el-button :style="getButtonStyles()">{{ component.buttonText || '立即购买' }}</el-button>
          </div>

          <!-- 客户评价 -->
          <div v-else-if="component.type === 'testimonials'" class="testimonials-section">
            <h2 :style="getHeadingStyles()">{{ component.title || '客户评价' }}</h2>
            <div class="testimonials-grid">
              <div v-for="(testimonial, index) in (component.testimonials || defaultTestimonials)" :key="index" class="testimonial-item" :style="getTestimonialItemStyles()">
                <p :style="getTextStyles()">"{{ testimonial.content }}"</p>
                <div class="author">
                  <div class="author-avatar">
                    <img :src="testimonial.avatar" alt="客户头像" />
                  </div>
                  <div class="author-info">
                    <h4 :style="getAuthorNameStyles()">{{ testimonial.name }}</h4>
                    <p :style="getAuthorTitleStyles()">{{ testimonial.title }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 邮件订阅 -->
          <div v-else-if="component.type === 'newsletter'" class="newsletter-section" :style="getNewsletterStyles()">
            <h2 :style="getNewsletterTitleStyles()">{{ component.title || '订阅我们的邮件' }}</h2>
            <p :style="getNewsletterTextStyles()">{{ component.subtitle || '获取最新优惠和产品信息' }}</p>
            <div class="newsletter-form">
              <el-input 
                :style="getNewsletterInputStyles()"
                placeholder="输入您的邮箱地址"
                v-model="email"
              />
              <el-button :style="getButtonStyles()">{{ component.buttonText || '订阅' }}</el-button>
            </div>
          </div>

          <!-- 图片画廊 -->
          <div v-else-if="component.type === 'gallery'" class="gallery-section">
            <h2 :style="getHeadingStyles()">{{ component.title || '产品画廊' }}</h2>
            <div class="gallery-grid">
              <div v-for="i in (component.imageCount || 6)" :key="i" class="gallery-item" :style="getGalleryItemStyles()">
                <img :src="`https://picsum.photos/400/300?random=${i + 10}`" alt="画廊图片" :style="getGalleryImageStyles()" />
              </div>
            </div>
          </div>

          <!-- 联系我们 -->
          <div v-else-if="component.type === 'contact'" class="contact-section">
            <h2 :style="getHeadingStyles()">{{ component.title || '联系我们' }}</h2>
            <div class="contact-content">
              <div class="contact-info">
                <p :style="getTextStyles()">{{ component.description || '有任何问题或建议，请随时联系我们。' }}</p>
                <div class="contact-details">
                  <p><strong>电话：</strong>{{ component.phone || '400-123-4567' }}</p>
                  <p><strong>邮箱：</strong>{{ component.email || 'contact@example.com' }}</p>
                  <p><strong>地址：</strong>{{ component.address || '北京市朝阳区xxx街道xxx号' }}</p>
                </div>
              </div>
              <div class="contact-form" :style="getContactFormStyles()">
                <el-input placeholder="您的姓名" v-model="contactForm.name" :style="getFormInputStyles()" />
                <el-input placeholder="您的邮箱" v-model="contactForm.email" :style="getFormInputStyles()" />
                <el-input 
                  type="textarea" 
                  placeholder="留言内容" 
                  v-model="contactForm.message" 
                  :style="getFormTextareaStyles()"
                  :rows="4"
                />
                <el-button :style="getButtonStyles()">发送消息</el-button>
              </div>
            </div>
          </div>

          <!-- 常见问题 -->
          <div v-else-if="component.type === 'faq'" class="faq-section">
            <h2 :style="getHeadingStyles()">{{ component.title || '常见问题' }}</h2>
            <div class="faq-list">
              <div v-for="(faq, index) in (component.faqs || defaultFaqs)" :key="index" class="faq-item" :style="getFaqItemStyles()">
                <h3 :style="getFaqQuestionStyles()">{{ faq.question }}</h3>
                <p :style="getFaqAnswerStyles()">{{ faq.answer }}</p>
              </div>
            </div>
          </div>

          <!-- 倒计时 -->
          <div v-else-if="component.type === 'countdown'" class="countdown-section" :style="getCountdownStyles()">
            <h2 :style="getCountdownTitleStyles()">{{ component.title || '限时优惠' }}</h2>
            <p :style="getCountdownTextStyles()">{{ component.subtitle || '活动即将结束，抓紧时间！' }}</p>
            <div class="countdown-timer">
              <div class="time-unit">
                <span class="time-value">23</span>
                <span class="time-label">天</span>
              </div>
              <div class="time-unit">
                <span class="time-value">12</span>
                <span class="time-label">时</span>
              </div>
              <div class="time-unit">
                <span class="time-value">45</span>
                <span class="time-label">分</span>
              </div>
              <div class="time-unit">
                <span class="time-value">30</span>
                <span class="time-label">秒</span>
              </div>
            </div>
          </div>

          <!-- 社交媒体 -->
          <div v-else-if="component.type === 'social'" class="social-section">
            <h2 :style="getHeadingStyles()">{{ component.title || '关注我们' }}</h2>
            <div class="social-links">
              <div v-for="(social, index) in (component.socials || defaultSocials)" :key="index" class="social-item" :style="getSocialItemStyles()">
                <el-icon><component :is="social.icon" /></el-icon>
                <span :style="getSocialTextStyles()">{{ social.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 如果没有组件，显示提示 -->
        <div v-if="components.length === 0" class="empty-preview">
          <div class="empty-content">
            <el-icon class="empty-icon"><Picture /></el-icon>
            <h3>暂无组件</h3>
            <p>请在主题编辑器中添加组件</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Refresh, Close, Picture, Star, Grid, Document, Trophy, 
  ChatDotRound, Share, Phone, Message, Timer, Location
} from '@element-plus/icons-vue'

// 响应式数据
const previewData = ref<any>({})
const theme = ref<any>({})
const components = ref<any[]>([])
const email = ref('')
const contactForm = reactive({
  name: '',
  email: '',
  message: ''
})

// 默认数据
const defaultFeatures = [
  { icon: 'Star', title: '优质产品', description: '我们提供最优质的产品' },
  { icon: 'Trophy', title: '专业服务', description: '专业的客户服务团队' },
  { icon: 'ChatDotRound', title: '快速响应', description: '24小时快速响应' }
]

const defaultTestimonials = [
  {
    content: '产品质量非常好，服务也很专业，强烈推荐！',
    name: '张三',
    title: '客户',
    avatar: 'https://picsum.photos/50/50?random=1'
  },
  {
    content: '购买体验很棒，物流很快，包装也很精美。',
    name: '李四',
    title: '客户',
    avatar: 'https://picsum.photos/50/50?random=2'
  }
]

const defaultFaqs = [
  { question: '如何购买产品？', answer: '您可以直接在网站上选择产品并添加到购物车，然后进行结算。' },
  { question: '支持哪些支付方式？', answer: '我们支持支付宝、微信支付、银行卡等多种支付方式。' },
  { question: '如何联系客服？', answer: '您可以通过在线客服、电话或邮件联系我们。' }
]

const defaultSocials = [
  { icon: 'Share', name: '微信' },
  { icon: 'Share', name: '微博' },
  { icon: 'Share', name: 'QQ' }
]

// 计算属性
const getPreviewStyles = () => {
  if (!theme.value) return {}
  
  return {
    fontFamily: theme.value.typography?.fontFamily || 'Arial, sans-serif',
    fontSize: theme.value.typography?.fontSize || '14px',
    lineHeight: theme.value.typography?.lineHeight || '1.6',
    color: theme.value.colors?.textPrimary || '#333333',
    backgroundColor: theme.value.colors?.background || '#ffffff'
  }
}

const getHeaderStyles = () => {
  if (!theme.value) return {}
  
  return {
    backgroundColor: theme.value.colors?.headerBackground || theme.value.colors?.primary || '#409EFF',
    color: theme.value.colors?.headerText || '#ffffff',
    padding: `${theme.value.header?.padding || 16}px ${theme.value.header?.padding || 24}px`
  }
}

const getLogoStyles = () => {
  if (!theme.value) return {}
  
  return {
    fontSize: theme.value.typography?.headingFontSize || '24px',
    fontWeight: theme.value.typography?.fontWeight || 'bold',
    color: theme.value.colors?.logoColor || theme.value.colors?.primary || '#409EFF'
  }
}

const getNavStyles = () => {
  if (!theme.value) return {}
  
  return {
    color: theme.value.colors?.navText || theme.value.colors?.textPrimary || '#333333'
  }
}

const getSearchStyles = () => {
  if (!theme.value) return {}
  
  return {
    backgroundColor: theme.value.colors?.searchBackground || theme.value.colors?.background || '#ffffff',
    color: theme.value.colors?.searchText || theme.value.colors?.textPrimary || '#333333',
    border: `1px solid ${theme.value.colors?.border || '#dcdfe6'}`
  }
}

const getCartStyles = () => {
  if (!theme.value) return {}
  
  return {
    backgroundColor: theme.value.colors?.cartBackground || theme.value.colors?.background || '#ffffff',
    color: theme.value.colors?.cartText || theme.value.colors?.textPrimary || '#333333',
    border: `1px solid ${theme.value.colors?.border || '#dcdfe6'}`
  }
}

const getBodyStyles = () => {
  if (!theme.value) return {}
  
  return {
    backgroundColor: theme.value.colors?.background || '#ffffff',
    padding: `${theme.value.layout?.contentPadding || 24}px`
  }
}

const getComponentStyles = (component: any) => {
  if (!theme.value) return {}
  
  return {
    padding: `${component.padding || 20}px`,
    margin: `${component.margin || 0}px 0`,
    backgroundColor: component.backgroundColor || 'transparent',
    borderRadius: theme.value.components?.card?.borderRadius || '8px',
    boxShadow: theme.value.components?.card?.shadow === 'none' ? 'none' : 
                theme.value.components?.card?.shadow === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' :
                theme.value.components?.card?.shadow === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
                '0 8px 16px rgba(0,0,0,0.2)'
  }
}

const getHeadingStyles = () => {
  if (!theme.value) return {}
  
  return {
    fontFamily: theme.value.typography?.headingFont || theme.value.typography?.fontFamily || 'Arial, sans-serif',
    fontSize: theme.value.typography?.headingFontSize || '24px',
    fontWeight: theme.value.typography?.fontWeight || 'bold',
    color: theme.value.colors?.headingColor || theme.value.colors?.textPrimary || '#333333',
    marginBottom: '16px'
  }
}

const getTextStyles = () => {
  if (!theme.value) return {}
  
  return {
    fontSize: theme.value.typography?.fontSize || '14px',
    lineHeight: theme.value.typography?.lineHeight || '1.6',
    color: theme.value.colors?.textSecondary || theme.value.colors?.textPrimary || '#666666',
    marginBottom: '12px'
  }
}

const getButtonStyles = () => {
  if (!theme.value) return {}
  
  return {
    backgroundColor: theme.value.colors?.primary || '#409EFF',
    color: '#ffffff',
    border: 'none',
    borderRadius: theme.value.components?.button?.borderRadius || '4px',
    padding: theme.value.components?.button?.padding || '8px 16px',
    fontSize: theme.value.typography?.fontSize || '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
}

const getProductCardStyles = () => {
  if (!theme.value) return {}
  
  return {
    backgroundColor: theme.value.colors?.cardBackground || '#ffffff',
    borderRadius: theme.value.components?.card?.borderRadius || '8px',
    boxShadow: theme.value.components?.card?.shadow === 'none' ? 'none' : 
                theme.value.components?.card?.shadow === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' :
                theme.value.components?.card?.shadow === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
                '0 8px 16px rgba(0,0,0,0.2)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease'
  }
}

const getProductImageStyles = () => {
  return {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  }
}

const getProductTitleStyles = () => {
  if (!theme.value) return {}
  
  return {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.value.colors?.textPrimary || '#333333',
    margin: '12px 0 8px 0'
  }
}

const getPriceStyles = () => {
  if (!theme.value) return {}
  
  return {
    fontSize: '18px',
    fontWeight: 'bold',
    color: theme.value.colors?.primary || '#409EFF',
    margin: '0'
  }
}

const getFeatureItemStyles = () => {
  if (!theme.value) return {}
  
  return {
    textAlign: 'center',
    padding: '24px',
    backgroundColor: theme.value.colors?.cardBackground || '#ffffff',
    borderRadius: theme.value.components?.card?.borderRadius || '8px',
    boxShadow: theme.value.components?.card?.shadow === 'none' ? 'none' : 
                theme.value.components?.card?.shadow === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' :
                theme.value.components?.card?.shadow === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
                '0 8px 16px rgba(0,0,0,0.2)'
  }
}

const getFeatureTitleStyles = () => {
  if (!theme.value) return {}
  
  return {
    fontSize: '18px',
    fontWeight: '600',
    color: theme.value.colors?.textPrimary || '#333333',
    margin: '16px 0 8px 0'
  }
}

const getProductsGridStyles = (columns: number) => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '16px'
  }
}

const getBannerStyles = () => {
  if (!theme.value) return {}
  
  return {
    backgroundColor: theme.value.colors?.primary || '#409EFF',
    color: '#ffffff',
    textAlign: 'center',
    padding: '48px 24px',
    borderRadius: theme.value.components?.card?.borderRadius || '8px'
  }
}

const getBannerTitleStyles = () => {
  return {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
    color: '#ffffff'
  }
}

const getBannerTextStyles = () => {
  return {
    fontSize: '18px',
    margin: '0 0 24px 0',
    color: '#ffffff'
  }
}

const getTestimonialItemStyles = () => {
  if (!theme.value) return {}
  
  return {
    backgroundColor: theme.value.colors?.cardBackground || '#ffffff',
    padding: '24px',
    borderRadius: theme.value.components?.card?.borderRadius || '8px',
    boxShadow: theme.value.components?.card?.shadow === 'none' ? 'none' : 
                theme.value.components?.card?.shadow === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' :
                theme.value.components?.card?.shadow === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
                '0 8px 16px rgba(0,0,0,0.2)'
  }
}

const getAuthorNameStyles = () => {
  if (!theme.value) return {}
  
  return {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.value.colors?.textPrimary || '#333333',
    margin: '0 0 4px 0'
  }
}

const getAuthorTitleStyles = () => {
  if (!theme.value) return {}
  
  return {
    fontSize: '14px',
    color: theme.value.colors?.textSecondary || '#666666',
    margin: '0'
  }
}

const getNewsletterStyles = () => {
  if (!theme.value) return {}
  
  return {
    backgroundColor: theme.value.colors?.primary || '#409EFF',
    color: '#ffffff',
    textAlign: 'center',
    padding: '48px 24px',
    borderRadius: theme.value.components?.card?.borderRadius || '8px'
  }
}

const getNewsletterTitleStyles = () => {
  return {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
    color: '#ffffff'
  }
}

const getNewsletterTextStyles = () => {
  return {
    fontSize: '16px',
    margin: '0 0 24px 0',
    color: '#ffffff'
  }
}

const getNewsletterInputStyles = () => {
  return {
    width: '300px',
    marginRight: '12px'
  }
}

const getGalleryItemStyles = () => {
  if (!theme.value) return {}
  
  return {
    borderRadius: theme.value.components?.card?.borderRadius || '8px',
    overflow: 'hidden',
    boxShadow: theme.value.components?.card?.shadow === 'none' ? 'none' : 
                theme.value.components?.card?.shadow === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' :
                theme.value.components?.card?.shadow === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
                '0 8px 16px rgba(0,0,0,0.2)'
  }
}

const getGalleryImageStyles = () => {
  return {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  }
}

const getContactFormStyles = () => {
  if (!theme.value) return {}
  
  return {
    backgroundColor: theme.value.colors?.cardBackground || '#ffffff',
    padding: '24px',
    borderRadius: theme.value.components?.card?.borderRadius || '8px',
    boxShadow: theme.value.components?.card?.shadow === 'none' ? 'none' : 
                theme.value.components?.card?.shadow === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' :
                theme.value.components?.card?.shadow === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
                '0 8px 16px rgba(0,0,0,0.2)'
  }
}

const getFormInputStyles = () => {
  return {
    marginBottom: '16px'
  }
}

const getFormTextareaStyles = () => {
  return {
    marginBottom: '16px'
  }
}

const getFaqItemStyles = () => {
  if (!theme.value) return {}
  
  return {
    backgroundColor: theme.value.colors?.cardBackground || '#ffffff',
    padding: '20px',
    borderRadius: theme.value.components?.card?.borderRadius || '8px',
    boxShadow: theme.value.components?.card?.shadow === 'none' ? 'none' : 
                theme.value.components?.card?.shadow === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' :
                theme.value.components?.card?.shadow === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
                '0 8px 16px rgba(0,0,0,0.2)',
    marginBottom: '16px'
  }
}

const getFaqQuestionStyles = () => {
  if (!theme.value) return {}
  
  return {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.value.colors?.textPrimary || '#333333',
    margin: '0 0 8px 0'
  }
}

const getFaqAnswerStyles = () => {
  if (!theme.value) return {}
  
  return {
    fontSize: '14px',
    color: theme.value.colors?.textSecondary || '#666666',
    margin: '0',
    lineHeight: '1.6'
  }
}

const getCountdownStyles = () => {
  if (!theme.value) return {}
  
  return {
    backgroundColor: theme.value.colors?.primary || '#409EFF',
    color: '#ffffff',
    textAlign: 'center',
    padding: '48px 24px',
    borderRadius: theme.value.components?.card?.borderRadius || '8px'
  }
}

const getCountdownTitleStyles = () => {
  return {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
    color: '#ffffff'
  }
}

const getCountdownTextStyles = () => {
  return {
    fontSize: '16px',
    margin: '0 0 24px 0',
    color: '#ffffff'
  }
}

const getSocialItemStyles = () => {
  if (!theme.value) return {}
  
  return {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: theme.value.colors?.cardBackground || '#ffffff',
    borderRadius: theme.value.components?.card?.borderRadius || '8px',
    boxShadow: theme.value.components?.card?.shadow === 'none' ? 'none' : 
                theme.value.components?.card?.shadow === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' :
                theme.value.components?.card?.shadow === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
                '0 8px 16px rgba(0,0,0,0.2)',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
}

const getSocialTextStyles = () => {
  if (!theme.value) return {}
  
  return {
    marginLeft: '8px',
    fontSize: '14px',
    color: theme.value.colors?.textPrimary || '#333333'
  }
}

// 方法
const refreshPreview = () => {
  loadPreviewData()
  ElMessage.success('预览已刷新')
}

const closePreview = () => {
  window.close()
}

const loadPreviewData = () => {
  try {
    const data = localStorage.getItem('theme-preview-data')
    if (data) {
      const parsed = JSON.parse(data)
      previewData.value = parsed
      theme.value = parsed.theme || {}
      components.value = parsed.components || []
    } else {
      ElMessage.warning('没有找到预览数据')
    }
  } catch (error) {
    console.error('加载预览数据失败:', error)
    ElMessage.error('加载预览数据失败')
  }
}

onMounted(() => {
  loadPreviewData()
})
</script>

<style lang="scss" scoped>
.theme-preview {
  min-height: 100vh;
  background: #f5f5f5;
  
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: white;
    border-bottom: 1px solid #e4e7ed;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .preview-info {
      h2 {
        margin: 0 0 4px 0;
        color: #303133;
        font-size: 20px;
        font-weight: 600;
      }
      
      p {
        margin: 0;
        color: #909399;
        font-size: 14px;
      }
    }
    
    .preview-controls {
      display: flex;
      gap: 8px;
    }
  }
  
  .preview-content {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    min-height: calc(100vh - 80px);
    
    .preview-header-demo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid #e4e7ed;
      
      .logo {
        font-weight: 600;
        font-size: 24px;
      }
      
      .nav {
        flex: 1;
        text-align: center;
        font-size: 14px;
      }
      
      .search, .cart {
        padding: 8px 16px;
        background: #f5f7fa;
        border-radius: 4px;
        font-size: 12px;
        margin-left: 8px;
      }
    }
    
    .preview-body {
      padding: 24px;
      
      .preview-component {
        margin-bottom: 32px;
        
        .hero-section {
          text-align: center;
          padding: 48px 24px;
          
          h1 {
            margin: 0 0 16px 0;
          }
          
          p {
            margin: 0 0 24px 0;
          }
        }
        
        .products-section {
          h2 {
            text-align: center;
            margin-bottom: 24px;
          }
          
          .products-grid {
            display: grid;
            gap: 16px;
            
            .product-card {
              overflow: hidden;
              transition: transform 0.3s ease;
              
              &:hover {
                transform: translateY(-4px);
              }
              
              .product-image {
                width: 100%;
                height: 200px;
                overflow: hidden;
                
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
              }
              
              .product-info {
                padding: 16px;
                
                h3 {
                  margin: 0 0 8px 0;
                }
                
                p {
                  margin: 0;
                }
              }
            }
          }
        }
        
        .features-section {
          h2 {
            text-align: center;
            margin-bottom: 32px;
          }
          
          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
            
            .feature-item {
              .feature-icon {
                width: 60px;
                height: 60px;
                margin: 0 auto 16px;
                background: #409EFF;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
              }
              
              h3 {
                margin: 0 0 8px 0;
              }
              
              p {
                margin: 0;
              }
            }
          }
        }
        
        .text-section {
          h2 {
            margin-bottom: 16px;
          }
          
          p {
            margin: 0;
          }
        }
        
        .banner-section {
          text-align: center;
          padding: 48px 24px;
          
          h2 {
            margin: 0 0 16px 0;
          }
          
          p {
            margin: 0 0 24px 0;
          }
        }
        
        .testimonials-section {
          h2 {
            text-align: center;
            margin-bottom: 32px;
          }
          
          .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            
            .testimonial-item {
              p {
                margin: 0 0 16px 0;
                font-style: italic;
              }
              
              .author {
                display: flex;
                align-items: center;
                
                .author-avatar {
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  overflow: hidden;
                  margin-right: 12px;
                  
                  img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                }
                
                .author-info {
                  h4 {
                    margin: 0 0 4px 0;
                  }
                  
                  p {
                    margin: 0;
                  }
                }
              }
            }
          }
        }
        
        .newsletter-section {
          text-align: center;
          padding: 48px 24px;
          
          h2 {
            margin: 0 0 16px 0;
          }
          
          p {
            margin: 0 0 24px 0;
          }
          
          .newsletter-form {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
          }
        }
        
        .gallery-section {
          h2 {
            text-align: center;
            margin-bottom: 24px;
          }
          
          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            
            .gallery-item {
              img {
                width: 100%;
                height: 200px;
                object-fit: cover;
              }
            }
          }
        }
        
        .contact-section {
          h2 {
            text-align: center;
            margin-bottom: 32px;
          }
          
          .contact-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            
            .contact-info {
              .contact-details {
                margin-top: 16px;
                
                p {
                  margin: 8px 0;
                }
              }
            }
            
            .contact-form {
              .el-input, .el-textarea {
                margin-bottom: 16px;
              }
            }
          }
        }
        
        .faq-section {
          h2 {
            text-align: center;
            margin-bottom: 24px;
          }
          
          .faq-list {
            .faq-item {
              h3 {
                margin: 0 0 8px 0;
              }
              
              p {
                margin: 0;
              }
            }
          }
        }
        
        .countdown-section {
          text-align: center;
          padding: 48px 24px;
          
          h2 {
            margin: 0 0 16px 0;
          }
          
          p {
            margin: 0 0 24px 0;
          }
          
          .countdown-timer {
            display: flex;
            justify-content: center;
            gap: 16px;
            
            .time-unit {
              text-align: center;
              
              .time-value {
                display: block;
                font-size: 32px;
                font-weight: bold;
                color: #ffffff;
              }
              
              .time-label {
                display: block;
                font-size: 14px;
                color: #ffffff;
                margin-top: 4px;
              }
            }
          }
        }
        
        .social-section {
          h2 {
            text-align: center;
            margin-bottom: 24px;
          }
          
          .social-links {
            display: flex;
            justify-content: center;
            gap: 16px;
            flex-wrap: wrap;
            
            .social-item {
              &:hover {
                transform: translateY(-2px);
              }
            }
          }
        }
      }
      
      .empty-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        text-align: center;
        
        .empty-content {
          .empty-icon {
            font-size: 64px;
            color: #c0c4cc;
            margin-bottom: 16px;
          }
          
          h3 {
            margin: 0 0 8px 0;
            color: #909399;
          }
          
          p {
            margin: 0;
            color: #c0c4cc;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .theme-preview {
    .preview-header {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }
    
    .preview-content {
      .preview-body {
        padding: 16px;
        
        .preview-component {
          .contact-section {
            .contact-content {
              grid-template-columns: 1fr;
              gap: 24px;
            }
          }
          
          .newsletter-section {
            .newsletter-form {
              flex-direction: column;
              align-items: stretch;
            }
          }
          
          .countdown-section {
            .countdown-timer {
              flex-wrap: wrap;
            }
          }
        }
      }
    }
  }
}
</style>

