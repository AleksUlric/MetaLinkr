# MetaLinkr - 全栈管理系统平台

## 📋 项目简介

MetaLinkr 是一个全栈管理系统平台，采用前后端分离架构，支持多端部署。项目集成了 Nacos 服务注册与配置中心，提供完整的微服务解决方案。

### 🌟 核心特性
- 📊 **多端支持**: PC端管理后台、移动端、微信小程序、H5端
- 🔧 **微服务架构**: 基于Spring Boot + Nacos的微服务架构
- 🚀 **一键部署**: 提供完整的批处理脚本，支持一键启动和停止
- 🔒 **安全认证**: 基于Spring Security的安全认证机制
- 🛡️ **统一错误处理**: 完整的错误码定义、异常处理和响应格式
- 📈 **日志纳管**: 基于 ELK Stack 的集中化日志收集、处理和分析系统

## 📚 模块文档

- [Admin-Module](./linkr-server/admin-module/admin-module.md) - 管理员微服务模块
- [Admin-Front](./linkr-client/admin-front/admin-front.md) - 管理员前端应用
- [Nacos-Server](./nacos-server/nacos-server.md) - 服务注册与配置中心
- [Common-Module](./linkr-server/common-module/common-module.md) - 统一错误处理系统
- [ELK 日志纳管系统](./elk-log-management-design.md) - 基于 ELK Stack 的日志管理方案
- [ELK 部署指南](./elk-deployment-guide.md) - ELK 系统部署和运维指南

## 🏗️ 项目结构

```
MetaLinkr/
├── linkr-server/              # 后端服务
│   ├── common-module/         # 公共模块（错误处理、工具类等）
│   │   ├── src/main/java/     # 公共组件源代码
│   │   │   └── com/aleks/linkrmix/common/
│   │   │       ├── response/  # 统一响应格式
│   │   │       └── exception/ # 异常处理
│   │   └── pom.xml           # 公共模块Maven配置
│   ├── admin-module/          # 管理员微服务模块
│   │   ├── src/main/java/     # Java源代码
│   │   │   └── com/aleks/linkrmix/admin/
│   │   │       ├── common/    # 公共组件
│   │   │       │   ├── config/    # 配置类
│   │   │       │   ├── util/      # 工具类
│   │   │       │   ├── response/  # 响应封装
│   │   │       │   └── exception/ # 异常处理
│   │   │       ├── controller/    # 控制器层
│   │   │       ├── service/       # 服务层
│   │   │       │   └── impl/      # 服务实现
│   │   │       ├── manager/       # 数据访问层
│   │   │       │   └── impl/      # 管理器实现
│   │   │       ├── mapper/        # Mapper接口层
│   │   │       ├── model/         # 数据模型
│   │   │       │   ├── entity/    # 实体类
│   │   │       │   ├── dto/       # 请求对象
│   │   │       │   └── vo/        # 响应对象
│   │   │       └── out/           # 对外接口
│   │   │           └── api/       # Dubbo接口
│   │   │               ├── service/   # 接口定义
│   │   │               └── impl/      # 接口实现
│   │   ├── src/main/resources/    # 配置文件
│   │   └── pom.xml               # Maven配置
│   └── pom.xml                   # 父级Maven配置
├── linkr-client/              # 前端客户端
│   └── admin-front/           # PC端管理后台
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
├── scripts/                  # 批处理脚本目录
│   ├── start-all.bat         # 一键启动所有服务
│   ├── start-admin-module.bat # 管理员模块启动脚本
│   ├── start-admin-front.bat # 管理员前端启动脚本
│   ├── start-mysql.bat       # MySQL服务管理脚本
│   ├── start-nacos.bat       # Nacos服务管理脚本
│   ├── check-status.bat      # 服务状态检查脚本
│   ├── stop-all.bat          # 停止所有服务脚本
│   └── restart-all.bat       # 重启所有服务脚本
├── package.json              # 根目录脚本配置
└── README.md                 # 项目说明文档
```

## 🚀 快速开始

