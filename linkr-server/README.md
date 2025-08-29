# MetaLinkr 后端服务

## 项目概述

MetaLinkr 是一个基于 Spring Boot 的微服务架构项目，包含以下模块：

- **common-module**: 公共模块，提供通用工具类和异常处理
- **admin-module**: 管理模块，提供用户管理和认证功能
- **log-module**: 日志模块，提供日志管理和查询功能

## 开发规范

### 1. 异常处理规范

#### 1.1 统一异常处理架构

项目采用统一的异常处理架构，所有模块必须使用 `common-module` 提供的异常处理机制：

- **BusinessException**: 业务异常基类，继承自 `RuntimeException`
- **GlobalExceptionHandler**: 全局异常处理器，统一处理各类异常
- **ExceptionUtils**: 异常工具类，提供便捷的异常抛出方法
- **ErrorCode**: 错误码枚举，定义所有业务错误码
- **ApiResponse**: 统一响应格式

#### 1.2 异常处理原则

1. **统一响应格式**: 所有异常必须返回 `ApiResponse<T>` 格式
2. **错误码规范**: 使用 `ErrorCode` 枚举中定义的错误码
3. **参数校验**: 使用 `ExceptionUtils` 工具类进行参数校验
4. **日志记录**: 异常必须记录详细的日志信息

#### 1.3 异常分类处理

```java
// 业务异常 - HTTP 200
@ExceptionHandler(BusinessException.class)
@ResponseStatus(HttpStatus.OK)
public ApiResponse<Void> handleBusinessException(BusinessException e)

// 参数校验异常 - HTTP 400
@ExceptionHandler(MethodArgumentNotValidException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public ApiResponse<Void> handleMethodArgumentNotValidException(MethodArgumentNotValidException e)

// 系统异常 - HTTP 500
@ExceptionHandler(Exception.class)
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public ApiResponse<Void> handleException(Exception e)
```

#### 1.4 参数校验规范

使用 `ExceptionUtils` 工具类进行参数校验：

```java
// 空值校验
ExceptionUtils.throwIfNull(obj, ErrorCode.PARAM_ERROR, "参数不能为空");
ExceptionUtils.throwIfEmpty(str, ErrorCode.PARAM_ERROR, "字符串不能为空");

// 条件校验
ExceptionUtils.throwIfTrue(condition, ErrorCode.BUSINESS_LOGIC_ERROR, "业务条件不满足");
ExceptionUtils.throwIfFalse(condition, ErrorCode.PARAM_ERROR, "参数验证失败");
```

### 2. 项目结构规范

#### 2.1 包结构约定

```
com.aleks.linkrmix.{module}/
├── common/           # 公共配置和工具
│   ├── config/      # 配置类
│   ├── exception/   # 异常类
│   └── util/        # 工具类
├── controller/      # 控制器层
├── service/         # 服务层
│   └── impl/       # 服务实现
├── manager/         # 管理层（对应数据库表）
├── mapper/          # 数据访问层
├── model/           # 数据模型
│   ├── entity/     # 实体类
│   ├── dto/        # 数据传输对象
│   └── vo/         # 视图对象（返回负载）
└── out/            # 外部接口
    └── api/        # 外部API接口
```

#### 2.2 命名规范

- **Manager类**: 对应数据库表名，如 `AdminUserManager` 对应 `admin_user` 表
- **多表查询**: 复杂查询逻辑放在主表的Manager类中
- **VO类**: 用于返回负载，替代DTO
- **配置文件**: 主配置文件命名为 `application.yml`

### 3. 数据库操作规范

#### 3.1 Manager层职责

- 对应单个数据库表的CRUD操作
- 处理复杂的多表关联查询
- 事务管理
- 数据验证和转换

#### 3.2 多表查询处理

```java
// 在主要表的Manager中处理多表查询
@Service
public class LogEntryManager {
    
    // 单表操作
    public List<LogEntry> findAll() { ... }
    
    // 多表关联查询（日志相关的复杂查询）
    public PageResult<LogEntry> searchLogsWithServiceInfo(LogSearchDTO searchDTO) { ... }
}
```

### 4. 响应格式规范

#### 4.1 统一响应格式

```java
public class ApiResponse<T> {
    private int code;           // 响应码
    private String message;     // 响应消息
    private T data;            // 响应数据
    private long timestamp;     // 时间戳
}
```

#### 4.2 成功响应

```java
// 无数据返回
return ApiResponse.success();

// 有数据返回
return ApiResponse.success(data);

// 自定义消息
return ApiResponse.success("操作成功", data);
```

#### 4.3 错误响应

```java
// 使用错误码
return ApiResponse.error(ErrorCode.PARAM_ERROR.getCode(), "参数错误");

// 使用异常
throw new BusinessException(ErrorCode.USER_NOT_FOUND, "用户不存在");
```

### 5. 日志规范

#### 5.1 日志级别

- **ERROR**: 系统错误、异常信息
- **WARN**: 业务警告、参数校验失败
- **INFO**: 重要业务操作
- **DEBUG**: 调试信息

#### 5.2 异常日志记录

```java
// 业务异常 - WARN级别
log.warn("业务异常: code={}, message={}", e.getCode(), e.getMessage());

// 系统异常 - ERROR级别
log.error("系统异常", e);
```

### 6. 代码质量要求

#### 6.1 异常处理

- 所有公共方法必须进行参数校验
- 使用统一的异常处理机制
- 避免捕获异常后不处理或打印后忽略

#### 6.2 事务管理

- 涉及数据库操作的方法使用 `@Transactional` 注解
- 合理设置事务传播行为和隔离级别

#### 6.3 性能优化

- 合理使用分页查询
- 避免N+1查询问题
- 使用索引优化查询性能

## 模块说明

### Common Module

提供项目的基础设施和通用功能：

- **异常处理**: `BusinessException`, `GlobalExceptionHandler`, `ExceptionUtils`
- **响应格式**: `ApiResponse`, `ErrorCode`
- **工具类**: `PageUtils` 等

### Admin Module

用户管理和认证模块：

- **用户管理**: 用户的CRUD操作
- **认证服务**: 登录认证功能
- **权限控制**: 基于角色的权限管理

### Log Module

日志管理和查询模块：

- **日志存储**: 日志数据的存储和管理
- **日志查询**: 支持多种条件的日志查询
- **服务管理**: 服务信息的维护

## 部署说明

### 环境要求

- JDK 8+
- MySQL 5.7+
- Maven 3.6+

### 启动顺序

1. 启动 MySQL 数据库
2. 启动 Nacos 注册中心
3. 启动各个业务模块

### 配置文件

各模块的配置文件位于 `src/main/resources/application.yml`，包含：

- 数据库连接配置
- Nacos 注册中心配置
- 日志配置
- 其他业务配置

## 开发指南

### 新增功能

1. 在对应的模块中创建实体类、DTO、VO
2. 实现 Manager 层的数据访问逻辑
3. 实现 Service 层的业务逻辑
4. 实现 Controller 层的接口
5. 添加异常处理和参数校验
6. 编写单元测试

### 异常处理最佳实践

1. 使用 `ExceptionUtils` 进行参数校验
2. 业务异常使用 `BusinessException`
3. 在 Service 层抛出异常，Controller 层不处理异常
4. 记录详细的异常日志信息
5. 返回友好的错误消息给前端

### 代码审查要点

- 异常处理是否规范
- 参数校验是否完整
- 日志记录是否合理
- 事务管理是否正确
- 性能是否优化
