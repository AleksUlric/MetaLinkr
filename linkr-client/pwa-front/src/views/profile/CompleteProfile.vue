<template>
  <div class="soul-complete-profile-page">
    <!-- Soul风格顶部状态栏 -->
    <div class="soul-status-bar">
      <div class="status-left">
        <div class="back-btn" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
        </div>
        <div class="page-title">完善个人信息</div>
      </div>
      <div class="status-right">
        <!-- 移除"稍后完善"按钮，因为年龄和性别是必填的 -->
      </div>
    </div>

    <!-- Soul风格进度指示器 -->
    <div class="soul-progress-section">
      <div class="progress-header">
        <div class="progress-icon">🎯</div>
        <div class="progress-title">完善你的个人资料</div>
        <div class="progress-subtitle">让更多人了解你，找到志同道合的朋友</div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <div class="progress-text">完成度 {{ Math.round(progressPercentage) }}%</div>
      </div>
    </div>

    <!-- Soul风格表单内容 -->
    <div class="soul-form-container">
      <div class="soul-form-scroll">
        <el-form
          ref="profileFormRef"
          :model="profileForm"
          :rules="profileRules"
          class="soul-profile-form"
          label-position="top"
        >
        <!-- Soul风格头像上传 -->
        <div class="soul-form-section">
          <div class="section-header">
            <div class="section-icon">📸</div>
            <div class="section-info">
              <div class="section-title">设置头像</div>
              <div class="section-desc">选择一张你喜欢的头像</div>
            </div>
          </div>
          <div class="soul-avatar-upload">
            <div class="avatar-preview-container">
              <div class="avatar-preview" @click="selectAvatar">
                <img :src="profileForm.avatar" :alt="profileForm.nickname" class="preview-avatar" />
                <div class="avatar-overlay">
                  <el-icon><Camera /></el-icon>
                  <span>更换头像</span>
                </div>
              </div>
              <div class="avatar-tips">
                <span>点击上传头像，支持 jpg、png 格式，最大 5MB</span>
              </div>
            </div>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleAvatarChange"
            />
          </div>
        </div>

        <!-- Soul风格基本信息 -->
        <div class="soul-form-section">
          <div class="section-header">
            <div class="section-icon">👤</div>
            <div class="section-info">
              <div class="section-title">基本信息</div>
              <div class="section-desc">填写你的基本信息</div>
            </div>
          </div>
          
          <div class="form-fields" style="width: 100%; display: block;">
            <el-form-item label="昵称" prop="nickname">
              <el-input
                v-model="profileForm.nickname"
                placeholder="给自己起个好听的昵称"
                maxlength="20"
                show-word-limit
                class="soul-input"
              />
            </el-form-item>

            <el-form-item label="性别" prop="gender">
              <div class="gender-selector">
                <div 
                  class="gender-option"
                  :class="{ active: profileForm.gender === 'male' }"
                  @click="selectGender('male')"
                >
                  <div class="gender-icon">👨</div>
                  <span>男</span>
                </div>
                <div 
                  class="gender-option"
                  :class="{ active: profileForm.gender === 'female' }"
                  @click="selectGender('female')"
                >
                  <div class="gender-icon">👩</div>
                  <span>女</span>
                </div>
              </div>
              <div class="gender-tip">请选择性别，用于设置默认头像</div>
            </el-form-item>

            <el-form-item label="生日" prop="birthday">
              <div class="birthday-picker-wrapper">
                <SimpleDatePicker 
                  v-model="profileForm.birthday"
                  :min-date="minDate"
                  :max-date="maxDate"
                />
              </div>
            </el-form-item>
          </div>
        </div>

        <!-- Soul风格兴趣爱好（可选） -->
        <div class="soul-form-section">
          <div class="section-header">
            <div class="section-icon">⭐</div>
            <div class="section-info">
              <div class="section-title">兴趣爱好（可选）</div>
              <div class="section-desc">选择你的兴趣爱好，最多5个，后续可以随时更新</div>
            </div>
          </div>
          
          <div class="interests-container">
            <div class="interests-tags">
              <div
                v-for="interest in availableInterests"
                :key="interest"
                class="interest-tag"
                :class="{ selected: profileForm.interests.includes(interest) }"
                @click="toggleInterest(interest)"
              >
                {{ interest }}
              </div>
            </div>
            <div class="interests-tips">
              <span>已选择 {{ profileForm.interests.length }}/5 个标签</span>
            </div>
          </div>
        </div>

        <!-- Soul风格个人简介（可选） -->
        <div class="soul-form-section">
          <div class="section-header">
            <div class="section-icon">📝</div>
            <div class="section-info">
              <div class="section-title">个人简介（可选）</div>
              <div class="section-desc">介绍一下自己，让别人更了解你，后续可以随时更新</div>
            </div>
          </div>
          
          <el-form-item label="个人简介" prop="bio">
            <el-input
              v-model="profileForm.bio"
              type="textarea"
              placeholder="介绍一下自己吧，比如你的性格、爱好、职业等..."
              :rows="4"
              maxlength="200"
              show-word-limit
              class="soul-textarea"
            />
          </el-form-item>
        </div>
        </el-form>
      </div>

      <!-- Soul风格提交按钮 -->
      <div class="soul-form-actions">
        <div class="action-tips">
          <div class="tip-icon">💡</div>
          <div class="tip-text">完善个人信息可以获得100积分奖励！</div>
        </div>
        <div class="action-buttons">
          <el-button size="large" @click="goBack" class="cancel-btn">取消</el-button>
          <el-button
            type="primary"
            size="large"
            :loading="isSubmitting"
            @click="submitProfile"
            class="submit-btn"
          >
            {{ isSubmitting ? '保存中...' : '完成设置' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { 
  ArrowLeft, 
  Camera
} from '@element-plus/icons-vue'
import { useAuthStore } from '../../stores/auth'
import { useUserStore } from '../../stores/user'
import SimpleDatePicker from '@/components/SimpleDatePicker.vue'
import { getDefaultAvatarUrl, getUserAvatarUrl } from '@/utils/avatar'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

// 响应式数据
const profileFormRef = ref<FormInstance>()
const avatarInput = ref<HTMLInputElement>()
const isSubmitting = ref(false)

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const DEFAULT_GENDER: 'male' | 'female' = 'male'
const DEFAULT_NICKNAME = '灵魂旅人'

const defaultBirthdayDate = new Date()
defaultBirthdayDate.setFullYear(defaultBirthdayDate.getFullYear() - 18)
const DEFAULT_BIRTHDAY = formatDate(defaultBirthdayDate)

const profileForm = ref({
  avatar: getDefaultAvatarUrl(DEFAULT_GENDER),
  nickname: DEFAULT_NICKNAME,
  gender: DEFAULT_GENDER as 'male' | 'female',
  birthday: DEFAULT_BIRTHDAY,
  interests: [] as string[],
  bio: ''
})

// 日期限制
const minDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 100)

const maxDate = new Date()

// Soul风格兴趣爱好选项 - 参考主流社交软件
const availableInterests = [
  '音乐', '电影', '读书', '运动', '旅行', '摄影', '美食', '游戏',
  '绘画', '舞蹈', '编程', '健身', '瑜伽', '咖啡', '茶艺', '手工',
  '宠物', '园艺', '收藏', '写作', '演讲', '投资', '创业', '其他',
  '动漫', '电竞', '直播', '短视频', '购物', '美妆', '时尚', '设计',
  '科技', '数码', '汽车', '房产', '股票', '基金', '保险', '理财'
]

// 表单验证规则
const profileRules: FormRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度为2-20个字符', trigger: 'blur' }
  ],
  gender: [
    { 
      required: true, 
      message: '请选择性别', 
      trigger: 'change',
      validator: (_rule: any, value: any, callback: any) => {
        if (!value || value === '') {
          callback(new Error('请选择性别'))
        } else {
          callback()
        }
      }
    }
  ],
  birthday: [
    { 
      required: true, 
      message: '请选择生日', 
      trigger: 'change'
    }
  ]
}

