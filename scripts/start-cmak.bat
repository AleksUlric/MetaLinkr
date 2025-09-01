@echo off
chcp 65001 >nul
title CMAK服务启动 - MetaLinkr项目

echo ==========================================
echo 🚀 CMAK服务启动 - MetaLinkr项目
echo ==========================================
echo 🔧 服务名称: cmak-server
echo 🌐 服务端口: 9000
echo 📅 启动时间: %date% %time%
echo 🔗 访问地址: http://localhost:9000
echo ==========================================

REM 检查CMAK目录是否存在
if not exist "..\cmak-server" (
    echo ❌ 错误: cmak-server目录不存在
    echo 💡 请确保cmak-server目录已创建
    pause
    exit /b 1
)

REM 进入CMAK目录
cd ..\cmak-server

REM 检查JAR文件是否存在
if not exist "cmak-3.0.0.6.jar" (
    echo ⚠️  警告: cmak-3.0.0.6.jar文件不存在
    echo 💾 请从官方下载CMAK JAR文件
    echo 🌐 下载地址: https://github.com/eshepelyuk/cmak/releases
    echo.
    echo ❓ 是否继续启动? (Y/N)
    set /p choice=
    if /i not "%choice%"=="Y" (
        echo 🚫 启动已取消
        pause
        exit /b 1
    )
)

REM 检查端口是否被占用
netstat -ano | findstr :9000 >nul
if %errorlevel% equ 0 (
    echo ❌ 错误: 端口9000已被占用
    echo 💡 请先停止占用端口的服务
    pause
    exit /b 1
)

REM 启动CMAK服务
echo 🚀 正在启动CMAK服务...
start "CMAK Server" cmd /k "bin\startup.cmd"

echo.
echo ⏳ CMAK服务启动中...
echo 🌐 请等待服务完全启动后访问: http://localhost:9000
echo.
echo ⌨️  按任意键返回主目录...
pause >nul

REM 返回主目录
cd ..