### 环境要求
- JDK 1.8+
- Maven 3.6+
- MySQL 8.0+
- Node.js 16+
- Docker 20.10+ (用于 ELK 日志纳管系统)
- Docker Compose 2.0+ (用于 ELK 日志纳管系统)

### 脚本编码优化
项目中的批处理脚本已进行编码优化，解决Windows命令行中的乱码问题：

#### 🎯 优化目标
- 解决Windows命令行中批处理脚本的乱码问题
- 提升用户体验和界面美观性

#### 🔧 主要修改内容

**1. 编码设置**
- 在所有脚本开头添加 `chcp 65001 >nul`
- 设置控制台编码为UTF-8，支持中文和特殊字符显示

**2. 图标使用**
使用直观的图标替代英文标识，提升用户体验：

| 图标 | 含义 | 使用场景 |
|------|------|----------|
| ✅ | 成功/正常 | 服务启动成功、端口可用等 |
| ❌ | 失败/错误 | 服务启动失败、端口被占用等 |
| 🔍 | 检查/搜索 | 检查服务状态、端口占用等 |
| 🚀 | 启动/运行 | 服务启动、开始操作等 |
| 🛑 | 停止 | 服务停止、操作终止等 |
| 🔄 | 重启 | 服务重启、重新开始等 |
| ⚠️ | 警告 | 端口被占用、文件缺失等 |
| 💡 | 提示/建议 | 使用说明、操作建议等 |
| 📊 | 信息/状态 | 服务信息、状态显示等 |
| 🌐 | 网络/地址 | 访问地址、网络相关等 |
| 🔧 | 配置/设置 | 服务配置、系统设置等 |
| 📝 | 日志/记录 | 日志信息、记录相关等 |
| 🖥️ | 前端/界面 | 前端服务、用户界面等 |
| 📁 | 目录/文件 | 文件路径、目录信息等 |
| 📅 | 时间/日期 | 时间显示、日期信息等 |
| 🔗 | 链接/连接 | 访问链接、连接信息等 |
| 👤 | 用户/账号 | 用户信息、账号相关等 |
| 🔑 | 密码/密钥 | 密码信息、密钥相关等 |
| 📋 | 配置/参数 | 配置参数、设置选项等 |
| ❓ | 询问/选择 | 用户选择、确认操作等 |
| 🚫 | 终止/禁止 | 进程终止、操作禁止等 |
| ⏳ | 等待/加载 | 等待时间、加载状态等 |

**3. 已优化的脚本文件**
- ✅ `check-status.bat` - 服务状态检查脚本
- ✅ `start-mysql.bat` - MySQL服务管理脚本
- ✅ `start-nacos.bat` - Nacos服务管理脚本
- ✅ `start-all.bat` - 一键启动所有服务脚本
- ✅ `start-admin-module.bat` - 管理员模块启动脚本
- ✅ `start-log-module.bat` - 日志模块启动脚本
- ✅ `start-admin-front.bat` - 管理员前端启动脚本
- ✅ `start-log-front.bat` - 日志前端启动脚本
- ✅ `stop-all.bat` - 停止所有服务脚本
- ✅ `restart-all.bat` - 重启所有服务脚本

#### 🎨 优化效果

**优化前**
- 特殊字符显示为乱码
- 英文标识不够直观
- 用户体验较差

**优化后**
- 中文显示正常，无乱码
- 图标直观易懂
- 界面美观友好
- 用户体验显著提升

#### 💡 注意事项

1. **编码设置**: 确保所有脚本都包含 `chcp 65001 >nul`
2. **图标兼容性**: 使用的图标在Windows 10及以上版本支持良好
3. **中文显示**: 脚本中的中文内容现在可以正常显示
4. **PowerShell支持**: 在PowerShell中运行可能需要使用 `.\` 前缀

#### 🔄 维护建议

1. 新增脚本时，记得添加编码设置
2. 保持图标使用的一致性
3. 定期检查脚本的编码状态
4. 如有新的图标需求，可以扩展图标库

### 一键启动

```bash
# 启动所有服务
start-all.bat

