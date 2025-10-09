<template>
  <div class="home-feed">
    <!-- 顶部导航 -->
    <div class="header">
      <h1 class="title">广场</h1>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" circle @click="createPost" />
      </div>
    </div>
    
    <!-- 动态列表 -->
    <div class="feed-container">
      <div v-for="post in posts" :key="post.id" class="post-item">
        <div class="post-header">
          <div class="user-info">
            <el-avatar :src="post.user.avatar" :size="40" />
            <div class="user-details">
              <h3 class="username">{{ post.user.name }}</h3>
              <p class="post-time">{{ formatTime(post.createdAt) }}</p>
            </div>
          </div>
          <el-button type="text" :icon="MoreFilled" />
        </div>
        
        <div class="post-content">
          <p class="post-text">{{ post.content }}</p>
          <div v-if="post.images.length > 0" class="post-images">
            <el-image
              v-for="(image, index) in post.images"
              :key="index"
              :src="image"
              :preview-src-list="post.images"
              fit="cover"
              class="post-image"
            />
          </div>
        </div>
        
        <div class="post-actions">
          <el-button type="text" :icon="ChatDotRound" @click="likePost(post.id)">
            {{ post.commentCount }}
          </el-button>
          <el-button type="text" :icon="Share" @click="sharePost(post.id)">
            {{ post.shareCount }}
          </el-button>
          <el-button 
            type="text" 
            :icon="post.isLiked ? 'StarFilled' : 'Star'" 
            :class="{ liked: post.isLiked }"
            @click="likePost(post.id)"
          >
            {{ post.likeCount }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, MoreFilled, ChatDotRound, Share, Star, StarFilled } from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Post {
  id: string
  user: {
    id: string
    name: string
    avatar: string
  }
  content: string
  images: string[]
  likeCount: number
  commentCount: number
  shareCount: number
  isLiked: boolean
  createdAt: number
}

const posts = ref<Post[]>([])

// 模拟数据
const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      id: '1',
      name: '小雨',
      avatar: 'https://via.placeholder.com/40'
    },
    content: '今天天气真好，出去走走～',
    images: ['https://via.placeholder.com/300x200'],
    likeCount: 12,
    commentCount: 3,
    shareCount: 1,
    isLiked: false,
    createdAt: Date.now() - 3600000
  },
  {
    id: '2',
    user: {
      id: '2',
      name: '阳光',
      avatar: 'https://via.placeholder.com/40'
    },
    content: '分享一首好听的歌',
    images: [],
    likeCount: 8,
    commentCount: 2,
    shareCount: 0,
    isLiked: true,
    createdAt: Date.now() - 7200000
  }
]

// 格式化时间
const formatTime = (timestamp: number) => {
  return formatDistanceToNow(new Date(timestamp), { 
    addSuffix: true, 
    locale: zhCN 
  })
}

// 创建动态
const createPost = () => {
  console.log('创建动态')
}

// 点赞动态
const likePost = (postId: string) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.isLiked = !post.isLiked
    post.likeCount += post.isLiked ? 1 : -1
  }
}

// 分享动态
const sharePost = (postId: string) => {
  console.log('分享动态:', postId)
}

// 初始化数据
onMounted(() => {
  posts.value = mockPosts
})
</script>

<style scoped lang="scss">
.home-feed {
  height: 100%;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  
  .title {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }
}

.feed-container {
  padding: 16px 20px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.post-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .user-info {
      display: flex;
      align-items: center;
      
      .user-details {
        margin-left: 12px;
        
        .username {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #333;
        }
        
        .post-time {
          font-size: 12px;
          color: #999;
          margin: 0;
        }
      }
    }
  }
  
  .post-content {
    margin-bottom: 16px;
    
    .post-text {
      font-size: 16px;
      line-height: 1.5;
      color: #333;
      margin: 0 0 12px 0;
    }
    
    .post-images {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      
      .post-image {
        width: 120px;
        height: 120px;
        border-radius: 8px;
      }
    }
  }
  
  .post-actions {
    display: flex;
    justify-content: space-around;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
    
    .el-button {
      color: #666;
      
      &.liked {
        color: #ff6b6b;
      }
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .home-feed {
    background-color: #1a1a1a;
  }
  
  .header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .title {
      color: #fff;
    }
  }
  
  .post-item {
    background: #2a2a2a;
    
    .post-header .user-info .user-details {
      .username {
        color: #fff;
      }
      
      .post-time {
        color: #aaa;
      }
    }
    
    .post-content .post-text {
      color: #fff;
    }
    
    .post-actions {
      border-top-color: #333;
      
      .el-button {
        color: #aaa;
        
        &.liked {
          color: #ff6b6b;
        }
      }
    }
  }
}
</style>