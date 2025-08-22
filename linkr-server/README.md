# MetaLinkr 项目

## 📋 项目简介

MetaLinkr是一个基于Spring Boot的微服务架构项目，采用标准三层架构设计。

## 🏗️ 项目结构

```
MetaLinkr/
├── linkr-server/              # 后端服务
│   ├── pom.xml               # 父POM文件
│   ├── ARCHITECTURE.md       # 架构设计文档
│   ├── README.md             # 项目说明文档
│   └── admin-module/         # 管理员微服务模块
│       ├── pom.xml           # 模块POM文件
│       └── src/main/java/com/aleks/linkrmix/admin/
│           ├── AdminModuleApplication.java    # 主启动类
│           ├── controller/                    # 控制层
│           │   ├── AdminUserController.java   # 用户管理控制器
│           │   ├── AuthController.java        # 认证控制器
│           │   └── dto/                       # 数据传输对象
│           │       ├── LoginDto.java          # 登录DTO
│           │       ├── CreateUserDto.java     # 创建用户DTO
│           │       └── UpdateUserDto.java     # 更新用户DTO
│           ├── service/                       # 业务逻辑层
│           │   ├── AdminUserService.java      # 用户服务接口
│           │   ├── AuthService.java           # 认证服务接口
│           │   └── impl/                      # 服务实现类
│           │       ├── AdminUserServiceImpl.java
│           │       └── AuthServiceImpl.java
│           ├── dao/                           # 数据访问层
│           │   └── AdminUserDao.java          # 用户数据访问对象
│           ├── entity/                        # 实体类
│           │   └── AdminUser.java             # 管理员用户实体
│           ├── common/                        # 通用组件
│           │   └── ApiResponse.java           # 统一API响应格式
│           ├── util/                          # 工具类
│           │   └── PasswordUtil.java          # 密码工具类
│           └── config/                        # 配置类
│               └── SecurityConfig.java        # 安全配置
├── linkr-client/              # 前端客户端
│   └── linkr-dashboard/       # PC端管理后台
└── deploy/                    # 部署相关文件
```

## 🚀 快速开始

### 环境要求
- JDK 1.8+
- Maven 3.6+
- MySQL 8.0+
- Node.js 16+

### 启动步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd MetaLinkr
```

2. **配置数据库**
- 确保MySQL服务已启动
- 修改 `linkr-server/admin-module/src/main/resources/application.yml` 中的数据库连接信息

3. **启动后端服务**
```bash
cd linkr-server
mvn clean compile
cd admin-module
mvn spring-boot:run
```

4. **启动前端服务**
```bash
cd linkr-client/linkr-dashboard
npm install
npm run dev
```

5. **访问应用**
- 前端地址: http://localhost:5173
- 后端API: http://localhost:8080
- API文档: http://localhost:8080/api/admin/users

## 📋 API接口

### 用户管理接口
- `GET /api/admin/users` - 获取用户列表
- `GET /api/admin/users/{id}` - 获取指定用户
- `POST /api/admin/users` - 创建用户
- `PUT /api/admin/users/{id}` - 更新用户
- `DELETE /api/admin/users/{id}` - 删除用户

### 认证接口
- `POST /api/auth/login` - 用户登录

## 🔧 技术栈

- **框架**: Spring Boot 2.7.18
- **安全**: Spring Security 5.8.11
- **数据库**: MySQL 8.0.33
- **数据访问**: Spring JDBC
- **构建工具**: Maven
- **Java版本**: 1.8

## 🎯 架构特点

- **三层架构**: Controller → Service → DAO
- **统一响应**: 使用ApiResponse标准化API响应
- **参数验证**: 使用@Valid进行参数校验
- **密码加密**: BCrypt密码加密
- **事务管理**: 使用@Transactional注解

## 📝 开发规范

- 访问层命名为 **DAO** (Data Access Object)
- DTO类采用 **LoginDto** 这种命名规范
- 遵循RESTful API设计规范
- 使用统一的异常处理机制

## 🔄 版本历史

### v1.0.0 (当前版本)
- ✅ 完成项目重构，采用三层架构
- ✅ 清理冗余模块，保留admin-module
- ✅ 实现用户管理和认证功能
- ✅ 统一API响应格式
