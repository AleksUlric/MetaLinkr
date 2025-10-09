<template>
  <div class="voice-party-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="nav-left">
        <el-button @click="goBack" :icon="ArrowLeft" circle size="small" />
        <span class="page-title">语音派对</span>
      </div>
      <div class="nav-right">
        <el-button :icon="Search" circle size="small" @click="showSearch = true" />
        <el-button :icon="Setting" circle size="small" @click="showSettings = true" />
      </div>
    </div>

    <!-- 语音房间分类 -->
    <div class="room-categories">
      <div class="category-tabs">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="tab-item"
          :class="{ active: activeCategory === category.id }"
          @click="switchCategory(category.id)"
        >
          <el-icon v-if="category.icon">
            <component :is="category.icon" />
          </el-icon>
          <span>{{ category.name }}</span>
          <el-badge v-if="category.count > 0" :value="category.count" class="tab-badge" />
        </div>
      </div>
    </div>

    <!-- 推荐语音房间 -->
    <div v-if="featuredRooms.length > 0" class="featured-section">
      <div class="section-header">
        <h3>🎤 热门语音房</h3>
        <div class="section-actions">
          <el-button size="small" text @click="refreshFeatured">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>
      <div class="featured-rooms">
        <div 
          v-for="room in featuredRooms" 
          :key="room.id"
          class="featured-room"
          @click="enterRoom(room)"
        >
          <div class="room-preview">
            <div class="room-cover">
              <img :src="room.cover" :alt="room.title" />
              <div class="room-overlay">
                <div class="room-status">
                  <span class="status-dot"></span>
                  <span class="member-count">{{ room.memberCount }}人在线</span>
                </div>
                <div class="room-title">{{ room.title }}</div>
                <div class="room-tags">
                  <span class="tag hot-tag">🔥热门</span>
                  <span class="tag quality-tag">{{ room.quality }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="room-info">
            <div class="host-info">
              <el-avatar :src="room.hostAvatar" :size="40" />
              <div class="host-details">
                <div class="host-name">{{ room.hostName }}</div>
                <div class="room-category">{{ room.category }}</div>
              </div>
            </div>
            <div class="room-actions">
              <el-button 
                size="small" 
                :type="room.isJoined ? 'success' : 'primary'" 
                plain
                @click.stop="toggleJoin(room.id)"
              >
                {{ room.isJoined ? '已加入' : '加入' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 语音房间列表 -->
    <div class="room-list">
      <div class="list-header">
        <h3>语音房间</h3>
        <div class="sort-options">
          <el-select v-model="sortBy" size="small" placeholder="排序方式">
            <el-option label="在线人数" value="members" />
            <el-option label="最新创建" value="latest" />
            <el-option label="最受欢迎" value="popular" />
          </el-select>
        </div>
      </div>
      
      <div class="room-grid">
        <div 
          v-for="room in filteredRooms" 
          :key="room.id"
          class="room-item"
          @click="enterRoom(room)"
        >
          <div class="room-preview">
            <img :src="room.cover" :alt="room.title" class="cover-image" />
            <div class="room-overlay">
              <div class="room-status">
                <span class="status-dot"></span>
                <span class="member-count">{{ room.memberCount }}人</span>
              </div>
              <div class="room-title">{{ room.title }}</div>
            </div>
          </div>
          <div class="room-info">
            <div class="host-info">
              <el-avatar :src="room.hostAvatar" :size="40" />
              <div class="host-details">
                <div class="host-name">{{ room.hostName }}</div>
                <div class="room-category">{{ room.category }}</div>
              </div>
            </div>
            <div class="room-meta">
              <span class="room-duration">{{ room.duration }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建语音房间按钮 -->
    <div class="floating-action">
      <el-button 
        type="primary" 
        size="large" 
        round 
        class="create-room-btn"
        @click="createRoom"
      >
        <el-icon><Microphone /></el-icon>
        创建语音房
      </el-button>
    </div>

    <!-- 创建房间对话框 -->
    <el-dialog v-model="showCreateDialog" title="创建语音房间" width="90%">
      <div class="create-room-content">
        <div class="room-settings">
          <el-form :model="roomForm" label-width="80px">
            <el-form-item label="房间标题">
              <el-input v-model="roomForm.title" placeholder="请输入房间标题" />
            </el-form-item>
            <el-form-item label="房间分类">
              <el-select v-model="roomForm.category" placeholder="选择分类">
                <el-option 
                  v-for="category in categories" 
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="房间封面">
              <el-upload
                class="cover-uploader"
                action="#"
                :show-file-list="false"
                :on-success="handleCoverSuccess"
                :before-upload="beforeCoverUpload"
              >
                <el-image v-if="roomForm.cover" :src="roomForm.cover" class="cover-preview" />
                <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="房间描述">
              <el-input 
                v-model="roomForm.description" 
                type="textarea" 
                :rows="3"
                placeholder="介绍一下你的语音房间"
              />
            </el-form-item>
            <el-form-item label="房间设置">
              <el-checkbox v-model="roomForm.isPublic">公开房间</el-checkbox>
              <el-checkbox v-model="roomForm.allowGuest">允许游客进入</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        
        <div class="room-tips">
          <h4>语音房间小贴士</h4>
          <ul>
            <li>保持网络稳定，确保语音清晰</li>
            <li>与房间成员友好互动，营造良好氛围</li>
            <li>遵守平台规则，维护房间秩序</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmCreateRoom">创建房间</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft,
  Search, 
  Setting,
  Microphone,
  Refresh,
  Plus
} from '@element-plus/icons-vue'

const router = useRouter()

interface VoiceRoom {
  id: string
  title: string
  cover: string
  hostName: string
  hostAvatar: string
  category: string
  memberCount: number
  duration: string
  quality?: string
  isFeatured?: boolean
  isJoined?: boolean
  description?: string
}

interface Category {
  id: string
  name: string
  icon?: string
  count: number
}

// 响应式数据
const activeCategory = ref('all')
const sortBy = ref('members')
const showCreateDialog = ref(false)
const showSearch = ref(false)
const showSettings = ref(false)

// 房间表单
const roomForm = ref({
  title: '',
  category: '',
  cover: '',
  description: '',
  isPublic: true,
  allowGuest: true
})

// 分类数据
const categories = ref<Category[]>([
  { id: 'all', name: '全部', count: 0 },
  { id: 'chat', name: '聊天', icon: 'ChatDotRound', count: 12 },
  { id: 'music', name: '音乐', icon: 'Headphone', count: 8 },
  { id: 'game', name: '游戏', icon: 'Trophy', count: 15 },
  { id: 'story', name: '故事', icon: 'Reading', count: 6 },
  { id: 'dating', name: '交友', icon: 'Heart', count: 4 }
])

// 语音房间数据 - 参考Uki的语音社交
const roomList = ref<VoiceRoom[]>([
  {
    id: '1',
    title: '深夜情感电台',
    cover: 'https://picsum.photos/300/200?random=401',
    hostName: '情感主播',
    hostAvatar: 'https://picsum.photos/100/100?random=1',
    category: '聊天',
    memberCount: 156,
    duration: '2小时30分',
    quality: 'HD',
    isFeatured: true,
    isJoined: false,
    description: '分享你的故事，倾听他人的心声'
  },
  {
    id: '2',
    title: '音乐分享会',
    cover: 'https://picsum.photos/300/200?random=402',
    hostName: '音乐达人',
    hostAvatar: 'https://picsum.photos/100/100?random=2',
    category: '音乐',
    memberCount: 89,
    duration: '1小时45分',
    quality: 'HD',
    isFeatured: true,
    isJoined: true,
    description: '一起分享好听的音乐'
  },
  {
    id: '3',
    title: '游戏开黑组队',
    cover: 'https://picsum.photos/300/200?random=403',
    hostName: '游戏高手',
    hostAvatar: 'https://picsum.photos/100/100?random=3',
    category: '游戏',
    memberCount: 234,
    duration: '3小时15分',
    quality: 'HD',
    isFeatured: false,
    isJoined: false,
    description: '王者荣耀开黑，寻找队友'
  },
  {
    id: '4',
    title: '睡前故事会',
    cover: 'https://picsum.photos/300/200?random=404',
    hostName: '故事姐姐',
    hostAvatar: 'https://picsum.photos/100/100?random=4',
    category: '故事',
    memberCount: 67,
    duration: '1小时20分',
    quality: 'HD',
    isFeatured: false,
    isJoined: false,
    description: '温馨的睡前故事，伴你入眠'
  },
  {
    id: '5',
    title: '单身交友派对',
    cover: 'https://picsum.photos/300/200?random=405',
    hostName: '红娘小助手',
    hostAvatar: 'https://picsum.photos/100/100?random=5',
    category: '交友',
    memberCount: 189,
    duration: '2小时10分',
    quality: 'HD',
    isFeatured: false,
    isJoined: true,
    description: '寻找你的另一半'
  },
  {
    id: '6',
    title: '英语口语练习',
    cover: 'https://picsum.photos/300/200?random=406',
    hostName: '英语老师',
    hostAvatar: 'https://picsum.photos/100/100?random=6',
    category: '聊天',
    memberCount: 45,
    duration: '4小时30分',
    quality: 'HD',
    isFeatured: false,
    isJoined: false,
    description: '一起练习英语口语'
  }
])

// 计算属性
const featuredRooms = computed(() => 
  roomList.value.filter(room => room.isFeatured)
)

const filteredRooms = computed(() => {
  let filtered = roomList.value.filter(room => !room.isFeatured)
  
  if (activeCategory.value !== 'all') {
    const category = categories.value.find(c => c.id === activeCategory.value)
    if (category) {
      filtered = filtered.filter(room => 
        room.category.includes(category.name)
      )
    }
  }
  
  // 排序
  switch (sortBy.value) {
    case 'members':
      filtered.sort((a, b) => b.memberCount - a.memberCount)
      break
    case 'latest':
      // 这里可以根据创建时间排序
      break
    case 'popular':
      // 这里可以根据受欢迎程度排序
      break
  }
  
  return filtered
})

// 方法
const goBack = () => {
  router.back()
}

const switchCategory = (categoryId: string) => {
  activeCategory.value = categoryId
}

const enterRoom = (room: VoiceRoom) => {
  ElMessage.success(`进入语音房间: ${room.title}`)
  // 这里可以跳转到语音房间页面
  console.log('进入语音房间:', room.title)
}

const toggleJoin = (roomId: string) => {
  const room = roomList.value.find(r => r.id === roomId)
  if (room) {
    room.isJoined = !room.isJoined
    ElMessage.success(room.isJoined ? '加入成功' : '退出房间')
  }
}

const createRoom = () => {
  showCreateDialog.value = true
}

const confirmCreateRoom = () => {
  if (!roomForm.value.title) {
    ElMessage.error('请输入房间标题')
    return
  }
  
  ElMessage.success('语音房间创建成功！')
  showCreateDialog.value = false
  
  // 重置表单
  roomForm.value = {
    title: '',
    category: '',
    cover: '',
    description: '',
    isPublic: true,
    allowGuest: true
  }
}

const handleCoverSuccess = (response: any, file: any) => {
  const imageUrl = URL.createObjectURL(file.raw)
  roomForm.value.cover = imageUrl
  ElMessage.success('封面上传成功')
}

const beforeCoverUpload = (file: any) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('封面图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('封面图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

const refreshFeatured = () => {
  ElMessage.success('推荐内容已刷新')
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.voice-party-page {
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

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.nav-right {
  display: flex;
  gap: 8px;
}

/* 语音房间分类 */
.room-categories {
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

.tab-badge {
  font-size: 12px;
}

/* 热门推荐语音房间 */
.featured-section {
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-actions {
  display: flex;
  gap: 8px;
}

.featured-rooms {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.featured-room {
  min-width: 300px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.featured-room:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
}

.room-preview {
  position: relative;
  overflow: hidden;
}

.room-cover img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.room-overlay {
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

.room-status {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  align-self: flex-start;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #43e97b;
  border-radius: 50%;
  margin-right: 6px;
  animation: pulse 1s infinite;
}

.member-count {
  font-weight: 500;
}

.room-title {
  color: white;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  margin-bottom: 8px;
}

.room-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.hot-tag {
  background: rgba(255, 87, 34, 0.8);
  color: white;
}

.quality-tag {
  background: rgba(76, 175, 80, 0.8);
  color: white;
}

/* 语音房间列表 */
.room-list {
  padding: 0 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.list-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 8px;
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.room-item {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.room-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.cover-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.room-info {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
}

.host-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.host-details {
  flex: 1;
}

.host-name {
  font-weight: 600;
  color: #333;
  font-size: 16px;
  margin-bottom: 2px;
}

.room-category {
  font-size: 12px;
  color: #666;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
}

.room-meta {
  text-align: right;
}

.room-duration {
  font-size: 12px;
  color: #999;
}

/* 创建语音房间按钮 */
.floating-action {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.create-room-btn {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

/* 创建房间对话框 */
.create-room-content {
  padding: 20px 0;
}

.room-settings {
  margin-bottom: 24px;
}

.cover-uploader {
  display: block;
}

.cover-preview {
  width: 200px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.cover-uploader-icon:hover {
  border-color: #409eff;
}

.room-tips {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
}

.room-tips h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.room-tips ul {
  margin: 0;
  padding-left: 20px;
}

.room-tips li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 动画 */
@keyframes pulse {
  0%, 100% { 
    opacity: 1; 
  }
  50% { 
    opacity: 0.5; 
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-nav {
    padding: 8px 12px;
  }
  
  .room-categories {
    padding: 12px;
  }
  
  .category-tabs {
    gap: 8px;
  }
  
  .tab-item {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .featured-section, .room-list {
    padding: 0 12px;
  }
  
  .featured-room {
    min-width: 240px;
  }
  
  .room-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .cover-image {
    height: 120px;
  }
  
  .create-room-btn {
    padding: 12px 24px;
    font-size: 14px;
  }
  
  .cover-preview, .cover-uploader-icon {
    width: 150px;
    height: 90px;
  }
  
  .cover-uploader-icon {
    line-height: 90px;
  }
}
</style>

