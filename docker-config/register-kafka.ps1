# 注册Kafka服务到Nacos
$uri = "http://localhost:8848/nacos/v1/ns/instance"
$body = @{
    serviceName = "kafka-service"
    ip = "localhost"
    port = "9092"
    namespaceId = "public"
    groupName = "DEFAULT_GROUP"
    metadata = '{"type":"message-queue","version":"3.7.0","description":"Apache Kafka Message Queue"}'
}

try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -Body $body
    Write-Host "Kafka服务注册成功: $response" -ForegroundColor Green
} catch {
    Write-Host "Kafka服务注册失败: $($_.Exception.Message)" -ForegroundColor Red
}
