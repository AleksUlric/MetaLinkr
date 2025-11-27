# 🐳 Docker配置说明文档

## 📋 概述

本文档详细说明了MetaLinkr项目的Docker配置情况，包括当前配置、已知问题和后续改进计划。

## 🏗️ 当前配置架构

### 网络模式
- **当前使用**: `host` 网络模式
- **优势**: 
  - 容器直接使用宿主机网络，性能最佳
  - 可以直接访问 `127.0.0.1:3306` 的本地MySQL
  - 配置简单，无需额外网络配置
- **劣势**:
  - 端口冲突风险（如果宿主机已占用8848端口）
  - 网络隔离性差
  - 安全性较低

### 服务配置
- **Nacos版本**: `nacos/nacos-server:v2.2.3`
- **Redis版本**: `redis:8.0-alpine`
- **运行模式**: `standalone` (单机模式)
- **数据库**: 本地MySQL服务 (127.0.0.1:3306)
- **认证状态**: **已禁用** (开发环境)

## 🔧 当前配置文件

### 1. docker-compose.yml (主配置)
```yaml
services:
  nacos:
    image: nacos/nacos-server:latest
    container_name: nacos-server
    network_mode: host  # 使用宿主机网络
    environment:
      - MODE=standalone
      - SPRING_DATASOURCE_PLATFORM=mysql
      - MYSQL_SERVICE_HOST=127.0.0.1
      - MYSQL_SERVICE_PORT=3306
      - MYSQL_SERVICE_DB_NAME=nacos_config
      - MYSQL_SERVICE_USER=root
      - MYSQL_SERVICE_PASSWORD=Xing@1225
      - NACOS_AUTH_ENABLED=false  # 认证已禁用
    volumes:
      - ./nacos/logs:/home/nacos/logs
      - ./nacos/conf:/home/nacos/conf
    restart: unless-stopped
```

### 2. redis/docker-compose.yml (Redis配置)
```yaml
version: '3.8'

services:
  redis:
    image: redis:8.0-alpine
    container_name: redis-pwa
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass ""
    volumes:
      - redis-data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.5'
        reservations:
          memory: 128M
          cpus: '0.25'

volumes:
  redis-data:
    driver: local
```

### 3. nacos/conf/application.properties
```properties
# 认证配置 - 已禁用
nacos.core.auth.enabled=false

# 数据库配置 - 使用本地MySQL
spring.datasource.platform=mysql
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos_config
db.user=root
db.password=Xing@1225
```

### 4. mysql/init/nacos-mysql.sql
- 包含完整的Nacos数据库表结构
- 预置nacos管理员账户 (nacos/nacos)
- 支持多租户和配置管理

## ⚠️ 已知问题

### 1. 认证安全问题
- **当前状态**: 认证完全禁用
- **风险等级**: 🔴 高风险
- **影响**: 任何人都可以访问Nacos控制台，无需登录
- **建议**: 仅在开发环境使用，生产环境必须启用

### 2. 网络隔离问题
- **当前状态**: 使用host网络模式
- **风险等级**: 🟡 中风险
- **影响**: 容器与宿主机网络完全共享
- **建议**: 后续切换到bridge网络模式

### 3. 数据库依赖问题
- **当前状态**: 依赖本地MySQL服务
- **风险等级**: 🟡 中风险
- **影响**: 容器启动前必须确保本地MySQL运行
- **建议**: 后续容器化MySQL或使用专用数据库

### 4. 端口冲突风险
- **当前状态**: 直接使用宿主机8848端口
- **风险等级**: 🟡 中风险
- **影响**: 如果宿主机已占用8848端口，容器无法启动
- **建议**: 后续使用端口映射

### 5. Redis配置问题
- **当前状态**: Redis独立配置，未集成到主配置
- **风险等级**: 🟢 低风险
- **影响**: 需要分别启动Nacos和Redis服务
- **建议**: 后续整合到统一的docker-compose.yml中

## 📊 配置对比表

| 配置项 | 当前状态 | 目标状态 | 优先级 |
|--------|----------|----------|--------|
| 网络模式 | host | bridge | 🟡 中 |
| 认证状态 | 禁用 | 启用 | 🔴 高 |
| 数据库 | 本地MySQL | 容器化MySQL | 🟡 中 |
| Redis服务 | 独立配置 | 集成配置 | 🟢 低 |
| 端口管理 | 直接使用 | 端口映射 | 🟡 中 |
| 资源限制 | 无 | 有 | 🟢 低 |
| 健康检查 | 无 | 有 | 🟢 低 |
| 日志管理 | 基础 | 轮转+监控 | 🟢 低 |

## 🚀 后续改进计划

