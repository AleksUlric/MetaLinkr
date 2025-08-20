package com.aleks.linkrmix.admin.service.provider;

import org.springframework.stereotype.Service;

@Service
public class AdminUserServiceImpl {

	public String getDisplayNameByUsername(String username) {
		// 模拟返回用户显示名
		return "用户: " + username + " (来自Nacos注册的服务)";
	}
}


