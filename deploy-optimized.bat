@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==========================================
echo     LinkrDev 优化部署脚本
echo ==========================================
echo.

:: 检查并停止已存在的服务
echo [0/7] 检查并停止已存在的服务...
taskkill /F /IM java.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8081" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
echo 已清理旧进程
echo.

:: 检查依赖
echo [1/7] 检查系统依赖...

node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Node.js 未安装
    echo 请访问 https://nodejs.org 下载安装
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js: !NODE_VERSION!

npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: npm 未安装
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm: !NPM_VERSION!

java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Java 未安装
    echo 请安装 Java 8 或更高版本
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('java -version 2^>^&1 ^| findstr "version"') do set JAVA_VERSION=%%i
echo ✅ Java: !JAVA_VERSION!

mvn --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Maven 未安装
    echo 请安装 Apache Maven
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('mvn --version ^| findstr "Apache Maven"') do set MVN_VERSION=%%i
echo ✅ Maven: !MVN_VERSION!
echo.

:: 检查目录
echo [2/7] 检查项目目录...
if not exist "LinkrWeb" (
    echo ❌ 错误: LinkrWeb 目录不存在
    pause
    exit /b 1
)
echo ✅ LinkrWeb 目录存在

if not exist "LinkrMix" (
    echo ❌ 错误: LinkrMix 目录不存在
    pause
    exit /b 1
)
echo ✅ LinkrMix 目录存在
echo.

:: 构建前端
echo [3/7] 构建前端项目...
cd LinkrWeb
echo 当前目录: %CD%

echo 安装前端依赖...
call npm ci
if errorlevel 1 (
    echo ❌ 错误: 前端依赖安装失败
    echo 尝试清理缓存...
    call npm cache clean --force
    call npm ci
    if errorlevel 1 (
        echo ❌ 错误: 依赖安装仍然失败
        cd ..
        pause
        exit /b 1
    )
)

echo 构建前端项目...
call npm run build
if errorlevel 1 (
    echo ❌ 错误: 前端构建失败
    cd ..
    pause
    exit /b 1
)

if not exist "dist" (
    echo ❌ 错误: 构建后未找到 dist 目录
    cd ..
    pause
    exit /b 1
)

cd ..
echo ✅ 前端构建完成
echo.

:: 构建后端
echo [4/7] 构建后端项目...
cd LinkrMix
echo 当前目录: %CD%

echo 构建后端项目...
call mvn clean package -DskipTests
if errorlevel 1 (
    echo ❌ 错误: 后端构建失败
    cd ..
    pause
    exit /b 1
)

if not exist "admin-service\target\*.jar" (
    echo ❌ 错误: 构建后未找到 JAR 文件
    cd ..
    pause
    exit /b 1
)

cd ..
echo ✅ 后端构建完成
echo.

:: 准备部署
echo [5/7] 准备部署文件...
if exist "deploy" (
    echo 清理旧的部署目录...
    rmdir /s /q deploy
)
mkdir deploy
mkdir deploy\frontend
mkdir deploy\backend

echo 复制前端文件...
xcopy "LinkrWeb\dist\*" "deploy\frontend\" /E /Y /Q >nul
if errorlevel 1 (
    echo ❌ 错误: 复制前端文件失败
    pause
    exit /b 1
)

echo 复制后端文件...
copy "LinkrMix\admin-service\target\*.jar" "deploy\backend\" >nul
if errorlevel 1 (
    echo ❌ 错误: 复制后端文件失败
    pause
    exit /b 1
)

echo ✅ 部署文件准备完成
echo.

:: 启动后端
echo [6/7] 启动后端服务...
cd deploy\backend

set JAR_FOUND=0
for %%f in (*.jar) do (
    echo 启动后端服务: %%f
    start /B java -jar "%%f" > backend.log 2>&1
    set JAR_FOUND=1
    goto :backend_started
)

if !JAR_FOUND!==0 (
    echo ❌ 错误: 未找到后端 JAR 文件
    cd ..\..
    pause
    exit /b 1
)

:backend_started
cd ..\..

echo 等待后端启动...
timeout /t 10 /nobreak >nul

:: 检查后端是否启动成功
netstat -ano | findstr ":8081" >nul
if errorlevel 1 (
    echo ❌ 错误: 后端服务启动失败
    echo 查看日志: deploy\backend\backend.log
    pause
    exit /b 1
)
echo ✅ 后端服务启动成功 (端口 8081)
echo.

:: 启动前端
echo [7/7] 启动前端服务...
cd deploy\frontend

:: 检查端口3000是否可用
netstat -ano | findstr ":3000" >nul
if not errorlevel 1 (
    echo 端口 3000 被占用，尝试使用端口 3001...
    start /B npx serve -s . -l 3001 > frontend.log 2>&1
    set FRONTEND_PORT=3001
) else (
    start /B npx serve -s . -l 3000 > frontend.log 2>&1
    set FRONTEND_PORT=3000
)

cd ..\..

echo 等待前端启动...
timeout /t 5 /nobreak >nul

:: 检查前端是否启动成功
netstat -ano | findstr ":!FRONTEND_PORT!" >nul
if errorlevel 1 (
    echo ❌ 错误: 前端服务启动失败
    echo 查看日志: deploy\frontend\frontend.log
    pause
    exit /b 1
)
echo ✅ 前端服务启动成功 (端口 !FRONTEND_PORT!)
echo.

:: 显示结果
echo ==========================================
echo 🎉 部署完成！
echo ==========================================
echo.
echo 🌐 前端服务: http://localhost:!FRONTEND_PORT!
echo 🔧 后端服务: http://localhost:8081
echo 📊 Dubbo管理: http://localhost:22222
echo.
echo 📝 日志文件:
echo   后端: deploy\backend\backend.log
echo   前端: deploy\frontend\frontend.log
echo.
echo 🛑 停止服务: stop-optimized.bat
echo.
echo 按任意键退出...
pause >nul
