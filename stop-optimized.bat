@echo off
chcp 65001 >nul

echo ==========================================
echo     停止 LinkrDev 服务 (优化版)
echo ==========================================
echo.

echo 正在停止前端服务...
:: 停止端口3000和3001上的服务
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" 2^>nul') do (
    echo 停止端口3000进程: %%a
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" 2^>nul') do (
    echo 停止端口3001进程: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo 正在停止后端服务...
:: 停止端口8081上的服务
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8081" 2^>nul') do (
    echo 停止端口8081进程: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo 正在停止 Dubbo 服务...
:: 停止端口20880上的服务
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":20880" 2^>nul') do (
    echo 停止端口20880进程: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo 正在停止 Dubbo QOS 服务...
:: 停止端口22222上的服务
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":22222" 2^>nul') do (
    echo 停止端口22222进程: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo 正在清理 Java 进程...
:: 停止所有Java进程
taskkill /F /IM java.exe >nul 2>&1

echo 正在清理 Node.js 进程...
:: 停止所有Node.js进程
taskkill /F /IM node.exe >nul 2>&1

echo 正在清理 npx 进程...
:: 停止所有npx进程
taskkill /F /IM npx.exe >nul 2>&1

echo.
echo ✅ 所有服务已停止
echo.

:: 显示当前端口状态
echo 当前端口状态:
netstat -ano | findstr ":3000\|:3001\|:8081\|:20880\|:22222" 2>nul
if errorlevel 1 (
    echo 所有相关端口已释放
)

echo.
echo 按任意键退出...
pause >nul
