@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo MetaLinkr服务管理脚本
echo ========================================

:: 检查是否有参数
if "%1"=="restart" (
    echo 检测到重启参数，正在重启所有服务...
    goto :restart_services
) else if "%1"=="stop" (
    echo 检测到停止参数，正在停止所有服务...
    goto :stop_services
) else if "%1"=="" (
    echo 正在启动所有服务...
    goto :start_services
) else (
    echo 未知参数: %1
    echo 用法: start-all.bat [start^|stop^|restart]
    pause
    exit /b 1
)

:stop_services
echo.
echo 正在停止所有服务...
call "%~dp0stop-all.bat"
echo 所有服务已停止
if "%1"=="stop" (
    pause
    exit /b 0
)

:restart_services
echo.
echo 正在重启所有服务...
call "%~dp0stop-all.bat"
echo 等待5秒后重新启动...
timeout /t 5 /nobreak >nul

:start_services
echo.
echo 1. 启动Nacos服务...
cd /d "%~dp0nacos-server\bin"
start "Nacos服务" cmd /k "startup.cmd -m standalone"
echo Nacos启动中，等待15秒...
timeout /t 15 /nobreak >nul

echo.
echo 2. 启动后端服务...
cd /d "%~dp0linkr-server\admin-module"
start "后端服务" cmd /k "mvn spring-boot:run"
echo 后端启动中，等待10秒...
timeout /t 10 /nobreak >nul

echo.
echo 3. 启动Dashboard前端服务...
cd /d "%~dp0linkr-client\linkr-dashboard"
call npm install >nul 2>&1
start "Dashboard前端服务" cmd /k "npm run dev"
echo Dashboard前端启动中，等待5秒...
timeout /t 5 /nobreak >nul

echo.
echo 4. 启动Log前端服务...
cd /d "%~dp0linkr-client\linkr-log"
call npm install >nul 2>&1
start "Log前端服务" cmd /k "npm run dev"
echo Log前端启动中，等待5秒...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo 所有服务启动完成！
echo ========================================
echo Nacos控制台: http://localhost:8848/nacos (nacos/nacos)
echo 后端API: http://localhost:8080
echo Dashboard前端: http://localhost:5173
echo Log前端: http://localhost:5174
echo 健康检查: http://localhost:8080/actuator/health
echo ========================================
echo.
echo 使用方法:
echo   start-all.bat        - 启动所有服务
echo   start-all.bat stop   - 停止所有服务
echo   start-all.bat restart - 重启所有服务
echo.
echo 按任意键退出...
pause >nul