// 计算属性：进度只可能是 50 / 75 / 100（必填项都有默认值，最少也是 50%）
const progressPercentage = computed(() => {
  // 选填：兴趣爱好 + 简介
  const hasInterests = profileForm.value.interests.length > 0
  const hasBio = !!profileForm.value.bio && profileForm.value.bio.trim() !== ''

  // 有爱好就 75，有爱好和简介就 100；
  // 如果只有简介没有爱好，也算 75（有一个选填项）
  if (hasInterests && hasBio) return 100
  if (hasInterests || hasBio) return 75
  return 50
})

// 方法
const goBack = () => {
  router.back()
}

// 选择性别并自动设置默认头像
const selectGender = (gender: 'male' | 'female') => {
  profileForm.value.gender = gender
  // 根据性别自动设置默认头像
  profileForm.value.avatar = getDefaultAvatarUrl(gender)
}

const selectAvatar = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    try {
      // 验证文件
      if (file.size > 5 * 1024 * 1024) {
        ElMessage.error('文件大小不能超过5MB')
        return
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        ElMessage.error('不支持的文件类型，请选择jpg、png格式的图片')
        return
      }
      
      // 上传到OSS
      const { uploadService } = await import('../../services/upload')
      const result = await uploadService.uploadAvatar(file)
      
      profileForm.value.avatar = result.url
      ElMessage.success('头像上传成功！')
      
    } catch (error) {
      console.error('头像上传失败:', error)
      ElMessage.error('头像上传失败，请重试')
      
      // 回退到本地预览
      const reader = new FileReader()
      reader.onload = (e) => {
        profileForm.value.avatar = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }
}


