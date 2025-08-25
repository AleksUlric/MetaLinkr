package com.aleks.linkrmix.admin.model.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreateUserDto {
    @NotBlank(message = "用户名不能为空")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    private String password;
    
    @NotBlank(message = "显示名称不能为空")
    private String displayName;
}
