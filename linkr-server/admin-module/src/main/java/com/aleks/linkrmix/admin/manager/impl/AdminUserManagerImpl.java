package com.aleks.linkrmix.admin.manager.impl;

import com.aleks.linkrmix.admin.mapper.AdminUserMapper;
import com.aleks.linkrmix.admin.model.entity.AdminUser;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;
import java.util.Optional;

/**
 * 管理员用户管理器
 * 直接使用MyBatis-Plus进行数据库操作
 */
@Component
public class AdminUserManagerImpl {
    
    @Resource
    private AdminUserMapper adminUserMapper;
    
    @Resource
    private JdbcTemplate jdbcTemplate;
    
    /**
     * 初始化数据库表结构
     */
    public void initSchema() {
        String sql = "CREATE TABLE IF NOT EXISTS admin_users (" +
                "id BIGINT AUTO_INCREMENT PRIMARY KEY," +
                "username VARCHAR(50) NOT NULL UNIQUE," +
                "display_name VARCHAR(100) NOT NULL," +
                "password_hash VARCHAR(255) NOT NULL," +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" +
                ")";
        jdbcTemplate.execute(sql);
    }
    
    /**
     * 查询所有用户
     */
    public List<AdminUser> findAll() {
        return adminUserMapper.selectList(null);
    }
    
    /**
     * 根据用户名查询用户
     */
    public Optional<AdminUser> findByUsername(String username) {
        QueryWrapper<AdminUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        AdminUser user = adminUserMapper.selectOne(queryWrapper);
        return Optional.ofNullable(user);
    }
    
    /**
     * 根据ID查询用户
     */
    public Optional<AdminUser> findById(Long id) {
        AdminUser user = adminUserMapper.selectById(id);
        return Optional.ofNullable(user);
    }
    
    /**
     * 插入新用户
     */
    public Long insert(AdminUser user) {
        adminUserMapper.insert(user);
        return user.getId();
    }
    
    /**
     * 更新用户信息
     */
    public void update(AdminUser user) {
        adminUserMapper.updateById(user);
    }
    
    /**
     * 根据ID删除用户
     */
    public void deleteById(Long id) {
        adminUserMapper.deleteById(id);
    }
    
    /**
     * 检查用户名是否存在
     */
    public boolean existsByUsername(String username) {
        QueryWrapper<AdminUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        return adminUserMapper.selectCount(queryWrapper) > 0;
    }
    
    /**
     * 根据条件查询用户列表
     */
    public List<AdminUser> findByCondition(String displayName) {
        QueryWrapper<AdminUser> queryWrapper = new QueryWrapper<>();
        if (displayName != null && !displayName.trim().isEmpty()) {
            queryWrapper.like("display_name", displayName);
        }
        return adminUserMapper.selectList(queryWrapper);
    }
    
    /**
     * 分页查询用户
     */
    public List<AdminUser> findWithPagination(int page, int size) {
        QueryWrapper<AdminUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("created_at");
        // 这里可以结合PageHelper进行分页
        return adminUserMapper.selectList(queryWrapper);
    }
}
