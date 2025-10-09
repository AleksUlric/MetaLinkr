<template>
  <div class="video-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <el-icon><Search /></el-icon>
        <span>搜索</span>
      </div>
      <div class="nav-center">
        <h2>短视频</h2>
      </div>
      <div class="nav-right">
        <el-icon><Bell /></el-icon>
        <el-icon><Setting /></el-icon>
      </div>
    </div>

    <!-- 视频分类标签 -->
    <div class="video-categories">
      <div class="category-tabs">
        <div 
          class="tab-item" 
          :class="{ active: activeCategory === category.id }"
          v-for="category in categories" 
          :key="category.id"
          @click="switchCategory(category.id)"
        >
          <el-icon v-if="category.icon">
            <component :is="category.icon" />
          </el-icon>
          <span>{{ category.name }}</span>
        </div>
      </div>
    </div>

    <!-- 视频列表 -->
    <div class="video-list">
      <div 
        v-for="video in filteredVideos" 
        :key="video.id"
        class="video-item"
        @click="playVideo(video)"
      >
        <div class="video-preview">
          <el-image :src="video.cover" class="cover-image" />
          <div class="video-overlay">
            <div class="play-button">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <div class="video-duration">{{ video.duration }}</div>
            <div class="video-actions">
              <el-button size="small" type="primary" plain @click.stop="likeVideo(video.id)">
                <el-icon><Star /></el-icon>
                {{ video.likeCount }}
              </el-button>
              <el-button size="small" type="primary" plain @click.stop="shareVideo(video.id)">
                <el-icon><Share /></el-icon>
                {{ video.shareCount }}
              </el-button>
            </div>
          </div>
        </div>
        <div class="video-info">
          <div class="video-title">{{ video.title }}</div>
          <div class="video-meta">
            <el-avatar :src="video.authorAvatar" :size="24" />
            <span class="author-name">{{ video.authorName }}</span>
            <span class="view-count">{{ video.viewCount }}次观看</span>
          </div>
          <div class="video-tags">
            <el-tag 
              v-for="tag in video.tags" 
              :key="tag"
              size="small"
              type="info"
            >
              #{{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 发布视频按钮 -->
    <div class="floating-action">
      <el-button 
        type="primary" 
        size="large" 
        round 
        class="publish-video-btn"
        @click="publishVideo"
      >
        <el-icon><Plus /></el-icon>
        发布视频
      </el-button>
    </div>

    <!-- 发布视频对话框 -->
    <el-dialog v-model="showPublishDialog" title="发布视频" width="90%">
      <div class="publish-video-content">
        <div class="video-upload">
          <el-upload
            class="video-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleVideoSuccess"
            :before-upload="beforeVideoUpload"
            accept="video/*"
          >
            <div v-if="publishForm.videoUrl" class="video-preview">
              <video :src="publishForm.videoUrl" controls class="uploaded-video" />
            </div>
            <div v-else class="upload-placeholder">
              <el-icon><VideoCamera /></el-icon>
              <p>点击上传视频</p>
            </div>
          </el-upload>
        </div>

        <el-form :model="publishForm" label-width="80px">
          <el-form-item label="视频标题">
            <el-input v-model="publishForm.title" placeholder="请输入视频标题" />
          </el-form-item>
          <el-form-item label="视频描述">
            <el-input 
              v-model="publishForm.description" 
              type="textarea" 
              :rows="3"
              placeholder="介绍一下你的视频内容"
            />
          </el-form-item>
          <el-form-item label="视频标签">
            <div class="tag-input">
              <el-tag 
                v-for="tag in publishForm.tags" 
                :key="tag" 
                closable
                @close="removeTag(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputVisible"
                ref="inputRef"
                v-model="inputValue"
                size="small"
                @keyup.enter="addTag"
                @blur="addTag"
              />
              <el-button v-else size="small" @click="showInput">+ 添加标签</el-button>
            </div>
          </el-form-item>
          <el-form-item label="隐私设置">
            <el-radio-group v-model="publishForm.privacy">
              <el-radio value="public">公开</el-radio>
              <el-radio value="friends">仅好友可见</el-radio>
              <el-radio value="private">仅自己可见</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="showPublishDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmPublish">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Search, 
  Bell, 
  Setting,
  VideoPlay,
  Star,
  Share,
  Plus,
  VideoCamera
} from '@element-plus/icons-vue'

interface VideoItem {
  id: string
  title: string
  cover: string
  videoUrl: string
  duration: string
  authorName: string
  authorAvatar: string
  viewCount: number
  likeCount: number
  shareCount: number
  tags: string[]
  category: string
  publishTime: string
}

