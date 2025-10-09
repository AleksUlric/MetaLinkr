<template>
  <div class="post-detail">
    <div class="post-header">
      <el-button type="text" :icon="ArrowLeft" @click="goBack" />
      <h1 class="page-title">动态详情</h1>
      <el-button type="text" :icon="MoreFilled" />
    </div>
    
    <div class="post-content">
      <div class="post-item">
        <div class="post-header">
          <div class="user-info">
            <el-avatar :src="post.user.avatar" :size="40" />
            <div class="user-details">
              <h3 class="username">{{ post.user.name }}</h3>
              <p class="post-time">{{ formatTime(post.createdAt) }}</p>
            </div>
          </div>
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
          <el-button type="text" :icon="ChatDotRound" @click="showComments()">
            {{ post.commentCount }}
          </el-button>
          <el-button type="text" :icon="Share" @click="sharePost()">
            {{ post.shareCount }}
          </el-button>
          <el-button 
            type="text" 
            :class="{ liked: post.isLiked }"
            @click="likePost()"
          >
            <el-icon>
              <StarFilled v-if="post.isLiked" />
              <Star v-else />
            </el-icon>
            {{ post.likeCount }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, MoreFilled, ChatDotRound, Share, Star, StarFilled } from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const router = useRouter()
const route = useRoute()

const post = ref({
  id: route.params.id as string,
  user: {
    id: '1',
    name: '用户',
    avatar: 'https://via.placeholder.com/40'
  },
  content: '这是一条动态内容',
  images: ['https://via.placeholder.com/300x200'],
  likeCount: 12,
  commentCount: 3,
  shareCount: 1,
  isLiked: false,
  createdAt: Date.now() - 3600000
})

// 格式化时间
const formatTime = (timestamp: number) => {
  return formatDistanceToNow(new Date(timestamp), { 
    addSuffix: true, 
    locale: zhCN 
  })
}

// 点赞动态
const likePost = () => {
  post.value.isLiked = !post.value.isLiked
  post.value.likeCount += post.value.isLiked ? 1 : -1
}

// 分享动态
const sharePost = () => {
  console.log('分享动态:', post.value.id)
}

// 显示评论
const showComments = () => {
  console.log('显示评论')
}

const goBack = () => {
  router.back()
}

// 初始化数据
onMounted(() => {
  // 根据路由参数获取动态详情
  console.log('动态ID:', post.value.id)
})
</script>

<style scoped lang="scss">
.post-detail {
  height: 100vh;
  background-color: #f5f5f5;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  
  .page-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }
}

.post-content {
  padding: 16px 20px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.post-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
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
  .post-detail {
    background-color: #1a1a1a;
  }
  
  .post-header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .page-title {
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
