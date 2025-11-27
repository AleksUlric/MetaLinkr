# PWA Module 配置指南

## 📋 概述

本文档说明如何配置 PWA Module 的各项服务，包括阿里云短信、OSS、数据库、Redis 等。

## 🔧 配置方式

### 方式一：环境变量配置（推荐）

使用环境变量可以避免在代码中暴露敏感信息，更安全。

#### 1. 创建环境变量文件

复制 `env.example` 文件为 `.env` 或 `.env.properties`：

```bash
# Windows PowerShell
Copy-Item env.example .env

# Linux/Mac
cp env.example .env
```

#### 2. 配置环境变量

编辑 `.env` 文件，填入实际的配置值：

```properties
# 阿里云配置
ALIYUN_ACCESS_KEY_ID=LTAI5t6Q8LSzTN2ACGcGH25f
ALIYUN_ACCESS_KEY_SECRET=your_actual_secret_here
```

#### 3. 验证配置

启动应用后，检查日志确认配置是否加载成功。

### 方式二：直接修改 application.yml

如果不想使用环境变量，可以直接在 `application.yml` 中配置：

```yaml
aliyun:
  sms:
    access-key-id: YOUR_ACCESS_KEY_ID
    access-key-secret: YOUR_ACCESS_KEY_SECRET
```

⚠️ **注意**：这种方式会将敏感信息暴露在配置文件中，不推荐用于生产环境。

## 📝 详细配置说明

### 1. 阿里云短信服务配置

#### 获取 AccessKey

