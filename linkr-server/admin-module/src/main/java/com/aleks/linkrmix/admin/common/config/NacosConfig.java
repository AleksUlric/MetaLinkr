package com.aleks.linkrmix.admin.common.config;

import com.alibaba.cloud.nacos.NacosDiscoveryProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

/**
 * Nacos服务注册配置类
 */
@Configuration
@EnableConfigurationProperties(NacosDiscoveryProperties.class)
public class NacosConfig {

    @Resource
    private NacosDiscoveryProperties nacosDiscoveryProperties;

    @PostConstruct
    public void init() {
        // 设置服务元数据
        nacosDiscoveryProperties.getMetadata().put("startup-time", String.valueOf(System.currentTimeMillis()));
        nacosDiscoveryProperties.getMetadata().put("jvm-version", System.getProperty("java.version"));
        nacosDiscoveryProperties.getMetadata().put("os-name", System.getProperty("os.name"));
        nacosDiscoveryProperties.getMetadata().put("service-type", "admin-module");
    }
}
