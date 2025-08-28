package com.aleks.linkrmix.admin.service.impl;

import com.aleks.linkrmix.admin.common.exception.UserNotFoundException;
import com.aleks.linkrmix.admin.common.exception.UserAlreadyExistsException;
import com.aleks.linkrmix.admin.manager.AdminUserManager;
import com.aleks.linkrmix.admin.model.dto.CreateUserDto;
import com.aleks.linkrmix.admin.model.dto.UpdateUserDto;
import com.aleks.linkrmix.admin.model.entity.AdminUser;
import com.aleks.linkrmix.admin.service.AdminUserService;
import com.aleks.linkrmix.admin.common.util.PasswordUtil;
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
        // 检查用户名是否已存在
        if (adminUserManager.existsByUsername(createUserDto.getUsername())) {
            throw new UserAlreadyExistsException(createUserDto.getUsername());
        }
        
        AdminUser user = new AdminUser();
        user.setUsername(createUserDto.getUsername());
        user.setDisplayName(createUserDto.getDisplayName());
        user.setPasswordHash(passwordUtil.encrypt(createUserDto.getPassword()));
        
        return adminUserManager.insert(user);
    }
    
    @Override
    public void updateUser(Long id, UpdateUserDto updateUserDto) {
        // 检查用户是否存在
        findUserById(id);
        
        AdminUser user = new AdminUser();
        user.setId(id);
        user.setDisplayName(updateUserDto.getDisplayName());
        
        adminUserManager.update(user);
    }
    
    @Override
    public void deleteUser(Long id) {
        // 检查用户是否存在
        findUserById(id);
        adminUserManager.deleteById(id);
    }
    
    @Override
    public AdminUser findByUsername(String username) {
        return adminUserManager.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
    }
}
