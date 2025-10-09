<template>
  <div class="discover-home">
    <!-- 顶部导航 -->
    <div class="header">
      <h1 class="title">发现</h1>
      <div class="header-actions">
        <el-button type="text" :icon="Search" @click="search" />
      </div>
    </div>
    
    <!-- 发现内容 -->
    <div class="discover-container">
      <!-- 搜索栏 -->
      <div class="search-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户、动态、话题..."
          :prefix-icon="Search"
          @keyup.enter="handleSearch"
        />
      </div>
      
      <!-- 热门话题 -->
      <div class="section">
        <div class="section-title">热门话题</div>
        <div class="topic-list">
          <div 
            v-for="topic in hotTopics" 
            :key="topic.id" 
            class="topic-item"
            @click="viewTopic(topic)"
          >
            <div class="topic-icon">
              <el-icon :size="24" :color="topic.color">
                <component :is="topic.icon" />
              </el-icon>
            </div>
            <div class="topic-info">
              <h3 class="topic-name">{{ topic.name }}</h3>
              <p class="topic-count">{{ topic.count }}条动态</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 推荐用户 -->
      <div class="section">
        <div class="section-title">推荐用户</div>
        <div class="user-list">
          <div 
            v-for="user in recommendedUsers" 
            :key="user.id" 
            class="user-item"
            @click="viewUser(user)"
          >
            <el-avatar :src="user.avatar" :size="50" />
            <div class="user-info">
              <h3 class="user-name">{{ user.name }}</h3>
              <p class="user-bio">{{ user.bio }}</p>
            </div>
            <el-button 
              type="primary" 
              size="small"
              @click.stop="followUser(user)"
            >
              {{ user.isFollowed ? '已关注' : '关注' }}
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 附近的人 -->
      <div class="section">
        <div class="section-title">附近的人</div>
        <div class="nearby-list">
          <div 
            v-for="user in nearbyUsers" 
            :key="user.id" 
            class="nearby-item"
            @click="viewUser(user)"
          >
            <el-avatar :src="user.avatar" :size="40" />
            <div class="user-info">
              <h3 class="user-name">{{ user.name }}</h3>
              <p class="user-distance">{{ user.distance }}km</p>
            </div>
            <div class="user-status">
              <div v-if="user.isOnline" class="online-indicator"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Star, Heart, Music, Game, Camera } from '@element-plus/icons-vue'

const router = useRouter()
const searchKeyword = ref('')

// 热门话题
const hotTopics = ref([
  { id: '1', name: '旅行', icon: 'Star', color: '#ff6b6b', count: 1234 },
  { id: '2', name: '美食', icon: 'Heart', color: '#52c41a', count: 856 },
  { id: '3', name: '音乐', icon: 'Music', color: '#1890ff', count: 642 },
  { id: '4', name: '游戏', icon: 'Game', color: '#722ed1', count: 423 },
  { id: '5', name: '摄影', icon: 'Camera', color: '#fa8c16', count: 321 }
])

// 推荐用户
const recommendedUsers = ref([
  {
    id: '1',
    name: '小雨',
    avatar: 'https://via.placeholder.com/50',
    bio: '喜欢旅行和摄影',
    isFollowed: false
  },
  {
    id: '2',
    name: '阳光',
    avatar: 'https://via.placeholder.com/50',
    bio: '程序员，热爱运动',
    isFollowed: false
  },
  {
    id: '3',
    name: '月亮',
    avatar: 'https://via.placeholder.com/50',
    bio: '音乐爱好者',
    isFollowed: true
  }
])

// 附近的人
const nearbyUsers = ref([
  {
    id: '1',
    name: '张三',
    avatar: 'https://via.placeholder.com/40',
    distance: 0.5,
    isOnline: true
  },
  {
    id: '2',
    name: '李四',
    avatar: 'https://via.placeholder.com/40',
    distance: 1.2,
    isOnline: false
  },
  {
    id: '3',
    name: '王五',
    avatar: 'https://via.placeholder.com/40',
    distance: 2.1,
    isOnline: true
  }
])

// 搜索
const search = () => {
  console.log('搜索')
}

// 处理搜索
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    console.log('搜索:', searchKeyword.value)
  }
}

// 查看话题
const viewTopic = (topic: any) => {
  console.log('查看话题:', topic.name)
}

// 查看用户
const viewUser = (user: any) => {
  router.push(`/user/${user.id}`)
}

// 关注用户
const followUser = (user: any) => {
  user.isFollowed = !user.isFollowed
  console.log(user.isFollowed ? '关注' : '取消关注', user.name)
}

// 初始化数据
onMounted(() => {
  // 可以在这里加载更多数据
})
</script>

<style scoped lang="scss">
.discover-home {
  height: 100%;
  background-color: #f5f5f5;
  padding-bottom: 80px; // 为底部导航栏留出空间
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

.discover-container {
  padding: 20px;
}

.search-section {
  margin-bottom: 24px;
}

.section {
  margin-bottom: 32px;
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
  }
}

.topic-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.topic-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  .topic-icon {
    margin-bottom: 8px;
  }
  
  .topic-info {
    .topic-name {
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #333;
    }
    
    .topic-count {
      font-size: 12px;
      color: #999;
      margin: 0;
    }
  }
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  .user-info {
    flex: 1;
    margin-left: 12px;
    
    .user-name {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #333;
    }
    
    .user-bio {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }
}

.nearby-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nearby-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  .user-info {
    flex: 1;
    margin-left: 12px;
    
    .user-name {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #333;
    }
    
    .user-distance {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
  }
  
  .user-status {
    position: relative;
    
    .online-indicator {
      width: 12px;
      height: 12px;
      background: #52c41a;
      border: 2px solid white;
      border-radius: 50%;
    }
  }
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .discover-home {
    background-color: #1a1a1a;
  }
  
  .header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .title {
      color: #fff;
    }
  }
  
  .section .section-title {
    color: #fff;
  }
  
  .topic-item {
    background: #2a2a2a;
    
    .topic-info {
      .topic-name {
        color: #fff;
      }
      
      .topic-count {
        color: #aaa;
      }
    }
  }
  
  .user-item, .nearby-item {
    background: #2a2a2a;
    
    .user-info {
      .user-name {
        color: #fff;
      }
      
      .user-bio, .user-distance {
        color: #aaa;
      }
    }
  }
}
</style>