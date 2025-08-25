package com.aleks.linkrmix.admin.service.impl;

import com.aleks.linkrmix.admin.manager.impl.AdminUserManagerImpl;
import com.aleks.linkrmix.admin.model.dto.LoginDto;
import com.aleks.linkrmix.admin.service.AuthService;
import com.aleks.linkrmix.admin.common.util.PasswordUtil;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {
    
    @Resource
    private AdminUserManagerImpl adminUserManager;
    
    @Resource
    private PasswordUtil passwordUtil;
    
    @Override
    public Map<String, Object> login(LoginDto loginDto) {
        return adminUserManager.findByUsername(loginDto.getUsername())
                .filter(user -> passwordUtil.check(loginDto.getPassword(), user.getPasswordHash()))
                .map(user -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("token", "fake-" + user.getUsername());
                    result.put("user", user);
                    return result;
                })
                .orElseThrow(() -> new RuntimeException("用户名或密码错误"));
    }
}
