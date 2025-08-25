package com.aleks.linkrmix.admin.service;

import com.aleks.linkrmix.admin.model.dto.LoginDto;

import java.util.Map;

public interface AuthService {
    
    Map<String, Object> login(LoginDto loginDto);
}
