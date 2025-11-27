-- MetaLinkr PWA 增强版数据库设计
-- 数据库名: linkr_pwa
-- 创建时间: 2025-01-10
-- 版本: 2.0

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `linkr_pwa` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `linkr_pwa`;

-- =============================================
-- 1. 用户相关表
-- =============================================

-- 用户表
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `password` varchar(255) NOT NULL COMMENT '密码(加密)',
  `nickname` varchar(50) NOT NULL COMMENT '昵称',
  `avatar` varchar(500) DEFAULT NULL COMMENT '头像URL',
  `age` int(3) DEFAULT NULL COMMENT '年龄',
  `gender` tinyint(1) DEFAULT NULL COMMENT '性别: 0-未知, 1-男, 2-女',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `location` varchar(100) DEFAULT NULL COMMENT '位置',
  `latitude` decimal(10,7) DEFAULT NULL COMMENT '纬度',
  `longitude` decimal(10,7) DEFAULT NULL COMMENT '经度',
  `bio` text COMMENT '个人简介',
  `interests` json DEFAULT NULL COMMENT '兴趣标签JSON数组',
  `level` int(3) DEFAULT 1 COMMENT '用户等级',
  `points` int(10) DEFAULT 0 COMMENT '积分',
  `experience` int(10) DEFAULT 0 COMMENT '经验值',
  `is_online` tinyint(1) DEFAULT 0 COMMENT '是否在线',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `last_active_time` datetime DEFAULT NULL COMMENT '最后活跃时间',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_nickname` (`nickname`),
  KEY `idx_location` (`location`),
  KEY `idx_level` (`level`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 用户第三方登录表
CREATE TABLE `user_oauth` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `platform` varchar(20) NOT NULL COMMENT '平台: qq, wechat, weibo',
  `openid` varchar(100) NOT NULL COMMENT '第三方平台用户ID',
  `unionid` varchar(100) DEFAULT NULL COMMENT '第三方平台UnionID',
  `access_token` varchar(500) DEFAULT NULL COMMENT '访问令牌',
  `refresh_token` varchar(500) DEFAULT NULL COMMENT '刷新令牌',
  `expires_at` datetime DEFAULT NULL COMMENT '令牌过期时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_platform_openid` (`platform`, `openid`),
  KEY `idx_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户第三方登录表';

-- =============================================
-- 2. 标签相关表
-- =============================================

-- 标签库表
CREATE TABLE `tags` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `name` varchar(50) NOT NULL COMMENT '标签名称',
  `type` tinyint(2) NOT NULL COMMENT '标签类型: 1-兴趣标签, 2-技能标签, 3-个性标签, 4-其他',
  `description` varchar(200) DEFAULT NULL COMMENT '标签描述',
  `icon` varchar(100) DEFAULT NULL COMMENT '标签图标',
  `color` varchar(20) DEFAULT NULL COMMENT '标签颜色',
  `usage_count` int(10) DEFAULT 0 COMMENT '使用次数',
  `is_hot` tinyint(1) DEFAULT 0 COMMENT '是否热门: 0-否, 1-是',
  `sort_order` int(5) DEFAULT 0 COMMENT '排序权重',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_usage_count` (`usage_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签库表';

-- 用户标签表
CREATE TABLE `user_tags` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `tag_name` varchar(50) NOT NULL COMMENT '标签名称',
  `tag_type` tinyint(2) NOT NULL COMMENT '标签类型: 1-兴趣标签, 2-技能标签, 3-个性标签, 4-其他',
  `weight` int(3) DEFAULT 1 COMMENT '标签权重（用于匹配算法）',
  `is_public` tinyint(1) DEFAULT 1 COMMENT '是否公开: 0-私密, 1-公开',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_tag` (`user_id`, `tag_name`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_tag_name` (`tag_name`),
  KEY `idx_tag_type` (`tag_type`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户标签表';

-- =============================================
-- 3. 动态相关表
-- =============================================

-- 动态表
CREATE TABLE `posts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '动态ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `content` text NOT NULL COMMENT '动态内容',
  `images` json DEFAULT NULL COMMENT '图片URL数组',
  `music` json DEFAULT NULL COMMENT '音乐信息JSON',
  `video` json DEFAULT NULL COMMENT '视频信息JSON',
  `location` varchar(100) DEFAULT NULL COMMENT '位置',
  `latitude` decimal(10,7) DEFAULT NULL COMMENT '纬度',
  `longitude` decimal(10,7) DEFAULT NULL COMMENT '经度',
  `tags` json DEFAULT NULL COMMENT '标签数组',
  `visibility` tinyint(1) DEFAULT 1 COMMENT '可见性: 0-私密, 1-公开, 2-仅粉丝',
  `like_count` int(10) DEFAULT 0 COMMENT '点赞数',
  `comment_count` int(10) DEFAULT 0 COMMENT '评论数',
  `share_count` int(10) DEFAULT 0 COMMENT '分享数',
  `view_count` int(10) DEFAULT 0 COMMENT '浏览数',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-删除, 1-正常, 2-审核中',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_location` (`location`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_like_count` (`like_count`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态表';

-- 动态点赞表
CREATE TABLE `post_likes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `post_id` bigint(20) NOT NULL COMMENT '动态ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_post_user` (`post_id`, `user_id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态点赞表';

-- 动态评论表
CREATE TABLE `post_comments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `post_id` bigint(20) NOT NULL COMMENT '动态ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `parent_id` bigint(20) DEFAULT NULL COMMENT '父评论ID',
  `content` text NOT NULL COMMENT '评论内容',
  `like_count` int(10) DEFAULT 0 COMMENT '点赞数',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-删除, 1-正常',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_id`) REFERENCES `post_comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态评论表';

-- =============================================
-- 4. 匹配相关表
-- =============================================

-- 匹配记录表
CREATE TABLE `matches` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '匹配ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `target_id` bigint(20) NOT NULL COMMENT '目标用户ID',
  `match_type` tinyint(2) NOT NULL COMMENT '匹配类型: 1-灵魂匹配, 2-语音匹配, 3-滑动匹配',
  `match_score` decimal(5,2) DEFAULT NULL COMMENT '匹配分数',
  `status` tinyint(2) DEFAULT 0 COMMENT '状态: 0-待匹配, 1-匹配成功, 2-匹配失败, 3-已过期',
  `match_time` datetime DEFAULT NULL COMMENT '匹配成功时间',
  `expire_time` datetime DEFAULT NULL COMMENT '匹配过期时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_target_id` (`target_id`),
  KEY `idx_match_type` (`match_type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`target_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='匹配记录表';

-- 匹配偏好表
CREATE TABLE `match_preferences` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `age_min` int(3) DEFAULT 18 COMMENT '最小年龄',
  `age_max` int(3) DEFAULT 50 COMMENT '最大年龄',
  `gender_preference` tinyint(1) DEFAULT 0 COMMENT '性别偏好: 0-不限, 1-男, 2-女',
  `location_preference` varchar(100) DEFAULT NULL COMMENT '位置偏好',
  `distance_max` int(5) DEFAULT 50 COMMENT '最大距离(公里)',
  `tag_preferences` json DEFAULT NULL COMMENT '标签偏好JSON数组',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='匹配偏好表';

-- =============================================
-- 5. 关注相关表
-- =============================================

-- 用户关注表
CREATE TABLE `user_follows` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `follower_id` bigint(20) NOT NULL COMMENT '关注者ID',
  `following_id` bigint(20) NOT NULL COMMENT '被关注者ID',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-取消关注, 1-关注中',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_follower_following` (`follower_id`, `following_id`),
  KEY `idx_follower_id` (`follower_id`),
  KEY `idx_following_id` (`following_id`),
  KEY `idx_status` (`status`),
  FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`following_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户关注表';

-- =============================================
-- 6. 聊天相关表
-- =============================================

-- 聊天房间表
CREATE TABLE `chat_rooms` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '房间ID',
  `type` tinyint(1) DEFAULT 1 COMMENT '房间类型: 1-私聊, 2-群聊',
  `name` varchar(100) DEFAULT NULL COMMENT '房间名称',
  `avatar` varchar(500) DEFAULT NULL COMMENT '房间头像',
  `description` text COMMENT '房间描述',
  `creator_id` bigint(20) DEFAULT NULL COMMENT '创建者ID',
  `member_count` int(5) DEFAULT 0 COMMENT '成员数量',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_status` (`status`),
  FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='聊天房间表';

-- 聊天消息表
CREATE TABLE `chat_messages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `room_id` bigint(20) NOT NULL COMMENT '房间ID',
  `sender_id` bigint(20) NOT NULL COMMENT '发送者ID',
  `content` text NOT NULL COMMENT '消息内容',
  `type` enum('text','image','voice','video','system') DEFAULT 'text' COMMENT '消息类型',
  `file_url` varchar(500) DEFAULT NULL COMMENT '文件URL',
  `file_size` bigint DEFAULT NULL COMMENT '文件大小',
  `duration` int DEFAULT NULL COMMENT '语音/视频时长(秒)',
  `is_read` tinyint(1) DEFAULT 0 COMMENT '是否已读',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_room_id` (`room_id`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='聊天消息表';

-- =============================================
-- 7. 初始化数据
-- =============================================

-- 插入默认标签
INSERT INTO `tags` (`name`, `type`, `description`, `icon`, `color`, `is_hot`, `sort_order`) VALUES
('音乐', 1, '喜欢各种类型的音乐', '🎵', '#ff6b6b', 1, 1),
('电影', 1, '热爱电影艺术', '🎬', '#4ecdc4', 1, 2),
('读书', 1, '喜欢阅读各种书籍', '📚', '#45b7d1', 1, 3),
('运动', 1, '热爱体育运动', '⚽', '#96ceb4', 1, 4),
('旅行', 1, '喜欢到处旅行', '✈️', '#feca57', 1, 5),
('摄影', 1, '热爱摄影艺术', '📷', '#ff9ff3', 1, 6),
('美食', 1, '喜欢品尝美食', '🍕', '#54a0ff', 1, 7),
('游戏', 1, '喜欢各种游戏', '🎮', '#5f27cd', 1, 8),
('编程', 2, '软件开发技能', '💻', '#00d2d3', 0, 9),
('设计', 2, '设计相关技能', '🎨', '#ff9f43', 0, 10),
('绘画', 2, '绘画艺术技能', '🖌️', '#ee5a24', 0, 11),
('舞蹈', 2, '舞蹈表演技能', '💃', '#0984e3', 0, 12),
('健身', 1, '热爱健身运动', '💪', '#6c5ce7', 0, 13),
('瑜伽', 1, '喜欢瑜伽练习', '🧘', '#a29bfe', 0, 14),
('咖啡', 1, '喜欢咖啡文化', '☕', '#fd79a8', 0, 15),
('茶艺', 1, '喜欢茶艺文化', '🍵', '#fdcb6e', 0, 16),
('宠物', 1, '喜欢小动物', '🐕', '#e17055', 0, 17),
('园艺', 1, '喜欢园艺种植', '🌱', '#00b894', 0, 18),
('手工', 2, '手工制作技能', '✂️', '#e84393', 0, 19),
('收藏', 1, '喜欢收藏物品', '🏺', '#2d3436', 0, 20);

SET FOREIGN_KEY_CHECKS = 1;
