-- 创建数据库
CREATE DATABASE IF NOT EXISTS `linkr_log` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `linkr_log`;

-- 日志条目表
CREATE TABLE IF NOT EXISTS `log_entry` (
  `id` varchar(64) NOT NULL COMMENT '主键ID',
  `timestamp` datetime NOT NULL COMMENT '时间戳',
  `level` varchar(20) NOT NULL COMMENT '日志级别',
  `service` varchar(100) NOT NULL COMMENT '服务名称',
  `module` varchar(100) DEFAULT NULL COMMENT '模块名称',
  `message` text NOT NULL COMMENT '日志消息',
  `stack_trace` text DEFAULT NULL COMMENT '堆栈跟踪',
  `thread` varchar(100) DEFAULT NULL COMMENT '线程名称',
  `class_name` varchar(200) DEFAULT NULL COMMENT '类名',
  `line_number` int DEFAULT NULL COMMENT '行号',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '逻辑删除标志',
  PRIMARY KEY (`id`),
  KEY `idx_timestamp` (`timestamp`),
  KEY `idx_level` (`level`),
  KEY `idx_service` (`service`),
  KEY `idx_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='日志条目表';

-- 服务信息表
CREATE TABLE IF NOT EXISTS `service_info` (
  `id` varchar(64) NOT NULL COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '服务名称',
  `status` varchar(20) NOT NULL DEFAULT 'running' COMMENT '服务状态',
  `log_path` varchar(500) DEFAULT NULL COMMENT '日志路径',
  `last_update` datetime DEFAULT NULL COMMENT '最后更新时间',
  `log_count` int DEFAULT '0' COMMENT '日志数量',
  `error_count` int DEFAULT '0' COMMENT '错误数量',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '逻辑删除标志',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='服务信息表';

-- 告警规则表
CREATE TABLE IF NOT EXISTS `alert_rule` (
  `id` varchar(64) NOT NULL COMMENT '主键ID',
  `name` varchar(100) NOT NULL COMMENT '规则名称',
  `rule_condition` varchar(500) NOT NULL COMMENT '告警条件',
  `level` varchar(20) NOT NULL COMMENT '告警级别',
  `notification_methods` text DEFAULT NULL COMMENT '通知方式（JSON格式）',
  `enabled` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '逻辑删除标志',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='告警规则表';

-- 插入示例数据
INSERT INTO `service_info` (`id`, `name`, `status`, `log_path`, `last_update`, `log_count`, `error_count`) VALUES
('1', '后端服务', 'running', '/logs/backend/', NOW(), 456, 12),
('2', '前端服务', 'running', '/logs/frontend/', NOW(), 234, 5),
('3', '数据库', 'running', '/logs/database/', NOW(), 789, 23),
('4', 'Nacos服务', 'running', '/logs/nacos/', NOW(), 123, 2),
('5', 'log-module', 'running', 'logs/log-module.log', NOW(), 0, 0);

INSERT INTO `alert_rule` (`id`, `name`, `rule_condition`, `level`, `notification_methods`, `enabled`) VALUES
('1', '错误率过高', '错误日志>10条/分钟', 'ERROR', '["邮件", "短信"]', 1),
('2', '服务异常', '服务状态=停止', 'FATAL', '["钉钉", "邮件"]', 1),
('3', '性能告警', '响应时间>5秒', 'WARN', '["邮件"]', 1);
