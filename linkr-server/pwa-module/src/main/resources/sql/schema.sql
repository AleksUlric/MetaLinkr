-- PWA模块数据库表结构

-- 用户基础信息表
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `password` varchar(255) NOT NULL COMMENT '密码哈希',
  `nickname` varchar(50) NOT NULL COMMENT '昵称',
  `avatar` varchar(500) DEFAULT NULL COMMENT '头像URL',
  `age` int(3) DEFAULT NULL COMMENT '年龄',
  `gender` tinyint(1) DEFAULT NULL COMMENT '性别: 0-未知, 1-男, 2-女',
  `birthday` varchar(20) DEFAULT NULL COMMENT '生日',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户基础信息表';

-- 用户第三方登录表
CREATE TABLE IF NOT EXISTS `user_oauth` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '用户ID',
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
  KEY `idx_unionid` (`unionid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户第三方登录表';

-- 用户兴趣标签表
CREATE TABLE IF NOT EXISTS `user_interests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `interest` varchar(50) NOT NULL COMMENT '兴趣标签',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_interest` (`interest`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户兴趣标签表';

-- 匹配记录表
CREATE TABLE IF NOT EXISTS `match_records` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `target_user_id` bigint NOT NULL COMMENT '目标用户ID',
  `match_type` enum('soul','voice','swipe') NOT NULL COMMENT '匹配类型',
  `action` enum('like','pass','super_like') NOT NULL COMMENT '操作',
  `match_score` int DEFAULT 0 COMMENT '匹配度分数',
  `is_matched` tinyint(1) DEFAULT 0 COMMENT '是否匹配成功',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_target_user_id` (`target_user_id`),
  KEY `idx_match_type` (`match_type`),
  UNIQUE KEY `uk_user_target` (`user_id`, `target_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='匹配记录表';

-- 聊天室表
CREATE TABLE IF NOT EXISTS `chat_rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '群聊名称',
  `avatar` varchar(500) DEFAULT NULL COMMENT '群聊头像',
  `type` enum('private','group') NOT NULL DEFAULT 'private' COMMENT '聊天类型',
  `created_by` bigint NOT NULL COMMENT '创建者ID',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天室表';

-- 聊天室成员表
CREATE TABLE IF NOT EXISTS `chat_room_members` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `role` enum('owner','admin','member') DEFAULT 'member',
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_read_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_room_user` (`room_id`, `user_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天室成员表';

-- 聊天消息表
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint NOT NULL,
  `sender_id` bigint NOT NULL,
  `content` text NOT NULL COMMENT '消息内容',
  `type` enum('text','image','voice','video','system') DEFAULT 'text',
  `file_url` varchar(500) DEFAULT NULL COMMENT '文件URL',
  `file_size` bigint DEFAULT NULL COMMENT '文件大小',
  `duration` int DEFAULT NULL COMMENT '语音/视频时长(秒)',
  `is_read` tinyint(1) DEFAULT 0 COMMENT '是否已读',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_room_id` (`room_id`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天消息表';

-- 动态表
CREATE TABLE IF NOT EXISTS `posts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `content` text NOT NULL COMMENT '动态内容',
  `images` json DEFAULT NULL COMMENT '图片列表',
  `videos` json DEFAULT NULL COMMENT '视频列表',
  `location` varchar(200) DEFAULT NULL COMMENT '位置信息',
  `topic_tags` json DEFAULT NULL COMMENT '话题标签',
  `like_count` int DEFAULT 0 COMMENT '点赞数',
  `comment_count` int DEFAULT 0 COMMENT '评论数',
  `share_count` int DEFAULT 0 COMMENT '分享数',
  `status` enum('published','draft','deleted') DEFAULT 'published',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='动态表';

-- 动态点赞表
CREATE TABLE IF NOT EXISTS `post_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `post_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_post_user` (`post_id`, `user_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='动态点赞表';

-- 动态评论表
CREATE TABLE IF NOT EXISTS `post_comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `post_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `parent_id` bigint DEFAULT NULL COMMENT '父评论ID',
  `content` text NOT NULL COMMENT '评论内容',
  `like_count` int DEFAULT 0 COMMENT '点赞数',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='动态评论表';

-- 直播间表
CREATE TABLE IF NOT EXISTS `live_rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `host_id` bigint NOT NULL COMMENT '主播ID',
  `title` varchar(200) NOT NULL COMMENT '直播标题',
  `description` text COMMENT '直播描述',
  `cover_image` varchar(500) DEFAULT NULL COMMENT '封面图',
  `stream_url` varchar(500) DEFAULT NULL COMMENT '推流地址',
  `play_url` varchar(500) DEFAULT NULL COMMENT '播放地址',
  `category` varchar(50) DEFAULT NULL COMMENT '分类',
  `tags` json DEFAULT NULL COMMENT '标签',
  `viewer_count` int DEFAULT 0 COMMENT '观众数',
  `like_count` int DEFAULT 0 COMMENT '点赞数',
  `gift_count` int DEFAULT 0 COMMENT '礼物数',
  `status` enum('preparing','live','ended') DEFAULT 'preparing',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_host_id` (`host_id`),
  KEY `idx_status` (`status`),
  KEY `idx_start_time` (`start_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='直播间表';

-- 语音房间表
CREATE TABLE IF NOT EXISTS `voice_rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '房间名称',
  `description` text COMMENT '房间描述',
  `cover_image` varchar(500) DEFAULT NULL COMMENT '封面图',
  `host_id` bigint NOT NULL COMMENT '房主ID',
  `category` varchar(50) DEFAULT NULL COMMENT '分类',
  `tags` json DEFAULT NULL COMMENT '标签',
  `max_members` int DEFAULT 8 COMMENT '最大成员数',
  `current_members` int DEFAULT 0 COMMENT '当前成员数',
  `is_private` tinyint(1) DEFAULT 0 COMMENT '是否私密',
  `password` varchar(50) DEFAULT NULL COMMENT '房间密码',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_host_id` (`host_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='语音房间表';

-- 商品表
CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL COMMENT '商品名称',
  `description` text COMMENT '商品描述',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `original_price` decimal(10,2) DEFAULT NULL COMMENT '原价',
  `images` json DEFAULT NULL COMMENT '商品图片',
  `category` varchar(50) NOT NULL COMMENT '分类',
  `tags` json DEFAULT NULL COMMENT '标签',
  `stock` int DEFAULT 0 COMMENT '库存',
  `sales` int DEFAULT 0 COMMENT '销量',
  `rating` decimal(3,2) DEFAULT 0 COMMENT '评分',
  `review_count` int DEFAULT 0 COMMENT '评价数',
  `status` enum('active','inactive','deleted') DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 任务表
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL COMMENT '任务标题',
  `description` text COMMENT '任务描述',
  `type` enum('daily','weekly','monthly') NOT NULL COMMENT '任务类型',
  `reward_points` int DEFAULT 0 COMMENT '奖励积分',
  `reward_experience` int DEFAULT 0 COMMENT '奖励经验',
  `reward_coins` int DEFAULT 0 COMMENT '奖励金币',
  `target_value` int NOT NULL COMMENT '目标值',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务表';

-- 用户任务进度表
CREATE TABLE IF NOT EXISTS `user_task_progress` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `task_id` bigint NOT NULL,
  `current_value` int DEFAULT 0 COMMENT '当前进度',
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_task` (`user_id`, `task_id`),
  KEY `idx_task_id` (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户任务进度表';

-- 签到记录表
CREATE TABLE IF NOT EXISTS `checkin_records` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `checkin_date` date NOT NULL COMMENT '签到日期',
  `reward_points` int DEFAULT 0,
  `reward_experience` int DEFAULT 0,
  `reward_coins` int DEFAULT 0,
  `streak_days` int DEFAULT 1 COMMENT '连续签到天数',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_date` (`user_id`, `checkin_date`),
  KEY `idx_checkin_date` (`checkin_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='签到记录表';
