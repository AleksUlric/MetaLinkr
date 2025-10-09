<template>
  <div class="company-info-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">公司信息管理</h1>
        <p class="page-subtitle">管理您的公司信息和品牌展示</p>
      </div>
      <div class="header-right">
        <el-button type="primary" size="large" @click="saveCompanyInfo">
          <el-icon><Check /></el-icon>
          保存更改
        </el-button>
      </div>
    </div>
    
    <div class="content-grid">
      <!-- 基本信息 -->
      <div class="info-section">
        <div class="section-header">
          <h2>基本信息</h2>
          <el-tag type="info" size="small">必填信息</el-tag>
        </div>
        
        <el-form :model="companyForm" label-width="120px" class="company-form">
          <el-form-item label="公司名称" required>
            <el-input v-model="companyForm.name" placeholder="请输入公司名称" />
          </el-form-item>
          
          <el-form-item label="公司英文名">
            <el-input v-model="companyForm.nameEn" placeholder="请输入公司英文名称" />
          </el-form-item>
          
          <el-form-item label="公司简介" required>
            <el-input
              v-model="companyForm.description"
              type="textarea"
              :rows="4"
              placeholder="请输入公司简介"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="公司英文简介">
            <el-input
              v-model="companyForm.descriptionEn"
              type="textarea"
              :rows="4"
              placeholder="请输入公司英文简介"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="成立年份">
            <el-date-picker
              v-model="companyForm.establishedYear"
              type="year"
              placeholder="选择成立年份"
              format="YYYY"
              value-format="YYYY"
            />
          </el-form-item>
          
          <el-form-item label="员工数量">
            <el-select v-model="companyForm.employeeCount" placeholder="选择员工数量">
              <el-option label="1-10人" value="1-10" />
              <el-option label="11-50人" value="11-50" />
              <el-option label="51-200人" value="51-200" />
              <el-option label="201-500人" value="201-500" />
              <el-option label="501-1000人" value="501-1000" />
              <el-option label="1000人以上" value="1000+" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="年营业额">
            <el-select v-model="companyForm.annualRevenue" placeholder="选择年营业额">
              <el-option label="100万以下" value="<1M" />
              <el-option label="100万-500万" value="1M-5M" />
              <el-option label="500万-1000万" value="5M-10M" />
              <el-option label="1000万-5000万" value="10M-50M" />
              <el-option label="5000万-1亿" value="50M-100M" />
              <el-option label="1亿以上" value=">100M" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 联系信息 -->
      <div class="info-section">
        <div class="section-header">
          <h2>联系信息</h2>
          <el-tag type="success" size="small">重要信息</el-tag>
        </div>
        
        <el-form :model="companyForm" label-width="120px" class="company-form">
          <el-form-item label="公司地址" required>
            <el-input v-model="companyForm.address" placeholder="请输入公司地址" />
          </el-form-item>
          
          <el-form-item label="城市">
            <el-input v-model="companyForm.city" placeholder="请输入城市" />
          </el-form-item>
          
          <el-form-item label="省份/州">
            <el-input v-model="companyForm.province" placeholder="请输入省份或州" />
          </el-form-item>
          
          <el-form-item label="国家" required>
            <el-select v-model="companyForm.country" placeholder="选择国家" filterable>
              <el-option label="中国" value="China" />
              <el-option label="美国" value="United States" />
              <el-option label="英国" value="United Kingdom" />
              <el-option label="德国" value="Germany" />
              <el-option label="法国" value="France" />
              <el-option label="日本" value="Japan" />
              <el-option label="韩国" value="South Korea" />
              <el-option label="印度" value="India" />
              <el-option label="澳大利亚" value="Australia" />
              <el-option label="加拿大" value="Canada" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="邮政编码">
            <el-input v-model="companyForm.postalCode" placeholder="请输入邮政编码" />
          </el-form-item>
          
          <el-form-item label="联系电话" required>
            <el-input v-model="companyForm.phone" placeholder="请输入联系电话" />
          </el-form-item>
          
          <el-form-item label="传真">
            <el-input v-model="companyForm.fax" placeholder="请输入传真号码" />
          </el-form-item>
          
          <el-form-item label="邮箱" required>
            <el-input v-model="companyForm.email" placeholder="请输入邮箱地址" />
          </el-form-item>
          
          <el-form-item label="网站">
            <el-input v-model="companyForm.website" placeholder="请输入公司网站" />
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 业务信息 -->
      <div class="info-section">
        <div class="section-header">
          <h2>业务信息</h2>
          <el-tag type="warning" size="small">展示信息</el-tag>
        </div>
        
        <el-form :model="companyForm" label-width="120px" class="company-form">
          <el-form-item label="主营业务">
            <el-input
              v-model="companyForm.mainBusiness"
              type="textarea"
              :rows="3"
              placeholder="请输入主营业务"
            />
          </el-form-item>
          
          <el-form-item label="产品类别">
            <el-select v-model="companyForm.productCategories" multiple placeholder="选择产品类别">
              <el-option label="电子产品" value="electronics" />
              <el-option label="服装配饰" value="clothing" />
              <el-option label="家居用品" value="home" />
              <el-option label="美妆护肤" value="beauty" />
              <el-option label="食品饮料" value="food" />
              <el-option label="运动户外" value="sports" />
              <el-option label="汽车用品" value="automotive" />
              <el-option label="工业设备" value="industrial" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="目标市场">
            <el-select v-model="companyForm.targetMarkets" multiple placeholder="选择目标市场">
              <el-option label="北美" value="North America" />
              <el-option label="欧洲" value="Europe" />
              <el-option label="亚洲" value="Asia" />
              <el-option label="南美" value="South America" />
              <el-option label="非洲" value="Africa" />
              <el-option label="大洋洲" value="Oceania" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="认证资质">
            <el-input
              v-model="companyForm.certifications"
              type="textarea"
              :rows="3"
              placeholder="请输入认证资质，如ISO9001、CE等"
            />
          </el-form-item>
          
          <el-form-item label="工厂信息">
            <el-input
              v-model="companyForm.factoryInfo"
              type="textarea"
              :rows="3"
              placeholder="请输入工厂信息"
            />
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 品牌展示 -->
      <div class="info-section">
        <div class="section-header">
          <h2>品牌展示</h2>
          <el-tag type="primary" size="small">视觉展示</el-tag>
        </div>
        
        <el-form :model="companyForm" label-width="120px" class="company-form">
          <el-form-item label="公司Logo">
            <div class="logo-upload">
              <el-upload
                class="logo-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeLogoUpload"
                :http-request="handleLogoUpload"
              >
                <img v-if="companyForm.logo" :src="companyForm.logo" class="logo-preview" />
                <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <div class="upload-tips">
                <p>建议尺寸：200x200px</p>
                <p>支持格式：JPG、PNG、GIF</p>
                <p>文件大小：不超过2MB</p>
              </div>
            </div>
          </el-form-item>
          
          <el-form-item label="公司横幅">
            <div class="banner-upload">
              <el-upload
                class="banner-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeBannerUpload"
                :http-request="handleBannerUpload"
              >
                <img v-if="companyForm.banner" :src="companyForm.banner" class="banner-preview" />
                <el-icon v-else class="banner-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <div class="upload-tips">
                <p>建议尺寸：1200x400px</p>
                <p>支持格式：JPG、PNG</p>
                <p>文件大小：不超过5MB</p>
              </div>
            </div>
          </el-form-item>
          
          <el-form-item label="公司视频">
            <el-input v-model="companyForm.videoUrl" placeholder="请输入公司介绍视频链接" />
            <div class="video-tips">
              <p>支持YouTube、Vimeo等视频平台链接</p>
            </div>
          </el-form-item>
          
          <el-form-item label="公司图片">
            <el-upload
              class="gallery-uploader"
              action="#"
              :file-list="companyForm.galleryImages"
              list-type="picture-card"
              :before-upload="beforeGalleryUpload"
              :http-request="handleGalleryUpload"
              :on-remove="handleGalleryRemove"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <div class="upload-tips">
              <p>最多上传10张图片</p>
              <p>建议尺寸：800x600px</p>
              <p>支持格式：JPG、PNG</p>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, Plus } from '@element-plus/icons-vue'

