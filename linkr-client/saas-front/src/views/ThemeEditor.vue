<template>
  <div class="theme-editor">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">主题编辑器</h1>
        <p class="page-subtitle">可视化编辑您的商店主题</p>
      </div>
      <div class="header-right">
        <el-button @click="previewTheme">
          <el-icon><View /></el-icon>
          预览
        </el-button>
        <el-button type="primary" @click="saveTheme">
          <el-icon><Check /></el-icon>
          保存主题
        </el-button>
      </div>
    </div>
    
    <div class="editor-layout">
      <!-- 左侧工具栏 -->
      <div class="editor-sidebar">
        <el-tabs v-model="activeTab" class="editor-tabs">
          <!-- 布局设置 -->
          <el-tab-pane label="布局" name="layout">
            <div class="tab-content">
              <div class="section">
                <h3>页面布局</h3>
                <el-radio-group v-model="themeConfig.layout.type" @change="updateTheme">
                  <el-radio label="full-width">全宽布局</el-radio>
                  <el-radio label="boxed">盒式布局</el-radio>
                  <el-radio label="sidebar">侧边栏布局</el-radio>
                </el-radio-group>
              </div>

              <div class="section">
                <h3>头部设置</h3>
                <el-form-item label="头部高度">
                  <el-slider
                    v-model="themeConfig.header.height"
                    :min="60"
                    :max="120"
                    @change="updateTheme"
                  />
                </el-form-item>
                <el-form-item label="显示搜索框">
                  <el-switch
                    v-model="themeConfig.header.showSearch"
                    @change="updateTheme"
                  />
                </el-form-item>
                <el-form-item label="显示购物车">
                  <el-switch
                    v-model="themeConfig.header.showCart"
                    @change="updateTheme"
                  />
                </el-form-item>
              </div>
            </div>
          </el-tab-pane>

          <!-- 颜色设置 -->
          <el-tab-pane label="颜色" name="colors">
            <div class="tab-content">
              <div class="section">
                <h3>主色调</h3>
                <el-form-item label="主色">
                  <el-color-picker
                    v-model="themeConfig.colors.primary"
                    @change="updateTheme"
                  />
                </el-form-item>
                <el-form-item label="辅助色">
                  <el-color-picker
                    v-model="themeConfig.colors.secondary"
                    @change="updateTheme"
                  />
                </el-form-item>
              </div>

              <div class="section">
                <h3>背景色</h3>
                <el-form-item label="页面背景">
                  <el-color-picker
                    v-model="themeConfig.colors.background"
                    @change="updateTheme"
                  />
                </el-form-item>
                <el-form-item label="卡片背景">
                  <el-color-picker
                    v-model="themeConfig.colors.cardBackground"
                    @change="updateTheme"
                  />
                </el-form-item>
              </div>
            </div>
          </el-tab-pane>

          <!-- 字体设置 -->
          <el-tab-pane label="字体" name="typography">
            <div class="tab-content">
              <div class="section">
                <h3>字体族</h3>
                <el-form-item label="主字体">
                  <el-select v-model="themeConfig.typography.fontFamily" @change="updateTheme">
                    <el-option label="系统默认" value="system" />
                    <el-option label="微软雅黑" value="Microsoft YaHei" />
                    <el-option label="苹方" value="PingFang SC" />
                    <el-option label="Roboto" value="Roboto" />
                    <el-option label="思源黑体" value="Source Han Sans" />
                    <el-option label="Noto Sans" value="Noto Sans" />
                  </el-select>
                </el-form-item>
                <el-form-item label="标题字体">
                  <el-select v-model="themeConfig.typography.headingFont" @change="updateTheme">
                    <el-option label="与主字体相同" value="inherit" />
                    <el-option label="微软雅黑" value="Microsoft YaHei" />
                    <el-option label="苹方" value="PingFang SC" />
                    <el-option label="Roboto" value="Roboto" />
                  </el-select>
                </el-form-item>
              </div>

              <div class="section">
                <h3>字体大小</h3>
                <el-form-item label="基础字体大小">
                  <el-slider
                    v-model="themeConfig.typography.baseFontSize"
                    :min="12"
                    :max="18"
                    @change="updateTheme"
                  />
                </el-form-item>
                <el-form-item label="标题字体大小">
                  <el-slider
                    v-model="themeConfig.typography.headingFontSize"
                    :min="16"
                    :max="48"
                    @change="updateTheme"
                  />
                </el-form-item>
              </div>

              <div class="section">
                <h3>字体样式</h3>
                <el-form-item label="字体粗细">
                  <el-select v-model="themeConfig.typography.fontWeight" @change="updateTheme">
                    <el-option label="细体 (300)" value="300" />
                    <el-option label="正常 (400)" value="400" />
                    <el-option label="中等 (500)" value="500" />
                    <el-option label="粗体 (600)" value="600" />
                    <el-option label="特粗 (700)" value="700" />
                  </el-select>
                </el-form-item>
                <el-form-item label="行高">
                  <el-slider
                    v-model="themeConfig.typography.lineHeight"
                    :min="1.2"
                    :max="2.0"
                    :step="0.1"
                    @change="updateTheme"
                  />
                </el-form-item>
              </div>
            </div>
          </el-tab-pane>

          <!-- 组件设置 -->
          <el-tab-pane label="组件" name="components">
            <div class="tab-content">
              <div class="section">
                <h3>按钮样式</h3>
                <el-form-item label="按钮圆角">
                  <el-slider
                    v-model="themeConfig.components.button.borderRadius"
                    :min="0"
                    :max="20"
                    @change="updateTheme"
                  />
                </el-form-item>
                <el-form-item label="按钮内边距">
                  <el-slider
                    v-model="themeConfig.components.button.padding"
                    :min="8"
                    :max="24"
                    @change="updateTheme"
                  />
                </el-form-item>
              </div>

              <div class="section">
                <h3>卡片样式</h3>
                <el-form-item label="卡片圆角">
                  <el-slider
                    v-model="themeConfig.components.card.borderRadius"
                    :min="0"
                    :max="20"
                    @change="updateTheme"
                  />
                </el-form-item>
                <el-form-item label="卡片阴影">
                  <el-select v-model="themeConfig.components.card.shadow" @change="updateTheme">
                    <el-option label="无阴影" value="none" />
                    <el-option label="轻微阴影" value="light" />
                    <el-option label="中等阴影" value="medium" />
                    <el-option label="重阴影" value="heavy" />
                  </el-select>
                </el-form-item>
              </div>

              <div class="section">
                <h3>表单样式</h3>
                <el-form-item label="输入框圆角">
                  <el-slider
                    v-model="themeConfig.components.form.inputBorderRadius"
                    :min="0"
                    :max="12"
                    @change="updateTheme"
                  />
                </el-form-item>
                <el-form-item label="输入框边框">
                  <el-select v-model="themeConfig.components.form.inputBorder" @change="updateTheme">
                    <el-option label="无边框" value="none" />
                    <el-option label="细边框" value="thin" />
                    <el-option label="中等边框" value="medium" />
                    <el-option label="粗边框" value="thick" />
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-tab-pane>

          <!-- 动画设置 -->
          <el-tab-pane label="动画" name="animations">
            <div class="tab-content">
              <div class="section">
                <h3>过渡动画</h3>
                <el-form-item label="页面切换动画">
                  <el-switch
                    v-model="themeConfig.animations.pageTransition"
                    @change="updateTheme"
                  />
                </el-form-item>
                <el-form-item label="悬停动画">
                  <el-switch
                    v-model="themeConfig.animations.hoverEffects"
                    @change="updateTheme"
                  />
                </el-form-item>
                <el-form-item label="加载动画">
                  <el-switch
                    v-model="themeConfig.animations.loadingAnimations"
                    @change="updateTheme"
                  />
                </el-form-item>
              </div>

              <div class="section">
                <h3>动画速度</h3>
                <el-form-item label="动画持续时间">
                  <el-slider
                    v-model="themeConfig.animations.duration"
                    :min="0.1"
                    :max="1.0"
                    :step="0.1"
                    @change="updateTheme"
                  />
                </el-form-item>
                <el-form-item label="动画缓动">
                  <el-select v-model="themeConfig.animations.easing" @change="updateTheme">
                    <el-option label="线性" value="linear" />
                    <el-option label="缓入" value="ease-in" />
                    <el-option label="缓出" value="ease-out" />
                    <el-option label="缓入缓出" value="ease-in-out" />
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-tab-pane>

          <!-- 组件库 -->
          <el-tab-pane label="组件" name="components-library">
            <div class="tab-content">
              <div class="section">
                <div class="components-header">
                  <h3>页面组件</h3>
                  <el-select
                    v-model="selectedComponentCategory"
                    placeholder="选择分类"
                    size="small"
                    @change="filterComponents"
                  >
                    <el-option label="全部分类" value="" />
                    <el-option label="布局组件" value="layout" />
                    <el-option label="内容组件" value="content" />
                    <el-option label="营销组件" value="marketing" />
                    <el-option label="社交组件" value="social" />
                    <el-option label="媒体组件" value="media" />
                    <el-option label="表单组件" value="forms" />
                  </el-select>
                </div>
                <div class="components-grid">
                  <div 
                    v-for="component in filteredComponents" 
                    :key="component.type"
                    class="component-item"
                    draggable="true"
                    @dragstart="onDragStart($event, component)"
                  >
                    <div class="component-icon">
                      <el-icon><component :is="component.icon" /></el-icon>
                    </div>
                    <div class="component-info">
                      <h4>{{ component.name }}</h4>
                      <p>{{ component.description }}</p>
                      <el-tag size="small" :type="getCategoryType(component.category)">
                        {{ getCategoryName(component.category) }}
                      </el-tag>
                    </div>
                  </div>
                </div>
          </div>
        </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <!-- 中间预览区域 -->
      <div class="editor-preview">
        <div class="preview-header">
          <div class="preview-controls">
            <el-button-group>
            <el-button 
              v-for="device in devices" 
                :key="device.name"
                :type="previewDevice === device.name ? 'primary' : ''"
                @click="previewDevice = device.name"
            >
              <el-icon><component :is="device.icon" /></el-icon>
                {{ device.label }}
            </el-button>
            </el-button-group>
            <div class="component-counter">
              <el-tag type="info" size="small">
                组件数量: {{ previewComponents.length }}
              </el-tag>
            </div>
          </div>
          <div class="preview-url">
            <el-input
              v-model="previewUrl"
              placeholder="预览URL"
              readonly
            >
              <template #append>
                <el-button @click="openPreview">打开</el-button>
              </template>
            </el-input>
          </div>
        </div>
        
        <div class="preview-container" :class="`device-${previewDevice}`">
          <div class="preview-frame">
            <div class="preview-content" :style="getPreviewStyles()">
              <!-- 头部区域 -->
              <div class="preview-header-demo" :style="getHeaderStyles()">
                <div class="logo" :style="getLogoStyles()">LOGO</div>
                <div class="nav" :style="getNavStyles()">导航菜单</div>
                <div class="search" :style="getSearchStyles()" v-if="themeConfig.header.showSearch">搜索框</div>
                <div class="cart" :style="getCartStyles()" v-if="themeConfig.header.showCart">购物车</div>
              </div>
              
              <!-- 可拖拽的内容区域 -->
              <div 
                class="preview-body" 
                :class="{ 'drag-over': isDragOver }"
                :style="getBodyStyles()"
                @dragover="onDragOver"
                @drop="onDrop"
                @dragenter="onDragEnter"
                @dragleave="onDragLeave"
              >
                <!-- 拖拽提示 -->
                <div v-if="previewComponents.length === 0" class="empty-preview">
                  <div class="empty-content">
                    <el-icon class="empty-icon"><Plus /></el-icon>
                    <h3>拖拽组件到这里开始设计</h3>
                    <p>从左侧组件库拖拽组件到此处，或点击组件直接添加</p>
                </div>
                </div>
                <div 
                  v-for="(component, index) in previewComponents" 
                  :key="component.id"
                  :data-component-id="component.id"
                  class="preview-component"
                  :class="{ 
                    'dragging': component.dragging,
                    'drag-over': component.dragOver,
                    'selected': selectedComponent?.id === component.id
                  }"
                  :style="getComponentStyles(component)"
                  draggable="true"
                  @dragstart="onComponentDragStart($event, component, index)"
                  @dragend="onComponentDragEnd($event, component)"
                  @dragover="onComponentDragOver($event, component, index)"
                  @dragenter="onComponentDragEnter($event, component)"
                  @dragleave="onComponentDragLeave($event, component)"
                  @drop="onComponentDrop($event, component, index)"
                  @click="selectComponent(component)"
                >
                  <!-- 英雄区域 -->
                  <div v-if="component.type === 'hero'" class="hero-section">
                    <h1 :style="getHeadingStyles()">{{ component.title || '欢迎来到我们的商店' }}</h1>
                    <p :style="getTextStyles()">{{ component.subtitle || '这是一个主题预览' }}</p>
                    <el-button :style="getButtonStyles()">{{ component.buttonText || '立即购买' }}</el-button>
                  </div>
                  
                  <!-- 商品网格 -->
                  <div v-else-if="component.type === 'products'" class="products-grid" :style="getProductsGridStyles(component)">
                    <div class="product-card" v-for="i in (component.productCount || 6)" :key="i" :style="getProductCardStyles()">
                      <div class="product-image" :style="getProductImageStyles()"></div>
                    <div class="product-info">
                        <h3 :style="getProductTitleStyles()">商品名称 {{ i }}</h3>
                        <p class="price" :style="getPriceStyles()">¥{{ 100 + i * 50 }}</p>
                    </div>
                  </div>
                </div>
                  
                  <!-- 特色区域 -->
                  <div v-else-if="component.type === 'features'" class="features-section">
                    <h2 :style="getHeadingStyles()">我们的特色</h2>
                    <div class="features-grid">
                      <div class="feature-item" v-for="i in 3" :key="i" :style="getFeatureItemStyles()">
                        <div class="feature-icon">⭐</div>
                        <h3 :style="getFeatureTitleStyles()">特色 {{ i }}</h3>
                        <p :style="getTextStyles()">特色描述内容</p>
          </div>
            </div>
          </div>
                  
                  <!-- 文本区域 -->
                  <div v-else-if="component.type === 'text'" class="text-section">
                    <h2 :style="getHeadingStyles()">关于我们</h2>
                    <p :style="getTextStyles()">这里是一段关于我们商店的介绍文字，展示了主题的文本样式效果。</p>
                  </div>
                  
                  <!-- 横幅广告 -->
                  <div v-else-if="component.type === 'banner'" class="banner-section">
                    <div class="banner-content" :style="getBannerStyles()">
                      <h2 :style="getBannerTitleStyles()">限时优惠</h2>
                      <p :style="getBannerTextStyles()">全场商品8折优惠，仅限今日！</p>
                      <el-button :style="getButtonStyles()">立即购买</el-button>
                    </div>
                  </div>
                  
                  <!-- 客户评价 -->
                  <div v-else-if="component.type === 'testimonials'" class="testimonials-section">
                    <h2 :style="getHeadingStyles()">客户评价</h2>
                    <div class="testimonials-grid">
                      <div class="testimonial-item" v-for="i in 3" :key="i" :style="getTestimonialItemStyles()">
                        <div class="testimonial-content">
                          <p :style="getTextStyles()">"产品质量很好，服务也很棒！"</p>
                        </div>
                        <div class="testimonial-author">
                          <div class="author-avatar">👤</div>
                          <div class="author-info">
                            <h4 :style="getAuthorNameStyles()">客户 {{ i }}</h4>
                            <p :style="getAuthorTitleStyles()">VIP客户</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 邮件订阅 -->
                  <div v-else-if="component.type === 'newsletter'" class="newsletter-section">
                    <div class="newsletter-content" :style="getNewsletterStyles()">
                      <h2 :style="getNewsletterTitleStyles()">订阅我们的邮件</h2>
                      <p :style="getNewsletterTextStyles()">获取最新优惠和产品信息</p>
                      <div class="newsletter-form">
                        <el-input placeholder="输入您的邮箱" :style="getNewsletterInputStyles()" />
                        <el-button :style="getButtonStyles()">订阅</el-button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 图片画廊 -->
                  <div v-else-if="component.type === 'gallery'" class="gallery-section">
                    <h2 :style="getHeadingStyles()">产品画廊</h2>
                    <div class="gallery-grid">
                      <div class="gallery-item" v-for="i in 6" :key="i" :style="getGalleryItemStyles()">
                        <div class="gallery-image" :style="getGalleryImageStyles()">
                          <span>图片 {{ i }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 联系表单 -->
                  <div v-else-if="component.type === 'contact'" class="contact-section">
                    <h2 :style="getHeadingStyles()">联系我们</h2>
                    <div class="contact-form" :style="getContactFormStyles()">
                      <el-input placeholder="姓名" :style="getFormInputStyles()" />
                      <el-input placeholder="邮箱" :style="getFormInputStyles()" />
                      <el-input placeholder="电话" :style="getFormInputStyles()" />
                      <el-input type="textarea" placeholder="留言" :style="getFormTextareaStyles()" />
                      <el-button :style="getButtonStyles()">发送消息</el-button>
                    </div>
                  </div>
                  
                  <!-- 常见问题 -->
                  <div v-else-if="component.type === 'faq'" class="faq-section">
                    <h2 :style="getHeadingStyles()">常见问题</h2>
                    <div class="faq-list">
                      <div class="faq-item" v-for="i in 3" :key="i" :style="getFaqItemStyles()">
                        <div class="faq-question" :style="getFaqQuestionStyles()">
                          <h3>问题 {{ i }}：这是常见问题？</h3>
                          <el-icon><ArrowDown /></el-icon>
                        </div>
                        <div class="faq-answer" :style="getFaqAnswerStyles()">
                          <p :style="getTextStyles()">这是问题的详细答案，解释了相关的解决方案。</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 倒计时 -->
                  <div v-else-if="component.type === 'countdown'" class="countdown-section">
                    <div class="countdown-content" :style="getCountdownStyles()">
                      <h2 :style="getCountdownTitleStyles()">限时抢购</h2>
                      <p :style="getCountdownTextStyles()">距离活动结束还有</p>
                      <div class="countdown-timer">
                        <div class="timer-item">
                          <span class="timer-number">23</span>
                          <span class="timer-label">时</span>
                        </div>
                        <div class="timer-item">
                          <span class="timer-number">59</span>
                          <span class="timer-label">分</span>
                        </div>
                        <div class="timer-item">
                          <span class="timer-number">59</span>
                          <span class="timer-label">秒</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 社交媒体 -->
                  <div v-else-if="component.type === 'social'" class="social-section">
                    <h2 :style="getHeadingStyles()">关注我们</h2>
                    <div class="social-links">
                      <div class="social-item" v-for="platform in ['微信', '微博', '抖音', '小红书']" :key="platform" :style="getSocialItemStyles()">
                        <div class="social-icon">📱</div>
                        <span :style="getSocialTextStyles()">{{ platform }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 拖拽指示器 -->
                  <div class="drag-handle" v-if="!component.dragging">
                    <el-icon><Rank /></el-icon>
                  </div>
                  
                  <!-- 组件操作按钮 -->
                  <div class="component-actions" v-if="selectedComponent?.id === component.id">
                    <el-button size="small" @click="duplicateComponent(component)">复制</el-button>
                    <el-button size="small" type="danger" @click="removeComponent(component)">删除</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 滚动到顶部按钮 -->
        <div 
          v-if="showScrollToTop" 
          class="scroll-to-top"
          @click="scrollToTop"
        >
          <el-icon><Top /></el-icon>
        </div>
      </div>
      
      <!-- 右侧属性面板 -->
      <div class="editor-properties">
        <div class="properties-header">
          <h3>主题信息</h3>
        </div>
        
        <div class="properties-content">
          <div class="property-group">
            <h4>主题设置</h4>
            <el-form label-width="80px" size="small">
              <el-form-item label="主题名称">
                <el-input v-model="themeName" placeholder="输入主题名称" />
              </el-form-item>
              <el-form-item label="主题描述">
                <el-input
                  v-model="themeDescription"
                  type="textarea"
                  :rows="3"
                  placeholder="输入主题描述"
                />
              </el-form-item>
              <el-form-item label="标签">
                <el-input
                  v-model="themeTags"
                  placeholder="输入标签，用逗号分隔"
                />
              </el-form-item>
            </el-form>
          </div>
          
          <div class="property-group">
            <h4>当前配置</h4>
            <div class="config-summary">
              <p><strong>布局:</strong> {{ themeConfig.layout.type }}</p>
              <p><strong>主色:</strong> {{ themeConfig.colors.primary }}</p>
              <p><strong>字体:</strong> {{ themeConfig.typography.fontFamily }}</p>
              <p><strong>字体大小:</strong> {{ themeConfig.typography.baseFontSize }}px</p>
              <p><strong>按钮圆角:</strong> {{ themeConfig.components.button.borderRadius }}px</p>
              <p><strong>卡片圆角:</strong> {{ themeConfig.components.card.borderRadius }}px</p>
              <p><strong>动画:</strong> {{ themeConfig.animations.pageTransition ? '开启' : '关闭' }}</p>
          </div>
          </div>
          
          <div class="property-group">
            <h4>操作</h4>
            <div class="action-buttons">
              <el-button size="small" @click="resetTheme">
                重置主题
              </el-button>
              <el-button size="small" @click="duplicateTheme">
                复制主题
              </el-button>
            </div>
          </div>
          
          <!-- 组件属性编辑 -->
          <div v-if="selectedComponent" class="property-group">
            <h4>组件属性</h4>
            <div class="component-properties">
              <el-form label-width="80px" size="small">
                <el-form-item label="组件类型">
                  <el-tag>{{ getComponentTypeName(selectedComponent.type) }}</el-tag>
                </el-form-item>
                
                <!-- 通用属性 -->
                <el-form-item label="内边距">
                  <el-slider
                    v-model="selectedComponent.padding"
                    :min="0"
                    :max="50"
                    @change="updateComponent"
                  />
                </el-form-item>
                
                <el-form-item label="外边距">
                  <el-slider
                    v-model="selectedComponent.margin"
                    :min="0"
                    :max="50"
                    @change="updateComponent"
                  />
                </el-form-item>
                
                <el-form-item label="背景色">
                  <el-color-picker
                    v-model="selectedComponent.backgroundColor"
                    @change="updateComponent"
                  />
                </el-form-item>
                
                <!-- 特定组件属性 -->
                <template v-if="selectedComponent.type === 'hero'">
                  <el-form-item label="标题">
                    <el-input v-model="selectedComponent.title" @change="updateComponent" />
                  </el-form-item>
                  <el-form-item label="副标题">
                    <el-input v-model="selectedComponent.subtitle" @change="updateComponent" />
                  </el-form-item>
                  <el-form-item label="按钮文字">
                    <el-input v-model="selectedComponent.buttonText" @change="updateComponent" />
                  </el-form-item>
                </template>
                
                <template v-if="selectedComponent.type === 'products'">
                  <el-form-item label="商品数量">
                    <el-slider
                      v-model="selectedComponent.productCount"
                      :min="1"
                      :max="12"
                      @change="updateComponent"
                    />
                  </el-form-item>
                  <el-form-item label="列数">
                    <el-select v-model="selectedComponent.columns" @change="updateComponent">
                      <el-option label="2列" value="2" />
                      <el-option label="3列" value="3" />
                      <el-option label="4列" value="4" />
                    </el-select>
                  </el-form-item>
                </template>
                
                <template v-if="selectedComponent.type === 'banner'">
                  <el-form-item label="横幅文字">
                    <el-input v-model="selectedComponent.bannerText" @change="updateComponent" />
                  </el-form-item>
                  <el-form-item label="按钮文字">
                    <el-input v-model="selectedComponent.buttonText" @change="updateComponent" />
                  </el-form-item>
                  <el-form-item label="背景图片">
                    <el-input v-model="selectedComponent.backgroundImage" @change="updateComponent" />
                  </el-form-item>
                </template>
                
                <template v-if="selectedComponent.type === 'countdown'">
                  <el-form-item label="结束时间">
                    <el-date-picker
                      v-model="selectedComponent.endTime"
                      type="datetime"
                      @change="updateComponent"
                    />
                  </el-form-item>
                  <el-form-item label="标题">
                    <el-input v-model="selectedComponent.title" @change="updateComponent" />
                  </el-form-item>
                </template>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  View, Check, Monitor, Iphone, Star, Document, Grid, 
  Picture, ShoppingCart, Trophy, ChatDotRound, Rank, ArrowDown, Plus, Top
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const activeTab = ref('layout')
const previewDevice = ref('desktop')
const previewUrl = ref('/dashboard/theme-preview')
const themeName = ref('我的自定义主题')
const themeDescription = ref('基于现代简约主题的自定义版本')
const themeTags = ref('自定义,现代,简约')
const selectedComponent = ref<any>(null)
const isDragOver = ref(false)
const draggedComponent = ref(null)
const selectedComponentCategory = ref('')
const filteredComponents = ref<any[]>([])
const draggedComponentIndex = ref(-1)
const dragOverIndex = ref(-1)
const showScrollToTop = ref(false)
const previewContainerRef = ref(null)

// 设备配置
const devices = [
  { name: 'desktop', label: '桌面', icon: 'Monitor' },
  { name: 'tablet', label: '平板', icon: 'Monitor' },
  { name: 'mobile', label: '手机', icon: 'Iphone' }
]

// 可用组件
const availableComponents = [
  {
    type: 'hero',
    name: '英雄区域',
    description: '大标题和介绍文字',
    icon: 'Star',
    category: 'layout'
  },
  {
    type: 'products',
    name: '商品网格',
    description: '商品展示网格',
    icon: 'Grid',
    category: 'content'
  },
  {
    type: 'features',
    name: '特色展示',
    description: '特色功能展示',
    icon: 'Trophy',
    category: 'content'
  },
  {
    type: 'text',
    name: '文本区域',
    description: '纯文本内容',
    icon: 'Document',
    category: 'content'
  },
  {
    type: 'banner',
    name: '横幅广告',
    description: '促销横幅和广告',
    icon: 'Picture',
    category: 'marketing'
  },
  {
    type: 'testimonials',
    name: '客户评价',
    description: '客户评价和推荐',
    icon: 'ChatDotRound',
    category: 'social'
  },
  {
    type: 'newsletter',
    name: '邮件订阅',
    description: '邮件订阅表单',
    icon: 'Message',
    category: 'marketing'
  },
  {
    type: 'gallery',
    name: '图片画廊',
    description: '图片展示画廊',
    icon: 'Picture',
    category: 'media'
  },
  {
    type: 'contact',
    name: '联系表单',
    description: '联系信息表单',
    icon: 'Phone',
    category: 'forms'
  },
  {
    type: 'faq',
    name: '常见问题',
    description: 'FAQ问答区域',
    icon: 'QuestionFilled',
    category: 'content'
  },
  {
    type: 'countdown',
    name: '倒计时',
    description: '活动倒计时器',
    icon: 'Timer',
    category: 'marketing'
  },
  {
    type: 'social',
    name: '社交媒体',
    description: '社交媒体链接',
    icon: 'Share',
    category: 'social'
  }
]

// 预览组件
const previewComponents = ref([
  {
    id: 'hero-1',
    type: 'hero',
    position: { x: 0, y: 0 },
    size: { width: '100%', height: 'auto' },
    dragging: false,
    dragOver: false,
    padding: 20,
    margin: 0,
    backgroundColor: '',
    title: '欢迎来到我们的商店',
    subtitle: '这是一个主题预览',
    buttonText: '立即购买'
  },
  {
    id: 'products-1',
    type: 'products',
    position: { x: 0, y: 1 },
    size: { width: '100%', height: 'auto' },
    dragging: false,
    dragOver: false,
    padding: 20,
    margin: 0,
    backgroundColor: '',
    productCount: 6,
    columns: '3'
  },
  {
    id: 'features-1',
    type: 'features',
    position: { x: 0, y: 2 },
    size: { width: '100%', height: 'auto' },
    dragging: false,
    dragOver: false,
    padding: 20,
    margin: 0,
    backgroundColor: ''
  }
])

// 主题配置
const themeConfig = reactive({
  layout: {
    type: 'full-width'
  },
  header: {
    height: 80,
    showSearch: true,
    showCart: true
  },
  colors: {
    primary: '#409EFF',
    secondary: '#67C23A',
    background: '#FFFFFF',
    cardBackground: '#FFFFFF',
    textPrimary: '#303133',
    textSecondary: '#606266',
    textTertiary: '#909399',
    border: '#DCDFE6',
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C',
    info: '#909399'
  },
  typography: {
    fontFamily: 'system',
    headingFont: 'inherit',
    baseFontSize: 14,
    headingFontSize: 24,
    fontWeight: '400',
    lineHeight: 1.5
  },
  components: {
    button: {
      borderRadius: 4,
      padding: 12
    },
    card: {
      borderRadius: 8,
      shadow: 'light'
    },
    form: {
      inputBorderRadius: 4,
      inputBorder: 'thin'
    }
  },
  animations: {
    pageTransition: true,
    hoverEffects: true,
    loadingAnimations: true,
    duration: 0.3,
    easing: 'ease-in-out'
  }
})

// 方法
const updateTheme = () => {
  console.log('更新主题配置:', themeConfig)
  ElMessage.success('主题配置已更新')
}

const previewTheme = () => {
  // 生成预览数据
  const previewData = {
    theme: themeConfig,
    components: previewComponents.value,
    name: themeName.value,
    description: themeDescription.value
  }
  
  // 将预览数据存储到localStorage
  localStorage.setItem('theme-preview-data', JSON.stringify(previewData))
  
  // 打开预览页面
  const previewWindow = window.open('/dashboard/theme-preview', '_blank', 'width=1200,height=800')
  
  if (previewWindow) {
    ElMessage.success('预览窗口已打开')
  } else {
    ElMessage.error('无法打开预览窗口，请检查浏览器弹窗设置')
  }
}

const saveTheme = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要保存当前主题吗？',
      '保存主题',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    const themeData = {
      name: themeName.value,
      description: themeDescription.value,
      tags: themeTags.value.split(',').map(tag => tag.trim()),
      config: themeConfig,
      components: previewComponents.value,
      createdAt: new Date().toISOString()
    }

    console.log('保存主题:', themeData)
    ElMessage.success('主题保存成功')
    
    router.push('/dashboard/themes')
  } catch (error) {
    // 用户取消
  }
}

