# Log-Module 日志收集功能说明

## 概述

log-module已经配置了完整的日志收集功能，可以将自身的日志自动写入数据库，使其在日志查询菜单中可以查到。

## 功能特性

### 1. 自动日志收集
- 所有log-module的日志都会自动写入数据库
- 支持INFO、DEBUG、WARN、ERROR等各级别日志
- 自动记录日志的详细信息（时间戳、级别、模块、消息、堆栈等）

### 2. 日志输出位置
- **控制台**: 实时查看日志
- **文件**: `logs/log-module.log` 和 `logs/log-module-error.log`
- **数据库**: 自动写入 `log_entry` 表

### 3. 服务配置
- 服务名称: `log-module`
- 日志路径: `logs/log-module.log`
- 状态: `running`

## 配置说明

### 1. Logback配置 (`logback-spring.xml`)
```xml
<!-- 数据库日志Appender -->
<appender name="DATABASE" class="com.aleks.linkrmix.log.config.DatabaseAppender"/>

<!-- 应用日志级别 -->
<logger name="com.aleks.linkrmix.log" level="DEBUG" additivity="false">
    <appender-ref ref="CONSOLE"/>
    <appender-ref ref="FILE"/>
    <appender-ref ref="ERROR_FILE"/>
    <appender-ref ref="DATABASE"/>
</logger>
```

### 2. 自定义DatabaseAppender
- 自动将日志转换为LogEntryDTO格式
- 提取模块信息（controller、service、mapper等）
- 记录异常堆栈信息

## 测试方法

### 1. 启动服务
启动log-module服务后，会自动生成启动日志：
```bash
# 启动服务
cd linkr-server/log-module
mvn spring-boot:run
```

### 2. 使用测试接口生成日志

#### 生成INFO日志
```bash
curl -X POST http://localhost:8082/api/test-logs/info \
  -H "Content-Type: application/json" \
  -d '{"message": "测试INFO日志"}'
```

#### 生成ERROR日志
```bash
curl -X POST http://localhost:8082/api/test-logs/error \
  -H "Content-Type: application/json" \
  -d '{"message": "测试ERROR日志"}'
```

#### 生成带异常的ERROR日志
```bash
curl -X POST http://localhost:8082/api/test-logs/error-with-exception \
  -H "Content-Type: application/json" \
  -d '{"message": "测试异常日志"}'
```

#### 批量生成日志
```bash
curl -X POST http://localhost:8082/api/test-logs/multiple \
  -H "Content-Type: application/json" \
  -d '{"count": 10}'
```

#### 生成业务日志
```bash
curl -X POST http://localhost:8082/api/test-logs/business \
  -H "Content-Type: application/json" \
  -d '{"operation": "查询服务列表", "userId": "admin"}'
```

### 3. 查看日志

#### 查看文件日志
```bash
# 查看普通日志
tail -f logs/log-module.log

# 查看错误日志
tail -f logs/log-module-error.log
```

#### 查看数据库日志
```sql
-- 查看所有log-module的日志
SELECT * FROM log_entry WHERE service = 'log-module' ORDER BY timestamp DESC;

-- 查看ERROR级别日志
SELECT * FROM log_entry WHERE service = 'log-module' AND level = 'ERROR' ORDER BY timestamp DESC;

-- 查看最近的日志
SELECT timestamp, level, module, message FROM log_entry 
WHERE service = 'log-module' 
ORDER BY timestamp DESC LIMIT 20;
```

## 在日志平台中查看

1. 启动log-module服务
2. 访问日志查询页面
3. 在服务筛选中选择 `log-module`
4. 可以看到所有log-module的日志记录

## 日志字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| id | 日志ID | UUID格式 |
| timestamp | 时间戳 | 2024-01-15 10:30:00 |
| level | 日志级别 | INFO, DEBUG, WARN, ERROR |
| service | 服务名称 | log-module |
| module | 模块名称 | controller, service, mapper等 |
| message | 日志消息 | 具体的日志内容 |
| stackTrace | 堆栈跟踪 | 异常时的堆栈信息 |
| thread | 线程名称 | http-nio-8082-exec-1 |
| className | 类名 | com.aleks.linkrmix.log.controller.ServiceController |
| lineNumber | 行号 | 45 |

## 模块分类

- **controller**: 控制器层日志
- **service**: 服务层日志
- **mapper**: 数据访问层日志
- **config**: 配置类日志
- **spring**: Spring框架日志
- **mybatis**: MyBatis日志
- **application**: 应用层日志

## 注意事项

1. 确保数据库连接正常
2. 日志收集是异步的，可能有轻微延迟
3. 避免在DatabaseAppender中产生循环调用
4. 生产环境建议调整日志级别为INFO或WARN

## 开发规范

### Manager层规范
- **命名规范**：Manager类名应与数据库表名对应（表名 + Manager）
  - 例如：`log_entry` 表对应 `LogEntryManager`
  - 例如：`service_info` 表对应 `ServiceInfoManager`
- **联查逻辑**：多个表联查的逻辑放在主表对应的Manager类中
- **架构规范**：Manager层只保留实现类，不需要接口和实现分离

### 数据传输对象规范
- **DTO (Data Transfer Object)**: 用于接收前端请求参数，包含验证注解
- **VO (View Object)**: 用于返回给前端的数据，不包含验证注解
- **Entity**: 对应数据库表结构的实体对象

### 代码结构规范
- 遵循 RESTful API 设计规范
- 使用统一的异常处理机制
- 数据访问层命名为 **Mapper**
- DTO 类采用 **驼峰命名** 规范
- Controller层接收DTO，返回VO

## 故障排查

### 1. 日志没有写入数据库
- 检查数据库连接
- 检查LogService是否正确注入
- 查看控制台错误信息

### 2. 日志格式不正确
- 检查LogEntryDTO字段映射
- 确认时间戳格式

### 3. 性能问题
- 考虑使用异步写入
- 调整日志级别
- 优化数据库查询
