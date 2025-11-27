-- MetaLinkr PWA 数据库设计
-- 数据库名: linkr_pwa
-- 创建时间: 2025-01-10
-- 版本: 1.0

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
  `platform` varchar(20) NOT NULL COMMENT '平台: wechat, qq, weibo',
  `openid` varchar(100) NOT NULL COMMENT '第三方平台用户ID',
  `unionid` varchar(100) DEFAULT NULL COMMENT '第三方平台统一ID',
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

-- 用户设置表
CREATE TABLE `user_settings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `privacy_settings` json DEFAULT NULL COMMENT '隐私设置JSON',
  `notification_settings` json DEFAULT NULL COMMENT '通知设置JSON',
  `match_settings` json DEFAULT NULL COMMENT '匹配设置JSON',
  `theme_settings` json DEFAULT NULL COMMENT '主题设置JSON',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户设置表';

-- 用户关系表
CREATE TABLE `user_relations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `target_id` bigint(20) NOT NULL COMMENT '目标用户ID',
  `relation_type` tinyint(2) NOT NULL COMMENT '关系类型: 1-关注, 2-粉丝, 3-好友, 4-拉黑',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-取消, 1-有效',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target_type` (`user_id`, `target_id`, `relation_type`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_target_id` (`target_id`),
  KEY `idx_relation_type` (`relation_type`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`target_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户关系表';

-- =============================================
-- 2. 动态相关表
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

-- 动态互动表
CREATE TABLE `post_interactions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `post_id` bigint(20) NOT NULL COMMENT '动态ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `interaction_type` tinyint(2) NOT NULL COMMENT '互动类型: 1-点赞, 2-收藏, 3-分享',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_post_user_type` (`post_id`, `user_id`, `interaction_type`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='动态互动表';

-- 评论表
CREATE TABLE `comments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `post_id` bigint(20) NOT NULL COMMENT '动态ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `parent_id` bigint(20) DEFAULT NULL COMMENT '父评论ID',
  `content` text NOT NULL COMMENT '评论内容',
  `like_count` int(10) DEFAULT 0 COMMENT '点赞数',
  `reply_count` int(10) DEFAULT 0 COMMENT '回复数',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-删除, 1-正常',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- =============================================
-- 3. 匹配相关表
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
  `age_max` int(3) DEFAULT 35 COMMENT '最大年龄',
  `gender_preference` tinyint(1) DEFAULT 0 COMMENT '性别偏好: 0-不限, 1-男, 2-女',
  `distance_range` int(5) DEFAULT 50 COMMENT '距离范围(km)',
  `interests` json DEFAULT NULL COMMENT '兴趣偏好JSON数组',
  `is_active` tinyint(1) DEFAULT 1 COMMENT '是否启用',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='匹配偏好表';

-- =============================================
-- 4. 聊天相关表
-- =============================================

-- 聊天会话表
CREATE TABLE `chat_sessions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  `session_type` tinyint(2) NOT NULL COMMENT '会话类型: 1-私聊, 2-群聊',
  `session_name` varchar(100) DEFAULT NULL COMMENT '会话名称',
  `session_avatar` varchar(500) DEFAULT NULL COMMENT '会话头像',
  `creator_id` bigint(20) DEFAULT NULL COMMENT '创建者ID',
  `last_message_id` bigint(20) DEFAULT NULL COMMENT '最后一条消息ID',
  `last_message_time` datetime DEFAULT NULL COMMENT '最后消息时间',
  `member_count` int(5) DEFAULT 0 COMMENT '成员数量',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-解散, 1-正常',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_session_type` (`session_type`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_last_message_time` (`last_message_time`),
  KEY `idx_status` (`status`),
  FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='聊天会话表';

-- 会话成员表
CREATE TABLE `chat_members` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `session_id` bigint(20) NOT NULL COMMENT '会话ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `role` tinyint(2) DEFAULT 1 COMMENT '角色: 1-普通成员, 2-管理员, 3-群主',
  `join_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  `last_read_message_id` bigint(20) DEFAULT NULL COMMENT '最后已读消息ID',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-退出, 1-正常',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_session_user` (`session_id`, `user_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_user_id` (`user_id`),
  FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话成员表';

-- 消息表
CREATE TABLE `messages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `session_id` bigint(20) NOT NULL COMMENT '会话ID',
  `sender_id` bigint(20) NOT NULL COMMENT '发送者ID',
  `message_type` tinyint(2) NOT NULL COMMENT '消息类型: 1-文本, 2-图片, 3-语音, 4-视频, 5-文件, 6-表情',
  `content` text COMMENT '消息内容',
  `extra_data` json DEFAULT NULL COMMENT '额外数据JSON',
  `reply_to_id` bigint(20) DEFAULT NULL COMMENT '回复的消息ID',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-删除, 1-正常',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_message_type` (`message_type`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reply_to_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息表';

-- 消息状态表
CREATE TABLE `message_status` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `message_id` bigint(20) NOT NULL COMMENT '消息ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `status` tinyint(2) DEFAULT 0 COMMENT '状态: 0-未读, 1-已读, 2-已发送',
  `read_time` datetime DEFAULT NULL COMMENT '已读时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_message_user` (`message_id`, `user_id`),
  KEY `idx_message_id` (`message_id`),
  KEY `idx_user_id` (`user_id`),
  FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息状态表';

-- =============================================
-- 5. 直播相关表
-- =============================================

-- 直播间表
CREATE TABLE `live_rooms` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '直播间ID',
  `host_id` bigint(20) NOT NULL COMMENT '主播ID',
  `title` varchar(200) NOT NULL COMMENT '直播间标题',
  `description` text COMMENT '直播间描述',
  `cover_image` varchar(500) DEFAULT NULL COMMENT '封面图片',
  `stream_key` varchar(100) DEFAULT NULL COMMENT '推流密钥',
  `stream_url` varchar(500) DEFAULT NULL COMMENT '推流地址',
  `play_url` varchar(500) DEFAULT NULL COMMENT '播放地址',
  `category` varchar(50) DEFAULT NULL COMMENT '分类',
  `tags` json DEFAULT NULL COMMENT '标签数组',
  `status` tinyint(2) DEFAULT 0 COMMENT '状态: 0-未开播, 1-直播中, 2-已结束',
  `viewer_count` int(10) DEFAULT 0 COMMENT '观众数量',
  `like_count` int(10) DEFAULT 0 COMMENT '点赞数',
  `gift_count` int(10) DEFAULT 0 COMMENT '礼物数',
  `start_time` datetime DEFAULT NULL COMMENT '开播时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_host_id` (`host_id`),
  KEY `idx_status` (`status`),
  KEY `idx_start_time` (`start_time`),
  KEY `idx_viewer_count` (`viewer_count`),
  FOREIGN KEY (`host_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='直播间表';

-- 直播观众表
CREATE TABLE `live_viewers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `room_id` bigint(20) NOT NULL COMMENT '直播间ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `join_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '进入时间',
  `leave_time` datetime DEFAULT NULL COMMENT '离开时间',
  `watch_duration` int(10) DEFAULT 0 COMMENT '观看时长(秒)',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-已离开, 1-观看中',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_room_user` (`room_id`, `user_id`),
  KEY `idx_room_id` (`room_id`),
  KEY `idx_user_id` (`user_id`),
  FOREIGN KEY (`room_id`) REFERENCES `live_rooms` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='直播观众表';

-- 直播消息表
CREATE TABLE `live_messages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `room_id` bigint(20) NOT NULL COMMENT '直播间ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `message_type` tinyint(2) NOT NULL COMMENT '消息类型: 1-弹幕, 2-礼物, 3-系统消息',
  `content` text COMMENT '消息内容',
  `gift_id` bigint(20) DEFAULT NULL COMMENT '礼物ID',
  `gift_count` int(5) DEFAULT 0 COMMENT '礼物数量',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_room_id` (`room_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_message_type` (`message_type`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`room_id`) REFERENCES `live_rooms` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='直播消息表';

-- =============================================
-- 6. 游戏相关表
-- =============================================

-- 游戏房间表
CREATE TABLE `game_rooms` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '房间ID',
  `creator_id` bigint(20) NOT NULL COMMENT '创建者ID',
  `game_type` varchar(50) NOT NULL COMMENT '游戏类型',
  `room_name` varchar(100) NOT NULL COMMENT '房间名称',
  `room_code` varchar(20) DEFAULT NULL COMMENT '房间号',
  `description` text COMMENT '房间描述',
  `max_players` int(3) DEFAULT 10 COMMENT '最大玩家数',
  `current_players` int(3) DEFAULT 0 COMMENT '当前玩家数',
  `password` varchar(50) DEFAULT NULL COMMENT '房间密码',
  `voice_enabled` tinyint(1) DEFAULT 1 COMMENT '是否开启语音',
  `status` tinyint(2) DEFAULT 0 COMMENT '状态: 0-等待中, 1-游戏中, 2-已结束',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_room_code` (`room_code`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_game_type` (`game_type`),
  KEY `idx_status` (`status`),
  FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='游戏房间表';

-- 游戏房间成员表
CREATE TABLE `game_room_members` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `room_id` bigint(20) NOT NULL COMMENT '房间ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `role` tinyint(2) DEFAULT 1 COMMENT '角色: 1-普通玩家, 2-房主',
  `game_nickname` varchar(50) DEFAULT NULL COMMENT '游戏昵称',
  `join_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  `leave_time` datetime DEFAULT NULL COMMENT '离开时间',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-已离开, 1-在房间中',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_room_user` (`room_id`, `user_id`),
  KEY `idx_room_id` (`room_id`),
  KEY `idx_user_id` (`user_id`),
  FOREIGN KEY (`room_id`) REFERENCES `game_rooms` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='游戏房间成员表';

-- =============================================
-- 7. 商城相关表
-- =============================================

-- 商品表
CREATE TABLE `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `name` varchar(200) NOT NULL COMMENT '商品名称',
  `description` text COMMENT '商品描述',
  `category` varchar(50) NOT NULL COMMENT '商品分类',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `original_price` decimal(10,2) DEFAULT NULL COMMENT '原价',
  `images` json DEFAULT NULL COMMENT '商品图片数组',
  `stock` int(10) DEFAULT 0 COMMENT '库存数量',
  `sales` int(10) DEFAULT 0 COMMENT '销量',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
  `sort_order` int(5) DEFAULT 0 COMMENT '排序',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`),
  KEY `idx_sort_order` (`sort_order`),
  KEY `idx_sales` (`sales`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- 购物车表
CREATE TABLE `shopping_cart` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `product_id` bigint(20) NOT NULL COMMENT '商品ID',
  `quantity` int(5) NOT NULL DEFAULT 1 COMMENT '数量',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_product` (`user_id`, `product_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_product_id` (`product_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

-- 订单表
CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` varchar(50) NOT NULL COMMENT '订单号',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `total_amount` decimal(10,2) NOT NULL COMMENT '订单总金额',
  `discount_amount` decimal(10,2) DEFAULT 0 COMMENT '优惠金额',
  `pay_amount` decimal(10,2) NOT NULL COMMENT '实付金额',
  `payment_method` varchar(20) DEFAULT NULL COMMENT '支付方式',
  `payment_status` tinyint(2) DEFAULT 0 COMMENT '支付状态: 0-未支付, 1-已支付, 2-已退款',
  `order_status` tinyint(2) DEFAULT 0 COMMENT '订单状态: 0-待支付, 1-已支付, 2-已发货, 3-已完成, 4-已取消',
  `shipping_address` json DEFAULT NULL COMMENT '收货地址JSON',
  `remark` text COMMENT '备注',
  `pay_time` datetime DEFAULT NULL COMMENT '支付时间',
  `ship_time` datetime DEFAULT NULL COMMENT '发货时间',
  `complete_time` datetime DEFAULT NULL COMMENT '完成时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_order_status` (`order_status`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 订单详情表
CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `order_id` bigint(20) NOT NULL COMMENT '订单ID',
  `product_id` bigint(20) NOT NULL COMMENT '商品ID',
  `product_name` varchar(200) NOT NULL COMMENT '商品名称',
  `product_image` varchar(500) DEFAULT NULL COMMENT '商品图片',
  `price` decimal(10,2) NOT NULL COMMENT '单价',
  `quantity` int(5) NOT NULL COMMENT '数量',
  `total_amount` decimal(10,2) NOT NULL COMMENT '小计',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单详情表';

-- =============================================
-- 8. 礼物相关表
-- =============================================

-- 礼物表
CREATE TABLE `gifts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '礼物ID',
  `name` varchar(100) NOT NULL COMMENT '礼物名称',
  `description` text COMMENT '礼物描述',
  `image` varchar(500) DEFAULT NULL COMMENT '礼物图片',
  `animation` varchar(500) DEFAULT NULL COMMENT '动画效果',
  `price` int(10) NOT NULL COMMENT '价格(积分)',
  `category` varchar(50) DEFAULT NULL COMMENT '分类',
  `rarity` tinyint(2) DEFAULT 1 COMMENT '稀有度: 1-普通, 2-稀有, 3-史诗, 4-传说',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
  `sort_order` int(5) DEFAULT 0 COMMENT '排序',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='礼物表';

-- 礼物记录表
CREATE TABLE `gift_records` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `sender_id` bigint(20) NOT NULL COMMENT '发送者ID',
  `receiver_id` bigint(20) NOT NULL COMMENT '接收者ID',
  `gift_id` bigint(20) NOT NULL COMMENT '礼物ID',
  `quantity` int(5) DEFAULT 1 COMMENT '数量',
  `total_price` int(10) NOT NULL COMMENT '总价格(积分)',
  `context_type` tinyint(2) DEFAULT 1 COMMENT '场景类型: 1-私聊, 2-群聊, 3-直播间',
  `context_id` bigint(20) DEFAULT NULL COMMENT '场景ID',
  `message` varchar(200) DEFAULT NULL COMMENT '留言',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_receiver_id` (`receiver_id`),
  KEY `idx_gift_id` (`gift_id`),
  KEY `idx_context` (`context_type`, `context_id`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`gift_id`) REFERENCES `gifts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='礼物记录表';

-- =============================================
-- 9. 积分系统表
-- =============================================

-- 积分记录表
CREATE TABLE `point_records` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `type` tinyint(2) NOT NULL COMMENT '类型: 1-获得, 2-消费',
  `source` varchar(50) NOT NULL COMMENT '来源: signin, post, like, comment, match, invite, gift, shop',
  `amount` int(10) NOT NULL COMMENT '积分数量',
  `balance` int(10) NOT NULL COMMENT '余额',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `related_id` bigint(20) DEFAULT NULL COMMENT '关联ID',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_source` (`source`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分记录表';

-- 任务表
CREATE TABLE `tasks` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `name` varchar(100) NOT NULL COMMENT '任务名称',
  `description` text COMMENT '任务描述',
  `type` varchar(50) NOT NULL COMMENT '任务类型',
  `target` int(10) NOT NULL COMMENT '目标值',
  `reward_points` int(10) NOT NULL COMMENT '奖励积分',
  `reward_items` json DEFAULT NULL COMMENT '奖励物品JSON',
  `conditions` json DEFAULT NULL COMMENT '完成条件JSON',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-禁用, 1-启用',
  `sort_order` int(5) DEFAULT 0 COMMENT '排序',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务表';

-- 用户任务表
CREATE TABLE `user_tasks` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `task_id` bigint(20) NOT NULL COMMENT '任务ID',
  `progress` int(10) DEFAULT 0 COMMENT '进度',
  `status` tinyint(2) DEFAULT 0 COMMENT '状态: 0-进行中, 1-已完成, 2-已领取奖励',
  `completed_at` datetime DEFAULT NULL COMMENT '完成时间',
  `claimed_at` datetime DEFAULT NULL COMMENT '领取时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_task` (`user_id`, `task_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_task_id` (`task_id`),
  KEY `idx_status` (`status`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户任务表';

-- =============================================
-- 10. 通知相关表
-- =============================================

-- 通知表
CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `type` varchar(50) NOT NULL COMMENT '通知类型',
  `title` varchar(200) NOT NULL COMMENT '标题',
  `content` text COMMENT '内容',
  `data` json DEFAULT NULL COMMENT '额外数据JSON',
  `is_read` tinyint(1) DEFAULT 0 COMMENT '是否已读',
  `read_time` datetime DEFAULT NULL COMMENT '已读时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';

-- =============================================
-- 11. 系统配置表
-- =============================================

-- 系统配置表
CREATE TABLE `system_configs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `config_key` varchar(100) NOT NULL COMMENT '配置键',
  `config_value` text COMMENT '配置值',
  `config_type` varchar(20) DEFAULT 'string' COMMENT '配置类型',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `is_system` tinyint(1) DEFAULT 0 COMMENT '是否系统配置',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- =============================================
-- 12. 文件上传表
-- =============================================

-- 文件表
CREATE TABLE `files` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `user_id` bigint(20) DEFAULT NULL COMMENT '上传用户ID',
  `original_name` varchar(255) NOT NULL COMMENT '原始文件名',
  `file_name` varchar(255) NOT NULL COMMENT '存储文件名',
  `file_path` varchar(500) NOT NULL COMMENT '文件路径',
  `file_url` varchar(500) NOT NULL COMMENT '文件URL',
  `file_size` bigint(20) NOT NULL COMMENT '文件大小(字节)',
  `file_type` varchar(50) NOT NULL COMMENT '文件类型',
  `mime_type` varchar(100) DEFAULT NULL COMMENT 'MIME类型',
  `width` int(5) DEFAULT NULL COMMENT '图片宽度',
  `height` int(5) DEFAULT NULL COMMENT '图片高度',
  `duration` int(10) DEFAULT NULL COMMENT '视频/音频时长(秒)',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态: 0-删除, 1-正常',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_file_type` (`file_type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文件表';

-- =============================================
-- 初始化数据
-- =============================================

-- 插入系统配置
INSERT INTO `system_configs` (`config_key`, `config_value`, `config_type`, `description`, `is_system`) VALUES
('app_name', 'MetaLinkr PWA', 'string', '应用名称', 1),
('app_version', '1.0.0', 'string', '应用版本', 1),
('max_upload_size', '10485760', 'number', '最大上传文件大小(字节)', 1),
('allowed_file_types', '["jpg", "jpeg", "png", "gif", "mp4", "mp3", "wav"]', 'json', '允许的文件类型', 1),
('default_match_distance', '50', 'number', '默认匹配距离(km)', 1),
('daily_match_limit', '10', 'number', '每日匹配次数限制', 1),
('points_per_signin', '10', 'number', '每日签到奖励积分', 1),
('points_per_post', '5', 'number', '发布动态奖励积分', 1),
('points_per_like', '1', 'number', '点赞奖励积分', 1),
('points_per_match', '20', 'number', '匹配成功奖励积分', 1);

-- 插入默认任务
INSERT INTO `tasks` (`name`, `description`, `type`, `target`, `reward_points`, `status`, `sort_order`) VALUES
('每日签到', '每天登录应用签到', 'daily_signin', 1, 10, 1, 1),
('发布动态', '发布一条动态', 'daily_post', 1, 5, 1, 2),
('点赞互动', '给其他用户点赞', 'daily_like', 10, 10, 1, 3),
('评论互动', '发表评论', 'daily_comment', 5, 10, 1, 4),
('匹配成功', '成功匹配一个用户', 'match_success', 1, 20, 1, 5),
('邀请好友', '邀请好友注册', 'invite_friend', 1, 100, 1, 6);

-- 插入默认礼物
INSERT INTO `gifts` (`name`, `description`, `image`, `price`, `category`, `rarity`, `status`, `sort_order`) VALUES
('玫瑰花', '表达爱意的经典礼物', '/images/gifts/rose.png', 50, 'love', 1, 1, 1),
('巧克力', '甜蜜的礼物', '/images/gifts/chocolate.png', 30, 'sweet', 1, 1, 2),
('钻石', '珍贵的礼物', '/images/gifts/diamond.png', 500, 'luxury', 4, 1, 3),
('爱心', '温暖的礼物', '/images/gifts/heart.png', 20, 'love', 1, 1, 4),
('皇冠', '尊贵的礼物', '/images/gifts/crown.png', 1000, 'luxury', 4, 1, 5);

-- 插入默认商品
INSERT INTO `products` (`name`, `description`, `category`, `price`, `original_price`, `images`, `stock`, `status`, `sort_order`) VALUES
('Soul风格头像框', '精美的头像装饰框', 'avatar_frame', 100.00, 150.00, '["/images/products/avatar_frame1.png"]', 999, 1, 1),
('个性签名背景', '独特的签名背景', 'signature_bg', 50.00, 80.00, '["/images/products/signature_bg1.png"]', 999, 1, 2),
('VIP会员', '享受更多特权', 'vip', 299.00, 399.00, '["/images/products/vip.png"]', 999, 1, 3),
('超级匹配卡', '增加匹配次数', 'match_card', 99.00, 149.00, '["/images/products/match_card.png"]', 999, 1, 4),
('语音包', '个性化语音包', 'voice_pack', 199.00, 299.00, '["/images/products/voice_pack1.png"]', 999, 1, 5);
