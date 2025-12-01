<template>
  <div class="soul-home-page">
    <!-- Soul风格顶部状态栏 -->
    <div class="soul-status-bar">
      <div class="status-left">
        <div class="user-planet" @click="viewPlanet">
          <div class="planet-icon">🌍</div>
          <span class="planet-name">{{ userPlanet }}</span>
        </div>
        <div class="online-indicator">
          <div class="status-dot"></div>
          <span>{{ onlineCount }}人在线</span>
        </div>
      </div>
      <div class="status-right">
        <div class="soul-points">
          <span class="points-icon">💎</span>
          <span class="points-value">{{ soulPoints }}</span>
        </div>
        <div class="notification-btn" @click="showNotifications">
          <el-icon><Bell /></el-icon>
          <div class="notification-badge" v-if="unreadCount > 0">{{ unreadCount }}</div>
        </div>
      </div>
    </div>

    <!-- Soul风格功能入口 -->
    <div class="soul-features">
      <div class="feature-row">
        <div class="feature-item soul-moment" @click="createMoment">
          <div class="feature-icon">✨</div>
          <span>瞬间</span>
        </div>
        <div class="feature-item soul-match" @click="startSoulMatch">
          <div class="feature-icon">💫</div>
          <span>灵犀链接</span>
        </div>
        <div class="feature-item soul-voice" @click="joinVoiceRoom">
          <div class="feature-icon">🎵</div>
          <span>语音聊天</span>
        </div>
        <div class="feature-item soul-game" @click="playSoulGame">
          <div class="feature-icon">🎮</div>
          <span>小游戏</span>
        </div>
      </div>
    </div>

    <!-- Soul风格动态广场 -->
    <div class="soul-feed">
      <div class="feed-header">
        <h3>广场</h3>
        <div class="feed-tabs">
          <div 
            v-for="tab in feedTabs" 
            :key="tab.key"
            class="tab-item"
            :class="{ active: activeTab === tab.key }"
            @click="switchTab(tab.key)"
          >
            {{ tab.label }}
          </div>
        </div>
      </div>
      
      <div class="feed-content">
        <div 
          v-for="moment in moments" 
          :key="moment.id"
          class="moment-card"
          @click="viewMoment(moment)"
        >
          <div class="moment-header">
            <div class="user-info">
              <div class="user-avatar">
                <img :src="moment.user.avatar" :alt="moment.user.name" />
                <div class="user-level">{{ moment.user.level }}</div>
              </div>
              <div class="user-details">
                <div class="user-name">{{ moment.user.name }}</div>
                <div class="moment-time">{{ moment.time }}</div>
              </div>
            </div>
            <div class="moment-actions">
              <div class="action-btn" @click.stop="followUser(moment.user)">
                <el-icon><Plus /></el-icon>
              </div>
            </div>
          </div>
          
          <div class="moment-content">
            <p class="moment-text">{{ moment.content }}</p>
            <div v-if="moment.images && moment.images.length > 0" class="moment-images">
              <div 
                v-for="(image, index) in moment.images" 
                :key="index"
                class="image-item"
                :class="{ 'single': moment.images.length === 1 }"
              >
                <img :src="image" :alt="`图片${index + 1}`" />
              </div>
            </div>
            <div v-if="moment.music" class="moment-music">
              <div class="music-info">
                <div class="music-icon">🎵</div>
                <div class="music-details">
                  <div class="music-name">{{ moment.music.name }}</div>
                  <div class="music-artist">{{ moment.music.artist }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="moment-footer">
            <div class="interaction-stats">
              <div class="stat-item" @click.stop="toggleLike(moment)">
                <el-icon :class="{ liked: moment.isLiked }">
                  <Star />
                </el-icon>
                <span>{{ moment.likes }}</span>
              </div>
              <div class="stat-item" @click.stop="showComments()">
                <el-icon><ChatDotRound /></el-icon>
                <span>{{ moment.comments }}</span>
              </div>
              <div class="stat-item" @click.stop="shareMoment()">
                <el-icon><Share /></el-icon>
                <span>{{ moment.shares }}</span>
              </div>
            </div>
            <div class="moment-tags">
              <span 
                v-for="tag in moment.tags" 
                :key="tag" 
                class="tag"
              >#{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Soul风格推荐用户 -->
    <div class="soul-recommendations">
      <div class="recommendation-header">
        <h3>推荐关注</h3>
        <span class="refresh-btn" @click="refreshRecommendations">
          <el-icon><Refresh /></el-icon>
        </span>
      </div>
      <div class="recommendation-list">
        <div 
          v-for="user in recommendedUsers" 
          :key="user.id"
          class="recommendation-item"
          @click="viewUserProfile(user)"
        >
          <div class="user-avatar">
            <img :src="user.avatar" :alt="user.name" />
            <div class="user-level">{{ user.level }}</div>
          </div>
          <div class="user-info">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-desc">{{ user.description }}</div>
            <div class="user-tags">
              <span 
                v-for="tag in user.tags" 
                :key="tag" 
                class="tag"
              >{{ tag }}</span>
            </div>
          </div>
          <div class="follow-btn" @click.stop="followUser(user)">
            <el-button size="small" type="primary" round>
              <el-icon><Plus /></el-icon>
              关注
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Bell, 
  Refresh, 
  Star, 
  ChatDotRound,
  Plus,
  Share
} from '@element-plus/icons-vue'

