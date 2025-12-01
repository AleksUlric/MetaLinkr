<template>
  <div class="soul-profile-page">
    <!-- Soul风格顶部状态栏 -->
    <div class="soul-status-bar">
      <div class="status-left">
        <div class="time-info">
          <span class="time">{{ currentTime }}</span>
          <span class="date">{{ currentDate }}</span>
        </div>
      </div>
      <div class="status-right">
        <div class="nav-icons">
          <div class="icon-btn" @click="showSettings">
            <el-icon><Setting /></el-icon>
          </div>
          <div class="icon-btn" @click="showMore">
            <el-icon><MoreFilled /></el-icon>
          </div>
        </div>
        <div class="ip-location">
          <span>IP属地:浙江</span>
          <el-icon><QuestionFilled /></el-icon>
        </div>
      </div>
    </div>

    <!-- Soul风格访问提示横幅 -->
    <div class="visit-banner">
      <div class="banner-content">
        <div class="visitor-avatars">
          <div class="avatar-item"></div>
          <div class="avatar-item"></div>
        </div>
        <div class="banner-text">
          <span>Ta 疯狂访问了你25次 立即揭秘></span>
        </div>
        <div class="close-btn" @click="closeBanner">
          <el-icon><Close /></el-icon>
        </div>
      </div>
    </div>

    <!-- Soul风格用户资料卡片 -->
    <div class="soul-profile-card">
      <div class="profile-background">
        <div class="bg-pattern"></div>
        <div class="bg-gradient"></div>
      </div>
      
      <div class="profile-content">
        <div class="avatar-section">
          <div class="avatar-container">
            <el-avatar :src="userAvatarUrl" :size="90" />
            <div class="online-status"></div>
            <div class="vip-badge" v-if="isVip">VIP</div>
            <div class="edit-avatar-btn" @click="editProfile">
              <el-icon><Camera /></el-icon>
            </div>
          </div>
          <div class="user-info">
            <h2 class="username">
              {{ getUserData.nickname || '无可奈何花落去' }}
              <el-icon class="edit-name"><Edit /></el-icon>
            </h2>
            <div class="user-meta" v-if="userAge || userLocation">
              <span v-if="userAge">{{ userAge }}岁</span>
              <span v-if="userLocation" class="location-info">
                <el-icon><Location /></el-icon>
                {{ userLocation }}
              </span>
            </div>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-value">47</span>
                <span class="stat-label">关注</span>
            </div>
              <div class="stat-item">
                <span class="stat-value">22</span>
                <span class="stat-label">被关注</span>
          </div>
              <div class="stat-item">
                <span class="stat-value">16035</span>
                <span class="stat-label">看过我</span>
                <div class="new-badge">+136</div>
        </div>
            </div>
            <div class="user-badges">
              <div class="badge-item">
                <div class="badge-icon">🌍</div>
                <span>星球见习生</span>
          </div>
              <div class="badge-item">
                <div class="badge-icon">🔍</div>
                <span>务实家</span>
            </div>
              <div class="badge-item">
                <div class="badge-icon">📅</div>
                <span>2599天</span>
          </div>
            </div>
            <div class="user-interests" v-if="userInterests.length > 0">
              <span 
                v-for="interest in userInterests" 
                :key="interest" 
                class="interest-tag"
              >
                {{ interest }}
              </span>
              <div class="add-interest-btn" @click="editProfile">
                <el-icon><Plus /></el-icon>
              </div>
            </div>
            <div class="user-interests" v-else>
              <div class="add-interest-btn" @click="editProfile">
                <el-icon><Plus /></el-icon>
                <span>添加兴趣爱好</span>
              </div>
            </div>
            <div class="user-bio" v-if="userBio">
              <p>{{ userBio }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Soul风格功能导航 -->
    <div class="soul-feature-nav">
      <div class="feature-item">
        <div class="feature-icon">📦</div>
        <span>数字藏馆</span>
        </div>
      <div class="feature-item">
        <div class="feature-icon">💰</div>
        <span>Soul币中心</span>
            </div>
      <div class="feature-item active">
        <div class="feature-icon">⭐</div>
        <span>超级星人</span>
        <div class="active-indicator"></div>
          </div>
      <div class="feature-item">
        <div class="feature-icon">🏪</div>
        <span>个性商城</span>
            </div>
      <div class="feature-item">
        <div class="feature-icon">🎮</div>
        <span>娱乐中心</span>
        </div>
      </div>

    <!-- Soul风格积分通知 -->
    <div class="points-notification">
      <div class="notification-icon">📹</div>
      <div class="notification-text">
        <span>今日你有108积分已到账 去换soul币 ></span>
        </div>
      </div>

    <!-- Soul风格内容标签 -->
    <div class="content-tabs">
      <div class="tab-item active">
        <span>瞬间 5</span>
        </div>
      <div class="tab-item">
        <span>收藏</span>
        <el-icon><Lock /></el-icon>
            </div>
      <div class="tab-item">
        <span>赞过</span>
        </div>
      </div>

    <!-- Soul风格动态内容 -->
    <div class="soul-content-section">
      <div class="content-header">
        <span>全部</span>
        <div class="add-content-btn">
          <el-icon><Plus /></el-icon>
      </div>
    </div>

      <div class="content-list">
        <div class="content-item">
          <div class="content-meta">
            <span class="content-time">2025-09-16 13:40:40</span>
            <div class="content-stats">
              <span class="view-count">2.1k浏览</span>
              <el-icon class="more-btn"><MoreFilled /></el-icon>
      </div>
          </div>
          <div class="content-text">
            嗨,大家好!我是小A,28岁,本科毕业,身高176cm,体重140斤。目前定居杭州(之前在上海工作4-5年),主业是软件研发架构师,双休稳定,月薪2w左右。副业开了个网...
          </div>
        </div>
      </div>
    </div>

    <!-- Soul风格底部导航占位 -->
    <div class="bottom-spacer"></div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'
import { getUserAvatarUrl } from '@/utils/avatar'
import { get } from '@/utils/request'
import { 
  Setting,
  MoreFilled,
  QuestionFilled,
  Close,
  Camera,
  Edit,
  Plus,
  Lock,
  Location
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

// 获取用户信息（优先从authStore.user，因为它是从后端获取的最新信息）
const getUserData = computed(() => {
  const profile = userStore.profile as any
  const authUser = authStore.user as any
  
  // 优先使用authStore中的user数据（从后端获取的最新信息）
  if (authUser) {
    return {
      ...authUser,
      interests: authUser.interests || (authUser.interests ? authUser.interests.split(',') : [])
    }
  }
  
  // 如果authStore.user不存在，再使用userStore.profile（但需要确保不是mock数据）
  if (profile && profile.nickname && profile.nickname !== '灵魂旅人') {
    return profile
  }
  
  return profile || {}
})

// 计算用户头像URL（自动处理 OSS 默认头像转换）
const userAvatarUrl = computed(() => {
  const userData = getUserData.value
  return getUserAvatarUrl(userData?.avatar, userData?.gender || 'male')
})

// 计算用户年龄（从生日计算）
const userAge = computed(() => {
  const userData = getUserData.value
  if (userData?.birthday) {
    const birthDate = new Date(userData.birthday)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }
  return null
})

// 用户兴趣爱好
const userInterests = computed(() => {
  const userData = getUserData.value
  if (Array.isArray(userData?.interests)) {
    return userData.interests
  }
  if (typeof userData?.interests === 'string' && userData.interests) {
    return userData.interests.split(',').filter(Boolean)
  }
  return []
})

// 用户个人简介
const userBio = computed(() => {
  const userData = getUserData.value
  return userData?.bio || ''
})

// 用户位置
const userLocation = computed(() => {
  const userData = getUserData.value
  return userData?.location || ''
})

// 响应式数据
const currentTime = ref('1:42')
const currentDate = ref('10月9日周四')
const showEditDialog = ref(false)
const isVip = ref(true)
const showBanner = ref(true)

// 编辑表单（已废弃，现在直接跳转到编辑页面）


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
const showSettings = () => {
  ElMessage.info('设置功能开发中...')
}

const showMore = () => {
  ElMessage.info('更多功能开发中...')
}

const closeBanner = () => {
  showBanner.value = false
}

const editProfile = () => {
  router.push('/app/profile/edit')
}

// const saveProfile = () => {
//   // 保存用户资料
//   userStore.updateProfile(editForm.value)
//   showEditDialog.value = false
//   ElMessage.success('资料保存成功')
// }

// 加载用户信息
const loadUserProfile = async () => {
  try {
    // 从API获取用户详细信息
    const profileData = await get<any>('/api/user/profile')
    if (profileData) {
      // 更新userStore的profile
      if (userStore.profile) {
        Object.assign(userStore.profile, {
          nickname: profileData.nickname,
          avatar: profileData.avatar,
          gender: profileData.gender,
          birthday: profileData.birthday,
          location: profileData.location,
          bio: profileData.bio,
          interests: Array.isArray(profileData.interests) 
            ? profileData.interests 
            : (profileData.interests ? profileData.interests.split(',') : [])
        })
      } else {
        // 如果profile不存在，创建一个
        userStore.profile = {
          ...profileData,
          interests: Array.isArray(profileData.interests) 
            ? profileData.interests 
            : (profileData.interests ? profileData.interests.split(',') : [])
        } as any
      }
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

onMounted(async () => {
  updateTime()
  
  // 加载用户信息
  await loadUserProfile()
  
  // 每秒更新时间
  const timeInterval = setInterval(updateTime, 1000)
  
  onUnmounted(() => {
    clearInterval(timeInterval)
  })
})
</script>

<style lang="scss" scoped>
.soul-profile-page {
  background: #ffffff;
  min-height: 100vh;
  color: #333333;
  position: relative;
}

// Soul风格顶部状态栏
.soul-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
    top: 0;
  z-index: 100;

  .status-left {
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

  .status-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .nav-icons {
      display: flex;
      gap: 12px;

      .icon-btn {
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

    .ip-location {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #666666;
    }
  }
}

// Soul风格访问提示横幅
.visit-banner {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  margin: 16px 20px;
  border-radius: 12px;
  overflow: hidden;

  .banner-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;

    .visitor-avatars {
      display: flex;
      gap: -4px;

      .avatar-item {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #ff6b6b;
        border: 2px solid #ffffff;
        margin-left: -4px;

        &:first-child {
          margin-left: 0;
        }

        &:nth-child(2) {
          background: #4ecdc4;
        }
      }
    }

    .banner-text {
      flex: 1;
      font-size: 14px;
      color: #856404;
    }

    .close-btn {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #856404;

      &:hover {
        background: rgba(0, 0, 0, 0.2);
      }
    }
  }
}

// Soul风格用户资料卡片
.soul-profile-card {
  position: relative;
  margin: 16px 20px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  .profile-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);

    .bg-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(0,0,0,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
      opacity: 0.5;
    }

    .bg-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 249, 250, 0.8) 100%);
    }
  }

  .profile-content {
    position: relative;
    z-index: 2;
    padding: 32px 24px;
    color: #333333;

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;

      .avatar-container {
        position: relative;

        .online-status {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          background: #10b981;
          border: 3px solid white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .vip-badge {
          position: absolute;
          top: -8px;
          left: -8px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
        }

        .edit-avatar-btn {
          position: absolute;
          bottom: -4px;
          left: -4px;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #374151;

          &:hover {
            background: white;
            transform: scale(1.1);
          }
        }
      }

      .user-info {
        flex: 1;

        .username {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #333333;
          display: flex;
          align-items: center;
          gap: 8px;

          .edit-name {
            font-size: 16px;
            color: #666666;
            cursor: pointer;
            transition: color 0.3s ease;

            &:hover {
              color: #4facfe;
            }
          }
        }

        .user-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #666666;

          .location-info {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }

        .user-stats {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;

          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;

          .stat-value {
              font-size: 18px;
            font-weight: 700;
              color: #333333;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 12px;
              color: #666666;
            }

            .new-badge {
              position: absolute;
              top: -4px;
              right: -8px;
              background: #ff4757;
              color: white;
              font-size: 10px;
              font-weight: 700;
              padding: 2px 6px;
              border-radius: 8px;
              border: 2px solid #ffffff;
            }
          }
        }

        .user-badges {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;

          .badge-item {
        display: flex;
        align-items: center;
            gap: 6px;
            background: rgba(79, 172, 254, 0.1);
            color: #4facfe;
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            border: 1px solid rgba(79, 172, 254, 0.2);

            .badge-icon {
              font-size: 14px;
            }
          }
        }

        .user-interests {
      display: flex;
          gap: 8px;
          flex-wrap: wrap;
      align-items: center;

          .interest-tag {
            background: #f8f9fa;
            color: #666666;
            padding: 6px 12px;
        border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
            border: 1px solid #e9ecef;
          }

          .add-interest-btn {
            min-width: 32px;
            height: 32px;
            padding: 0 12px;
            border-radius: 16px;
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: #666666;
            border: 1px solid #e9ecef;
            font-size: 12px;

            &:hover {
              background: #4facfe;
              color: white;
              border-color: #4facfe;
            }
          }
        }

        .user-bio {
          margin-top: 16px;
          padding: 12px;
          background: rgba(79, 172, 254, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(79, 172, 254, 0.1);

          p {
            margin: 0;
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
          }
        }

      }
    }
  }
}

