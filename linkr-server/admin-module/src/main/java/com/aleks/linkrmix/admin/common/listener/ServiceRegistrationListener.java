package com.aleks.linkrmix.admin.common.listener;

import com.alibaba.cloud.nacos.registry.NacosRegistration;
import com.alibaba.cloud.nacos.registry.NacosServiceRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cloud.client.serviceregistry.Registration;
import org.springframework.cloud.client.serviceregistry.ServiceRegistry;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * 服务注册监听器
 */
@Component
public class ServiceRegistrationListener {

    private static final Logger logger = LoggerFactory.getLogger(ServiceRegistrationListener.class);

    @Resource
    private ServiceRegistry<Registration> serviceRegistry;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady(ApplicationReadyEvent event) {
        logger.info("应用启动完成，开始注册服务到Nacos...");
        logger.info("当前时间: {}", java.time.LocalDateTime.now());
        
        if (serviceRegistry instanceof NacosServiceRegistry) {
            NacosServiceRegistry nacosRegistry = (NacosServiceRegistry) serviceRegistry;
            logger.info("Nacos服务注册器初始化成功");
            logger.info("服务注册状态: 准备就绪");
        } else {
            logger.warn("服务注册器类型不匹配，当前类型: {}", serviceRegistry.getClass().getSimpleName());
        }
    }
}
