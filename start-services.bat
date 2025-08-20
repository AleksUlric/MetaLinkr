@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==========================================
echo     LinkrDev 快速启动服务
echo ==========================================
echo.

:: 检查部署目录是否存在
if not exist "deploy" (
    echo ❌ 错误: 部署目录不存在
    echo 请先运行 deploy-optimized.bat 进行完整部署
    pause
    exit /b 1
)

if not exist "deploy\backend\*.jar" (
    echo ❌ 错误: 后端JAR文件不存在
    echo 请先运行 deploy-optimized.bat 进行完整部署
    pause
    exit /b 1
)

if not exist "deploy\frontend\index.html" (
    echo ❌ 错误: 前端文件不存在
    echo 请先运行 deploy-optimized.bat 进行完整部署
    pause
    exit /b 1
)

:: 停止已存在的服务
echo [1/4] 停止已存在的服务...
call stop-optimized.bat >nul 2>&1
echo ✅ 服务清理完成
echo.

:: 启动后端服务
echo [2/4] 启动后端服务...
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

:: 启动前端服务
echo [3/4] 启动前端服务...
cd deploy\frontend

:: 检查端口3000是否可用
netstat -ano | findstr ":3000" >nul
if not errorlevel 1 (
    echo 端口 3000 被占用，使用端口 3001...
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
echo [4/4] 服务启动完成
echo ==========================================
echo 🎉 服务启动成功！
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
