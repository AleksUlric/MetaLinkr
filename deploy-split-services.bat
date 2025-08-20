@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==========================================
echo     LinkrDev 双服务部署脚本
echo ==========================================
echo.

:: 检查并停止已存在的服务
echo [0/6] 检查并停止已存在的服务...
taskkill /F /IM java.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":20880" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
echo 已清理旧进程
echo.

:: 检查依赖
echo [1/6] 检查系统依赖...
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Java 未安装
    pause
    exit /b 1
)
mvn --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Maven 未安装
    pause
    exit /b 1
)
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Node.js 未安装
    pause
    exit /b 1
)
echo ✅ 依赖检查完成
echo.

:: 构建项目
echo [2/6] 构建项目...
cd LinkrMix
call mvn clean package -DskipTests
if errorlevel 1 (
    echo ❌ 错误: 项目构建失败
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ 项目构建完成
echo.

:: 构建前端
echo [3/6] 构建前端项目...
cd LinkrWeb
call npm ci
call npm run build
cd ..
echo ✅ 前端构建完成
echo.

:: 准备部署目录
echo [4/6] 准备部署目录...
if exist "deploy" rmdir /s /q deploy
mkdir deploy
mkdir deploy\frontend
mkdir deploy\controller-service
mkdir deploy\dubbo-service
mkdir deploy\nacos-server

:: 复制前端文件
xcopy "LinkrWeb\dist\*" "deploy\frontend\" /E /Y /Q >nul

:: 复制Nacos服务器
xcopy "nacos-server-2.3.0\*" "deploy\nacos-server\" /E /Y /Q >nul

echo ✅ 部署目录准备完成
echo.

:: 启动Nacos服务注册中心
echo [5/6] 启动Nacos服务注册中心...
cd deploy\nacos-server\bin
start /B startup.cmd -m standalone
cd ..\..\..
timeout /t 15 /nobreak >nul
echo ✅ Nacos启动完成
echo.

:: 启动两个核心服务
echo [6/6] 启动核心服务...

:: 启动Controller服务 (处理HTTP请求)
echo 启动Controller服务 (端口 8080)...
cd deploy\controller-service
copy "..\..\LinkrMix\controller-service\target\*.jar" "controller-service.jar" >nul
start /B java -jar controller-service.jar > controller.log 2>&1
cd ..\..

:: 启动Dubbo服务 (处理RPC调用)
echo 启动Dubbo服务 (端口 20880)...
cd deploy\dubbo-service
copy "..\..\LinkrMix\dubbo-service\target\*.jar" "dubbo-service.jar" >nul
start /B java -jar dubbo-service.jar > dubbo.log 2>&1
cd ..\..

echo ✅ 核心服务启动完成
echo.

:: 等待服务启动
timeout /t 20 /nobreak >nul

:: 检查服务状态
echo 📊 服务状态检查:
netstat -ano | findstr ":8080" >nul && echo ✅ Controller服务 (8080) - 运行中 || echo ❌ Controller服务 (8080) - 未启动
netstat -ano | findstr ":20880" >nul && echo ✅ Dubbo服务 (20880) - 运行中 || echo ❌ Dubbo服务 (20880) - 未启动
netstat -ano | findstr ":8848" >nul && echo ✅ Nacos服务 (8848) - 运行中 || echo ❌ Nacos服务 (8848) - 未启动

echo.
echo ==========================================
echo 🎉 双服务部署完成！
echo ==========================================
echo.
echo 🌐 服务访问地址:
echo   Controller服务: http://localhost:8080
echo   Dubbo服务: http://localhost:20880
echo   Nacos控制台: http://localhost:8848/nacos
echo.
echo 📝 日志文件:
echo   Controller: deploy\controller-service\controller.log
echo   Dubbo: deploy\dubbo-service\dubbo.log
echo.
echo 🛑 停止服务: stop-split-services.bat
echo.
pause
