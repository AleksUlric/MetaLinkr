@echo off
chcp 65001 >nul
echo 正在停止所有服务...

echo 停止Nacos服务...
cd /d "%~dp0nacos-server\bin"
call shutdown.cmd

echo 停止Java进程...
taskkill /f /im java.exe 2>nul
taskkill /f /im javaw.exe 2>nul

echo 停止Node.js进程...
taskkill /f /im node.exe 2>nul

echo 停止Maven进程...
taskkill /f /im mvn.cmd 2>nul
taskkill /f /im mvn.exe 2>nul

echo 关闭相关命令行窗口...
taskkill /f /fi "WINDOWTITLE eq 前端服务*" 2>nul
taskkill /f /fi "WINDOWTITLE eq 后端服务*" 2>nul
taskkill /f /fi "WINDOWTITLE eq Nacos服务*" 2>nul

echo 检查端口占用情况...
echo 检查8080端口...
netstat -ano | findstr :8080
echo 检查5173端口...
netstat -ano | findstr :5173
echo 检查8848端口...
netstat -ano | findstr :8848

echo 所有服务已停止！
pause
