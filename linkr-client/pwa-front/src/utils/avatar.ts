/**
 * 头像工具函数
 */

// 默认头像URL缓存
const avatarUrlCache: Record<string, string> = {}

/**
 * 获取API基础URL（支持开发和生产环境）
 * @returns API基础URL
 */
function getApiBaseUrl(): string {
  // 在浏览器环境中，使用相对路径（通过 vite proxy 代理）
  if (typeof window !== 'undefined') {
    return '/api'
  }
  // 在 Node.js 环境中（如 SSR），使用完整URL
  return 'http://localhost:8082/api'
}

/**
 * 从后端获取默认头像URL（后端直接返回文件流）
 * @param gender 性别: 'male' | 'female' | 'other'
 * @returns 默认头像URL（后端流接口URL）
 */
export async function fetchDefaultAvatarUrl(gender: string = 'male'): Promise<string> {
  // 直接返回后端流接口URL，不需要额外API调用
  return getDefaultAvatarUrl(gender)
}

/**
 * 获取默认头像URL（后端直接返回文件流）
 * @param gender 性别: 'male' | 'female' | 'other'
 * @returns 默认头像URL（后端流接口URL）
 */
export function getDefaultAvatarUrl(gender: string = 'male'): string {
  // 优先使用缓存
  const cacheKey = gender === 'female' ? 'female' : 'male'
  if (avatarUrlCache[cacheKey]) {
    return avatarUrlCache[cacheKey]
  }

  // 构建后端流接口URL（使用相对路径，通过 vite proxy 代理）
  const type = gender === 'female' ? 'female' : 'male'
  const apiBaseUrl = getApiBaseUrl()
  
  // 如果使用相对路径，直接拼接；否则构建完整URL
  let avatarUrl: string
  if (apiBaseUrl.startsWith('/')) {
    avatarUrl = `${apiBaseUrl}/download/default-avatar-image?type=${type}`
  } else {
    const baseUrl = new URL(apiBaseUrl)
    avatarUrl = `${baseUrl.origin}/api/download/default-avatar-image?type=${type}`
  }
  
  // 缓存URL
  avatarUrlCache[cacheKey] = avatarUrl
  return avatarUrl
}

/**
 * 预加载默认头像URL（应用启动时调用）
 */
export async function preloadDefaultAvatars(): Promise<void> {
  try {
    // 并行获取男女默认头像
    await Promise.all([
      fetchDefaultAvatarUrl('male'),
      fetchDefaultAvatarUrl('female')
    ])
  } catch (error) {
    console.error('预加载默认头像失败:', error)
  }
}

/**
 * 获取本地默认头像URL（备用方案）
 * 注意：本地默认头像已移除，此函数保留用于兼容性
 * @param gender 性别: 'male' | 'female' | 'other'
 * @returns 本地默认头像URL（已废弃，返回OSS默认头像）
 */
export function getLocalDefaultAvatarUrl(gender: string = 'male'): string {
  // 兜底使用 public 下的男女默认头像
  return gender === 'female' ? '/avatar_girl.jpeg' : '/avatar_boy.jpeg'
}

/**
 * 将 OSS 默认头像 URL 转换为后端代理 URL
 * @param avatarUrl 头像URL
 * @param gender 用户性别
 * @returns 转换后的URL
 */
function convertOssDefaultAvatarToProxyUrl(avatarUrl: string, gender: string = 'male'): string {
  // 检查是否为 OSS 默认头像 URL
  if (avatarUrl.includes('default-avatars/male-avatar')) {
    return getDefaultAvatarUrl('male')
  }
  if (avatarUrl.includes('default-avatars/female-avatar')) {
    return getDefaultAvatarUrl('female')
  }
  return avatarUrl
}

/**
 * 获取用户头像URL
 * @param avatar 用户头像URL
 * @param gender 用户性别
 * @returns 头像URL（如果是 OSS 默认头像，自动转换为后端代理 URL）
 */
export function getUserAvatarUrl(avatar?: string, gender: string = 'male'): string {
  if (avatar && avatar.trim()) {
    // 如果是 OSS 默认头像 URL，转换为后端代理 URL
    return convertOssDefaultAvatarToProxyUrl(avatar, gender)
  }
  
  return getDefaultAvatarUrl(gender)
}

/**
 * 检查是否为默认头像
 * @param avatarUrl 头像URL
 * @returns 是否为默认头像
 */
export function isDefaultAvatar(avatarUrl: string): boolean {
  if (!avatarUrl) {
    return false
  }
  
  // 检查是否为后端代理的默认头像URL
  if (avatarUrl.includes('/api/download/default-avatar-image')) {
    return true
  }
  
  // 检查是否为OSS直接URL（兼容旧数据）
  if (avatarUrl.includes('default-avatars/male-avatar') || 
      avatarUrl.includes('default-avatars/female-avatar')) {
    return true
  }
  
  return false
}
