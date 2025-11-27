# MetaLinkr PWA API 文档

## 概述

MetaLinkr PWA 是一个基于标签匹配的社交应用，提供用户资料管理、动态发布、内容匹配等功能。

## 基础信息

- **Base URL**: `http://localhost:8080/api`
- **认证方式**: Shiro Session（Cookie）
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

## 错误码说明

- `200`: 成功
- `400`: 请求参数错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `500`: 服务器内部错误

---

## 1. 用户相关接口

### 1.1 完善个人信息

**接口地址**: `POST /user/complete-profile`

**请求参数**:
```json
{
  "nickname": "用户昵称",
  "gender": "male|female|other",
  "birthday": "1990-01-01",
  "location": "杭州",
  "bio": "个人简介",
  "interests": ["音乐", "电影", "旅行"],
  "avatar": "头像URL"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "nickname": "用户昵称",
    "avatar": "头像URL",
    "level": 1,
    "points": 200
  }
}
```

### 1.2 获取用户资料

**接口地址**: `GET /user/profile`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "nickname": "用户昵称",
    "avatar": "头像URL",
    "gender": "male",
    "age": 25,
    "location": "杭州",
    "bio": "个人简介",
    "interests": ["音乐", "电影"],
    "level": 5,
    "points": 1000,
    "experience": 2500
  }
}
```

### 1.3 更新用户资料

**接口地址**: `POST /user/update-profile`

**请求参数**:
```json
{
  "nickname": "新昵称",
  "bio": "新简介",
  "gender": "female",
  "age": 26,
  "location": "上海",
  "interests": ["摄影", "旅行"],
  "avatar": "新头像URL"
}
```

### 1.4 检查昵称是否可用

**接口地址**: `GET /user/check-nickname?nickname=昵称`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": true
}
```

### 1.5 获取用户统计信息

**接口地址**: `GET /user/stats`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": 1,
    "level": 5,
    "points": 1000,
    "experience": 2500,
    "followers": 120,
    "following": 80,
    "posts": 25,
    "likes": 500
  }
}
```

### 1.6 获取推荐标签

**接口地址**: `GET /user/recommended-tags`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": ["音乐", "电影", "读书", "运动", "旅行", "摄影", "美食", "游戏"]
}
```

---

## 2. 文件上传接口

### 2.1 上传头像

**接口地址**: `POST /upload/avatar`

**请求参数**: `multipart/form-data`
- `file`: 图片文件 (支持 JPG、PNG、GIF、WebP，最大2MB)

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "https://example.com/avatar/user123.jpg",
    "fileName": "avatar_123_1640995200000.jpg",
    "fileSize": "1024000",
    "userId": "123"
  }
}
```

### 2.2 上传动态图片

**接口地址**: `POST /upload/post-image`

**请求参数**: `multipart/form-data`
- `file`: 图片文件 (支持 JPG、PNG、GIF、WebP，最大5MB)

### 2.3 上传通用文件

**接口地址**: `POST /upload/file`

**请求参数**: `multipart/form-data`
- `file`: 文件
- `folder`: 文件夹名称 (avatar, post, chat, temp)

### 2.4 删除文件

**接口地址**: `DELETE /upload/file?fileUrl=文件URL`

### 2.5 获取上传配置

**接口地址**: `GET /upload/config`

**响应示例**:
```json
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

---

## 3. 文件下载接口

### 3.1 获取默认头像

**接口地址**: `GET /download/default-avatar?type=male|female`

**请求参数**:
- `type`: 头像类型，必填，值为 `male` 或 `female`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/default-avatars/male-avatar.png",
    "type": "male",
    "fileName": "male-avatar.png",
    "description": "默认男性头像"
  }
}
```

### 3.2 获取所有默认头像

**接口地址**: `GET /download/default-avatars`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "male": "https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/default-avatars/male-avatar.png",
    "female": "https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/default-avatars/female-avatar.png"
  }
}
```

---

## 4. 标签相关接口

### 4.1 获取所有标签

**接口地址**: `GET /tags/all`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "音乐",
      "type": 1,
      "description": "喜欢各种类型的音乐",
      "icon": "🎵",
      "color": "#ff6b6b",
      "usageCount": 150,
      "isHot": true
    }
  ]
}
```

### 4.2 根据类型获取标签

**接口地址**: `GET /tags/type/{type}`

**路径参数**:
- `type`: 标签类型 (1-兴趣标签, 2-技能标签, 3-个性标签, 4-其他)

### 4.3 获取热门标签

**接口地址**: `GET /tags/hot?limit=20`

**查询参数**:
- `limit`: 限制数量 (默认20)

### 4.4 获取用户标签

**接口地址**: `GET /tags/my`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "userId": 123,
      "tagName": "音乐",
      "tagType": 1,
      "weight": 5,
      "isPublic": true,
      "createdAt": "2025-01-10T10:00:00"
    }
  ]
}
```

