<template>
  <div class="community-detail-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="nav-title">{{ communityInfo.name }}</div>
      <div class="nav-right">
        <el-button :icon="Share" circle size="small" @click="shareCommunity" />
        <el-button :icon="MoreFilled" circle size="small" @click="showMoreOptions" />
      </div>
    </div>

    <!-- 社区头部信息 -->
    <div class="community-header">
      <div class="cover-image">
        <img :src="communityInfo.cover" :alt="communityInfo.name" />
        <div class="cover-overlay">
          <div class="community-stats">
            <div class="stat-item">
              <span class="stat-value">{{ communityInfo.memberCount }}</span>
              <span class="stat-label">成员</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ communityInfo.postCount }}</span>
              <span class="stat-label">动态</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ communityInfo.activityLevel }}%</span>
              <span class="stat-label">活跃度</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="community-info">
        <div class="info-content">
          <div class="community-name">{{ communityInfo.name }}</div>
          <div class="community-desc">{{ communityInfo.description }}</div>
          <div class="community-tags">
            <span v-for="tag in communityInfo.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="community-meta">
            <span class="created-time">创建于 {{ formatTime(communityInfo.createdTime) }}</span>
            <span class="owner-info">
              <img :src="communityInfo.ownerAvatar" :alt="communityInfo.ownerName" class="owner-avatar" />
              <span>圈主: {{ communityInfo.ownerName }}</span>
            </span>
          </div>
        </div>
        
        <div class="action-buttons">
          <el-button 
            v-if="!isJoined" 
            type="primary" 
            size="large"
            @click="joinCommunity"
            class="join-btn"
          >
            <el-icon><Plus /></el-icon>
            加入圈子
          </el-button>
          <el-button 
            v-else 
            type="success" 
            size="large"
            @click="leaveCommunity"
            class="leave-btn"
          >
            <el-icon><Check /></el-icon>
            已加入
          </el-button>
          <el-button 
            v-if="isJoined" 
            type="primary" 
            size="large"
            @click="createPost"
            class="create-post-btn"
          >
            <el-icon><Edit /></el-icon>
            发布动态
          </el-button>
        </div>
      </div>
    </div>

    <!-- 社区内容标签 -->
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
          <div v-if="tab.count > 0" class="tab-count">{{ tab.count }}</div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 动态列表 -->
      <div v-if="activeTab === 'posts'" class="posts-section">
        <div v-if="communityPosts.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <div class="empty-text">还没有动态，快来发布第一条吧！</div>
          <el-button v-if="isJoined" type="primary" @click="createPost">发布动态</el-button>
        </div>
        <div v-else class="posts-list">
          <div 
            v-for="post in communityPosts" 
            :key="post.id"
            class="post-item"
            @click="viewPost(post)"
          >
            <div class="post-header">
              <img :src="post.authorAvatar" :alt="post.authorName" class="author-avatar" />
              <div class="author-info">
                <div class="author-name">{{ post.authorName }}</div>
                <div class="post-time">{{ formatTime(post.createdTime) }}</div>
              </div>
              <div class="post-actions">
                <el-button :icon="MoreFilled" circle size="small" @click.stop="showPostOptions(post)" />
              </div>
            </div>
            <div class="post-content">
              <div class="post-text">{{ post.content }}</div>
              <div v-if="post.images && post.images.length > 0" class="post-images">
                <img 
                  v-for="(image, index) in post.images.slice(0, 3)" 
                  :key="index"
                  :src="image" 
                  :alt="`图片${index + 1}`"
                  class="post-image"
                />
                <div v-if="post.images.length > 3" class="more-images">
                  +{{ post.images.length - 3 }}
                </div>
              </div>
            </div>
            <div class="post-stats">
              <div class="stat-item">
                <el-icon><Star /></el-icon>
                <span>{{ post.likeCount }}</span>
              </div>
              <div class="stat-item">
                <el-icon><ChatDotRound /></el-icon>
                <span>{{ post.commentCount }}</span>
              </div>
              <div class="stat-item">
                <el-icon><Share /></el-icon>
                <span>{{ post.shareCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 成员列表 -->
      <div v-if="activeTab === 'members'" class="members-section">
        <div class="members-header">
          <div class="members-count">共 {{ communityInfo.memberCount }} 名成员</div>
          <el-input 
            v-model="memberSearchQuery" 
            placeholder="搜索成员..."
            :prefix-icon="Search"
            size="small"
          />
        </div>
        <div class="members-list">
          <div 
            v-for="member in filteredMembers" 
            :key="member.id"
            class="member-item"
            @click="viewMemberProfile(member)"
          >
            <img :src="member.avatar" :alt="member.name" class="member-avatar" />
            <div class="member-info">
              <div class="member-name">{{ member.name }}</div>
              <div class="member-level">{{ member.levelName }}</div>
              <div class="member-join-time">加入于 {{ formatTime(member.joinTime) }}</div>
            </div>
            <div class="member-status">
              <div v-if="member.isOwner" class="owner-badge">圈主</div>
              <div v-else-if="member.isAdmin" class="admin-badge">管理员</div>
              <div v-else-if="member.isOnline" class="online-badge">在线</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 活动列表 -->
      <div v-if="activeTab === 'activities'" class="activities-section">
        <div v-if="communityActivities.length === 0" class="empty-state">
          <div class="empty-icon">🎉</div>
          <div class="empty-text">暂无活动</div>
        </div>
        <div v-else class="activities-list">
          <div 
            v-for="activity in communityActivities" 
            :key="activity.id"
            class="activity-item"
            @click="viewActivity(activity)"
          >
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-info">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-desc">{{ activity.description }}</div>
              <div class="activity-meta">
                <span class="activity-time">{{ formatTime(activity.startTime) }}</span>
                <span class="activity-participants">{{ activity.participantCount }} 人参与</span>
              </div>
            </div>
            <div class="activity-status">
              <div v-if="activity.status === 'ongoing'" class="ongoing-badge">进行中</div>
              <div v-else-if="activity.status === 'upcoming'" class="upcoming-badge">即将开始</div>
              <div v-else class="ended-badge">已结束</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 规则说明 -->
      <div v-if="activeTab === 'rules'" class="rules-section">
        <div class="rules-content">
          <div class="rule-item">
            <div class="rule-title">社区规则</div>
            <div class="rule-content">
              <ol>
                <li>尊重他人，文明交流</li>
                <li>禁止发布违法违规内容</li>
                <li>禁止恶意刷屏和广告</li>
                <li>保护个人隐私信息</li>
                <li>积极维护社区氛围</li>
              </ol>
            </div>
          </div>
          <div class="rule-item">
            <div class="rule-title">发布规范</div>
            <div class="rule-content">
              <ul>
                <li>内容应与社区主题相关</li>
                <li>图片清晰，文字表达清楚</li>
                <li>避免重复发布相似内容</li>
                <li>鼓励原创和优质内容</li>
              </ul>
            </div>
          </div>
          <div class="rule-item">
            <div class="rule-title">违规处理</div>
            <div class="rule-content">
              <p>违反社区规则的用户将根据情节严重程度受到警告、禁言或移除处理。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Share, 
  MoreFilled, 
  Plus, 
  Check, 
  Edit, 
  Star, 
  ChatDotRound, 
  Search,
  User,
  Calendar,
  Document
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const router = useRouter()
const route = useRoute()

// 响应式数据
const activeTab = ref('posts')
const isJoined = ref(false)
const memberSearchQuery = ref('')

const communityInfo = ref({
  id: route.params.id as string,
  name: '摄影爱好者',
  description: '分享摄影技巧，交流拍摄心得，记录美好瞬间',
  cover: 'https://picsum.photos/400/200?random=1',
  avatar: 'https://picsum.photos/100/100?random=1',
  memberCount: 1256,
  postCount: 89,
  activityLevel: 85,
  tags: ['摄影', '艺术', '分享'],
  createdTime: '2023-06-15 10:30:00',
  ownerName: '摄影大师',
  ownerAvatar: 'https://picsum.photos/200/200?random=2'
})

const contentTabs = ref([
  { key: 'posts', title: '动态', icon: 'Document', count: 89 },
  { key: 'members', title: '成员', icon: 'User', count: 1256 },
  { key: 'activities', title: '活动', icon: 'Calendar', count: 12 },
  { key: 'rules', title: '规则', icon: 'Document', count: 0 }
])

const communityPosts = ref([
  {
    id: 1,
    authorName: '小明',
    authorAvatar: 'https://picsum.photos/200/200?random=3',
    content: '今天拍了一张很美的夕阳照片，分享给大家！',
    images: ['https://picsum.photos/300/300?random=10'],
    likeCount: 23,
    commentCount: 8,
    shareCount: 3,
    createdTime: '2024-01-15 14:30:00'
  },
  {
    id: 2,
    authorName: '小红',
    authorAvatar: 'https://picsum.photos/200/200?random=4',
    content: '摄影技巧分享：如何拍出清晰的人像照片',
    images: ['https://picsum.photos/300/300?random=11', 'https://picsum.photos/300/300?random=12'],
    likeCount: 45,
    commentCount: 12,
    shareCount: 7,
    createdTime: '2024-01-15 12:20:00'
  },
  {
    id: 3,
    authorName: '小芳',
    authorAvatar: 'https://picsum.photos/200/200?random=5',
    content: '周末去了公园，拍了很多花花草草，春天的气息真美好！',
    images: ['https://picsum.photos/300/300?random=13', 'https://picsum.photos/300/300?random=14', 'https://picsum.photos/300/300?random=15'],
    likeCount: 67,
    commentCount: 15,
    shareCount: 9,
    createdTime: '2024-01-14 18:45:00'
  }
])

const communityMembers = ref([
  {
    id: 1,
    name: '摄影大师',
    avatar: 'https://picsum.photos/200/200?random=2',
    levelName: '圈主',
    joinTime: '2023-06-15 10:30:00',
    isOwner: true,
    isAdmin: false,
    isOnline: true
  },
  {
    id: 2,
    name: '小明',
    avatar: 'https://picsum.photos/200/200?random=3',
    levelName: '高级成员',
    joinTime: '2023-07-20 15:20:00',
    isOwner: false,
    isAdmin: true,
    isOnline: true
  },
  {
    id: 3,
    name: '小红',
    avatar: 'https://picsum.photos/200/200?random=4',
    levelName: '活跃成员',
    joinTime: '2023-08-10 09:15:00',
    isOwner: false,
    isAdmin: false,
    isOnline: false
  },
  {
    id: 4,
    name: '小芳',
    avatar: 'https://picsum.photos/200/200?random=5',
    levelName: '普通成员',
    joinTime: '2023-09-05 14:30:00',
    isOwner: false,
    isAdmin: false,
    isOnline: true
  }
])

const communityActivities = ref([
  {
    id: 1,
    title: '摄影技巧分享会',
    description: '邀请专业摄影师分享人像摄影技巧',
    icon: '📸',
    startTime: '2024-01-20 19:00:00',
    participantCount: 45,
    status: 'upcoming'
  },
  {
    id: 2,
    title: '春季摄影大赛',
    description: '以春天为主题，展示最美的春景照片',
    icon: '🌸',
    startTime: '2024-01-15 10:00:00',
    participantCount: 123,
    status: 'ongoing'
  },
  {
    id: 3,
    title: '夜景摄影交流',
    description: '分享夜景拍摄经验和技巧',
    icon: '🌙',
    startTime: '2024-01-10 20:00:00',
    participantCount: 67,
    status: 'ended'
  }
])

// 计算属性
const filteredMembers = computed(() => {
  if (!memberSearchQuery.value) {
    return communityMembers.value
  }
  return communityMembers.value.filter(member => 
    member.name.toLowerCase().includes(memberSearchQuery.value.toLowerCase())
  )
})

// 方法
const goBack = () => {
  router.back()
}

const shareCommunity = () => {
  ElMessage.success('社区链接已复制到剪贴板')
}

const showMoreOptions = () => {
  ElMessage.info('更多选项功能开发中...')
}

const joinCommunity = () => {
  isJoined.value = true
  communityInfo.value.memberCount += 1
  ElMessage.success('成功加入社区！')
}

const leaveCommunity = () => {
  isJoined.value = false
  communityInfo.value.memberCount -= 1
  ElMessage.success('已退出社区')
}

const createPost = () => {
  router.push('/post/create')
}

const viewPost = (post: any) => {
  router.push(`/post/${post.id}`)
}

const showPostOptions = (post: any) => {
  ElMessage.info(`操作帖子: ${post.id}`)
}

const viewMemberProfile = (member: any) => {
  router.push(`/user/${member.id}`)
}

const viewActivity = (activity: any) => {
  ElMessage.info(`查看活动: ${activity.title}`)
}

const formatTime = (time: string) => {
  return dayjs(time).fromNow()
}

// 生命周期
onMounted(() => {
  // 模拟检查用户是否已加入社区
  isJoined.value = Math.random() > 0.5
})
</script>

<style lang="scss" scoped>
.community-detail-page {
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

.community-header {
  .cover-image {
    position: relative;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cover-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      padding: 20px;

      .community-stats {
        display: flex;
        gap: 30px;

        .stat-item {
          text-align: center;
          color: white;

          .stat-value {
            display: block;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 3px;
          }

          .stat-label {
            font-size: 12px;
            opacity: 0.8;
          }
        }
      }
    }
  }

  .community-info {
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(196, 181, 253, 0.1);

    .info-content {
      margin-bottom: 20px;

      .community-name {
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 10px;
      }

      .community-desc {
        font-size: 15px;
        color: #64748b;
        line-height: 1.5;
        margin-bottom: 15px;
      }

      .community-tags {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;

        .tag {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 500;
        }
      }

      .community-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        color: #64748b;

        .owner-info {
          display: flex;
          align-items: center;
          gap: 8px;

          .owner-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            object-fit: cover;
          }
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

        &.el-button--success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;

          &:hover {
            background: rgba(16, 185, 129, 0.2);
          }
        }

        .el-icon {
          margin-right: 8px;
        }
      }
    }
  }
}

