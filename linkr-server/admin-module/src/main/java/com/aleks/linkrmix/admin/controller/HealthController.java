package com.aleks.linkrmix.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 健康检查控制器
 * 
 * @author Aleks
 * @version 1.0.0
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    @Autowired
    private DiscoveryClient discoveryClient;
    
    @Value("${spring.application.name}")
    private String serviceName;
    
    @Value("${server.port}")
    private String serverPort;

    /**
     * 服务状态检查
     */
    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        Map<String, Object> result = new HashMap<>();
        result.put("service", serviceName);
        result.put("status", "UP");
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }

    /**
     * 服务信息
     */
    @GetMapping("/info")
    public Map<String, Object> getInfo() {
        Map<String, Object> result = new HashMap<>();
        result.put("service", serviceName);
        result.put("version", "1.0.0");
        result.put("description", "Admin management service");
        result.put("port", Integer.parseInt(serverPort));
        
        // 获取已注册的服务列表
        List<String> services = discoveryClient.getServices();
        result.put("registeredServices", services);
        
        // 获取当前服务的实例信息
        List<ServiceInstance> instances = discoveryClient.getInstances(serviceName);
        result.put("instances", instances);
        
        return result;
    }

    /**
     * 服务发现测试
     */
    @GetMapping("/discovery")
    public Map<String, Object> getDiscoveryInfo() {
        Map<String, Object> result = new HashMap<>();
        
        // 获取所有服务
        List<String> services = discoveryClient.getServices();
        result.put("allServices", services);
        
        // 获取每个服务的实例信息
        Map<String, List<ServiceInstance>> serviceInstances = new HashMap<>();
        for (String service : services) {
            List<ServiceInstance> instances = discoveryClient.getInstances(service);
            serviceInstances.put(service, instances);
        }
        result.put("serviceInstances", serviceInstances);
        
        return result;
    }
}
