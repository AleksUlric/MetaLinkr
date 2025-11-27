# QQ登录功能实现指南

## 📋 功能概述

QQ登录功能已经完成开发，包括后端OAuth服务和前端SDK集成。用户可以通过QQ账号快速登录MetaLinkr PWA应用。

## 🏗️ 技术架构

### 后端实现
- **QQOAuthService**: QQ OAuth服务类，处理授权流程
- **QQAuthController**: QQ登录控制器，提供API接口
- **UserService**: 用户服务类，处理用户创建和绑定
- **SessionUserUtil**: Session工具类，绑定登录态
- **数据库支持**: `user_oauth`表存储第三方登录绑定关系

### 前端实现
- **QQ SDK集成**: 在`index.html`中引入QQ登录SDK
- **QQAuthService**: QQ登录服务类，处理API调用
- **QQLoginUtil**: QQ登录工具类，封装SDK操作
- **UI集成**: 在登录和注册页面添加QQ登录按钮

## 🔧 配置步骤

### 1. QQ互联应用配置

1. **注册QQ互联开发者账号**
   - 访问 [QQ互联官网](https://connect.qq.com/)
   - 使用QQ账号登录
   - 在"管理中心"中创建应用

2. **应用信息配置**
   - 应用名称: MetaLinkr PWA
   - 应用类型: 网站应用
   - 网站地址: `http://localhost:3000`
   - 回调地址: `http://localhost:3000/api/auth/qq/callback`

3. **获取应用密钥**
   - 审核通过后获取AppID和AppKey
   - 记录这些信息用于后续配置

### 2. 后端配置

更新 `application.yml` 文件中的QQ OAuth配置：

```yaml
# QQ OAuth配置
qq:
  oauth:
    app-id: YOUR_QQ_APP_ID        # 替换为实际的AppID
    app-key: YOUR_QQ_APP_KEY      # 替换为实际的AppKey
    redirect-uri: http://localhost:3000/api/auth/qq/callback
    scope: get_user_info
    display: pc
```

### 3. 前端配置

更新 `index.html` 文件中的QQ SDK配置：

```html
<!-- QQ登录SDK -->
<script 
  type="text/javascript" 
  src="http://qzonestyle.gtimg.cn/qzone/openapi/qc_loader.js" 
  data-appid="YOUR_QQ_APP_ID" 
  data-redirecturi="http://localhost:3000/api/auth/qq/callback" 
  charset="utf-8">
</script>
```

## 🚀 使用流程

### 1. 用户点击QQ登录
```javascript
// 前端调用
const loginWithQQ = async () => {
  // 检查SDK是否加载
  if (typeof window.QC === 'undefined' || !window.QC.check()) {
    ElMessage.error('QQ登录SDK未加载，请刷新页面重试')
    return
  }

  // 初始化QQ登录按钮
  window.QC.Login({
    btnId: "qqLoginBtn",
    scope: "get_user_info",
    size: "A_M",
    display: "pc"
  })
}
```

### 2. QQ授权流程
1. 用户点击QQ登录按钮
2. 跳转到QQ授权页面
3. 用户确认授权
4. QQ返回授权码到回调地址

### 3. 后端处理授权码
```java
@PostMapping("/callback")
public ApiResponse<LoginResult> qqCallback(@RequestBody QQLoginRequest request) {
    // 1. 获取QQ用户信息
    QQUserInfo qqUserInfo = qqOAuthService.getUserInfoByCode(request.getCode());
    
    // 2. 查找或创建用户
    User user = userService.findOrCreateByQQ(qqUserInfo);
    
    // 3. 绑定Session
    String sessionId = SessionUserUtil.bindUser(user);
    
    // 4. 返回登录结果
    LoginResult result = new LoginResult();
    result.setSessionId(sessionId);
    // ... 设置 user 信息
    return ApiResponse.success(result);
}
```

### 4. 前端处理登录结果
```javascript
// 监听QQ登录成功
window.QC.Api.get_user_info(async (openId, userInfo) => {
  if (openId && userInfo) {
    // 处理登录成功逻辑
    const result = await qqAuthService.handleCallback(code)
    // Session Cookie 由浏览器自动保存，跳转到首页
  }
})
```

## 📊 数据库设计

### user_oauth表
```sql
CREATE TABLE `user_oauth` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `platform` varchar(20) NOT NULL COMMENT '平台: wechat, qq, weibo',
  `openid` varchar(100) NOT NULL COMMENT '第三方平台用户ID',
  `unionid` varchar(100) DEFAULT NULL COMMENT '第三方平台统一ID',
  `access_token` varchar(500) DEFAULT NULL COMMENT '访问令牌',
  `refresh_token` varchar(500) DEFAULT NULL COMMENT '刷新令牌',
  `expires_at` datetime DEFAULT NULL COMMENT '令牌过期时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_platform_openid` (`platform`, `openid`)
);
```

## 🔒 安全考虑

1. **CSRF防护**: 使用state参数防止CSRF攻击
2. **Session安全**: Session 设置合理超时时间，Cookie 开启 HttpOnly/SameSite
3. **HTTPS**: 生产环境必须使用HTTPS
4. **参数验证**: 严格验证所有输入参数
5. **日志记录**: 记录登录日志便于审计

## 🧪 测试方法

### 1. 后端测试
```bash
# 测试QQ登录接口
curl -X GET http://localhost:8082/api/auth/qq/test
```

### 2. 前端测试
1. 启动前端应用: `npm run dev`
2. 启动后端应用: `mvn spring-boot:run`
3. 访问登录页面，点击QQ登录按钮
4. 检查控制台日志和网络请求

## 📝 API接口

### 获取QQ授权URL
```
GET /api/auth/qq/login
Response: {
  "success": true,
  "data": "https://graph.qq.com/oauth2.0/authorize?..."
}
```

### QQ登录回调
```
POST /api/auth/qq/callback
Request: {
  "code": "authorization_code",
  "state": "random_state"
}
Response: {
  "success": true,
  "data": {
    "sessionId": "shiro-session-id",
    "user": {...},
    "isFirstLogin": false
  }
}
```

### 测试QQ登录
```
GET /api/auth/qq/test
Response: {
  "success": true,
  "data": "测试QQ登录成功，SessionId: ..."
}
```

## 🐛 常见问题

### 1. QQ SDK未加载
**问题**: `QC is not defined`
**解决**: 检查网络连接，确保能访问QQ服务器

### 2. 授权失败
**问题**: 授权页面显示错误
**解决**: 检查AppID和回调地址配置是否正确

### 3. 用户信息获取失败
**问题**: 无法获取QQ用户信息
**解决**: 检查AppKey是否正确，确认应用已审核通过

### 4. Session绑定失败
**问题**: Session 没有成功创建
**解决**: 检查Shiro配置、跨域 Cookie 设置是否允许携带凭证

## 📈 后续优化

1. **微信登录**: 参考QQ登录实现微信登录
2. **微博登录**: 实现微博OAuth登录
3. **绑定功能**: 支持账号绑定多个第三方平台
4. **头像同步**: 自动同步第三方平台头像
5. **信息完善**: 引导用户完善个人信息

## 📞 技术支持

如有问题，请检查：
1. QQ互联应用配置是否正确
2. 网络连接是否正常
3. 控制台错误日志
4. 数据库连接状态

---

**注意**: 请将配置中的 `YOUR_QQ_APP_ID` 和 `YOUR_QQ_APP_KEY` 替换为实际的QQ应用密钥。