.content-tabs {
  padding: 0 20px;
  margin-bottom: 20px;

  .tab-nav {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 10px;

    .tab-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #64748b;
      white-space: nowrap;
      position: relative;
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(196, 181, 253, 0.2);

      &:hover {
        color: #475569;
        transform: translateY(-2px);
      }

      &.active {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
      }

      .el-icon {
        font-size: 16px;
      }

      span {
        font-size: 14px;
        font-weight: 600;
      }

      .tab-count {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #ef4444;
        color: white;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 10px;
        border: 2px solid white;
        min-width: 16px;
        text-align: center;
      }
    }
  }
}

.content-area {
  padding: 0 20px 20px;
}

.posts-section, .members-section, .activities-section, .rules-section {
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);

    .empty-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }

    .empty-text {
      font-size: 16px;
      color: #64748b;
      margin-bottom: 20px;
    }

    .el-button {
      background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
      border: none;
      color: white;
      font-weight: 600;
      padding: 12px 25px;
      border-radius: 20px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
      }
    }
  }
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .post-item {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
    }

    .post-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;

      .author-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }

      .author-info {
        flex: 1;

        .author-name {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 3px;
        }

        .post-time {
          font-size: 12px;
          color: #64748b;
        }
      }

      .post-actions {
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

    .post-content {
      margin-bottom: 15px;

      .post-text {
        font-size: 15px;
        color: #334155;
        line-height: 1.5;
        margin-bottom: 15px;
      }

      .post-images {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 10px;
        position: relative;

        .post-image {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 12px;
        }

        .more-images {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          border-radius: 12px;
        }
      }
    }

    .post-stats {
      display: flex;
      gap: 20px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #64748b;
        font-size: 14px;

        .el-icon {
          font-size: 16px;
        }
      }
    }
  }
}

