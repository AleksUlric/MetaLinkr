<template>
  <div class="user-profile-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="nav-title">个人资料</div>
      <div class="nav-right">
        <el-button :icon="Share" circle size="small" @click="shareProfile" />
        <el-button :icon="MoreFilled" circle size="small" @click="showMoreOptions" />
      </div>
    </div>

    <!-- 用户基本信息 -->
    <div class="profile-header">
      <div class="avatar-section">
        <div class="avatar-container">
          <SmartAvatar 
            :src="userInfo.avatar" 
            :gender="userInfo.gender || 'male'" 
            :size="100" 
            :alt="userInfo.name"
            class="user-avatar"
          />
          <div class="avatar-badge" v-if="userInfo.isVerified">
            <el-icon><Check /></el-icon>
          </div>
          <div class="avatar-edit" @click="editAvatar">
            <el-icon><Camera /></el-icon>
          </div>
        </div>
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">{{ userInfo.followers }}</span>
            <span class="stat-label">粉丝</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ userInfo.following }}</span>
            <span class="stat-label">关注</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ userInfo.likes }}</span>
            <span class="stat-label">获赞</span>
          </div>
        </div>
      </div>
      
      <div class="user-info">
        <div class="user-name">{{ userInfo.name || '加载中...' }}</div>
        <div class="user-id" v-if="userInfo.id">ID: {{ userInfo.id }}</div>
        <div class="user-bio">{{ userInfo.bio || '这个人很懒，什么都没有留下~' }}</div>
        <div class="user-details">
          <span class="gender-age" v-if="userInfo.age > 0">{{ userInfo.gender }} {{ userInfo.age }}岁</span>
          <span class="gender-age" v-else-if="userInfo.gender">{{ userInfo.gender }}</span>
          <span class="location" v-if="userInfo.location && userInfo.location !== '未设置'">
            <el-icon><Location /></el-icon>{{ userInfo.location }}
          </span>
          <span class="occupation" v-if="userInfo.occupation">
            <el-icon><Briefcase /></el-icon>{{ userInfo.occupation }}
          </span>
        </div>
      </div>

      <div class="action-buttons">
        <el-button type="primary" round @click="editProfile">
          <el-icon><Edit /></el-icon>
          编辑资料
        </el-button>
        <el-button round @click="viewSettings">
          <el-icon><Setting /></el-icon>
          设置
        </el-button>
      </div>
    </div>

    <!-- 用户标签 -->
    <div class="user-tags">
      <div class="tags-header">
        <span class="tags-title">兴趣标签</span>
        <el-button text @click="editTags">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
      </div>
      <div class="tags-list">
        <span v-for="tag in userInfo.tags" :key="tag" class="tag-item">{{ tag }}</span>
        <span v-if="userInfo.tags.length === 0" class="tag-empty">暂无兴趣标签</span>
      </div>
    </div>

    <!-- 用户等级和成就 -->
    <div class="user-level">
      <div class="level-info">
        <div class="level-avatar">
          <img :src="getLevelAvatar(userInfo.level)" :alt="`等级${userInfo.level}`" />
        </div>
        <div class="level-details">
          <div class="level-name">{{ getLevelName(userInfo.level) }}</div>
          <div class="level-progress">
            <el-progress 
              :percentage="userInfo.levelProgress" 
              :stroke-width="6" 
              :show-text="false"
              color="linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)"
            />
            <span class="progress-text">{{ userInfo.exp }}/{{ getNextLevelExp(userInfo.level) }} EXP</span>
          </div>
        </div>
      </div>
      <div class="achievements">
        <div class="achievement-item" v-for="achievement in userInfo.achievements" :key="achievement.id">
          <img :src="achievement.icon" :alt="achievement.name" class="achievement-icon" />
          <span class="achievement-name">{{ achievement.name }}</span>
        </div>
      </div>
    </div>

    <!-- 动态内容 -->
    <div class="content-tabs">
      <div class="tab-nav">
        <div 
          v-for="tab in contentTabs" 
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <el-icon><component :is="tab.icon" /></el-icon>
          <span>{{ tab.title }}</span>
          <span class="tab-count">({{ tab.count }})</span>
        </div>
      </div>

      <div class="tab-content">
        <!-- 动态 -->
        <div v-if="activeTab === 'posts'" class="posts-grid">
          <div v-for="post in userPosts" :key="post.id" class="post-item" @click="viewPost(post)">
            <img :src="post.image" :alt="post.title" class="post-image" />
            <div class="post-overlay">
              <div class="post-stats">
                <span><el-icon><View /></el-icon>{{ post.views }}</span>
                <span><el-icon><ChatDotRound /></el-icon>{{ post.comments }}</span>
                <span><el-icon><Star /></el-icon>{{ post.likes }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 收藏 -->
        <div v-if="activeTab === 'favorites'" class="favorites-grid">
          <div v-for="favorite in userFavorites" :key="favorite.id" class="favorite-item" @click="viewFavorite(favorite)">
            <img :src="favorite.image" :alt="favorite.title" class="favorite-image" />
            <div class="favorite-info">
              <div class="favorite-title">{{ favorite.title }}</div>
              <div class="favorite-date">{{ favorite.date }}</div>
            </div>
          </div>
        </div>

        <!-- 点赞 -->
        <div v-if="activeTab === 'likes'" class="likes-grid">
          <div v-for="like in userLikes" :key="like.id" class="like-item" @click="viewLike(like)">
            <img :src="like.image" :alt="like.title" class="like-image" />
            <div class="like-info">
              <div class="like-title">{{ like.title }}</div>
              <div class="like-date">{{ like.date }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import SmartAvatar from '@/components/SmartAvatar.vue'
import { get } from '@/utils/request'
import { getUserAvatarUrl } from '@/utils/avatar'
import { 
  ArrowLeft, 
  Share, 
  MoreFilled, 
  Check, 
  Camera, 
  Location, 
  Briefcase, 
  Edit, 
  Setting,
  View,
  ChatDotRound,
  Star,
  Collection,
  StarFilled
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const userInfo = ref({
  id: '',
  name: '',
  avatar: '',
  bio: '',
  gender: '男',
  age: 0,
  location: '',
  occupation: '',
  isVerified: false,
  followers: 0,
  following: 0,
  likes: 0,
  level: 1,
  exp: 0,
  levelProgress: 0,
  tags: [] as string[],
  achievements: [
    { id: 1, name: '新人报到', icon: '🏆' },
    { id: 2, name: '活跃用户', icon: '⭐' },
    { id: 3, name: '内容创作者', icon: '📝' },
    { id: 4, name: '社交达人', icon: '💬' }
  ]
})

const activeTab = ref('posts')

const contentTabs = ref([
  { key: 'posts', title: '动态', icon: 'View', count: 28 },
  { key: 'favorites', title: '收藏', icon: 'Collection', count: 156 },
  { key: 'likes', title: '点赞', icon: 'StarFilled', count: 89 }
])

const userPosts = ref([
  { id: 1, title: '今天的夕阳真美', image: 'https://picsum.photos/300/300?random=1', views: 123, comments: 8, likes: 45 },
  { id: 2, title: '周末的咖啡时光', image: 'https://picsum.photos/300/300?random=2', views: 89, comments: 12, likes: 67 },
  { id: 3, title: '新发现的餐厅', image: 'https://picsum.photos/300/300?random=3', views: 234, comments: 15, likes: 89 },
  { id: 4, title: '旅行回忆', image: 'https://picsum.photos/300/300?random=4', views: 456, comments: 23, likes: 156 },
  { id: 5, title: '工作日常', image: 'https://picsum.photos/300/300?random=5', views: 78, comments: 5, likes: 23 },
  { id: 6, title: '美食分享', image: 'https://picsum.photos/300/300?random=6', views: 345, comments: 18, likes: 112 }
])

const userFavorites = ref([
  { id: 1, title: '摄影技巧分享', image: 'https://picsum.photos/200/200?random=10', date: '2024-01-15' },
  { id: 2, title: '旅行攻略', image: 'https://picsum.photos/200/200?random=11', date: '2024-01-14' },
  { id: 3, title: '美食制作', image: 'https://picsum.photos/200/200?random=12', date: '2024-01-13' }
])

const userLikes = ref([
  { id: 1, title: '美丽的风景', image: 'https://picsum.photos/200/200?random=20', date: '2024-01-15' },
  { id: 2, title: '有趣的视频', image: 'https://picsum.photos/200/200?random=21', date: '2024-01-14' },
  { id: 3, title: '感人的故事', image: 'https://picsum.photos/200/200?random=22', date: '2024-01-13' }
])

// 计算属性
const getLevelName = (level: number) => {
  const levelNames = ['新手', '初级', '中级', '高级', '专家', '大师', '传奇', '神话', '至尊', '无敌']
  return levelNames[Math.min(level - 1, levelNames.length - 1)] || '未知'
}

const getLevelAvatar = (level: number) => {
  return `https://picsum.photos/60/60?random=${level + 100}`
}

const getNextLevelExp = (level: number) => {
  return (level + 1) * 500 // 下一级需要500经验
}

// 计算年龄（从生日）
const calculateAge = (birthday: string | null | undefined): number => {
  if (!birthday) return 0
  try {
    const birthDate = new Date(birthday)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  } catch (e) {
    return 0
  }
}

// 转换性别显示
const formatGender = (gender: string | null | undefined): string => {
  if (!gender) return '未知'
  switch (gender.toLowerCase()) {
    case 'male':
      return '男'
    case 'female':
      return '女'
    case 'other':
      return '其他'
    default:
      return gender
  }
}

// 加载用户信息
const loadUserProfile = async () => {
  try {
    const profileData = await get<any>('/api/user/profile')
    if (profileData) {
      // 处理 interests（可能是数组或字符串）
      let interests: string[] = []
      if (Array.isArray(profileData.interests)) {
        interests = profileData.interests
      } else if (typeof profileData.interests === 'string' && profileData.interests) {
        try {
          // 尝试解析 JSON
          interests = JSON.parse(profileData.interests)
        } catch {
          // 如果不是 JSON，按逗号分隔
          interests = profileData.interests.split(',').filter(Boolean)
        }
      }

      // 计算年龄
      const age = calculateAge(profileData.birthday)

      // 计算等级进度
      const currentLevel = profileData.level || 1
      const currentExp = profileData.experience || 0
      const nextLevelExp = getNextLevelExp(currentLevel)
      const levelProgress = Math.min(Math.round((currentExp / nextLevelExp) * 100), 100)

      // 更新用户信息
      userInfo.value = {
        id: String(profileData.id || ''),
        name: profileData.nickname || '未设置昵称',
        avatar: getUserAvatarUrl(profileData.avatar, profileData.gender || 'male'),
        bio: profileData.bio || '这个人很懒，什么都没有留下~',
        gender: formatGender(profileData.gender),
        age,
        location: profileData.location || '未设置',
        occupation: '', // 后端暂无此字段
        isVerified: profileData.isVerified || false,
        followers: 0, // 后端暂无此字段
        following: 0, // 后端暂无此字段
        likes: 0, // 后端暂无此字段
        level: currentLevel,
        exp: currentExp,
        levelProgress,
        tags: interests,
        achievements: userInfo.value.achievements // 保持默认成就
      }
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
    ElMessage.error('加载用户信息失败')
  }
}

// 方法
const goBack = () => {
  router.back()
}

const shareProfile = () => {
  ElMessage.success('个人资料已分享')
}

const showMoreOptions = () => {
  ElMessage.info('更多选项功能开发中...')
}

const editAvatar = () => {
  ElMessage.info('头像编辑功能开发中...')
}

const editProfile = () => {
  router.push('/profile/edit')
}

const viewSettings = () => {
  router.push('/settings')
}

const editTags = () => {
  ElMessage.info('标签编辑功能开发中...')
}

const viewPost = (post: any) => {
  router.push(`/post/${post.id}`)
}

const viewFavorite = (favorite: any) => {
  ElMessage.info(`查看收藏: ${favorite.title}`)
}

const viewLike = (like: any) => {
  ElMessage.info(`查看点赞: ${like.title}`)
}

// 组件挂载时加载用户信息
onMounted(() => {
  loadUserProfile()
})
</script>

<style lang="scss" scoped>
.user-profile-page {
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
    display: flex;
    gap: 10px;

    .el-button {
      background: rgba(139, 92, 246, 0.1);
      border: none;
      color: #8b5cf6;

      &:hover {
        background: rgba(139, 92, 246, 0.2);
      }
    }
  }
}

.profile-header {
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(196, 181, 253, 0.1);
  margin-bottom: 20px;

  .avatar-section {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;

    .avatar-container {
      position: relative;
      width: 100px;
      height: 100px;

      .user-avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 4px solid rgba(139, 92, 246, 0.3);
        box-shadow: 0 5px 20px rgba(139, 92, 246, 0.2);
        
        :deep(.el-avatar) {
          width: 100%;
          height: 100%;
        }
      }

      .avatar-badge {
        position: absolute;
        bottom: 5px;
        right: 5px;
        width: 24px;
        height: 24px;
        background: #10b981;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        border: 2px solid white;
      }

      .avatar-edit {
        position: absolute;
        bottom: -5px;
        right: -5px;
        width: 28px;
        height: 28px;
        background: rgba(139, 92, 246, 0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(139, 92, 246, 1);
          transform: scale(1.1);
        }
      }
    }

    .user-stats {
      display: flex;
      gap: 20px;

      .stat-item {
        text-align: center;

        .stat-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: #64748b;
        }
      }
    }
  }

  .user-info {
    margin-bottom: 20px;

    .user-name {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 5px;
    }

    .user-id {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 10px;
    }

    .user-bio {
      font-size: 15px;
      color: #475569;
      line-height: 1.5;
      margin-bottom: 15px;
    }

    .user-details {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 14px;
      color: #64748b;

      span {
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 15px;

    .el-button {
      flex: 1;
      padding: 12px 20px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 15px;

      &.el-button--primary {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        border: none;
        color: white;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
        }
      }

      &:not(.el-button--primary) {
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.3);
        color: #8b5cf6;

        &:hover {
          background: rgba(139, 92, 246, 0.2);
        }
      }
    }
  }
}

.user-tags {
  padding: 0 20px;
  margin-bottom: 20px;

  .tags-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .tags-title {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }

    .el-button {
      color: #8b5cf6;
      font-size: 14px;
    }
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .tag-item {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid rgba(139, 92, 246, 0.2);
    }

    .tag-empty {
      color: #94a3b8;
      font-size: 14px;
      font-style: italic;
    }
  }
}

