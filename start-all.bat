@echo off
chcp 65001 >nul
echo ========================================
echo 正在启动MetaLinkr所有服务...
echo ========================================

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
echo 3. 启动前端服务...
cd /d "%~dp0linkr-client\linkr-dashboard"
call npm install >nul 2>&1
start "前端服务" cmd /k "npm run dev"
echo 前端启动中，等待5秒...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo 所有服务启动完成！
echo ========================================
echo Nacos控制台: http://localhost:8848/nacos (nacos/nacos)
echo 后端API: http://localhost:8080
echo 前端页面: http://localhost:5173
echo 健康检查: http://localhost:8080/actuator/health
echo ========================================
echo.
echo 按任意键退出...
pause >nul
