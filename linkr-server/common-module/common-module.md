# 统一错误处理系统

## 概述
本项目提供了一套完整的错误处理机制，包括错误码定义、异常处理、统一响应格式等。

## 核心组件

### 1. ErrorCode - 错误码枚举
- 定义了各种业务场景的错误码和对应消息
- 按功能模块分类：通用、认证、日志、服务、数据库、文件、网络、业务逻辑等
- 错误码范围：1000-9999

### 2. BusinessException - 业务异常类
- 继承自RuntimeException
- 包含错误码和错误消息
- 支持多种构造方式

### 3. GlobalExceptionHandler - 全局异常处理器
- 统一处理各种异常类型
- 自动转换为标准API响应格式
- 包含详细的日志记录

### 4. ApiResponse - 统一响应格式
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {},
  "timestamp": 1642234567890
}
```

### 5. ExceptionUtils - 异常工具类
- 提供便捷的异常抛出方法
- 支持条件判断和参数校验

## 使用示例

### 基本用法
```java
// 抛出业务异常
throw new BusinessException(ErrorCode.PARAM_ERROR, "参数不能为空");

// 使用工具类
ExceptionUtils.throwParamError("用户名不能为空");
ExceptionUtils.throwIfNull(user, ErrorCode.USER_NOT_FOUND, "用户不存在");
```

### Controller中使用
```java
@GetMapping("/user/{id}")
public ApiResponse<UserVO> getUser(@PathVariable Long id) {
    User user = userService.getById(id);
    if (user == null) {
        throw new BusinessException(ErrorCode.USER_NOT_FOUND, "用户不存在");
    }
    return ApiResponse.success(UserVO.from(user));
}
```

### Service中使用
```java
public void createUser(CreateUserDTO dto) {
    // 参数校验
    ExceptionUtils.throwIfEmpty(dto.getUsername(), ErrorCode.PARAM_ERROR, "用户名不能为空");
    
    // 业务逻辑校验
    if (userRepository.existsByUsername(dto.getUsername())) {
        throw new BusinessException(ErrorCode.USER_ALREADY_EXISTS, "用户名已存在");
    }
    
    // 业务处理...
}
```

## 错误码分类

| 范围 | 模块 | 说明 |
|------|------|------|
| 1000-1999 | 通用错误 | 参数错误、未授权、资源不存在等 |
| 2000-2999 | 用户认证 | 登录失败、Token过期、用户不存在等 |
| 3000-3999 | 日志相关 | 日志搜索、导出、解析等错误 |
| 4000-4999 | 服务管理 | 服务CRUD、状态更新等错误 |
| 5000-5999 | 数据库 | 连接、查询、事务等错误 |
| 6000-6999 | 文件操作 | 文件读写、上传下载等错误 |
| 7000-7999 | 网络相关 | 网络连接、HTTP请求等错误 |
| 8000-8999 | 业务逻辑 | 业务规则、数据验证等错误 |
| 9000-9999 | 第三方服务 | 外部API、配置等错误 |

## 最佳实践

1. **统一使用ErrorCode枚举**：避免硬编码错误码
2. **提供有意义的错误消息**：帮助用户理解问题
3. **合理使用异常工具类**：简化代码，提高可读性
4. **记录详细日志**：便于问题排查
5. **前端友好**：返回结构化的错误信息

## 扩展说明

如需添加新的错误码，请在ErrorCode枚举中添加，并遵循现有的分类规则。
