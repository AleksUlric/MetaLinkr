@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo Log前端服务管理脚本
echo ========================================

:: 检查是否有参数
if "%1"=="restart" (
    echo 检测到重启参数，正在重启Log前端服务...
    goto :restart_service
) else if "%1"=="stop" (
    echo 检测到停止参数，正在停止Log前端服务...
    goto :stop_service
) else if "%1"=="" (
    echo 正在启动Log前端服务...
    goto :start_service
) else (
    echo 未知参数: %1
    echo 用法: start-log-front.bat [start^|stop^|restart]
    pause
    exit /b 1
)

:stop_service
echo.
echo 正在停止Log前端服务...
taskkill /f /fi "WINDOWTITLE eq Log前端服务*" 2>nul
taskkill /f /im node.exe 2>nul
echo Log前端服务已停止
if "%1"=="stop" (
    pause
    exit /b 0
)

:restart_service
echo.
echo 正在重启Log前端服务...
taskkill /f /fi "WINDOWTITLE eq Log前端服务*" 2>nul
taskkill /f /im node.exe 2>nul
echo 等待3秒后重新启动...
timeout /t 3 /nobreak >nul

:start_service
echo 正在启动Log前端服务...

:: 检查log-front目录是否存在
if not exist "%~dp0..\linkr-client\log-front" (
    echo 错误: 找不到log-front目录
    echo 请确保项目结构正确
    pause
    exit /b 1
)

:: 切换到log-front目录
cd /d "%~dp0..\linkr-client\log-front"

:: 检查package.json是否存在
if not exist "package.json" (
    echo 错误: 找不到package.json文件
    echo 请确保log-front项目已正确初始化
    pause
    exit /b 1
)

:: 检查端口5174是否被占用
echo 检查端口5174是否被占用...
netstat -ano | findstr :5174 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口5174已被占用，正在强制释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5174') do (
        echo 正在终止进程ID: %%a
        taskkill /f /pid %%a 2>nul
    )
    echo 等待2秒让端口完全释放...
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ 端口5174可用
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
echo 启动Log前端服务...
echo ========================================
echo 服务名称: log-front
echo 服务端口: 5174
echo 后端API: http://localhost:8081
echo 技术栈: Vue 3 + TypeScript + Element Plus
echo ========================================
echo 按 Ctrl+C 停止服务
echo.

start "Log前端服务" cmd /k "npm run dev"

echo.
echo ========================================
echo Log前端服务启动完成！
echo ========================================
echo 访问地址: http://localhost:5174
echo 后端API: http://localhost:8081
echo ========================================
echo.
echo 使用方法:
echo   start-log-front.bat        - 启动Log前端服务
echo   start-log-front.bat stop   - 停止Log前端服务
echo   start-log-front.bat restart - 重启Log前端服务
echo.
echo 按任意键退出...
pause >nul
