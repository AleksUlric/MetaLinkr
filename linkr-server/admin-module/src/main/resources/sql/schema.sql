-- 创建admin_users表
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `display_name` varchar(100) DEFAULT NULL COMMENT '显示名称',
  `password_hash` varchar(255) NOT NULL COMMENT '密码哈希',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员用户表';

-- 插入默认管理员用户（密码：admin123）
INSERT INTO `admin_users` (`username`, `display_name`, `password_hash`) VALUES 
('admin', '系统管理员', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa');
