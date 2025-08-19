package com.aleks.linkrmix.admin.service.auth;

import com.aleks.linkrmix.admin.service.common.ApiResponse;
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

    public static class LoginRequest {
        @NotBlank
        private String account;
        @NotBlank
        private String password;

        public String getAccount() { return account; }
        public void setAccount(String account) { this.account = account; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class TokenResponse {
        private String token;

        public TokenResponse() {}
        public TokenResponse(String token) { this.token = token; }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
    }

    public static class SmsSendResponse {
        private String phone;
        private String bizId;

        public SmsSendResponse() {}
        public SmsSendResponse(String phone, String bizId) {
            this.phone = phone;
            this.bizId = bizId;
        }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getBizId() { return bizId; }
        public void setBizId(String bizId) { this.bizId = bizId; }
    }
}
