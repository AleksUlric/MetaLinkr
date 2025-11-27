# Simple OSS Test Script

Write-Host "Testing OSS Connection..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8082/api/test/oss/connection" -Method GET
    Write-Host "Status: $($response.data.status)" -ForegroundColor Yellow
    Write-Host "Message: $($response.data.message)" -ForegroundColor Yellow
    
    if ($response.data.status -eq "connected") {
        Write-Host "SUCCESS: OSS connected!" -ForegroundColor Green
        Write-Host "Bucket: $($response.data.bucketName)" -ForegroundColor Cyan
    } else {
        Write-Host "FAILED: OSS connection failed" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testing Permissions..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8082/api/test/oss/permissions" -Method GET
    Write-Host "Read: $($response.data.canRead)" -ForegroundColor Yellow
    Write-Host "Write: $($response.data.canWrite)" -ForegroundColor Yellow
    Write-Host "Delete: $($response.data.canDelete)" -ForegroundColor Yellow
    Write-Host "List: $($response.data.canList)" -ForegroundColor Yellow
    
    if ($response.data.allPermissions) {
        Write-Host "SUCCESS: All permissions OK!" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Some permissions failed" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Green
