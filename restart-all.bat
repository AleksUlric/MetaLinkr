@echo off
chcp 65001 >nul
echo ========================================
echo MetaLinkr 一键重启脚本
echo ========================================
echo.
echo 正在重启所有服务...
echo.

:: 调用start-all.bat的restart功能
call "%~dp0start-all.bat" restart

echo.
echo ========================================
echo 重启完成！
echo ========================================
echo 所有服务已重启，请检查服务状态
echo.
echo 可以使用以下命令检查服务状态：
echo   check-status.bat
echo.
pause
