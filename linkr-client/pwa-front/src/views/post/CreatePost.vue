<template>
  <div class="create-post-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="nav-title">发布动态</div>
      <div class="nav-right">
        <el-button type="primary" @click="publishPost" :loading="publishing">
          {{ publishing ? '发布中...' : '发布' }}
        </el-button>
      </div>
    </div>

    <div class="create-content">
      <!-- 用户信息 -->
      <div class="user-info">
        <SmartAvatar 
          :src="userInfo.avatar" 
          :gender="'male'" 
          :size="40" 
          :alt="userInfo.nickname"
        />
        <div class="user-details">
          <div class="username">{{ userInfo.nickname }}</div>
          <div class="user-level">Lv.{{ userInfo.level }}</div>
        </div>
      </div>

      <!-- 内容输入 -->
      <div class="content-input">
        <el-input
          v-model="postContent"
          type="textarea"
          placeholder="分享你的想法..."
          :rows="6"
          maxlength="2000"
          show-word-limit
          resize="none"
        />
      </div>

      <!-- 图片上传 -->
      <div class="media-section" v-if="images.length > 0 || uploading">
        <div class="section-title">图片</div>
        <div class="images-grid">
          <div v-for="(image, index) in images" :key="index" class="image-item">
            <img :src="image" :alt="`图片${index + 1}`" />
            <div class="image-overlay">
              <el-button type="danger" size="small" @click="removeImage(index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
          <div v-if="images.length < 9 && !uploading" class="upload-placeholder" @click="selectImages">
            <el-icon><Plus /></el-icon>
            <span>添加图片</span>
          </div>
          <div v-if="uploading" class="uploading-placeholder">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>上传中...</span>
          </div>
        </div>
      </div>

      <!-- 位置信息 -->
      <div class="location-section">
        <div class="section-title">位置</div>
        <div class="location-input">
          <el-input
            v-model="location"
            placeholder="添加位置信息"
            clearable
          >
            <template #prefix>
              <el-icon><Location /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 标签选择 -->
      <div class="tags-section">
        <div class="section-title">标签</div>
        <div class="tags-input">
          <el-input
            v-model="tagInput"
            placeholder="添加标签，按回车确认"
            @keyup.enter="addTag"
            clearable
          >
            <template #suffix>
              <el-icon><Tag /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="selected-tags" v-if="tags.length > 0">
          <el-tag
            v-for="tag in tags"
            :key="tag"
            closable
            @close="removeTag(tag)"
            class="tag-item"
          >
            {{ tag }}
          </el-tag>
        </div>
        <div class="recommended-tags" v-if="recommendedTags.length > 0">
          <div class="tags-title">推荐标签</div>
          <div class="tags-list">
            <el-tag
              v-for="tag in recommendedTags"
              :key="tag"
              @click="addTag(tag)"
              class="recommended-tag"
              :class="{ disabled: tags.includes(tag) }"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 可见性设置 -->
      <div class="visibility-section">
        <div class="section-title">可见性</div>
        <el-radio-group v-model="visibility">
          <el-radio :value="1">
            <el-icon><Globe /></el-icon>
            公开
          </el-radio>
          <el-radio :value="2">
            <el-icon><User /></el-icon>
            仅粉丝
          </el-radio>
          <el-radio :value="0">
            <el-icon><Lock /></el-icon>
            私密
          </el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import SmartAvatar from '@/components/SmartAvatar.vue'