interface Category {
  id: string
  name: string
  icon?: string
}

// 响应式数据
const activeCategory = ref('all')
const showPublishDialog = ref(false)
const inputVisible = ref(false)
const inputValue = ref('')
const inputRef = ref()

// 发布表单
const publishForm = ref({
  title: '',
  description: '',
  tags: [] as string[],
  privacy: 'public',
  videoUrl: ''
})

// 分类数据
const categories = ref<Category[]>([
  { id: 'all', name: '推荐', icon: 'Star' },
  { id: 'funny', name: '搞笑', icon: 'Smile' },
  { id: 'music', name: '音乐', icon: 'Headphone' },
  { id: 'dance', name: '舞蹈', icon: 'User' },
  { id: 'life', name: '生活', icon: 'HomeFilled' },
  { id: 'food', name: '美食', icon: 'Food' },
  { id: 'travel', name: '旅行', icon: 'Location' },
  { id: 'sports', name: '运动', icon: 'Basketball' }
])

// 视频列表数据
const videoList = ref<VideoItem[]>([
  {
    id: '1',
    title: '今天给大家表演一个魔术~',
    cover: 'https://picsum.photos/300/400?random=401',
    videoUrl: '',
    duration: '0:30',
    authorName: '魔术师小王',
    authorAvatar: 'https://picsum.photos/100/100?random=1',
    viewCount: 12560,
    likeCount: 892,
    shareCount: 156,
    tags: ['魔术', '表演', '神奇'],
    category: 'funny',
    publishTime: '2小时前'
  },
  {
    id: '2',
    title: '超简单的舞蹈教学',
    cover: 'https://picsum.photos/300/400?random=402',
    videoUrl: '',
    duration: '1:20',
    authorName: '舞蹈老师',
    authorAvatar: 'https://picsum.photos/100/100?random=2',
    viewCount: 8920,
    likeCount: 567,
    shareCount: 89,
    tags: ['舞蹈', '教学', '简单'],
    category: 'dance',
    publishTime: '4小时前'
  },
  {
    id: '3',
    title: '美食制作过程',
    cover: 'https://picsum.photos/300/400?random=403',
    videoUrl: '',
    duration: '2:15',
    authorName: '美食达人',
    authorAvatar: 'https://picsum.photos/100/100?random=3',
    viewCount: 15680,
    likeCount: 1234,
    shareCount: 234,
    tags: ['美食', '制作', '教程'],
    category: 'food',
    publishTime: '6小时前'
  },
  {
    id: '4',
    title: '旅行vlog分享',
    cover: 'https://picsum.photos/300/400?random=404',
    videoUrl: '',
    duration: '3:45',
    authorName: '旅行博主',
    authorAvatar: 'https://picsum.photos/100/100?random=4',
    viewCount: 23450,
    likeCount: 1890,
    shareCount: 345,
    tags: ['旅行', 'vlog', '风景'],
    category: 'travel',
    publishTime: '1天前'
  },
  {
    id: '5',
    title: '健身打卡第100天',
    cover: 'https://picsum.photos/300/400?random=405',
    videoUrl: '',
    duration: '1:30',
    authorName: '健身教练',
    authorAvatar: 'https://picsum.photos/100/100?random=5',
    viewCount: 6780,
    likeCount: 456,
    shareCount: 78,
    tags: ['健身', '打卡', '坚持'],
    category: 'sports',
    publishTime: '2天前'
  },
  {
    id: '6',
    title: '音乐翻唱',
    cover: 'https://picsum.photos/300/400?random=406',
    videoUrl: '',
    duration: '2:00',
    authorName: '音乐人',
    authorAvatar: 'https://picsum.photos/100/100?random=6',
    viewCount: 18900,
    likeCount: 1456,
    shareCount: 267,
    tags: ['音乐', '翻唱', '好听'],
    category: 'music',
    publishTime: '3天前'
  }
])

// 计算属性
const filteredVideos = computed(() => {
  if (activeCategory.value === 'all') {
    return videoList.value
  }
  return videoList.value.filter(video => video.category === activeCategory.value)
})

// 方法
const switchCategory = (categoryId: string) => {
  activeCategory.value = categoryId
}

const playVideo = (video: VideoItem) => {
  ElMessage.success(`播放视频: ${video.title}`)
  // 这里可以跳转到视频播放页面
  console.log('播放视频:', video.title)
}

