@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo MetaLinkr Log前端服务启动脚本
echo ========================================

echo 正在启动Log前端服务...

:: 检查linkr-log目录是否存在
if not exist "%~dp0linkr-client\linkr-log" (
    echo 错误: 找不到linkr-log目录
    echo 请确保项目结构正确
    pause
    exit /b 1
)

:: 切换到linkr-log目录
cd /d "%~dp0linkr-client\linkr-log"

:: 检查package.json是否存在
if not exist "package.json" (
    echo 错误: 找不到package.json文件
    echo 请确保linkr-log项目已正确初始化
    pause
    exit /b 1
)

:: 安装依赖
echo 正在安装依赖...
call npm install
if errorlevel 1 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

:: 启动开发服务器
echo 正在启动Log前端服务...
echo 服务将在 http://localhost:5174 启动
echo.
echo 按 Ctrl+C 停止服务
echo.

start "Log前端服务" cmd /k "npm run dev"

echo.
echo ========================================
echo Log前端服务启动完成！
echo ========================================
echo 访问地址: http://localhost:5174
echo ========================================
echo.
echo 按任意键退出...
pause >nul
