import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  // 启动页
  {
    path: '/splash',
    name: 'SplashScreen',
    component: () => import('@/views/auth/SplashScreen.vue'),
    meta: { requiresAuth: false, hideNavBar: true }
  },
  
  // 登录页
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false, hideNavBar: true }
  },
  
  // 完善个人信息页
  {
    path: '/complete-profile',
    name: 'CompleteProfile',
    component: () => import('@/views/profile/CompleteProfile.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // Soul风格主应用布局
  {
    path: '/app',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/app/planet',
    meta: { requiresAuth: true },
    children: [
      // Soul风格星球页面（主页面）
      {
        path: 'planet',
        name: 'Planet',
        component: () => import('@/views/planet/PlanetHome.vue'),
        meta: { 
          title: '星球', 
          icon: 'Star',
          tabBar: true,
          keepAlive: true
        }
      },
      // Soul风格广场页面
      {
        path: 'square',
        name: 'Square',
        component: () => import('@/views/square/SquareHome.vue'),
        meta: { 
          title: '广场', 
          icon: 'HomeFilled',
          tabBar: true,
          keepAlive: true
        }
      },
      // Soul风格聊天页面
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/views/chat/ChatList.vue'),
        meta: { 
          title: '聊天', 
          icon: 'ChatDotRound',
          tabBar: true,
          keepAlive: true
        }
      },
      // Soul风格个人中心
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/UserProfile.vue'),
        meta: { 
          title: '自己', 
          icon: 'User',
          tabBar: true,
          keepAlive: true
        }
      }
    ]
  },

  // 聊天相关页面
  {
    path: '/chat/:id',
    name: 'ChatDetail',
    component: () => import('@/views/chat/ChatDetail.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/chat-group/:id',
    name: 'ChatGroup',
    component: () => import('@/views/chat/ChatGroup.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // 匹配相关页面
  {
    path: '/match/soul',
    name: 'SoulMatch',
    component: () => import('@/views/match/SoulMatch.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/match/voice',
    name: 'VoiceMatch',
    component: () => import('@/views/match/VoiceMatch.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/match/swipe',
    name: 'MatchSwipe',
    component: () => import('@/views/match/MatchSwipe.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/match/result/:id',
    name: 'MatchResult',
    component: () => import('@/views/match/MatchResult.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // 语音社交页面
  {
    path: '/voice/room/:id',
    name: 'VoiceRoom',
    component: () => import('@/views/voice/VoiceRoom.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/voice/party/:id',
    name: 'VoiceParty',
    component: () => import('@/views/voice/VoiceParty.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // 视频通话页面
  {
    path: '/video-call/:id',
    name: 'VideoCall',
    component: () => import('@/views/call/VideoCall.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/voice-call/:id',
    name: 'VoiceCall',
    component: () => import('@/views/call/VoiceCall.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // 动态相关页面
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('@/views/post/PostDetail.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/post/create',
    name: 'CreatePost',
    component: () => import('@/views/post/CreatePost.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // 用户相关页面
  {
    path: '/user/:id',
    name: 'UserProfile',
    component: () => import('@/views/user/UserProfile.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/profile/edit',
    name: 'EditProfile',
    component: () => import('@/views/profile/EditProfile.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/profile/achievements',
    name: 'Achievements',
    component: () => import('@/views/profile/Achievements.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // 设置页面
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/SettingsHome.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/settings/privacy',
    name: 'PrivacySettings',
    component: () => import('@/views/settings/PrivacySettings.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/settings/notification',
    name: 'NotificationSettings',
    component: () => import('@/views/settings/NotificationSettings.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // 游戏化功能页面
  {
    path: '/game',
    name: 'Game',
    component: () => import('@/views/game/GameHome.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/game/room/:id',
    name: 'GameRoom',
    component: () => import('@/views/game/GameRoom.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // 商城页面
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('@/views/shop/ShopHome.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/shop/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/shop/ProductDetail.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // 直播相关页面
  {
    path: '/live',
    name: 'Live',
    component: () => import('@/views/live/LiveHome.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/live/room/:id',
    name: 'LiveRoom',
    component: () => import('@/views/live/LiveRoom.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // 通知相关页面
  {
    path: '/notifications',
    name: 'NotificationCenter',
    component: () => import('@/views/notification/NotificationCenter.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // 社区相关页面
  {
    path: '/community',
    name: 'CommunityHome',
    component: () => import('@/views/community/CommunityHome.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/community/:id',
    name: 'CommunityDetail',
    component: () => import('@/views/community/CommunityDetail.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  // {
  //   path: '/topic/:id',
  //   name: 'TopicDetail',
  //   component: () => import('@/views/community/TopicDetail.vue'),
  //   meta: { requiresAuth: true, hideNavBar: true }
  // },
  // {
  //   path: '/category/:id',
  //   name: 'CategoryDetail',
  //   component: () => import('@/views/community/CategoryDetail.vue'),
  //   meta: { requiresAuth: true, hideNavBar: true }
  // },
  
  // 礼物相关页面
  {
    path: '/gift/shop',
    name: 'GiftShop',
    component: () => import('@/views/gift/GiftShop.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/gift/send/:id',
    name: 'GiftSend',
    component: () => import('@/views/gift/GiftSend.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // 连接相关页面
  {
    path: '/link',
    name: 'LinkHome',
    component: () => import('@/views/link/LinkHome.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/link/online',
    name: 'OnlineConnect',
    component: () => import('@/views/link/OnlineConnect.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  {
    path: '/link/offline',
    name: 'OfflineConnect',
    component: () => import('@/views/link/OfflineConnect.vue'),
    meta: { requiresAuth: true, hideNavBar: true }
  },
  
  // 认证相关页面
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { hideNavBar: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { hideNavBar: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: { hideNavBar: true }
  },
  
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFound.vue'),
    meta: { hideNavBar: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  try {
    // 获取用户store
    const { useAuthStore } = await import('../stores/auth')
    const authStore = useAuthStore()
    
    // 只在首次访问时初始化用户信息
    if (!authStore.user) {
      await authStore.initUser()
    }
    
    // 检查是否需要认证
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
      // 需要认证但未登录，跳转到登录页
      next('/login')
    } else if (authStore.isLoggedIn && authStore.user) {
      // 已登录用户，检查是否需要完善个人信息
      const isProfileComplete = Boolean(
        authStore.user.nickname?.trim() &&
        authStore.user.gender &&
        authStore.user.gender !== 'other' &&
        authStore.user.birthday
      )
      
      // 如果个人信息不完整且不是访问完善页面，跳转到完善页面
      if (!isProfileComplete && to.path !== '/complete-profile' && to.path !== '/login') {
        next('/complete-profile')
        return
      }
      
      // 如果个人信息已完善且访问完善页面，跳转到主页
      if (isProfileComplete && to.path === '/complete-profile') {
        next('/app/planet')
        return
      }
      
      next()
    } else {
      next()
    }
  } catch (error) {
    console.error('路由守卫错误:', error)
    // 发生错误时，允许访问登录页
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
