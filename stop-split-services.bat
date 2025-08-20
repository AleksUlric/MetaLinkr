@echo off
chcp 65001 >nul
echo ==========================================
echo     LinkrDev 双服务停止脚本
echo ==========================================
echo.

echo 正在停止所有服务...

:: 停止Java进程
taskkill /F /IM java.exe >nul 2>&1

:: 停止Node.js进程
taskkill /F /IM node.exe >nul 2>&1

:: 停止特定端口的进程
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":20880" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8848" 2^>nul') do taskkill /F /PID %%a >nul 2>&1

echo ✅ 所有服务已停止
echo.
echo 按任意键退出...
pause >nul
