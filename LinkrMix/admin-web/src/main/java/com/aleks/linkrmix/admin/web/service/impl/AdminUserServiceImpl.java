package com.aleks.linkrmix.admin.web.service.impl;

import com.aleks.linkrmix.admin.web.common.BusinessException;
import com.aleks.linkrmix.admin.web.dto.CreateUserRequest;
import com.aleks.linkrmix.admin.web.dto.LoginRequest;
import com.aleks.linkrmix.admin.web.dto.LoginResponse;
import com.aleks.linkrmix.admin.web.dto.UpdateUserRequest;
import com.aleks.linkrmix.admin.web.dto.UserDto;
import com.aleks.linkrmix.admin.web.service.AdminUserService;
import com.aleks.linkrmix.admin.web.user.AdminUser;
import com.aleks.linkrmix.admin.web.user.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final AdminUserRepository userRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public List<UserDto> getAllUsers() {
        List<AdminUser> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long id) {
        Optional<AdminUser> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            throw new BusinessException(404, "用户不存在");
        }
        return convertToDto(userOpt.get());
    }

    @Override
    @Transactional
    public Long createUser(CreateUserRequest request) {
        // 业务验证
        if (isUsernameExists(request.getUsername())) {
            throw new BusinessException(400, "用户名已存在");
        }
        
        // 密码强度验证
        validatePassword(request.getPassword());
        
        AdminUser user = new AdminUser();
        user.setUsername(request.getUsername());
        user.setDisplayName(request.getDisplayName());
        user.setPasswordHash(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));
        
        return userRepository.insert(user);
    }

    @Override
    @Transactional
    public void updateUser(Long id, UpdateUserRequest request) {
        Optional<AdminUser> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            throw new BusinessException(404, "用户不存在");
        }
        
        AdminUser user = userOpt.get();
        user.setDisplayName(request.getDisplayName());
        
        userRepository.update(user);
        log.info("用户信息已更新: {}", user.getUsername());
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        Optional<AdminUser> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            throw new BusinessException(404, "用户不存在");
        }
        
        // 防止删除管理员账户
        AdminUser user = userOpt.get();
        if ("admin".equals(user.getUsername())) {
            throw new BusinessException(400, "不能删除管理员账户");
        }
        
        userRepository.deleteById(id);
        log.info("用户已删除: {}", user.getUsername());
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Optional<AdminUser> userOpt = userRepository.findByUsername(request.getUsername());
        if (!userOpt.isPresent()) {
            throw new BusinessException(401, "用户名或密码错误");
        }
        
        AdminUser user = userOpt.get();
        if (!BCrypt.checkpw(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(401, "用户名或密码错误");
        }
        
        LoginResponse response = new LoginResponse();
        response.setToken("fake-" + user.getUsername() + "-" + System.currentTimeMillis());
        response.setUsername(user.getUsername());
        response.setDisplayName(user.getDisplayName());
        response.setUserId(user.getId());
        
        log.info("用户登录成功: {}", user.getUsername());
        return response;
    }

    @Override
    public boolean isUsernameExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    private UserDto convertToDto(AdminUser user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setDisplayName(user.getDisplayName());
        dto.setCreateTime(LocalDateTime.now().format(FORMATTER)); // 这里应该从数据库获取
        dto.setUpdateTime(LocalDateTime.now().format(FORMATTER)); // 这里应该从数据库获取
        return dto;
    }

    private void validatePassword(String password) {
        if (password.length() < 6) {
            throw new BusinessException(400, "密码长度不能少于6位");
        }
        // 可以添加更多密码强度验证规则
    }
}