# 启动 ELK 日志纳管系统
start-elk.bat

# 检查服务状态
check-status.bat
check-elk-status.bat

# 停止所有服务
stop-all.bat
stop-elk.bat
```

### 分别启动

**Windows用户：**
```bash
# 启动Nacos服务
start-nacos.bat

# 启动Admin后端服务
start-admin-module.bat

# 启动Admin前端服务
start-admin-front.bat
```

**手动启动：**
```bash
# 安装依赖
npm run install:all

# 开发模式启动
npm run dev

# 构建项目
npm run build
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
cd linkr-client/admin-front
npm install
npm run dev
```

## 🌐 服务访问

### 开发环境访问地址
- **Nacos控制台**: http://localhost:8848/nacos (账号: nacos, 密码: nacos)
- **Admin后端API**: http://localhost:8080
- **健康检查**: http://localhost:8080/actuator/health
- **Admin前端**: http://localhost:5173

### ELK 日志纳管系统访问地址
- **Kibana 可视化界面**: http://localhost:5601
- **Elasticsearch API**: http://localhost:9200
- **Logstash 监控**: http://localhost:9600 (完整配置)
- **Nginx 测试页面**: http://localhost:80
- **ES Head 管理工具**: http://localhost:9100

### ELK 配置选择
项目提供三种ELK配置：

#### 1. 完整配置 (推荐)
- **内存使用**: 约1.2GB
- **镜像大小**: 约1.6GB
- **功能**: 完整的日志收集、处理、存储、分析功能
- **启动**: `scripts\start-elk.bat`
- **适用**: 生产环境、功能要求高的场景

#### 2. 超轻量配置 (内存受限环境)
- **内存使用**: 约208MB (节省944MB)
- **镜像大小**: 约1.6GB
- **功能**: 基础日志收集、存储、查询功能
- **启动**: `scripts\start-elk-ultra-minimal.bat`
- **特点**: 去掉Logstash，Filebeat直接输出到Elasticsearch
- **适用**: 开发环境、内存受限的环境
- **详细说明**: [ELK超轻量配置优化说明](./elk-config/elk-ultra-minimal-optimization.md)

#### 3. 微镜像配置 (极低资源环境)
- **内存使用**: 约104MB (节省1048MB)
- **镜像大小**: 约400MB (节省1200MB)
- **功能**: 基础日志收集、存储、查询功能
- **启动**: `scripts\start-elk-micro-minimal.bat`
- **特点**: 使用Alpine镜像，去掉Logstash，极简配置
- **适用**: 极低内存和存储环境
- **详细说明**: [Docker镜像优化说明](./elk-config/docker-image-optimization.md)

### Nacos 配置选择
项目提供三种Nacos配置：

#### 1. 标准配置 (推荐)
- **内存使用**: 约1GB+
- **功能**: 完整的服务注册、配置管理、集群支持
- **启动**: `scripts\start-nacos.bat`
- **适用**: 生产环境、功能要求高的场景

#### 2. 轻量化配置 (内存受限环境)
- **内存使用**: 约512MB (节省50%)
- **功能**: 基础服务注册、配置管理功能
- **启动**: `scripts\start-nacos-minimal.bat`
- **特点**: 通过JVM参数优化减少内存占用
- **适用**: 开发环境、内存受限的环境

#### 3. 超轻量化配置 (极低资源环境)
- **内存使用**: 约512MB (节省75%)
- **功能**: 基础服务注册、配置管理功能
- **启动**: `scripts\start-nacos-ultra-minimal.bat`
- **特点**: 使用内置MySQL，JVM参数极简优化
- **适用**: 极低内存环境
- **详细说明**: [Nacos轻量化配置总结](./nacos-optimization-summary.md)

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

- **PC端管理后台** (`admin-front`) - Vue3 + Element Plus
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

## 📝 核心模块

### Common-Module (公共模块)
- **功能**: 统一错误处理、响应格式、工具类
- **技术栈**: Spring Boot + Spring Web + Validation
- **详细文档**: [Common-Module文档](./linkr-server/common-module/common-module.md)

### Admin-Module (管理员模块)
- **功能**: 用户管理、权限控制、系统配置
- **端口**: 8080
- **技术栈**: Spring Boot + Spring Security + MyBatis Plus



### Admin-Front (管理员前端)
- **功能**: PC端管理界面
- **端口**: 5173
- **技术栈**: Vue 3 + TypeScript + Element Plus
- **详细文档**: [Admin-Front文档](./linkr-client/admin-front/admin-front.md)

### Nacos (服务注册中心)
- **功能**: 服务注册、配置管理
- **端口**: 8848
- **技术栈**: Nacos 2.2.3
- **详细文档**: [Nacos文档](./nacos-server/nacos-server.md)


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
3. Admin前端服务 (等待5秒)

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

#### 4. start-admin-module.bat - 单独启动Admin后端
**功能**: 仅启动Admin后端服务
**用法**: 
```bash
start-admin-module.bat
```

#### 5. start-admin-front.bat - 单独启动Admin前端
**功能**: 仅启动Admin前端服务
**用法**: 
```bash
start-admin-front.bat
```

#### 6. check-status.bat - 服务状态检查
**功能**: 检查所有服务的运行状态和端口占用情况
**用法**: 
```bash
check-status.bat
```

### 使用建议
1. **首次使用**: 运行 `start-all.bat` 启动所有服务
2. **日常开发**: 可以使用 `start-admin-front.bat` 单独启动前端进行开发
3. **服务异常**: 使用 `check-status.bat` 检查服务状态
4. **重启服务**: 使用 `restart-all.bat` 或 `start-all.bat restart`
5. **停止服务**: 使用 `start-all.bat stop` 或 `stop-all.bat`

## 📝 开发规范

### 项目结构规范

#### 模块划分
- **common-module**: 公共模块，包含工具类、通用组件等
- **admin-module**: 管理员模块，包含用户管理、权限管理等功能

#### 包结构规范
每个模块应遵循以下包结构：
```
src/main/java/com/aleks/linkrmix/{module}/
├── controller/          # 控制器层
├── service/            # 服务层
│   └── impl/          # 服务实现
├── manager/            # 管理器层（业务逻辑）
├── mapper/             # 数据访问层
├── model/              # 数据模型包
│   ├── entity/         # 实体类
│   ├── dto/            # 数据传输对象
│   └── vo/             # 响应对象
├── config/             # 配置类
└── common/             # 模块内部公共代码
    ├── utils/          # 工具类
    ├── response/       # 响应对象
    └── exception/      # 异常处理
