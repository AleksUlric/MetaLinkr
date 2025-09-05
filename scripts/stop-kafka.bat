@echo off
chcp 65001 >nul
title Kafka服务停止 - MetaLinkr项目

echo ==========================================
echo 🛑 Kafka服务停止 - MetaLinkr项目
echo ==========================================
echo 🔧 服务名称: kafka (KRaft模式)
echo 📅 停止时间: %date% %time%
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

REM 停止Kafka服务
echo 🛑 正在停止Kafka服务...
docker-compose stop kafka

if %errorlevel% equ 0 (
    echo.
    echo ✅ Kafka服务已停止！
    echo.
    echo 📊 服务状态:
    docker-compose ps
) else (
    echo ❌ 错误: 停止服务时出现问题
    echo 💡 请检查Docker服务状态
)

echo.
echo ⌨️  按任意键返回主目录...
pause >nul

REM 返回主目录
cd ..
