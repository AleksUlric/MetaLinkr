package com.aleks.linkrmix.auth;

import com.aleks.linkrmix.auth.dto.LoginRequest;
import com.aleks.linkrmix.auth.dto.SmsSendResponse;
import com.aleks.linkrmix.auth.dto.TokenResponse;
import com.aleks.linkrmix.common.ApiResponse;
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