const router = useRouter()

// Soul风格响应式数据
const userPlanet = ref('灵魂星球')
const onlineCount = ref(12580)
const soulPoints = ref(2580)
const unreadCount = ref(3)
const activeTab = ref('recommend')

// 广场标签页
const feedTabs = ref([
  { key: 'recommend', label: '推荐' },
  { key: 'follow', label: '关注' },
  { key: 'nearby', label: '附近' },
  { key: 'latest', label: '最新' }
])

// Soul风格瞬间数据
const moments = ref([
  {
    id: 1,
    user: { 
      name: '匿名用户001', 
      avatar: 'https://picsum.photos/200/200?random=11',
      level: 15
    },
    content: '今天心情特别好，分享一首喜欢的歌给大家~',
    time: '2小时前',
    images: ['https://picsum.photos/300/200?random=21'],
    music: {
      name: '夜空中最亮的星',
      artist: '逃跑计划'
    },
    likes: 23,
    comments: 5,
    shares: 3,
    isLiked: false,
    tags: ['音乐', '心情', '分享']
  },
  {
    id: 2,
    user: { 
      name: '匿名用户002', 
      avatar: 'https://picsum.photos/200/200?random=12',
      level: 8
    },
    content: '周末的午后，一杯咖啡，一本好书，这就是我想要的生活',
    time: '4小时前',
    images: ['https://picsum.photos/300/200?random=22', 'https://picsum.photos/300/200?random=23'],
    music: null,
    likes: 45,
    comments: 12,
    shares: 8,
    isLiked: true,
    tags: ['生活', '读书', '咖啡']
  },
  {
    id: 3,
    user: { 
      name: '匿名用户003', 
      avatar: 'https://picsum.photos/200/200?random=13',
      level: 22
    },
    content: '今天的夕阳特别美，忍不住拍了下来',
    time: '6小时前',
    images: ['https://picsum.photos/300/200?random=24'],
    music: null,
    likes: 18,
    comments: 8,
    shares: 2,
    isLiked: false,
    tags: ['摄影', '夕阳', '美景']
  }
])

// 推荐用户数据
const recommendedUsers = ref([
  {
    id: 1,
    name: '音乐爱好者',
    avatar: 'https://picsum.photos/200/200?random=1',
    level: 12,
    description: '热爱音乐，喜欢分享',
    tags: ['音乐', '吉他', '创作']
  },
  {
    id: 2,
    name: '旅行达人',
    avatar: 'https://picsum.photos/200/200?random=2',
    level: 18,
    description: '走遍世界，记录美好',
    tags: ['旅行', '摄影', '冒险']
  },
  {
    id: 3,
    name: '美食探索者',
    avatar: 'https://picsum.photos/200/200?random=3',
    level: 9,
    description: '寻找城市里的美味',
    tags: ['美食', '探店', '分享']
  }
])

// 方法
const viewPlanet = () => {
  ElMessage.info('查看星球详情')
  // 跳转到星球页面
}

const showNotifications = () => {
  ElMessage.info('查看通知')
  // 显示通知列表
}

const createMoment = () => {
  router.push('/post/create')
  ElMessage.success('开始创作瞬间')
}

const startSoulMatch = () => {
  router.push('/match/soul')
  ElMessage.success('灵犀匹配正在为你排队')
}

const joinVoiceRoom = () => {
  router.push('/voice')
  ElMessage.success('进入语音聊天')
}

const playSoulGame = () => {
  router.push('/game')
  ElMessage.success('开始小游戏')
}

