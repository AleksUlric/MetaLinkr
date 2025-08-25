@echo off
chcp 65001 >nul
echo ========================================
echo 启动Admin微服务
echo ========================================

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
echo 请检查Nacos控制台确认服务注册状态
pause
