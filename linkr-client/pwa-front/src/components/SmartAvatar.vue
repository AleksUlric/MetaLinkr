<template>
  <el-avatar 
    :src="avatarUrl" 
    :size="size" 
    :alt="alt"
    @error="handleAvatarError"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { getDefaultAvatarUrl, getLocalDefaultAvatarUrl, fetchDefaultAvatarUrl } from '@/utils/avatar'

interface Props {
  src?: string
  gender?: string
  size?: number | string
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  gender: 'male',
  size: 40,
  alt: '用户头像'
})

const avatarUrl = ref('')
const useLocalFallback = ref(false)

// 计算头像URL
const computedAvatarUrl = computed(() => {
  if (props.src && props.src.trim()) {
    return props.src
  }
  
  if (useLocalFallback.value) {
    return getLocalDefaultAvatarUrl(props.gender)
  } else {
    return getDefaultAvatarUrl(props.gender)
  }
})

// 监听计算属性变化
watch(computedAvatarUrl, (newUrl, oldUrl) => {
  console.log('SmartAvatar URL变化:', { oldUrl, newUrl, src: props.src, gender: props.gender })
  // 如果URL相同，添加时间戳参数强制刷新（避免浏览器缓存）
  let finalUrl = newUrl
  if (newUrl === oldUrl && newUrl && newUrl.includes('/api/')) {
    const separator = newUrl.includes('?') ? '&' : '?'
    finalUrl = `${newUrl}${separator}_t=${Date.now()}`
  }
  avatarUrl.value = finalUrl
}, { immediate: true })

// 同时监听 props.src 的变化，确保及时更新
watch(() => props.src, (newSrc, oldSrc) => {
  console.log('SmartAvatar src prop变化:', { oldSrc, newSrc })
  if (newSrc && newSrc.trim()) {
    // 如果URL相同，添加时间戳参数强制刷新（避免浏览器缓存）
    let finalUrl = newSrc
    if (newSrc === oldSrc && newSrc.includes('/api/')) {
      const separator = newSrc.includes('?') ? '&' : '?'
      finalUrl = `${newSrc}${separator}_t=${Date.now()}`
    }
    avatarUrl.value = finalUrl
    useLocalFallback.value = false
  } else {
    // 如果src为空，使用默认头像
    avatarUrl.value = useLocalFallback.value 
      ? getLocalDefaultAvatarUrl(props.gender)
      : getDefaultAvatarUrl(props.gender)
  }
}, { immediate: true })

// 组件挂载时，如果没有src，尝试从后端获取默认头像
onMounted(async () => {
  if (!props.src || !props.src.trim()) {
    try {
      const url = await fetchDefaultAvatarUrl(props.gender)
      if (url) {
        avatarUrl.value = url
      }
    } catch (error) {
      console.error('获取默认头像失败:', error)
      // 失败时使用fallback URL
    }
  }
})

// 处理头像加载错误
const handleAvatarError = () => {
  if (!useLocalFallback.value) {
    // 如果OSS头像加载失败，切换到本地头像
    useLocalFallback.value = true
    avatarUrl.value = getLocalDefaultAvatarUrl(props.gender)
  }
}
</script>