const switchTab = (tabKey: string) => {
  activeTab.value = tabKey
  ElMessage.info(`切换到${feedTabs.value.find(t => t.key === tabKey)?.label}`)
}

const viewMoment = (moment: any) => {
  router.push(`/post/${moment.id}`)
}

const followUser = (user: any) => {
  ElMessage.success(`已关注 ${user.name}`)
}

const toggleLike = (moment: any) => {
  moment.isLiked = !moment.isLiked
  moment.likes += moment.isLiked ? 1 : -1
  ElMessage.success(moment.isLiked ? '已点赞' : '已取消点赞')
}

const showComments = () => {
  ElMessage.info('查看评论')
}

const shareMoment = () => {
  ElMessage.success('已分享到其他平台')
}

const refreshRecommendations = () => {
  ElMessage.success('推荐内容已刷新')
}

const viewUserProfile = (user: any) => {
  router.push(`/user/${user.id}`)
}
</script>

<style lang="scss" scoped>
.soul-home-page {
  background: #1a1a1a;
  min-height: calc(100vh - 88px);
  color: #ffffff;
  position: relative;
  
  // Soul风格的星空背景
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
      linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    z-index: -1;
    pointer-events: none;
  }
  
  // 星空粒子效果
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, #ffffff, transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.4), transparent),
      radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.7), transparent);
    background-repeat: repeat;
    background-size: 200px 100px;
    animation: sparkle 20s linear infinite;
    z-index: -1;
    pointer-events: none;
  }
}

// Soul风格顶部状态栏
.soul-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  .status-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .user-planet {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      .planet-icon {
        font-size: 24px;
        animation: rotate 10s linear infinite;
      }

      .planet-name {
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
      }
    }

    .online-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);

      .status-dot {
        width: 8px;
        height: 8px;
        background: #00ff88;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
    }
  }

  .status-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .soul-points {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.1);
      padding: 8px 12px;
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);

      .points-icon {
        font-size: 16px;
      }

      .points-value {
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
      }
    }

    .notification-btn {
      position: relative;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .notification-badge {
        position: absolute;
        top: 2px;
        right: 2px;
        background: #ff4757;
        color: white;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 10px;
        min-width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #1a1a1a;
      }
    }
  }
}

// Soul风格功能入口
.soul-features {
  padding: 20px;
  margin-bottom: 20px;

  .feature-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    .feature-item {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 20px 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.3);

        &::before {
          opacity: 1;
        }

        .feature-icon {
          transform: scale(1.1);
        }
      }

      .feature-icon {
        font-size: 32px;
        margin-bottom: 12px;
        transition: all 0.3s ease;
        display: block;
      }

      span {
        font-size: 14px;
        color: #ffffff;
        font-weight: 500;
        display: block;
      }

      &.soul-moment {
        background: linear-gradient(135deg, rgba(255, 119, 198, 0.2) 0%, rgba(120, 119, 198, 0.2) 100%);
        border-color: rgba(255, 119, 198, 0.3);
      }

      &.soul-match {
        background: linear-gradient(135deg, rgba(120, 219, 255, 0.2) 0%, rgba(255, 119, 198, 0.2) 100%);
        border-color: rgba(120, 219, 255, 0.3);
      }

      &.soul-voice {
        background: linear-gradient(135deg, rgba(43, 233, 123, 0.2) 0%, rgba(56, 249, 215, 0.2) 100%);
        border-color: rgba(43, 233, 123, 0.3);
      }

      &.soul-game {
        background: linear-gradient(135deg, rgba(250, 112, 154, 0.2) 0%, rgba(254, 225, 64, 0.2) 100%);
        border-color: rgba(250, 112, 154, 0.3);
      }
    }
  }
}

