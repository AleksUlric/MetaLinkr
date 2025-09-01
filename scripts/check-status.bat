@echo off
chcp 65001 >nul
title 服务状态检查 - MetaLinkr项目

echo ========================================
echo 🔍 服务状态检查 - MetaLinkr项目
echo ========================================
echo 📅 检查时间: %date% %time%
echo.

echo 🔍 检查MySQL服务 (端口3306)...
netstat -ano | findstr :3306 >nul
if %errorlevel% equ 0 (
    echo ✅ MySQL服务正在运行
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3306') do (
        echo    进程ID: %%a
    )
) else (
    echo ❌ MySQL服务未运行
)

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
echo 🔍 检查Log后端服务 (端口8081)...
netstat -ano | findstr :8081 >nul
if %errorlevel% equ 0 (
    echo ✅ Log后端服务正在运行
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do (
        echo    进程ID: %%a
    )
) else (
    echo ❌ Log后端服务未运行
)

echo.
echo 🔍 检查Admin前端服务 (端口5173)...
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo ✅ Admin前端服务正在运行
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
        echo    进程ID: %%a
    )
) else (
    echo ❌ Admin前端服务未运行
)

echo.
echo 🔍 检查Log前端服务 (端口5174)...
netstat -ano | findstr :5174 >nul
if %errorlevel% equ 0 (
    echo ✅ Log前端服务正在运行
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5174') do (
        echo    进程ID: %%a
    )
) else (
    echo ❌ Log前端服务未运行
)

echo.
echo 🔍 检查CMAK服务 (端口9000)...
netstat -ano | findstr :9000 >nul
if %errorlevel% equ 0 (
    echo ✅ CMAK服务正在运行
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :9000') do (
        echo    进程ID: %%a
    )
) else (
    echo ❌ CMAK服务未运行
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
echo 🌐 服务访问地址
echo ========================================
echo 🌐 Nacos控制台: http://localhost:8848/nacos
echo 🔧 Admin后端API: http://localhost:8080
echo 📝 Log后端API: http://localhost:8081
echo 📊 健康检查: http://localhost:8080/actuator/health
echo 🖥️  Admin前端: http://localhost:5173
echo 📝 Log前端: http://localhost:5174
echo 🚀 CMAK控制台: http://localhost:9000
echo ========================================

echo.
pause
