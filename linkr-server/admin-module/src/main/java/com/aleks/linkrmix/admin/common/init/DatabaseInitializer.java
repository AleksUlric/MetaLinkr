package com.aleks.linkrmix.admin.common.init;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * 数据库初始化器
 * 检查数据库连接状态
 * 
 * @author aleks
 * @since 2024-01-15
 */
@Slf4j
@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private DataSource dataSource;

    @Override
    public void run(String... args) throws Exception {
        checkDatabaseConnection();
    }

    /**
     * 检查数据库连接
     */
    private void checkDatabaseConnection() {
        log.info("开始检查数据库连接...");
        
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(5)) {
                log.info("✅ 数据库连接成功！");
                log.debug("数据库URL: {}", connection.getMetaData().getURL());
                log.debug("数据库版本: {}", connection.getMetaData().getDatabaseProductVersion());
                log.debug("驱动版本: {}", connection.getMetaData().getDriverVersion());
            } else {
                log.error("❌ 数据库连接无效！");
                throw new RuntimeException("数据库连接无效");
            }
        } catch (SQLException e) {
            log.error("❌ 数据库连接失败！", e);
            log.error("错误代码: {}", e.getErrorCode());
            log.error("SQL状态: {}", e.getSQLState());
            log.error("错误消息: {}", e.getMessage());
            
            // 直接抛出异常，让应用启动失败
            throw new RuntimeException("数据库连接失败，应用启动终止", e);
        }
    }
}
