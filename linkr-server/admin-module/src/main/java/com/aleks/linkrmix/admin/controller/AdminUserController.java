package com.aleks.linkrmix.admin.controller;

import com.aleks.linkrmix.admin.common.response.ApiResponse;
import com.aleks.linkrmix.admin.model.dto.CreateUserDto;
import com.aleks.linkrmix.admin.model.dto.UpdateUserDto;
import com.aleks.linkrmix.admin.model.entity.AdminUser;
import com.aleks.linkrmix.admin.service.AdminUserService;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

@Validated
@RestController
@RequestMapping(value = "/api/admin", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdminUserController {
    
    @Resource
    private AdminUserService adminUserService;
    
    @PostConstruct
    public void init() {
        // 初始化默认管理员账户
        if (adminUserService.findAllUsers().isEmpty()) {
            CreateUserDto adminDto = new CreateUserDto();
            adminDto.setUsername("admin");
            adminDto.setPassword("admin123");
            adminDto.setDisplayName("系统管理员");
            adminUserService.createUser(adminDto);
        }
    }
    
    @GetMapping("/users")
    public ApiResponse<List<AdminUser>> listUsers() {
        return ApiResponse.success(adminUserService.findAllUsers());
    }
    
    @GetMapping("/users/{id}")
    public ApiResponse<AdminUser> getUserById(@PathVariable("id") Long id) {
        return ApiResponse.success(adminUserService.findUserById(id));
    }
    
    @PostMapping("/users")
    public ApiResponse<Long> createUser(@Valid @RequestBody CreateUserDto createUserDto) {
        Long userId = adminUserService.createUser(createUserDto);
        return ApiResponse.success(userId);
    }
    
    @PutMapping("/users/{id}")
    public ApiResponse<Void> updateUser(@PathVariable("id") Long id, @Valid @RequestBody UpdateUserDto updateUserDto) {
        adminUserService.updateUser(id, updateUserDto);
        return ApiResponse.success();
    }
    
    @DeleteMapping("/users/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable("id") Long id) {
        adminUserService.deleteUser(id);
        return ApiResponse.success();
    }
}
