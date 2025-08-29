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
            
            // 等待服务注册完成，最多重试5次，每次间隔2秒
            boolean registered = false;
            int maxRetries = 5;
            int retryCount = 0;
            
            while (!registered && retryCount < maxRetries) {
                try {
                    // 等待2秒让服务完全注册
                    Thread.sleep(2000);
                    
                    // 检查admin-module服务是否注册成功
                    List<ServiceInstance> instances = discoveryClient.getInstances("admin-module");
                    if (!instances.isEmpty()) {
                        log.info("✅ admin-module服务注册成功");
                        for (ServiceInstance instance : instances) {
                            log.info("   实例地址: {}:{}", instance.getHost(), instance.getPort());
                            log.info("   实例ID: {}", instance.getInstanceId());
                            log.info("   服务ID: {}", instance.getServiceId());
                            log.info("   元数据: {}", instance.getMetadata());
                        }
                        registered = true;
                    } else {
                        retryCount++;
                        if (retryCount < maxRetries) {
                            log.warn("⚠️ 第{}次检查：admin-module服务尚未注册成功，等待重试...", retryCount);
                        } else {
                            log.error("❌ admin-module服务注册失败，已重试{}次", maxRetries);
                        }
                    }
                } catch (Exception e) {
                    retryCount++;
                    log.error("检查服务注册状态时发生异常: {}", e.getMessage());
                    if (retryCount >= maxRetries) {
                        log.error("❌ 服务注册检查失败，已达到最大重试次数");
                        break;
                    }
                }
            }
            
            log.info("==========================================");
        }
    }
}
