package com.aleks.linkrmix.admin.web.user;

import com.aleks.linkrmix.admin.web.common.ApiResponse;
import com.aleks.linkrmix.admin.web.dto.CreateUserRequest;
import com.aleks.linkrmix.admin.web.dto.LoginRequest;
import com.aleks.linkrmix.admin.web.dto.LoginResponse;
import com.aleks.linkrmix.admin.web.dto.UpdateUserRequest;
import com.aleks.linkrmix.admin.web.dto.UserDto;
import com.aleks.linkrmix.admin.web.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.validation.Valid;
import java.util.List;

@Slf4j
@Validated
@RestController
@RequestMapping(value = "/api/admin", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService userService;
    private final AdminUserRepository repository;

    @PostConstruct
    public void init() {
        repository.initSchema();
        if (repository.findAll().isEmpty()) {
            AdminUser admin = new AdminUser();
            admin.setUsername("admin");
            admin.setDisplayName("系统管理员");
            admin.setPasswordHash(BCrypt.hashpw("admin123", BCrypt.gensalt()));
            repository.insert(admin);
            log.info("初始化管理员账户完成");
        }
    }

    @GetMapping("/users")
    public ApiResponse<List<UserDto>> list() {
        List<UserDto> users = userService.getAllUsers();
        return ApiResponse.success("获取用户列表成功", users);
    }

    @GetMapping("/users/{id}")
    public ApiResponse<UserDto> getUserById(@PathVariable("id") Long id) {
        UserDto user = userService.getUserById(id);
        return ApiResponse.success("获取用户信息成功", user);
    }

    @PostMapping("/users")
    public ApiResponse<Long> create(@Valid @RequestBody CreateUserRequest request) {
        Long userId = userService.createUser(request);
        return ApiResponse.success("用户创建成功", userId);
    }

    @PutMapping("/users/{id}")
    public ApiResponse<Void> update(@PathVariable("id") Long id, @Valid @RequestBody UpdateUserRequest request) {
        userService.updateUser(id, request);
        return ApiResponse.success("用户更新成功", null);
    }

    @DeleteMapping("/users/{id}")
    public ApiResponse<Void> delete(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return ApiResponse.success("用户删除成功", null);
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ApiResponse.success("登录成功", response);
    }

    @GetMapping("/users/check-username")
    public ApiResponse<Boolean> checkUsername(@RequestParam("username") String username) {
        boolean exists = userService.isUsernameExists(username);
        return ApiResponse.success("检查用户名完成", exists);
    }
}