const openPreview = () => {
  previewTheme()
}

// 重置主题
const resetTheme = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置主题到默认设置吗？这将丢失所有自定义配置。',
      '重置主题',
      {
        confirmButtonText: '确定重置',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 重置到默认配置
    Object.assign(themeConfig, {
      layout: { type: 'full-width' },
      header: { height: 80, showSearch: true, showCart: true },
      colors: {
        primary: '#409EFF',
        secondary: '#67C23A',
        background: '#FFFFFF',
        cardBackground: '#FFFFFF',
        textPrimary: '#303133',
        textSecondary: '#606266',
        textTertiary: '#909399',
        border: '#DCDFE6',
        success: '#67C23A',
        warning: '#E6A23C',
        danger: '#F56C6C',
        info: '#909399'
      },
      typography: {
        fontFamily: 'system',
        headingFont: 'inherit',
        baseFontSize: 14,
        headingFontSize: 24,
        fontWeight: '400',
        lineHeight: 1.5
      },
      components: {
        button: { borderRadius: 4, padding: 12 },
        card: { borderRadius: 8, shadow: 'light' },
        form: { inputBorderRadius: 4, inputBorder: 'thin' }
      },
      animations: {
        pageTransition: true,
        hoverEffects: true,
        loadingAnimations: true,
        duration: 0.3,
        easing: 'ease-in-out'
      }
    })
    
    ElMessage.success('主题已重置')
  } catch {
    // 用户取消
  }
}

