<template>
  <div>
    <el-page-header content="用户管理" />
    <el-card class="mt">
      <el-table :data="users" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="displayName" label="显示名" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { request } from '@/services/request'

interface User { id: number; username: string; displayName: string }
const users = ref<User[]>([])

onMounted(async () => {
  // 示例接口，后端接入后替换为真实地址
  users.value = await request.get<User[]>('/api/admin/users')
})
</script>

<style scoped>
.mt { margin-top: 12px; }
</style>


