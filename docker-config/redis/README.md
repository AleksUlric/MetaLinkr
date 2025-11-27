# Redis 8.0 Alpine 配置

## 📋 概述

Redis 8.0 Alpine 版本配置，用于 pwa-module 的缓存和会话管理。

## 🚀 快速启动

```bash
# 进入 Redis 配置目录
cd docker-config/redis

# 启动 Redis
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f redis

# 停止服务
docker-compose down
```

## 🔧 配置说明

- **镜像**: `redis:8.0-alpine`
- **端口**: `6379`
- **持久化**: AOF 模式
- **密码**: 无密码（开发环境）
- **内存限制**: 256MB
- **CPU限制**: 0.5核

## 📊 监控命令

```bash
# 连接 Redis
docker exec -it redis-pwa redis-cli

# 查看内存使用
docker exec -it redis-pwa redis-cli info memory

# 查看连接数
docker exec -it redis-pwa redis-cli info clients

# 查看所有键
docker exec -it redis-pwa redis-cli keys "*"
```

## 🔒 生产环境建议

如需在生产环境使用，建议：

1. 设置密码：
```yaml
command: redis-server --appendonly yes --requirepass "your_password"
```

2. 修改应用配置：
```yaml
spring:
  redis:
    password: your_password
```

3. 启用 SSL：
```yaml
command: redis-server --appendonly yes --requirepass "your_password" --tls-port 6380 --port 0
```

## 📁 数据持久化

Redis 数据存储在 Docker volume `redis-data` 中，即使容器重启数据也不会丢失。

## 🎯 在 pwa-module 中的用途

1. **短信验证码存储** - 5分钟过期
2. **发送限制控制** - 每日发送次数限制
3. **发送间隔控制** - 60秒间隔限制
4. **用户会话管理** - JWT Token 黑名单
5. **缓存热点数据** - 用户信息、匹配结果等
6. **实时功能支持** - 在线状态、聊天消息等
