package com.aleks.linkrmix.admin.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 测试控制器
 * 
 * @author Aleks
 * @version 1.0.0
 */
@RestController
@RequestMapping("/test")
public class TestController {

    @Value("${spring.application.name}")
    private String serviceName;
    
    @Value("${server.port}")
    private String serverPort;

    /**
     * 测试服务是否正常运行
     */
    @GetMapping("/ping")
    public Map<String, Object> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "pong");
        response.put("service", serviceName);
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "UP");
        return response;
    }

    /**
     * 获取服务基本信息
     */
    @GetMapping("/info")
    public Map<String, Object> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("serviceName", serviceName);
        info.put("version", "1.0.0");
        info.put("description", "Admin management service");
        info.put("port", Integer.parseInt(serverPort));
        info.put("nacosServer", "127.0.0.1:8848");
        return info;
    }
}
