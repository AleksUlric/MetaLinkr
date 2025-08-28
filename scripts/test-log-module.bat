@echo off
chcp 65001 >nul
echo ========================================
echo Log模块诊断脚本
echo ========================================
echo.

echo 1. 检查Java环境...
java -version
if errorlevel 1 (
    echo ❌ Java环境检查失败
    echo 请确保已安装JDK 1.8+
    pause
    exit /b 1
) else (
    echo ✅ Java环境正常
)

echo.
echo 2. 检查Maven环境...
mvn -version
if errorlevel 1 (
    echo ❌ Maven环境检查失败
    echo 请确保已安装Maven 3.6+
    pause
    exit /b 1
) else (
    echo ✅ Maven环境正常
)

echo.
echo 3. 检查项目目录...
if not exist "%~dp0..\linkr-server\log-module" (
    echo ❌ 找不到log-module目录
    pause
    exit /b 1
) else (
    echo ✅ log-module目录存在
)

echo.
echo 4. 检查pom.xml文件...
if not exist "%~dp0..\linkr-server\log-module\pom.xml" (
    echo ❌ 找不到pom.xml文件
    pause
    exit /b 1
) else (
    echo ✅ pom.xml文件存在
)

echo.
echo 5. 检查主启动类...
if not exist "%~dp0..\linkr-server\log-module\src\main\java\com\aleks\linkrmix\log\LogModuleApplication.java" (
    echo ❌ 找不到主启动类
    pause
    exit /b 1
) else (
    echo ✅ 主启动类存在
)

echo.
echo 6. 检查配置文件...
if not exist "%~dp0..\linkr-server\log-module\src\main\resources\application.yml" (
    echo ❌ 找不到application.yml配置文件
    pause
    exit /b 1
) else (
    echo ✅ 配置文件存在
)

echo.
echo 7. 检查端口占用情况...
netstat -ano | findstr :8082
if errorlevel 1 (
    echo ✅ 端口8082未被占用
) else (
    echo ⚠️  端口8082已被占用
)

echo.
echo 8. 检查MySQL服务...
netstat -ano | findstr :3306
if errorlevel 1 (
    echo ⚠️  MySQL服务可能未启动
) else (
    echo ✅ MySQL服务正在运行
)

echo.
echo 9. 检查Nacos服务...
netstat -ano | findstr :8848
if errorlevel 1 (
    echo ⚠️  Nacos服务可能未启动
) else (
    echo ✅ Nacos服务正在运行
)

echo.
echo 10. 尝试编译项目...
cd /d "%~dp0..\linkr-server\log-module"
echo 当前目录: %CD%
echo 正在编译...
call mvn clean compile -q
if errorlevel 1 (
    echo ❌ 编译失败
    echo 尝试详细编译...
    call mvn clean compile
    pause
    exit /b 1
) else (
    echo ✅ 编译成功
)

echo.
echo ========================================
echo 诊断完成
echo ========================================
echo 如果所有检查都通过，请尝试手动启动：
echo cd /d "%~dp0..\linkr-server\log-module"
echo mvn spring-boot:run
echo.
echo 如果仍有问题，请检查：
echo 1. 数据库连接配置
echo 2. 网络连接
echo 3. 防火墙设置
echo 4. 系统资源（内存、磁盘空间）
echo.
pause
