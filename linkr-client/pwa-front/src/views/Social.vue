<template>
  <div class="soul-social-page">
    <!-- Soul风格的顶部状态栏 -->
    <div class="social-status-bar">
      <div class="status-info">
        <div class="user-avatar-container">
          <el-avatar :src="userStore.profile?.avatar || 'https://picsum.photos/200/200?random=999'" :size="40" />
          <div class="online-indicator"></div>
        </div>
        <div class="user-stats">
          <span class="stat-item">💎{{ userStore.profile?.points || 1250 }}</span>
          <span class="stat-item">📝{{ userPosts }}</span>
          <span class="stat-item">Lv.{{ userStore.profile?.level || 5 }}</span>
        </div>
      </div>
      <div class="social-mode-selector">
        <el-button 
          v-for="mode in socialModes" 
          :key="mode.id"
          :type="activeMode === mode.id ? 'primary' : 'default'"
          size="small"
          @click="setActiveMode(mode.id)"
        >
          {{ mode.icon }} {{ mode.label }}
        </el-button>
      </div>
    </div>

    <!-- Soul风格的匿名发布区域 -->
    <div class="soul-publish-section">
      <div class="publish-header">
        <div class="anonymous-avatar">
          <div class="avatar-placeholder">
            <span>{{ getAnonymousAvatar() }}</span>
          </div>
          <div class="anonymous-badge">匿名</div>
        </div>
        <div class="publish-input" @click="showPublishDialog = true">
          <span>{{ getPublishPlaceholder() }}</span>
        </div>
        <el-button 
          type="primary" 
          size="small" 
          @click="showPublishDialog = true"
          class="publish-btn"
        >
          <el-icon><Edit /></el-icon>
          发布
        </el-button>
      </div>
      <div class="publish-actions">
        <div class="action-btn" @click="selectPhotos">
          <div class="action-icon photo">
            <el-icon><Picture /></el-icon>
          </div>
          <span>图片</span>
        </div>
        <div class="action-btn" @click="selectTopic">
          <div class="action-icon topic">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <span>话题</span>
        </div>
        <div class="action-btn" @click="selectLocation">
          <div class="action-icon location">
            <el-icon><Location /></el-icon>
          </div>
          <span>位置</span>
        </div>
        <div class="action-btn" @click="mentionFriends">
          <div class="action-icon mention">
            <el-icon><User /></el-icon>
          </div>
          <span>@好友</span>
        </div>
        <div class="action-btn" @click="recordVoice">
          <div class="action-icon voice">
            <el-icon><Microphone /></el-icon>
          </div>
          <span>语音</span>
        </div>
      </div>
    </div>

    <!-- 功能标签 -->
    <div class="function-tags">
      <div class="tag-list">
        <div 
          v-for="tag in functionTags" 
          :key="tag.name"
          class="tag-item"
          :class="{ active: activeTag === tag.name }"
          @click="setActiveTag(tag.name)"
        >
          {{ tag.label }}
        </div>
      </div>
    </div>

    <!-- Soul风格的动态广场 -->
    <div class="soul-feed-container">
      <div v-for="post in posts" :key="post.id" class="soul-post-card">
        <div class="post-header">
          <div class="anonymous-user">
            <div class="anonymous-avatar-small">
              <span>{{ getAnonymousAvatar(post.user.id) }}</span>
            </div>
            <div class="user-info">
              <span class="anonymous-name">{{ post.user.anonymousName || '匿名用户' }}</span>
              <span class="post-status" v-if="post.status">{{ post.status }}</span>
            </div>
          </div>
          <div class="post-meta">
            <span class="post-time">{{ post.time }}</span>
            <el-button size="small" text @click="showPostOptions(post)">
              <el-icon><MoreFilled /></el-icon>
            </el-button>
          </div>
        </div>
        
        <div class="post-content">
          <p class="post-text">{{ post.content }}</p>
          
          <!-- 图片展示 -->
          <div v-if="post.images" class="post-images-grid">
            <div 
              v-for="(image, index) in post.images" 
              :key="index" 
              class="image-item"
              :class="{ 'single': post.images.length === 1, 'multiple': post.images.length > 1 }"
              @click="previewImage(image)"
            >
              <img :src="image" :alt="`图片${index + 1}`" />
              <div v-if="post.images.length > 1 && index === 2" class="more-images">
                +{{ post.images.length - 2 }}
              </div>
            </div>
          </div>
          
          <!-- 语音消息 -->
          <div v-if="post.voice" class="voice-message">
            <div class="voice-player" @click="playVoice(post.voice)">
              <div class="voice-waveform">
                <div class="wave-bar" v-for="i in 20" :key="i" :style="{ height: Math.random() * 20 + 10 + 'px' }"></div>
              </div>
              <div class="voice-controls">
                <el-icon v-if="!post.voice.isPlaying"><VideoPlay /></el-icon>
                <el-icon v-else><VideoPause /></el-icon>
                <span>{{ post.voice.duration }}s</span>
              </div>
            </div>
          </div>
          
          <!-- 音乐卡片 -->
          <div v-if="post.music" class="music-card">
            <div class="music-cover">
              <img :src="post.music.cover" :alt="post.music.title" />
              <div class="play-overlay" @click="playMusic(post.music)">
                <el-icon><VideoPlay /></el-icon>
              </div>
            </div>
            <div class="music-info">
              <h4>{{ post.music.title }}</h4>
              <p>{{ post.music.artist }}</p>
            </div>
          </div>
          
          <!-- 位置信息 -->
          <div v-if="post.location" class="location-card">
            <el-icon><Location /></el-icon>
            <span>{{ post.location }}</span>
          </div>
          
          <!-- 话题标签 -->
          <div v-if="post.topics" class="topic-tags">
            <span 
              v-for="topic in post.topics" 
              :key="topic" 
              class="topic-tag"
              @click="searchTopic(topic)"
            >
              #{{ topic }}
            </span>
          </div>
        </div>
        
        <div class="post-actions">
          <div class="action-item" @click="toggleLike(post)">
            <div class="action-icon" :class="{ 'liked': post.isLiked }">
              <el-icon>
                <component :is="post.isLiked ? 'StarFilled' : 'Star'" />
              </el-icon>
            </div>
            <span>{{ post.likeCount }}</span>
          </div>
          <div class="action-item" @click="showComments(post)">
            <div class="action-icon">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <span>{{ post.commentCount }}</span>
          </div>
          <div class="action-item" @click="sharePost(post)">
            <div class="action-icon">
              <el-icon><Share /></el-icon>
            </div>
            <span>{{ post.shareCount }}</span>
          </div>
          <div class="action-item" @click="collectPost(post)">
            <div class="action-icon" :class="{ 'collected': post.isCollected }">
              <el-icon>
                <component :is="post.isCollected ? 'CollectionFilled' : 'Collection'" />
              </el-icon>
            </div>
            <span>{{ post.collectCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 发布对话框 -->
    <el-dialog v-model="showPublishDialog" title="发布动态" width="90%">
      <div class="publish-dialog">
        <div class="publish-content">
          <el-input
            v-model="publishContent"
            type="textarea"
            placeholder="分享你的想法..."
            :rows="4"
            maxlength="500"
            show-word-limit
          />
        </div>
        <div class="publish-media">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            @change="handleImageUpload"
          >
            <el-button type="primary" plain>
              <el-icon><Picture /></el-icon>
              添加图片
            </el-button>
          </el-upload>
          <el-button type="primary" plain>
            <el-icon><VideoCamera /></el-icon>
            添加视频
          </el-button>
          <el-button type="primary" plain>
            <el-icon><Location /></el-icon>
            添加位置
          </el-button>
        </div>
        <div class="publish-settings">
          <el-radio-group v-model="publishVisibility">
            <el-radio value="public">公开</el-radio>
            <el-radio value="friends">好友可见</el-radio>
            <el-radio value="private">仅自己可见</el-radio>
          </el-radio-group>
        </div>
      </div>
      <template #footer>
        <el-button @click="showPublishDialog = false">取消</el-button>
        <el-button type="primary" @click="publishPost">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import { 
  ChatDotRound, 
  Picture, 
  Location, 
  User,
  VideoPlay,
  VideoPause,
  Share,
  Clock,
  Edit,
  Microphone,
  MoreFilled,
  Collection,
  CollectionFilled
} from '@element-plus/icons-vue'

const userStore = useUserStore()

// 响应式数据
const activeTag = ref('all')
const activeMode = ref('anonymous')
const showPublishDialog = ref(false)
const publishContent = ref('')
const publishVisibility = ref('public')

// 社交模式
const socialModes = ref([
  { id: 'anonymous', label: '匿名', icon: '👤' },
  { id: 'real', label: '实名', icon: '👥' },
  { id: 'nearby', label: '附近', icon: '📍' },
  { id: 'hot', label: '热门', icon: '🔥' }
])

// 计算属性
const userPosts = computed(() => (userStore.profile as any)?.posts || 89)

// 功能标签配置
const functionTags = [
  { name: 'all', label: '全部' },
  { name: 'match', label: '匹配' },
  { name: 'chat', label: '聊天' },
  { name: 'live', label: '直播' },
  { name: 'video', label: '视频' }
]

// 动态数据
const posts = ref([
  {
    id: 1,
    user: { 
      id: 1,
      name: '小美', 
      avatar: 'https://picsum.photos/200/200?random=1',
      anonymousName: '匿名用户001'
    },
    content: '今天天气真好呢~ 心情也变得格外美丽 ✨',
    time: '2小时前',
    status: '💕匹配成功',
    location: null,
    images: ['https://picsum.photos/300/200?random=11'],
    music: { 
      title: '夜曲', 
      artist: '周杰伦',
      cover: 'https://picsum.photos/100/100?random=21'
    },
    voice: null,
    topics: ['心情', '天气'],
    likeCount: 12,
    commentCount: 5,
    shareCount: 3,
    collectCount: 2,
    isLiked: false,
    isCollected: false
  },
  {
    id: 2,
    user: { 
      id: 2,
      name: '魔术师小王', 
      avatar: 'https://picsum.photos/200/200?random=2',
      anonymousName: '匿名用户002'
    },
    content: '今天给大家表演一个魔术~ 猜猜我是怎么做到的？',
    time: '4小时前',
    status: '🎬短视频推荐',
    location: null,
    images: ['https://picsum.photos/300/200?random=12'],
    music: null,
    voice: {
      duration: 15,
      isPlaying: false,
      url: 'voice_url_1'
    },
    topics: ['魔术', '表演'],
    likeCount: 892,
    commentCount: 156,
    shareCount: 45,
    collectCount: 78,
    isLiked: true,
    isCollected: false
  },
  {
    id: 3,
    user: { 
      id: 3,
      name: '旅行达人', 
      avatar: 'https://picsum.photos/200/200?random=3',
      anonymousName: '匿名用户003'
    },
    content: '分享一张美丽的风景照 📸 这里真的太美了！',
    time: '6小时前',
    status: null,
    location: '北京·故宫',
    images: [
      'https://picsum.photos/300/200?random=13', 
      'https://picsum.photos/300/200?random=14',
      'https://picsum.photos/300/200?random=15'
    ],
    music: null,
    voice: null,
    topics: ['旅行', '风景', '摄影'],
    likeCount: 28,
    commentCount: 15,
    shareCount: 8,
    collectCount: 12,
    isLiked: false,
    isCollected: true
  }
])

// 方法
const setActiveTag = (tagName: string) => {
  activeTag.value = tagName
  console.log('切换标签:', tagName)
  // 这里可以添加标签切换逻辑
}

const setActiveMode = (modeId: string) => {
  activeMode.value = modeId
  console.log('切换社交模式:', modeId)
}

const getAnonymousAvatar = (userId?: number) => {
  const avatars = ['👤', '🎭', '🎪', '🎨', '🎯', '🎲', '🎸', '🎺']
  if (userId) {
    return avatars[userId % avatars.length]
  }
  return avatars[Math.floor(Math.random() * avatars.length)]
}

const getPublishPlaceholder = () => {
  const placeholders = [
    '分享你的想法...',
    '今天发生了什么有趣的事？',
    '有什么想说的吗？',
    '记录这一刻的美好...',
    '匿名分享你的心情...'
  ]
  return placeholders[Math.floor(Math.random() * placeholders.length)]
}

const toggleLike = (post: any) => {
  post.isLiked = !post.isLiked
  post.likeCount += post.isLiked ? 1 : -1
}

const showComments = (post: any) => {
  console.log('显示评论:', post.id)
  // 这里可以添加显示评论逻辑
}

const sharePost = (post: any) => {
  post.shareCount += 1
  ElMessage.success('分享成功')
}

const handleImageUpload = (file: any) => {
  console.log('上传图片:', file)
}

const publishPost = () => {
  if (!publishContent.value.trim()) {
    ElMessage.warning('请输入内容')
    return
  }
  
  // 添加新动态
  const newPost = {
    id: Date.now(),
    user: { 
      name: (userStore.profile as any)?.nickname || '我', 
      avatar: (userStore.profile as any)?.avatar || 'https://picsum.photos/200/200?random=999'
    },
    content: publishContent.value,
    time: '刚刚',
    status: null,
    location: null,
    images: null,
    music: null,
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    isLiked: false
  }
  
  posts.value.unshift(newPost as any)
  publishContent.value = ''
  showPublishDialog.value = false
  ElMessage.success('发布成功')
}

const previewImage = (image: string) => {
  console.log('预览图片:', image)
  // 这里可以添加图片预览逻辑
}

// 新的发布功能方法
const selectPhotos = () => {
  ElMessage.info('选择图片功能开发中...')
}

const selectTopic = () => {
  ElMessage.info('选择话题功能开发中...')
}

const selectLocation = () => {
  ElMessage.info('选择位置功能开发中...')
}

const mentionFriends = () => {
  ElMessage.info('@好友功能开发中...')
}

const recordVoice = () => {
  ElMessage.info('语音录制功能开发中...')
}

const showPostOptions = (post: any) => {
  ElMessage.info('动态选项功能开发中...')
}

const playVoice = (voice: any) => {
  voice.isPlaying = !voice.isPlaying
  ElMessage.info(voice.isPlaying ? '开始播放语音' : '暂停播放语音')
}

const playMusic = (music: any) => {
  ElMessage.info(`播放音乐: ${music.title}`)
}

const collectPost = (post: any) => {
  post.isCollected = !post.isCollected
  post.collectCount += post.isCollected ? 1 : -1
  ElMessage.success(post.isCollected ? '已收藏' : '已取消收藏')
}

const searchTopic = (topic: string) => {
  ElMessage.info(`搜索话题: #${topic}`)
}
</script>

<style lang="scss" scoped>
.soul-social-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 16px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
    pointer-events: none;
  }
}

