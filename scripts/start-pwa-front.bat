@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo PWA前端服务管理脚本
echo ========================================

:: 检查是否有参数
if "%1"=="restart" (
    echo 检测到重启参数，正在重启PWA前端服务...
    goto :restart_service
) else if "%1"=="stop" (
    echo 检测到停止参数，正在停止PWA前端服务...
    goto :stop_service
) else if "%1"=="" (
    echo 正在启动PWA前端服务...
    goto :start_service
) else (
    echo 未知参数: %1
    echo 用法: start-pwa-front.bat [start^|stop^|restart]
    pause
    exit /b 1
)

:stop_service
echo.
echo 正在停止PWA前端服务...
taskkill /f /fi "WINDOWTITLE eq PWA前端服务*" 2>nul
taskkill /f /im node.exe 2>nul
echo PWA前端服务已停止
if "%1"=="stop" (
    pause
    exit /b 0
)

:restart_service
echo.
echo 正在重启PWA前端服务...
taskkill /f /fi "WINDOWTITLE eq PWA前端服务*" 2>nul
taskkill /f /im node.exe 2>nul
echo 等待3秒后重新启动...
timeout /t 3 /nobreak >nul

:start_service
echo 正在启动PWA前端服务...

:: 检查pwa-front目录是否存在
if not exist "%~dp0..\linkr-client\pwa-front" (
    echo 错误: 找不到pwa-front目录
    echo 请确保项目结构正确
    pause
    exit /b 1
)

:: 切换到pwa-front目录
cd /d "%~dp0..\linkr-client\pwa-front"
echo 当前目录: %CD%

:: 检查package.json是否存在
if not exist "package.json" (
    echo 错误: 找不到package.json文件
    echo 请确保pwa-front项目已正确初始化
    pause
    exit /b 1
)

:: 检查端口5176是否被占用
echo 检查端口5176是否被占用...
netstat -ano | findstr :5176 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口5176已被占用，正在强制释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5176 ^| findstr LISTENING') do (
        echo 正在终止进程ID: %%a
        taskkill /f /pid %%a 2>nul
    )
    echo 等待2秒让端口完全释放...
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ 端口5176可用
)

:: 安装依赖
echo 正在安装依赖...
call npm install
if errorlevel 1 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

echo ========================================
echo 启动PWA前端服务...
echo ========================================
echo 服务名称: pwa-front
echo 服务端口: 5176
echo 技术栈: Vue 3 + TypeScript + Element Plus + PWA
echo ========================================
echo 按 Ctrl+C 停止服务
echo.

start "PWA前端服务" cmd /k "npm run dev"

echo.
echo ========================================
echo PWA前端服务启动完成！
echo ========================================
echo 访问地址: http://localhost:5176
echo ========================================
echo.
echo 使用方法:
echo   start-pwa-front.bat        - 启动PWA前端服务
echo   start-pwa-front.bat stop   - 停止PWA前端服务
echo   start-pwa-front.bat restart - 重启PWA前端服务
echo.
echo 按任意键退出...
pause >nul
