# ELK轻量级日志纳管配置

## 概述

基于Docker的轻量级ELK（Elasticsearch + Kibana + Filebeat）日志纳管方案，专为开发和小规模生产环境设计。

## 架构特点

### 轻量级设计
- **单节点Elasticsearch**: 2GB内存配置，适合开发环境
- **Filebeat替代Logstash**: 更轻量，资源占用更少
- **最小化配置**: 禁用安全功能，简化部署

### 资源占用
- **Elasticsearch**: 2GB内存
- **Kibana**: 512MB内存  
- **Filebeat**: 100MB内存
- **总计**: 约2.6GB内存

## 快速启动

### 方法一：使用批处理脚本（推荐）
```bash
# 启动ELK服务
start-elk.bat

# 检查服务状态
check-elk.bat

# 停止ELK服务
stop-elk.bat
```

### 方法二：使用Docker Compose
```bash
cd elk-config
docker-compose up -d
```

### 3. 访问Kibana
打开浏览器访问: http://localhost:5601

## 配置说明

### Elasticsearch配置
- **版本**: 8.11.0
- **内存**: 1GB
- **单节点模式**: 适合开发环境
- **安全**: 禁用（开发环境）
- **端口**: 9200

### Kibana配置
- **版本**: 8.11.0
- **内存**: 512MB
- **中文界面**: 已配置
- **端口**: 5601

### Filebeat配置
- **版本**: 8.11.0
- **日志收集**: 应用日志、Nacos日志、Docker日志
- **输出**: 直接到Elasticsearch
- **索引**: filebeat-YYYY.MM.DD

## 日志收集

### 应用日志
- **路径**: `../linkr-server/logs/*.log`
- **类型**: 应用日志
- **服务**: linkr-server

### Nacos日志
- **路径**: `../docker-config/nacos/logs/*.log`
- **类型**: Nacos日志
- **服务**: nacos-server

### Docker日志
- **路径**: `/var/lib/docker/containers/*/*.log`
- **类型**: 容器日志
- **元数据**: 自动添加Docker元数据

## 索引管理

### 索引策略
- **命名**: filebeat-YYYY.MM.DD
- **分片**: 1个主分片
- **副本**: 0个副本
- **刷新**: 5秒

### 生命周期
- **热数据**: 7天
- **删除**: 30天后自动删除

## 查询示例

### 查看所有日志
```
GET filebeat-*/_search
{
  "query": {
    "match_all": {}
  }
}
```

### 按服务查询
```
GET filebeat-*/_search
{
  "query": {
    "term": {
      "service": "linkr-server"
    }
  }
}
```

### 按日志级别查询
```
GET filebeat-*/_search
{
  "query": {
    "term": {
      "level": "ERROR"
    }
  }
}
```

## 监控和维护

### 健康检查
```bash
# Elasticsearch健康状态
curl http://localhost:9200/_cluster/health?pretty

# 索引状态
curl http://localhost:9200/_cat/indices?v
```

### 日志清理
```bash
# 删除7天前的索引
curl -X DELETE "localhost:9200/filebeat-$(date -d '7 days ago' '+%Y.%m.%d')"
```

### 性能监控
```bash
# 节点状态
curl http://localhost:9200/_nodes/stats?pretty

# 索引统计
curl http://localhost:9200/_stats?pretty
```

## 故障排查

### 已解决的问题

#### 1. AWS配置权限错误
- **问题**: Elasticsearch 8.11.0 默认包含S3插件，尝试访问AWS配置文件时被安全策略阻止
- **解决**: 创建自定义Dockerfile，在构建时移除S3插件
  ```dockerfile
  FROM elasticsearch:8.11.0
  USER root
  RUN elasticsearch-plugin remove repository-s3 || true
  USER elasticsearch
  ```
- **结果**: 完全消除AWS相关错误，Elasticsearch正常启动

#### 2. 镜像名称标准化
- **问题**: 本地镜像使用完整路径名称，脚本检查失败
- **解决**: 重新标记镜像为短名称格式
  ```bash
  docker tag docker.elastic.co/elasticsearch/elasticsearch:8.11.0 elasticsearch:8.11.0
  docker tag docker.elastic.co/kibana/kibana:8.11.0 kibana:8.11.0
  docker tag docker.elastic.co/beats/filebeat:8.11.0 filebeat:8.11.0
  ```

#### 3. Elasticsearch配置错误
- **问题**: 索引级别设置在节点配置中不被允许
- **解决**: 移除elasticsearch.yml中的索引配置，通过Filebeat模板设置

#### 4. Kibana配置错误
- **问题**: 不兼容的配置项导致启动失败
- **解决**: 移除不支持的配置项（refererWhitelist、dev_tools等）

#### 5. Filebeat模板配置缺失
- **问题**: 缺少setup.template配置导致启动失败
- **解决**: 添加完整的模板配置和模块设置

#### 6. 内存不足问题
- **问题**: 512MB内存导致Elasticsearch熔断器触发
- **解决**: 将Elasticsearch内存配置提升到2GB，并优化熔断器设置

#### 7. 配置重复问题
- **问题**: elasticsearch.yml中indices.breaker.total.limit重复定义
- **解决**: 移除重复的配置项，保留一个定义

### 常见问题

#### 1. Elasticsearch启动失败
- 检查内存是否足够（至少1GB）
- 检查端口9200是否被占用
- 查看容器日志: `docker logs elk-elasticsearch`

#### 2. Kibana无法连接Elasticsearch
- 确认Elasticsearch已启动
- 检查网络连接
- 查看Kibana日志: `docker logs elk-kibana`

#### 3. Filebeat无法收集日志
- 检查日志文件路径是否正确
- 确认文件权限
- 查看Filebeat日志: `docker logs elk-filebeat`

### 日志查看
```bash
# 使用日志查看脚本（推荐）
view-logs.bat

# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs elasticsearch
docker-compose logs kibana
docker-compose logs filebeat

# 使用检查脚本查看状态
check-elk.bat
```

### 脚本功能说明

#### start-elk.bat - 启动脚本
- 自动检查Docker服务状态
- 自动构建自定义Elasticsearch镜像（如需要）
- 逐个启动服务并检查健康状态
- 提供详细的启动进度和错误信息

#### check-elk.bat - 状态检查脚本
- 检查Docker服务状态
- 检查容器运行状态
- 检查自定义镜像是否存在
- 检查各服务健康状态
- 显示访问地址

#### view-logs.bat - 日志查看脚本
- 交互式菜单选择要查看的日志
- 支持查看单个服务日志
- 支持查看所有服务日志
- 支持实时日志跟踪
- **新增**: AWS错误检查功能

#### stop-elk.bat - 停止脚本
- 停止所有ELK服务
- 清理未使用的容器和网络

## 扩展配置

### 生产环境优化
如需在生产环境使用，建议：

1. **增加内存配置**
```yaml
environment:
  - "ES_JAVA_OPTS=-Xms2g -Xmx2g"
```

2. **启用安全功能**
```yaml
environment:
  - xpack.security.enabled=true
```

3. **配置集群模式**
```yaml
environment:
  - discovery.type=multi-node
  - cluster.initial_master_nodes=elk-node-1
```

### 添加更多日志源
在`filebeat.yml`中添加新的输入配置：
```yaml
- type: log
  enabled: true
  paths:
    - /path/to/your/logs/*.log
  fields:
    logtype: your-service
    service: your-service-name
```

## 版本信息
- Elasticsearch: 8.11.0
- Kibana: 8.11.0
- Filebeat: 8.11.0
- Docker Compose: 3.8
