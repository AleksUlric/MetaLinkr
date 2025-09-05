@echo off
chcp 65001 >nul
title 检查Nacos服务状态 - MetaLinkr项目

echo ========================================
echo 🔍 检查Nacos服务状态 - MetaLinkr项目
echo ========================================
echo 📅 检查时间: %date% %time%
echo.

echo 🔍 检查Docker是否运行...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Docker未安装或未运行
    pause
    exit /b 1
)
echo ✅ Docker已运行

echo.
echo 🔍 检查Nacos容器状态...
docker ps --filter "name=nacos-server" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" >nul 2>&1
if errorlevel 1 (
    echo ❌ Nacos容器未运行
    echo.
    echo 💡 建议: 使用 start-nacos.bat 启动服务
) else (
    echo ✅ Nacos容器正在运行:
    docker ps --filter "name=nacos-server" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
)

echo.
echo 🔍 检查端口占用情况...
netstat -ano | findstr :8848 >nul 2>&1
if errorlevel 1 (
    echo ❌ 端口8848未被占用 (服务可能未启动)
) else (
    echo ✅ 端口8848被占用:
    netstat -ano | findstr :8848
)

echo.
echo 🔍 检查本地MySQL服务...
netstat -ano | findstr :3306 >nul 2>&1
if errorlevel 1 (
    echo ❌ 本地MySQL服务未运行 (端口3306未被占用)
    echo 💡 建议: 启动本地MySQL服务
) else (
    echo ✅ 本地MySQL服务正在运行 (端口3306)
)

echo.
echo 🔍 检查Nacos服务健康状态...
if exist "curl.exe" (
    echo 📊 测试Nacos服务响应...
    curl -s -o nul -w "HTTP状态码: %%{http_code}\n" http://localhost:8848/nacos/actuator/health 2>nul
    if errorlevel 1 (
        echo ❌ Nacos服务无响应
    ) else (
        echo ✅ Nacos服务响应正常
    )
) else (
    echo ⚠️  未找到curl工具，无法测试服务响应
    echo 💡 提示: 手动访问 http://localhost:8848/nacos 检查服务状态
)

echo.
echo 🔍 检查Docker镜像...
echo 📦 可用的Nacos镜像:
docker images nacos/nacos-server --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" 2>nul
if errorlevel 1 (
    echo ❌ 未找到Nacos镜像
    echo 💡 建议: 运行 docker pull nacos/nacos-server:latest
)

echo.
echo ========================================
echo 📋 状态总结
echo ========================================
echo 🔍 容器状态: 
docker ps --filter "name=nacos-server" --format "{{.Status}}" >nul 2>&1 && echo "运行中" || echo "未运行"
echo 🌐 端口状态: 
netstat -ano | findstr :8848 >nul 2>&1 && echo "已占用" || echo "未占用"
echo 🗄️  MySQL状态: 
netstat -ano | findstr :3306 >nul 2>&1 && echo "运行中" || echo "未运行"
echo ========================================

echo.
echo 💡 提示: 使用 start-nacos.bat 启动服务
echo 💡 提示: 使用 stop-nacos.bat 停止服务
echo 💡 提示: 使用 docker-compose logs nacos 查看日志
echo.

pause
