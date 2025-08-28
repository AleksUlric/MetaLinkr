# MetaLinkr - 全栈管理系统平台

## 📋 项目简介

MetaLinkr 是一个全栈管理系统平台，采用前后端分离架构，支持多端部署。项目集成了 Nacos 服务注册与配置中心，提供完整的微服务解决方案。

### 🌟 核心特性
- 📊 **多端支持**: PC端管理后台、移动端、微信小程序、H5端
- 🔧 **微服务架构**: 基于Spring Boot + Nacos的微服务架构
- 📝 **日志管理**: 完整的日志收集、存储、查询和分析功能
- 🚀 **一键部署**: 提供完整的批处理脚本，支持一键启动和停止
- 🔒 **安全认证**: 基于Spring Security的安全认证机制
- 🛡️ **统一错误处理**: 完整的错误码定义、异常处理和响应格式

## 📚 模块文档

- [Admin-Module](./linkr-server/admin-module/admin-module.md) - 管理员微服务模块
- [Log-Module](./linkr-server/log-module/log-module.md) - 日志管理微服务模块
- [Log-Module API](./linkr-server/log-module/log-module-api.md) - 日志模块API接口
- [Admin-Front](./linkr-client/linkr-dashboard/admin-front.md) - 管理员前端应用
- [Log-Front](./linkr-client/linkr-log/log-front.md) - 日志管理前端应用
- [Nacos-Server](./nacos-server/nacos-server.md) - 服务注册与配置中心
- [Common-Module](./linkr-server/common-module/common-module.md) - 统一错误处理系统

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
# 启动所有服务
start-all.bat

# 检查服务状态
check-status.bat

# 停止所有服务
stop-all.bat
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

# 启动Log后端服务
start-log-module.bat

# 启动Log前端服务
start-log-front.bat
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

## 📝 核心模块

### Common-Module (公共模块)
- **功能**: 统一错误处理、响应格式、工具类
- **技术栈**: Spring Boot + Spring Web + Validation
- **详细文档**: [Common-Module文档](./linkr-server/common-module/common-module.md)

### Admin-Module (管理员模块)
- **功能**: 用户管理、权限控制、系统配置
- **端口**: 8080
- **技术栈**: Spring Boot + Spring Security + MyBatis Plus

### Log-Module (日志模块)
- **功能**: 日志收集、存储、查询、分析
- **端口**: 8082
- **技术栈**: Spring Boot + MyBatis Plus + Logback
- **详细文档**: [日志模块文档](./linkr-server/log-module/log-module.md)

### Admin-Front (管理员前端)
- **功能**: PC端管理界面
- **端口**: 5173
- **技术栈**: Vue 3 + TypeScript + Element Plus
- **详细文档**: [Admin-Front文档](./linkr-client/linkr-dashboard/admin-front.md)

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

#### 6. start-log-module.bat - 单独启动Log后端
**功能**: 仅启动Log后端服务
**用法**: 
```bash
start-log-module.bat
```

#### 7. start-log-front.bat - 单独启动Log前端
**功能**: 仅启动Log前端服务
**用法**: 
```bash
start-log-front.bat
```

#### 5. check-status.bat - 服务状态检查
**功能**: 检查所有服务的运行状态和端口占用情况
**用法**: 
```bash
check-status.bat
```

### 使用建议
1. **首次使用**: 运行 `start-all.bat` 启动所有服务
2. **日常开发**: 可以使用 `start-admin-front.bat` 或 `start-log-front.bat` 单独启动前端进行开发
3. **服务异常**: 使用 `check-status.bat` 检查服务状态
4. **重启服务**: 使用 `restart-all.bat` 或 `start-all.bat restart`
5. **停止服务**: 使用 `start-all.bat stop` 或 `stop-all.bat`

## 📝 开发规范

### 项目结构规范

#### 模块划分
- **common-module**: 公共模块，包含工具类、通用组件等
- **admin-module**: 管理员模块，包含用户管理、权限管理等功能
- **log-module**: 日志模块，包含日志收集、查询、分析等功能

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
- 使用 `@RequiredArgsConstructor` 进行依赖注入

#### 3. 联查逻辑规范
- **多个表联查的逻辑放在主表对应的Manager类中**
- 主表通常是业务的核心表
- 避免在多个Manager类中重复实现相同的联查逻辑

#### 4. 代码结构示例

```java
@Slf4j
@Component
@RequiredArgsConstructor
public class LogEntryManager {
    
    private final LogEntryMapper logEntryMapper;
    private final ServiceInfoMapper serviceInfoMapper; // 联查时注入其他Mapper
    
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

##### log-module
- `LogEntryManager.java` - 管理 `log_entry` 表
- `ServiceInfoManager.java` - 管理 `service_info` 表
- `AlertRuleManager.java` - 管理 `alert_rule` 表

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
- **Controller接口规范**：
  - 请求参数必须使用DTO封装，禁止使用Map<String, Object>等泛型参数
  - 返回结果必须使用VO封装，确保接口文档清晰
  - 所有DTO和VO类必须添加完整的字段注释和验证注解
  - 使用@Valid注解进行参数校验
  - 详细规范请参考：[Controller接口规范](./CONTROLLER_API_STANDARDS.md)

## 🔄 版本历史

### v1.3.0 (当前版本)
- ✅ 新增统一错误处理系统，包含错误码定义、异常处理、响应格式
- ✅ 创建Common-Module公共模块，提供全局异常处理器和工具类
- ✅ 完善错误码分类，按功能模块划分（通用、认证、日志、服务、数据库等）
- ✅ 优化前端日志搜索界面，支持中文时间控件和紧凑布局
- ✅ 重构数据传输对象规范，明确DTO和VO的使用场景
- ✅ 更新Log模块返回类型，统一使用VO返回给前端
- ✅ 优化分页返回逻辑，使用PageUtils工具类简化代码
- ✅ 完善项目开发规范，明确Controller接收DTO返回VO的规范

### v1.1.0
- ✅ 重构Log模块包结构，将Entity和DTO移动到model包下
- ✅ 更新项目开发规范，明确数据模型必须放在model包下
- ✅ 统一所有模块的包结构规范，确保项目架构一致性
- ✅ 优化Log模块架构，符合项目整体规范

### v1.0.9
- ✅ 全面优化Manager层架构，移除接口+实现模式
- ✅ 简化包结构，Manager层直接实现无需impl子包
- ✅ 统一Manager层设计，提高代码简洁性和可维护性
- ✅ 完成Log模块和Admin模块的Manager层优化

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
- ✅ 完善日志管理模块的前端界面和功能
- ✅ 新增日志搜索、告警配置、服务管理等功能
- ✅ 优化批处理脚本，新增日志模块启动脚本

### v1.0.1
- ✅ 优化项目结构，将config包移至common包下
- ✅ 修复Bean冲突问题，确保服务正常启动
- ✅ 完善批处理脚本，支持一键启动和状态检查
- ✅ 集成日志管理模块

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
