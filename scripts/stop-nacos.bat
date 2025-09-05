@echo off
chcp 65001 >nul
title 停止Nacos服务 - MetaLinkr项目

echo ========================================
echo 🛑 停止Nacos服务 - MetaLinkr项目
echo ========================================
echo 📅 停止时间: %date% %time%
echo.

echo 🔍 检查Docker是否运行...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Docker未安装或未运行
    pause
    exit /b 1
)
echo ✅ Docker已运行

echo 🔍 切换到docker-config目录...
cd /d %~dp0..\docker-config
echo ✅ 当前目录: %cd%

echo.
echo 🔍 检查Nacos容器状态...
docker ps --filter "name=nacos-server" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  警告: 未找到运行中的Nacos容器
) else (
    echo 📋 当前运行的Nacos容器:
    docker ps --filter "name=nacos-server" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
)

echo.
echo 🛑 停止Nacos服务...
echo 📦 停止并删除Nacos容器...

docker-compose down

if errorlevel 1 (
    echo ⚠️  警告: docker-compose down 执行失败，尝试手动停止
    docker stop nacos-server >nul 2>&1
    docker rm nacos-server >nul 2>&1
    echo ✅ 手动停止完成
) else (
    echo ✅ Nacos服务已停止
)

echo.
echo 🔍 确认服务已停止...
docker ps --filter "name=nacos-server" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" >nul 2>&1
if errorlevel 1 (
    echo ✅ 确认: Nacos容器已完全停止
) else (
    echo ⚠️  警告: 仍有Nacos容器在运行
    docker ps --filter "name=nacos-server" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
)

echo.
echo 🔍 检查端口释放情况...
netstat -ano | findstr :8848 >nul 2>&1
if errorlevel 1 (
    echo ✅ 端口8848已释放
) else (
    echo ⚠️  警告: 端口8848仍被占用
    netstat -ano | findstr :8848
)

echo.
echo ========================================
echo 🎉 Nacos服务停止完成！
echo ========================================
echo 📊 服务状态:
echo    Nacos服务: 已停止
echo    端口8848: 已释放
echo.
echo 💡 提示: 使用 start-nacos.bat 重新启动服务
echo 💡 提示: 本地MySQL服务仍在运行
echo ========================================

echo.
pause