// Soul风格的顶部状态栏
.social-status-bar {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 16px 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;

  .status-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;

    .user-avatar-container {
      position: relative;

      .online-indicator {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        background: #10b981;
        border: 2px solid white;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
    }

    .user-stats {
      display: flex;
      gap: 12px;
      flex: 1;

      .stat-item {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
  }

  .social-mode-selector {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    .el-button {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 16px;
      backdrop-filter: blur(10px);

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      &.el-button--primary {
        background: rgba(255, 255, 255, 0.9);
        color: #667eea;
        border: none;
      }
    }
  }
}

// Soul风格的匿名发布区域
.soul-publish-section {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;

  .publish-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .anonymous-avatar {
      position: relative;

      .avatar-placeholder {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
      }

      .anonymous-badge {
        position: absolute;
        top: -2px;
        right: -2px;
        background: #10b981;
        color: white;
        font-size: 10px;
        padding: 2px 4px;
        border-radius: 8px;
        border: 1px solid white;
      }
    }

    .publish-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
      }

      span {
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
      }
    }

    .publish-btn {
      background: rgba(255, 255, 255, 0.9);
      color: #667eea;
      border: none;
      border-radius: 16px;
      padding: 8px 16px;
      font-weight: 600;
      backdrop-filter: blur(10px);

      &:hover {
        background: white;
        transform: translateY(-2px);
      }
    }
  }

  .publish-actions {
    display: flex;
    gap: 16px;
    justify-content: space-around;

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 12px 8px;
      border-radius: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      flex: 1;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      &:active {
        transform: scale(0.95);
      }

      .action-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        &.photo {
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
        }

        &.topic {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        &.location {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        &.mention {
          background: rgba(168, 85, 247, 0.2);
          color: #a855f7;
        }

        &.voice {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .el-icon {
          font-size: 16px;
        }
      }

      span {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
      }

      &:hover .action-icon {
        transform: scale(1.1);
      }

      &:hover span {
        color: white;
      }
    }
  }
}

