package com.aleks.linkrmix.admin.service.provider;

import com.aleks.linkrmix.admin.api.AdminUserService;
import org.apache.dubbo.config.annotation.DubboService;

@DubboService(interfaceClass = AdminUserService.class, version = "1.0.0")
public class AdminUserServiceImpl implements AdminUserService {

	@Override
	public String getDisplayNameByUsername(String username) {
		throw new UnsupportedOperationException("Not implemented yet");
	}
}


