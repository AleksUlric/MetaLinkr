# OSS 默认头像 403 错误分析

## 问题描述

新用户注册时，默认头像返回 403 Forbidden 错误。

默认头像URL格式：
```
https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/default-avatars/male-avatar.png
https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/default-avatars/female-avatar.png
```

## 403 错误的可能原因

### 1. **文件上传时未设置 ACL（访问控制列表）** ⚠️ **最可能的原因**

**问题分析：**
- 查看 `OssService.java` 代码，上传文件时只设置了 `ObjectMetadata`，但**没有设置 ACL 为公共读**
- 即使存储桶设置为"公共读"，如果文件本身没有设置公共读权限，访问时仍会返回 403

**代码位置：**
```java
// OssService.java 第 71-76 行
PutObjectRequest putObjectRequest = new PutObjectRequest(
    ossConfig.getBucketName(), 
    objectKey, 
    inputStream, 
    metadata
);
// ❌ 缺少：putObjectRequest.setObjectAcl(CannedAccessControlList.PublicRead);
```

**解决方案：**
在上传文件时设置 ACL 为公共读：
```java
putObjectRequest.setObjectAcl(CannedAccessControlList.PublicRead);
```

### 2. **默认头像文件不存在**

**问题分析：**
- 默认头像文件 `male-avatar.png` 和 `female-avatar.png` 可能没有上传到 OSS
- 路径应该是：`uploads/default-avatars/male-avatar.png`

**检查方法：**
1. 登录阿里云OSS控制台
2. 进入 `meta-linkr` 存储桶
3. 检查 `uploads/default-avatars/` 目录下是否存在：
   - `male-avatar.png`
   - `female-avatar.png`

**解决方案：**
如果文件不存在，需要上传默认头像文件到 OSS。

### 3. **存储桶权限配置问题**

**问题分析：**
- 虽然文档说明存储桶是"公共读"，但实际配置可能不是
- 或者存储桶是公共读，但文件权限覆盖了存储桶权限

**检查方法：**
1. 登录阿里云OSS控制台
2. 进入 `meta-linkr` 存储桶
3. 点击"权限管理" → "读写权限"
4. 确认是否设置为"公共读"

**解决方案：**
- 如果存储桶不是公共读，设置为"公共读"
- 或者确保每个文件都设置了公共读权限（推荐方案1）

### 4. **防盗链设置**

**问题分析：**
- OSS 可能启用了防盗链功能
- 如果请求来源不在白名单中，会返回 403

**检查方法：**
1. 登录阿里云OSS控制台
2. 进入 `meta-linkr` 存储桶
3. 点击"权限管理" → "防盗链"
4. 检查是否启用了防盗链

**解决方案：**
- 如果启用了防盗链，添加允许的 Referer（如 `*` 或具体域名）
- 或者关闭防盗链（不推荐，安全性较低）

### 5. **CORS 配置问题**

**问题分析：**
- 虽然 CORS 主要影响跨域请求，但如果配置不当也可能导致 403

**检查方法：**
1. 登录阿里云OSS控制台
2. 进入 `meta-linkr` 存储桶
3. 点击"权限管理" → "跨域设置"
4. 检查 CORS 规则是否正确配置

## 推荐解决方案

### 方案1：修复上传代码，设置文件 ACL（推荐）

修改 `OssService.java`，在上传文件时设置 ACL 为公共读：

```java
import com.aliyun.oss.model.CannedAccessControlList;

// 在 uploadFile 和 uploadFileWithName 方法中
PutObjectRequest putObjectRequest = new PutObjectRequest(
    ossConfig.getBucketName(), 
    objectKey, 
    inputStream, 
    metadata
);
// ✅ 添加这一行
putObjectRequest.setObjectAcl(CannedAccessControlList.PublicRead);

ossClient.putObject(putObjectRequest);
```

### 方案2：批量设置现有文件的 ACL

如果默认头像文件已经存在，可以通过以下方式批量设置 ACL：

1. **使用阿里云控制台：**
   - 进入 OSS 控制台
   - 选择文件
   - 点击"设置" → "设置 ACL" → 选择"公共读"

2. **使用 OSS 工具：**
   - 使用 ossutil 工具批量设置
   - 或编写脚本批量设置

### 方案3：验证文件是否存在

如果文件不存在，需要：
1. 准备默认头像图片（male-avatar.png 和 female-avatar.png）
2. 上传到 OSS 的 `uploads/default-avatars/` 目录
3. 确保上传时设置 ACL 为公共读

## 排查步骤

1. **检查文件是否存在**
   ```bash
   # 在浏览器中直接访问URL
   https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/default-avatars/male-avatar.png
   ```

2. **检查存储桶权限**
   - 登录OSS控制台检查存储桶读写权限

3. **检查文件权限**
   - 在OSS控制台中选择文件，查看ACL设置

4. **检查上传代码**
   - 确认上传时是否设置了 ACL

5. **查看OSS访问日志**
   - 在OSS控制台查看访问日志，确认具体错误原因

## 总结

**最可能的原因是：文件上传时没有设置 ACL 为公共读。**

建议优先修复 `OssService.java` 中的上传代码，确保所有上传的文件都设置为公共读权限。