/* 现代化发布动态区域 */
.modern-publish-section {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border-primary);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
}

.publish-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  .publish-input {
    flex: 1;
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid var(--border-tertiary);

    &:hover {
      background: var(--bg-tertiary);
      border-color: var(--border-secondary);
    }

    span {
      color: var(--text-secondary);
      font-size: 14px;
    }
  }
}

.publish-actions {
  display: flex;
  gap: 20px;
  justify-content: space-around;

  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    border-radius: var(--radius-md);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    flex: 1;

    &:hover {
      background: var(--bg-tertiary);
      transform: translateY(-2px);
    }

    &:active {
      transform: scale(0.95);
    }

    .el-icon {
      color: var(--text-secondary);
      font-size: 20px;
      transition: all 0.3s ease;
    }

    span {
      font-size: 12px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    &:hover .el-icon {
      color: var(--primary-color);
      transform: scale(1.1);
    }

    &:hover span {
      color: var(--primary-color);
    }
  }
}

/* 功能标签 */
.function-tags {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--border-secondary);
}

.tag-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.tag-list::-webkit-scrollbar {
  height: 4px;
}

.tag-list::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 2px;
}

.tag-list::-webkit-scrollbar-thumb {
  background: var(--border-primary);
  border-radius: 2px;
}

.tag-item {
  padding: 8px 16px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  border: 1px solid var(--border-tertiary);
}