1. 登录 [阿里云控制台](https://ecs.console.aliyun.com/)
2. 进入"访问控制" > "用户"
3. 创建 RAM 用户或使用主账号
4. 创建 AccessKey，获取 AccessKey ID 和 AccessKey Secret
5. 授予短信服务权限（AliyunDysmsFullAccess）

#### 配置示例

**环境变量方式：**
```properties
ALIYUN_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
ALIYUN_ACCESS_KEY_SECRET=YOUR_ACCESS_KEY_SECRET
```

**application.yml 方式：**
```yaml
aliyun:
  sms:
    access-key-id: ${ALIYUN_ACCESS_KEY_ID:}
    access-key-secret: ${ALIYUN_ACCESS_KEY_SECRET:}
    sign-name: 杭州琳珂电子商务
    template-code: SMS_326741025
    template-content: "您的验证码是：${code}，5分钟内有效，请勿泄露。"
    expire-minutes: 5
    daily-limit: 10
    send-interval: 60
    enabled: true
    test-mode: false
    test-code: "123456"
```

#### 配置项说明

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `access-key-id` | 阿里云 AccessKey ID | - |
| `access-key-secret` | 阿里云 AccessKey Secret | - |
| `sign-name` | 短信签名（需在阿里云审核通过） | - |
| `template-code` | 短信模板代码（需在阿里云审核通过） | - |
| `template-content` | 短信模板内容 | - |
| `expire-minutes` | 验证码有效期（分钟） | 5 |
| `daily-limit` | 每日发送限制 | 10 |
| `send-interval` | 发送间隔（秒） | 60 |
| `enabled` | 是否启用短信服务 | true |
| `test-mode` | 测试模式（不实际发送短信） | false |
| `test-code` | 测试验证码 | "123456" |

### 2. 阿里云 OSS 配置

#### 配置示例

**环境变量方式：**
```properties
ALIYUN_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
ALIYUN_ACCESS_KEY_SECRET=YOUR_ACCESS_KEY_SECRET
```

**application.yml 方式：**
```yaml
aliyun:
  oss:
    endpoint: https://oss-cn-hangzhou.aliyuncs.com
    access-key-id: ${ALIYUN_ACCESS_KEY_ID:}
    access-key-secret: ${ALIYUN_ACCESS_KEY_SECRET:}
    bucket-name: meta-linkr
    domain: https://meta-linkr.oss-cn-hangzhou.aliyuncs.com
    path-prefix: uploads/
    max-file-size: 10485760  # 10MB
    allowed-extensions: jpg,jpeg,png,gif,webp,svg
    enabled: true
```

#### 配置项说明

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `endpoint` | OSS 服务端点 | - |
| `access-key-id` | 阿里云 AccessKey ID | - |
| `access-key-secret` | 阿里云 AccessKey Secret | - |
| `bucket-name` | OSS 存储桶名称 | - |
| `domain` | OSS 访问域名 | - |
| `path-prefix` | 文件路径前缀 | uploads/ |
| `max-file-size` | 最大文件大小（字节） | 10485760 (10MB) |
| `allowed-extensions` | 允许的文件扩展名 | jpg,jpeg,png,gif,webp,svg |
| `enabled` | 是否启用 OSS 服务 | true |

### 3. 数据库配置

#### 配置示例

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/linkr_pwa?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: your_password
```

### 4. Redis 配置

#### 配置示例

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    password: 
    database: 0
    timeout: 3000ms
    lettuce:
      pool:
        max-active: 8
        max-wait: -1ms
        max-idle: 8
        min-idle: 0
```

### 5. Session 配置

#### 配置示例

```yaml
server:
  servlet:
    session:
      timeout: 30m          # Session 30 分钟过期
      cookie:
        http-only: true
        secure: false       # 生产环境建议开启 HTTPS 并设置为 true
```

ℹ️ **说明**：PWA 模块完全依赖 Shiro Session 进行认证鉴权。请确保跨域配置允许携带 Cookie，并根据实际情况调整 `timeout` 与 Cookie 设置。

### 6. QQ OAuth 配置

#### 配置示例

```yaml
qq:
  oauth:
    app-id: YOUR_QQ_APP_ID
    app-key: YOUR_QQ_APP_KEY
    redirect-uri: http://localhost:3000/api/auth/qq/callback
    scope: get_user_info
    display: pc
```

## 🔒 安全建议

### 1. 敏感信息管理

- ✅ **推荐**：使用环境变量管理敏感信息
- ✅ **推荐**：将 `.env` 文件添加到 `.gitignore`
- ❌ **不推荐**：在代码中硬编码敏感信息
- ❌ **不推荐**：将敏感信息提交到代码仓库

### 2. AccessKey 安全

- 使用 RAM 用户创建 AccessKey，不要使用主账号
- 只授予必要的权限（最小权限原则）
- 定期轮换 AccessKey
- 不要在多个地方使用同一个 AccessKey

### 3. 生产环境配置

- 使用配置中心（如 Nacos、Apollo）管理配置
- 使用密钥管理服务（如阿里云 KMS）加密敏感信息
- 启用配置审计和访问日志

## 🧪 测试配置

### 测试短信服务

```bash
# 发送测试验证码
curl -X POST "http://localhost:8082/api/sms/test?phone=13800138000"
```

### 测试 OSS 服务

```bash
# 测试 OSS 连接
curl -X GET "http://localhost:8082/api/oss/test"
```

## 📚 相关文档

- [阿里云短信服务接入指南](./ALIYUN_SMS_GUIDE.md)
- [阿里云 OSS 配置指南](./OSS_SETUP_GUIDE.md)
- [QQ 登录配置指南](./QQ_LOGIN_GUIDE.md)

## ❓ 常见问题

### Q1: 环境变量不生效？

**A:** 检查以下几点：
1. 确保 `.env` 文件在项目根目录
2. 确保文件名为 `.env` 或 `.env.properties`
3. 重启应用使配置生效
4. 检查 `application.yml` 中的环境变量引用格式

### Q2: AccessKey 配置后仍然报错？

**A:** 检查以下几点：
1. AccessKey ID 和 Secret 是否正确
2. AccessKey 是否已启用
3. RAM 用户是否有相应的权限
4. 网络连接是否正常

### Q3: 如何切换测试模式？

**A:** 在 `application.yml` 中设置：
```yaml
aliyun:
  sms:
    test-mode: true  # 启用测试模式
```

测试模式下不会实际发送短信，直接返回测试验证码。

---

**最后更新**: 2025-01-10

