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
echo 正在检查端口占用情况...

:: 检查端口8848 (Nacos)
echo 检查端口8848 (Nacos)...
netstat -ano | findstr :8848 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口8848已被占用，正在强制释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8848') do (
        echo 正在终止进程ID: %%a
        taskkill /f /pid %%a 2>nul
    )
    echo 等待2秒让端口完全释放...
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ 端口8848可用
)

:: 检查端口8080 (Admin后端)
echo 检查端口8080 (Admin后端)...
netstat -ano | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口8080已被占用，正在强制释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
        echo 正在终止进程ID: %%a
        taskkill /f /pid %%a 2>nul
    )
    echo 等待2秒让端口完全释放...
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ 端口8080可用
)

:: 检查端口8081 (Log后端)
echo 检查端口8081 (Log后端)...
netstat -ano | findstr :8081 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口8081已被占用，正在强制释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do (
        echo 正在终止进程ID: %%a
        taskkill /f /pid %%a 2>nul
    )
    echo 等待2秒让端口完全释放...
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ 端口8081可用
)

:: 检查端口5173 (Admin前端)
echo 检查端口5173 (Admin前端)...
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口5173已被占用，正在强制释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
        echo 正在终止进程ID: %%a
        taskkill /f /pid %%a 2>nul
    )
    echo 等待2秒让端口完全释放...
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ 端口5173可用
)

:: 检查端口5174 (Log前端)
echo 检查端口5174 (Log前端)...
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

echo.
echo 1. 启动Nacos服务...
cd /d "%~dp0..\nacos-server\bin"
start /b "Nacos服务" cmd /c "startup.cmd -m standalone > ..\logs\nacos-startup.log 2>&1"
echo Nacos启动中，等待15秒...
timeout /t 15 /nobreak >nul

echo.
echo 2. 启动Admin后端服务...
call "%~dp0start-admin-module.bat"
echo Admin后端启动中，等待10秒...
timeout /t 10 /nobreak >nul

echo.
echo 3. 启动Log后端服务...
call "%~dp0start-log-module.bat"
echo Log后端启动中，等待10秒...
timeout /t 10 /nobreak >nul

echo.
echo 4. 启动Admin前端服务...
call "%~dp0start-admin-front.bat"
echo Admin前端启动中，等待5秒...
timeout /t 5 /nobreak >nul

echo.
echo 5. 启动Log前端服务...
call "%~dp0start-log-front.bat"
echo Log前端启动中，等待5秒...
timeout /t 5 /nobreak >nul

echo.
echo 6. 启动CMAK服务...
call "%~dp0start-cmak.bat"
echo CMAK启动中，等待5秒...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo 所有服务启动完成！
echo ========================================
echo Nacos控制台: http://localhost:8848/nacos (nacos/nacos)
echo 后端API: http://localhost:8080
echo Log后端API: http://localhost:8081
echo Admin前端: http://localhost:5173
echo Log前端: http://localhost:5174
echo CMAK控制台: http://localhost:9000
echo 健康检查: http://localhost:8080/actuator/health
echo ========================================
echo.
echo 服务说明:
echo   Nacos服务: 服务注册与配置中心
echo   后端服务: 管理后台API (admin-module)
echo   Log后端: 日志管理API (log-module)
echo   Admin前端: 管理后台界面
echo   Log前端: 日志管理界面
echo   CMAK服务: Kafka集群管理工具
echo.
echo 使用方法:
echo   start-all.bat        - 启动所有服务
echo   start-all.bat stop   - 停止所有服务
echo   start-all.bat restart - 重启所有服务
echo.
echo 按任意键退出...
pause >nul
