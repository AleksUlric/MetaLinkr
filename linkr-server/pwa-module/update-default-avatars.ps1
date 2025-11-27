# 更新默认头像脚本
# 功能：删除OSS桶中旧的默认头像，并上传新的默认头像

param(
    [Parameter(Mandatory=$true)]
    [string]$MaleAvatarPath,
    
    [Parameter(Mandatory=$true)]
    [string]$FemaleAvatarPath,
    
    [string]$BaseUrl = "http://localhost:8082"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "更新默认头像脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查文件是否存在
if (-not (Test-Path $MaleAvatarPath)) {
    Write-Host "❌ 错误: 男性头像文件不存在: $MaleAvatarPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $FemaleAvatarPath)) {
    Write-Host "❌ 错误: 女性头像文件不存在: $FemaleAvatarPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 文件检查通过" -ForegroundColor Green
Write-Host "  男性头像: $MaleAvatarPath" -ForegroundColor Cyan
Write-Host "  女性头像: $FemaleAvatarPath" -ForegroundColor Cyan
Write-Host ""

# 步骤1: 删除旧的默认头像
Write-Host "步骤1: 删除旧的默认头像..." -ForegroundColor Yellow
Write-Host ""

try {
    # 删除所有旧的默认头像
    $deleteResponse = Invoke-RestMethod -Uri "$BaseUrl/api/test/avatar/delete-all-defaults" -Method DELETE
    Write-Host "删除结果:" -ForegroundColor Cyan
    Write-Host "  男性头像: $($deleteResponse.data.male)" -ForegroundColor Cyan
    Write-Host "  女性头像: $($deleteResponse.data.female)" -ForegroundColor Cyan
    Write-Host "✅ 旧头像删除完成" -ForegroundColor Green
} catch {
    Write-Host "⚠️  删除旧头像时出现警告（可能文件不存在）: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# 步骤2: 上传新的男性头像
Write-Host "步骤2: 上传新的男性头像..." -ForegroundColor Yellow
try {
    $boundary = [System.Guid]::NewGuid().ToString()
    $fileBytes = [System.IO.File]::ReadAllBytes($MaleAvatarPath)
    $fileName = [System.IO.Path]::GetFileName($MaleAvatarPath)
    
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
        "Content-Type: image/png",
        "",
        [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes),
        "--$boundary",
        "Content-Disposition: form-data; name=`"type`"",
        "",
        "male",
        "--$boundary--"
    )
    
    $body = $bodyLines -join "`r`n"
    $bodyBytes = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($body)
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/test/avatar/upload-default" -Method POST `
        -ContentType "multipart/form-data; boundary=$boundary" `
        -Body $bodyBytes
    
    if ($response.code -eq 200) {
        Write-Host "✅ 男性头像上传成功" -ForegroundColor Green
        Write-Host "  URL: $($response.data.url)" -ForegroundColor Cyan
        Write-Host "  文件名: $($response.data.fileName)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ 男性头像上传失败: $($response.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ 男性头像上传失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 步骤3: 上传新的女性头像
Write-Host "步骤3: 上传新的女性头像..." -ForegroundColor Yellow
try {
    $boundary = [System.Guid]::NewGuid().ToString()
    $fileBytes = [System.IO.File]::ReadAllBytes($FemaleAvatarPath)
    $fileName = [System.IO.Path]::GetFileName($FemaleAvatarPath)
    
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
        "Content-Type: image/png",
        "",
        [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes),
        "--$boundary",
        "Content-Disposition: form-data; name=`"type`"",
        "",
        "female",
        "--$boundary--"
    )
    
    $body = $bodyLines -join "`r`n"
    $bodyBytes = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetBytes($body)
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/test/avatar/upload-default" -Method POST `
        -ContentType "multipart/form-data; boundary=$boundary" `
        -Body $bodyBytes
    
    if ($response.code -eq 200) {
        Write-Host "✅ 女性头像上传成功" -ForegroundColor Green
        Write-Host "  URL: $($response.data.url)" -ForegroundColor Cyan
        Write-Host "  文件名: $($response.data.fileName)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ 女性头像上传失败: $($response.message)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ 女性头像上传失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ 默认头像更新完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "新的默认头像URL:" -ForegroundColor Yellow
Write-Host "  男性: https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/default-avatars/male-avatar.png" -ForegroundColor Cyan
Write-Host "  女性: https://meta-linkr.oss-cn-hangzhou.aliyuncs.com/uploads/default-avatars/female-avatar.png" -ForegroundColor Cyan
Write-Host ""


