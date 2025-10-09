<template>
  <div class="hertz-live-page">
    <!-- 赫兹风格的顶部状态栏 -->
    <div class="live-status-bar">
      <div class="status-info">
        <div class="user-avatar-container">
          <el-avatar :src="userStore.profile?.avatar || 'https://picsum.photos/200/200?random=999'" :size="40" />
          <div class="online-indicator"></div>
        </div>
        <div class="user-stats">
          <span class="stat-item">📹{{ totalLives }}</span>
          <span class="stat-item">👥{{ totalViewers }}</span>
          <span class="stat-item">🎤{{ voiceLives }}</span>
        </div>
      </div>
      <div class="live-mode-selector">
        <el-button 
          v-for="mode in liveModes" 
          :key="mode.id"
          :type="activeMode === mode.id ? 'primary' : 'default'"
          size="small"
          @click="setActiveMode(mode.id)"
        >
          {{ mode.icon }} {{ mode.label }}
        </el-button>
      </div>
    </div>

    <!-- Uki风格的语音直播入口 -->
    <div class="voice-live-section">
      <div class="voice-header">
        <div class="voice-icon">
          <div class="icon-placeholder">
            <el-icon><Microphone /></el-icon>
          </div>
          <div class="voice-badge">语音</div>
        </div>
        <div class="voice-info">
          <h3>语音直播</h3>
          <p>用声音连接世界，开启语音互动</p>
        </div>
        <el-button 
          type="primary" 
          size="small" 
          @click="startVoiceLive"
          class="voice-btn"
        >
          <el-icon><Microphone /></el-icon>
          开始语音直播
        </el-button>
      </div>
      <div class="voice-features">
        <div class="feature-item" @click="joinVoiceRoom">
          <div class="feature-icon voice-room">
            <el-icon><Microphone /></el-icon>
          </div>
          <span>语音房间</span>
        </div>
        <div class="feature-item" @click="startVoiceChat">
          <div class="feature-icon voice-chat">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <span>语音聊天</span>
        </div>
        <div class="feature-item" @click="startRadioShow">
          <div class="feature-icon radio">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <span>电台节目</span>
        </div>
        <div class="feature-item" @click="startPodcast">
          <div class="feature-icon podcast">
            <el-icon><Microphone /></el-icon>
          </div>
          <span>播客</span>
        </div>
      </div>
    </div>

    <!-- Uki风格的视频直播入口 -->
    <div class="video-live-section">
      <div class="video-header">
        <div class="video-icon">
          <div class="icon-placeholder">
            <el-icon><VideoCamera /></el-icon>
          </div>
          <div class="video-badge">视频</div>
        </div>
        <div class="video-info">
          <h3>视频直播</h3>
          <p>展示真实自我，开启视频互动</p>
        </div>
        <el-button 
          type="primary" 
          size="small" 
          @click="startVideoLive"
          class="video-btn"
        >
          <el-icon><VideoCamera /></el-icon>
          开始视频直播
        </el-button>
      </div>
      <div class="video-features">
        <div class="feature-item" @click="startGameLive">
          <div class="feature-icon game-live">
            <el-icon><Trophy /></el-icon>
          </div>
          <span>游戏直播</span>
        </div>
        <div class="feature-item" @click="startMusicLive">
          <div class="feature-icon music-live">
            <el-icon><Microphone /></el-icon>
          </div>
          <span>音乐直播</span>
        </div>
        <div class="feature-item" @click="startDanceLive">
          <div class="feature-icon dance-live">
            <el-icon><Star /></el-icon>
          </div>
          <span>舞蹈直播</span>
        </div>
        <div class="feature-item" @click="startTalkShow">
          <div class="feature-icon talk-show">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <span>脱口秀</span>
        </div>
      </div>
    </div>

    <!-- 直播分类标签 -->
    <div class="live-categories">
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
          <el-badge v-if="category.count > 0" :value="category.count" class="tab-badge" />
        </div>
      </div>
    </div>

    <!-- 热门推荐直播间 -->
    <div v-if="featuredLives.length > 0" class="featured-section">
      <div class="section-header">
        <h3>🔥 热门推荐</h3>
        <div class="section-actions">
          <el-button size="small" text @click="refreshFeatured">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>
      <div class="featured-lives">
        <div 
          v-for="live in featuredLives" 
          :key="live.id"
          class="featured-item"
          @click="enterLive(live)"
        >
          <div class="featured-preview">
            <el-image :src="live.cover" class="cover-image" />
            <div class="live-overlay">
              <div class="live-status">
                <span class="status-dot"></span>
                <span class="viewer-count">{{ formatViewerCount(live.viewerCount) }}</span>
              </div>
              <div class="live-title">{{ live.title }}</div>
              <div class="live-tags">
                <span class="tag hot-tag">🔥热门</span>
                <span class="tag quality-tag">HD</span>
              </div>
            </div>
            <div class="live-actions-overlay">
              <el-button size="small" circle @click.stop="followStreamer()">
                <el-icon><Star /></el-icon>
              </el-button>
              <el-button size="small" circle @click.stop="shareLive()">
                <el-icon><Share /></el-icon>
              </el-button>
            </div>
          </div>
          <div class="streamer-info">
            <div class="avatar-wrapper">
              <el-avatar :src="live.streamerAvatar" :size="40" />
              <div class="streamer-level">{{ live.streamerLevel || 'Lv.5' }}</div>
            </div>
            <div class="streamer-details">
              <div class="streamer-name">{{ live.streamerName }}</div>
              <div class="streamer-stats">
                <span class="followers">{{ live.followers || '1.2万' }}粉丝</span>
                <span class="live-category">{{ live.category }}</span>
              </div>
            </div>
            <div class="follow-btn">
              <el-button 
                size="small" 
                :type="live.isFollowed ? 'success' : 'primary'" 
                plain
                @click.stop="toggleFollow(live.id)"
              >
                {{ live.isFollowed ? '已关注' : '关注' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 直播列表 -->
    <div class="live-list">
      <div class="list-header">
        <h3>热门直播</h3>
        <div class="sort-options">
          <el-select v-model="sortBy" size="small" placeholder="排序方式">
            <el-option label="观看人数" value="viewers" />
            <el-option label="最新开播" value="latest" />
            <el-option label="最受欢迎" value="popular" />
          </el-select>
        </div>
      </div>
      
      <div class="live-grid">
        <div 
          v-for="live in filteredLives" 
          :key="live.id"
          class="live-item"
          @click="enterLive(live)"
        >
          <div class="live-preview">
            <el-image :src="live.cover" class="cover-image" />
            <div class="live-overlay">
              <div class="live-status">
                <span class="status-dot"></span>
                <span class="viewer-count">{{ live.viewerCount }}人观看</span>
              </div>
              <div class="live-title">{{ live.title }}</div>
            </div>
            <div class="live-actions">
              <el-button size="small" type="primary" plain @click.stop="followStreamer()">
                <el-icon><Star /></el-icon>
              </el-button>
              <el-button size="small" type="danger" plain @click.stop="shareLive()">
                <el-icon><Share /></el-icon>
              </el-button>
            </div>
          </div>
          <div class="streamer-info">
            <el-avatar :src="live.streamerAvatar" :size="40" />
            <div class="streamer-details">
              <div class="streamer-name">{{ live.streamerName }}</div>
              <div class="live-category">{{ live.category }}</div>
            </div>
            <div class="live-meta">
              <span class="live-duration">{{ live.duration }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 开始直播按钮 -->
    <div class="floating-action">
      <el-button 
        type="danger" 
        size="large" 
        round 
        class="start-live-btn"
        @click="startLive"
      >
        <el-icon><VideoCamera /></el-icon>
        开始直播
      </el-button>
    </div>

    <!-- 开始直播对话框 -->
    <el-dialog v-model="showStartLiveDialog" title="开始直播" width="90%">
      <div class="start-live-content">
        <div class="live-settings">
          <el-form :model="liveForm" label-width="80px">
            <el-form-item label="直播标题">
              <el-input v-model="liveForm.title" placeholder="请输入直播标题" />
            </el-form-item>
            <el-form-item label="直播分类">
              <el-select v-model="liveForm.category" placeholder="选择分类">
                <el-option 
                  v-for="category in categories" 
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="直播封面">
              <el-upload
                class="cover-uploader"
                action="#"
                :show-file-list="false"
                :on-success="handleCoverSuccess"
                :before-upload="beforeCoverUpload"
              >
                <el-image v-if="liveForm.cover" :src="liveForm.cover" class="cover-preview" />
                <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="直播描述">
              <el-input 
                v-model="liveForm.description" 
                type="textarea" 
                :rows="3"
                placeholder="介绍一下你的直播内容"
              />
            </el-form-item>
          </el-form>
        </div>
        
        <div class="live-tips">
          <h4>直播小贴士</h4>
          <ul>
            <li>保持网络稳定，确保直播流畅</li>
            <li>与观众互动，提高直播质量</li>
            <li>遵守平台规则，营造良好氛围</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <el-button @click="showStartLiveDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmStartLive">开始直播</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { 
  VideoCamera,
  Star,
  Share,
  Plus,
  Refresh,
  Microphone,
  ChatDotRound,
  Trophy
} from '@element-plus/icons-vue'

const userStore = useUserStore()

interface LiveItem {
  id: string
  title: string
  cover: string
  streamerName: string
  streamerAvatar: string
  streamerLevel?: string
  category: string
  viewerCount: number
  duration: string
  followers?: string
  isFeatured?: boolean
  isFollowed?: boolean
  quality?: string
  tags?: string[]
}

interface Category {
  id: string
  name: string
  icon?: string
  count: number
}

// 响应式数据
const activeCategory = ref('all')
const sortBy = ref('viewers')
const showStartLiveDialog = ref(false)
const activeMode = ref('voice')

// 直播模式
const liveModes = ref([
  { id: 'voice', label: '语音', icon: '🎤' },
  { id: 'video', label: '视频', icon: '📹' },
  { id: 'game', label: '游戏', icon: '🎮' },
  { id: 'music', label: '音乐', icon: '🎵' }
])

// 统计数据
const totalLives = ref(156)
const totalViewers = ref(2834)
const voiceLives = ref(89)

// 直播表单
const liveForm = ref({
  title: '',
  category: '',
  cover: '',
  description: ''
})

// 分类数据
const categories = ref<Category[]>([
  { id: 'all', name: '全部', count: 0 },
  { id: 'talent', name: '才艺', icon: 'Star', count: 12 },
  { id: 'life', name: '生活', icon: 'HomeFilled', count: 8 },
  { id: 'game', name: '游戏', icon: 'Trophy', count: 15 },
  { id: 'music', name: '音乐', icon: 'Headphone', count: 6 },
  { id: 'sports', name: '运动', icon: 'Basketball', count: 4 }
])

// 直播列表数据 - 参考赫兹的直播体验
const liveList = ref<LiveItem[]>([
  {
    id: '1',
    title: '今天给大家唱首歌~',
    cover: 'https://picsum.photos/300/200?random=301',
    streamerName: '小美',
    streamerAvatar: 'https://picsum.photos/100/100?random=1',
    streamerLevel: 'Lv.8',
    category: '才艺表演',
    viewerCount: 1256,
    duration: '2小时30分',
    followers: '2.3万',
    isFeatured: true,
    isFollowed: false,
    quality: 'HD',
    tags: ['音乐', '才艺', '热门']
  },
  {
    id: '2',
    title: '王者荣耀上分之旅',
    cover: 'https://picsum.photos/300/200?random=302',
    streamerName: '游戏达人',
    streamerAvatar: 'https://picsum.photos/100/100?random=2',
    streamerLevel: 'Lv.12',
    category: '游戏直播',
    viewerCount: 892,
    duration: '1小时45分',
    followers: '5.6万',
    isFeatured: true,
    isFollowed: true,
    quality: '4K',
    tags: ['游戏', '王者荣耀', '上分']
  },
  {
    id: '3',
    title: '日常vlog分享',
    cover: 'https://picsum.photos/300/200?random=303',
    streamerName: '生活博主',
    streamerAvatar: 'https://picsum.photos/100/100?random=3',
    streamerLevel: 'Lv.6',
    category: '生活分享',
    viewerCount: 567,
    duration: '3小时15分',
    followers: '1.8万',
    isFeatured: false,
    isFollowed: false,
    quality: 'HD',
    tags: ['生活', 'vlog', '日常']
  },
  {
    id: '4',
    title: '健身打卡第100天',
    cover: 'https://picsum.photos/300/200?random=304',
    streamerName: '健身教练',
    streamerAvatar: 'https://picsum.photos/100/100?random=4',
    streamerLevel: 'Lv.10',
    category: '运动健身',
    viewerCount: 423,
    duration: '1小时20分',
    followers: '3.2万',
    isFeatured: false,
    isFollowed: false,
    quality: 'HD',
    tags: ['健身', '运动', '打卡']
  },
  {
    id: '5',
    title: '美食制作教程',
    cover: 'https://picsum.photos/300/200?random=305',
    streamerName: '美食达人',
    streamerAvatar: 'https://picsum.photos/100/100?random=5',
    streamerLevel: 'Lv.7',
    category: '美食制作',
    viewerCount: 789,
    duration: '2小时10分',
    followers: '4.1万',
    isFeatured: false,
    isFollowed: true,
    quality: 'HD',
    tags: ['美食', '教程', '烹饪']
  },
  {
    id: '6',
    title: '深夜聊天室',
    cover: 'https://picsum.photos/300/200?random=306',
    streamerName: '夜猫子',
    streamerAvatar: 'https://picsum.photos/100/100?random=6',
    streamerLevel: 'Lv.5',
    category: '聊天互动',
    viewerCount: 234,
    duration: '4小时30分',
    followers: '8.9千',
    isFeatured: false,
    isFollowed: false,
    quality: 'HD',
    tags: ['聊天', '深夜', '互动']
  }
])

// 计算属性
const featuredLives = computed(() => 
  liveList.value.filter(live => live.isFeatured)
)

const filteredLives = computed(() => {
  let filtered = liveList.value.filter(live => !live.isFeatured)
  
  if (activeCategory.value !== 'all') {
    const category = categories.value.find(c => c.id === activeCategory.value)
    if (category) {
      filtered = filtered.filter(live => 
        live.category.includes(category.name)
      )
    }
  }
  
  // 排序
  switch (sortBy.value) {
    case 'viewers':
      filtered.sort((a, b) => b.viewerCount - a.viewerCount)
      break
    case 'latest':
      // 这里可以根据开播时间排序
      break
    case 'popular':
      // 这里可以根据受欢迎程度排序
      break
  }
  
  return filtered
})

// 方法
const setActiveMode = (modeId: string) => {
  activeMode.value = modeId
}

const switchCategory = (categoryId: string) => {
  activeCategory.value = categoryId
}

// 语音直播相关方法
const startVoiceLive = () => {
  ElMessage.success('开始语音直播')
  showStartLiveDialog.value = true
}

const joinVoiceRoom = () => {
  ElMessage.success('加入语音房间')
}

const startVoiceChat = () => {
  ElMessage.success('开始语音聊天')
}

const startRadioShow = () => {
  ElMessage.success('开始电台节目')
}

const startPodcast = () => {
  ElMessage.success('开始播客')
}

// 视频直播相关方法
const startVideoLive = () => {
  ElMessage.success('开始视频直播')
  showStartLiveDialog.value = true
}

const startGameLive = () => {
  ElMessage.success('开始游戏直播')
}

const startMusicLive = () => {
  ElMessage.success('开始音乐直播')
}

const startDanceLive = () => {
  ElMessage.success('开始舞蹈直播')
}

const startTalkShow = () => {
  ElMessage.success('开始脱口秀')
}

const enterLive = (live: LiveItem) => {
  ElMessage.success(`进入直播间: ${live.title}`)
  // 这里可以跳转到直播间页面
  console.log('进入直播间:', live.title)
}

const followStreamer = () => {
  ElMessage.success('关注成功')
}

const shareLive = () => {
  ElMessage.success('分享成功')
}

const startLive = () => {
  showStartLiveDialog.value = true
}

const confirmStartLive = () => {
  if (!liveForm.value.title) {
    ElMessage.error('请输入直播标题')
    return
  }
  
  ElMessage.success('直播开始！')
  showStartLiveDialog.value = false
  
  // 重置表单
  liveForm.value = {
    title: '',
    category: '',
    cover: '',
    description: ''
  }
}

const handleCoverSuccess = (_response: any, file: any) => {
  const imageUrl = URL.createObjectURL(file.raw)
  liveForm.value.cover = imageUrl
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

// 格式化观看人数
const formatViewerCount = (count: number) => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

// 刷新推荐内容
const refreshFeatured = () => {
  ElMessage.success('推荐内容已刷新')
  // 这里可以添加刷新逻辑
}

// 切换关注状态
const toggleFollow = (liveId: string) => {
  const live = liveList.value.find(l => l.id === liveId)
  if (live) {
    live.isFollowed = !live.isFollowed
    ElMessage.success(live.isFollowed ? '关注成功' : '取消关注')
  }
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.hertz-live-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
  padding-bottom: 100px;
}

/* 赫兹风格的顶部状态栏 */
.live-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.status-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-container {
  position: relative;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #67c23a;
  border: 2px solid white;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.user-stats {
  display: flex;
  gap: 8px;
}

.stat-item {
  font-size: 12px;
  color: #666;
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.live-mode-selector {
  display: flex;
  gap: 8px;
}

/* Uki风格的语音直播入口 */
.voice-live-section {
  margin: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.voice-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.voice-icon {
  position: relative;
}

.icon-placeholder {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.voice-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 600;
}

.voice-info h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.voice-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.voice-btn {
  margin-left: auto;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%);
  border: none;
  border-radius: 25px;
  padding: 8px 20px;
  font-weight: 600;
}

.voice-features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  background: rgba(255, 107, 107, 0.05);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 107, 107, 0.1);
  transform: translateY(-2px);
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.feature-icon.voice-room {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.feature-icon.voice-chat {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.feature-icon.radio {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.feature-icon.podcast {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.feature-item span {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* Uki风格的视频直播入口 */
.video-live-section {
  margin: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.video-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.video-icon {
  position: relative;
}

.video-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #667eea;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 600;
}

.video-info h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.video-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.video-btn {
  margin-left: auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 25px;
  padding: 8px 20px;
  font-weight: 600;
}

.video-features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.feature-icon.game-live {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.feature-icon.music-live {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.feature-icon.dance-live {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.feature-icon.talk-show {
  background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
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

/* 直播分类标签 */
.live-categories {
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

/* 热门推荐直播间 */
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

.section-header .section-actions {
  display: flex;
  gap: 8px;
}

.featured-lives {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.featured-item {
  min-width: 300px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.featured-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
}

.featured-preview {
  position: relative;
  overflow: hidden;
}

/* 直播列表 */
.live-list {
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

.live-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.live-item {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.live-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.live-preview {
  position: relative;
}

.cover-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.live-overlay {
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

.live-status {
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
  background: #ef4444;
  border-radius: 50%;
  margin-right: 6px;
  animation: pulse 1s infinite;
}

.viewer-count {
  font-weight: 500;
}

.live-title {
  color: white;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  margin-bottom: 8px;
}

.live-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.live-tags .tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.live-tags .hot-tag {
  background: rgba(255, 87, 34, 0.8);
  color: white;
}

.live-tags .quality-tag {
  background: rgba(76, 175, 80, 0.8);
  color: white;
}

.live-actions-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.featured-item:hover .live-actions-overlay {
  opacity: 1;
}

.live-actions-overlay .el-button {
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  backdrop-filter: blur(10px);
}

.live-actions-overlay .el-button:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.live-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.live-item:hover .live-actions {
  opacity: 1;
}

.live-actions .el-button {
  padding: 6px;
  min-height: auto;
  border-radius: 50%;
}

.streamer-info {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 16px;
}

.avatar-wrapper {
  position: relative;
}

.avatar-wrapper .streamer-level {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  border: 2px solid white;
}

.streamer-details {
  flex: 1;
}

.streamer-name {
  font-weight: 600;
  color: #333;
  font-size: 16px;
  margin-bottom: 4px;
}

.streamer-stats {
  display: flex;
  gap: 12px;
  align-items: center;
}

.streamer-stats .followers {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.streamer-stats .live-category {
  font-size: 12px;
  color: #999;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
}

.live-meta {
  text-align: right;
}

.live-duration {
  font-size: 12px;
  color: #999;
}

.follow-btn {
  margin-left: auto;
}

/* 开始直播按钮 */
.floating-action {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.start-live-btn {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
}

/* 开始直播对话框 */
.start-live-content {
  padding: 20px 0;
}

.live-settings {
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

.live-tips {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
}

.live-tips h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.live-tips ul {
  margin: 0;
  padding-left: 20px;
}

.live-tips li {
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
  
  .nav-left span, .nav-right span {
    display: none;
  }
  
  .live-categories {
    padding: 12px;
  }
  
  .category-tabs {
    gap: 8px;
  }
  
  .tab-item {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .featured-section, .live-list {
    padding: 0 12px;
  }
  
  .featured-item {
    min-width: 240px;
  }
  
  .live-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .cover-image {
    height: 160px;
  }
  
  .start-live-btn {
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

