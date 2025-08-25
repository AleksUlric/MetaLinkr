package com.aleks.linkrmix.admin.common.init;

import com.aleks.linkrmix.admin.manager.impl.AdminUserManagerImpl;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * 数据库初始化组件
 * 在应用启动时自动创建表结构
 */
@Component
public class DatabaseInitializer implements CommandLineRunner {
    
    @Resource
    private AdminUserManagerImpl adminUserManager;
    
    @Override
    public void run(String... args) throws Exception {
        // 初始化数据库表结构
        adminUserManager.initSchema();
        System.out.println("数据库表结构初始化完成");
    }
}