// Soul风格功能导航
.soul-feature-nav {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    padding: 8px;

    .feature-icon {
      font-size: 24px;
      margin-bottom: 4px;
    }

    span {
      font-size: 12px;
      color: #666666;
      font-weight: 500;
    }

    &.active {
        span {
        color: #4facfe;
          font-weight: 600;
        }

      .active-indicator {
          position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 3px;
        background: #4facfe;
        border-radius: 2px;
      }
    }

    &:hover {
      transform: translateY(-2px);

      .feature-icon {
        transform: scale(1.1);
      }
    }
  }
}

// Soul风格积分通知
.points-notification {
      display: flex;
      align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: #f8f9fa;
  margin: 0 20px;
  border-radius: 12px;
  border: 1px solid #e9ecef;

  .notification-icon {
    font-size: 20px;
  }

  .notification-text {
    flex: 1;
    font-size: 14px;
    color: #666666;
  }
}

// Soul风格内容标签
.content-tabs {
  display: flex;
  padding: 0 20px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  .tab-item {
        display: flex;
        align-items: center;
    gap: 4px;
    padding: 16px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    font-size: 14px;
    color: #666666;
    font-weight: 500;

    &.active {
      color: #4facfe;
          font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: #4facfe;
        border-radius: 2px 2px 0 0;
      }
    }

    &:hover {
      color: #333333;
    }

    .el-icon {
      font-size: 12px;
    }
  }
}

// Soul风格动态内容
.soul-content-section {
  padding: 20px;

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    span {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
    }

    .add-content-btn {
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
        background: #4facfe;
        color: white;
      }
    }
  }

  .content-list {
    .content-item {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      border: 1px solid #e9ecef;

      .content-meta {
      display: flex;
        justify-content: space-between;
      align-items: center;
        margin-bottom: 12px;

        .content-time {
          font-size: 12px;
          color: #999999;
        }

        .content-stats {
          display: flex;
          align-items: center;
        gap: 8px;

          .view-count {
            font-size: 12px;
            color: #666666;
          }

          .more-btn {
          font-size: 16px;
            color: #666666;
            cursor: pointer;
            transition: color 0.3s ease;

            &:hover {
              color: #333333;
            }
          }
        }
      }

      .content-text {
            font-size: 14px;
        line-height: 1.6;
        color: #333333;
      }
    }
  }
}

// 底部占位
.bottom-spacer {
  height: 80px;
}
</style>

