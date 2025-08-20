package com.aleks.linkrmix.dubbo.provider;

import com.aleks.linkrmix.admin.api.AdminUserService;
import org.apache.dubbo.config.annotation.DubboService;
import org.springframework.stereotype.Service;

@DubboService
@Service
public class AdminUserServiceImpl implements AdminUserService {

	public String getDisplayNameByUsername(String username) {
		// 模拟返回用户显示名
		return "用户: " + username + " (来自Dubbo服务)";
	}
}
