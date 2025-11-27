# Shiro迁移说明

## 概述

本项目已从Spring Security迁移到Apache Shiro，使用Session进行认证。

## 主要变更

### 1. 依赖变更

- **移除**: `spring-boot-starter-security`
- **添加**: `shiro-spring-boot-web-starter` (版本: 1.13.0)
- **保留**: `spring-security-crypto` (用于密码编码)

### 2. 配置文件

#### ShiroConfig.java
- 配置Shiro过滤器链
- 配置Session管理器
- 配置安全管理器
- 注册自定义Session认证过滤器

#### SessionAuthFilter.java
- 自定义过滤器，统一处理Session认证
- 检查Session中是否存在用户信息
- 未认证时返回401错误

#### PasswordEncoderConfig.java
- 保留BCryptPasswordEncoder用于密码加密

### 3. Session工具类

#### ShiroSessionUtil.java
提供以下功能：
- `setUser(Object user)`: 将用户信息存储到Session
- `getUser()`: 从Session获取用户信息
- `setUserId(Long userId)`: 存储用户ID
- `getUserId()`: 获取用户ID
- `isAuthenticated()`: 检查是否已登录
- `clearUser()`: 清除Session中的用户信息
- `logout()`: 登出

## 使用说明

### 登录时设置Session

在登录成功后，需要将用户信息存储到Session中：

```java
import com.aleks.linkrmix.pwa.util.ShiroSessionUtil;

// 登录成功后
ShiroSessionUtil.setUser(user);
ShiroSessionUtil.setUserId(user.getId());
```

### 在Controller中获取当前用户

```java
import com.aleks.linkrmix.pwa.util.ShiroSessionUtil;

// 获取当前用户
User currentUser = ShiroSessionUtil.getUser();
Long userId = ShiroSessionUtil.getUserId();
```

### 登出

```java
import com.aleks.linkrmix.pwa.util.ShiroSessionUtil;

// 登出
ShiroSessionUtil.logout();
```

## 匿名访问接口

以下接口不需要认证（已配置为匿名访问）：
- `/api/download/**` - 文件下载
- `/api/auth/**` - 认证相关接口
- `/api/public/**` - 公共接口
- `/api/sms/**` - 短信接口
- `/api/test/**` - 测试接口
- `/api/upload/config` - 上传配置
- `/api/user/recommended-tags` - 推荐标签
- `/api/tags/recommended-tags` - 推荐标签
- `/actuator/**` - 系统监控
- `/error` - 错误页面
- `/favicon.ico` - 网站图标
- `/static/**` - 静态资源
- `/public/**` - 公共资源

## 其他接口

所有其他接口都需要通过Session认证，未认证的请求将返回401错误。

## Session配置

- Session超时时间: 30分钟
- Session验证间隔: 15分钟
- 自动删除过期Session: 是

## 问题解决记录

### 1. Realm配置问题

**问题**: Shiro启动时报错 `No bean of type 'org.apache.shiro.realm.Realm' found`

**原因**: Shiro的`DefaultWebSecurityManager`要求至少配置一个Realm bean，即使使用Session认证也需要一个占位Realm。

**解决方案**:
- 创建了`SessionRealm.java`，继承自`AuthorizingRealm`
- 由于使用Session认证，该Realm仅作为占位符，不执行实际认证逻辑
- 在`ShiroConfig.java`中配置`sessionRealm()`方法，并将其注入到`securityManager()`

**相关文件**:
- `SessionRealm.java` - 占位Realm实现
- `ShiroConfig.java` - Realm配置

### 2. 前端代理配置

**问题**: 前端开发环境需要代理API请求到后端服务器

**解决方案**:
- 在`vite.config.ts`中配置代理，将`/api`请求转发到后端服务器
- 配置`changeOrigin: true`确保跨域请求正常工作
- 使用`rewrite`规则去除`/api`前缀

**配置示例**:
```typescript
proxy: {
  '/api': {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    rewrite: (p) => p.replace(/^\/api/, ''),
  },
}
```

**注意事项**:
- 前端请求工具(`request.ts`)需要设置`withCredentials: true`以支持Session Cookie
- 生产环境需要配置Nginx等反向代理，而不是使用Vite代理

## 后续工作

1. ~~**Realm配置**: 已完成，创建了SessionRealm作为占位符~~ ✅
2. **登录接口改造**: 需要在登录接口中添加Session设置逻辑
3. **登出接口**: 需要实现登出接口，调用`ShiroSessionUtil.logout()`

## 注意事项

1. 当前实现仅进行Session认证，具体的认证逻辑（如用户名密码验证）需要在Realm中实现
2. 登录接口需要手动调用`ShiroSessionUtil.setUser()`来设置Session
3. 前端需要确保在请求时携带Session Cookie（浏览器会自动处理）

