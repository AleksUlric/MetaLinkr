package com.aleks.linkrmix.admin.web.service;

import com.aleks.linkrmix.admin.web.dto.CreateUserRequest;
import com.aleks.linkrmix.admin.web.dto.LoginRequest;
import com.aleks.linkrmix.admin.web.dto.LoginResponse;
import com.aleks.linkrmix.admin.web.dto.UpdateUserRequest;
import com.aleks.linkrmix.admin.web.dto.UserDto;

import java.util.List;

public interface AdminUserService {
    
    /**
     * 获取所有用户列表
     */
    List<UserDto> getAllUsers();
    
    /**
     * 根据ID获取用户
     */
    UserDto getUserById(Long id);
    
    /**
     * 创建用户
     */
    Long createUser(CreateUserRequest request);
    
    /**
     * 更新用户
     */
    void updateUser(Long id, UpdateUserRequest request);
    
    /**
     * 删除用户
     */
    void deleteUser(Long id);
    
    /**
     * 用户登录
     */
    LoginResponse login(LoginRequest request);
    
    /**
     * 检查用户名是否存在
     */
    boolean isUsernameExists(String username);
}