.tag-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.tag-item.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

// Soul风格的动态广场
.soul-feed-container {
  position: relative;
  z-index: 2;

  .soul-post-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 24px;
    margin-bottom: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      border-color: rgba(102, 126, 234, 0.3);
    }

    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;

      .anonymous-user {
        display: flex;
        align-items: center;
        gap: 12px;

        .anonymous-avatar-small {
          width: 40px;
          height: 40px;
          background: rgba(102, 126, 234, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          border: 2px solid rgba(102, 126, 234, 0.3);
        }

        .user-info {
          .anonymous-name {
            display: block;
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
            font-size: 14px;
          }

          .post-status {
            font-size: 12px;
            color: #10b981;
            font-weight: 500;
          }
        }
      }

      .post-meta {
        display: flex;
        align-items: center;
        gap: 8px;

        .post-time {
          font-size: 12px;
          color: #666;
        }
      }
    }

    .post-content {
      margin-bottom: 16px;

      .post-text {
        margin: 0 0 16px 0;
        line-height: 1.6;
        color: #333;
        font-size: 14px;
      }

      .post-images-grid {
        display: grid;
        gap: 8px;
        margin-bottom: 16px;

        &.single {
          grid-template-columns: 1fr;
        }

        &.multiple {
          grid-template-columns: repeat(3, 1fr);
        }

        .image-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            transform: scale(1.02);
          }

          img {
            width: 100%;
            height: 120px;
            object-fit: cover;
          }

          .more-images {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 600;
          }
        }
      }

      .voice-message {
        margin-bottom: 16px;

        .voice-player {
          background: rgba(102, 126, 234, 0.1);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(102, 126, 234, 0.15);
          }

          .voice-waveform {
            display: flex;
            align-items: center;
            gap: 2px;
            flex: 1;

            .wave-bar {
              width: 3px;
              background: #667eea;
              border-radius: 2px;
              transition: all 0.3s ease;
            }
          }

          .voice-controls {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #667eea;
            font-size: 14px;
            font-weight: 600;
          }
        }
      }

      .music-card {
        background: rgba(102, 126, 234, 0.1);
        border-radius: 16px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(102, 126, 234, 0.15);
        }

        .music-cover {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 12px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .play-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          &:hover .play-overlay {
            opacity: 1;
          }
        }

        .music-info {
          flex: 1;

          h4 {
            margin: 0 0 4px 0;
            font-size: 14px;
            font-weight: 600;
            color: #333;
          }

          p {
            margin: 0;
            font-size: 12px;
            color: #666;
          }
        }
      }

      .location-card {
        background: rgba(59, 130, 246, 0.1);
        border-radius: 12px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        color: #3b82f6;
        font-size: 14px;
        font-weight: 500;
      }

      .topic-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 16px;

        .topic-tag {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(102, 126, 234, 0.2);
            transform: translateY(-1px);
          }
        }
      }
    }

    .post-actions {
      display: flex;
      gap: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);

      .action-item {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #666;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 13px;
        padding: 8px 12px;
        border-radius: 12px;

        &:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          transform: scale(1.05);
        }

        &:active {
          transform: scale(0.95);
        }

        .action-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;

          .el-icon {
            font-size: 16px;
          }

          &.liked {
            background: rgba(255, 107, 107, 0.2);
            color: #ff6b6b;
            
            .el-icon {
              animation: bounce 0.6s ease;
            }
          }

          &.collected {
            background: rgba(245, 158, 11, 0.2);
            color: #f59e0b;
          }
        }
      }
    }
  }
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-info {
  flex: 1;
}

