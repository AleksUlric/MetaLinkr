@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo 🚀 Nacos服务管理脚本
echo ========================================

:: 检查是否有参数
if "%1"=="restart" (
    echo 🔄 检测到重启参数，正在重启Nacos服务...
    goto :restart_service
) else if "%1"=="stop" (
    echo 🛑 检测到停止参数，正在停止Nacos服务...
    goto :stop_service
) else if "%1"=="" (
    echo 🚀 正在启动Nacos服务...
    goto :start_service
) else (
    echo ❓ 未知参数: %1
    echo 💡 用法: start-nacos.bat [start^|stop^|restart]
    pause
    exit /b 1
)

:stop_service
echo.
echo 🛑 正在停止Nacos服务...
cd /d "%~dp0..\nacos-server\bin"
call shutdown.cmd
:: 查找并终止nacos相关进程
for /f "tokens=2" %%a in ('tasklist /fi "imagename eq java.exe" /fo csv ^| findstr /i nacos') do (
    echo 🚫 正在终止Nacos进程: %%a
    taskkill /f /pid %%a 2>nul
)
echo ✅ Nacos服务已停止
if "%1"=="stop" (
    pause
    exit /b 0
)

:restart_service
echo.
echo 🔄 正在重启Nacos服务...
cd /d "%~dp0..\nacos-server\bin"
call shutdown.cmd
:: 查找并终止nacos相关进程
for /f "tokens=2" %%a in ('tasklist /fi "imagename eq java.exe" /fo csv ^| findstr /i nacos') do (
    echo 🚫 正在终止Nacos进程: %%a
    taskkill /f /pid %%a 2>nul
)
echo ⏳ 等待5秒后重新启动...
timeout /t 5 /nobreak >nul

:start_service
cd /d "%~dp0..\nacos-server\bin"
echo 📁 当前目录: %CD%

:: 检查端口8848是否被占用
echo 🔍 检查端口8848是否被占用...
netstat -ano | findstr :8848 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口8848已被占用，正在强制释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8848') do (
        echo 🚫 正在终止进程ID: %%a
        taskkill /f /pid %%a 2>nul
    )
    echo ⏳ 等待3秒让端口完全释放...
    timeout /t 3 /nobreak >nul
) else (
    echo ✅ 端口8848可用
)

echo.
echo 🚀 正在启动Nacos服务（后台运行）...
start /b "Nacos服务" cmd /c "startup.cmd -m standalone > ..\logs\nacos-startup.log 2>&1"

echo.
echo ⏳ 等待Nacos启动...
timeout /t 20 /nobreak >nul

echo.
echo ========================================
echo 📊 Nacos服务启动信息
echo ========================================
echo 🌐 服务地址: http://localhost:8848/nacos
echo 👤 默认账号: nacos
echo 🔑 默认密码: nacos
echo 📁 命名空间: public
echo 📋 配置组: DEFAULT_GROUP
echo ========================================
echo.
echo 📖 使用方法:
echo   start-nacos.bat        - 启动Nacos服务（后台运行）
echo   start-nacos.bat stop   - 停止Nacos服务
echo   check-nacos.bat        - 检查Nacos服务状态
echo   start-nacos.bat restart - 重启Nacos服务
echo.
echo 💡 请访问Nacos控制台确认服务状态
pause
