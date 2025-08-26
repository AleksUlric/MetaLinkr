# MetaLinkr - 全栈管理系统平台

## 📋 项目简介

MetaLinkr 是一个全栈管理系统平台，采用前后端分离架构，支持多端部署。项目集成了 Nacos 服务注册与配置中心，提供完整的微服务解决方案。

### 🌟 核心特性
- 📊 **多端支持**: PC端管理后台、移动端、微信小程序、H5端
- 🔧 **微服务架构**: 基于Spring Boot + Nacos的微服务架构
- 📝 **日志管理**: 完整的日志收集、存储、查询和分析功能
- 🚀 **一键部署**: 提供完整的批处理脚本，支持一键启动和停止
- 🔒 **安全认证**: 基于Spring Security的安全认证机制

## 🏗️ 项目结构

```
MetaLinkr/
├── linkr-server/              # 后端服务
│   ├── admin-module/          # 管理员微服务模块
│   │   ├── src/main/java/     # Java源代码
│   │   │   └── com/aleks/linkrmix/admin/
│   │   │       ├── common/    # 公共组件
│   │   │       │   ├── config/    # 配置类
│   │   │       │   ├── response/  # 响应封装
│   │   │       │   └── exception/ # 异常处理
│   │   │       ├── controller/    # 控制器层
│   │   │       ├── service/       # 服务层
│   │   │       ├── manager/       # 管理层
│   │   │       ├── mapper/        # 数据访问层
│   │   │       └── model/         # 数据模型
│   │   │           ├── entity/    # 实体类
│   │   │           └── dto/       # 数据传输对象
│   │   ├── src/main/resources/    # 配置文件
│   │   └── pom.xml               # Maven配置
│   ├── log-module/            # 日志管理微服务模块
│   │   ├── src/main/java/     # 日志模块源代码
│   │   ├── src/main/resources/    # 日志模块配置
│   │   └── pom.xml               # 日志模块Maven配置
│   └── pom.xml                   # 父级Maven配置
├── linkr-client/              # 前端客户端
│   ├── linkr-dashboard/       # PC端管理后台
│   │   ├── src/              # Vue源代码
│   │   ├── dist/             # 构建输出
│   │   └── package.json      # 前端依赖配置
│   └── linkr-log/            # 日志管理前端
│       ├── src/              # Vue源代码
│       ├── dist/             # 构建输出
│       └── package.json      # 前端依赖配置
├── nacos-server/             # Nacos服务注册与配置中心
│   ├── bin/                  # 启动脚本
│   ├── conf/                 # 配置文件
│   └── data/                 # 数据存储
├── deploy/                   # 部署相关文件
│   ├── backend/              # 后端部署文件
│   └── frontend/             # 前端部署文件
├── *.bat                     # Windows批处理脚本
├── package.json              # 根目录脚本配置
└── README.md                 # 项目说明文档
```

## 🚀 快速开始

### 环境要求
- JDK 1.8+
- Maven 3.6+
- MySQL 8.0+
- Node.js 16+

### 一键启动

```bash
# 安装依赖
npm run install:all

# 开发模式启动
npm run dev

# 构建项目
npm run build

# 生产模式启动
npm run start
```

### 分别启动

**Windows用户（推荐）：**
```bash
# 启动Nacos服务
start-nacos.bat

# 启动后端服务
start-backend.bat

# 启动前端服务
start-frontend.bat

# 检查服务状态
check-status.bat

# 停止所有服务
stop-all.bat
```

**手动启动：**

**1. 启动 Nacos 服务：**
```bash
cd nacos-server/bin
# Windows
startup.cmd -m standalone
# Linux/Mac
./startup.sh -m standalone
```

**2. 启动后端服务：**
```bash
cd linkr-server/admin-module
mvn spring-boot:run
```

**3. 启动前端服务：**
```bash
cd linkr-client/linkr-dashboard
npm install
npm run dev
```

## 🌐 服务访问

### 开发环境访问地址
- **Nacos控制台**: http://localhost:8848/nacos (账号: nacos, 密码: nacos)
- **Admin后端API**: http://localhost:8080
- **健康检查**: http://localhost:8080/actuator/health
- **Dashboard前端**: http://localhost:5173
- **Log前端**: http://localhost:5174

### 服务状态检查
```bash
# Windows
check-status.bat

# 或手动检查端口
netstat -ano | findstr :8080  # 检查后端服务
netstat -ano | findstr :5173  # 检查前端服务
netstat -ano | findstr :8848  # 检查Nacos服务
```

## 📱 多端支持

- **PC端管理后台** (`linkr-dashboard`) - Vue3 + Element Plus
- **日志管理前端** (`linkr-log`) - Vue3 + Element Plus
- **移动端** (计划中) - React Native / Flutter
- **微信小程序** (计划中) - 原生小程序
- **H5端** (计划中) - Vue3 + Vant

## 🔧 技术栈

### 后端
- **框架**: Spring Boot 2.7.18
- **安全**: Spring Security 5.8.11
- **数据库**: MySQL 8.0.33
- **ORM**: MyBatis Plus 3.5.3.1
- **分页**: PageHelper 1.4.6
- **服务注册**: Nacos 2.2.3
- **构建工具**: Maven

### 前端
- **框架**: Vue 3.4.0
- **UI库**: Element Plus 2.8.8
- **状态管理**: Pinia 2.2.4
- **路由**: Vue Router 4.4.5
- **构建工具**: Vite 5.0.0
- **语言**: TypeScript

