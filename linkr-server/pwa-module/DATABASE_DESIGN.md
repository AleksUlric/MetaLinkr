# MetaLinkr PWA 数据库设计文档

## 📋 概述

**数据库名称**: `linkr_pwa`  
**字符集**: `utf8mb4`  
**排序规则**: `utf8mb4_unicode_ci`  
**MySQL版本**: 8.0+  

## 🗃️ 表结构总览

### 核心表数量: 30个

| 分类 | 表名 | 说明 | 记录数 |
|------|------|------|--------|
| **用户相关** | users | 用户基本信息 | 0 |
| | user_oauth | 第三方登录 | 0 |
| | user_settings | 用户设置 | 0 |
| | user_relations | 用户关系 | 0 |
| **动态相关** | posts | 动态内容 | 0 |
| | post_interactions | 动态互动 | 0 |
| | comments | 评论 | 0 |
| **匹配相关** | matches | 匹配记录 | 0 |
| | match_preferences | 匹配偏好 | 0 |
| **聊天相关** | chat_sessions | 聊天会话 | 0 |
| | chat_members | 会话成员 | 0 |
| | messages | 消息 | 0 |
| | message_status | 消息状态 | 0 |
| **直播相关** | live_rooms | 直播间 | 0 |
| | live_viewers | 直播观众 | 0 |
| | live_messages | 直播消息 | 0 |
| **游戏相关** | game_rooms | 游戏房间 | 0 |
| | game_room_members | 游戏房间成员 | 0 |
| **商城相关** | products | 商品 | 1 |
| | shopping_cart | 购物车 | 0 |
| | orders | 订单 | 0 |
| | order_items | 订单详情 | 0 |
| **礼物相关** | gifts | 礼物 | 2 |
| | gift_records | 礼物记录 | 0 |
| **积分系统** | point_records | 积分记录 | 0 |
| | tasks | 任务 | 2 |
| | user_tasks | 用户任务 | 0 |
| **系统相关** | notifications | 通知 | 0 |
| | system_configs | 系统配置 | 2 |
| | files | 文件 | 0 |

## 🔑 核心表设计

### 1. 用户表 (users)
```sql
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
```

### 2. 动态表 (posts)
```sql
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
```

### 3. 匹配记录表 (matches)
```sql
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
```

### 4. 聊天会话表 (chat_sessions)
```sql
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
```

## 📊 功能模块对应表

### 🌍 星球模块
- `users` - 用户星球信息
- `user_settings` - 星球设置
- `system_configs` - 星球配置

### 🏠 广场模块  
- `posts` - 动态内容
- `post_interactions` - 点赞、评论、分享
- `comments` - 评论详情
- `user_relations` - 关注关系

### 💬 聊天模块
- `chat_sessions` - 聊天会话
- `chat_members` - 会话成员
- `messages` - 消息内容
- `message_status` - 消息状态

### 🎯 匹配模块
- `matches` - 匹配记录
- `match_preferences` - 匹配偏好
- `user_relations` - 匹配关系

### 📺 直播模块
- `live_rooms` - 直播间
- `live_viewers` - 观众管理
- `live_messages` - 弹幕消息

### 🎮 游戏模块
- `game_rooms` - 游戏房间
- `game_room_members` - 房间成员

### 🛒 商城模块
- `products` - 商品信息
- `shopping_cart` - 购物车
- `orders` - 订单管理
- `order_items` - 订单详情

### 🎁 礼物模块
- `gifts` - 礼物信息
- `gift_records` - 礼物记录

### 🏆 积分系统
- `point_records` - 积分记录
- `tasks` - 任务配置
- `user_tasks` - 用户任务进度

## 🔧 数据库配置

### 连接信息
```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/linkr_pwa?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: Xing@1225
```

### MyBatis Plus配置
```yaml
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: auto
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0
  mapper-locations: classpath*:mapper/**/*.xml
```

## 📈 性能优化建议

### 索引优化
- 为高频查询字段添加索引
- 复合索引优化多条件查询
- 定期分析慢查询日志

### 分表策略
- 消息表按时间分表
- 积分记录表按用户ID分表
- 文件表按类型分表

### 缓存策略
- Redis缓存热点数据
- 用户信息缓存
- 配置信息缓存

## 🔒 安全考虑

### 数据加密
- 密码使用BCrypt加密
- 敏感信息字段加密存储
- 传输过程HTTPS加密

### 权限控制
- 数据库用户权限最小化
- 应用层权限验证
- API接口鉴权

## 📝 维护说明

### 备份策略
- 每日增量备份
- 每周全量备份
- 重要操作前手动备份

### 监控指标
- 数据库连接数
- 慢查询监控
- 存储空间监控

---

**创建时间**: 2025-01-10  
**版本**: 1.0  
**维护者**: MetaLinkr开发团队