// 响应式数据
const companyForm = reactive({
  // 基本信息
  name: '',
  nameEn: '',
  description: '',
  descriptionEn: '',
  establishedYear: '',
  employeeCount: '',
  annualRevenue: '',
  
  // 联系信息
  address: '',
  city: '',
  province: '',
  country: '',
  postalCode: '',
  phone: '',
  fax: '',
  email: '',
  website: '',
  
  // 业务信息
  mainBusiness: '',
  productCategories: [],
  targetMarkets: [],
  certifications: '',
  factoryInfo: '',
  
  // 品牌展示
  logo: 'https://images.unsplash.com/photo-1599305445771-7760d8091b70?w=200&h=200&fit=crop',
  banner: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=400&fit=crop',
  videoUrl: '',
  galleryImages: [
    {
      uid: '1',
      name: '公司环境1.jpg',
      url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop',
      status: 'done'
    },
    {
      uid: '2',
      name: '公司环境2.jpg',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
      status: 'done'
    },
    {
      uid: '3',
      name: '产品展示1.jpg',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      status: 'done'
    }
  ]
})

// 方法
const saveCompanyInfo = async () => {
  try {
    // 验证必填字段
    if (!companyForm.name) {
      ElMessage.error('请输入公司名称')
      return
    }
    if (!companyForm.description) {
      ElMessage.error('请输入公司简介')
      return
    }
    if (!companyForm.address) {
      ElMessage.error('请输入公司地址')
      return
    }
    if (!companyForm.country) {
      ElMessage.error('请选择国家')
      return
    }
    if (!companyForm.phone) {
      ElMessage.error('请输入联系电话')
      return
    }
    if (!companyForm.email) {
      ElMessage.error('请输入邮箱地址')
      return
    }
    
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('公司信息保存成功')
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  }
}

const beforeLogoUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleLogoUpload = (options: any) => {
  const file = options.file
  const reader = new FileReader()
  reader.onload = (e) => {
    companyForm.logo = e.target?.result as string
    ElMessage.success('Logo上传成功')
  }
  reader.readAsDataURL(file)
}

const beforeBannerUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handleBannerUpload = (options: any) => {
  const file = options.file
  const reader = new FileReader()
  reader.onload = (e) => {
    companyForm.banner = e.target?.result as string
    ElMessage.success('横幅上传成功')
  }
  reader.readAsDataURL(file)
}

const beforeGalleryUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  if (companyForm.galleryImages.length >= 10) {
    ElMessage.error('最多只能上传10张图片!')
    return false
  }
  return true
}

const handleGalleryUpload = (options: any) => {
  const file = options.file
  const reader = new FileReader()
  reader.onload = (e) => {
    const imageUrl = e.target?.result as string
    companyForm.galleryImages.push({
      name: file.name,
      url: imageUrl,
      uid: Date.now()
    })
    ElMessage.success('图片上传成功')
  }
  reader.readAsDataURL(file)
}

const handleGalleryRemove = (file: any) => {
  const index = companyForm.galleryImages.findIndex(img => img.uid === file.uid)
  if (index > -1) {
    companyForm.galleryImages.splice(index, 1)
  }
}

onMounted(() => {
  // 加载公司信息
  loadCompanyInfo()
})

const loadCompanyInfo = () => {
  // 模拟加载数据
  Object.assign(companyForm, {
    name: '示例科技有限公司',
    nameEn: 'Example Technology Co., Ltd.',
    description: '我们是一家专业从事电子产品研发、生产和销售的高新技术企业，致力于为客户提供优质的产品和服务。',
    descriptionEn: 'We are a high-tech enterprise specializing in the R&D, production and sales of electronic products, committed to providing customers with high-quality products and services.',
    establishedYear: '2015',
    employeeCount: '51-200',
    annualRevenue: '10M-50M',
    address: '北京市朝阳区科技园区创新大厦A座1001室',
    city: '北京',
    province: '北京市',
    country: 'China',
    postalCode: '100000',
    phone: '+86-10-12345678',
    email: 'info@example.com',
    website: 'https://www.example.com',
    mainBusiness: '电子产品研发、生产、销售',
    productCategories: ['electronics'],
    targetMarkets: ['North America', 'Europe', 'Asia'],
    certifications: 'ISO9001:2015, CE, FCC, RoHS',
    factoryInfo: '拥有现代化生产基地，年产能100万台'
  })
}
</script>

<style lang="scss" scoped>
.company-info-page {
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
}

.info-section {
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
    padding-bottom: 12px;
    border-bottom: 1px solid var(--saas-border-light);
    
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: var(--saas-text-primary);
    }
  }
}

.company-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.logo-upload {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  
  .logo-uploader {
    .logo-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      transition: border-color 0.3s;
      
      &:hover {
        border-color: var(--saas-primary);
      }
    }
    
    .logo-preview {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid var(--saas-border-light);
    }
  }
  
  .upload-tips {
    flex: 1;
    
    p {
      font-size: 12px;
      color: var(--saas-text-tertiary);
      margin-bottom: 4px;
    }
  }
}

.banner-upload {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  
  .banner-uploader {
    .banner-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 200px;
      height: 80px;
      line-height: 80px;
      text-align: center;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      transition: border-color 0.3s;
      
      &:hover {
        border-color: var(--saas-primary);
      }
    }
    
    .banner-preview {
      width: 200px;
      height: 80px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid var(--saas-border-light);
    }
  }
  
  .upload-tips {
    flex: 1;
    
    p {
      font-size: 12px;
      color: var(--saas-text-tertiary);
      margin-bottom: 4px;
    }
  }
}

.video-tips {
  margin-top: 8px;
  
  p {
    font-size: 12px;
    color: var(--saas-text-tertiary);
  }
}

.gallery-uploader {
  :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  
  :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 100px;
    height: 100px;
  }
}

.upload-tips {
  margin-top: 8px;
  
  p {
    font-size: 12px;
    color: var(--saas-text-tertiary);
    margin-bottom: 4px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .company-info-page {
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
  
  .logo-upload,
  .banner-upload {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
