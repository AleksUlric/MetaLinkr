package com.aleks.linkrmix.admin.mapper;

import com.aleks.linkrmix.admin.model.entity.AdminUser;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 管理员用户Mapper接口
 * 继承BaseMapper获得通用CRUD方法
 */
@Mapper
public interface AdminUserMapper extends BaseMapper<AdminUser> {
    
    /**
     * 根据用户名查询用户（自定义方法）
     */
    AdminUser selectByUsername(@Param("username") String username);
    
    /**
     * 检查用户名是否存在（自定义方法）
     */
    int countByUsername(@Param("username") String username);
}