### 4.5 获取其他用户标签

**接口地址**: `GET /tags/user/{userId}`

### 4.6 添加用户标签

**接口地址**: `POST /tags/add`

**请求参数**: `application/x-www-form-urlencoded`
- `tagName`: 标签名称
- `tagType`: 标签类型
- `weight`: 权重 (默认1)
- `isPublic`: 是否公开 (默认true)

### 4.7 删除用户标签

**接口地址**: `DELETE /tags/remove`

**请求参数**: `application/x-www-form-urlencoded`
- `tagName`: 标签名称

### 4.8 批量添加用户标签

**接口地址**: `POST /tags/batch-add`

**请求参数**: `application/x-www-form-urlencoded`
- `tagNames`: 标签名称列表
- `tagType`: 标签类型

### 4.9 更新用户标签权重

**接口地址**: `PUT /tags/weight`

**请求参数**: `application/x-www-form-urlencoded`
- `tagName`: 标签名称
- `weight`: 新权重

### 4.10 根据标签搜索用户

**接口地址**: `GET /tags/search-users?tagName=标签名&limit=20`

### 4.11 计算用户标签匹配度

**接口地址**: `GET /tags/match-score/{targetUserId}`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": 85
}
```

---

## 5. 动态相关接口

### 5.1 创建动态

**接口地址**: `POST /posts/create`

**请求参数**:
```json
{
  "content": "动态内容",
  "images": ["图片URL1", "图片URL2"],
  "music": {
    "title": "歌曲名",
    "artist": "歌手",
    "url": "音乐URL",
    "cover": "封面URL",
    "duration": 180
  },
  "video": {
    "title": "视频标题",
    "url": "视频URL",
    "cover": "封面URL",
    "duration": 60,
    "size": 1024000
  },
  "location": "位置信息",
  "latitude": 30.123456,
  "longitude": 120.123456,
  "tags": ["标签1", "标签2"],
  "visibility": 1
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": 123
}
```

### 5.2 获取动态详情

**接口地址**: `GET /posts/{postId}`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 123,
    "user": {
      "id": 1,
      "nickname": "用户昵称",
      "avatar": "头像URL",
      "level": 5,
      "isVerified": false
    },
    "content": "动态内容",
    "images": ["图片URL1", "图片URL2"],
    "location": "位置信息",
    "tags": ["标签1", "标签2"],
    "visibility": 1,
    "likeCount": 25,
    "commentCount": 8,
    "shareCount": 3,
    "viewCount": 150,
    "isLiked": false,
    "isFavorited": false,
    "createdAt": "2025-01-10T10:00:00"
  }
}
```

### 5.3 获取用户动态列表

**接口地址**: `GET /posts/user/{userId}?page=1&size=20`

**查询参数**:
- `page`: 页码 (默认1)
- `size`: 每页大小 (默认20)

### 5.4 获取推荐动态列表

**接口地址**: `GET /posts/recommended?page=1&size=20`

### 5.5 删除动态

**接口地址**: `DELETE /posts/{postId}`

### 5.6 点赞动态

**接口地址**: `POST /posts/{postId}/like`

### 5.7 取消点赞动态

**接口地址**: `DELETE /posts/{postId}/like`

---

## 6. 匹配相关接口

### 6.1 基于标签推荐用户

**接口地址**: `GET /matching/users/by-tags?limit=20`

**查询参数**:
- `limit`: 推荐数量 (默认20)

### 6.2 基于兴趣推荐动态

**接口地址**: `GET /matching/posts/by-interests?page=1&size=20`

### 6.3 基于地理位置推荐用户

**接口地址**: `GET /matching/users/by-location?radius=50.0&limit=20`

**查询参数**:
- `radius`: 搜索半径(公里) (默认50.0)
- `limit`: 推荐数量 (默认20)

### 6.4 综合推荐算法

**接口地址**: `GET /matching/users/comprehensive?limit=20`

### 6.5 获取匹配度分析

