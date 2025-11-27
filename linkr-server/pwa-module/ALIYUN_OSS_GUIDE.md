# 阿里云OSS集成指南

## 概述

本项目已集成阿里云OSS（对象存储服务），用于存储用户头像、动态图片等文件。

## 配置说明

### 1. 阿里云OSS配置

在 `application.yml` 中配置OSS相关参数：

```yaml
aliyun:
  oss:
    endpoint: https://oss-cn-hangzhou.aliyuncs.com  # OSS端点
    access-key-id: YOUR_ACCESS_KEY_ID               # 访问密钥ID
    access-key-secret: YOUR_ACCESS_KEY_SECRET       # 访问密钥Secret
    bucket-name: meta-linkr                         # 存储桶名称
    domain: https://meta-linkr.oss-cn-hangzhou.aliyuncs.com  # 域名
    path-prefix: uploads/                           # 路径前缀
    max-file-size: 10485760                         # 最大文件大小（10MB）
    allowed-extensions: jpg,jpeg,png,gif,webp       # 允许的文件扩展名
    enabled: true                                   # 是否启用
```

### 2. 阿里云OSS设置步骤

#### 2.1 存储桶状态
✅ **存储桶已存在**
- 存储桶名称：`meta-linkr`
- 权限：公共读
- 状态：已创建并配置完成

#### 2.2 获取访问密钥
1. 进入RAM访问控制
2. 创建用户并授予OSS相关权限
3. 获取AccessKey ID和AccessKey Secret

#### 2.3 配置CORS
在OSS控制台配置CORS规则：
```json
{
  "AllowedOrigins": ["*"],
  "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3600
}
```

## 功能特性

### 1. 文件上传
- 支持头像上传（avatar文件夹）
- 支持动态图片上传（post文件夹）
- 支持通用文件上传（指定文件夹）
- 自动文件类型验证
- 文件大小限制
- 图片自动压缩

### 2. 文件管理
- 文件删除功能
- 文件URL生成
- 文件元数据设置

### 3. 安全特性
- Shiro Session 认证
- 文件类型白名单
- 文件大小限制
- 用户权限控制

## API接口

### 1. 上传头像
```
POST /api/upload/avatar
Content-Type: multipart/form-data
Cookie: JSESSIONID={sessionId}

参数：
- file: 头像文件

返回：
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/avatar/20250110123456_abc123.jpg",
    "fileName": "avatar.jpg",
    "fileSize": "102400"
  }
}
```

### 2. 上传动态图片
```
POST /api/upload/post-image
Content-Type: multipart/form-data
Cookie: JSESSIONID={sessionId}

参数：
- file: 图片文件

返回：
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/post/20250110123456_def456.jpg",
    "fileName": "post.jpg",
    "fileSize": "204800"
  }
}
```

### 3. 上传通用文件
```
POST /api/upload/file
Content-Type: multipart/form-data
Cookie: JSESSIONID={sessionId}

参数：
- file: 文件
- folder: 文件夹名称（avatar, post, chat, temp）

返回：
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/{folder}/20250110123456_ghi789.jpg",
    "fileName": "file.jpg",
    "fileSize": "102400",
    "folder": "avatar"
  }
}
```

### 4. 删除文件
```
DELETE /api/upload/file?fileUrl={fileUrl}
Cookie: JSESSIONID={sessionId}

返回：
{
  "code": 200,
  "message": "success",
  "data": "文件删除成功"
}
```

### 5. 获取上传配置
```
GET /api/upload/config

返回：
{
  "code": 200,
  "message": "success",
  "data": {
    "maxFileSize": 10485760,
    "allowedExtensions": "jpg,jpeg,png,gif,webp",
    "allowedFolders": "avatar,post,chat,temp"
  }
}
```

## 前端使用

### 1. 文件上传组件
```vue
<template>
  <FileUpload
    title="上传头像"
    subtitle="支持jpg、png格式，最大5MB"
    accept="image/*"
    folder="avatar"
    :max-size="5 * 1024 * 1024"
    :auto-compress="true"
    :show-preview="true"
    @success="handleUploadSuccess"
    @error="handleUploadError"
  />
</template>

<script setup>
import FileUpload from '@/components/FileUpload.vue'
import type { UploadResult } from '@/services/upload'

const handleUploadSuccess = (result: UploadResult) => {
  console.log('上传成功:', result.url)
}

const handleUploadError = (error: string) => {
  console.error('上传失败:', error)
}
</script>
```

### 2. 上传服务
```typescript
import { uploadService } from '@/services/upload'

// 上传头像
const uploadAvatar = async (file: File) => {
  try {
    const result = await uploadService.uploadAvatar(file)
    console.log('头像上传成功:', result.url)
  } catch (error) {
    console.error('头像上传失败:', error)
  }
}

// 上传动态图片
const uploadPostImage = async (file: File) => {
  try {
    const result = await uploadService.uploadPostImage(file)
    console.log('图片上传成功:', result.url)
  } catch (error) {
    console.error('图片上传失败:', error)
  }
}
```

## 文件存储结构

```
meta-linkr/
├── uploads/
│   ├── avatar/           # 用户头像
│   │   ├── 20250110123456_abc123.jpg
│   │   └── 20250110123457_def456.png
│   ├── post/             # 动态图片
│   │   ├── 20250110123458_ghi789.jpg
│   │   └── 20250110123459_jkl012.png
│   ├── chat/             # 聊天图片
│   │   └── 20250110123460_mno345.jpg
│   └── temp/             # 临时文件
│       └── 20250110123461_pqr678.jpg
```

## 注意事项

### 1. 安全考虑
- 定期更换AccessKey
- 设置合适的文件类型白名单
- 限制文件大小
- 实施用户权限控制

### 2. 性能优化
- 启用CDN加速
- 设置合适的缓存策略
- 图片自动压缩
- 异步上传处理

### 3. 成本控制
- 定期清理临时文件
- 设置存储类型（标准/低频/归档）
- 监控存储使用量
- 设置生命周期规则

## 故障排除

### 1. 常见问题
- **403错误**：检查AccessKey权限
- **404错误**：检查存储桶名称和路径
- **413错误**：文件大小超限
- **415错误**：文件类型不支持

### 2. 调试方法
- 查看应用日志
- 检查OSS控制台
- 验证网络连接
- 测试API接口

## 更新日志

- **2025-01-10**: 初始版本，支持基础文件上传功能
- **2025-01-10**: 添加图片压缩功能
- **2025-01-10**: 集成到个人信息完善页面
