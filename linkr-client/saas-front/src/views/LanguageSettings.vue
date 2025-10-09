<template>
  <div class="language-settings-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">多语言设置</h1>
        <p class="page-subtitle">配置您的网站支持的语言和国际化设置</p>
      </div>
      <div class="header-right">
        <el-button type="primary" size="large" @click="saveLanguageSettings">
          <el-icon><Check /></el-icon>
          保存设置
        </el-button>
      </div>
    </div>
    
    <div class="content-grid">
      <!-- 语言配置 -->
      <div class="language-section">
        <div class="section-header">
          <h2>语言配置</h2>
          <el-tag type="info" size="small">支持17种语言</el-tag>
        </div>
        
        <el-form :model="languageSettings" label-width="120px">
          <el-form-item label="默认语言" required>
            <el-select v-model="languageSettings.defaultLanguage" placeholder="选择默认语言">
              <el-option 
                v-for="lang in availableLanguages" 
                :key="lang.code"
                :label="`${lang.name} (${lang.nativeName})`"
                :value="lang.code"
              >
                <div class="language-option">
                  <span class="flag">{{ lang.flag }}</span>
                  <span class="name">{{ lang.name }}</span>
                  <span class="native">{{ lang.nativeName }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="启用语言">
            <el-checkbox-group v-model="languageSettings.enabledLanguages">
              <div class="language-grid">
                <el-checkbox 
                  v-for="lang in availableLanguages" 
                  :key="lang.code"
                  :label="lang.code"
                  class="language-checkbox"
                >
                  <div class="checkbox-content">
                    <span class="flag">{{ lang.flag }}</span>
                    <span class="name">{{ lang.name }}</span>
                    <span class="native">{{ lang.nativeName }}</span>
                  </div>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>
          
          <el-form-item label="语言切换器">
            <el-switch v-model="languageSettings.showLanguageSwitcher" />
            <span class="form-tip">在网站顶部显示语言切换器</span>
          </el-form-item>
          
          <el-form-item label="自动检测语言">
            <el-switch v-model="languageSettings.autoDetect" />
            <span class="form-tip">根据访客浏览器语言自动切换</span>
          </el-form-item>
          
          <el-form-item label="语言URL格式">
            <el-radio-group v-model="languageSettings.urlFormat">
              <el-radio label="subdomain">子域名 (en.example.com)</el-radio>
              <el-radio label="path">路径 (/en/)</el-radio>
              <el-radio label="parameter">参数 (?lang=en)</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 翻译管理 -->
      <div class="translation-section">
        <div class="section-header">
          <h2>翻译管理</h2>
          <el-tag type="success" size="small">自动翻译</el-tag>
        </div>
        
        <el-form :model="translationSettings" label-width="120px">
          <el-form-item label="自动翻译">
            <el-switch v-model="translationSettings.autoTranslate" />
            <span class="form-tip">自动翻译未翻译的内容</span>
          </el-form-item>
          
          <el-form-item label="翻译服务">
            <el-select v-model="translationSettings.service" placeholder="选择翻译服务">
              <el-option label="Google Translate" value="google" />
              <el-option label="Microsoft Translator" value="microsoft" />
              <el-option label="百度翻译" value="baidu" />
              <el-option label="腾讯翻译" value="tencent" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="翻译质量">
            <el-radio-group v-model="translationSettings.quality">
              <el-radio label="auto">自动翻译</el-radio>
              <el-radio label="manual">人工审核</el-radio>
              <el-radio label="professional">专业翻译</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="翻译内容">
            <el-checkbox-group v-model="translationSettings.contentTypes">
              <el-checkbox label="products">产品信息</el-checkbox>
              <el-checkbox label="categories">分类信息</el-checkbox>
              <el-checkbox label="pages">页面内容</el-checkbox>
              <el-checkbox label="emails">邮件模板</el-checkbox>
              <el-checkbox label="notifications">通知消息</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 地区设置 -->
      <div class="region-section">
        <div class="section-header">
          <h2>地区设置</h2>
          <el-tag type="warning" size="small">本地化</el-tag>
        </div>
        
        <el-form :model="regionSettings" label-width="120px">
          <el-form-item label="默认地区">
            <el-select v-model="regionSettings.defaultRegion" placeholder="选择默认地区">
              <el-option label="中国大陆" value="CN" />
              <el-option label="香港" value="HK" />
              <el-option label="台湾" value="TW" />
              <el-option label="美国" value="US" />
              <el-option label="英国" value="GB" />
              <el-option label="德国" value="DE" />
              <el-option label="法国" value="FR" />
              <el-option label="日本" value="JP" />
              <el-option label="韩国" value="KR" />
              <el-option label="澳大利亚" value="AU" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="货币格式">
            <el-switch v-model="regionSettings.autoCurrency" />
            <span class="form-tip">根据地区自动设置货币格式</span>
          </el-form-item>
          
          <el-form-item label="日期格式">
            <el-select v-model="regionSettings.dateFormat" placeholder="选择日期格式">
              <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
              <el-option label="MM/DD/YYYY" value="MM/DD/YYYY" />
              <el-option label="DD/MM/YYYY" value="DD/MM/YYYY" />
              <el-option label="DD-MM-YYYY" value="DD-MM-YYYY" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="时间格式">
            <el-radio-group v-model="regionSettings.timeFormat">
              <el-radio label="12">12小时制</el-radio>
              <el-radio label="24">24小时制</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="数字格式">
            <el-select v-model="regionSettings.numberFormat" placeholder="选择数字格式">
              <el-option label="1,234.56" value="comma" />
              <el-option label="1.234,56" value="dot" />
              <el-option label="1 234,56" value="space" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- SEO设置 -->
      <div class="seo-section">
        <div class="section-header">
          <h2>SEO设置</h2>
          <el-tag type="primary" size="small">搜索引擎优化</el-tag>
        </div>
        
        <el-form :model="seoSettings" label-width="120px">
          <el-form-item label="多语言SEO">
            <el-switch v-model="seoSettings.multiLanguageSEO" />
            <span class="form-tip">为每种语言生成独立的SEO设置</span>
          </el-form-item>
          
          <el-form-item label="Hreflang标签">
            <el-switch v-model="seoSettings.hreflang" />
            <span class="form-tip">添加hreflang标签帮助搜索引擎理解语言版本</span>
          </el-form-item>
          
          <el-form-item label="语言特定URL">
            <el-switch v-model="seoSettings.languageSpecificUrls" />
            <span class="form-tip">为不同语言使用不同的URL结构</span>
          </el-form-item>
          
          <el-form-item label="自动生成Sitemap">
            <el-switch v-model="seoSettings.autoSitemap" />
            <span class="form-tip">自动为每种语言生成sitemap</span>
          </el-form-item>
          
          <el-form-item label="语言检测重定向">
            <el-switch v-model="seoSettings.languageRedirect" />
            <span class="form-tip">根据访客语言自动重定向到对应版本</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    
    <!-- 翻译进度 -->
    <div class="translation-progress-section">
      <div class="section-header">
        <h2>翻译进度</h2>
        <p>查看各语言的翻译完成情况</p>
      </div>
      
      <div class="progress-grid">
        <div 
          v-for="lang in enabledLanguages" 
          :key="lang.code"
          class="progress-card"
        >
          <div class="progress-header">
            <span class="flag">{{ lang.flag }}</span>
            <span class="name">{{ lang.name }}</span>
            <span class="percentage">{{ getTranslationProgress(lang.code) }}%</span>
          </div>
          <el-progress 
            :percentage="getTranslationProgress(lang.code)" 
            :color="getProgressColor(getTranslationProgress(lang.code))"
          />
          <div class="progress-details">
            <div class="detail-item">
              <span class="label">已翻译：</span>
              <span class="value">{{ getTranslatedCount(lang.code) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">待翻译：</span>
              <span class="value">{{ getPendingCount(lang.code) }}</span>
            </div>
          </div>
          <div class="progress-actions">
            <el-button size="small" @click="viewTranslations(lang.code)">查看详情</el-button>
            <el-button size="small" type="primary" @click="translateLanguage(lang.code)">开始翻译</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

// 可用语言列表
const availableLanguages = ref([
  { code: 'zh-CN', name: '简体中文', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁体中文', nativeName: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name: '英语', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日语', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '韩语', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'de', name: '德语', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: '法语', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: '西班牙语', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'it', name: '意大利语', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: '葡萄牙语', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: '俄语', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: '阿拉伯语', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: '印地语', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: '泰语', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: '越南语', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: '印尼语', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: '马来语', nativeName: 'Bahasa Melayu', flag: '🇲🇾' }
])

// 响应式数据
const languageSettings = reactive({
  defaultLanguage: 'zh-CN',
  enabledLanguages: ['zh-CN', 'en'],
  showLanguageSwitcher: true,
  autoDetect: true,
  urlFormat: 'subdomain'
})

const translationSettings = reactive({
  autoTranslate: true,
  service: 'google',
  quality: 'auto',
  contentTypes: ['products', 'categories', 'pages']
})

const regionSettings = reactive({
  defaultRegion: 'CN',
  autoCurrency: true,
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24',
  numberFormat: 'comma'
})

const seoSettings = reactive({
  multiLanguageSEO: true,
  hreflang: true,
  languageSpecificUrls: true,
  autoSitemap: true,
  languageRedirect: true
})

// 模拟翻译进度数据
const translationProgress = ref({
  'zh-CN': { translated: 100, total: 100 },
  'en': { translated: 95, total: 100 },
  'ja': { translated: 80, total: 100 },
  'ko': { translated: 75, total: 100 },
  'de': { translated: 60, total: 100 },
  'fr': { translated: 55, total: 100 },
  'es': { translated: 50, total: 100 },
  'it': { translated: 45, total: 100 },
  'pt': { translated: 40, total: 100 },
  'ru': { translated: 35, total: 100 },
  'ar': { translated: 30, total: 100 },
  'hi': { translated: 25, total: 100 },
  'th': { translated: 20, total: 100 },
  'vi': { translated: 15, total: 100 },
  'id': { translated: 10, total: 100 },
  'ms': { translated: 5, total: 100 }
})

// 计算属性
const enabledLanguages = computed(() => {
  return availableLanguages.value.filter(lang => 
    languageSettings.enabledLanguages.includes(lang.code)
  )
})

// 方法
const saveLanguageSettings = async () => {
  try {
    // 验证必填字段
    if (!languageSettings.defaultLanguage) {
      ElMessage.error('请选择默认语言')
      return
    }
    if (languageSettings.enabledLanguages.length === 0) {
      ElMessage.error('请至少启用一种语言')
      return
    }
    
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('语言设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  }
}

const getTranslationProgress = (langCode: string) => {
  const progress = translationProgress.value[langCode as keyof typeof translationProgress.value]
  return progress ? Math.round((progress.translated / progress.total) * 100) : 0
}

const getTranslatedCount = (langCode: string) => {
  const progress = translationProgress.value[langCode as keyof typeof translationProgress.value]
  return progress ? progress.translated : 0
}

const getPendingCount = (langCode: string) => {
  const progress = translationProgress.value[langCode as keyof typeof translationProgress.value]
  return progress ? progress.total - progress.translated : 0
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return '#67C23A'
  if (percentage >= 60) return '#E6A23C'
  if (percentage >= 40) return '#F56C6C'
  return '#909399'
}

const viewTranslations = (langCode: string) => {
  ElMessage.info(`查看${langCode}语言翻译详情`)
}

const translateLanguage = (langCode: string) => {
  ElMessage.info(`开始翻译${langCode}语言`)
}

onMounted(() => {
  // 加载语言设置
  loadLanguageSettings()
})

const loadLanguageSettings = () => {
  // 模拟加载数据
  Object.assign(languageSettings, {
    defaultLanguage: 'zh-CN',
    enabledLanguages: ['zh-CN', 'en', 'ja', 'ko', 'de', 'fr'],
    showLanguageSwitcher: true,
    autoDetect: true,
    urlFormat: 'subdomain'
  })
  
  Object.assign(translationSettings, {
    autoTranslate: true,
    service: 'google',
    quality: 'auto',
    contentTypes: ['products', 'categories', 'pages', 'emails']
  })
  
  Object.assign(regionSettings, {
    defaultRegion: 'CN',
    autoCurrency: true,
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24',
    numberFormat: 'comma'
  })
  
  Object.assign(seoSettings, {
    multiLanguageSEO: true,
    hreflang: true,
    languageSpecificUrls: true,
    autoSitemap: true,
    languageRedirect: true
  })
}
</script>

<style lang="scss" scoped>
.language-settings-page {
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.language-section,
.translation-section,
.region-section,
.seo-section {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--saas-border-light);
    
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: var(--saas-text-primary);
    }
  }
}

.language-option {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .flag {
    font-size: 16px;
  }
  
  .name {
    font-weight: 500;
  }
  
  .native {
    color: var(--saas-text-tertiary);
    font-size: 12px;
  }
}

.language-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.language-checkbox {
  .checkbox-content {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .flag {
      font-size: 16px;
    }
    
    .name {
      font-weight: 500;
    }
    
    .native {
      color: var(--saas-text-tertiary);
      font-size: 12px;
    }
  }
}

.form-tip {
  font-size: 12px;
  color: var(--saas-text-tertiary);
  margin-left: 8px;
}

.translation-progress-section {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  
  .section-header {
    margin-bottom: 24px;
    
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: var(--saas-text-primary);
      margin-bottom: 8px;
    }
    
    p {
      font-size: 14px;
      color: var(--saas-text-secondary);
    }
  }
}

.progress-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.progress-card {
  background: var(--saas-bg-tertiary);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid var(--saas-border-light);
  
  .progress-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    .flag {
      font-size: 20px;
    }
    
    .name {
      font-weight: 500;
      color: var(--saas-text-primary);
      flex: 1;
    }
    
    .percentage {
      font-weight: 600;
      color: var(--saas-primary);
    }
  }
  
  .progress-details {
    display: flex;
    justify-content: space-between;
    margin: 12px 0;
    
    .detail-item {
      font-size: 12px;
      
      .label {
        color: var(--saas-text-secondary);
      }
      
      .value {
        color: var(--saas-text-primary);
        font-weight: 500;
      }
    }
  }
  
  .progress-actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    
    .el-button {
      flex: 1;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .language-settings-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .language-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-grid {
    grid-template-columns: 1fr;
  }
}
</style>