**接口地址**: `GET /matching/analysis/{targetUserId}`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "tagMatchScore": 85,
    "locationScore": 70,
    "ageScore": 90,
    "comprehensiveScore": 82
  }
}
```

---

## 7. OSS测试接口

### 7.1 测试OSS连接

**接口地址**: `GET /test/oss/connection`

### 7.2 获取OSS配置信息

**接口地址**: `GET /test/oss/config`

### 7.3 测试文件上传权限

**接口地址**: `GET /test/oss/permissions`

### 7.4 测试上传文件

**接口地址**: `POST /test/oss/upload`

**请求参数**: `multipart/form-data`
- `file`: 文件
- `folder`: 文件夹名称 (默认test)

---

## 8. 认证相关

### 8.1 会话机制

- 所有受保护接口依赖 Shiro Session
- 浏览器需携带 `JSESSIONID`（或自定义）Cookie
- 跨域请求请在前端开启 `withCredentials`

### 8.2 登录后状态

- 登录接口返回 `sessionId` 字段用于调试
- 实际认证依赖服务端 Session 和 Cookie
- 客户端无需手动存储或刷新 Token

### 8.3 注销

- 调用 `POST /api/auth/logout` 会立即失效当前 Session
- 客户端同时清除本地缓存的用户信息

---

## 9. 错误处理

### 9.1 常见错误

- **400 Bad Request**: 请求参数错误
- **401 Unauthorized**: Session 无效或已过期
- **403 Forbidden**: 没有权限访问该资源
- **404 Not Found**: 请求的资源不存在
- **500 Internal Server Error**: 服务器内部错误

### 9.2 错误响应格式

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": null
}
```

---

## 10. 数据模型

### 10.1 用户模型

```json
{
  "id": 1,
  "phone": "13800138000",
  "nickname": "用户昵称",
  "avatar": "头像URL",
  "gender": "male|female|other",
  "age": 25,
  "birthday": "1990-01-01",
  "location": "杭州",
  "latitude": 30.123456,
  "longitude": 120.123456,
  "bio": "个人简介",
  "interests": ["音乐", "电影"],
  "level": 5,
  "points": 1000,
  "experience": 2500,
  "isOnline": true,
  "lastLoginTime": "2025-01-10T10:00:00",
  "lastActiveTime": "2025-01-10T10:00:00",
  "status": 1,
  "createdAt": "2025-01-01T00:00:00",
  "updatedAt": "2025-01-10T10:00:00"
}
```

### 10.2 动态模型

```json
{
  "id": 123,
  "userId": 1,
  "content": "动态内容",
  "images": ["图片URL1", "图片URL2"],
  "music": {
    "title": "歌曲名",
    "artist": "歌手",
    "url": "音乐URL",
    "cover": "封面URL",
    "duration": 180
  },
  "video": {
    "title": "视频标题",
    "url": "视频URL",
    "cover": "封面URL",
    "duration": 60,
    "size": 1024000
  },
  "location": "位置信息",
  "latitude": 30.123456,
  "longitude": 120.123456,
  "tags": ["标签1", "标签2"],
  "visibility": 1,
  "likeCount": 25,
  "commentCount": 8,
  "shareCount": 3,
  "viewCount": 150,
  "status": 1,
  "createdAt": "2025-01-10T10:00:00",
  "updatedAt": "2025-01-10T10:00:00"
}
```

### 10.3 标签模型

```json
{
  "id": 1,
  "name": "音乐",
  "type": 1,
  "description": "喜欢各种类型的音乐",
  "icon": "🎵",
  "color": "#ff6b6b",
  "usageCount": 150,
  "isHot": true,
  "sortOrder": 1,
  "status": 1,
  "createdAt": "2025-01-01T00:00:00",
  "updatedAt": "2025-01-10T10:00:00"
}
```

---

## 11. 开发注意事项

### 11.1 性能优化

- 使用分页查询，避免一次性加载大量数据
- 图片上传前进行压缩处理
- 合理使用缓存机制
- 数据库查询优化

### 11.2 安全考虑

- 所有用户输入都需要进行验证和过滤
- 文件上传需要检查文件类型和大小
- 敏感信息不能直接返回给客户端
- 使用HTTPS协议传输数据

### 11.3 错误处理

- 提供友好的错误提示信息
- 记录详细的错误日志
- 实现重试机制
- 监控API调用情况

---

## 12. 更新日志

### v2.0 (2025-01-10)
- 新增标签系统
- 新增动态发布功能
- 新增内容匹配算法
- 优化用户资料管理
- 完善文件上传功能

### v1.0 (2025-01-01)
- 基础用户管理
- 简单文件上传
- 基础认证系统