// 复制主题
const duplicateTheme = () => {
  themeName.value = `${themeName.value} - 副本`
  themeDescription.value = `${themeDescription.value} (复制版本)`
  ElMessage.success('主题已复制，请修改名称后保存')
}

// 样式计算方法
const getPreviewStyles = () => {
  return {
    fontFamily: themeConfig.typography.fontFamily === 'system' ? 'inherit' : themeConfig.typography.fontFamily,
    fontSize: `${themeConfig.typography.baseFontSize}px`,
    lineHeight: themeConfig.typography.lineHeight,
    color: themeConfig.colors.textPrimary,
    backgroundColor: themeConfig.colors.background,
    transition: themeConfig.animations.pageTransition ? `all ${themeConfig.animations.duration}s ${themeConfig.animations.easing}` : 'none'
  }
}

const getHeaderStyles = () => {
  return {
    height: `${themeConfig.header.height}px`,
    backgroundColor: themeConfig.colors.cardBackground,
    borderBottom: `1px solid ${themeConfig.colors.border}`
  }
}

const getLogoStyles = () => {
  return {
    color: themeConfig.colors.primary,
    fontWeight: themeConfig.typography.fontWeight,
    fontSize: `${themeConfig.typography.headingFontSize}px`
  }
}

const getNavStyles = () => {
  return {
    color: themeConfig.colors.textSecondary,
    fontSize: `${themeConfig.typography.baseFontSize}px`
  }
}

