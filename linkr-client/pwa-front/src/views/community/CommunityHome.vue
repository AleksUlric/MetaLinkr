<template>
  <div class="community-home-page">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="nav-title">兴趣圈子</div>
      <div class="nav-right">
        <el-button :icon="Search" circle size="small" @click="showSearch" />
        <el-button :icon="Plus" circle size="small" @click="createCommunity" />
      </div>
    </div>

    <!-- 推荐圈子 -->
    <div class="recommended-section">
      <div class="section-header">
        <h3>推荐圈子</h3>
        <el-button text @click="viewAllRecommended">查看更多</el-button>
      </div>
      <div class="recommended-grid">
        <div 
          v-for="community in recommendedCommunities" 
          :key="community.id"
          class="community-card recommended"
          @click="viewCommunity(community)"
        >
          <div class="card-image">
            <img :src="community.cover" :alt="community.name" />
            <div class="card-overlay">
              <div class="member-count">
                <el-icon><User /></el-icon>
                <span>{{ community.memberCount }}</span>
              </div>
            </div>
          </div>
          <div class="card-content">
            <div class="community-name">{{ community.name }}</div>
            <div class="community-desc">{{ community.description }}</div>
            <div class="community-tags">
              <span v-for="tag in community.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的圈子 -->
    <div class="my-communities-section">
      <div class="section-header">
        <h3>我的圈子</h3>
        <el-button text @click="manageCommunities">管理</el-button>
      </div>
      <div v-if="myCommunities.length === 0" class="empty-state">
        <div class="empty-icon">👥</div>
        <div class="empty-text">你还没有加入任何圈子</div>
        <el-button type="primary" @click="exploreCommunities">去探索</el-button>
      </div>
      <div v-else class="my-communities-list">
        <div 
          v-for="community in myCommunities" 
          :key="community.id"
          class="community-item"
          @click="viewCommunity(community)"
        >
          <img :src="community.avatar" :alt="community.name" class="community-avatar" />
          <div class="community-info">
            <div class="community-name">{{ community.name }}</div>
            <div class="community-stats">
              <span>{{ community.memberCount }} 成员</span>
              <span>{{ community.postCount }} 动态</span>
            </div>
            <div class="community-last-activity">
              最后活跃: {{ formatTime(community.lastActivity) }}
            </div>
          </div>
          <div class="community-status">
            <div v-if="community.isOwner" class="owner-badge">圈主</div>
            <div v-else-if="community.isAdmin" class="admin-badge">管理员</div>
            <div v-else class="member-badge">成员</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门话题 -->
    <div class="topics-section">
      <div class="section-header">
        <h3>热门话题</h3>
        <el-button text @click="viewAllTopics">查看更多</el-button>
      </div>
      <div class="topics-list">
        <div 
          v-for="topic in hotTopics" 
          :key="topic.id"
          class="topic-item"
          @click="viewTopic(topic)"
        >
          <div class="topic-icon">{{ topic.icon }}</div>
          <div class="topic-info">
            <div class="topic-name">#{{ topic.name }}</div>
            <div class="topic-stats">
              <span>{{ topic.postCount }} 动态</span>
              <span>{{ topic.participantCount }} 参与</span>
            </div>
          </div>
          <div class="topic-trend">
            <el-icon><TrendCharts /></el-icon>
            <span>{{ topic.trend }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="categories-section">
      <div class="section-header">
        <h3>分类浏览</h3>
      </div>
      <div class="categories-grid">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          @click="viewCategory(category)"
        >
          <div class="category-icon">
            <el-icon><component :is="category.icon" /></el-icon>
          </div>
          <div class="category-name">{{ category.name }}</div>
          <div class="category-count">{{ category.communityCount }} 个圈子</div>
        </div>
      </div>
    </div>

    <!-- 搜索弹窗 -->
    <el-dialog 
      v-model="showSearchDialog" 
      title="搜索圈子"
      width="90%"
      class="search-dialog"
    >
      <div class="search-content">
        <div class="search-input">
          <el-input 
            v-model="searchQuery" 
            placeholder="搜索圈子名称、话题..."
            :prefix-icon="Search"
            @keyup.enter="performSearch"
          />
        </div>
        <div class="search-filters">
          <el-select v-model="searchCategory" placeholder="选择分类">
            <el-option label="全部分类" value="" />
            <el-option 
              v-for="category in categories" 
              :key="category.id"
              :label="category.name" 
              :value="category.id" 
            />
          </el-select>
          <el-select v-model="searchSort" placeholder="排序方式">
            <el-option label="最新创建" value="newest" />
            <el-option label="最多成员" value="members" />
            <el-option label="最活跃" value="active" />
          </el-select>
        </div>
        <div class="search-results">
          <div v-if="searchResults.length === 0" class="no-results">
            <div class="no-results-icon">🔍</div>
            <div class="no-results-text">没有找到相关圈子</div>
          </div>
          <div v-else class="results-list">
            <div 
              v-for="result in searchResults" 
              :key="result.id"
              class="result-item"
              @click="viewCommunity(result)"
            >
              <img :src="result.avatar" :alt="result.name" class="result-avatar" />
              <div class="result-info">
                <div class="result-name">{{ result.name }}</div>
                <div class="result-desc">{{ result.description }}</div>
                <div class="result-stats">
                  <span>{{ result.memberCount }} 成员</span>
                  <span>{{ result.postCount }} 动态</span>
                </div>
              </div>
              <el-button 
                v-if="!result.isJoined"
                type="primary" 
                size="small"
                @click.stop="joinCommunity(result)"
              >
                加入
              </el-button>
              <div v-else class="joined-badge">已加入</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  User, 
  TrendCharts,
  Camera,
  Mic,
  Monitor,
  Document,
  StarFilled,
  Star,
  Location,
  Briefcase
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const router = useRouter()

// 响应式数据
const showSearchDialog = ref(false)
const searchQuery = ref('')
const searchCategory = ref('')
const searchSort = ref('newest')
const searchResults = ref<any[]>([])

const recommendedCommunities = ref([
  {
    id: 1,
    name: '摄影爱好者',
    description: '分享摄影技巧，交流拍摄心得',
    cover: 'https://picsum.photos/300/200?random=1',
    avatar: 'https://picsum.photos/100/100?random=1',
    memberCount: 1256,
    postCount: 89,
    tags: ['摄影', '艺术', '分享'],
    isJoined: false
  },
  {
    id: 2,
    name: '音乐分享',
    description: '发现好音乐，分享音乐故事',
    cover: 'https://picsum.photos/300/200?random=2',
    avatar: 'https://picsum.photos/100/100?random=2',
    memberCount: 892,
    postCount: 156,
    tags: ['音乐', '分享', '推荐'],
    isJoined: false
  },
  {
    id: 3,
    name: '旅行日记',
    description: '记录旅行足迹，分享旅行攻略',
    cover: 'https://picsum.photos/300/200?random=3',
    avatar: 'https://picsum.photos/100/100?random=3',
    memberCount: 2341,
    postCount: 234,
    tags: ['旅行', '攻略', '分享'],
    isJoined: false
  }
])

const myCommunities = ref([
  {
    id: 4,
    name: '编程技术交流',
    description: '分享编程经验，讨论技术问题',
    avatar: 'https://picsum.photos/100/100?random=4',
    memberCount: 567,
    postCount: 45,
    lastActivity: '2024-01-15 14:30:00',
    isOwner: true,
    isAdmin: false
  },
  {
    id: 5,
    name: '美食分享',
    description: '分享美食制作，交流烹饪技巧',
    avatar: 'https://picsum.photos/100/100?random=5',
    memberCount: 1234,
    postCount: 78,
    lastActivity: '2024-01-15 12:20:00',
    isOwner: false,
    isAdmin: true
  }
])

const hotTopics = ref([
  {
    id: 1,
    name: '今日心情',
    icon: '😊',
    postCount: 1234,
    participantCount: 567,
    trend: 15.6
  },
  {
    id: 2,
    name: '美食分享',
    icon: '🍕',
    postCount: 892,
    participantCount: 345,
    trend: 8.3
  },
  {
    id: 3,
    name: '旅行日记',
    icon: '✈️',
    postCount: 678,
    participantCount: 234,
    trend: 12.1
  },
  {
    id: 4,
    name: '摄影作品',
    icon: '📸',
    postCount: 456,
    participantCount: 189,
    trend: 6.7
  }
])

const categories = ref([
  { id: 1, name: '摄影', icon: 'Camera', communityCount: 156 },
  { id: 2, name: '音乐', icon: 'Mic', communityCount: 89 },
  { id: 3, name: '游戏', icon: 'Monitor', communityCount: 234 },
  { id: 4, name: '读书', icon: 'Document', communityCount: 67 },
  { id: 5, name: '运动', icon: 'StarFilled', communityCount: 123 },
  { id: 6, name: '旅行', icon: 'Location', communityCount: 178 },
  { id: 7, name: '工作', icon: 'Briefcase', communityCount: 45 },
  { id: 8, name: '其他', icon: 'Star', communityCount: 89 }
])

// 方法
const goBack = () => {
  router.back()
}

const showSearch = () => {
  showSearchDialog.value = true
}

const createCommunity = () => {
  ElMessage.info('创建圈子功能开发中...')
}

const viewAllRecommended = () => {
  ElMessage.info('查看更多推荐圈子')
}

const manageCommunities = () => {
  ElMessage.info('管理圈子功能开发中...')
}

const exploreCommunities = () => {
  showSearchDialog.value = true
}

const viewCommunity = (community: any) => {
  router.push(`/community/${community.id}`)
}

const viewTopic = (topic: any) => {
  router.push(`/topic/${topic.id}`)
}

const viewCategory = (category: any) => {
  router.push(`/category/${category.id}`)
}

const viewAllTopics = () => {
  ElMessage.info('查看更多话题')
}

const performSearch = () => {
  // 模拟搜索
  searchResults.value = [
    {
      id: 101,
      name: '搜索结果1',
      description: '这是一个搜索到的圈子',
      avatar: 'https://picsum.photos/100/100?random=101',
      memberCount: 123,
      postCount: 45,
      isJoined: false
    },
    {
      id: 102,
      name: '搜索结果2',
      description: '这是另一个搜索到的圈子',
      avatar: 'https://picsum.photos/100/100?random=102',
      memberCount: 456,
      postCount: 78,
      isJoined: true
    }
  ]
}

const joinCommunity = (community: any) => {
  community.isJoined = true
  ElMessage.success(`已加入圈子「${community.name}」`)
}
</script>

<style lang="scss" scoped>
.community-home-page {
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

.recommended-section, .my-communities-section, .topics-section, .categories-section {
  padding: 0 20px;
  margin-bottom: 30px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .el-button {
      color: #8b5cf6;
      font-size: 14px;
    }
  }
}

.recommended-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;

  .community-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(196, 181, 253, 0.2);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(139, 92, 246, 0.2);
    }

    .card-image {
      position: relative;
      height: 120px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .card-overlay {
        position: absolute;
        top: 10px;
        right: 10px;

        .member-count {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
        }
      }
    }

    .card-content {
      padding: 20px;

      .community-name {
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 8px;
      }

      .community-desc {
        font-size: 14px;
        color: #64748b;
        line-height: 1.4;
        margin-bottom: 12px;
      }

      .community-tags {
        display: flex;
        gap: 8px;

        .tag {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
      }
    }
  }
}

