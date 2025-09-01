package com.aleks.linkrmix.admin.controller;

import com.aleks.linkrmix.admin.service.LogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * 测试控制器
 * 用于测试日志发送功能
 * 
 * @author aleks
 * @since 2024-01-15
 */
@Slf4j
@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @Resource
    private LogService logService;
    
    /**
     * 测试发送操作日志
     */
    @PostMapping("/log/operation")
    public String testOperationLog(@RequestParam String userId, 
                                   @RequestParam String username, 
                                   @RequestParam String operation) {
        try {
            logService.sendOperationLog(userId, username, operation, 
                "TestController.testOperationLog", "测试操作日志");
            
            log.info("测试操作日志发送成功: userId={}, username={}, operation={}", 
                userId, username, operation);
            
            return "操作日志发送成功";
        } catch (Exception e) {
            log.error("测试操作日志发送失败", e);
            return "操作日志发送失败: " + e.getMessage();
        }
    }
    
    /**
     * 测试发送错误日志
     */
    @PostMapping("/log/error")
    public String testErrorLog(@RequestParam String userId, 
                               @RequestParam String username, 
                               @RequestParam String operation) {
        try {
            logService.sendErrorLog(userId, username, operation, 
                "TestController.testErrorLog", "测试错误日志", 150L);
            
            log.info("测试错误日志发送成功: userId={}, username={}, operation={}", 
                userId, username, operation);
            
            return "错误日志发送成功";
        } catch (Exception e) {
            log.error("测试错误日志发送失败", e);
            return "错误日志发送失败: " + e.getMessage();
        }
    }
    
    /**
     * 测试发送自定义日志
     */
    @PostMapping("/log/custom")
    public String testCustomLog(@RequestParam String userId, 
                                @RequestParam String username, 
                                @RequestParam String operation,
                                @RequestParam(defaultValue = "INFO") String level) {
        try {
            // 这里可以调用logService.sendLog()方法发送自定义日志
            log.info("测试自定义日志: userId={}, username={}, operation={}, level={}", 
                userId, username, operation, level);
            
            return "自定义日志发送成功";
        } catch (Exception e) {
            log.error("测试自定义日志发送失败", e);
            return "自定义日志发送失败: " + e.getMessage();
        }
    }
    
    /**
     * 健康检查
     */
    @GetMapping("/health")
    public String health() {
        return "TestController is running";
    }
}
