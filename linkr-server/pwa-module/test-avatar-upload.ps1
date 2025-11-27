# 测试默认头像上传接口

Write-Host "测试默认头像上传接口..." -ForegroundColor Green
Write-Host ""

# 测试OSS连接
Write-Host "1. 测试OSS连接..." -ForegroundColor Yellow
try {
    $ossResponse = Invoke-RestMethod -Uri "http://localhost:8082/api/test/oss/connection" -Method GET
    Write-Host "OSS状态: $($ossResponse.data.status)" -ForegroundColor Cyan
    if ($ossResponse.data.status -eq "connected") {
        Write-Host "✅ OSS连接正常" -ForegroundColor Green
    } else {
        Write-Host "❌ OSS连接失败: $($ossResponse.data.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ OSS连接测试失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 测试上传男性头像
Write-Host "2. 测试上传男性头像..." -ForegroundColor Yellow
try {
    $maleResponse = Invoke-RestMethod -Uri "http://localhost:8082/api/test/avatar/upload-male" -Method POST
    Write-Host "男性头像URL: $($maleResponse.data.url)" -ForegroundColor Cyan
    Write-Host "✅ 男性头像上传成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 男性头像上传失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 测试上传女性头像
Write-Host "3. 测试上传女性头像..." -ForegroundColor Yellow
try {
    $femaleResponse = Invoke-RestMethod -Uri "http://localhost:8082/api/test/avatar/upload-female" -Method POST
    Write-Host "女性头像URL: $($femaleResponse.data.url)" -ForegroundColor Cyan
    Write-Host "✅ 女性头像上传成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 女性头像上传失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 测试批量上传
Write-Host "4. 测试批量上传..." -ForegroundColor Yellow
try {
    $allResponse = Invoke-RestMethod -Uri "http://localhost:8082/api/test/avatar/upload-all" -Method POST
    Write-Host "批量上传结果:" -ForegroundColor Cyan
    Write-Host "男性头像: $($allResponse.data.male.url)" -ForegroundColor Cyan
    Write-Host "女性头像: $($allResponse.data.female.url)" -ForegroundColor Cyan
    Write-Host "✅ 批量上传成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 批量上传失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Green