## 📝 日志模块 (Log Module)

### 概述
日志模块是MetaLinkr项目的核心组件之一，负责收集、存储、查询和分析系统日志。该模块提供了完整的日志管理功能，包括日志概览、搜索、告警等功能。

### 功能特性
- 📊 **日志概览**: 提供日志统计信息，包括总日志数、错误日志数、警告日志数等
- 🔍 **日志搜索**: 支持多条件日志搜索，包括按级别、服务、模块、时间范围等
- 📈 **趋势分析**: 提供日志数量随时间变化的趋势图表
- ⚠️ **告警管理**: 支持告警规则配置和告警通知
- 🏷️ **服务管理**: 管理不同服务的日志收集和监控

### 数据库设计
1. **log_entry** (日志条目表) - 存储系统产生的所有日志信息
2. **service_info** (服务信息表) - 存储被监控服务的基本信息
3. **alert_rule** (告警规则表) - 存储告警规则配置

### API接口
- `GET /api/logs/overview` - 获取日志概览信息
- `POST /api/logs/search` - 搜索日志
- `GET /api/logs/{id}` - 获取日志详情
- `POST /api/logs` - 保存日志

## 🛠️ 服务管理脚本

### 脚本文件说明

#### 1. start-all.bat - 一键启动所有服务
**功能**: 按顺序启动所有服务组件
**用法**: 
```bash
start-all.bat          # 启动所有服务
start-all.bat stop     # 停止所有服务
start-all.bat restart  # 重启所有服务
```

**启动顺序**:
1. Nacos服务 (等待15秒)
2. Admin后端服务 (等待10秒)
3. Dashboard前端服务 (等待5秒)
4. Log前端服务 (等待5秒)

#### 2. stop-all.bat - 停止所有服务
**功能**: 停止所有运行中的服务
**用法**: 
```bash
stop-all.bat
```

#### 3. restart-all.bat - 一键重启所有服务
**功能**: 先停止所有服务，然后重新启动
**用法**: 
```bash
restart-all.bat
```

#### 4. start-log-frontend.bat - 单独启动Log前端
**功能**: 仅启动Log前端服务
**用法**: 
```bash
start-log-frontend.bat
```

#### 5. check-status.bat - 服务状态检查
**功能**: 检查所有服务的运行状态和端口占用情况
**用法**: 
```bash
check-status.bat
```

### 使用建议
1. **首次使用**: 运行 `start-all.bat` 启动所有服务
2. **日常开发**: 可以使用 `start-log-frontend.bat` 单独启动Log前端进行开发
3. **服务异常**: 使用 `check-status.bat` 检查服务状态
4. **重启服务**: 使用 `restart-all.bat` 或 `start-all.bat restart`
5. **停止服务**: 使用 `start-all.bat stop` 或 `stop-all.bat`

## 📝 开发规范

- 数据访问层命名为 **DAO** (Data Access Object)
- DTO类采用 **LoginDto** 这种命名规范
- 遵循RESTful API设计规范
- 使用统一的异常处理机制
- 采用微服务架构，支持服务注册与发现

## 🔄 版本历史

### v1.0.2 (当前版本)
- ✅ 整合项目文档，将所有MD文件内容合并到主README.md
- ✅ 删除单独的MD文件，优化项目文档结构
- ✅ 完善日志管理模块的前端界面和功能
- ✅ 新增日志搜索、告警配置、服务管理等功能
- ✅ 优化批处理脚本，新增日志模块启动脚本
- ✅ 完善项目架构说明和技术栈文档
- ✅ 更新服务访问地址和端口配置

### v1.0.1
- ✅ 优化项目结构，将config包移至common包下
- ✅ 修复Bean冲突问题，确保服务正常启动
- ✅ 完善批处理脚本，支持一键启动和状态检查
- ✅ 更新项目文档，提供详细的使用说明
- ✅ 优化服务注册和发现配置
- ✅ 集成日志管理模块
- ✅ 完善多端前端架构

### v1.0.0
- ✅ 完成项目重构，采用前后端分离架构
- ✅ 实现PC端管理后台
- ✅ 支持多端扩展架构
- ✅ 统一API响应格式
- ✅ 集成Nacos服务注册与配置中心
- ✅ 支持微服务部署

## ⚠️ 注意事项

1. 确保已安装Java、Maven、Node.js等必要环境
2. 首次运行可能需要较长时间安装依赖
3. 如果端口被占用，请先停止相关服务
4. 建议在管理员权限下运行脚本
5. 服务启动有一定延迟，请耐心等待
6. 日志数据量可能很大，建议定期清理历史数据
7. 告警规则的条件表达式需要仔细设计，避免误报
8. 生产环境建议配置日志轮转和归档策略
9. 敏感信息不应该记录在日志中

## 🔧 故障排除

### 常见问题
1. **端口被占用**: 使用 `check-status.bat` 检查端口占用情况
2. **依赖安装失败**: 检查网络连接和npm配置
3. **服务启动失败**: 查看命令行窗口的错误信息
4. **权限问题**: 以管理员身份运行脚本

### 日志查看
- Nacos日志: `nacos-server/logs/`
- 后端日志: 查看后端服务命令行窗口
- 前端日志: 查看前端服务命令行窗口

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 项目地址：[GitHub Repository]
- 邮箱：[your-email@example.com]

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
