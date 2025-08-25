@echo off
chcp 65001 >nul
echo ========================================
echo 启动Nacos服务注册与配置中心
echo ========================================

cd /d "%~dp0nacos-server\bin"
echo 当前目录: %CD%

echo.
echo 正在启动Nacos服务...
start "Nacos服务" cmd /k "startup.cmd -m standalone"

echo.
echo 等待Nacos启动...
timeout /t 20 /nobreak >nul

echo.
echo ========================================
echo Nacos服务启动信息
echo ========================================
echo 服务地址: http://localhost:8848/nacos
echo 默认账号: nacos
echo 默认密码: nacos
echo 命名空间: public
echo 配置组: DEFAULT_GROUP
echo ========================================

echo.
echo 请访问Nacos控制台确认服务状态
pause