.my-communities-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .community-item {
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

    .community-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }

    .community-info {
      flex: 1;
      min-width: 0;

      .community-name {
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 5px;
      }

      .community-stats {
        font-size: 13px;
        color: #64748b;
        margin-bottom: 5px;

        span {
          margin-right: 15px;
        }
      }

      .community-last-activity {
        font-size: 12px;
        color: #94a3b8;
      }
    }

    .community-status {
      .owner-badge {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }

      .admin-badge {
        background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }

      .member-badge {
        background: rgba(139, 92, 246, 0.1);
        color: #8b5cf6;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }
    }
  }
}

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

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .topic-item {
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

    .topic-icon {
      font-size: 32px;
      width: 50px;
      text-align: center;
    }

    .topic-info {
      flex: 1;

      .topic-name {
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 5px;
      }

      .topic-stats {
        font-size: 13px;
        color: #64748b;

        span {
          margin-right: 15px;
        }
      }
    }

    .topic-trend {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #10b981;
      font-size: 14px;
      font-weight: 600;
    }
  }
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;

  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px 15px;
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

    .category-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(139, 92, 246, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #8b5cf6;
      font-size: 20px;
    }

    .category-name {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      text-align: center;
    }

    .category-count {
      font-size: 12px;
      color: #64748b;
      text-align: center;
    }
  }
}

.search-dialog {
  .search-content {
    .search-input {
      margin-bottom: 20px;

      .el-input {
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

    .search-filters {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;

      .el-select {
        flex: 1;

        .el-select__input {
          border-radius: 12px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.1);
          color: #334155;
        }
      }
    }

    .search-results {
      .no-results {
        text-align: center;
        padding: 40px 20px;
        color: #64748b;

        .no-results-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .no-results-text {
          font-size: 16px;
        }
      }

      .results-list {
        display: flex;
        flex-direction: column;
        gap: 15px;

        .result-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(139, 92, 246, 0.1);
          }

          .result-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
          }

          .result-info {
            flex: 1;

            .result-name {
              font-size: 15px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 5px;
            }

            .result-desc {
              font-size: 13px;
              color: #64748b;
              margin-bottom: 5px;
            }

            .result-stats {
              font-size: 12px;
              color: #94a3b8;

              span {
                margin-right: 10px;
              }
            }
          }

          .el-button {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            border: none;
            color: white;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 16px;
            font-size: 13px;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 3px 10px rgba(139, 92, 246, 0.3);
            }
          }

          .joined-badge {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
            padding: 8px 16px;
            border-radius: 16px;
            font-size: 13px;
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