const getSearchStyles = () => {
  return {
    backgroundColor: themeConfig.colors.background,
    border: `1px solid ${themeConfig.colors.border}`,
    borderRadius: `${themeConfig.components.form.inputBorderRadius}px`,
    color: themeConfig.colors.textSecondary
  }
}

const getCartStyles = () => {
  return {
    backgroundColor: themeConfig.colors.primary,
    color: 'white',
    borderRadius: `${themeConfig.components.button.borderRadius}px`,
    padding: `${themeConfig.components.button.padding}px`
  }
}

const getBodyStyles = () => {
  return {
    backgroundColor: themeConfig.colors.background,
    padding: '24px'
  }
}

const getComponentStyles = (component: any) => {
  let borderColor = 'transparent'
  let borderStyle = '2px solid'
  
  if (component.dragOver) {
    borderColor = themeConfig.colors.primary
    borderStyle = '2px dashed'
  } else if (selectedComponent?.id === component.id) {
    borderColor = themeConfig.colors.primary
  }
  
  return {
    position: 'relative',
    marginBottom: '24px',
    border: `${borderStyle} ${borderColor}`,
    borderRadius: `${themeConfig.components.card.borderRadius}px`,
    boxShadow: component.dragOver ? '0 0 0 4px rgba(64, 158, 255, 0.2)' :
                themeConfig.components.card.shadow === 'none' ? 'none' : 
                themeConfig.components.card.shadow === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' :
                themeConfig.components.card.shadow === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
                '0 8px 16px rgba(0,0,0,0.2)',
    transition: themeConfig.animations.hoverEffects ? `all ${themeConfig.animations.duration}s ${themeConfig.animations.easing}` : 'none',
    cursor: component.dragging ? 'grabbing' : 'grab',
    transform: component.dragging ? 'rotate(2deg)' : 'none',
    zIndex: component.dragging ? 1000 : 'auto'
  }
}

