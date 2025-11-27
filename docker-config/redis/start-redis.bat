@echo off
echo Starting Redis 8.0 Alpine...
docker-compose up -d
echo.
echo Redis is starting...
echo Check status with: docker-compose ps
echo View logs with: docker-compose logs -f redis
echo Connect with: docker exec -it redis-pwa redis-cli
echo.
pause