```

#### 公共代码管理规范
1. **项目级公共代码**: 放在 `common-module` 中，供所有模块使用
   - 工具类（如分页工具、日期工具等）
   - 通用组件（如统一响应格式、异常处理等）
   - 公共配置

2. **模块级公共代码**: 放在各模块的 `common` 包下
   - 模块内部工具类
   - 模块特定的响应格式
   - 模块内部异常处理

3. **工具类放置原则**:
   - 跨模块使用的工具类 → `common-module`
   - 模块内部使用的工具类 → 模块内的 `common/utils`
   - 不要与 `controller`、`service` 等包平行创建 `utils` 包

### Manager层规范

#### 1. 命名规范
- **Manager类名应与数据库表名对应**（表名 + Manager）
- 使用驼峰命名法，表名转换为类名
- 例如：
  - `admin_users` 表 → `AdminUserManager`
  - `log_entry` 表 → `LogEntryManager`
  - `service_info` 表 → `ServiceInfoManager`
  - `alert_rule` 表 → `AlertRuleManager`

#### 2. 架构规范
- **只保留实现类**，不需要接口和实现分离
- 直接使用 `@Component` 注解，Spring自动管理
- 使用 `@Resource` 注解进行依赖注入（推荐）或 `@RequiredArgsConstructor`

#### 3. 联查逻辑规范
- **多个表联查的逻辑放在主表对应的Manager类中**
- 主表通常是业务的核心表
- 避免在多个Manager类中重复实现相同的联查逻辑

#### 4. 代码结构示例

```java
@Slf4j
@Component
public class LogEntryManager {
    
