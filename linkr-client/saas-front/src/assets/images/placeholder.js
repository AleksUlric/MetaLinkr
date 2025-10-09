// 图片占位符配置
export const placeholderImages = {
  // 商品图片
  products: {
    iphone: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop&crop=center',
    macbook: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop&crop=center',
    airpods: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop&crop=center',
    watch: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop&crop=center',
    ipad: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop&crop=center',
    keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop&crop=center'
  },
  
  // 用户头像
  avatars: {
    user1: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    user2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    user3: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    user4: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    user5: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  },
  
  // 主题预览图
  themes: {
    modern: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
    business: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    fashion: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    tech: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
  },
  
  // 公司/品牌图片
  company: {
    logo: 'https://images.unsplash.com/photo-1599305445771-7760d8091b70?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=400&fit=crop',
    office: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop'
  },
  
  // 支付方式图标
  payments: {
    paypal: 'https://logos-world.net/wp-content/uploads/2020/04/PayPal-Logo.png',
    stripe: 'https://logos-world.net/wp-content/uploads/2021/02/Stripe-Logo.png',
    alipay: 'https://logos-world.net/wp-content/uploads/2021/08/Alipay-Logo.png',
    wechat: 'https://logos-world.net/wp-content/uploads/2021/08/WeChat-Pay-Logo.png',
    apple: 'https://logos-world.net/wp-content/uploads/2021/08/Apple-Pay-Logo.png',
    google: 'https://logos-world.net/wp-content/uploads/2021/08/Google-Pay-Logo.png'
  },
  
  // 默认图片
  default: {
    product: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    company: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'
  }
}

// 获取随机图片
export const getRandomImage = (category, fallback = null) => {
  const images = placeholderImages[category]
  if (!images) return fallback || placeholderImages.default.product
  
  const keys = Object.keys(images)
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  return images[randomKey]
}

// 获取特定图片
export const getImage = (category, key, fallback = null) => {
  const images = placeholderImages[category]
  if (!images || !images[key]) {
    return fallback || placeholderImages.default.product
  }
  return images[key]
}
