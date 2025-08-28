@echo off
chcp 65001 >nul
echo ========================================
echo Log模块数据库初始化脚本
echo ========================================
echo.

echo 检查MySQL服务...
netstat -ano | findstr :3306 >nul
if errorlevel 1 (
    echo ❌ MySQL服务未启动，请先启动MySQL服务
    pause
    exit /b 1
) else (
    echo ✅ MySQL服务正在运行
)

echo.
echo 正在创建linkr_log数据库...

:: 尝试使用mysql命令创建数据库
mysql -u root -pXing@1225 -e "CREATE DATABASE IF NOT EXISTS linkr_log CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if errorlevel 1 (
    echo ⚠️  无法使用mysql命令，尝试其他方法...
    
    :: 尝试使用PowerShell创建数据库
    powershell -Command "try { $conn = New-Object System.Data.Odbc.OdbcConnection; $conn.ConnectionString = 'Driver={MySQL ODBC 8.0 Driver};Server=localhost;User=root;Password=Xing@1225;'; $conn.Open(); $cmd = $conn.CreateCommand(); $cmd.CommandText = 'CREATE DATABASE IF NOT EXISTS linkr_log CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'; $cmd.ExecuteNonQuery(); $conn.Close(); Write-Host '数据库创建成功' } catch { Write-Host '数据库创建失败: ' + $_.Exception.Message }" 2>nul
    
    if errorlevel 1 (
        echo ❌ 数据库创建失败
        echo 请手动执行以下SQL命令：
        echo CREATE DATABASE IF NOT EXISTS linkr_log CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        pause
        exit /b 1
    ) else (
        echo ✅ 数据库创建成功
    )
) else (
    echo ✅ 数据库创建成功
)

echo.
echo 正在创建日志表...

:: 创建日志表的SQL语句
set SQL_CREATE_TABLE=CREATE TABLE IF NOT EXISTS log_entry ^(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    level VARCHAR(10^) NOT NULL,
    logger_name VARCHAR(255^) NOT NULL,
    message TEXT NOT NULL,
    thread_name VARCHAR(255^),
    timestamp DATETIME NOT NULL,
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_level ^(level^),
    INDEX idx_logger ^(logger_name^),
    INDEX idx_timestamp ^(timestamp^),
    INDEX idx_created_time ^(created_time^)
^) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

:: 尝试执行SQL
mysql -u root -pXing@1225 linkr_log -e "%SQL_CREATE_TABLE%" 2>nul
if errorlevel 1 (
    echo ⚠️  无法使用mysql命令创建表，请手动执行以下SQL：
    echo.
    echo USE linkr_log;
    echo %SQL_CREATE_TABLE%
    echo.
    echo 或者使用MySQL客户端工具执行上述SQL语句
) else (
    echo ✅ 日志表创建成功
)

echo.
echo ========================================
echo 数据库初始化完成
echo ========================================
echo 数据库名称: linkr_log
echo 字符集: utf8mb4
echo 排序规则: utf8mb4_unicode_ci
echo.
echo 现在可以启动log-module服务了
echo.
pause
