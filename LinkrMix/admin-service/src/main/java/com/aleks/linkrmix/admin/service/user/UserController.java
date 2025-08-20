package com.aleks.linkrmix.admin.service.user;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/{username}")
    public String getUserDisplayName(@PathVariable String username) {
        return "用户: " + username + " (来自Nacos注册的服务)";
    }

    @GetMapping("/health")
    public String health() {
        return "服务正常运行，已注册到Nacos";
    }
}
