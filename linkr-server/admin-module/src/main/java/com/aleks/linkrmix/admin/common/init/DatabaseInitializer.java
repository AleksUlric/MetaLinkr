package com.aleks.linkrmix.admin.common.init;

import com.aleks.linkrmix.admin.manager.AdminUserManager;
import com.aleks.linkrmix.admin.model.dto.CreateUserDto;
import com.aleks.linkrmix.admin.service.AdminUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * 数据库初始化组件
 * 在应用启动时自动创建表结构
 */
@Slf4j
@Component
public class DatabaseInitializer implements CommandLineRunner {
    
    @Resource
    private AdminUserManager adminUserManager;
    
    @Resource
    private AdminUserService adminUserService;
    
    @Override
    public void run(String... args) throws Exception {
        // 初始化数据库表结构
        adminUserManager.initSchema();
        log.info("数据库表结构初始化完成");
        
        // 初始化默认管理员账户
        try {
            if (adminUserService.findAllUsers().isEmpty()) {
                CreateUserDto adminDto = new CreateUserDto();
                adminDto.setUsername("admin");
                adminDto.setPassword("admin123");
                adminDto.setDisplayName("系统管理员");
                adminUserService.createUser(adminDto);
                log.info("默认管理员账户创建成功");
            }
        } catch (Exception e) {
            log.warn("创建默认管理员账户失败: {}", e.getMessage());
        }
    }
}
