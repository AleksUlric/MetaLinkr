package com.aleks.linkrmix.admin.controller;

import com.aleks.linkrmix.common.response.ApiResponse;
import com.aleks.linkrmix.admin.model.dto.CreateUserDto;
import com.aleks.linkrmix.admin.model.dto.UpdateUserDto;
import com.aleks.linkrmix.admin.model.entity.AdminUser;
import com.aleks.linkrmix.admin.model.vo.UserVo;
import com.aleks.linkrmix.admin.service.AdminUserService;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@Validated
@RestController
@RequestMapping(value = "/api/admin", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdminUserController {
    
    @Resource
    private AdminUserService adminUserService;
    
    // 移除@PostConstruct，改为在DatabaseInitializer中处理
    // 避免在数据库初始化完成前调用
    
    @GetMapping("/users")
    public ApiResponse<List<UserVo>> listUsers() {
        List<UserVo> userVos = adminUserService.findAllUsers().stream()
                .map(this::convertToVo)
                .collect(Collectors.toList());
        return ApiResponse.success(userVos);
    }
    
    @GetMapping("/users/{id}")
    public ApiResponse<UserVo> getUserById(@PathVariable("id") Long id) {
        AdminUser user = adminUserService.findUserById(id);
        return ApiResponse.success(convertToVo(user));
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
    
    /**
     * 将 AdminUser 实体转换为 UserVo
     */
    private UserVo convertToVo(AdminUser user) {
        if (user == null) {
            return null;
        }
        UserVo vo = new UserVo();
        vo.setId(user.getId());
        vo.setUsername(user.getUsername());
        vo.setDisplayName(user.getDisplayName());
        vo.setCreatedAt(user.getCreatedAt());
        vo.setUpdatedAt(user.getUpdatedAt());
        return vo;
    }
}
