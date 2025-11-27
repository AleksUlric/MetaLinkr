# 阿里云OSS连接测试工具 (PowerShell版本)

Write-Host "========================================" -ForegroundColor Green
Write-Host "阿里云OSS连接测试工具" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "1. 测试OSS连接状态..." -ForegroundColor Yellow
try {
    $response1 = Invoke-RestMethod -Uri "http://localhost:8082/api/test/oss/connection" -Method GET
    $response1 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "连接失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "2. 获取OSS配置信息..." -ForegroundColor Yellow
try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:8082/api/test/oss/config" -Method GET
    $response2 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "获取配置失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "3. 测试OSS权限..." -ForegroundColor Yellow
try {
    $response3 = Invoke-RestMethod -Uri "http://localhost:8082/api/test/oss/permissions" -Method GET
    $response3 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "权限测试失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "4. 测试上传配置..." -ForegroundColor Yellow
try {
    $response4 = Invoke-RestMethod -Uri "http://localhost:8082/api/upload/config" -Method GET
    $response4 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "上传配置测试失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "测试完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "如果看到连接成功信息，说明OSS配置正确" -ForegroundColor Cyan
Write-Host "如果看到错误信息，请检查：" -ForegroundColor Cyan
Write-Host "1. OSS存储桶是否已创建" -ForegroundColor Cyan
Write-Host "2. AccessKey权限是否正确" -ForegroundColor Cyan
Write-Host "3. 网络连接是否正常" -ForegroundColor Cyan
Write-Host "4. 后端服务是否已启动" -ForegroundColor Cyan
Write-Host ""

Read-Host "按任意键继续..."