.members-section {
  .members-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);

    .members-count {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }

    .el-input {
      width: 200px;

      .el-input__inner {
        border-radius: 12px;
        background: rgba(139, 92, 246, 0.05);
        border: 1px solid rgba(139, 92, 246, 0.1);
        color: #334155;

        &::placeholder {
          color: #94a3b8;
        }
      }
    }
  }

  .members-list {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .member-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(196, 181, 253, 0.2);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
      }

      .member-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
      }

      .member-info {
        flex: 1;

        .member-name {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 5px;
        }

        .member-level {
          font-size: 13px;
          color: #8b5cf6;
          margin-bottom: 3px;
        }

        .member-join-time {
          font-size: 12px;
          color: #64748b;
        }
      }

      .member-status {
        .owner-badge {
          background: #f59e0b;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .admin-badge {
          background: #8b5cf6;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .online-badge {
          background: #10b981;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
      }
    }
  }
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .activity-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
    }

    .activity-icon {
      font-size: 32px;
      width: 50px;
      text-align: center;
    }

    .activity-info {
      flex: 1;

      .activity-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 5px;
      }

      .activity-desc {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 8px;
      }

      .activity-meta {
        display: flex;
        gap: 15px;
        font-size: 12px;
        color: #94a3b8;

        .activity-participants {
          color: #8b5cf6;
        }
      }
    }

    .activity-status {
      .ongoing-badge {
        background: #10b981;
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }

      .upcoming-badge {
        background: #f59e0b;
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }

      .ended-badge {
        background: #64748b;
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }
    }
  }
}

.rules-section {
  .rules-content {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .rule-item {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(196, 181, 253, 0.2);

      .rule-title {
        font-size: 18px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(196, 181, 253, 0.2);
      }

      .rule-content {
        font-size: 15px;
        color: #334155;
        line-height: 1.6;

        ol, ul {
          margin: 0;
          padding-left: 20px;

          li {
            margin-bottom: 8px;
          }
        }

        p {
          margin: 0;
        }
      }
    }
  }
}
</style>
