@echo off
chcp 65001 >nul
echo ==========================================
echo     Dubbo服务独立启动脚本
echo ==========================================
echo.

:: 检查JAR文件是否存在
if not exist "LinkrMix\dubbo-service\target\dubbo-service-1.0-SNAPSHOT.jar" (
    echo ❌ 错误: Dubbo服务JAR文件不存在
    echo 请先运行 build-dubbo-service.bat 进行打包
    pause
    exit /b 1
)

:: 停止已存在的Dubbo服务
echo [1/3] 停止已存在的Dubbo服务...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":20880" 2^>nul') do taskkill /F /PID %%a >nul 2>&1
echo ✅ 已清理旧进程

:: 启动Dubbo服务
echo [2/3] 启动Dubbo服务...
cd LinkrMix\dubbo-service\target
start /B java -jar dubbo-service-1.0-SNAPSHOT.jar > dubbo-service.log 2>&1
cd ..\..\..

:: 等待服务启动
echo [3/3] 等待服务启动...
timeout /t 15 /nobreak >nul

:: 检查服务状态
echo.
echo 📊 服务状态检查:
netstat -ano | findstr ":20880" >nul && echo ✅ Dubbo服务 (20880) - 运行中 || echo ❌ Dubbo服务 (20880) - 未启动

echo.
echo ==========================================
echo 🎉 Dubbo服务启动完成！
echo ==========================================
echo.
echo 🌐 访问地址: http://localhost:20880
echo 📝 日志文件: LinkrMix\dubbo-service\target\dubbo-service.log
echo.
echo 🛑 停止服务: taskkill /F /IM java.exe
echo.
pause
