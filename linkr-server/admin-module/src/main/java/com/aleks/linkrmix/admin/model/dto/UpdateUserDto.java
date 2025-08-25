package com.aleks.linkrmix.admin.model.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class UpdateUserDto {
    @NotBlank(message = "显示名称不能为空")
    private String displayName;
}
