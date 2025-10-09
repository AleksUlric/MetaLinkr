<template>
  <div class="soul-square-page">
    <!-- Soul风格顶部导航 -->
    <div class="soul-nav-bar">
      <div class="nav-left">
        <div class="time-info">
          <span class="time">{{ currentTime }}</span>
          <span class="date">{{ currentDate }}</span>
        </div>
      </div>
      <div class="nav-center">
        <div class="nav-tabs">
          <div 
            v-for="tab in navTabs" 
            :key="tab.key"
            class="tab-item"
            :class="{ active: activeTab === tab.key }"
            @click="switchTab(tab.key)"
          >
            {{ tab.label }}
            <div v-if="tab.key === 'follow'" class="tab-dot"></div>
          </div>
        </div>
      </div>
      <div class="nav-right">
        <div class="nav-icons">
          <div class="icon-btn search-btn" @click="showSearch">
            <el-icon><Search /></el-icon>
          </div>
          <div class="icon-btn music-btn" @click="showMusic">
            <el-icon><Microphone /></el-icon>
            <div class="notification-dot"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Soul风格动态流 -->
    <div class="soul-feed">
      <div 
        v-for="post in posts" 
        :key="post.id"
        class="post-card"
        @click="viewPost(post)"
      >
        <!-- 用户信息 -->
        <div class="post-header">
          <div class="user-info">
            <div class="user-avatar">
              <img :src="post.user.avatar" :alt="post.user.name" />
              <div class="user-level">{{ post.user.level }}</div>
            </div>
            <div class="user-details">
              <div class="user-name">{{ post.user.name }}</div>
              <div class="user-tags">
                <span 
                  v-for="tag in post.user.tags" 
                  :key="tag" 
                  class="tag"
                >{{ tag }}</span>
              </div>
            </div>
          </div>
          <div class="post-actions">
            <div class="follow-btn" @click.stop="followUser(post.user)">
              <el-button size="small" type="primary" round>
                关注
              </el-button>
            </div>
            <div class="more-btn" @click.stop="showMoreOptions(post)">
              <el-icon><MoreFilled /></el-icon>
            </div>
          </div>
        </div>

        <!-- 动态内容 -->
        <div class="post-content">
          <div class="post-text">{{ post.content }}</div>
          
          <!-- 图片内容 -->
          <div v-if="post.images && post.images.length > 0" class="post-images">
            <div 
              v-for="(image, index) in post.images" 
              :key="index"
              class="image-item"
              :class="{ 'single': post.images.length === 1 }"
              @click.stop="previewImage(post.images, index)"
            >
              <img :src="image" :alt="`图片${index + 1}`" />
            </div>
          </div>

          <!-- 音乐内容 -->
          <div v-if="post.music" class="post-music">
            <div class="music-player">
              <div class="music-icon">🎵</div>
              <div class="music-info">
                <div class="music-name">{{ post.music.name }}</div>
                <div class="music-artist">{{ post.music.artist }}</div>
              </div>
              <div class="play-btn" @click.stop="playMusic(post.music)">
                <el-icon><VideoPlay /></el-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- 互动区域 -->
        <div class="post-footer">
          <div class="interaction-stats">
            <div class="stat-item" @click.stop="toggleLike(post)">
              <el-icon :class="{ liked: post.isLiked }">
                <Star />
              </el-icon>
              <span>{{ post.likes }}</span>
            </div>
            <div class="stat-item" @click.stop="showComments(post)">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ post.comments }}</span>
            </div>
            <div class="stat-item" @click.stop="sharePost(post)">
              <el-icon><Share /></el-icon>
              <span>{{ post.shares }}</span>
            </div>
          </div>
          
          <div class="post-meta">
            <div class="location" v-if="post.location">
              <el-icon><Location /></el-icon>
              <span>{{ post.location }}</span>
            </div>
            <div class="post-time">{{ post.time }}</div>
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="post.tags && post.tags.length > 0" class="post-tags">
          <span 
            v-for="tag in post.tags" 
            :key="tag" 
            class="tag"
            @click.stop="searchByTag(tag)"
          >#{{ tag }}</span>
        </div>
      </div>
    </div>

    <!-- Soul风格发布按钮 -->
    <div class="floating-post-btn" @click="createPost">
      <el-icon><Edit /></el-icon>
      <span>发布瞬间</span>
    </div>

    <!-- Soul风格底部导航占位 -->
    <div class="bottom-spacer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Search, 
  Microphone, 
  MoreFilled, 
  Star, 
  ChatDotRound, 
  Share, 
  Location, 
  VideoPlay, 
  Edit 
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const currentTime = ref('1:41')
const currentDate = ref('10月9日周四')
const activeTab = ref('recommend')

// 导航标签
const navTabs = ref([
  { key: 'follow', label: '关注' },
  { key: 'recommend', label: '推荐' },
  { key: 'nearby', label: '杭州' }
])