const toggleInterest = (interest: string) => {
  const index = profileForm.value.interests.indexOf(interest)
  if (index > -1) {
    profileForm.value.interests.splice(index, 1)
  } else {
    if (profileForm.value.interests.length < 5) {
      profileForm.value.interests.push(interest)
    } else {
      ElMessage.warning('最多选择5个兴趣爱好')
    }
  }
}

// 移除 disabledDate，因为已经在 WheelDatePicker 中处理

const submitProfile = async () => {
  if (!profileFormRef.value) return

  try {
    // 验证必填项
    if (!profileForm.value.gender) {
      ElMessage.error('请选择性别')
      return
    }
    
    if (!profileForm.value.birthday) {
      ElMessage.error('请选择生日')
      return
    }
    
    await profileFormRef.value.validate()
    
    isSubmitting.value = true
    
    // 确保头像有值，如果为空则使用默认头像
    let avatar = profileForm.value.avatar
    if (!avatar || !avatar.trim()) {
      const gender = profileForm.value.gender === 'male' || profileForm.value.gender === 'female'
        ? profileForm.value.gender
        : DEFAULT_GENDER
      avatar = getDefaultAvatarUrl(gender)
    }
    
    // 调用API更新用户信息
    const result = await userStore.updateProfile({
      nickname: profileForm.value.nickname,
      gender: profileForm.value.gender,
      birthday: profileForm.value.birthday,
      bio: profileForm.value.bio,
      interests: profileForm.value.interests,
      avatar: avatar
    })
    
    if (result.success) {
      // 更新 authStore 中的用户信息，避免路由守卫使用旧数据
      await authStore.fetchUserInfo()
      ElMessage.success('个人信息保存成功！获得100积分奖励！')
      router.push('/app/planet')
    } else {
      ElMessage.error(result.message || '保存失败，请重试')
    }
    
  } catch (error) {
    console.error('保存个人信息失败:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 初始化
onMounted(() => {
  // 从用户信息中获取默认值
  const user = authStore.user as any
  if (user) {
    const initialNickname = user.nickname?.trim() || DEFAULT_NICKNAME
    const userGender = user.gender as 'male' | 'female' | ''
    const initialGender = userGender === 'male' || userGender === 'female' ? userGender : DEFAULT_GENDER
    const initialBirthday = user.birthday || DEFAULT_BIRTHDAY
    
    profileForm.value.nickname = initialNickname
    profileForm.value.gender = initialGender
    profileForm.value.birthday = initialBirthday
    profileForm.value.bio = user.bio || ''
    profileForm.value.avatar = getUserAvatarUrl(
      user.avatar,
      initialGender
    ) || getDefaultAvatarUrl(initialGender)
  } else {
    profileForm.value.avatar = getDefaultAvatarUrl(DEFAULT_GENDER)
  }
})
</script>

<style lang="scss" scoped>
.soul-complete-profile-page {
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #333333;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden; // 防止横向滚动
  overflow-y: hidden; // 防止页面级滚动
}

.soul-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0; // 固定顶部栏，不允许收缩

  .status-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .back-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(102, 126, 234, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #667eea;

      &:hover {
        background: rgba(102, 126, 234, 0.2);
        transform: scale(1.05);
      }
    }

    .page-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
    }
  }

  .status-right {
    .skip-btn {
      padding: 8px 16px;
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      border-radius: 20px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(102, 126, 234, 0.2);
      }
    }
  }
}

.soul-progress-section {
  padding: 24px 20px;
  background: rgba(255, 255, 255, 0.9);
  margin: 16px 20px;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  flex-shrink: 0; // 固定进度条区域，不允许收缩

  .progress-header {
    text-align: center;
    margin-bottom: 20px;

    .progress-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .progress-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .progress-subtitle {
      font-size: 14px;
      color: #64748b;
    }
  }

  .progress-bar-container {
    .progress-bar {
      height: 8px;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 4px;
        transition: width 0.3s ease;
      }
    }

    .progress-text {
      font-size: 14px;
      color: #64748b;
      text-align: center;
      font-weight: 500;
    }
  }
}

