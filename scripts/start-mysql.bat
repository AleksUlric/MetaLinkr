@echo off
chcp 65001 >nul
echo ========================================
echo MetaLinkr - MySQL 服务管理脚本
echo ========================================

:: 检查是否有参数
if "%1"=="restart" (
    echo 检测到重启参数，正在重启MySQL服务...
    goto :restart_service
) else if "%1"=="stop" (
    echo 检测到停止参数，正在停止MySQL服务...
    goto :stop_service
) else if "%1"=="" (
    echo 正在启动MySQL服务...
    goto :start_service
) else (
    echo 未知参数: %1
    echo 用法: start-mysql.bat [start^|stop^|restart]
    pause
    exit /b 1
)

:stop_service
echo.
echo 正在停止MySQL服务...
sc query mysql > nul 2>&1
if %errorlevel% equ 0 (
    net stop mysql
    if %errorlevel% equ 0 (
        echo ✅ MySQL服务停止成功！
    ) else (
        echo ❌ MySQL服务停止失败！
        echo 请尝试以管理员身份运行此脚本
    )
) else (
    echo ❌ MySQL服务未安装或未找到！
)
if "%1"=="stop" (
    pause
    exit /b 0
)

:restart_service
echo.
echo 正在重启MySQL服务...
sc query mysql > nul 2>&1
if %errorlevel% equ 0 (
    net stop mysql
    echo 等待3秒后重新启动...
    timeout /t 3 /nobreak >nul
) else (
    echo ❌ MySQL服务未安装或未找到！
    pause
    exit /b 1
)

:start_service
echo.
echo 正在检查MySQL服务状态...

:: 检查端口3306是否被占用
echo 检查端口3306是否被占用...
netstat -ano | findstr :3306 >nul
if %errorlevel% equ 0 (
    echo ⚠️  端口3306已被占用，正在强制释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3306') do (
        echo 正在终止进程ID: %%a
        taskkill /f /pid %%a 2>nul
    )
    echo 等待3秒让端口完全释放...
    timeout /t 3 /nobreak >nul
) else (
    echo ✅ 端口3306可用
)

sc query mysql > nul 2>&1
if %errorlevel% equ 0 (
    echo MySQL服务已安装，正在启动...
    net start mysql
    if %errorlevel% equ 0 (
        echo ✅ MySQL服务启动成功！
    ) else (
        echo ❌ MySQL服务启动失败！
        echo 请尝试以管理员身份运行此脚本
        echo 或者手动启动MySQL服务
    )
) else (
    echo ❌ MySQL服务未安装或未找到！
    echo 请确保MySQL已正确安装
)

echo.
echo 正在检查端口3306是否被占用...
netstat -an | findstr :3306
if %errorlevel% equ 0 (
    echo ✅ MySQL端口3306正在监听
) else (
    echo ❌ MySQL端口3306未监听
)

echo.
echo ========================================
echo MySQL服务信息
echo ========================================
echo 数据库连接信息：
echo - 主机: localhost
echo - 端口: 3306
echo - 数据库: linkr_log
echo - 用户名: root
echo - 密码: Xing@1225
echo ========================================
echo.
echo 使用方法:
echo   start-mysql.bat        - 启动MySQL服务
echo   start-mysql.bat stop   - 停止MySQL服务
echo   start-mysql.bat restart - 重启MySQL服务
echo.
echo 如果MySQL服务启动失败，请尝试以下步骤：
echo 1. 以管理员身份运行此脚本
echo 2. 检查MySQL安装路径
echo 3. 手动启动MySQL服务
echo 4. 检查防火墙设置
echo.
pause
