# 基于官方 Elasticsearch 镜像创建自定义镜像，移除 S3 插件
FROM elasticsearch:8.11.0

# 切换到 root 用户以执行插件操作
USER root

# 移除 S3 仓库插件以避免 AWS 配置问题
RUN elasticsearch-plugin remove repository-s3 || true

# 切换回 elasticsearch 用户
USER elasticsearch

# 设置环境变量
ENV discovery.type=single-node
ENV xpack.security.enabled=false
ENV xpack.security.enrollment.enabled=false
ENV network.host=0.0.0.0
ENV http.port=9200
ENV transport.port=9300

# 设置 JVM 参数，禁用 AWS 相关功能
ENV ES_JAVA_OPTS="-Xms2g -Xmx2g -Daws.accessKeyId= -Daws.secretKey= -Daws.region= -Dcom.amazonaws.sdk.disableEc2Metadata=true"

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:9200/_cluster/health || exit 1
