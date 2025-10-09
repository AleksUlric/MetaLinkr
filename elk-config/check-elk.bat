@echo off
chcp 65001 >nul
echo ========================================
echo ELK服务状态检查
echo ========================================
echo.

echo 检查Docker服务状态...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker未安装或未启动
    pause
    exit /b 1
) else (
    echo [OK] Docker服务正常
)

echo.
echo 检查容器运行状态...
docker ps --filter "name=elk-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo 检查自定义Elasticsearch镜像...
docker images | findstr "elk-config-elasticsearch" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] 自定义Elasticsearch镜像不存在，将使用官方镜像
) else (
    echo [OK] 自定义Elasticsearch镜像已存在（已移除S3插件）
)

echo.
echo 检查Elasticsearch健康状态...
curl -s http://localhost:9200/_cluster/health 2>nul
if %errorlevel% equ 0 (
    echo [OK] Elasticsearch服务正常
    curl -s http://localhost:9200/_cluster/health | findstr "green\|yellow" >nul
    if %errorlevel% equ 0 (
        echo [OK] Elasticsearch集群健康
    ) else (
        echo [WARNING] Elasticsearch集群状态异常
    )
) else (
    echo [ERROR] Elasticsearch服务异常
)

echo.
echo 检查Kibana服务状态...
curl -s http://localhost:5601/api/status 2>nul
if %errorlevel% equ 0 (
    echo [OK] Kibana服务正常
) else (
    echo [ERROR] Kibana服务异常
)

echo.
echo 检查Filebeat服务状态...
docker logs elk-filebeat --tail 5 2>nul | findstr "error\|Error\|ERROR" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Filebeat发现错误日志
) else (
    echo [OK] Filebeat服务正常
)

echo.
echo 检查索引状态...
curl -s http://localhost:9200/_cat/indices?v 2>nul
if %errorlevel% equ 0 (
    echo [OK] 索引查询正常
) else (
    echo [ERROR] 索引查询异常
)

echo.
echo ========================================
echo 服务访问地址:
echo - Kibana: http://localhost:5601
echo - Elasticsearch: http://localhost:9200
echo ========================================
echo.
pause
