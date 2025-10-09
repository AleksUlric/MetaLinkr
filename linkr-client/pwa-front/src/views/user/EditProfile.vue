<template>
  <div class="edit-profile">
    <div class="profile-header">
      <el-button type="text" @click="goBack">取消</el-button>
      <h1 class="page-title">编辑资料</h1>
      <el-button type="primary" @click="saveProfile">保存</el-button>
    </div>
    
    <div class="profile-content">
      <el-form :model="profileForm" class="profile-form">
        <el-form-item label="头像">
          <el-upload
            v-model:file-list="avatarList"
            action="#"
            list-type="picture-card"
            :on-preview="handleAvatarPreview"
            :on-remove="handleAvatarRemove"
            :auto-upload="false"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="昵称">
          <el-input v-model="profileForm.name" placeholder="请输入昵称" />
        </el-form-item>
        
        <el-form-item label="个人简介">
          <el-input
            v-model="profileForm.bio"
            type="textarea"
            placeholder="介绍一下自己..."
            :rows="4"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="年龄">
          <el-input-number v-model="profileForm.age" :min="18" :max="100" />
        </el-form-item>
        
        <el-form-item label="性别">
          <el-radio-group v-model="profileForm.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
            <el-radio label="other">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="兴趣爱好">
          <el-select
            v-model="profileForm.interests"
            multiple
            placeholder="选择兴趣爱好"
            style="width: 100%"
          >
            <el-option label="旅行" value="travel" />
            <el-option label="音乐" value="music" />
            <el-option label="运动" value="sports" />
            <el-option label="读书" value="reading" />
            <el-option label="电影" value="movies" />
            <el-option label="美食" value="food" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()
const avatarList = ref([])

const profileForm = ref({
  name: '',
  bio: '',
  age: 25,
  gender: 'male',
  interests: []
})

const handleAvatarPreview = () => {
  // 预览头像
}

const handleAvatarRemove = () => {
  // 移除头像
}

const saveProfile = () => {
  console.log('保存资料:', profileForm.value)
  router.back()
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.edit-profile {
  height: 100vh;
  background-color: #f5f5f5;
}

.profile-header {
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

.profile-content {
  padding: 20px;
}

.profile-form {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

// 深色模式适配
@media (prefers-color-scheme: dark) {
  .edit-profile {
    background-color: #1a1a1a;
  }
  
  .profile-header {
    background: #2a2a2a;
    border-bottom-color: #333;
    
    .page-title {
      color: #fff;
    }
  }
  
  .profile-form {
    background: #2a2a2a;
  }
}
</style>
