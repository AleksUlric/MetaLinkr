<template>
  <div class="soul-create-post">
    <!-- Soul风格顶部导航 -->
    <div class="soul-nav-bar">
      <div class="nav-left">
        <div class="back-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
        </div>
        <div class="nav-title">发布瞬间</div>
      </div>
      <div class="nav-right">
        <div class="publish-btn" @click="publishPost" :class="{ disabled: !canPublish }">
          <span>发布</span>
        </div>
      </div>
    </div>

    <!-- Soul风格内容编辑区 -->
    <div class="post-editor">
      <!-- 用户信息 -->
      <div class="user-section">
        <div class="user-avatar">
          <img :src="userStore.profile?.avatar || 'https://picsum.photos/200/200?random=999'" :alt="userStore.profile?.nickname" />
        </div>
        <div class="user-info">
          <div class="user-name">{{ userStore.profile?.nickname || '匿名用户' }}</div>
          <div class="post-time">{{ currentTime }}</div>
        </div>
    </div>
    
      <!-- 文本编辑区 -->
      <div class="text-editor">
        <textarea
          v-model="postContent"
            placeholder="分享你的想法..."
          class="content-input"
          @input="handleContentChange"
        ></textarea>
        <div class="char-count">{{ postContent.length }}/500</div>
      </div>

      <!-- 图片上传区 -->
      <div class="media-section">
        <div class="media-grid">
          <div 
            v-for="(image, index) in uploadedImages" 
            :key="index"
            class="media-item image-item"
          >
            <img :src="image" :alt="`图片${index + 1}`" />
            <div class="remove-btn" @click="removeImage(index)">
              <el-icon><Close /></el-icon>
            </div>
          </div>
          
          <div 
            v-if="uploadedImages.length < 9" 
            class="media-item upload-item"
            @click="selectImages"
            >
              <el-icon><Plus /></el-icon>
            <span>添加图片</span>
          </div>
        </div>
      </div>

      <!-- 音乐选择区 -->
      <div class="music-section">
        <div class="section-header">
          <h3>添加音乐</h3>
          <div class="music-btn" @click="selectMusic">
            <el-icon><Microphone /></el-icon>
            <span>选择音乐</span>
          </div>
        </div>
        
        <div v-if="selectedMusic" class="selected-music">
          <div class="music-info">
            <div class="music-icon">🎵</div>
            <div class="music-details">
              <div class="music-name">{{ selectedMusic.name }}</div>
              <div class="music-artist">{{ selectedMusic.artist }}</div>
            </div>
          </div>
          <div class="remove-music-btn" @click="removeMusic">
            <el-icon><Close /></el-icon>
          </div>
        </div>
      </div>

      <!-- 位置选择区 -->
      <div class="location-section">
        <div class="section-header">
          <h3>添加位置</h3>
          <div class="location-btn" @click="selectLocation">
            <el-icon><Location /></el-icon>
            <span>{{ selectedLocation || '选择位置' }}</span>
          </div>
        </div>
      </div>

      <!-- 标签选择区 -->
      <div class="tags-section">
        <div class="section-header">
          <h3>添加标签</h3>
        </div>
        <div class="tags-input">
          <div class="selected-tags">
            <span 
              v-for="(tag, index) in selectedTags" 
              :key="index"
              class="tag"
              @click="removeTag(index)"
            >
              #{{ tag }}
              <el-icon><Close /></el-icon>
            </span>
          </div>
          <input
            v-model="tagInput"
            placeholder="输入标签..."
            class="tag-input"
            @keyup.enter="addTag"
          />
        </div>
        <div class="popular-tags">
          <span 
            v-for="tag in popularTags" 
            :key="tag"
            class="popular-tag"
            @click="addPopularTag(tag)"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- 隐私设置 -->
      <div class="privacy-section">
        <div class="section-header">
          <h3>隐私设置</h3>
        </div>
        <div class="privacy-options">
          <div 
            v-for="option in privacyOptions" 
            :key="option.value"
            class="privacy-option"
            :class="{ active: privacySetting === option.value }"
            @click="privacySetting = option.value"
          >
            <div class="option-icon">
              <el-icon><component :is="option.icon" /></el-icon>
            </div>
            <div class="option-info">
              <div class="option-title">{{ option.title }}</div>
              <div class="option-desc">{{ option.desc }}</div>
            </div>
            <div class="option-radio">
              <div class="radio-dot" :class="{ active: privacySetting === option.value }"></div>
            </div>
          </div>
          </div>
    </div>
    </div>

    <!-- Soul风格底部导航占位 -->
    <div class="bottom-spacer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Close, 
  Plus, 
  Microphone, 
  Location 
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const currentTime = ref('')
const postContent = ref('')
const uploadedImages = ref<string[]>([])
const selectedMusic = ref<any>(null)
const selectedLocation = ref('')
const selectedTags = ref<string[]>([])
const tagInput = ref('')
const privacySetting = ref('public')

