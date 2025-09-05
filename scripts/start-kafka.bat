@echo off
chcp 65001 >nul
title Kafka服务启动 - MetaLinkr项目

echo ==========================================
echo 🚀 Kafka服务启动 - MetaLinkr项目
echo ==========================================
echo 🔧 服务名称: kafka (KRaft模式)
echo 🌐 Kafka端口: 9092
echo 📅 启动时间: %date% %time%
echo 🔗 访问地址: localhost:9092
echo ==========================================

REM 检查Docker是否运行
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: Docker未安装或未运行
    echo 💡 请先安装并启动Docker Desktop
    pause
    exit /b 1
)

REM 检查Docker Compose文件是否存在
if not exist "..\docker-config\docker-compose.yml" (
    echo ❌ 错误: docker-compose.yml文件不存在
    echo 💡 请确保docker-config目录下有docker-compose.yml文件
    pause
    exit /b 1
)

REM 进入Docker配置目录
cd ..\docker-config

REM 启动Kafka服务
echo 🚀 正在启动Kafka服务...
docker-compose up -d kafka

if %errorlevel% equ 0 (
    echo.
    echo ✅ Kafka服务启动成功！
    echo 🌐 Kafka地址: localhost:9092
    echo.
    echo ⏳ 等待服务完全启动...
    timeout /t 10 /nobreak >nul
    echo.
    echo 📊 服务状态:
    docker-compose ps
) else (
    echo ❌ 错误: Kafka服务启动失败
    echo 💡 请检查Docker配置和端口占用情况
)

echo.
echo ⌨️  按任意键返回主目录...
pause >nul

REM 返回主目录
cd ..