### 阶段1: 启用认证 (优先级: 🔴 高)
```yaml
# 计划配置
environment:
  - NACOS_AUTH_ENABLED=true
  - NACOS_AUTH_TOKEN=your_secure_token
  - NACOS_AUTH_IDENTITY_KEY=serverIdentity
  - NACOS_AUTH_IDENTITY_VALUE=security
```

**改进内容**:
- 启用Nacos认证机制
- 配置安全的认证密钥
- 设置用户权限管理
- 添加访问控制

### 阶段2: 切换到Bridge网络 (优先级: 🟡 中)
```yaml
# 计划配置
networks:
  - linkr-network

environment:
  - MYSQL_SERVICE_HOST=host.docker.internal
  # 或使用宿主机IP
  - MYSQL_SERVICE_HOST=192.168.1.100
```

**改进内容**:
- 创建自定义bridge网络
- 配置容器间通信
- 使用host.docker.internal访问宿主机
- 增强网络隔离性

### 阶段3: 容器化MySQL (优先级: 🟡 中)
```yaml
# 计划配置
services:
  mysql:
    image: mysql:8.0
    container_name: linkr-mysql
    environment:
      - MYSQL_ROOT_PASSWORD=your_password
      - MYSQL_DATABASE=nacos_config
    volumes:
      - mysql-data:/var/lib/mysql
      - ./mysql/init:/docker-entrypoint-initdb.d
    networks:
      - linkr-network
    ports:
      - "3306:3306"
```

**改进内容**:
- 添加MySQL容器服务
- 配置数据持久化
- 自动初始化数据库
- 统一容器管理

### 阶段4: 生产环境优化 (优先级: 🟢 低)
```yaml
# 计划配置
services:
  nacos:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8848/nacos/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

**改进内容**:
- 资源限制配置
- 健康检查机制
- 日志轮转配置
- 监控和告警

### 阶段5: 配置管理优化 (优先级: 🟡 中)
```yaml
# 计划配置 - 统一环境变量管理
environment:
  - NACOS_VERSION=2.3.0  # 固定版本号
  - NACOS_DATA_DIR=/home/nacos/data
  - NACOS_LOG_DIR=/home/nacos/logs
  - NACOS_CONF_DIR=/home/nacos/conf
```

**改进内容**:
- 统一配置管理，避免重复配置
- 固定Nacos版本号
- 配置数据目录持久化
- 创建便捷的启动/停止脚本

### 阶段6: 监控和运维 (优先级: 🟢 低)
```yaml
# 计划配置
services:
  nacos:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    labels:
      - "com.metalinkr.service=nacos"
      - "com.metalinkr.version=2.3.0"
```

**改进内容**:
- 日志轮转配置
- 服务标签管理
- 监控指标收集
- 告警机制配置

## 🛠️ 操作指南

### 当前环境启动
```bash
# 1. 确保本地MySQL运行在3306端口
# 2. 确保8848端口未被占用
# 3. 启动服务
docker-compose up -d

# 4. 访问地址
# http://localhost:8848/nacos
# 无需登录（认证已禁用）
```

### 使用根目录启动脚本（推荐）
```bash
# 启动Nacos服务
scripts\start-nacos.bat

# 停止Nacos服务
scripts\stop-nacos.bat

# 检查服务状态
scripts\check-nacos.bat
```

### Redis服务启动
```bash
# 进入Redis配置目录
cd docker-config/redis

# 启动Redis服务
docker-compose up -d

# 或者使用批处理脚本
start-redis.bat

# 停止Redis服务
docker-compose down
# 或者使用批处理脚本
stop-redis.bat

# 检查Redis状态
docker exec -it redis-pwa redis-cli ping
```

### 停止服务
```bash
docker-compose down
```

## 🔒 安全建议

### 开发环境
- 当前配置适合开发环境
- 确保开发机器网络安全
- 定期更新Nacos版本

### 生产环境
- **必须启用认证**
- 使用强密码和密钥
- 配置防火墙规则
- 启用HTTPS
- 定期备份数据
- 监控访问日志

## 📝 注意事项

1. **当前配置仅适用于开发环境**
2. **生产环境部署前必须完成所有改进计划**
3. **定期检查Nacos安全更新**
4. **备份重要的配置数据**
5. **监控容器资源使用情况**

## 📞 技术支持

如有问题，请参考：
- [Nacos官方文档](https://nacos.io/zh-cn/docs/)
- [Docker Compose文档](https://docs.docker.com/compose/)
- 项目README.md文件

---

**最后更新**: 2025-01-27  
**维护人员**: MetaLinkr开发团队  
**版本**: v1.0.0
