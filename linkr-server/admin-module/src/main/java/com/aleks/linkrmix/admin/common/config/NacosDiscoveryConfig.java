package com.aleks.linkrmix.admin.common.config;

import com.alibaba.cloud.nacos.NacosDiscoveryProperties;
import com.alibaba.cloud.nacos.NacosServiceManager;
import lombok.extern.slf4j.Slf4j;
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
    @Slf4j
    @Component
    public static class NacosRegistrationChecker implements ApplicationRunner {

        @Autowired
        private DiscoveryClient discoveryClient;

        @Override
        public void run(ApplicationArguments args) throws Exception {
                    log.info("==========================================");
        log.info("🚀 Admin服务启动完成 - MetaLinkr项目");
        log.info("==========================================");
        log.info("服务名称: admin-module");
        log.info("服务端口: 8080");
        log.info("启动时间: {}", java.time.LocalDateTime.now());
        log.info("健康检查: http://localhost:8080/actuator/health");
        log.info("Nacos控制台: http://localhost:8848/nacos");
        log.info("==========================================");
            
            // 检查admin-module服务是否注册成功
            List<ServiceInstance> instances = discoveryClient.getInstances("admin-module");
            if (!instances.isEmpty()) {
                log.info("✅ admin-module服务注册成功");
                for (ServiceInstance instance : instances) {
                    log.info("   实例地址: {}:{}", instance.getHost(), instance.getPort());
                    log.info("   实例状态: {}", instance.getMetadata());
                }
            } else {
                log.warn("❌ admin-module服务未注册成功");
            }
            
            // 显示所有已注册的服务
            log.info("已注册服务列表: {}", discoveryClient.getServices());
            log.info("==========================================");
        }
    }
}