import { getUserAvatarUrl } from '@/utils/avatar'
import { get, post, upload } from '@/utils/request'
import { 
  ArrowLeft, 
  Delete, 
  Plus, 
  Loading, 
  Location, 
  Tag, 
  Globe, 
  User, 
  Lock 
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

// 响应式数据
const postContent = ref('')
const images = ref<string[]>([])
const location = ref('')
const tags = ref<string[]>([])
const tagInput = ref('')
const visibility = ref(1)
const publishing = ref(false)
const uploading = ref(false)
const recommendedTags = ref<string[]>([])

const userInfo = reactive({
  nickname: '',
  avatar: '',
  level: 1
})

// 生命周期
onMounted(async () => {
  await loadUserInfo()
  await loadRecommendedTags()
})

// 方法
const goBack = () => {
  router.back()
}

const loadUserInfo = async () => {
  try {
    const user = await get('/api/user/profile')
    if (user) {
      userInfo.nickname = user.nickname || '用户'
      userInfo.avatar = getUserAvatarUrl(user.avatar, user.gender || 'male')
      userInfo.level = user.level || 1
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

const loadRecommendedTags = async () => {
  try {
    const tags = await get<string[]>('/api/tags/recommended-tags')
    if (tags && Array.isArray(tags)) {
      recommendedTags.value = tags.slice(0, 10) // 只显示前10个推荐标签
    }
  } catch (error) {
    console.error('加载推荐标签失败:', error)
  }
}

const selectImages = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = true
  input.onchange = handleImageUpload
  input.click()
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return
  
  // 检查文件数量
  if (images.value.length + files.length > 9) {
    ElMessage.warning('最多只能上传9张图片')
    return
  }
  
  uploading.value = true
  
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        ElMessage.error(`${file.name} 不是图片文件`)
        continue
      }
      
      // 验证文件大小（5MB）
      if (file.size > 5 * 1024 * 1024) {
        ElMessage.error(`${file.name} 文件大小不能超过5MB`)
        continue
      }
      
      const formData = new FormData()
      formData.append('file', file)
      
      try {
        const result = await upload<{ url: string }>('/api/upload/post-image', formData)
        images.value.push(result.url)
      } catch (error: any) {
        ElMessage.error(error.message || '图片上传失败')
      }
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    ElMessage.error('图片上传失败')
  } finally {
    uploading.value = false
  }
}

const removeImage = (index: number) => {
  images.value.splice(index, 1)
}

const addTag = (tag?: string) => {
  const tagToAdd = tag || tagInput.value.trim()
  if (!tagToAdd) return
  
  if (tags.value.length >= 5) {
    ElMessage.warning('最多只能添加5个标签')
    return
  }
  
  if (tags.value.includes(tagToAdd)) {
    ElMessage.warning('标签已存在')
    return
  }
  
  tags.value.push(tagToAdd)
  tagInput.value = ''
}

const removeTag = (tag: string) => {
  const index = tags.value.indexOf(tag)
  if (index > -1) {
    tags.value.splice(index, 1)
  }
}

const publishPost = async () => {
  try {
    // 验证内容
    if (!postContent.value.trim()) {
      ElMessage.error('请输入动态内容')
      return
    }
    
    publishing.value = true
    
    try {
      await post('/api/posts/create', {
        content: postContent.value,
        images: images.value,
        location: location.value,
        tags: tags.value,
        visibility: visibility.value
      })
      
      ElMessage.success('动态发布成功')
      router.back()
    } catch (error: any) {
    console.error('发布动态失败:', error)
    ElMessage.error('发布失败，请稍后重试')
  } finally {
    publishing.value = false
  }
}

</script>

<style lang="scss" scoped>
.create-post-page {
  background: linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%);
  min-height: 100vh;
  color: #334155;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(196, 181, 253, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;

  .back-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #8b5cf6;

    &:hover {
      background: rgba(139, 92, 246, 0.2);
    }
  }

  .nav-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }

  .nav-right {
    .el-button {
      background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
      border: none;
      color: white;
      font-weight: 600;
      padding: 8px 20px;
      border-radius: 20px;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(139, 92, 246, 0.3);
      }
    }
  }
}

.create-content {
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);

  .user-details {
    .username {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }

    .user-level {
      font-size: 12px;
      color: #8b5cf6;
      background: rgba(139, 92, 246, 0.1);
      padding: 2px 8px;
      border-radius: 10px;
      display: inline-block;
      margin-top: 2px;
    }
  }
}

.content-input {
  margin-bottom: 20px;

  .el-textarea {
    .el-textarea__inner {
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(139, 92, 246, 0.1);
      color: #334155;
      font-size: 16px;
      line-height: 1.6;

      &::placeholder {
        color: #94a3b8;
      }
    }
  }
}

.media-section, .location-section, .tags-section, .visibility-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(196, 181, 253, 0.1);
  }
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  .image-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 1;
      }
    }
  }

  .upload-placeholder, .uploading-placeholder {
    aspect-ratio: 1;
    border: 2px dashed rgba(139, 92, 246, 0.3);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #8b5cf6;

    &:hover {
      border-color: rgba(139, 92, 246, 0.5);
      background: rgba(139, 92, 246, 0.05);
    }

    .el-icon {
      font-size: 24px;
      margin-bottom: 5px;
    }

    span {
      font-size: 12px;
    }
  }
}

.location-input, .tags-input {
  .el-input {
    .el-input__inner {
      border-radius: 8px;
      background: rgba(139, 92, 246, 0.05);
      border: 1px solid rgba(139, 92, 246, 0.1);
      color: #334155;

      &::placeholder {
        color: #94a3b8;
      }
    }
  }
}

.selected-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .tag-item {
    background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
    color: white;
    border: none;
  }
}

.recommended-tags {
  margin-top: 15px;

  .tags-title {
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 10px;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .recommended-tag {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
      border: 1px solid rgba(139, 92, 246, 0.2);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(.disabled) {
        background: rgba(139, 92, 246, 0.2);
        transform: translateY(-1px);
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

.visibility-section {
  .el-radio-group {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .el-radio {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #475569;

      &.is-checked {
        color: #8b5cf6;
      }

      .el-icon {
        font-size: 16px;
      }
    }
  }
}
</style>