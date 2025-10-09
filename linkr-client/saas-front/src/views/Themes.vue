<template>
  <div class="themes-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">主题设计</h1>
        <p class="page-subtitle">自定义您的商店外观</p>
      </div>
      <div class="header-right">
        <el-button type="primary" size="large" @click="$router.push('/dashboard/theme-editor')">
          <el-icon><Brush /></el-icon>
          自定义主题
        </el-button>
      </div>
    </div>
    
    <!-- 当前主题 -->
    <div class="current-theme">
      <h2>当前主题</h2>
      <div class="theme-card active">
        <div class="theme-preview">
          <img :src="currentTheme.preview" alt="主题预览" />
          <div class="theme-overlay">
            <el-button type="primary" @click="$router.push('/dashboard/theme-editor')">
              自定义
            </el-button>
            <el-button @click="previewTheme(currentTheme)">
              预览
            </el-button>
          </div>
        </div>
        <div class="theme-info">
          <h3>{{ currentTheme.name }}</h3>
          <p>{{ currentTheme.description }}</p>
          <div class="theme-tags">
            <el-tag v-for="tag in currentTheme.tags" :key="tag" size="small">
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主题库 -->
    <div class="themes-library">
      <div class="library-header">
        <h2>主题库</h2>
        <div class="library-controls">
          <el-input
            v-model="searchQuery"
            placeholder="搜索主题..."
            class="search-input"
            @input="filterThemes"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select
            v-model="selectedCategory"
            placeholder="选择分类"
            class="category-select"
            @change="filterThemes"
          >
            <el-option label="全部分类" value="" />
            <el-option label="商务专业" value="business" />
            <el-option label="时尚潮流" value="fashion" />
            <el-option label="温馨家居" value="home" />
            <el-option label="科技未来" value="tech" />
            <el-option label="简约清新" value="minimal" />
            <el-option label="复古怀旧" value="vintage" />
            <el-option label="活力运动" value="sports" />
            <el-option label="奢华高端" value="luxury" />
          </el-select>
          <el-select
            v-model="priceFilter"
            placeholder="价格筛选"
            class="price-select"
            @change="filterThemes"
          >
            <el-option label="全部价格" value="" />
            <el-option label="免费主题" value="free" />
            <el-option label="付费主题" value="paid" />
          </el-select>
        </div>
      </div>
      <div class="themes-grid">
        <div 
          v-for="theme in filteredThemes" 
          :key="theme.id"
          class="theme-card"
          :class="{ active: theme.id === currentTheme.id }"
        >
          <div class="theme-preview">
            <img :src="theme.preview" alt="主题预览" />
            <div class="theme-overlay">
              <el-button 
                v-if="theme.id !== currentTheme.id"
                type="primary" 
                @click="applyTheme(theme)"
              >
                应用
              </el-button>
              <el-button 
                v-if="theme.price > 0"
                type="warning" 
                @click="purchaseTheme(theme)"
              >
                购买
              </el-button>
              <el-button @click="previewTheme(theme)">
                预览
              </el-button>
            </div>
          </div>
          <div class="theme-info">
            <h3>{{ theme.name }}</h3>
            <p>{{ theme.description }}</p>
            <div class="theme-tags">
              <el-tag v-for="tag in theme.tags" :key="tag" size="small">
                {{ tag }}
              </el-tag>
            </div>
            <div class="theme-price">
              <span v-if="theme.price === 0" class="free">免费</span>
              <span v-else class="paid">¥{{ theme.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 自定义主题 -->
    <div class="custom-themes">
      <div class="custom-header">
        <h2>我的自定义主题</h2>
        <div class="custom-actions">
          <el-button @click="importTheme">
            <el-icon><Upload /></el-icon>
            导入主题
          </el-button>
        </div>
      </div>
      <div class="themes-grid">
        <div 
          v-for="theme in customThemes" 
          :key="theme.id"
          class="theme-card custom"
        >
          <div class="theme-preview">
            <img :src="theme.preview" alt="主题预览" />
            <div class="theme-overlay">
              <el-button type="primary" @click="editCustomTheme(theme)">
                编辑
              </el-button>
              <el-button @click="previewTheme(theme)">
                预览
              </el-button>
              <el-button @click="exportTheme(theme)">
                <el-icon><Download /></el-icon>
                导出
              </el-button>
              <el-button type="danger" @click="deleteCustomTheme(theme)">
                删除
              </el-button>
            </div>
          </div>
          <div class="theme-info">
            <h3>{{ theme.name }}</h3>
            <p>{{ theme.description }}</p>
            <div class="theme-meta">
              <span class="created-date">创建于 {{ theme.createdAt }}</span>
            </div>
          </div>
        </div>
        
        <!-- 创建新主题 -->
        <div class="theme-card create-new" @click="createNewTheme">
          <div class="create-preview">
            <el-icon class="create-icon"><Plus /></el-icon>
            <p>创建新主题</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Brush, Plus, Search, Download, Upload } from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('')
const priceFilter = ref('')
const filteredThemes = ref([])

const currentTheme = ref({
  id: 1,
  name: '现代简约',
  description: '简洁现代的设计风格，适合各种类型的商店',
  preview: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
  tags: ['现代', '简约', '响应式'],
  price: 0
})

const themes = ref([
  {
    id: 2,
    name: '商务专业',
    description: '专业的商务风格，适合B2B商店',
    preview: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop',
    tags: ['商务', '专业', '正式'],
    price: 0,
    category: 'business'
  },
  {
    id: 3,
    name: '时尚潮流',
    description: '时尚潮流的设计，适合服装配饰类商店',
    preview: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
    tags: ['时尚', '潮流', '年轻'],
    price: 99,
    category: 'fashion'
  },
  {
    id: 4,
    name: '温馨家居',
    description: '温馨的家居风格，适合家居用品商店',
    preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
    tags: ['温馨', '家居', '舒适'],
    price: 0,
    category: 'home'
  },
  {
    id: 5,
    name: '科技未来',
    description: '科技感十足的设计，适合电子产品商店',
    preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
    tags: ['科技', '未来', '创新'],
    price: 199,
    category: 'tech'
  },
  {
    id: 6,
    name: '简约清新',
    description: '简约清新的设计风格，适合生活用品商店',
    preview: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
    tags: ['简约', '清新', '自然'],
    price: 0,
    category: 'minimal'
  },
  {
    id: 7,
    name: '复古怀旧',
    description: '复古怀旧的风格，适合手工艺品商店',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    tags: ['复古', '怀旧', '文艺'],
    price: 149,
    category: 'vintage'
  },
  {
    id: 8,
    name: '活力运动',
    description: '充满活力的运动风格，适合体育用品商店',
    preview: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    tags: ['运动', '活力', '健康'],
    price: 0,
    category: 'sports'
  },
  {
    id: 9,
    name: '奢华高端',
    description: '奢华高端的风格，适合奢侈品商店',
    preview: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
    tags: ['奢华', '高端', '精致'],
    price: 299,
    category: 'luxury'
  }
])

const customThemes = ref([
  {
    id: 'custom-1',
    name: '我的自定义主题1',
    description: '基于现代简约主题的自定义版本',
    preview: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
    createdAt: '2024-01-10'
  },
  {
    id: 'custom-2',
    name: '我的自定义主题2',
    description: '完全自定义设计的主题',
    preview: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop',
    createdAt: '2024-01-05'
  }
])

// 方法
const applyTheme = async (theme: any) => {
  try {
    await ElMessageBox.confirm(`确定要应用主题 "${theme.name}" 吗？`, '确认应用', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    currentTheme.value = theme
    ElMessage.success('主题应用成功')
  } catch {
    // 用户取消
  }
}

const previewTheme = (theme: any) => {
  ElMessage.info(`预览主题: ${theme.name}`)
  // 这里可以打开预览窗口或跳转到预览页面
}

const editCustomTheme = (theme: any) => {
  ElMessage.info(`编辑自定义主题: ${theme.name}`)
  router.push('/dashboard/theme-editor')
}

const deleteCustomTheme = async (theme: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除自定义主题 "${theme.name}" 吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = customThemes.value.findIndex(t => t.id === theme.id)
    if (index > -1) {
      customThemes.value.splice(index, 1)
    }
    
    ElMessage.success('主题删除成功')
  } catch {
    // 用户取消
  }
}

const createNewTheme = () => {
  ElMessage.info('创建新主题')
  router.push('/dashboard/theme-editor')
}

// 筛选主题
const filterThemes = () => {
  let filtered = themes.value

  // 按搜索关键词筛选
  if (searchQuery.value) {
    filtered = filtered.filter(theme => 
      theme.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      theme.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
  }

  // 按分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(theme => theme.category === selectedCategory.value)
  }

  // 按价格筛选
  if (priceFilter.value === 'free') {
    filtered = filtered.filter(theme => theme.price === 0)
  } else if (priceFilter.value === 'paid') {
    filtered = filtered.filter(theme => theme.price > 0)
  }

  filteredThemes.value = filtered
}

// 导入主题
const importTheme = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const themeData = JSON.parse(e.target.result)
          customThemes.value.push({
            id: `custom-${Date.now()}`,
            name: themeData.name || '导入的主题',
            description: themeData.description || '从文件导入的主题',
            preview: themeData.preview || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
            createdAt: new Date().toISOString().split('T')[0],
            config: themeData.config
          })
          ElMessage.success('主题导入成功')
        } catch (error) {
          ElMessage.error('主题文件格式错误')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

// 导出主题
const exportTheme = (theme) => {
  const themeData = {
    name: theme.name,
    description: theme.description,
    tags: theme.tags,
    config: theme.config || {},
    exportedAt: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${theme.name}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('主题导出成功')
}

// 购买主题
const purchaseTheme = async (theme) => {
  try {
    await ElMessageBox.confirm(
      `确定要购买主题 "${theme.name}" 吗？价格：¥${theme.price}`,
      '购买主题',
      {
        confirmButtonText: '确定购买',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    // 这里应该调用支付API
    ElMessage.success('主题购买成功，已添加到您的主题库')
  } catch {
    // 用户取消
  }
}

onMounted(() => {
  // 初始化数据
  filterThemes()
})
</script>

<style lang="scss" scoped>
.themes-page {
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

.current-theme,
.themes-library,
.custom-themes {
  margin-bottom: 40px;
  
  h2 {
    font-size: 24px;
    font-weight: 600;
    color: var(--saas-text-primary);
    margin-bottom: 20px;
  }
}

.library-header,
.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  .library-controls,
  .custom-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    
    .search-input {
      width: 200px;
    }
    
    .category-select,
    .price-select {
      width: 120px;
    }
  }
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.theme-card {
  background: var(--saas-bg-primary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--saas-shadow);
  border: 1px solid var(--saas-border-light);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--saas-shadow-lg);
  }
  
  &.active {
    border-color: var(--saas-primary);
    box-shadow: 0 0 0 2px rgba(var(--saas-primary), 0.2);
  }
  
  &.custom {
    border-color: var(--saas-success);
  }
  
  &.create-new {
    border: 2px dashed var(--saas-border);
    cursor: pointer;
    
    &:hover {
      border-color: var(--saas-primary);
      background: rgba(var(--saas-primary), 0.05);
    }
  }
}

.theme-preview {
  position: relative;
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .theme-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .el-button {
      padding: 8px 16px;
      font-size: 14px;
    }
  }
  
  &:hover .theme-overlay {
    opacity: 1;
  }
}

.create-preview {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--saas-text-tertiary);
  
  .create-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 16px;
    font-weight: 500;
  }
}

.theme-info {
  padding: 20px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--saas-text-primary);
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    color: var(--saas-text-secondary);
    margin-bottom: 12px;
    line-height: 1.5;
  }
  
  .theme-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }
  
  .theme-price {
    .free {
      color: var(--saas-success);
      font-weight: 600;
    }
    
    .paid {
      color: var(--saas-primary);
      font-weight: 600;
    }
  }
  
  .theme-meta {
    .created-date {
      font-size: 12px;
      color: var(--saas-text-tertiary);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .themes-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .themes-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