.soul-form-container {
  padding: 0 20px;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0; // 允许flex子元素缩小
  overflow: hidden; // 防止容器溢出
  position: relative; // 确保定位上下文
}

.soul-form-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden; // 防止横向滚动
  padding-bottom: 40px; // 增加底部间距，确保内容不被底部按钮遮挡
  -webkit-overflow-scrolling: touch; // iOS平滑滚动
  min-height: 0; // 允许flex子元素缩小
  width: 100%; // 确保宽度
  position: relative; // 确保定位
  // 确保滚动条样式
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 2px;
    &:hover {
      background: rgba(102, 126, 234, 0.5);
    }
  }
}

.soul-profile-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box; // 确保padding不会导致溢出
  display: block; // 确保表单正常显示
  position: relative; // 确保定位
  margin-bottom: 0; // 确保没有额外的底部边距
}

.soul-form-section {
  margin-bottom: 32px;
  width: 100%;
  display: block; // 确保区块正常显示
  position: relative; // 确保定位
  visibility: visible; // 确保可见
  opacity: 1; // 确保不透明

  &:last-child {
    margin-bottom: 0;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid rgba(102, 126, 234, 0.1);
    width: 100%;
    visibility: visible;
    opacity: 1;

    .section-icon {
      font-size: 24px;
      display: block;
      flex-shrink: 0;
    }

    .section-info {
      flex: 1;
      display: block;
      
      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 2px;
        display: block;
      }

      .section-desc {
        font-size: 12px;
        color: #64748b;
        display: block;
      }
    }
  }
}

// Soul风格头像上传
.soul-avatar-upload {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 100%;
  visibility: visible;
  opacity: 1;

  .avatar-preview-container {
    text-align: center;
    width: 100%;

    .avatar-preview {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 0 auto 12px;
      border: 4px solid rgba(102, 126, 234, 0.1);

      &:hover {
        transform: scale(1.05);
        border-color: rgba(102, 126, 234, 0.3);
      }

      .preview-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .avatar-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;

        .avatar-preview:hover & {
          opacity: 1;
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

    .avatar-tips {
      font-size: 12px;
      color: #64748b;
      text-align: center;
      margin-top: 8px;
    }
  }
}

// 表单字段容器
.form-fields {
  width: 100%;
  display: block;
  visibility: visible;
  opacity: 1;
}

// Soul风格性别选择器
.gender-selector {
  display: flex;
  gap: 16px;
  justify-content: center;
  width: 100%;
  visibility: visible;
  opacity: 1;

  .gender-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 24px;
    border-radius: 16px;
    background: rgba(102, 126, 234, 0.05);
    border: 2px solid rgba(102, 126, 234, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
      border-color: rgba(102, 126, 234, 0.3);
      transform: translateY(-2px);
    }

    &.active {
      background: rgba(102, 126, 234, 0.15);
      border-color: #667eea;
      color: #667eea;
    }

    .gender-icon {
      font-size: 24px;
    }

    span {
      font-size: 14px;
      font-weight: 500;
    }
  }
}

// Soul风格兴趣爱好
.interests-container {
  width: 100%;
  
    .interests-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
    width: 100%;
    visibility: visible;
    opacity: 1;
    min-height: 40px; // 确保有最小高度

    .interest-tag {
      padding: 8px 16px;
      border-radius: 20px;
      background: rgba(102, 126, 234, 0.05);
      color: #64748b;
      border: 1px solid rgba(102, 126, 234, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 500;
      display: inline-block;
      visibility: visible;
      opacity: 1;

      &:hover {
        background: rgba(102, 126, 234, 0.1);
        border-color: rgba(102, 126, 234, 0.3);
        transform: translateY(-2px);
      }

      &.selected {
        background: rgba(102, 126, 234, 0.15);
        color: #667eea;
        border-color: #667eea;
      }
    }
  }

  .interests-tips {
    text-align: center;
    font-size: 12px;
    color: #64748b;
    display: block;
    visibility: visible;
    opacity: 1;
    margin-top: 8px;
  }
}

// Soul风格表单操作
.soul-form-actions {
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0; // 防止按钮区域被压缩
  margin-top: auto; // 确保按钮区域在底部
  z-index: 10;
  width: 100%;
  box-sizing: border-box;

  .action-tips {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 12px;
    margin-bottom: 20px;

    .tip-icon {
      font-size: 16px;
    }

    .tip-text {
      font-size: 14px;
      color: #667eea;
      font-weight: 500;
    }
  }

  .action-buttons {
    display: flex;
    gap: 16px;

    .el-button {
      flex: 1;
      height: 50px;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 600;
    }

    .cancel-btn {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      border: 1px solid rgba(102, 126, 234, 0.2);

      &:hover {
        background: rgba(102, 126, 234, 0.2);
      }
    }

    .submit-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;

      &:hover {
        background: linear-gradient(135deg, #5a6fd8, #6a4190);
      }
    }
  }
}

// Soul风格表单项样式
:deep(.el-form-item) {
  margin-bottom: 20px;
  width: 100%;
  display: block;
  visibility: visible;
  opacity: 1;

  .el-form-item__label {
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    font-size: 14px;
    display: block;
    width: 100%;
  }
  
  .el-form-item__content {
    width: 100%;
    display: block;
  }

  .soul-input {
    width: 100%;
    display: block;
    
    .el-input__wrapper {
      border-radius: 12px;
      padding: 12px 16px;
      border: 2px solid rgba(102, 126, 234, 0.1);
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.8);
      width: 100%;
      display: flex;

      &:hover {
        border-color: rgba(102, 126, 234, 0.3);
      }

      &.is-focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
    }

    // 确保输入框文字可见 - 使用更强的选择器
    :deep(.el-input__inner) {
      color: #1e293b !important;
      font-size: 14px;
      font-weight: 400;
      -webkit-text-fill-color: #1e293b !important;
    }

    :deep(.el-input__inner::placeholder) {
      color: #94a3b8 !important;
      -webkit-text-fill-color: #94a3b8 !important;
      opacity: 1 !important;
    }

    // 确保输入框在聚焦时文字也可见
    :deep(.el-input__wrapper.is-focus .el-input__inner) {
      color: #1e293b !important;
      -webkit-text-fill-color: #1e293b !important;
    }

    // 确保输入框在禁用状态下文字也可见（如果有）
    :deep(.el-input__wrapper.is-disabled .el-input__inner) {
      color: #64748b !important;
      -webkit-text-fill-color: #64748b !important;
    }
  }

  .soul-textarea {
    width: 100%;
    display: block;
    
    .el-textarea__inner {
      border-radius: 12px;
      border: 2px solid rgba(102, 126, 234, 0.1);
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.8);
      width: 100%;
      display: block;
      color: #1e293b !important;
      font-size: 14px;

      &:hover {
        border-color: rgba(102, 126, 234, 0.3);
      }

      &:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      &::placeholder {
        color: #94a3b8 !important;
      }
    }
  }

  .soul-date-picker {
    .el-input__wrapper {
      border-radius: 12px;
      padding: 12px 16px;
      border: 2px solid rgba(102, 126, 234, 0.1);
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.8);

      &:hover {
        border-color: rgba(102, 126, 234, 0.3);
      }

      &.is-focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }
    }
  }
}

