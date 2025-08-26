@echo off
echo ========================================
echo 启动 Log Module (日志模块)
echo ========================================

cd /d "%~dp0"

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

echo 进入log-module目录...
cd linkr-server\log-module

echo 清理并编译项目...
call mvn clean compile -q

if errorlevel 1 (
    echo 错误: 项目编译失败
    pause
    exit /b 1
)

echo 启动Log Module服务...
echo 服务将在 http://localhost:8082 启动
echo 按 Ctrl+C 停止服务
echo.

call mvn spring-boot:run

echo.
echo Log Module服务已停止
pause