const getHeadingStyles = () => {
  return {
    fontFamily: themeConfig.typography.headingFont === 'inherit' ? 'inherit' : themeConfig.typography.headingFont,
    fontSize: `${themeConfig.typography.headingFontSize}px`,
    fontWeight: themeConfig.typography.fontWeight,
    color: themeConfig.colors.textPrimary,
    margin: '0 0 16px 0'
  }
}

const getTextStyles = () => {
  return {
    fontSize: `${themeConfig.typography.baseFontSize}px`,
    color: themeConfig.colors.textSecondary,
    lineHeight: themeConfig.typography.lineHeight,
    margin: '0 0 16px 0'
  }
}

const getButtonStyles = () => {
  return {
    backgroundColor: themeConfig.colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: `${themeConfig.components.button.borderRadius}px`,
    padding: `${themeConfig.components.button.padding}px 24px`,
    fontSize: `${themeConfig.typography.baseFontSize}px`,
    fontWeight: themeConfig.typography.fontWeight,
    cursor: 'pointer',
    transition: themeConfig.animations.hoverEffects ? `all ${themeConfig.animations.duration}s ${themeConfig.animations.easing}` : 'none'
  }
}

const getProductCardStyles = () => {
  return {
    backgroundColor: themeConfig.colors.cardBackground,
    border: `1px solid ${themeConfig.colors.border}`,
    borderRadius: `${themeConfig.components.card.borderRadius}px`,
    overflow: 'hidden',
    transition: themeConfig.animations.hoverEffects ? `all ${themeConfig.animations.duration}s ${themeConfig.animations.easing}` : 'none'
  }
}

const getProductImageStyles = () => {
  return {
    backgroundColor: themeConfig.colors.background,
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: themeConfig.colors.textTertiary,
    fontSize: '12px'
  }
}

const getProductTitleStyles = () => {
  return {
    fontSize: `${themeConfig.typography.baseFontSize}px`,
    fontWeight: themeConfig.typography.fontWeight,
    color: themeConfig.colors.textPrimary,
    margin: '0 0 8px 0'
  }
}

const getPriceStyles = () => {
  return {
    fontSize: `${themeConfig.typography.headingFontSize * 0.7}px`,
    fontWeight: '600',
    color: themeConfig.colors.primary,
    margin: '0'
  }
}

