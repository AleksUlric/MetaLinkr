package com.aleks.linkrmix.admin.web.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class UpdateUserRequest {
    @NotBlank(message = "显示名不能为空")
    @Size(max = 50, message = "显示名长度不能超过50个字符")
    private String displayName;
}
