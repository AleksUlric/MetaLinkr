package com.aleks.linkrmix.admin.service.impl;

import com.aleks.linkrmix.admin.manager.impl.AdminUserManagerImpl;
import com.aleks.linkrmix.admin.model.dto.CreateUserDto;
import com.aleks.linkrmix.admin.model.dto.UpdateUserDto;
import com.aleks.linkrmix.admin.model.entity.AdminUser;
import com.aleks.linkrmix.admin.service.AdminUserService;
import com.aleks.linkrmix.admin.common.util.PasswordUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.aleks.linkrmix.admin.mapper.AdminUserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
@Transactional
public class AdminUserServiceImpl extends ServiceImpl<AdminUserMapper, AdminUser> implements AdminUserService {
    
    @Resource
    private AdminUserManagerImpl adminUserManager;
    
    @Resource
    private PasswordUtil passwordUtil;
    
    @Override
    public List<AdminUser> findAllUsers() {
        return adminUserManager.findAll();
    }
    
    @Override
    public AdminUser findUserById(Long id) {
        return adminUserManager.findById(id)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
    }
    
    @Override
    public Long createUser(CreateUserDto createUserDto) {
        // 检查用户名是否已存在
        if (adminUserManager.existsByUsername(createUserDto.getUsername())) {
            throw new RuntimeException("用户名已存在");
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
                .orElseThrow(() -> new RuntimeException("用户不存在"));
    }
}