const getFeatureItemStyles = () => {
  return {
    backgroundColor: themeConfig.colors.cardBackground,
    border: `1px solid ${themeConfig.colors.border}`,
    borderRadius: `${themeConfig.components.card.borderRadius}px`,
    padding: '20px',
    textAlign: 'center',
    transition: themeConfig.animations.hoverEffects ? `all ${themeConfig.animations.duration}s ${themeConfig.animations.easing}` : 'none'
  }
}

const getFeatureTitleStyles = () => {
  return {
    fontSize: `${themeConfig.typography.baseFontSize + 2}px`,
    fontWeight: themeConfig.typography.fontWeight,
    color: themeConfig.colors.textPrimary,
    margin: '12px 0 8px 0'
  }
}

// 拖拽功能
const onDragStart = (event, component) => {
  draggedComponent.value = component
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('text/plain', JSON.stringify(component))
}

const onDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
}

const onDragEnter = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const onDragLeave = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isDragOver.value = false
  }
}

const onDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  try {
    const componentData = JSON.parse(event.dataTransfer.getData('text/plain'))
    addComponent(componentData)
  } catch (error) {
    console.error('拖拽数据解析失败:', error)
  }
}

const addComponent = (componentData: any) => {
  const newComponent = {
    id: `${componentData.type}-${Date.now()}`,
    type: componentData.type,
    position: { x: 0, y: previewComponents.value.length },
    size: { width: '100%', height: 'auto' },
    dragging: false,
    dragOver: false,
    padding: 20,
    margin: 0,
    backgroundColor: '',
    ...getDefaultComponentProps(componentData.type)
  }
  
  previewComponents.value.push(newComponent)
  ElMessage.success(`已添加${componentData.name}组件`)
  
  // 自动滚动到新添加的组件
  setTimeout(() => {
    scrollToNewComponent(newComponent.id)
  }, 100)
}

// 获取组件默认属性
const getDefaultComponentProps = (type: string) => {
  const defaults = {
    hero: {
      title: '欢迎来到我们的商店',
      subtitle: '这是一个主题预览',
      buttonText: '立即购买'
    },
    products: {
      productCount: 6,
      columns: '3'
    },
    banner: {
      bannerText: '限时优惠',
      buttonText: '立即购买',
      backgroundImage: ''
    },
    countdown: {
      title: '限时抢购',
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    newsletter: {
      title: '订阅我们的邮件',
      subtitle: '获取最新优惠和产品信息'
    },
    contact: {
      title: '联系我们'
    },
    faq: {
      title: '常见问题'
    },
    social: {
      title: '关注我们'
    },
    testimonials: {
      title: '客户评价'
    },
    gallery: {
      title: '产品画廊'
    },
    features: {
      title: '我们的特色'
    },
    text: {
      title: '关于我们',
      content: '这里是一段关于我们商店的介绍文字，展示了主题的文本样式效果。'
    }
  }
  
  return (defaults as any)[type] || {}
}

const selectComponent = (component: any) => {
  selectedComponent.value = component
}

const duplicateComponent = (component: any) => {
  const newComponent = {
    id: `${component.type}-${Date.now()}`,
    type: component.type,
    position: { x: 0, y: previewComponents.value.length },
    size: { width: '100%', height: 'auto' },
    dragging: false,
    dragOver: false,
    padding: component.padding || 20,
    margin: component.margin || 0,
    backgroundColor: component.backgroundColor || '',
    ...component
  }
  
  previewComponents.value.push(newComponent)
  ElMessage.success('组件已复制')
}

const removeComponent = (component: any) => {
  const index = previewComponents.value.findIndex(c => c.id === component.id)
  if (index > -1) {
    previewComponents.value.splice(index, 1)
    if (selectedComponent.value?.id === component.id) {
      selectedComponent.value = null
    }
    ElMessage.success('组件已删除')
  }
}

// 组件拖拽排序功能
const onComponentDragStart = (event: any, component: any, index: number) => {
  component.dragging = true
  draggedComponentIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'component', index }))
  
  // 设置拖拽时的样式
  event.target.style.opacity = '0.5'
}

const onComponentDragEnd = (event: any, component: any) => {
  component.dragging = false
  draggedComponentIndex.value = -1
  dragOverIndex.value = -1
  
  // 清除所有拖拽状态
  previewComponents.value.forEach(comp => {
    comp.dragOver = false
  })
  
  // 恢复样式
  event.target.style.opacity = '1'
}

const onComponentDragOver = (event: any, component: any, index: number) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  
  if (draggedComponentIndex.value !== index) {
    dragOverIndex.value = index
  }
}

const onComponentDragEnter = (event: any, component: any) => {
  event.preventDefault()
  if (draggedComponentIndex.value !== previewComponents.value.indexOf(component)) {
    component.dragOver = true
  }
}

const onComponentDragLeave = (event: any, component: any) => {
  // 只有当鼠标真正离开组件时才清除状态
  if (!event.currentTarget.contains(event.relatedTarget)) {
    component.dragOver = false
  }
}

const onComponentDrop = (event: any, component: any, index: number) => {
  event.preventDefault()
  
  try {
    const data = JSON.parse(event.dataTransfer.getData('text/plain'))
    
    if (data.type === 'component') {
      // 组件排序
      const fromIndex = data.index
      const toIndex = index
      
      if (fromIndex !== toIndex) {
        moveComponent(fromIndex, toIndex)
      }
    } else {
      // 从组件库拖拽新组件
      addComponent(data)
    }
  } catch (error) {
    console.error('拖拽数据解析失败:', error)
  }
  
  // 清除所有拖拽状态
  previewComponents.value.forEach(comp => {
    comp.dragOver = false
    comp.dragging = false
  })
  
  draggedComponentIndex.value = -1
  dragOverIndex.value = -1
}

// 移动组件位置
const moveComponent = (fromIndex: number, toIndex: number) => {
  const components = [...previewComponents.value]
  const [movedComponent] = components.splice(fromIndex, 1)
  components.splice(toIndex, 0, movedComponent)
  
  // 更新位置信息
  components.forEach((comp, index) => {
    comp.position = { x: 0, y: index }
  })
  
  previewComponents.value = components
  ElMessage.success('组件位置已调整')
}

// 组件筛选
const filterComponents = () => {
  if (selectedComponentCategory.value) {
    filteredComponents.value = availableComponents.filter(component => 
      component.category === selectedComponentCategory.value
    )
  } else {
    filteredComponents.value = availableComponents
  }
}

// 获取分类名称
const getCategoryName = (category: string) => {
  const names = {
    layout: '布局',
    content: '内容',
    marketing: '营销',
    social: '社交',
    media: '媒体',
    forms: '表单'
  }
  return (names as any)[category] || category
}

// 获取分类类型
const getCategoryType = (category: string) => {
  const types = {
    layout: 'primary',
    content: 'success',
    marketing: 'warning',
    social: 'info',
    media: 'danger',
    forms: ''
  }
  return (types as any)[category] || ''
}

// 获取组件类型名称
const getComponentTypeName = (type: string) => {
  const component = availableComponents.find(c => c.type === type)
  return component ? component.name : type
}

// 更新组件
const updateComponent = () => {
  ElMessage.success('组件属性已更新')
}

// 新增样式计算方法
const getBannerStyles = () => {
  return {
    backgroundColor: themeConfig.colors.primary,
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center',
    borderRadius: `${themeConfig.components.card.borderRadius}px`
  }
}

const getBannerTitleStyles = () => {
  return {
    fontSize: `${themeConfig.typography.headingFontSize * 1.2}px`,
    fontWeight: themeConfig.typography.fontWeight,
    color: 'white',
    margin: '0 0 16px 0'
  }
}

