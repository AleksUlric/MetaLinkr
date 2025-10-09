@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul 2>&1
echo ========================================
echo ELK服务日志查看
echo ========================================
echo.

:menu
echo 请选择要查看的日志:
echo 1. Elasticsearch日志
echo 2. Kibana日志
echo 3. Filebeat日志
echo 4. 查看所有服务日志
echo 5. 实时查看所有日志
echo 6. 检查AWS相关错误
echo 7. 退出
echo.
set /p choice=请输入选择 (1-7): 

if "%choice%"=="1" goto :es_logs
if "%choice%"=="2" goto :kibana_logs
if "%choice%"=="3" goto :filebeat_logs
if "%choice%"=="4" goto :all_logs
if "%choice%"=="5" goto :follow_logs
if "%choice%"=="6" goto :aws_check
if "%choice%"=="7" goto :exit
echo 无效选择，请重新输入
goto :menu

:es_logs
echo.
echo ========================================
echo Elasticsearch日志 (最近50行)
echo ========================================
docker logs elk-elasticsearch --tail 50
echo.
echo 按任意键继续...
pause >nul
goto :menu

:kibana_logs
echo.
echo ========================================
echo Kibana日志 (最近50行)
echo ========================================
docker logs elk-kibana --tail 50
echo.
echo 按任意键继续...
pause >nul
goto :menu

:filebeat_logs
echo.
echo ========================================
echo Filebeat日志 (最近50行)
echo ========================================
docker logs elk-filebeat --tail 50
echo.
echo 按任意键继续...
pause >nul
goto :menu

:all_logs
echo.
echo ========================================
echo 所有服务日志 (最近20行)
echo ========================================
echo.
echo --- Elasticsearch日志 ---
docker logs elk-elasticsearch --tail 20
echo.
echo --- Kibana日志 ---
docker logs elk-kibana --tail 20
echo.
echo --- Filebeat日志 ---
docker logs elk-filebeat --tail 20
echo.
echo 按任意键继续...
pause >nul
goto :menu

:follow_logs
echo.
echo ========================================
echo 实时查看所有服务日志
echo 按 Ctrl+C 退出
echo ========================================
docker-compose logs -f

:aws_check
echo.
echo ========================================
echo 检查AWS相关错误
echo ========================================
echo.
echo 检查Elasticsearch中的AWS/S3相关错误...
docker logs elk-elasticsearch 2>nul | findstr /i "aws\|s3\|amazon\|access.*denied" >nul
if %errorlevel% equ 0 (
    echo [WARNING] 发现AWS相关错误，显示详细信息:
    echo.
    docker logs elk-elasticsearch 2>nul | findstr /i "aws\|s3\|amazon\|access.*denied"
) else (
    echo [OK] 未发现AWS相关错误
)
echo.
echo 检查其他服务中的AWS相关错误...
docker logs elk-kibana 2>nul | findstr /i "aws\|s3\|amazon" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Kibana中发现AWS相关错误
) else (
    echo [OK] Kibana中未发现AWS相关错误
)
docker logs elk-filebeat 2>nul | findstr /i "aws\|s3\|amazon" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Filebeat中发现AWS相关错误
) else (
    echo [OK] Filebeat中未发现AWS相关错误
)
echo.
echo 按任意键继续...
pause >nul
goto :menu

:exit
echo 退出日志查看