const likeVideo = (videoId: string) => {
  const video = videoList.value.find(v => v.id === videoId)
  if (video) {
    video.likeCount++
    ElMessage.success('点赞成功')
  }
}

const shareVideo = (videoId: string) => {
  const video = videoList.value.find(v => v.id === videoId)
  if (video) {
    video.shareCount++
    ElMessage.success('分享成功')
  }
}

const publishVideo = () => {
  showPublishDialog.value = true
}

const confirmPublish = () => {
  if (!publishForm.value.title) {
    ElMessage.error('请输入视频标题')
    return
  }
  
  if (!publishForm.value.videoUrl) {
    ElMessage.error('请上传视频')
    return
  }
  
  ElMessage.success('视频发布成功！')
  showPublishDialog.value = false
  
  // 重置表单
  publishForm.value = {
    title: '',
    description: '',
    tags: [],
    privacy: 'public',
    videoUrl: ''
  }
}

const handleVideoSuccess = (response: any, file: any) => {
  const videoUrl = URL.createObjectURL(file.raw)
  publishForm.value.videoUrl = videoUrl
  ElMessage.success('视频上传成功')
}

const beforeVideoUpload = (file: any) => {
  const isVideo = file.type.startsWith('video/')
  const isLt100M = file.size / 1024 / 1024 < 100

  if (!isVideo) {
    ElMessage.error('只能上传视频文件!')
  }
  if (!isLt100M) {
    ElMessage.error('视频大小不能超过 100MB!')
  }
  return isVideo && isLt100M
}

const removeTag = (tag: string) => {
  const index = publishForm.value.tags.indexOf(tag)
  if (index > -1) {
    publishForm.value.tags.splice(index, 1)
  }
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const addTag = () => {
  if (inputValue.value && !publishForm.value.tags.includes(inputValue.value)) {
    publishForm.value.tags.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.video-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 100px;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #eee;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
  font-size: 14px;
}

.nav-center h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 视频分类标签 */
.video-categories {
  background: white;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.category-tabs {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  border: 1px solid #f0f0f0;
}

.tab-item:hover {
  background: #f8f9fa;
}

.tab-item.active {
  background: linear-gradient(135deg, #409eff 0%, #36cfc9 100%);
  color: white;
  border-color: transparent;
}

/* 视频列表 */
.video-list {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.video-item {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.video-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.video-preview {
  position: relative;
  aspect-ratio: 9/16;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #333;
  transition: all 0.3s;
}

.video-item:hover .play-button {
  background: white;
  transform: translate(-50%, -50%) scale(1.1);
}

.video-duration {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.video-actions {
  display: flex;
  gap: 8px;
  align-self: flex-end;
  opacity: 0;
  transition: opacity 0.3s;
}

.video-item:hover .video-actions {
  opacity: 1;
}

.video-actions .el-button {
  padding: 6px 12px;
  min-height: auto;
  border-radius: 16px;
  font-size: 12px;
}

.video-info {
  padding: 16px;
}

.video-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.author-name {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.view-count {
  font-size: 12px;
  color: #999;
  margin-left: auto;
}

.video-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.video-tags .el-tag {
  font-size: 12px;
}

/* 发布视频按钮 */
.floating-action {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.publish-video-btn {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
  background: linear-gradient(135deg, #409eff 0%, #36cfc9 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.4);
}

/* 发布视频对话框 */
.publish-video-content {
  padding: 20px 0;
}

.video-upload {
  margin-bottom: 24px;
  text-align: center;
}

.video-uploader {
  display: inline-block;
}

.video-preview {
  width: 200px;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
}

.uploaded-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  width: 200px;
  height: 300px;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
  color: #8c939d;
}

.upload-placeholder:hover {
  border-color: #409eff;
}

.upload-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.upload-placeholder p {
  margin: 0;
  font-size: 14px;
}

.tag-input {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-nav {
    padding: 8px 12px;
  }
  
  .nav-left span, .nav-right span {
    display: none;
  }
  
  .video-categories {
    padding: 12px;
  }
  
  .category-tabs {
    gap: 8px;
  }
  
  .tab-item {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .video-list {
    padding: 12px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }
  
  .video-preview {
    aspect-ratio: 9/16;
  }
  
  .play-button {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .publish-video-btn {
    padding: 12px 24px;
    font-size: 14px;
  }
  
  .video-preview, .upload-placeholder {
    width: 150px;
    height: 225px;
  }
  
  .upload-placeholder .el-icon {
    font-size: 36px;
  }
}
</style>