const getBannerTextStyles = () => {
  return {
    fontSize: `${themeConfig.typography.baseFontSize}px`,
    color: 'rgba(255,255,255,0.9)',
    margin: '0 0 24px 0'
  }
}

const getTestimonialItemStyles = () => {
  return {
    backgroundColor: themeConfig.colors.cardBackground,
    border: `1px solid ${themeConfig.colors.border}`,
    borderRadius: `${themeConfig.components.card.borderRadius}px`,
    padding: '20px',
    transition: themeConfig.animations.hoverEffects ? `all ${themeConfig.animations.duration}s ${themeConfig.animations.easing}` : 'none'
  }
}

const getAuthorNameStyles = () => {
  return {
    fontSize: `${themeConfig.typography.baseFontSize}px`,
    fontWeight: themeConfig.typography.fontWeight,
    color: themeConfig.colors.textPrimary,
    margin: '0 0 4px 0'
  }
}

const getAuthorTitleStyles = () => {
  return {
    fontSize: `${themeConfig.typography.baseFontSize - 2}px`,
    color: themeConfig.colors.textSecondary,
    margin: '0'
  }
}

const getNewsletterStyles = () => {
  return {
    backgroundColor: themeConfig.colors.cardBackground,
    border: `1px solid ${themeConfig.colors.border}`,
    borderRadius: `${themeConfig.components.card.borderRadius}px`,
    padding: '40px 20px',
    textAlign: 'center'
  }
}

const getNewsletterTitleStyles = () => {
  return {
    fontSize: `${themeConfig.typography.headingFontSize}px`,
    fontWeight: themeConfig.typography.fontWeight,
    color: themeConfig.colors.textPrimary,
    margin: '0 0 16px 0'
  }
}

const getNewsletterTextStyles = () => {
  return {
    fontSize: `${themeConfig.typography.baseFontSize}px`,
    color: themeConfig.colors.textSecondary,
    margin: '0 0 24px 0'
  }
}

const getNewsletterInputStyles = () => {
  return {
    width: '300px',
    marginRight: '12px'
  }
}

const getGalleryItemStyles = () => {
  return {
    backgroundColor: themeConfig.colors.cardBackground,
    border: `1px solid ${themeConfig.colors.border}`,
    borderRadius: `${themeConfig.components.card.borderRadius}px`,
    overflow: 'hidden',
    transition: themeConfig.animations.hoverEffects ? `all ${themeConfig.animations.duration}s ${themeConfig.animations.easing}` : 'none'
  }
}

const getGalleryImageStyles = () => {
  return {
    height: '150px',
    backgroundColor: themeConfig.colors.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: themeConfig.colors.textTertiary,
    fontSize: '14px'
  }
}

const getContactFormStyles = () => {
  return {
    backgroundColor: themeConfig.colors.cardBackground,
    border: `1px solid ${themeConfig.colors.border}`,
    borderRadius: `${themeConfig.components.card.borderRadius}px`,
    padding: '30px'
  }
}

const getFormInputStyles = () => {
  return {
    marginBottom: '16px',
    width: '100%'
  }
}

const getFormTextareaStyles = () => {
  return {
    marginBottom: '20px',
    width: '100%'
  }
}

const getFaqItemStyles = () => {
  return {
    backgroundColor: themeConfig.colors.cardBackground,
    border: `1px solid ${themeConfig.colors.border}`,
    borderRadius: `${themeConfig.components.card.borderRadius}px`,
    marginBottom: '12px',
    overflow: 'hidden'
  }
}

