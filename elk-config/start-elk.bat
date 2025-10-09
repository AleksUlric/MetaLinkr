@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
echo 启动ELK轻量级日志纳管服务...
echo.

echo 检查Docker服务状态...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: Docker未安装或未启动
    pause
    exit /b 1
)

echo 检查Docker镜像...
echo.
docker images | findstr "elk-config-elasticsearch" >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] 自定义Elasticsearch镜像不存在，开始构建...
    echo 构建自定义Elasticsearch镜像（已移除S3插件）...
    docker-compose build elasticsearch
    if %errorlevel% neq 0 (
        echo [ERROR] Elasticsearch镜像构建失败
        pause
        exit /b 1
    )
    echo [OK] 自定义Elasticsearch镜像构建成功
) else (
    echo [OK] 自定义Elasticsearch镜像已存在
)

docker images | findstr "kibana.*8.11.0" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Kibana镜像不存在: kibana:8.11.0
    echo 请手动拉取镜像: docker pull docker.elastic.co/kibana/kibana:8.11.0
    echo 然后重新标记: docker tag docker.elastic.co/kibana/kibana:8.11.0 kibana:8.11.0
    pause
    exit /b 1
) else (
    echo [OK] Kibana镜像已存在
)

docker images | findstr "filebeat.*8.11.0" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Filebeat镜像不存在: filebeat:8.11.0
    echo 请手动拉取镜像: docker pull docker.elastic.co/beats/filebeat:8.11.0
    echo 然后重新标记: docker tag docker.elastic.co/beats/filebeat:8.11.0 filebeat:8.11.0
    pause
    exit /b 1
) else (
    echo [OK] Filebeat镜像已存在
)

echo.
echo ========================================
echo 开始逐个启动ELK服务...
echo ========================================

echo.
echo [1/3] 启动Elasticsearch服务...
docker-compose up -d elasticsearch
if %errorlevel% neq 0 (
    echo [ERROR] Elasticsearch启动失败
    pause
    exit /b 1
)

echo 等待Elasticsearch启动...
timeout /t 20 /nobreak >nul

echo 检查Elasticsearch启动状态...
for /l %%i in (1,1,10) do (
    curl -s http://localhost:9200/_cluster/health 2>nul | findstr "green\|yellow" >nul
    if !errorlevel! equ 0 (
        echo [OK] Elasticsearch启动成功
        goto :kibana_start
    )
    echo 等待Elasticsearch启动... %%i/10
    timeout /t 3 /nobreak >nul
)
echo [ERROR] Elasticsearch启动超时
echo 查看Elasticsearch日志:
docker logs elk-elasticsearch --tail 20
pause
exit /b 1

:kibana_start
echo.
echo [2/3] 启动Kibana服务...
docker-compose up -d kibana
if %errorlevel% neq 0 (
    echo [ERROR] Kibana启动失败
    pause
    exit /b 1
)

echo 等待Kibana启动...
timeout /t 15 /nobreak >nul

echo 检查Kibana启动状态...
for /l %%i in (1,1,10) do (
    curl -s http://localhost:5601/api/status 2>nul | findstr "available" >nul
    if !errorlevel! equ 0 (
        echo [OK] Kibana启动成功
        goto :filebeat_start
    )
    echo 等待Kibana启动... %%i/10
    timeout /t 3 /nobreak >nul
)
echo [ERROR] Kibana启动超时
echo 查看Kibana日志:
docker logs elk-kibana --tail 20
pause
exit /b 1

:filebeat_start
echo.
echo [3/3] 启动Filebeat服务...
docker-compose up -d filebeat
if %errorlevel% neq 0 (
    echo [ERROR] Filebeat启动失败
    pause
    exit /b 1
)

echo 等待Filebeat启动...
timeout /t 10 /nobreak >nul

echo 检查Filebeat启动状态...
docker logs elk-filebeat --tail 10 | findstr "error\|Error\|ERROR" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Filebeat发现错误日志
    echo 查看Filebeat日志:
    docker logs elk-filebeat --tail 20
) else (
    echo [OK] Filebeat启动成功
)

echo.
echo ELK服务启动完成！
echo.
echo 访问地址:
echo - Kibana: http://localhost:5601
echo - Elasticsearch: http://localhost:9200
echo.
echo 查看日志: docker-compose logs
echo 停止服务: docker-compose down
echo.
pause
