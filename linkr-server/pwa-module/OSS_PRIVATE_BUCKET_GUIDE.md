# OSS 私有桶 + AccessKey 访问机制说明

## 问题说明

**问题**：如果 OSS 存储桶设置为**私有权限**，代码里使用 `.env` 的 AccessKey，这样能访问桶文件吗？

## 访问机制分析

### 1. 后端访问（使用 AccessKey）

✅ **可以访问**

- 后端代码使用 AccessKey 通过 OSS SDK 访问桶文件
- AccessKey 具有相应权限（如 `PutObject`、`GetObject`、`DeleteObject` 等）
- 后端可以正常执行：
  - ✅ 上传文件
  - ✅ 删除文件
  - ✅ 设置文件 ACL
  - ✅ 生成签名 URL

### 2. 前端直接访问（通过 URL）

❌ **可能无法访问**

- 如果桶是**私有权限**，即使：
  - 文件 ACL 设置为 `PublicRead`
  - 前端直接通过 URL 访问（如 `https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/avatar/xxx.jpg`）
- **仍然可能返回 403 Forbidden**

**原因**：
- OSS 的权限检查优先级：**桶权限 > 文件 ACL**
- 如果桶是私有，桶权限会覆盖文件的 ACL 设置

## 解决方案

### 方案 1：使用签名 URL（推荐）✅

**已实现**：代码已自动生成签名 URL

**工作原理**：
1. 上传文件后，自动生成带签名的 URL
2. 签名 URL 包含访问凭证，有效期 1 年
3. 前端使用签名 URL 可以直接访问文件

**优点**：
- ✅ 支持私有桶
- ✅ 安全性高（URL 有时效性）
- ✅ 无需修改前端代码（URL 格式兼容）

**示例**：
```
普通URL: https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/avatar/xxx.jpg
签名URL: https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/avatar/xxx.jpg?Expires=1735689600&OSSAccessKeyId=xxx&Signature=xxx
```

### 方案 2：将桶改为公共读

**操作步骤**：
1. 登录阿里云 OSS 控制台
2. 进入存储桶 `meta-linkr`
3. 点击 **权限管理** → **读写权限**
4. 设置为 **公共读**

**优点**：
- ✅ 简单直接
- ✅ 前端可以直接访问

**缺点**：
- ❌ 安全性较低（所有文件都可以直接访问）
- ❌ 无法控制访问权限

### 方案 3：后端代理（不推荐）

通过后端接口代理文件访问，会增加服务器负载。

## 当前代码实现

### 自动生成签名 URL

代码已实现 `getFileUrl()` 方法，自动处理：

```java
private String getFileUrl(String objectKey) {
    try {
        // 生成签名URL（有效期1年）
        Date expiration = new Date(System.currentTimeMillis() + 31536000000L);
        URL signedUrl = ossClient.generatePresignedUrl(
            ossConfig.getBucketName(), 
            objectKey, 
            expiration
        );
        return signedUrl.toString();
    } catch (Exception e) {
        // 如果失败，返回普通URL（适用于公共读桶）
        return ossConfig.getDomain() + "/" + objectKey;
    }
}
```

### 上传方法已更新

- `uploadFile()` - 自动返回签名 URL
- `uploadFileWithName()` - 自动返回签名 URL

### 手动生成签名 URL

如果需要手动生成签名 URL，可以使用：

```java
// 生成60分钟有效期的签名URL
ossService.generatePresignedUrl("uploads/avatar/xxx.jpg", 60);
```

## 配置说明

### AccessKey 权限要求

确保 AccessKey 具有以下权限：

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "oss:PutObject",
        "oss:GetObject",
        "oss:DeleteObject",
        "oss:ListObjects",
        "oss:GetBucketInfo",
        "oss:PutObjectAcl",
        "oss:GetObjectAcl"
      ],
      "Resource": [
        "acs:oss:*:*:meta-linkr",
        "acs:oss:*:*:meta-linkr/*"
      ]
    }
  ]
}
```

或者直接使用系统策略：`AliyunOSSFullAccess`

## 测试验证

### 1. 测试上传（自动生成签名 URL）

```bash
curl -X POST http://localhost:8082/api/upload/avatar \
  --cookie "JSESSIONID=YOUR_SESSION_ID" \
  -F "file=@/path/to/image.jpg"
```

**返回结果**：
```json
{
  "code": 200,
  "data": "https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/avatar/xxx.jpg?Expires=1735689600&OSSAccessKeyId=xxx&Signature=xxx",
  "message": "success"
}
```

### 2. 测试前端访问

前端直接使用返回的 URL（签名 URL）即可正常访问。

## 总结

✅ **私有桶 + AccessKey 的访问机制**：

1. **后端访问**：使用 AccessKey 可以正常访问（上传、删除等）
2. **前端访问**：需要使用签名 URL，代码已自动生成
3. **无需修改前端代码**：签名 URL 格式兼容，前端可以直接使用

**当前实现**：代码已自动处理私有桶场景，上传后返回签名 URL，前端可以直接使用。

