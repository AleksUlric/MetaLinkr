<template>
  <div class="edit-profile-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="nav-title">编辑资料</div>
      <div class="nav-right">
        <el-button type="primary" @click="saveProfile" :loading="loading">
          {{ loading ? '保存中...' : '保存' }}
        </el-button>
      </div>
    </div>

    <div class="edit-content">
      <!-- 头像编辑 -->
      <div class="edit-section">
        <div class="section-title">头像</div>
        <div class="avatar-edit">
          <div class="avatar-container">
            <SmartAvatar 
              :src="formData.avatar" 
              :gender="formData.gender" 
              :size="120" 
              :alt="formData.nickname"
              class="current-avatar"
            />
            <div class="avatar-overlay" @click="changeAvatar" v-loading="avatarUploading">
              <el-icon><Camera /></el-icon>
              <span>{{ avatarUploading ? '上传中...' : '更换头像' }}</span>
            </div>
          </div>
          <div class="avatar-options">
            <div class="option-item" @click="selectFromGallery">
              <el-icon><Picture /></el-icon>
              <span>从相册选择</span>
            </div>
            <div class="option-item" @click="takePhoto">
              <el-icon><Camera /></el-icon>
              <span>拍照</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 基本信息 -->
      <div class="edit-section">
        <div class="section-title">基本信息</div>
        <div class="form-items">
          <div class="form-item">
            <label>昵称</label>
            <el-input v-model="formData.nickname" placeholder="请输入昵称" maxlength="20" show-word-limit />
          </div>
          <div class="form-item">
            <label>个人简介</label>
            <el-input 
              v-model="formData.bio" 
              type="textarea" 
              placeholder="介绍一下自己吧..." 
              :rows="3"
              maxlength="500"
              show-word-limit
            />
          </div>
          <div class="form-item">
            <label>性别</label>
            <el-radio-group v-model="formData.gender">
              <el-radio v-for="option in genderOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </el-radio>
            </el-radio-group>
            <div class="field-tip">选择性别后，头像会自动更新为对应默认头像</div>
          </div>
          <div class="form-item">
            <label>生日</label>
            <div class="birthday-picker-wrapper">
              <SimpleDatePicker 
                v-model="formData.birthday"
                :min-date="minDate"
                :max-date="maxDate"
              />
            </div>
          </div>
          <div class="form-item">
            <label>所在地</label>
            <el-select v-model="formData.location" placeholder="请选择所在地" filterable>
              <el-option v-for="city in cityOptions" :key="city" :label="city" :value="city" />
            </el-select>
          </div>
        </div>
      </div>

      <!-- 兴趣标签 -->
      <div class="edit-section">
        <div class="section-title">
          兴趣标签
          <span class="section-subtitle">可以随时更新你的兴趣爱好</span>
        </div>
        <div class="tags-edit">
          <div class="selected-tags">
            <div class="tags-title">已选择的标签 ({{ formData.interests.length }}/6)</div>
            <div class="tags-list">
              <span 
                v-for="tag in formData.interests" 
                :key="tag" 
                class="tag-item selected"
                @click="removeTag(tag)"
              >
                {{ tag }}
                <el-icon><Close /></el-icon>
              </span>
              <div v-if="formData.interests.length === 0" class="empty-tags">
                还没有选择标签，点击下方标签添加
              </div>
            </div>
          </div>
          <div class="available-tags">
            <div class="tags-title">可选标签</div>
            <div class="tags-list">
              <span 
                v-for="tag in availableTags" 
                :key="tag" 
                class="tag-item available"
                :class="{ disabled: formData.interests.includes(tag) }"
                @click="addTag(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 隐私设置 -->
      <div class="edit-section">
        <div class="section-title">隐私设置</div>
        <div class="privacy-items">
          <div class="privacy-item">
            <div class="privacy-info">
              <div class="privacy-title">允许他人搜索到我</div>
              <div class="privacy-desc">开启后，其他用户可以通过搜索找到你</div>
            </div>
            <el-switch v-model="formData.privacy.searchable" />
          </div>
          <div class="privacy-item">
            <div class="privacy-info">
              <div class="privacy-title">允许陌生人查看我的动态</div>
              <div class="privacy-desc">开启后，非好友用户可以看到你的动态</div>
            </div>
            <el-switch v-model="formData.privacy.showPosts" />
          </div>
          <div class="privacy-item">
            <div class="privacy-info">
              <div class="privacy-title">允许他人向我发送消息</div>
              <div class="privacy-desc">开启后，陌生人可以给你发送私信</div>
            </div>
            <el-switch v-model="formData.privacy.allowMessages" />
          </div>
          <div class="privacy-item">
            <div class="privacy-info">
              <div class="privacy-title">显示在线状态</div>
              <div class="privacy-desc">开启后，好友可以看到你的在线状态</div>
            </div>
            <el-switch v-model="formData.privacy.showOnline" />
          </div>
        </div>
      </div>

      <!-- 通知设置 -->
      <div class="edit-section">
        <div class="section-title">通知设置</div>
        <div class="notification-items">
          <div class="notification-item">
            <div class="notification-info">
              <div class="notification-title">新消息通知</div>
              <div class="notification-desc">接收来自好友的新消息通知</div>
            </div>
            <el-switch v-model="formData.notifications.messages" />
          </div>
          <div class="notification-item">
            <div class="notification-info">
              <div class="notification-title">点赞通知</div>
              <div class="notification-desc">有人点赞你的动态时通知</div>
            </div>
            <el-switch v-model="formData.notifications.likes" />
          </div>
          <div class="notification-item">
            <div class="notification-info">
              <div class="notification-title">评论通知</div>
              <div class="notification-desc">有人评论你的动态时通知</div>
            </div>
            <el-switch v-model="formData.notifications.comments" />
          </div>
          <div class="notification-item">
            <div class="notification-info">
              <div class="notification-title">关注通知</div>
              <div class="notification-desc">有人关注你时通知</div>
            </div>
            <el-switch v-model="formData.notifications.follows" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import SmartAvatar from '@/components/SmartAvatar.vue'
