<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// 开发环境下清除旧的token，确保需要重新登录
onMounted(() => {
  if (import.meta.env.DEV) {
    localStorage.removeItem('token')
    console.log('开发模式：已清除旧token，请重新登录')
  }
})
</script>

<style scoped></style>


