# LinkrDev 双服务架构设计

## 🏗️ 架构概览

LinkrDev 采用双服务架构，将后端拆分为两个独立的服务：
1. **Controller服务** - 处理HTTP请求和REST API
2. **Dubbo服务** - 处理业务逻辑和RPC调用

## 📊 服务拆分方案

### 1. Controller服务 (Controller Service)
- **端口：** 8080
- **职责：**
  - 处理所有HTTP REST API请求
  - 用户认证和授权
  - 管理员用户管理
  - 数据库操作
  - 前端接口对接
- **技术栈：** Spring Boot + Spring Security + MySQL + Dubbo Consumer
- **特点：** 轻量级，专注于请求处理和响应

### 2. Dubbo服务 (Dubbo Service)
- **端口：** 20880
- **职责：**
  - 提供Dubbo RPC接口
  - 业务逻辑处理
  - 服务间通信
  - 高性能计算
- **技术栈：** Spring Boot + Dubbo + Nacos
- **特点：** 高性能，专注于业务逻辑

## 🔄 服务间通信

### 通信方式
- **Controller服务** → **Dubbo服务**：通过Dubbo RPC调用
- **外部客户端** → **Controller服务**：通过HTTP REST API

### 服务发现
- 使用Nacos作为服务注册中心
- 自动服务发现和负载均衡

## 🗄️ 数据存储

### 数据库设计
- **主数据库：** MySQL (linkr_admin)
- **数据访问：** 由Controller服务统一管理
- **数据一致性：** 单一数据源，避免分布式事务复杂性

## 🚀 部署方案

### 部署结构
```
deploy/
├── frontend/              # 前端静态资源
├── controller-service/    # Controller服务
├── dubbo-service/        # Dubbo服务
└── nacos-server/         # Nacos服务注册中心
```

### 启动顺序
1. Nacos服务注册中心
2. Dubbo服务
3. Controller服务
4. 前端服务

## 📈 优势分析

### 1. 职责分离
- **Controller服务**：专注于HTTP请求处理
- **Dubbo服务**：专注于业务逻辑

### 2. 扩展性
- 可以独立扩展每个服务
- 支持不同的技术栈优化

### 3. 维护性
- 代码结构清晰
- 便于问题定位和修复

### 4. 性能优化
- Dubbo服务可以针对RPC调用优化
- Controller服务可以针对HTTP请求优化

## 🔧 技术实现

### Controller服务
- 使用`@DubboReference`注解引用Dubbo服务
- 通过Nacos进行服务发现
- 统一的异常处理和响应格式

### Dubbo服务
- 使用`@DubboService`注解暴露服务
- 注册到Nacos服务注册中心
- 支持服务治理和监控

## 📊 监控和运维

### 日志管理
- 每个服务独立日志
- 便于问题排查

### 健康检查
- Nacos自动健康检查
- 服务自动注册和注销

### 性能监控
- Dubbo服务性能监控
- HTTP请求性能监控

## 🎯 使用场景

### 适用场景
- 中小型项目
- 需要高性能RPC调用
- 需要清晰的职责分离
- 团队规模适中

### 不适用场景
- 超大型项目（需要更细粒度拆分）
- 简单的单体应用
- 团队规模过小（增加复杂度）

## 🔧 下一步计划

1. **完善Dubbo接口**：增加更多业务接口
2. **添加缓存**：Redis缓存支持
3. **监控集成**：Prometheus + Grafana
4. **安全加固**：JWT认证、权限控制
5. **自动化部署**：CI/CD流水线
