package com.aleks.linkrmix.admin.web.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String username;
    private String displayName;
    private Long userId;
}
