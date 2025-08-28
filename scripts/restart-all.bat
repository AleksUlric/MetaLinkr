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
echo 服务列表:
echo   Nacos服务: http://localhost:8848/nacos
echo   后端服务: http://localhost:8080
echo   Log后端: http://localhost:8082
echo   Admin前端: http://localhost:5173
echo   Log前端: http://localhost:5174
echo.
echo 可以使用以下命令检查服务状态：
echo   check-status.bat
echo.
pause
