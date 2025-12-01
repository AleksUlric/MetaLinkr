## 灵犀实时匹配方案

### 目标
- 让前端能“即点即匹配”，尝试将同时在线、互相满足条件的用户迅速配对
- 方案应在现有单体后端内落地，后续可平滑扩展到 Redis/Kafka 等组件

### 组件拆分
1. **在线状态服务 (`SoulRealtimePresenceService`)**
   - 前端通过 WebSocket/HTTP 心跳汇报 `deviceId / platform / 经纬度`
   - 服务写入 Redis ZSET（`soul:presence:online`），并用 TTL 保证 60 秒内心跳才视为在线
   - 暴露 `heartbeat / markOffline / getOnlineCount / listOnlineUsers` 等接口

2. **实时匹配协调器 (`SoulRealtimeMatchService`)**
   - 维护一个“待匹配队列”（默认内存 `ConcurrentLinkedQueue` + Redis 兜底）
   - 新用户入队时，扫描现有队列是否存在互相满足条件的 ticket
   - 匹配成功则立即构建 `SoulMatchUserResponse` + 临时私聊房间ID，并将结果写入待领取 map
   - 定期清理超时 ticket，以及离线用户的 ticket

3. **API & 推送**
   - `/api/matching/soul/realtime/heartbeat`：前端 20-30 秒一次，保持在线
   - `/api/matching/soul/realtime/enqueue`：发起即时匹配
   - `/api/matching/soul/realtime/result`：长轮询/定时轮询结果
   - `/api/matching/soul/realtime/cancel`：退出排队
   - 后续可将 `result` 替换为 WebSocket 推送（预留 `sessionId`）

4. **前端集成**
   - 进入灵犀页后立即发送 heartbeat，并启动轮询
   - 匹配成功后，沿用现有 match modal + 聊天跳转逻辑
   - 若队列等待，展示排队人数/预估等待时间

### 数据结构
| Key | 类型 | 说明 |
| --- | --- | --- |
| `soul:presence:online` | ZSET | 成员=用户ID，score=最后心跳毫秒 |
| `soul:presence:snapshot` | HASH | field=用户ID，value=设备/位置/平台 |
| `soul:match:queue` | List (后续) | 当前排队 ticket，单体阶段用内存队列 |
| `soul:match:pending:{userId}` | String | 匹配结果 JSON，轮询时读取并删除 |

### 兼容策略
- 目前继续沿用 `SoulMatchService` 的“推荐/喜欢”接口；实时匹配命中候选后，也会写入匹配结果，保证聊天房间和历史一致
- 单机模式下全部逻辑可运行，部署多实例时可通过 Redis Stream / Kafka 重构队列部分，其他接口保持不变

### 下一步
1. 落地 presence/match service 与 controller
2. 前端在 `SoulMatch.vue` 中启动 heartbeat + queue API，并在匹配命中后沿用现有弹窗/跳转
3. 灰度验证：监控在线人数、排队长度、平均等待时间