// 热门标签
const popularTags = ref([
  '心情', '生活', '旅行', '美食', '音乐', '电影', '读书', '运动', 
  '工作', '学习', '恋爱', '友情', '家庭', '梦想', '回忆'
])

// 隐私选项
const privacyOptions = ref([
  {
    value: 'public',
    title: '公开',
    desc: '所有人可见',
    icon: 'Globe'
  },
  {
    value: 'friends',
    title: '仅好友',
    desc: '只有好友可见',
    icon: 'User'
  },
  {
    value: 'private',
    title: '私密',
    desc: '仅自己可见',
    icon: 'Lock'
  }
])

// 计算属性
const canPublish = computed(() => {
  return postContent.value.trim().length > 0 || uploadedImages.value.length > 0
})

// 更新时间
const updateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

// 方法
const goBack = () => {
  router.back()
}

const handleContentChange = () => {
  if (postContent.value.length > 500) {
    postContent.value = postContent.value.slice(0, 500)
    ElMessage.warning('内容不能超过500字符')
  }
}

const selectImages = () => {
  ElMessage.info('图片选择功能开发中...')
  // 模拟添加图片
  if (uploadedImages.value.length < 9) {
    uploadedImages.value.push(`https://picsum.photos/300/300?random=${Date.now()}`)
  }
}

const removeImage = (index: number) => {
  uploadedImages.value.splice(index, 1)
}

const selectMusic = () => {
  ElMessage.info('音乐选择功能开发中...')
  // 模拟选择音乐
  selectedMusic.value = {
    name: '夜空中最亮的星',
    artist: '逃跑计划'
  }
}

const removeMusic = () => {
  selectedMusic.value = null
}

const selectLocation = () => {
  ElMessage.info('位置选择功能开发中...')
  // 模拟选择位置
  selectedLocation.value = '杭州市'
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !selectedTags.value.includes(tag) && selectedTags.value.length < 5) {
    selectedTags.value.push(tag)
    tagInput.value = ''
  } else if (selectedTags.value.length >= 5) {
    ElMessage.warning('最多只能添加5个标签')
  }
}

const removeTag = (index: number) => {
  selectedTags.value.splice(index, 1)
}

const addPopularTag = (tag: string) => {
  if (!selectedTags.value.includes(tag) && selectedTags.value.length < 5) {
    selectedTags.value.push(tag)
  } else if (selectedTags.value.length >= 5) {
    ElMessage.warning('最多只能添加5个标签')
  }
}

const publishPost = () => {
  if (!canPublish.value) {
    ElMessage.warning('请至少输入文字或添加图片')
    return
  }

  // 模拟发布
  ElMessage.success('瞬间发布成功！')
  router.back()
}

// 生命周期
onMounted(() => {
  updateTime()
  
  // 每秒更新时间
  const timeInterval = setInterval(updateTime, 1000)
  
  onUnmounted(() => {
    clearInterval(timeInterval)
  })
})
</script>

<style lang="scss" scoped>
.soul-create-post {
  background: #ffffff;
  min-height: 100vh;
  color: #333333;
  position: relative;
}

// Soul风格顶部导航
.soul-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 100;

  .nav-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .back-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #666666;

      &:hover {
        background: #e9ecef;
        color: #333333;
      }
    }

    .nav-title {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
    }
  }

  .nav-right {
    .publish-btn {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 600;

      &:hover:not(.disabled) {
        transform: scale(1.05);
        box-shadow: 0 4px 16px rgba(79, 172, 254, 0.3);
      }

      &.disabled {
        background: #e9ecef;
        color: #999999;
        cursor: not-allowed;
      }
    }
  }
}

