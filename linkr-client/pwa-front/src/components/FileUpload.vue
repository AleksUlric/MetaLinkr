<template>
  <div class="file-upload">
    <div class="upload-area" @click="selectFile" @dragover.prevent @drop.prevent="handleDrop">
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        style="display: none"
        @change="handleFileSelect"
      />
      
      <div class="upload-content" :class="{ 'is-dragging': isDragging }">
        <div class="upload-icon">
          <el-icon v-if="!isUploading"><Upload /></el-icon>
          <el-icon v-else class="is-loading"><Loading /></el-icon>
        </div>
        <div class="upload-text">
          <div v-if="!isUploading" class="upload-title">
            {{ title || '点击或拖拽文件到此处上传' }}
          </div>
          <div v-else class="upload-title">
            上传中... {{ uploadProgress }}%
          </div>
          <div class="upload-subtitle">
            {{ subtitle || `支持 ${allowedExtensions.join(', ')} 格式，最大 ${maxSizeText}` }}
          </div>
        </div>
        <div v-if="previewUrl" class="upload-preview">
          <img :src="previewUrl" :alt="fileName" />
        </div>
      </div>
    </div>
    
    <div v-if="errorMessage" class="upload-error">
      <el-icon><Warning /></el-icon>
      <span>{{ errorMessage }}</span>
    </div>
    
    <div v-if="uploadResult" class="upload-success">
      <el-icon><Check /></el-icon>
      <span>上传成功</span>
      <el-button text @click="copyUrl">复制链接</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload, Loading, Warning, Check } from '@element-plus/icons-vue'
import { uploadService, type UploadResult } from '../services/upload'

// 定义组件
defineComponent({
  name: 'FileUpload'
})

interface Props {
  title?: string
  subtitle?: string
  accept?: string
  folder?: string
  maxSize?: number
  autoCompress?: boolean
  showPreview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  accept: 'image/*',
  folder: 'temp',
  maxSize: 10 * 1024 * 1024, // 10MB
  autoCompress: true,
  showPreview: true
})

const emit = defineEmits<{
  success: [result: UploadResult]
  error: [error: string]
  progress: [progress: number]
}>()

// 响应式数据
const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref('')
const uploadResult = ref<UploadResult | null>(null)
const previewUrl = ref('')
const fileName = ref('')

// 计算属性
const allowedExtensions = computed(() => {
  if (props.accept === 'image/*') {
    return ['jpg', 'jpeg', 'png', 'gif', 'webp']
  }
  return props.accept.split(',').map(ext => ext.trim().replace('*', '').replace('.', ''))
})

const maxSizeText = computed(() => {
  const sizeInMB = props.maxSize / 1024 / 1024
  return sizeInMB >= 1 ? `${sizeInMB}MB` : `${props.maxSize / 1024}KB`
})

// 方法
const selectFile = () => {
  if (isUploading.value) return
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    uploadFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    uploadFile(file)
  }
}

const uploadFile = async (file: File) => {
  try {
    // 重置状态
    errorMessage.value = ''
    uploadResult.value = null
    isUploading.value = true
    uploadProgress.value = 0
    
    // 验证文件
    if (!validateFile(file)) {
      return
    }
    
    // 显示预览
    if (props.showPreview && file.type.startsWith('image/')) {
      try {
        previewUrl.value = await uploadService.previewImage(file)
        fileName.value = file.name
      } catch (error) {
        console.warn('预览失败:', error)
      }
    }
    
    // 压缩图片（如果需要）
    let fileToUpload = file
    if (props.autoCompress && file.type.startsWith('image/')) {
      try {
        fileToUpload = await uploadService.compressImage(file)
        uploadProgress.value = 30
        emit('progress', 30)
      } catch (error) {
        console.warn('图片压缩失败，使用原文件:', error)
      }
    }
    
    // 上传文件
    uploadProgress.value = 50
    emit('progress', 50)
    
    const result = await uploadService.uploadFile(fileToUpload, props.folder)
    
    uploadProgress.value = 100
    emit('progress', 100)
    
    uploadResult.value = result
    emit('success', result)
    
    ElMessage.success('文件上传成功')
    
  } catch (error) {
    console.error('文件上传失败:', error)
    errorMessage.value = error instanceof Error ? error.message : '上传失败'
    emit('error', errorMessage.value)
    ElMessage.error(errorMessage.value)
  } finally {
    isUploading.value = false
  }
}

const validateFile = (file: File): boolean => {
  // 检查文件大小
  if (file.size > props.maxSize) {
    errorMessage.value = `文件大小不能超过 ${maxSizeText.value}`
    return false
  }
  
  // 检查文件类型
  const extension = getFileExtension(file.name).toLowerCase()
  if (!allowedExtensions.value.includes(extension)) {
    errorMessage.value = `不支持的文件类型，支持的类型：${allowedExtensions.value.join(', ')}`
    return false
  }
  
  return true
}

const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1) {
    return ''
  }
  return filename.substring(lastDotIndex + 1)
}

const copyUrl = async () => {
  if (uploadResult.value?.url) {
    try {
      await navigator.clipboard.writeText(uploadResult.value.url)
      ElMessage.success('链接已复制到剪贴板')
    } catch (error) {
      console.error('复制失败:', error)
      ElMessage.error('复制失败')
    }
  }
}

// 拖拽事件处理
const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

onMounted(() => {
  document.addEventListener('dragenter', handleDragEnter)
  document.addEventListener('dragleave', handleDragLeave)
})

onUnmounted(() => {
  document.removeEventListener('dragenter', handleDragEnter)
  document.removeEventListener('dragleave', handleDragLeave)
})
</script>

<style lang="scss" scoped>
.file-upload {
  width: 100%;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
  
  &:hover {
    border-color: #409eff;
    background: #f0f9ff;
  }
  
  &.is-dragging {
    border-color: #409eff;
    background: #f0f9ff;
  }
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  
  &.is-dragging {
    transform: scale(1.02);
  }
}

.upload-icon {
  font-size: 48px;
  color: #c0c4cc;
  transition: color 0.3s ease;
  
  .is-loading {
    animation: rotate 1s linear infinite;
    color: #409eff;
  }
}

.upload-text {
  .upload-title {
    font-size: 16px;
    font-weight: 500;
    color: #606266;
    margin-bottom: 4px;
  }
  
  .upload-subtitle {
    font-size: 14px;
    color: #909399;
  }
}

.upload-preview {
  margin-top: 12px;
  
  img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.upload-error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 4px;
  color: #f56c6c;
  font-size: 14px;
}

.upload-success {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  background: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  color: #409eff;
  font-size: 14px;
  
  .el-button {
    margin-left: auto;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