// 动态数据
const posts = ref([
  {
    id: 1,
    user: {
      name: '香菜',
      avatar: 'https://picsum.photos/200/200?random=1',
      level: 15,
      tags: ['高级奶', '超级星人', 'Mobby守护者', '国际超模']
    },
    content: '介意纹身勿扰。稳定下来同居。1v1',
    images: ['https://picsum.photos/300/400?random=11'],
    music: null,
    likes: 3800,
    comments: 804,
    shares: 156,
    isLiked: false,
    location: '杭州市',
    time: '2小时前',
    tags: ['交友', '恋爱', '稳定']
  },
  {
    id: 2,
    user: {
      name: '一个美女罢了',
      avatar: 'https://picsum.photos/200/200?random=2',
      level: 8,
      tags: ['匹配']
    },
    content: '🐸和今日份奇遇打个招呼吧',
    images: ['https://picsum.photos/300/200?random=12'],
    music: {
      name: '夜空中最亮的星',
      artist: '逃跑计划'
    },
    likes: 1250,
    comments: 89,
    shares: 23,
    isLiked: true,
    location: '杭州市',
    time: '4小时前',
    tags: ['奇遇', '打招呼', '交友']
  },
  {
    id: 3,
    user: {
      name: '林兰',
      avatar: 'https://picsum.photos/200/200?random=3',
      level: 22,
      tags: ['虚拟达人']
    },
    content: '今天的夕阳特别美，忍不住拍了下来',
    images: [
      'https://picsum.photos/300/200?random=13',
      'https://picsum.photos/300/200?random=14'
    ],
    music: null,
    likes: 890,
    comments: 45,
    shares: 12,
    isLiked: false,
    location: '杭州市',
    time: '6小时前',
    tags: ['摄影', '夕阳', '美景']
  },
  {
    id: 4,
    user: {
      name: 'Siren',
      avatar: 'https://picsum.photos/200/200?random=4',
      level: 12,
      tags: ['匹配']
    },
    content: '周末的午后，一杯咖啡，一本好书，这就是我想要的生活',
    images: ['https://picsum.photos/300/200?random=15'],
    music: null,
    likes: 567,
    comments: 78,
    shares: 34,
    isLiked: false,
    location: '杭州市',
    time: '8小时前',
    tags: ['生活', '读书', '咖啡']
  }
])

// 更新时间
const updateTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
  
  const month = now.getMonth() + 1
  const date = now.getDate()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[now.getDay()]
  currentDate.value = `${month}月${date}日${weekday}`
}

// 方法
const switchTab = (tabKey: string) => {
  activeTab.value = tabKey
  ElMessage.info(`切换到${navTabs.value.find(t => t.key === tabKey)?.label}`)
}

const showSearch = () => {
  ElMessage.info('搜索功能开发中...')
}

const showMusic = () => {
  ElMessage.info('音乐功能开发中...')
}

const viewPost = (post: any) => {
  router.push(`/post/${post.id}`)
}

const followUser = (user: any) => {
  ElMessage.success(`已关注 ${user.name}`)
}

const showMoreOptions = (post: any) => {
  ElMessage.info('更多选项功能开发中...')
}

const previewImage = (images: string[], index: number) => {
  ElMessage.info('图片预览功能开发中...')
}

const playMusic = (music: any) => {
  ElMessage.success(`播放音乐: ${music.name}`)
}

const toggleLike = (post: any) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
  ElMessage.success(post.isLiked ? '已点赞' : '已取消点赞')
}

const showComments = (post: any) => {
  ElMessage.info('查看评论功能开发中...')
}

const sharePost = (post: any) => {
  ElMessage.success('已分享到其他平台')
}

const searchByTag = (tag: string) => {
  ElMessage.info(`搜索标签: #${tag}`)
}

const createPost = () => {
  router.push('/post/create')
  ElMessage.success('开始创作瞬间')
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
.soul-square-page {
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
    .time-info {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .time {
        font-size: 16px;
        font-weight: 600;
        color: #333333;
      }

      .date {
        font-size: 12px;
        color: #666666;
      }
    }
  }

  .nav-center {
    .nav-tabs {
      display: flex;
      gap: 24px;

      .tab-item {
        position: relative;
        font-size: 16px;
        font-weight: 600;
        color: #666666;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 8px 0;

        &:hover {
          color: #333333;
        }

        &.active {
          color: #333333;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: #00ff88;
            border-radius: 2px;
          }
        }

        .tab-dot {
          position: absolute;
          top: 4px;
          right: -8px;
          width: 6px;
          height: 6px;
          background: #ff4757;
          border-radius: 50%;
        }
      }
    }
  }

  .nav-right {
    .nav-icons {
      display: flex;
      gap: 16px;

      .icon-btn {
        position: relative;
        width: 40px;
        height: 40px;
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

        .notification-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          background: #ff4757;
          border-radius: 50%;
          border: 2px solid #ffffff;
        }
      }
    }
  }
}

