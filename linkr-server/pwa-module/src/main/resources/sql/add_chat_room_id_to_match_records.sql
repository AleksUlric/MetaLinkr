-- 为匹配记录表添加聊天室ID字段
-- 用于存储匹配成功时创建的聊天室ID，方便查询聊天记录

ALTER TABLE `match_records` 
ADD COLUMN `chat_room_id` bigint DEFAULT NULL COMMENT '聊天室ID（匹配成功时创建）' AFTER `is_matched`,
ADD KEY `idx_chat_room_id` (`chat_room_id`);

-- 为已存在的匹配记录，如果已匹配成功，尝试关联聊天室
-- 注意：这个更新可能需要根据实际情况调整
UPDATE `match_records` mr
INNER JOIN `chat_room_members` crm1 ON crm1.user_id = mr.user_id
INNER JOIN `chat_room_members` crm2 ON crm2.room_id = crm1.room_id AND crm2.user_id = mr.target_user_id
INNER JOIN `chat_rooms` cr ON cr.id = crm1.room_id AND cr.type = 'private'
SET mr.chat_room_id = cr.id
WHERE mr.is_matched = 1 
  AND mr.chat_room_id IS NULL
  AND mr.match_type = 'soul';

