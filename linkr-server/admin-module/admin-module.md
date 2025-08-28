# Admin-Module 管理员微服务模块

## 概述

admin-module 是 MetaLinkr 项目的核心管理模块，提供用户管理、权限控制、系统配置等核心管理功能。

## 功能特性

- 👥 **用户管理**: 用户注册、登录、信息管理
- 🔐 **权限控制**: 基于角色的访问控制 (RBAC)
- ⚙️ **系统配置**: 系统参数配置和管理
- 📊 **数据统计**: 用户活跃度、系统使用统计
- 🔒 **安全认证**: JWT Token 认证机制

## 技术栈

- **框架**: Spring Boot 2.7.18
- **安全**: Spring Security 5.8.11
- **数据库**: MySQL 8.0.33
- **ORM**: MyBatis Plus 3.5.3.1
- **服务注册**: Nacos 2.2.3

## 快速开始

### 环境要求
- JDK 1.8+
- Maven 3.6+
- MySQL 8.0+

### 启动服务
```bash
cd linkr-server/admin-module
mvn spring-boot:run
```

### 访问地址
- **服务端口**: 8080
- **健康检查**: http://localhost:8080/actuator/health
- **API文档**: http://localhost:8080/swagger-ui.html

## 项目结构

```
admin-module/
├── src/main/java/com/aleks/linkrmix/admin/
│   ├── common/           # 公共组件
│   │   ├── config/       # 配置类
│   │   ├── response/     # 响应封装
│   │   └── exception/    # 异常处理
│   ├── controller/       # 控制器层
│   ├── service/          # 服务层
│   ├── manager/          # 管理层
│   ├── mapper/           # 数据访问层
│   └── model/            # 数据模型
│       ├── entity/       # 实体类
│       └── dto/          # 数据传输对象
└── src/main/resources/   # 配置文件
```

## 配置说明

### 数据库配置
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/linkr_admin
    username: root
    password: your_password
```

### Nacos 配置
```yaml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        service-name: admin-module
```

## API 接口

### 用户管理
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/users` - 获取用户列表
- `PUT /api/users/{id}` - 更新用户信息

### 系统管理
- `GET /api/system/config` - 获取系统配置
- `PUT /api/system/config` - 更新系统配置
- `GET /api/system/stats` - 获取系统统计

## 开发规范

- 遵循 RESTful API 设计规范
- 使用统一的异常处理机制
- 数据访问层命名为 **DAO**
- DTO 类采用 **LoginDto** 命名规范
- **Manager层规范**：
  - Manager类名应与数据库表名对应（表名 + Manager）
  - 例如：`admin_users` 表对应 `AdminUserManager`
  - 多个表联查的逻辑放在主表对应的Manager类中
  - Manager层只保留实现类，不需要接口和实现分离