    @Resource
    private LogEntryMapper logEntryMapper;
    
    @Resource
    private ServiceInfoMapper serviceInfoMapper; // 联查时注入其他Mapper
    
    // 基础CRUD方法
    public void save(LogEntry logEntry) {
        logEntryMapper.insert(logEntry);
    }
    
    // 联查方法示例
    public PageResult<LogEntry> searchLogsWithServiceInfo(LogSearchDTO searchDTO) {
        // 实现联查逻辑
    }
}
```

#### 5. 当前项目Manager层结构

##### admin-module
- `AdminUserManager.java` - 管理 `admin_users` 表

#### 6. 开发建议
- 保持Manager类职责单一，专注于对应表的业务逻辑
- 复杂业务逻辑可以组合多个Manager类
- 遵循统一的异常处理和日志记录规范
- 使用MyBatis-Plus提供的通用CRUD方法

### 命名规范
- **数据访问层**: 统一命名为 **Manager** (如: `UserManager`, `LogManager`)
- **Mapper接口**: 使用 **Mapper** 后缀 (如: `UserMapper`, `LogMapper`)
- **请求对象**: 使用 **DTO** 后缀 (如: `LoginDTO`, `UserCreateDTO`)
- **响应对象**: 使用 **VO** 后缀 (如: `UserVO`, `LogVO`)
- **分页结果**: 使用 **PageResult** 封装 (基于 PageHelper)

### 数据传输对象规范
- **DTO (Data Transfer Object)**: 用于接收前端请求参数，包含验证注解
- **VO (View Object)**: 用于返回给前端的数据，不包含验证注解
- **Entity**: 数据库实体对象，对应数据库表结构
- **Controller层**: 接收DTO，返回VO
- **Service层**: 处理DTO，返回VO
- **Manager层**: 接收DTO，返回Entity或VO

### 数据模型规范
- **Entity、DTO、VO类必须放在model包下**：
  - `model/entity/` - 数据库实体类
  - `model/dto/` - 请求数据传输对象
  - `model/vo/` - 响应数据对象
- **禁止在根包下直接创建entity、dto、vo包**
- **所有模块必须遵循此规范，确保项目结构统一**

### 架构规范
- **Controller层**: 接收请求，参数使用Dto对象，返回Vo对象
- **Service层**: 业务逻辑处理，调用Manager层
- **Manager层**: 数据访问层，直接接收DTO参数，使用Wrapper或Mapper进行数据库操作，无需接口+实现模式
- **Mapper层**: 数据库访问接口，包含XML映射文件
- **分页查询**: 统一使用PageHelper + PageResult封装

### 代码规范
- 遵循RESTful API设计规范
- 使用统一的异常处理机制
- 采用微服务架构，支持服务注册与发现
- 统一响应格式和错误码
- Manager层直接接收DTO参数，使用Wrapper或Mapper进行数据库操作，无需接口+实现模式
- 所有公共组件统一放在common包下
- **依赖注入规范**：
  - 推荐使用 `@Resource` 注解进行依赖注入
  - 也可以使用 `@RequiredArgsConstructor` + `final` 字段的方式
  - 避免使用 `@Autowired` 注解（Spring推荐使用构造器注入或字段注入）
- **Controller接口规范**：
  - 请求参数必须使用DTO封装，禁止使用Map<String, Object>等泛型参数
  - 返回结果必须使用VO封装，确保接口文档清晰
  - 所有DTO和VO类必须添加完整的字段注释和验证注解
  - 使用@Valid注解进行参数校验
  - 详细规范请参考：[Controller接口规范](./CONTROLLER_API_STANDARDS.md)

## 🔄 版本历史

### v2.0.0 (当前版本)
- ✅ 清理所有日志收集处理功能，为后续新架构做准备
- ✅ 移除log-module模块及相关代码
- ✅ 移除Kafka相关配置和依赖
- ✅ 移除日志前端应用
- ✅ 更新项目文档和脚本
- ✅ 优化项目结构，专注于核心管理功能

### v1.3.0
- ✅ 新增统一错误处理系统，包含错误码定义、异常处理、响应格式
- ✅ 创建Common-Module公共模块，提供全局异常处理器和工具类
- ✅ 完善错误码分类，按功能模块划分（通用、认证、服务、数据库等）
- ✅ 重构数据传输对象规范，明确DTO和VO的使用场景
- ✅ 优化分页返回逻辑，使用PageUtils工具类简化代码
- ✅ 完善项目开发规范，明确Controller接收DTO返回VO的规范

### v1.1.0
- ✅ 更新项目开发规范，明确数据模型必须放在model包下
- ✅ 统一所有模块的包结构规范，确保项目架构一致性
- ✅ 优化模块架构，符合项目整体规范

### v1.0.9
- ✅ 全面优化Manager层架构，移除接口+实现模式
- ✅ 简化包结构，Manager层直接实现无需impl子包
- ✅ 统一Manager层设计，提高代码简洁性和可维护性
- ✅ 完成Admin模块的Manager层优化

### v1.0.8
- ✅ 优化Manager层参数传递，直接接收DTO参数使用Wrapper
- ✅ 简化Service层逻辑，避免DTO到Map的复杂转换
- ✅ 提高代码可读性和维护性，减少不必要的参数转换

### v1.0.7
- ✅ 优化Manager层设计模式，直接实现无需接口+实现模式
- ✅ 简化Manager层架构，直接操作Mapper接口或使用Wrapper
- ✅ 减少不必要的抽象层，提高代码简洁性和可维护性

### v1.0.6
- ✅ 优化Controller接口规范，强制使用DTO封装请求参数
- ✅ 禁止使用Map<String, Object>等泛型参数，提高接口安全性
- ✅ 统一使用VO封装返回结果，确保接口文档清晰
- ✅ 为所有DTO和VO类添加完整的字段注释和验证注解
- ✅ 强制使用@Valid注解进行参数校验

### v1.0.5
- ✅ 完善开发规范，保留Mapper包存放Mapper接口和XML
- ✅ 规范Manager层调用Mapper接口进行数据库操作
- ✅ 统一公共组件放在common包下（config、util等）
- ✅ 新增out包专门存放对外Dubbo接口
- ✅ 创建Vo对象规范响应格式
- ✅ 调整项目包结构符合新规范

### v1.0.4
- ✅ 统一开发规范，数据访问层命名为Manager
- ✅ 规范Dto/Vo对象命名，Controller使用Dto接收，返回Vo
- ✅ 统一分页查询使用PageHelper + PageResult封装
- ✅ 优化项目架构说明和代码规范
- ✅ 统一小模块Markdown文档命名规范
- ✅ 重命名批处理脚本，使用-module和-front后缀

### v1.0.3
- ✅ 优化项目文档结构，为每个模块创建详细文档
- ✅ 根目录README.md专注于整体项目要点
- ✅ 统一文档格式和结构
- ✅ 完善模块间的文档链接

### v1.0.2
- ✅ 整合项目文档，将所有MD文件内容合并到主README.md
- ✅ 优化批处理脚本，完善服务启动脚本

### v1.0.1
- ✅ 优化项目结构，将config包移至common包下
- ✅ 修复Bean冲突问题，确保服务正常启动
- ✅ 完善批处理脚本，支持一键启动和状态检查

### v1.0.0
- ✅ 完成项目重构，采用前后端分离架构
- ✅ 实现PC端管理后台
- ✅ 支持多端扩展架构
- ✅ 集成Nacos服务注册与配置中心

## ⚠️ 注意事项

1. 确保已安装Java、Maven、Node.js等必要环境
2. 首次运行可能需要较长时间安装依赖
3. 如果端口被占用，请先停止相关服务
4. 建议在管理员权限下运行脚本
5. 服务启动有一定延迟，请耐心等待


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