// Soul风格动态广场
.soul-feed {
  padding: 0 20px;
  margin-bottom: 20px;

  .feed-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .feed-tabs {
      display: flex;
      gap: 8px;

      .tab-item {
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        &.active {
          background: linear-gradient(135deg, #ff77c6 0%, #7877c6 100%);
          color: #ffffff;
          border-color: rgba(255, 119, 198, 0.5);
          box-shadow: 0 4px 16px rgba(255, 119, 198, 0.3);
        }
      }
    }
  }

  .feed-content {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .moment-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.2);

        &::before {
          opacity: 1;
        }
      }

      .moment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
              border: 2px solid #1a1a1a;
            }
          }

          .user-details {
            .user-name {
              font-size: 16px;
              font-weight: 600;
              color: #ffffff;
              margin-bottom: 4px;
            }

            .moment-time {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.6);
            }
          }
        }

        .moment-actions {
          .action-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #ffffff;

            &:hover {
              background: rgba(255, 255, 255, 0.2);
              transform: scale(1.1);
            }
          }
        }
      }

      .moment-content {
        margin-bottom: 16px;

        .moment-text {
          font-size: 16px;
          line-height: 1.6;
          color: #ffffff;
          margin: 0 0 16px 0;
        }

        .moment-images {
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

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }

        .moment-music {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);

          .music-info {
            display: flex;
            align-items: center;
            gap: 12px;

            .music-icon {
              font-size: 24px;
            }

            .music-details {
              flex: 1;

              .music-name {
                font-size: 14px;
                font-weight: 600;
                color: #ffffff;
                margin-bottom: 2px;
              }

              .music-artist {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
              }
            }
          }
        }
      }

      .moment-footer {
        .interaction-stats {
          display: flex;
          gap: 24px;
          margin-bottom: 12px;

          .stat-item {
            display: flex;
            align-items: center;
            gap: 6px;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 4px 8px;
            border-radius: 8px;

            &:hover {
              background: rgba(255, 255, 255, 0.1);
              color: #ffffff;
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

        .moment-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;

          .tag {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        }
      }
    }
  }
}

// Soul风格推荐用户
.soul-recommendations {
  padding: 0 20px;
  margin-bottom: 20px;

  .recommendation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .refresh-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #ffffff;
        transform: rotate(180deg);
      }
    }
  }

  .recommendation-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .recommendation-item {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.2);

        &::before {
          opacity: 1;
        }
      }

      .user-avatar {
        position: relative;

        img {
          width: 56px;
          height: 56px;
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
          border: 2px solid #1a1a1a;
        }
      }

      .user-info {
        flex: 1;

        .user-name {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .user-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .user-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;

          .tag {
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        }
      }

      .follow-btn {
        .el-button {
          background: linear-gradient(135deg, #ff77c6 0%, #7877c6 100%);
          border: none;
          box-shadow: 0 4px 16px rgba(255, 119, 198, 0.3);
          color: white;
          font-weight: 600;

          &:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(255, 119, 198, 0.4);
          }
        }
      }
    }
  }
}

// 响应式设计
@media screen and (max-width: 768px) {
  .soul-home-page {
    .soul-status-bar {
      padding: 12px 16px;

      .status-left {
        gap: 12px;

        .user-planet {
          .planet-name {
            font-size: 14px;
          }
        }

        .online-indicator {
          font-size: 11px;
        }
      }

      .status-right {
        gap: 12px;

        .soul-points {
          padding: 6px 10px;

          .points-value {
            font-size: 13px;
          }
        }
      }
    }

    .soul-features {
      padding: 16px;

      .feature-row {
        gap: 12px;

        .feature-item {
          padding: 16px 8px;

          .feature-icon {
            font-size: 28px;
            margin-bottom: 8px;
          }

          span {
            font-size: 12px;
          }
        }
      }
    }

    .soul-feed {
      padding: 0 16px;

      .feed-header {
        margin-bottom: 16px;

        h3 {
          font-size: 18px;
        }

        .feed-tabs {
          gap: 6px;

          .tab-item {
            padding: 6px 12px;
            font-size: 12px;
          }
        }
      }

      .feed-content {
        gap: 12px;

        .moment-card {
          padding: 16px;

          .moment-header {
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

          .moment-content {
            margin-bottom: 12px;

            .moment-text {
              font-size: 14px;
            }
          }

          .moment-footer {
            .interaction-stats {
              gap: 16px;
            }
          }
        }
      }
    }

    .soul-recommendations {
      padding: 0 16px;

      .recommendation-header {
        margin-bottom: 16px;

        h3 {
          font-size: 18px;
        }
      }

      .recommendation-list {
        gap: 12px;

        .recommendation-item {
          padding: 16px;
          gap: 12px;

          .user-avatar {
            img {
              width: 48px;
              height: 48px;
            }
          }

          .user-info {
            .user-name {
              font-size: 14px;
            }

            .user-desc {
              font-size: 13px;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .soul-features {
    .feature-row {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .feature-item {
        padding: 20px 12px;

        .feature-icon {
          font-size: 32px;
        }

        span {
          font-size: 14px;
        }
      }
    }
  }
}

// Soul风格动画效果
@keyframes sparkle {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-100px);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
</style>

