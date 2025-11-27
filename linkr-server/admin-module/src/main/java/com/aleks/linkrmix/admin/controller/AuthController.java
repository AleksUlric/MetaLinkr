package com.aleks.linkrmix.admin.controller;

import com.aleks.linkrmix.common.response.ApiResponse;
import com.aleks.linkrmix.admin.model.dto.LoginDto;
import com.aleks.linkrmix.admin.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.util.Map;

@Validated
@RestController
@RequestMapping(value = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {
    
    @Resource
    private AuthService authService;
    
    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@Valid @RequestBody LoginDto loginDto,
                                                  HttpServletRequest request) {
        Map<String, Object> result = authService.login(loginDto);
        HttpSession session = request.getSession(true);
        session.setAttribute("adminUser", result.get("user"));
        result.put("sessionId", session.getId());
        return ApiResponse.success(result);
    }
}
