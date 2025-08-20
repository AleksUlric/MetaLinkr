package com.aleks.linkrmix.controller.auth;

import com.aleks.linkrmix.controller.auth.dto.LoginRequest;
import com.aleks.linkrmix.controller.auth.dto.SmsSendResponse;
import com.aleks.linkrmix.controller.auth.dto.TokenResponse;
import com.aleks.linkrmix.controller.common.ApiResponse;
import org.apache.dubbo.config.annotation.DubboReference;
import com.aleks.linkrmix.admin.api.AdminUserService;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.UUID;

@Validated
@RestController
@RequestMapping(value = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    @DubboReference
    private AdminUserService adminUserService;

    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        // TODO: 在此处调用真实的认证逻辑（数据库校验/第三方认证等）
        String fakeToken = UUID.randomUUID().toString().replaceAll("-", "");
        return ApiResponse.ok(new TokenResponse(fakeToken));
    }

    @GetMapping("/sms/send")
    public ApiResponse<SmsSendResponse> sendSms(@RequestParam("phone") @NotBlank String phone) {
        // TODO: 在此处调用短信网关服务
        String bizId = UUID.randomUUID().toString();
        return ApiResponse.ok(new SmsSendResponse(phone, bizId));
    }
}
