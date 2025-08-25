package com.aleks.linkrmix.admin.common.config;

import com.alibaba.cloud.nacos.NacosDiscoveryProperties;
import com.alibaba.cloud.nacos.NacosServiceManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Nacos服务发现配置类
 * 
 * @author Aleks
 * @version 1.0.0
 */
@Configuration
public class NacosDiscoveryConfig {

    @Autowired
    private NacosDiscoveryProperties nacosDiscoveryProperties;

    @Autowired
    private NacosServiceManager nacosServiceManager;

    /**
     * 服务启动后检查nacos注册状态
     */
    @Component
    public static class NacosRegistrationChecker implements ApplicationRunner {

        @Autowired
        private DiscoveryClient discoveryClient;

        @Override
        public void run(ApplicationArguments args) throws Exception {
            System.out.println("==========================================");
            System.out.println("🚀 Admin服务启动完成");
            System.out.println("==========================================");
            System.out.println("服务名称: admin-module");
            System.out.println("服务端口: 8080");
            System.out.println("健康检查: http://localhost:8080/actuator/health");
            System.out.println("Nacos控制台: http://localhost:8848/nacos");
            System.out.println("==========================================");
            
            // 检查admin-module服务是否注册成功
            List<ServiceInstance> instances = discoveryClient.getInstances("admin-module");
            if (!instances.isEmpty()) {
                System.out.println("✅ admin-module服务注册成功");
                for (ServiceInstance instance : instances) {
                    System.out.println("   实例地址: " + instance.getHost() + ":" + instance.getPort());
                    System.out.println("   实例状态: " + instance.getMetadata());
                }
            } else {
                System.out.println("❌ admin-module服务未注册成功");
            }
            
            // 显示所有已注册的服务
            System.out.println("已注册服务列表: " + discoveryClient.getServices());
            System.out.println("==========================================");
        }
    }
}