.user-level {
  padding: 0 20px;
  margin-bottom: 20px;

  .level-info {
    display: flex;
    align-items: center;
    gap: 15px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 15px;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);

    .level-avatar {
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid rgba(139, 92, 246, 0.3);
      }
    }

    .level-details {
      flex: 1;

      .level-name {
        font-size: 18px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 10px;
      }

      .level-progress {
        .progress-text {
          font-size: 12px;
          color: #64748b;
          margin-top: 5px;
          display: block;
        }
      }
    }
  }

  .achievements {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding-bottom: 10px;

    .achievement-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      padding: 15px 10px;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(196, 181, 253, 0.2);

      .achievement-icon {
        font-size: 24px;
        margin-bottom: 8px;
      }

      .achievement-name {
        font-size: 12px;
        color: #475569;
        text-align: center;
        line-height: 1.3;
      }
    }
  }
}

.content-tabs {
  padding: 0 20px;

  .tab-nav {
    display: flex;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    padding: 8px;
    margin-bottom: 20px;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);

    .tab-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      padding: 12px 8px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #64748b;
      font-size: 13px;

      &:hover {
        color: #475569;
        background: rgba(139, 92, 246, 0.05);
      }

      &.active {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        color: white;

        .tab-count {
          color: rgba(255, 255, 255, 0.8);
        }
      }

      .tab-count {
        font-size: 11px;
        color: #94a3b8;
      }
    }
  }

  .tab-content {
    .posts-grid, .favorites-grid, .likes-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;

      .post-item, .favorite-item, .like-item {
        position: relative;
        aspect-ratio: 1;
        border-radius: 12px;
        overflow: hidden;
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

        .post-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          padding: 10px;
          color: white;

          .post-stats {
            display: flex;
            justify-content: space-between;
            font-size: 12px;

            span {
              display: flex;
              align-items: center;
              gap: 3px;
            }
          }
        }

        .favorite-info, .like-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          padding: 10px;
          color: white;

          .favorite-title, .like-title {
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 3px;
          }

          .favorite-date, .like-date {
            font-size: 11px;
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>
