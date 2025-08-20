package com.aleks.linkrmix.admin.web.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class UserDto {
    private Long id;
    
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度必须在3-20个字符之间")
    private String username;
    
    @NotBlank(message = "显示名不能为空")
    @Size(max = 50, message = "显示名长度不能超过50个字符")
    private String displayName;
    
    private String passwordHash;
    private String createTime;
    private String updateTime;
}
