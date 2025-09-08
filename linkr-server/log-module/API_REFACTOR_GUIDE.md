# Log Module API 重构指南

## 概述

为了提升系统架构的清晰度和可维护性，我们将原有的 `LogController` 拆分为两个专门的控制器：

- **LogQueryController**: 专门负责日志查询、统计、分析功能
- **LogRealtimeController**: 专门负责日志实时推送、WebSocket连接管理功能

## API 变更说明

### 1. 查询相关接口

#### 原接口（已废弃）
```
GET  /api/logs/overview
POST /api/logs/search
GET  /api/logs/{id}
```

#### 新接口
```
GET  /api/logs/query/overview      # 获取日志概览
POST /api/logs/query/search        # 搜索日志
GET  /api/logs/query/{id}          # 获取日志详情
GET  /api/logs/query/stats         # 获取日志统计信息
GET  /api/logs/query/trend         # 获取日志趋势数据
```

### 2. 实时推送相关接口

#### 原接口（已废弃）
```
POST /api/logs
```

#### 新接口
```
POST /api/logs/realtime                    # 保存日志（实时推送）
GET  /api/logs/realtime/status             # 获取WebSocket连接状态
GET  /api/logs/realtime/connections/count  # 获取活跃连接数
POST /api/logs/realtime/broadcast          # 手动推送日志到所有连接
POST /api/logs/realtime/module/{module}    # 推送日志到指定模块
POST /api/logs/realtime/level/{level}      # 推送日志到指定级别
```

## 迁移指南

### 前端代码迁移

#### 1. 查询功能迁移
```javascript
// 旧代码
fetch('/api/logs/overview')
fetch('/api/logs/search', { method: 'POST', body: searchData })
fetch(`/api/logs/${id}`)

// 新代码
fetch('/api/logs/query/overview')
fetch('/api/logs/query/search', { method: 'POST', body: searchData })
fetch(`/api/logs/query/${id}`)
```

#### 2. 实时推送功能迁移
```javascript
// 旧代码
fetch('/api/logs', { method: 'POST', body: logData })

// 新代码
fetch('/api/logs/realtime', { method: 'POST', body: logData })
```

### 后端代码迁移

#### 1. 服务接口变更
```java
// 旧代码
@Autowired
private LogService logService;

// 新代码
@Autowired
private LogQueryService logQueryService;      // 查询功能
@Autowired
private LogRealtimeService logRealtimeService; // 实时推送功能
```

#### 2. 控制器变更
```java
// 旧代码
@RestController
@RequestMapping("/api/logs")
public class LogController {
    // 混合了查询和推送功能
}

// 新代码
@RestController
@RequestMapping("/api/logs/query")
public class LogQueryController {
    // 专门处理查询功能
}

@RestController
@RequestMapping("/api/logs/realtime")
public class LogRealtimeController {
    // 专门处理实时推送功能
}
```

## 兼容性说明

### 向后兼容
- 原有的 `/api/logs/*` 接口仍然可用，但已标记为 `@Deprecated`
- 建议尽快迁移到新的接口路径
- 旧接口将在未来版本中移除

### 过渡期建议
1. **立即开始**: 新功能使用新接口
2. **逐步迁移**: 现有功能逐步迁移到新接口
3. **测试验证**: 确保新接口功能正常
4. **完全切换**: 所有功能迁移完成后移除旧接口

## 新功能特性

### 1. 查询服务增强
- 新增统计信息接口 `/api/logs/query/stats`
- 新增趋势数据接口 `/api/logs/query/trend`
- 更细粒度的查询控制

### 2. 实时推送服务增强
- 连接状态监控 `/api/logs/realtime/status`
- 活跃连接数统计 `/api/logs/realtime/connections/count`
- 按模块推送 `/api/logs/realtime/module/{module}`
- 按级别推送 `/api/logs/realtime/level/{level}`
- 手动广播功能 `/api/logs/realtime/broadcast`

## 性能优化

### 1. 职责分离
- 查询服务专注于数据检索和统计
- 实时推送服务专注于消息传递
- 减少服务间的相互影响

### 2. 扩展性提升
- 可以独立扩展查询和推送服务
- 支持不同的负载均衡策略
- 便于后续引入缓存和搜索引擎

## 监控和运维

### 1. 接口监控
- 分别监控查询和推送接口的性能
- 独立的错误率和响应时间统计
- 更精确的问题定位

### 2. 日志记录
- 查询操作记录在查询服务日志中
- 推送操作记录在推送服务日志中
- 便于问题排查和性能分析

## 总结

此次重构将原有的混合式控制器拆分为两个专门的控制器，提升了代码的可维护性和系统的可扩展性。虽然需要一定的迁移工作，但长期来看将带来更好的架构设计和性能表现。

建议按照迁移指南逐步进行接口切换，确保系统的稳定性和功能的完整性。
