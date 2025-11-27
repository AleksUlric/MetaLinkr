#!/bin/bash

echo "========================================"
echo "阿里云OSS连接测试工具"
echo "========================================"
echo

echo "1. 测试OSS连接状态..."
curl -s -X GET "http://localhost:8082/api/test/oss/connection" | jq .
echo

echo "2. 获取OSS配置信息..."
curl -s -X GET "http://localhost:8082/api/test/oss/config" | jq .
echo

echo "3. 测试OSS权限..."
curl -s -X GET "http://localhost:8082/api/test/oss/permissions" | jq .
echo

echo "4. 测试上传配置..."
curl -s -X GET "http://localhost:8082/api/upload/config" | jq .
echo

echo "========================================"
echo "测试完成！"
echo "========================================"
echo
echo "如果看到连接成功信息，说明OSS配置正确"
echo "如果看到错误信息，请检查："
echo "1. OSS存储桶是否已创建"
echo "2. AccessKey权限是否正确"
echo "3. 网络连接是否正常"
echo