// Soul风格动态流
.soul-feed {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .post-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;

      .user-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .user-avatar {
          position: relative;

          img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
          }

          .user-level {
            position: absolute;
            bottom: -2px;
            right: -2px;
            background: linear-gradient(135deg, #ff77c6 0%, #7877c6 100%);
            color: white;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 8px;
            border: 2px solid #ffffff;
          }
        }

        .user-details {
          .user-name {
            font-size: 16px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 4px;
          }

          .user-tags {
            display: flex;
            gap: 4px;
            flex-wrap: wrap;

            .tag {
              background: #f8f9fa;
              color: #666666;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 500;
              border: 1px solid #e9ecef;
            }
          }
        }
      }

      .post-actions {
        display: flex;
        align-items: center;
        gap: 8px;

        .follow-btn {
          .el-button {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            border: none;
            color: white;
            font-weight: 600;
            font-size: 12px;
            padding: 6px 16px;
            height: 32px;

            &:hover {
              transform: scale(1.05);
            }
          }
        }

        .more-btn {
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
      }
    }

    .post-content {
      margin-bottom: 16px;

      .post-text {
        font-size: 16px;
        line-height: 1.6;
        color: #333333;
        margin-bottom: 16px;
      }

      .post-images {
        display: grid;
        gap: 8px;
        margin-bottom: 16px;

        &.single {
          grid-template-columns: 1fr;
        }

        &:not(.single) {
          grid-template-columns: repeat(2, 1fr);
        }

        .image-item {
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 1;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            transform: scale(1.02);
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }

      .post-music {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 12px;
        border: 1px solid #e9ecef;

        .music-player {
          display: flex;
          align-items: center;
          gap: 12px;

          .music-icon {
            font-size: 24px;
          }

          .music-info {
            flex: 1;

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

          .play-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            color: white;

            &:hover {
              transform: scale(1.1);
            }
          }
        }
      }
    }

    .post-footer {
      .interaction-stats {
        display: flex;
        gap: 24px;
        margin-bottom: 12px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #666666;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 4px 8px;
          border-radius: 8px;

          &:hover {
            background: #f8f9fa;
            color: #333333;
          }

          .el-icon {
            font-size: 16px;

            &.liked {
              color: #ff4757;
            }
          }

          span {
            font-size: 14px;
            font-weight: 500;
          }
        }
      }

      .post-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #999999;

        .location {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #ff4757;
        }
      }
    }

    .post-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 12px;

      .tag {
        background: #f0f8ff;
        color: #4facfe;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid #e6f3ff;

        &:hover {
          background: #e6f3ff;
          transform: scale(1.05);
        }
      }
    }
  }
}

// Soul风格发布按钮
.floating-post-btn {
  position: fixed;
  bottom: 100px;
  right: 20px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 16px 20px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.3);
  z-index: 1000;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(79, 172, 254, 0.4);
  }

  .el-icon {
    font-size: 18px;
  }

  span {
    font-size: 14px;
    font-weight: 600;
  }
}

// 底部占位
.bottom-spacer {
  height: 80px;
}

// 响应式设计
@media screen and (max-width: 768px) {
  .soul-square-page {
    .soul-nav-bar {
      padding: 12px 16px;

      .nav-center {
        .nav-tabs {
          gap: 16px;

          .tab-item {
            font-size: 14px;
          }
        }
      }

      .nav-right {
        .nav-icons {
          gap: 12px;

          .icon-btn {
            width: 36px;
            height: 36px;
          }
        }
      }
    }

    .soul-feed {
      padding: 12px 16px;
      gap: 16px;

      .post-card {
        padding: 16px;

        .post-header {
          margin-bottom: 12px;

          .user-info {
            gap: 10px;

            .user-avatar {
              img {
                width: 40px;
                height: 40px;
              }
            }

            .user-details {
              .user-name {
                font-size: 14px;
              }
            }
          }
        }

        .post-content {
          margin-bottom: 12px;

          .post-text {
            font-size: 14px;
          }
        }

        .post-footer {
          .interaction-stats {
            gap: 16px;
          }
        }
      }
    }

    .floating-post-btn {
      bottom: 90px;
      right: 16px;
      padding: 12px 16px;

      span {
        font-size: 12px;
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .soul-nav-bar {
    .nav-center {
      .nav-tabs {
        gap: 12px;

        .tab-item {
          font-size: 13px;
        }
      }
    }
  }

  .soul-feed {
    .post-card {
      .post-header {
        .post-actions {
          .follow-btn {
            .el-button {
              font-size: 11px;
              padding: 4px 12px;
              height: 28px;
            }
          }
        }
      }
    }
  }
}
</style>
