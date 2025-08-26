@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo Admin微服务管理脚本
echo ========================================

:: 检查是否有参数
if "%1"=="restart" (
    echo 检测到重启参数，正在重启后端服务...
    goto :restart_service
) else if "%1"=="stop" (
    echo 检测到停止参数，正在停止后端服务...
    goto :stop_service
) else if "%1"=="" (
    echo 正在启动后端服务...
    goto :start_service
) else (
    echo 未知参数: %1
    echo 用法: start-backend.bat [start^|stop^|restart]
    pause
    exit /b 1
)

:stop_service
echo.
echo 正在停止后端服务...
taskkill /f /fi "WINDOWTITLE eq 后端服务*" 2>nul
taskkill /f /fi "WINDOWTITLE eq Admin微服务*" 2>nul
taskkill /f /im java.exe 2>nul
taskkill /f /im mvn.cmd 2>nul
taskkill /f /im mvn.exe 2>nul
echo 后端服务已停止
if "%1"=="stop" (
    pause
    exit /b 0
)

:restart_service
echo.
echo 正在重启后端服务...
taskkill /f /fi "WINDOWTITLE eq 后端服务*" 2>nul
taskkill /f /fi "WINDOWTITLE eq Admin微服务*" 2>nul
taskkill /f /im java.exe 2>nul
taskkill /f /im mvn.cmd 2>nul
taskkill /f /im mvn.exe 2>nul
echo 等待3秒后重新启动...
timeout /t 3 /nobreak >nul

:start_service
cd /d "%~dp0linkr-server\admin-module"
echo 当前目录: %CD%

echo.
echo 正在编译项目...
call mvn clean compile
if %errorlevel% neq 0 (
    echo ✗ 编译失败，请检查代码
    pause
    exit /b 1
)
echo ✓ 编译成功

echo.
echo 正在启动Spring Boot微服务...
start "Admin微服务" cmd /k "mvn spring-boot:run"

echo.
echo 等待服务启动...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo 服务启动信息
echo ========================================
echo 服务名称: admin-module
echo 服务端口: 8080
echo 服务地址: http://localhost:8080
echo 健康检查: http://localhost:8080/actuator/health
echo 服务状态: http://localhost:8080/health/status
echo 服务信息: http://localhost:8080/health/info
echo Nacos控制台: http://localhost:8848/nacos
echo ========================================
echo.
echo 使用方法:
echo   start-backend.bat        - 启动后端服务
echo   start-backend.bat stop   - 停止后端服务
echo   start-backend.bat restart - 重启后端服务
echo.
echo 请检查Nacos控制台确认服务注册状态
pause
