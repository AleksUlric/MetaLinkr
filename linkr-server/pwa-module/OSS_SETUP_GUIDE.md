# 阿里云OSS配置和测试指南

## 当前配置状态

✅ **AccessKey配置已完成**
- AccessKey ID: `YOUR_ACCESS_KEY_ID` (请在配置文件中替换为实际值)
- AccessKey Secret: `YOUR_ACCESS_KEY_SECRET` (请在配置文件中替换为实际值)
- 端点: `https://oss-cn-hangzhou.aliyuncs.com`
- 存储桶: `meta-linkr` ✅ **已存在**

## 需要完成的配置步骤

### 1. OSS存储桶状态

✅ **存储桶已存在**
- 存储桶名称: `meta-linkr`
- 地域: 华东1（杭州）
- 状态: 已创建并配置完成

### 2. 配置CORS规则

在OSS控制台中，进入 `meta-linkr` 存储桶：

1. 点击 **权限管理** → **跨域设置**
2. 点击 **设置**
3. 添加规则：
   ```
   来源: *
   允许Methods: GET, POST, PUT, DELETE, HEAD
   允许Headers: *
   暴露Headers: ETag, x-oss-request-id
   缓存时间: 3600
   ```

### 3. 验证AccessKey权限

确保AccessKey具有以下权限：
- `AliyunOSSFullAccess` (OSS完全访问权限)
- 或者自定义权限：
  ```
  oss:GetObject
  oss:PutObject
  oss:DeleteObject
  oss:ListObjects
  oss:GetBucketInfo
  ```

## 测试OSS集成

### 1. 启动后端服务

```bash
cd linkr-server/pwa-module
mvn spring-boot:run
```

### 2. 测试上传接口

#### 测试头像上传
```bash
curl -X POST http://localhost:8082/api/upload/avatar \
  --cookie "JSESSIONID=YOUR_SESSION_ID" \
  -F "file=@/path/to/your/image.jpg"
```

#### 测试获取配置
```bash
curl -X GET http://localhost:8082/api/upload/config
```

### 3. 前端测试

1. 启动前端服务：
   ```bash
   cd linkr-client/pwa-front
   npm run dev
   ```

2. 访问个人信息完善页面：
   ```
   http://localhost:5173/complete-profile
   ```

3. 测试头像上传功能

## 常见问题排查

### 1. 403 Forbidden错误
**原因**: AccessKey权限不足或存储桶不存在
**解决**: 
- 检查AccessKey是否正确
- 确认存储桶 `metalinkr-images` 已创建
- 验证RAM用户权限

### 2. 404 Not Found错误
**原因**: 存储桶名称或区域不匹配
**解决**:
- 确认存储桶名称: `meta-linkr`
- 确认区域: `oss-cn-hangzhou`
- 检查endpoint配置

### 3. CORS错误
**原因**: 跨域设置不正确
**解决**:
- 配置正确的CORS规则
- 确保允许的Methods包含POST
- 检查允许的Headers设置

### 4. 文件上传失败
**原因**: 文件类型或大小限制
**解决**:
- 检查文件类型是否在允许列表中
- 确认文件大小不超过限制
- 查看后端日志获取详细错误信息

## 安全建议

### 1. AccessKey安全
- ⚠️ **重要**: 不要将AccessKey提交到代码仓库
- 建议使用环境变量或配置中心管理敏感信息
- 定期轮换AccessKey

### 2. 权限最小化
- 只授予必要的OSS权限
- 避免使用 `AliyunOSSFullAccess`
- 创建专用的RAM用户

### 3. 存储桶安全
- 设置合适的读写权限
- 启用访问日志
- 配置生命周期规则

## 环境变量配置（推荐）

为了避免在代码中暴露AccessKey，建议使用环境变量：

### 1. 修改application.yml
```yaml
aliyun:
  oss:
    endpoint: https://oss-cn-hangzhou.aliyuncs.com
    access-key-id: ${ALIYUN_ACCESS_KEY_ID:YOUR_ACCESS_KEY_ID}
    access-key-secret: ${ALIYUN_ACCESS_KEY_SECRET:YOUR_ACCESS_KEY_SECRET}
    bucket-name: ${ALIYUN_OSS_BUCKET:meta-linkr}
    domain: ${ALIYUN_OSS_DOMAIN:https://meta-linkr.oss-cn-hangzhou.aliyuncs.com}
    enabled: true
```

### 2. 设置环境变量
```bash
# Windows
set ALIYUN_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
set ALIYUN_ACCESS_KEY_SECRET=YOUR_ACCESS_KEY_SECRET

# Linux/Mac
export ALIYUN_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
export ALIYUN_ACCESS_KEY_SECRET=YOUR_ACCESS_KEY_SECRET
```

## 监控和日志

### 1. 启用OSS访问日志
在OSS控制台启用访问日志，监控文件上传情况。

### 2. 应用日志监控
检查应用日志中的OSS相关错误：
```bash
tail -f logs/pwa-module.log | grep -i oss
```

### 3. 性能监控
- 监控上传成功率
- 监控上传速度
- 监控存储使用量

## 下一步

1. ✅ OSS存储桶 `meta-linkr` 已存在
2. ✅ 配置CORS规则
3. ✅ 测试上传功能
4. 🔄 配置CDN加速（可选）
5. 🔄 设置文件生命周期规则
6. 🔄 实施监控和告警

## 联系支持

如果遇到问题，可以：
1. 查看阿里云OSS文档
2. 检查应用日志
3. 联系技术支持

---

**注意**: 请妥善保管AccessKey信息，不要泄露给他人。