.username {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  font-size: 14px;
}

.post-status {
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 500;
}

.post-content {
  margin-bottom: 16px;
}

.post-content p {
  margin: 0 0 12px 0;
  line-height: 1.6;
  color: var(--text-primary);
  font-size: 14px;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.post-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-image:hover {
  transform: scale(1.02);
}

.music-card, .location-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.music-card .el-icon, .location-card .el-icon {
  color: var(--text-secondary);
}

.music-card span, .location-card span {
  color: var(--text-secondary);
  font-size: 14px;
}

.post-actions {
  display: flex;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border-tertiary);
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 13px;
  padding: 8px 12px;
  border-radius: var(--radius-md);

  &:hover {
    color: var(--primary-color);
    background: var(--bg-tertiary);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  .el-icon {
    font-size: 18px;
    transition: all 0.3s ease;
  }

  &.liked {
    color: #f56c6c;
    
    .el-icon {
      animation: bounce 0.6s ease;
    }
  }
}

/* 发布对话框 */
.publish-dialog {
  padding: 16px 0;
}

.publish-content {
  margin-bottom: 16px;
}

.publish-media {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.publish-settings {
  border-top: 1px solid var(--border-tertiary);
  padding-top: 16px;
}

// 动画效果
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .soul-social-page {
    padding: 12px;
  }

  .social-status-bar {
    padding: 12px 16px;
    margin-bottom: 16px;

    .status-info {
      gap: 12px;
      margin-bottom: 8px;

      .user-stats {
        gap: 8px;

        .stat-item {
          padding: 3px 6px;
          font-size: 11px;
        }
      }
    }

    .social-mode-selector {
      gap: 6px;

      .el-button {
        font-size: 11px;
        padding: 4px 8px;
      }
    }
  }

  .soul-publish-section {
    padding: 16px;
    margin-bottom: 16px;

    .publish-header {
      gap: 8px;
      margin-bottom: 12px;

      .anonymous-avatar {
        .avatar-placeholder {
          width: 32px;
          height: 32px;
          font-size: 16px;
        }

        .anonymous-badge {
          font-size: 8px;
          padding: 1px 3px;
        }
      }

      .publish-input {
        padding: 8px 12px;

        span {
          font-size: 12px;
        }
      }

      .publish-btn {
        padding: 6px 12px;
        font-size: 12px;
      }
    }

    .publish-actions {
      gap: 12px;

      .action-btn {
        padding: 8px 4px;

        .action-icon {
          width: 28px;
          height: 28px;

          .el-icon {
            font-size: 14px;
          }
        }

        span {
          font-size: 11px;
        }
      }
    }
  }

  .soul-feed-container {
    .soul-post-card {
      padding: 16px;
      margin-bottom: 16px;

      .post-header {
        margin-bottom: 12px;

        .anonymous-user {
          gap: 8px;

          .anonymous-avatar-small {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

          .user-info {
            .anonymous-name {
              font-size: 13px;
            }

            .post-status {
              font-size: 11px;
            }
          }
        }

        .post-meta {
          .post-time {
            font-size: 11px;
          }
        }
      }

      .post-content {
        margin-bottom: 12px;

        .post-text {
          font-size: 13px;
          margin-bottom: 12px;
        }

        .post-images-grid {
          gap: 6px;
          margin-bottom: 12px;

          .image-item {
            img {
              height: 100px;
            }

            .more-images {
              font-size: 14px;
            }
          }
        }

        .voice-message {
          margin-bottom: 12px;

          .voice-player {
            padding: 12px;
            gap: 12px;

            .voice-controls {
              font-size: 12px;
            }
          }
        }

        .music-card {
          padding: 12px;
          gap: 12px;
          margin-bottom: 12px;

          .music-cover {
            width: 50px;
            height: 50px;
          }

          .music-info {
            h4 {
              font-size: 13px;
            }

            p {
              font-size: 11px;
            }
          }
        }

        .location-card {
          padding: 8px 12px;
          font-size: 12px;
          margin-bottom: 12px;
        }

        .topic-tags {
          gap: 6px;
          margin-bottom: 12px;

          .topic-tag {
            padding: 3px 8px;
            font-size: 11px;
          }
        }
      }

      .post-actions {
        gap: 16px;
        padding-top: 12px;

        .action-item {
          font-size: 12px;
          padding: 6px 8px;

          .action-icon {
            width: 20px;
            height: 20px;

            .el-icon {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .soul-publish-section {
    .publish-actions {
      .action-btn {
        span {
          display: none;
        }
      }
    }
  }

  .soul-feed-container {
    .soul-post-card {
      .post-content {
        .post-images-grid {
          &.multiple {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      }

      .post-actions {
        gap: 12px;

        .action-item {
          font-size: 11px;
          padding: 4px 6px;
        }
      }
    }
  }
}
</style>