const getFaqQuestionStyles = () => {
  return {
    padding: '20px',
    backgroundColor: themeConfig.colors.background,
    borderBottom: `1px solid ${themeConfig.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  }
}

const getFaqAnswerStyles = () => {
  return {
    padding: '20px',
    backgroundColor: themeConfig.colors.cardBackground
  }
}

const getCountdownStyles = () => {
  return {
    backgroundColor: themeConfig.colors.primary,
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center',
    borderRadius: `${themeConfig.components.card.borderRadius}px`
  }
}

const getCountdownTitleStyles = () => {
  return {
    fontSize: `${themeConfig.typography.headingFontSize}px`,
    fontWeight: themeConfig.typography.fontWeight,
    color: 'white',
    margin: '0 0 16px 0'
  }
}

const getCountdownTextStyles = () => {
  return {
    fontSize: `${themeConfig.typography.baseFontSize}px`,
    color: 'rgba(255,255,255,0.9)',
    margin: '0 0 24px 0'
  }
}

const getSocialItemStyles = () => {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: themeConfig.colors.cardBackground,
    border: `1px solid ${themeConfig.colors.border}`,
    borderRadius: `${themeConfig.components.card.borderRadius}px`,
    transition: themeConfig.animations.hoverEffects ? `all ${themeConfig.animations.duration}s ${themeConfig.animations.easing}` : 'none',
    cursor: 'pointer'
  }
}

const getSocialTextStyles = () => {
  return {
    fontSize: `${themeConfig.typography.baseFontSize}px`,
    color: themeConfig.colors.textPrimary
  }
}

const getProductsGridStyles = (component) => {
  const columns = component.columns || '3'
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '16px'
  }
}

// 滚动相关方法
const scrollToTop = () => {
  const container = document.querySelector('.preview-container')
  if (container) {
    container.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

const handleScroll = () => {
  const container = document.querySelector('.preview-container')
  if (container) {
    showScrollToTop.value = container.scrollTop > 200
  }
}

const scrollToNewComponent = (componentId: string) => {
  const componentElement = document.querySelector(`[data-component-id="${componentId}"]`)
  if (componentElement) {
    componentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }
}

onMounted(() => {
  console.log('主题编辑器已加载')
  filterComponents()
  
  // 添加滚动监听
  const container = document.querySelector('.preview-container')
  if (container) {
    container.addEventListener('scroll', handleScroll)
  }
})
</script>

<style lang="scss" scoped>
.theme-editor {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: var(--saas-bg-primary);
  border-bottom: 1px solid var(--saas-border-light);
  
  .header-left {
    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--saas-text-primary);
      margin: 0 0 8px 0;
    }
    
    .page-subtitle {
      font-size: 14px;
      color: var(--saas-text-secondary);
      margin: 0;
    }
  }
  
  .header-right {
    display: flex;
    gap: 12px;
  }
}

.editor-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  height: 100%;
}

.editor-sidebar {
  background: var(--saas-bg-primary);
  border-right: 1px solid var(--saas-border-light);
  overflow-y: auto;
  
  .editor-tabs {
    height: 100%;
    
    :deep(.el-tabs__content) {
      height: calc(100% - 40px);
      overflow-y: auto;
    }
  }
  
  .tab-content {
    padding: 16px;
    
    .section {
      margin-bottom: 24px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--saas-text-primary);
        margin: 0 0 16px 0;
      }
      
      .el-form-item {
    margin-bottom: 16px;
      }
    }
  }
}

.editor-preview {
  display: flex;
  flex-direction: column;
  background: var(--saas-bg-secondary);
  height: 100%;
  
  .preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
    padding: 16px 24px;
    background: var(--saas-bg-primary);
  border-bottom: 1px solid var(--saas-border-light);
    flex-shrink: 0;
  
    .preview-controls {
  display: flex;
  gap: 8px;
      align-items: center;
      
      .component-counter {
        margin-left: 12px;
      }
}

    .preview-url {
      width: 300px;
    }
  }
  
  .preview-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 24px;
    overflow-y: auto;
    min-height: 0;
    
    .preview-frame {
      width: 100%;
    max-width: 1200px;
      min-height: 600px;
      border: 1px solid var(--saas-border-light);
      border-radius: 8px;
      box-shadow: var(--saas-shadow);
      background: white;
      overflow: visible;
      
      .preview-content {
        min-height: 100%;
        
        .preview-header-demo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: var(--saas-bg-primary);
          border-bottom: 1px solid var(--saas-border-light);
          flex-shrink: 0;
          
          .logo {
            font-weight: 600;
            color: var(--saas-primary);
          }
          
          .nav {
            flex: 1;
            text-align: center;
            color: var(--saas-text-secondary);
          }
          
          .search, .cart {
            padding: 8px 16px;
            background: var(--saas-bg-secondary);
            border-radius: 4px;
            font-size: 12px;
            color: var(--saas-text-secondary);
          }
        }
        
        .preview-body {
          padding: 24px;
          min-height: 400px;
          
          .hero-section {
            text-align: center;
            margin-bottom: 32px;
            
            h1 {
              font-size: 32px;
              font-weight: 600;
              color: var(--saas-text-primary);
              margin: 0 0 16px 0;
  }
  
  p {
    font-size: 16px;
              color: var(--saas-text-secondary);
              margin: 0;
            }
          }
          
          .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            
            .product-card {
              border: 1px solid var(--saas-border-light);
              border-radius: 8px;
              overflow: hidden;
              
              .product-image {
                height: 120px;
                background: var(--saas-bg-secondary);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--saas-text-tertiary);
                font-size: 12px;
              }
              
              .product-info {
                padding: 12px;
                
                h3 {
                  font-size: 14px;
                  font-weight: 500;
                  color: var(--saas-text-primary);
                  margin: 0 0 8px 0;
                }
                
                .price {
                  font-size: 16px;
                  font-weight: 600;
                  color: var(--saas-primary);
                  margin: 0;
                }
              }
            }
          }
        }
      }
    }
  }
}

.editor-properties {
  background: var(--saas-bg-primary);
  border-left: 1px solid var(--saas-border-light);
  overflow-y: auto;
  
  .properties-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--saas-border-light);
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--saas-text-primary);
      margin: 0;
  }
}

.properties-content {
    padding: 16px 20px;
    
    .property-group {
      margin-bottom: 24px;
      
      h4 {
      font-size: 14px;
        font-weight: 600;
      color: var(--saas-text-primary);
        margin: 0 0 12px 0;
      }
      
      .config-summary {
        font-size: 12px;
        color: var(--saas-text-secondary);
        
        p {
          margin: 0 0 8px 0;
        }
      }
      
      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    }
  }
}

// 组件库样式
.components-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h3 {
    margin: 0;
  }
}

.components-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.component-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--saas-border-light);
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--saas-primary);
    background: rgba(var(--saas-primary), 0.05);
  }
  
  &:active {
    cursor: grabbing;
  }
  
  .component-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--saas-bg-tertiary);
    border-radius: 6px;
    color: var(--saas-primary);
  }
  
  .component-info {
    flex: 1;
    
    h4 {
      font-size: 14px;
      font-weight: 500;
      color: var(--saas-text-primary);
      margin: 0 0 4px 0;
    }
    
    p {
      font-size: 12px;
      color: var(--saas-text-secondary);
      margin: 0;
    }
  }
}

// 预览区域样式增强
.preview-body {
  position: relative;
  min-height: 400px;
  padding-bottom: 50px; // 为底部组件留出空间
  
  &.drag-over {
    background: rgba(var(--saas-primary), 0.1);
    border: 2px dashed var(--saas-primary);
  }
}

// 预览容器滚动样式
.preview-container {
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--saas-bg-tertiary);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--saas-border);
    border-radius: 4px;
    
    &:hover {
      background: var(--saas-text-tertiary);
    }
  }
}

.empty-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  
  .empty-content {
    text-align: center;
    color: var(--saas-text-secondary);
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      color: var(--saas-text-tertiary);
    }
    
    h3 {
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 8px 0;
      color: var(--saas-text-primary);
    }
    
    p {
      font-size: 14px;
      margin: 0;
      color: var(--saas-text-secondary);
    }
  }
}

.preview-component {
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &.dragging {
    opacity: 0.5;
    transform: rotate(2deg) scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
  }
  
  &.drag-over {
    border: 2px dashed var(--saas-primary) !important;
    background: rgba(64, 158, 255, 0.05);
  }
  
  &.selected {
    border: 2px solid var(--saas-primary) !important;
  }
  
  .drag-handle {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 24px;
    height: 24px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 10;
    
    &:hover {
      background: rgba(0, 0, 0, 0.8);
    }
    
    &:active {
      cursor: grabbing;
    }
  }
  
  &:hover .drag-handle {
    opacity: 1;
  }
  
  .component-actions {
    position: absolute;
    top: -10px;
    right: -10px;
    display: flex;
    gap: 4px;
    background: var(--saas-bg-primary);
    border: 1px solid var(--saas-border-light);
    border-radius: 6px;
    padding: 4px;
    box-shadow: var(--saas-shadow);
    z-index: 10;
  }
}

// 特色区域样式
.features-section {
  text-align: center;
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 24px;
  }
  
  .feature-item {
    .feature-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }
  }
}

// 新组件样式
.banner-section {
  margin: 24px 0;
  
  .banner-content {
    position: relative;
    overflow: hidden;
  }
}

.testimonials-section {
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 24px;
  }
  
  .testimonial-item {
    .testimonial-content {
      margin-bottom: 16px;
    }
    
    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .author-avatar {
        width: 40px;
        height: 40px;
        background: var(--saas-bg-tertiary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }
    }
  }
}

.newsletter-section {
  margin: 24px 0;
  
  .newsletter-form {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
  }
}

.gallery-section {
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 24px;
  }
}

.contact-section {
  .contact-form {
    max-width: 500px;
    margin: 0 auto;
  }
}

.faq-section {
  .faq-list {
    margin-top: 24px;
  }
  
  .faq-item {
    .faq-question {
      h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
      }
    }
  }
}

.countdown-section {
  margin: 24px 0;
  
  .countdown-timer {
    display: flex;
    justify-content: center;
    gap: 20px;
    
    .timer-item {
      text-align: center;
      
      .timer-number {
        display: block;
        font-size: 32px;
        font-weight: 700;
        line-height: 1;
      }
      
      .timer-label {
        font-size: 14px;
        opacity: 0.8;
      }
    }
  }
}

.social-section {
  .social-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-top: 24px;
  }
  
  .social-item {
    .social-icon {
      font-size: 20px;
    }
  }
}

// 组件属性面板样式
.component-properties {
  .el-form-item {
    margin-bottom: 16px;
  }
}

// 滚动到顶部按钮
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: var(--saas-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--saas-shadow-lg);
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    background: var(--saas-primary-dark, #337ecc);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(64, 158, 255, 0.3);
  }
  
  .el-icon {
    font-size: 20px;
  }
}

// 响应式预览
.preview-container {
  &.device-mobile {
    .preview-frame {
      max-width: 375px;
    }
    
    .preview-content {
      font-size: 14px;
    }
    
    .hero-section h1 {
      font-size: 24px;
    }
    
    .products-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  &.device-tablet {
    .preview-frame {
      max-width: 768px;
    }
    
    .products-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  &.device-desktop {
    .preview-frame {
      max-width: 1200px;
    }
    
    .products-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .editor-layout {
    grid-template-columns: 250px 1fr 250px;
  }
}

@media (max-width: 768px) {
  .editor-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
  
  .editor-sidebar,
  .editor-properties {
    height: 200px;
  }
}
</style>