import SimpleDatePicker from '@/components/SimpleDatePicker.vue'
import { getDefaultAvatarUrl, getUserAvatarUrl, isDefaultAvatar } from '@/utils/avatar'
import { get, post, upload, del } from '@/utils/request'
import { 
  ArrowLeft, 
  Camera, 
  Picture, 
  Close 
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

// 响应式数据
const formData = reactive({
  nickname: '',
  bio: '',
  avatar: getDefaultAvatarUrl('male'),
  gender: 'male' as 'male' | 'female' | 'other',
  birthday: '',
  location: '',
  interests: [] as string[],
  privacy: {
    searchable: true,
    showPosts: true,
    allowMessages: true,
    showOnline: true
  },
  notifications: {
    messages: true,
    likes: true,
    comments: true,
    follows: true
  }
})

// 日期限制
const minDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 100)

const maxDate = new Date()

// 监听性别变化，自动更新默认头像（如果当前是默认头像）
watch(() => formData.gender, (newGender) => {
  if (newGender === 'male' || newGender === 'female') {
    // 如果当前头像为空或者是默认头像，则自动更新为对应性别的默认头像
    if (!formData.avatar || !formData.avatar.trim() || isDefaultAvatar(formData.avatar)) {
      formData.avatar = getDefaultAvatarUrl(newGender)
    }
  }
})

const availableTags = ref<string[]>([])
const loading = ref(false)
const avatarUploading = ref(false)

// 性别选项
const genderOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '其他', value: 'other' }
]

// 城市选项
const cityOptions = [
  '北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安',
  '南京', '苏州', '重庆', '天津', '青岛', '大连', '厦门', '福州',
  '长沙', '郑州', '济南', '石家庄', '哈尔滨', '长春', '沈阳', '太原'
]

// 生命周期
onMounted(async () => {
  await loadUserProfile()
  await loadAvailableTags()
})

// 方法
const goBack = () => {
  router.back()
}

const loadUserProfile = async () => {
  try {
    loading.value = true
    const user = await get('/api/user/profile')
    
    if (user) {
      const userGender = user.gender || 'male'
      formData.nickname = user.nickname || ''
      formData.bio = user.bio || ''
      // 使用 getUserAvatarUrl 确保头像不为空，如果为空则使用默认头像
      formData.avatar = getUserAvatarUrl(user.avatar, userGender)
      formData.gender = userGender
        formData.birthday = user.birthday || ''
        formData.location = user.location || ''
        formData.interests = user.interests || []
      }
    }
  } catch (error) {
    console.error('加载用户资料失败:', error)
    ElMessage.error('加载用户资料失败')
  } finally {
    loading.value = false
  }
}

const loadAvailableTags = async () => {
  try {
    const tags = await get<string[]>('/api/tags/recommended-tags')
    if (tags && Array.isArray(tags)) {
      availableTags.value = tags
    }
  } catch (error) {
    console.error('加载标签失败:', error)
  }
}

const saveProfile = async () => {
  try {
    loading.value = true
    
    // 验证必填字段
    if (!formData.nickname.trim()) {
      ElMessage.error('请输入昵称')
      return
    }
    
    await post('/api/user/update-profile', {
      nickname: formData.nickname,
      bio: formData.bio,
      gender: formData.gender,
      birthday: formData.birthday,
      location: formData.location,
      interests: formData.interests,
      avatar: formData.avatar
    })
    
    ElMessage.success('个人资料保存成功')
    // 更新用户store
    await userStore.loadUserProfile()
    router.back()
  } catch (error) {
    console.error('保存用户资料失败:', error)
    ElMessage.error('保存失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const changeAvatar = () => {
  // 触发文件选择
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = handleAvatarUpload
  input.click()
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }
  
  // 验证文件大小（2MB）
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过2MB')
    return
  }
  
  try {
    avatarUploading.value = true
    
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    
    const result = await upload<{ url: string }>('/api/upload/avatar', uploadFormData)
    formData.avatar = result.url
    ElMessage.success('头像上传成功')
  } catch (error) {
    console.error('头像上传失败:', error)
    ElMessage.error('头像上传失败')
  } finally {
    avatarUploading.value = false
  }
}