// Soul风格内容编辑区
.post-editor {
  padding: 20px;

  .user-section {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;

    .user-avatar {
      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .user-info {
      .user-name {
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        margin-bottom: 4px;
      }

      .post-time {
        font-size: 12px;
        color: #999999;
      }
    }
  }

  .text-editor {
    position: relative;
    margin-bottom: 24px;

    .content-input {
      width: 100%;
      min-height: 120px;
      border: none;
      outline: none;
      font-size: 16px;
      line-height: 1.6;
      color: #333333;
      resize: none;
      background: transparent;

      &::placeholder {
        color: #999999;
      }
    }

    .char-count {
      position: absolute;
      bottom: -20px;
      right: 0;
      font-size: 12px;
      color: #999999;
    }
  }

  .media-section {
    margin-bottom: 24px;

    .media-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;

      .media-item {
        aspect-ratio: 1;
        border-radius: 12px;
        overflow: hidden;
        position: relative;

        &.image-item {
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .remove-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 24px;
            height: 24px;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            transition: all 0.3s ease;

            &:hover {
              background: rgba(0, 0, 0, 0.8);
            }
          }
        }

        &.upload-item {
          background: #f8f9fa;
          border: 2px dashed #e9ecef;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #666666;

          &:hover {
            background: #e9ecef;
            border-color: #4facfe;
            color: #4facfe;
          }

          .el-icon {
            font-size: 24px;
            margin-bottom: 4px;
          }

          span {
            font-size: 12px;
          }
        }
      }
    }
  }

  .music-section,
  .location-section,
  .tags-section,
  .privacy-section {
    margin-bottom: 24px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h3 {
        font-size: 16px;
    font-weight: 600;
        color: #333333;
    margin: 0;
      }

      .music-btn,
      .location-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: #f8f9fa;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        color: #666666;

        &:hover {
          background: #e9ecef;
          color: #333333;
        }
      }
    }

    .selected-music {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f8f9fa;
      border-radius: 12px;
      padding: 16px;
      border: 1px solid #e9ecef;

      .music-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .music-icon {
          font-size: 24px;
        }

        .music-details {
          .music-name {
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 2px;
          }

          .music-artist {
            font-size: 12px;
            color: #666666;
          }
        }
      }

      .remove-music-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #e9ecef;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #666666;

        &:hover {
          background: #ff4757;
          color: white;
        }
      }
    }

    .tags-input {
      margin-bottom: 16px;

      .selected-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 12px;

        .tag {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #e6f3ff;
          color: #4facfe;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #b3d9ff;

          &:hover {
            background: #b3d9ff;
          }

          .el-icon {
            font-size: 10px;
          }
        }
      }

      .tag-input {
    width: 100%;
        padding: 12px 16px;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        font-size: 14px;
        color: #333333;
        background: #f8f9fa;
        outline: none;
        transition: all 0.3s ease;

        &:focus {
          border-color: #4facfe;
          background: #ffffff;
        }

        &::placeholder {
          color: #999999;
        }
      }
    }

    .popular-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .popular-tag {
        background: #f8f9fa;
        color: #666666;
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid #e9ecef;

        &:hover {
          background: #e6f3ff;
          color: #4facfe;
          border-color: #b3d9ff;
        }
      }
    }

    .privacy-options {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .privacy-option {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;

        &:hover {
          background: #e9ecef;
        }

        &.active {
          background: #e6f3ff;
          border-color: #4facfe;
        }

        .option-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666666;
          transition: all 0.3s ease;

          .el-icon {
            font-size: 18px;
          }
        }

        &.active .option-icon {
          background: #4facfe;
          color: white;
        }

        .option-info {
          flex: 1;

          .option-title {
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 2px;
          }

          .option-desc {
            font-size: 12px;
            color: #666666;
          }
        }

        .option-radio {
          .radio-dot {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid #e9ecef;
            position: relative;
            transition: all 0.3s ease;

            &.active {
              border-color: #4facfe;

              &::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 8px;
                height: 8px;
                background: #4facfe;
                border-radius: 50%;
                transform: translate(-50%, -50%);
              }
            }
          }
        }
      }
    }
  }
}

// 底部占位
.bottom-spacer {
  height: 80px;
}

// 响应式设计
@media screen and (max-width: 768px) {
  .soul-create-post {
    .soul-nav-bar {
      padding: 12px 16px;
    }

    .post-editor {
      padding: 16px;

      .media-section {
        .media-grid {
          gap: 8px;
        }
      }

      .music-section,
      .location-section,
      .tags-section,
      .privacy-section {
        margin-bottom: 20px;

        .section-header {
          margin-bottom: 12px;

          h3 {
            font-size: 14px;
          }

          .music-btn,
          .location-btn {
            padding: 6px 12px;
            font-size: 12px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .post-editor {
    .media-section {
      .media-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .tags-section {
      .popular-tags {
        .popular-tag {
          font-size: 11px;
          padding: 4px 8px;
        }
      }
    }
  }
}
</style>
