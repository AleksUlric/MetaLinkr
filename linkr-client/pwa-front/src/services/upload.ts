import { ElMessage } from 'element-plus'
import { get, upload as uploadRequest } from '@/utils/request'

export interface UploadResult {
  url: string
  fileName: string
  fileSize: string
  folder?: string
}

export interface UploadConfig {
  maxFileSize: number
  allowedExtensions: string[]
  allowedFolders: string[]
}

export class UploadService {
  private baseUrl = '/api/upload'
  
  /**
   * 获取上传配置
   */
  async getUploadConfig(): Promise<UploadConfig> {
    try {
      const data = await get<{
        maxFileSize: number
        allowedExtensions: string
        allowedFolders: string
      }>(`${this.baseUrl}/config`)
      
      return {
        maxFileSize: data.maxFileSize,
        allowedExtensions: data.allowedExtensions.split(','),
        allowedFolders: data.allowedFolders.split(',')
      }
    } catch (error) {
      console.error('获取上传配置失败:', error)
      throw error
    }
  }
  
  /**
   * 上传头像
   */
  async uploadAvatar(file: File): Promise<UploadResult> {
    return this.uploadFile(file, 'avatar')
  }
  
  /**
   * 上传动态图片
   */
  async uploadPostImage(file: File): Promise<UploadResult> {
    return this.uploadFile(file, 'post')
  }
  
  /**
   * 上传文件到指定文件夹
   */
  async uploadFile(file: File, folder: string): Promise<UploadResult> {
    try {
      // 验证文件
      await this.validateFile(file)
      
      // 创建FormData
      const formData = new FormData()
      formData.append('file', file)
      
      // 选择上传接口
      let uploadUrl = `${this.baseUrl}/file`
      if (folder === 'avatar') {
        uploadUrl = `${this.baseUrl}/avatar`
      } else if (folder === 'post') {
        uploadUrl = `${this.baseUrl}/post-image`
      } else {
        formData.append('folder', folder)
      }
      
      // 使用统一的upload方法（自动处理Session认证）
      const result = await uploadRequest<UploadResult>(uploadUrl, formData)
      
      return result
    } catch (error) {
      console.error('文件上传失败:', error)
      throw error
    }
  }
  
  /**
   * 删除文件
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const { del } = await import('@/utils/request')
      await del(`${this.baseUrl}/file?fileUrl=${encodeURIComponent(fileUrl)}`)
    } catch (error) {
      console.error('文件删除失败:', error)
      throw error
    }
  }
  
  /**
   * 验证文件
   */
  private async validateFile(file: File): Promise<void> {
    const config = await this.getUploadConfig()
    
    // 检查文件大小
    if (file.size > config.maxFileSize) {
      throw new Error(`文件大小不能超过 ${Math.round(config.maxFileSize / 1024 / 1024)}MB`)
    }
    
    // 检查文件类型
    const extension = this.getFileExtension(file.name).toLowerCase()
    if (!config.allowedExtensions.includes(extension)) {
      throw new Error(`不支持的文件类型，支持的类型：${config.allowedExtensions.join(', ')}`)
    }
  }
  
  /**
   * 获取文件扩展名
   */
  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.')
    if (lastDotIndex === -1) {
      return ''
    }
    return filename.substring(lastDotIndex + 1)
  }
  
  /**
   * 压缩图片
   */
  async compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // 计算压缩后的尺寸
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        // 设置canvas尺寸
        canvas.width = width
        canvas.height = height
        
        // 绘制图片
        ctx?.drawImage(img, 0, 0, width, height)
        
        // 转换为Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              reject(new Error('图片压缩失败'))
            }
          },
          file.type,
          quality
        )
      }
      
      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }
      
      img.src = URL.createObjectURL(file)
    })
  }
  
  /**
   * 预览图片
   */
  previewImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.onerror = () => {
        reject(new Error('图片预览失败'))
      }
      reader.readAsDataURL(file)
    })
  }
}

// 创建单例实例
export const uploadService = new UploadService()
