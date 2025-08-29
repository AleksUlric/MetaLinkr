package com.aleks.linkrmix.admin.service.impl;

import com.aleks.linkrmix.admin.common.exception.UserNotFoundException;
import com.aleks.linkrmix.admin.common.exception.UserAlreadyExistsException;
import com.aleks.linkrmix.admin.manager.AdminUserManager;
import com.aleks.linkrmix.admin.model.dto.CreateUserDto;
import com.aleks.linkrmix.admin.model.dto.UpdateUserDto;
import com.aleks.linkrmix.admin.model.entity.AdminUser;
import com.aleks.linkrmix.admin.service.AdminUserService;
import com.aleks.linkrmix.admin.common.util.PasswordUtil;
import com.aleks.linkrmix.common.exception.ExceptionUtils;
import com.aleks.linkrmix.common.response.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
@Transactional
public class AdminUserServiceImpl implements AdminUserService {
    
    @Resource
    private AdminUserManager adminUserManager;
    
    @Resource
    private PasswordUtil passwordUtil;
    
    @Override
    public List<AdminUser> findAllUsers() {
        return adminUserManager.findAll();
    }
    
    @Override
    public AdminUser findUserById(Long id) {
        return adminUserManager.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }
    
    @Override
    public Long createUser(CreateUserDto createUserDto) {
        // 使用ExceptionUtils进行参数校验
        ExceptionUtils.throwIfEmpty(createUserDto.getUsername(), ErrorCode.PARAM_ERROR, "用户名不能为空");
        ExceptionUtils.throwIfEmpty(createUserDto.getPassword(), ErrorCode.PARAM_ERROR, "密码不能为空");
        ExceptionUtils.throwIfEmpty(createUserDto.getDisplayName(), ErrorCode.PARAM_ERROR, "显示名称不能为空");
        
        // 检查用户名是否已存在
        ExceptionUtils.throwIfTrue(adminUserManager.existsByUsername(createUserDto.getUsername()), 
                ErrorCode.BUSINESS_LOGIC_ERROR, "用户名已存在: " + createUserDto.getUsername());
        
        AdminUser user = new AdminUser();
        user.setUsername(createUserDto.getUsername());
        user.setDisplayName(createUserDto.getDisplayName());
        user.setPasswordHash(passwordUtil.encrypt(createUserDto.getPassword()));
        
        return adminUserManager.insert(user);
    }
    
    @Override
    public void updateUser(Long id, UpdateUserDto updateUserDto) {
        // 使用ExceptionUtils进行参数校验
        ExceptionUtils.throwIfNull(id, ErrorCode.PARAM_ERROR, "用户ID不能为空");
        ExceptionUtils.throwIfEmpty(updateUserDto.getDisplayName(), ErrorCode.PARAM_ERROR, "显示名称不能为空");
        
        // 检查用户是否存在
        findUserById(id);
        
        AdminUser user = new AdminUser();
        user.setId(id);
        user.setDisplayName(updateUserDto.getDisplayName());
        
        adminUserManager.update(user);
    }
    
    @Override
    public void deleteUser(Long id) {
        // 使用ExceptionUtils进行参数校验
        ExceptionUtils.throwIfNull(id, ErrorCode.PARAM_ERROR, "用户ID不能为空");
        
        // 检查用户是否存在
        findUserById(id);
        adminUserManager.deleteById(id);
    }
    
    @Override
    public AdminUser findByUsername(String username) {
        ExceptionUtils.throwIfEmpty(username, ErrorCode.PARAM_ERROR, "用户名不能为空");
        
        return adminUserManager.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
    }
}
