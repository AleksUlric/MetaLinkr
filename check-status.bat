@echo off
chcp 65001 >nul
echo ========================================
echo MetaLinkr 服务状态检查
echo ========================================

echo.
echo 📊 检查端口占用情况...
echo.

echo 🔍 检查Nacos服务 (端口8848)...
netstat -ano | findstr :8848 >nul
if %errorlevel% equ 0 (
    echo ✅ Nacos服务正在运行
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8848') do (
        echo    进程ID: %%a
    )
) else (
    echo ❌ Nacos服务未运行
)

echo.
echo 🔍 检查Admin后端服务 (端口8080)...
netstat -ano | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo ✅ Admin后端服务正在运行
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
        echo    进程ID: %%a
    )
) else (
    echo ❌ Admin后端服务未运行
)

echo.
echo 🔍 检查前端服务 (端口5173)...
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo ✅ 前端服务正在运行
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
        echo    进程ID: %%a
    )
) else (
    echo ❌ 前端服务未运行
)

echo.
echo 🔍 检查Java进程...
tasklist /fi "imagename eq java.exe" 2>nul | find "java.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ 发现Java进程
    tasklist /fi "imagename eq java.exe" /fo table
) else (
    echo ❌ 未发现Java进程
)

echo.
echo 🔍 检查Node.js进程...
tasklist /fi "imagename eq node.exe" 2>nul | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ 发现Node.js进程
    tasklist /fi "imagename eq node.exe" /fo table
) else (
    echo ❌ 未发现Node.js进程
)

echo.
echo ========================================
echo 服务访问地址
echo ========================================
echo 🌐 Nacos控制台: http://localhost:8848/nacos
echo 🔧 Admin后端API: http://localhost:8080
echo 📊 健康检查: http://localhost:8080/actuator/health
echo 🖥️  前端页面: http://localhost:5173
echo ========================================

echo.
pause