// 生日选择器包装器
.birthday-picker-wrapper {
  margin: 8px 0;
  width: 100%;
  visibility: visible;
  opacity: 1;
  display: block;
}

.gender-tip {
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
  padding-left: 4px;
}
</style>

<style lang="scss">
// 全局样式覆盖 - 专门针对完善资料页面，确保输入框文字可见
.soul-complete-profile-page {
  // 覆盖 App.vue 中的全局输入框样式
  .el-input .el-input__wrapper .el-input__inner {
    color: #1e293b !important;
    -webkit-text-fill-color: #1e293b !important;
  }

  .el-input .el-input__wrapper .el-input__inner::placeholder {
    color: #94a3b8 !important;
    -webkit-text-fill-color: #94a3b8 !important;
    opacity: 1 !important;
  }

  // 确保聚焦状态下文字也可见
  .el-input .el-input__wrapper.is-focus .el-input__inner {
    color: #1e293b !important;
    -webkit-text-fill-color: #1e293b !important;
  }

  // 确保悬停状态下文字也可见
  .el-input .el-input__wrapper:hover .el-input__inner {
    color: #1e293b !important;
    -webkit-text-fill-color: #1e293b !important;
  }

  // 文本域样式
  .el-textarea .el-textarea__inner {
    color: #1e293b !important;
    -webkit-text-fill-color: #1e293b !important;
  }

  .el-textarea .el-textarea__inner::placeholder {
    color: #94a3b8 !important;
    -webkit-text-fill-color: #94a3b8 !important;
    opacity: 1 !important;
  }

  // 确保文本域聚焦状态下文字也可见
  .el-textarea .el-textarea__inner:focus {
    color: #1e293b !important;
    -webkit-text-fill-color: #1e293b !important;
  }
}
</style>
