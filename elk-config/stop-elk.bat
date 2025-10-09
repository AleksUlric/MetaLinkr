@echo off
chcp 65001 >nul
echo 停止ELK日志纳管服务...
echo.

echo 停止所有服务...
docker-compose down

echo.
echo 清理未使用的容器和网络...
docker system prune -f

echo.
echo ELK服务已停止！
echo.
pause
