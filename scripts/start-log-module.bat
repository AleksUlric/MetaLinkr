@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo Log微服务管理脚本
echo ========================================

:: 检查是否有参数
if "%1"=="restart" (
    echo 检测到重启参数，正在重启Log后端服务...
    goto :restart_service
) else if "%1"=="stop" (
    echo 检测到停止参数，正在停止Log后端服务...
    goto :stop_service
) else if "%1"=="" (
    echo 正在启动Log后端服务...
    goto :start_service
) else (
    echo 未知参数: %1
    echo 用法: start-log-module.bat [start^|stop^|restart]
    pause
    exit /b 1
)

:stop_service
echo.
echo 正在停止Log后端服务...
taskkill /f /fi "WINDOWTITLE eq Log后端服务*" 2>nul
taskkill /f /im java.exe 2>nul
taskkill /f /im mvn.cmd 2>nul
taskkill /f /im mvn.exe 2>nul
echo Log后端服务已停止
if "%1"=="stop" (
    pause
    exit /b 0
)

:restart_service
echo.
echo 正在重启Log后端服务...
taskkill /f /fi "WINDOWTITLE eq Log后端服务*" 2>nul
taskkill /f /im java.exe 2>nul
taskkill /f /im mvn.cmd 2>nul
taskkill /f /im mvn.exe 2>nul
echo 等待3秒后重新启动...
timeout /t 3 /nobreak >nul

:start_service
cd /d "%~dp0..\linkr-server\log-module"
echo 当前目录: %CD%

:: 检查端口8081是否被占用
echo 检查端口8081是否被占用...
netstat -ano | findstr :8081 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口8081已被占用，正在强制释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do (
        echo 正在终止进程ID: %%a
        taskkill /f /pid %%a 2>nul
    )
    echo 等待3秒让端口完全释放...
    timeout /t 3 /nobreak >nul
) else (
    echo ✅ 端口8081可用
)

echo 检查Java环境...
java -version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Java环境，请确保已安装JDK 1.8+
    pause
    exit /b 1
)

echo 检查Maven环境...
mvn -version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Maven环境，请确保已安装Maven 3.6+
    pause
    exit /b 1
)

echo 检查MySQL数据库...
:: 简单检查MySQL服务是否运行
netstat -ano | findstr :3306 >nul
if errorlevel 1 (
    echo 警告: MySQL服务可能未启动（端口3306未监听）
    echo 请确保MySQL服务正在运行，且linkr_log数据库已创建
    echo 继续启动log-module服务...
) else (
    echo MySQL服务正在运行（端口3306已监听）
)

echo 检查Nacos服务...
:: 简单检查Nacos服务是否运行
netstat -ano | findstr :8848 >nul
if errorlevel 1 (
    echo 警告: Nacos服务可能未启动（端口8848未监听）
    echo 请确保Nacos服务已在 http://localhost:8848 启动
    echo 继续启动log-module服务...
) else (
    echo Nacos服务正在运行（端口8848已监听）
)

echo.
echo 正在编译项目...
call mvn clean compile -q
if errorlevel 1 (
    echo 错误: 项目编译失败
    echo 请检查以下可能的问题：
    echo 1. Maven是否正确安装
    echo 2. Java版本是否兼容（需要JDK 1.8+）
    echo 3. 项目依赖是否完整
    echo 4. 网络连接是否正常
    echo.
    echo 尝试使用详细模式编译以查看具体错误：
    echo mvn clean compile
    pause
    exit /b 1
)
echo ✓ 编译成功

echo.
echo 正在启动Spring Boot微服务...
echo 注意: 如果服务启动失败，请检查以下内容：
echo 1. 端口8081是否被占用
echo 2. MySQL服务是否正常运行
echo 3. linkr_log数据库是否存在
echo 4. Nacos服务是否启动
echo.
start "Log后端服务" cmd /k "mvn spring-boot:run -Dspring-boot.run.jvmArguments=\"-Xms512m -Xmx1024m\""

echo.
echo 等待服务启动...
timeout /t 15 /nobreak >nul

echo.
echo 检查服务启动状态...
netstat -ano | findstr :8081 >nul
if errorlevel 1 (
    echo ⚠️  警告: 服务可能启动失败，端口8081未监听
    echo 请检查启动窗口中的错误信息
    echo 常见问题：
    echo 1. 数据库连接失败 - 检查MySQL和linkr_log数据库
    echo 2. 端口被占用 - 检查是否有其他服务占用8081端口
    echo 3. 依赖缺失 - 检查Maven依赖是否正确下载
    echo 4. 配置错误 - 检查application.yml配置文件
) else (
    echo ✅ 服务启动成功，端口8081已监听
)

echo.
echo ========================================
echo 服务启动信息
echo ========================================
echo 服务名称: log-module
echo 服务端口: 8081
echo 服务地址: http://localhost:8081
echo 健康检查: http://localhost:8081/actuator/health
echo Nacos控制台: http://localhost:8848/nacos
echo ========================================
echo.
echo 使用方法:
echo   start-log-module.bat        - 启动Log后端服务
echo   start-log-module.bat stop   - 停止Log后端服务
echo   start-log-module.bat restart - 重启Log后端服务
echo.
echo 请检查Nacos控制台确认服务注册状态
echo 如果服务启动失败，请查看启动窗口中的详细错误信息
echo.
echo 按任意键退出...
pause >nul
