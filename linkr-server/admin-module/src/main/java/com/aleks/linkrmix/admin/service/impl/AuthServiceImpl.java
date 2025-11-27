package com.aleks.linkrmix.admin.service.impl;

import com.aleks.linkrmix.admin.common.exception.AuthenticationException;
import com.aleks.linkrmix.admin.manager.AdminUserManager;
import com.aleks.linkrmix.admin.model.dto.LoginDto;
import com.aleks.linkrmix.admin.service.AuthService;
import com.aleks.linkrmix.admin.common.util.PasswordUtil;
import com.aleks.linkrmix.common.exception.ExceptionUtils;
import com.aleks.linkrmix.common.response.ErrorCode;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {
    
    @Resource
    private AdminUserManager adminUserManager;
    
    @Resource
    private PasswordUtil passwordUtil;
    
    @Override
    public Map<String, Object> login(LoginDto loginDto) {
        // 使用ExceptionUtils进行参数校验
        ExceptionUtils.throwIfEmpty(loginDto.getUsername(), ErrorCode.PARAM_ERROR, "用户名不能为空");
        ExceptionUtils.throwIfEmpty(loginDto.getPassword(), ErrorCode.PARAM_ERROR, "密码不能为空");
        
        return adminUserManager.findByUsername(loginDto.getUsername())
                .filter(user -> passwordUtil.check(loginDto.getPassword(), user.getPasswordHash()))
                .map(user -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("user", user);
                    return result;
                })
                .orElseThrow(() -> new AuthenticationException("用户名或密码错误"));
    }
}
