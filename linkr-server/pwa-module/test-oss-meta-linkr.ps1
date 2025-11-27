# 测试 meta-linkr OSS 存储桶连接

Write-Host "========================================" -ForegroundColor Green
Write-Host "测试 meta-linkr OSS 存储桶连接" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "当前配置:" -ForegroundColor Yellow
Write-Host "- 存储桶名称: meta-linkr" -ForegroundColor Cyan
Write-Host "- 端点: https://oss-cn-hangzhou.aliyuncs.com" -ForegroundColor Cyan
Write-Host "- AccessKey: LTAI5t6Q8LSzTN2ACGcGH25f" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. 测试OSS连接状态..." -ForegroundColor Yellow
try {
    $response1 = Invoke-RestMethod -Uri "http://localhost:8082/api/test/oss/connection" -Method GET
    Write-Host "连接状态: $($response1.data.status)" -ForegroundColor Green
    Write-Host "消息: $($response1.data.message)" -ForegroundColor Green
    
    if ($response1.data.status -eq "connected") {
        Write-Host "✅ OSS连接成功!" -ForegroundColor Green
        Write-Host "存储桶: $($response1.data.bucketName)" -ForegroundColor Cyan
        Write-Host "区域: $($response1.data.bucketLocation)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ OSS连接失败" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 连接测试失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "2. 测试OSS权限..." -ForegroundColor Yellow
try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:8082/api/test/oss/permissions" -Method GET
    Write-Host "权限测试结果:" -ForegroundColor Green
    Write-Host "- 读取权限: $($response2.data.canRead)" -ForegroundColor Cyan
    Write-Host "- 写入权限: $($response2.data.canWrite)" -ForegroundColor Cyan
    Write-Host "- 删除权限: $($response2.data.canDelete)" -ForegroundColor Cyan
    Write-Host "- 列表权限: $($response2.data.canList)" -ForegroundColor Cyan
    
    if ($response2.data.allPermissions) {
        Write-Host "✅ 所有权限测试通过!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ 部分权限测试失败" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ 权限测试失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "3. 测试上传配置..." -ForegroundColor Yellow
try {
    $response3 = Invoke-RestMethod -Uri "http://localhost:8082/api/upload/config" -Method GET
    Write-Host "上传配置:" -ForegroundColor Green
    Write-Host "- 最大文件大小: $([math]::Round($response3.data.maxFileSize / 1MB, 2)) MB" -ForegroundColor Cyan
    Write-Host "- 允许的文件类型: $($response3.data.allowedExtensions)" -ForegroundColor Cyan
    Write-Host "- 允许的文件夹: $($response3.data.allowedFolders)" -ForegroundColor Cyan
    Write-Host "✅ 上传配置正常" -ForegroundColor Green
} catch {
    Write-Host "❌ 上传配置测试失败: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "测试完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

if ($response1.data.status -eq "connected" -and $response2.data.allPermissions) {
    Write-Host "🎉 OSS配置完全正确，可以开始使用文件上传功能！" -ForegroundColor Green
} else {
    Write-Host "⚠️ OSS配置需要调整，请检查：" -ForegroundColor Yellow
    Write-Host "1. 存储桶 'meta-linkr' 是否存在" -ForegroundColor Cyan
    Write-Host "2. AccessKey权限是否正确" -ForegroundColor Cyan
    Write-Host "3. CORS规则是否已配置" -ForegroundColor Cyan
    Write-Host "4. 网络连接是否正常" -ForegroundColor Cyan
}

Write-Host ""
Read-Host "按任意键继续..."
