package com.aleks.linkrmix.admin.service;

import com.aleks.linkrmix.admin.model.dto.CreateUserDto;
import com.aleks.linkrmix.admin.model.dto.UpdateUserDto;
import com.aleks.linkrmix.admin.model.entity.AdminUser;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface AdminUserService extends IService<AdminUser> {
    
    List<AdminUser> findAllUsers();
    
    AdminUser findUserById(Long id);
    
    Long createUser(CreateUserDto createUserDto);
    
    void updateUser(Long id, UpdateUserDto updateUserDto);
    
    void deleteUser(Long id);
    
    AdminUser findByUsername(String username);
}
