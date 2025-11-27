# 前端Session认证迁移说明

## 概述

前端已从Token认证迁移到Session认证，与后端的Shiro Session认证保持一致。

## 主要变更

### 1. 统一的请求工具

**新增文件**: `src/utils/request.ts`

- 提供统一的HTTP请求封装
- 自动处理Session认证（通过`credentials: 'include'`发送Cookie）
- 自动处理401错误，跳转登录页
- 支持GET、POST、PUT、DELETE、文件上传等方法

**使用示例**:
```typescript
import { get, post, upload } from '@/utils/request'

// GET请求
const user = await get('/api/user/current')

// POST请求
await post('/api/auth/login', { phone, password })

// 文件上传
const result = await upload('/api/upload/avatar', formData)
```

### 2. 认证Store修改

**文件**: `src/stores/auth.ts`

**主要变更**:
- ❌ 移除了`token`状态
- ✅ `isLoggedIn`改为仅检查`user`是否存在
- ✅ 登录成功后不再存储token，Session由服务端自动设置
- ✅ 登出时调用后端登出接口清除Session
- ✅ `fetchUserInfo`通过`/api/user/current`获取当前用户信息

**使用示例**:
```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 登录
await authStore.smsLogin({ phone, verificationCode, rememberMe: false })

// 检查登录状态
if (authStore.isLoggedIn) {
  // 已登录
}

// 登出
await authStore.logout()
```

### 3. 用户Store修改

**文件**: `src/stores/user.ts`

**主要变更**:
- ❌ 移除了`token`状态
- ✅ `isLoggedIn`改为仅检查`user`是否存在
- ✅ 所有API调用改为使用统一的request工具
- ✅ 登出时调用后端登出接口

### 4. 服务文件修改

**文件**: `src/services/upload.ts`

**主要变更**:
- ❌ 移除了Authorization header
- ✅ 使用统一的upload方法，自动处理Session认证

### 5. 视图组件修改

**修改的文件**:
- `src/views/post/CreatePost.vue`
- `src/views/profile/EditProfile.vue`
- `src/views/auth/Login.vue`

**主要变更**:
- ❌ 移除了所有`Authorization: Bearer ${token}`header
- ✅ 所有fetch调用改为使用统一的request工具
- ✅ 自动发送Cookie进行Session认证

## 关键特性

### 1. 自动Cookie管理

浏览器会自动管理Session Cookie，无需前端手动处理：
- 登录成功后，服务端设置Session Cookie
- 后续请求自动携带Cookie
- 登出时服务端清除Session

### 2. 401错误处理

统一的request工具会自动处理401错误：
- 检测到401响应时，清除本地状态
- 自动跳转到登录页（如果不在登录页）

### 3. 跨域支持

如果前后端在不同域名，需要确保：
- 后端设置CORS允许携带Cookie
- 前端请求使用`credentials: 'include'`（已自动处理）

## 兼容性说明

### 已移除的功能

1. **Token存储**: 不再使用localStorage/sessionStorage存储token
2. **手动Token管理**: 不再需要手动设置Authorization header
3. **Token刷新**: Session由服务端管理，无需前端刷新

### 保留的兼容代码

为了兼容可能存在的旧代码，以下清理逻辑仍然保留：
- `localStorage.removeItem('linkr_token')` - 清除可能的旧token
- `sessionStorage.removeItem('linkr_token')` - 清除可能的旧token

## 测试要点

1. **登录流程**:
   - 短信登录
   - 密码登录
   - 测试登录

2. **认证检查**:
   - 未登录时访问需要认证的接口应返回401
   - 登录后应能正常访问接口

3. **登出流程**:
   - 登出后应清除Session
   - 登出后访问需要认证的接口应返回401

4. **Session持久化**:
   - 刷新页面后应保持登录状态（如果Session未过期）
   - Session过期后应自动跳转登录页

## 注意事项

1. **开发环境**: 确保前后端在同一域名或正确配置CORS
2. **生产环境**: 确保Session Cookie的SameSite和Secure属性正确配置
3. **HTTPS**: 生产环境建议使用HTTPS以确保Cookie安全传输

## 后续工作

1. **移除旧代码**: 可以逐步移除user.ts中的mock数据，改为从API获取
2. **错误处理**: 可以进一步完善错误处理逻辑
3. **加载状态**: 可以添加全局加载状态管理