const selectFromGallery = () => {
  changeAvatar()
}

const takePhoto = () => {
  ElMessage.info('拍照功能需要设备支持，请使用从相册选择')
}

const addTag = async (tag: string) => {
  if (formData.interests.length >= 6) {
    ElMessage.warning('最多只能选择6个标签')
    return
  }
  
  if (formData.interests.includes(tag)) {
    ElMessage.warning('该标签已存在')
    return
  }
  
  try {
    await post('/api/tags/add', {
      tagName: tag,
      tagType: '1', // 兴趣标签
      weight: '1',
      isPublic: true
    })
    
    formData.interests.push(tag)
    ElMessage.success('标签添加成功')
  } catch (error: any) {
    console.error('添加标签失败:', error)
    ElMessage.error(error.message || '标签添加失败')
  }
}

const removeTag = async (tag: string) => {
  try {
    await del(`/api/tags/remove?tagName=${encodeURIComponent(tag)}`)
    
    const index = formData.interests.indexOf(tag)
    if (index > -1) {
      formData.interests.splice(index, 1)
    }
    ElMessage.success('标签删除成功')
  } catch (error: any) {
    console.error('删除标签失败:', error)
    ElMessage.error(error.message || '标签删除失败')
  }
}

</script>

<style lang="scss" scoped>
.edit-profile-page {
  background: linear-gradient(135deg, #faf7ff 0%, #f3f0ff 100%);
  min-height: 100vh;
  color: #334155;
  position: relative;
  overflow-x: hidden;
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

.edit-content {
  padding: 20px;
}

.edit-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(196, 181, 253, 0.2);

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(196, 181, 253, 0.1);
  }
}

.avatar-edit {
  .avatar-container {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;

    .current-avatar {
      width: 100%;
      height: 100%;
      
      :deep(.el-avatar) {
        width: 100%;
        height: 100%;
      }
    }

    .avatar-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      opacity: 0;
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 1;
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

  .avatar-options {
    display: flex;
    justify-content: center;
    gap: 20px;

    .option-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 15px 20px;
      background: rgba(139, 92, 246, 0.1);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #8b5cf6;

      &:hover {
        background: rgba(139, 92, 246, 0.2);
        transform: translateY(-2px);
      }

      .el-icon {
        font-size: 24px;
      }

      span {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.form-items {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-size: 14px;
      font-weight: 600;
      color: #475569;
    }

    .el-input, .el-select, .el-input-number {
      .el-input__inner, .el-select__input {
        border-radius: 12px;
        background: rgba(139, 92, 246, 0.05);
        border: 1px solid rgba(139, 92, 246, 0.1);
        color: #334155;

        &::placeholder {
          color: #94a3b8;
        }
      }
    }

    .el-textarea {
      .el-textarea__inner {
        border-radius: 12px;
        background: rgba(139, 92, 246, 0.05);
        border: 1px solid rgba(139, 92, 246, 0.1);
        color: #334155;

        &::placeholder {
          color: #94a3b8;
        }
      }
    }

    .el-radio-group {
      .el-radio {
        color: #475569;

        &.is-checked {
          .el-radio__label {
            color: #8b5cf6;
          }
        }
      }
    }
  }
}

.tags-edit {
  .selected-tags, .available-tags {
    margin-bottom: 20px;

    .tags-title {
      font-size: 14px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 10px;
    }

    .tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .tag-item {
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 5px;

        &.selected {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;

          .el-icon {
            font-size: 12px;
          }
        }

        &.available {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          border: 1px solid rgba(139, 92, 246, 0.2);

          &:hover:not(.disabled) {
            background: rgba(139, 92, 246, 0.2);
            transform: translateY(-1px);
          }

          &.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: rgba(139, 92, 246, 0.05);
          }
        }
      }
    }
  }
}

.privacy-items, .notification-items {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .privacy-item, .notification-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: rgba(139, 92, 246, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(139, 92, 246, 0.1);

    .privacy-info, .notification-info {
      flex: 1;

      .privacy-title, .notification-title {
        font-size: 15px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 5px;
      }

      .privacy-desc, .notification-desc {
        font-size: 13px;
        color: #64748b;
        line-height: 1.4;
      }
    }

    .el-switch {
      &.is-checked {
        .el-switch__core {
          background-color: #8b5cf6;
          border-color: #8b5cf6;
        }
      }
    }
  }
}

.empty-tags {
  color: #94a3b8;
  font-size: 14px;
  text-align: center;
  padding: 20px;
  background: rgba(139, 92, 246, 0.05);
  border-radius: 8px;
  border: 1px dashed rgba(139, 92, 246, 0.2);
}

.section-subtitle {
  font-size: 12px;
  font-weight: normal;
  color: #64748b;
  margin-left: 8px;
}

.birthday-picker-wrapper {
  margin: 8px 0;
}

.field-tip {
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
  padding-left: 4px;
}
</style>
