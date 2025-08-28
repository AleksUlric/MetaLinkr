# Nacos 服务注册与配置中心

## 概述

Nacos 是 MetaLinkr 项目的服务注册与配置中心，提供微服务的服务发现、配置管理、服务管理等功能。

## 功能特性

- 🔍 **服务发现**: 微服务注册与发现
- ⚙️ **配置管理**: 集中化配置管理
- 📊 **服务监控**: 服务健康检查
- 🔐 **权限控制**: 命名空间和权限管理
- 🌐 **多环境支持**: 开发、测试、生产环境隔离

## 版本信息

- **Nacos 版本**: 2.2.3
- **运行模式**: 单机模式 (standalone)
- **数据存储**: 内嵌 Derby 数据库

## 快速开始

### 环境要求
- JDK 1.8+
- 内存: 至少 2GB
- 磁盘: 至少 1GB 可用空间

### 启动服务

#### Windows
```bash
cd nacos-server/bin
startup.cmd -m standalone
```

#### Linux/Mac
```bash
cd nacos-server/bin
./startup.sh -m standalone
```

### 停止服务

#### Windows
```bash
cd nacos-server/bin
shutdown.cmd
```

#### Linux/Mac
```bash
cd nacos-server/bin
./shutdown.sh
```

### 访问地址
- **控制台**: http://localhost:8848/nacos
- **默认账号**: nacos
- **默认密码**: nacos

## 配置说明

### 主要配置文件
- `conf/application.properties` - 主配置文件
- `conf/application-standalone.properties` - 单机模式配置

### 端口配置
```properties
# 服务端口
server.port=8848

# 数据库配置 (内嵌 Derby)
spring.datasource.platform=derby
```

### 日志配置
- 日志文件: `logs/nacos.log`
- 错误日志: `logs/nacos-error.log`
- 日志级别: INFO

## 服务注册

### 微服务配置示例
```yaml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        service-name: your-service-name
      config:
        server-addr: localhost:8848
        file-extension: yaml
```

### 注册的服务
- `admin-module` - 管理员微服务
- `log-module` - 日志管理微服务

## 配置管理

### 配置命名空间
- `public` - 公共配置
- `dev` - 开发环境
- `test` - 测试环境
- `prod` - 生产环境

### 配置组
- `DEFAULT_GROUP` - 默认配置组
- `LINKR_GROUP` - 项目专用配置组

## 监控与维护

### 健康检查
- 访问: http://localhost:8848/nacos/actuator/health
- 状态: UP/DOWN

### 日志查看
```bash
# 实时查看日志
tail -f logs/nacos.log

# 查看错误日志
tail -f logs/nacos-error.log
```

### 数据备份
- 数据目录: `data/`
- 配置备份: `conf/`
- 日志备份: `logs/`

## 故障排除

### 常见问题
1. **端口被占用**: 修改 `conf/application.properties` 中的端口
2. **内存不足**: 增加 JVM 内存参数
3. **权限问题**: 确保有足够的文件读写权限

### 启动参数
```bash
# 指定配置文件
-Dspring.config.location=conf/application.properties

# 指定日志目录
-Dnacos.logs.path=logs/

# 指定数据目录
-Dnacos.home=.
```

## 集群部署

### 集群模式配置
```properties
# 集群模式
nacos.core.protocol.raft.data.dir=data/protocol/raft/
nacos.core.protocol.raft.snapshot.dir=data/protocol/raft/snapshot/
```

### 节点配置
```properties
# 集群节点列表
nacos.core.protocol.raft.data.dir=data/protocol/raft/
nacos.core.protocol.raft.snapshot.dir=data/protocol/raft/snapshot/
```

## 安全配置

### 认证配置
```properties
# 开启认证
nacos.core.auth.enabled=true
nacos.core.auth.system.type=nacos
```

### 权限管理
- 创建命名空间
- 配置访问权限
- 设置用户角色

## 性能优化

### JVM 参数建议
```bash
-Xms2g -Xmx2g -Xmn1g
-XX:MetaspaceSize=128m
-XX:MaxMetaspaceSize=320m
```

### 系统参数
- 文件描述符限制: 65535
- 网络连接数: 根据实际需求调整
