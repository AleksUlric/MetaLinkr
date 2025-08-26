@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo 前端服务管理脚本
echo ========================================

:: 检查是否有参数
if "%1"=="restart" (
    echo 检测到重启参数，正在重启前端服务...
    goto :restart_service
) else if "%1"=="stop" (
    echo 检测到停止参数，正在停止前端服务...
    goto :stop_service
) else if "%1"=="" (
    echo 正在启动前端服务...
    goto :start_service
) else (
    echo 未知参数: %1
    echo 用法: start-frontend.bat [start^|stop^|restart]
    pause
    exit /b 1
)

:stop_service
echo.
echo 正在停止前端服务...
taskkill /f /fi "WINDOWTITLE eq 前端服务*" 2>nul
taskkill /f /im node.exe 2>nul
echo 前端服务已停止
if "%1"=="stop" (
    pause
    exit /b 0
)

:restart_service
echo.
echo 正在重启前端服务...
taskkill /f /fi "WINDOWTITLE eq 前端服务*" 2>nul
taskkill /f /im node.exe 2>nul
echo 等待3秒后重新启动...
timeout /t 3 /nobreak >nul

:start_service
cd /d "%~dp0linkr-client\linkr-dashboard"
echo 当前目录: %CD%
echo 正在安装依赖...
call npm install
echo 正在启动开发服务器...
start "前端服务" cmd /k "npm run dev"
echo 前端服务启动中，请稍候...
timeout /t 5 /nobreak >nul
echo 前端服务已启动，访问地址: http://localhost:5173
echo.
echo 使用方法:
echo   start-frontend.bat        - 启动前端服务
echo   start-frontend.bat stop   - 停止前端服务
echo   start-frontend.bat restart - 重启前端服务
pause
