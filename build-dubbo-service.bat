@echo off
chcp 65001 >nul
echo ==========================================
echo     Dubbo服务独立打包脚本
echo ==========================================
echo.

:: 检查依赖
echo [1/3] 检查系统依赖...
mvn --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Maven 未安装
    pause
    exit /b 1
)
echo ✅ Maven 已安装

:: 构建admin-api模块
echo [2/3] 构建admin-api模块...
cd LinkrMix\admin-api
call mvn clean install -DskipTests
if errorlevel 1 (
    echo ❌ 错误: admin-api构建失败
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

:: 构建dubbo-service
echo [3/3] 构建Dubbo服务...
cd LinkrMix\dubbo-service
call mvn clean package -DskipTests
if errorlevel 1 (
    echo ❌ 错误: Dubbo服务构建失败
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

echo.
echo ==========================================
echo 🎉 Dubbo服务打包完成！
echo ==========================================
echo.
echo 📦 JAR文件位置:
echo   LinkrMix\dubbo-service\target\dubbo-service-1.0-SNAPSHOT.jar
echo.
echo 🚀 启动命令:
echo   java -jar LinkrMix\dubbo-service\target\dubbo-service-1.0-SNAPSHOT.jar
echo.
pause
