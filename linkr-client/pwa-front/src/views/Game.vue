<template>
  <div class="game-page">
    <div class="game-header">
      <el-button type="text" @click="$router.back()" class="back-btn">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <h2>游戏中心</h2>
      <el-button type="text" class="more-btn">
        <el-icon><MoreFilled /></el-icon>
      </el-button>
    </div>

    <div class="game-accounts">
      <h3>我的游戏</h3>
      <div class="account-list">
        <div class="account-item" v-for="account in gameAccounts" :key="account.id">
          <div class="game-icon">
            <el-avatar :src="account.gameIcon" :size="50" />
          </div>
          <div class="account-info">
            <div class="game-name">{{ account.gameName }}</div>
            <div class="game-id">ID: {{ account.gameId }}</div>
            <div class="rank-info">
              <span class="rank">{{ account.rank }}</span>
              <span class="level">{{ account.level }}</span>
            </div>
          </div>
          <div class="win-rate">
            <div class="rate">{{ account.winRate }}%</div>
            <div class="label">胜率</div>
          </div>
        </div>
      </div>
    </div>

    <div class="game-rooms">
      <h3>开黑房间</h3>
      <div class="room-list">
        <div class="room-item" v-for="room in gameRooms" :key="room.id">
          <div class="room-info">
            <div class="room-name">{{ room.roomName }}</div>
            <div class="room-game">{{ room.gameName }} · {{ room.currentPlayers }}/{{ room.maxPlayers }}人</div>
            <div class="room-desc">{{ room.description }}</div>
          </div>
          <div class="room-actions">
            <el-button type="primary" size="small" @click="joinRoom(room)">加入</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="floating-action">
      <el-button type="primary" size="large" round class="create-room-btn">
        <el-icon><Plus /></el-icon>
        创建房间
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface GameAccount {
  id: string
  gameName: string
  gameId: string
  gameIcon: string
  rank: string
  level: string
  winRate: number
}

interface GameRoom {
  id: string
  roomName: string
  gameName: string
  currentPlayers: number
  maxPlayers: number
  description: string
}

const gameAccounts: GameAccount[] = [
  {
    id: '1',
    gameName: '王者荣耀',
    gameId: 'test123',
    gameIcon: 'https://picsum.photos/100/100?random=201',
    rank: '钻石III',
    level: '钻石',
    winRate: 65.5
  },
  {
    id: '2',
    gameName: '英雄联盟',
    gameId: 'test456',
    gameIcon: 'https://picsum.photos/100/100?random=202',
    rank: '黄金I',
    level: '黄金',
    winRate: 58.2
  }
]

const gameRooms: GameRoom[] = [
  {
    id: '1',
    roomName: '王者荣耀开黑',
    gameName: '王者荣耀',
    currentPlayers: 3,
    maxPlayers: 5,
    description: '来几个会玩的队友，一起上分！'
  },
  {
    id: '2',
    roomName: 'LOL休闲局',
    gameName: '英雄联盟',
    currentPlayers: 1,
    maxPlayers: 5,
    description: '娱乐为主，不要太认真~'
  }
]

const joinRoom = (room: GameRoom) => {
  console.log('加入房间:', room.roomName)
}
</script>

<style scoped>
.game-page {
  height: 100vh;
  background: #f9fafb;
  padding-bottom: 100px;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.game-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.back-btn, .more-btn {
  color: #6b7280;
}

.game-accounts, .game-rooms {
  margin: 16px;
}

.game-accounts h3, .game-rooms h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.account-list, .room-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.account-item, .room-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.account-item:last-child, .room-item:last-child {
  border-bottom: none;
}

.game-icon {
  margin-right: 12px;
}

.account-info {
  flex: 1;
  min-width: 0;
}

.game-name, .room-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
  margin-bottom: 4px;
}

.game-id, .room-game {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.rank-info {
  display: flex;
  gap: 8px;
}

.rank, .level {
  background: #6366f1;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.level {
  background: #10b981;
}

.win-rate {
  text-align: center;
  margin-left: 12px;
}

.rate {
  font-size: 18px;
  font-weight: 600;
  color: #10b981;
}

.label {
  font-size: 12px;
  color: #6b7280;
}

.room-info {
  flex: 1;
  min-width: 0;
}

.room-desc {
  color: #6b7280;
  font-size: 14px;
  margin-top: 4px;
}

.room-actions {
  margin-left: 12px;
}

.floating-action {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
}

.create-room-btn {
  padding: 16px 32px;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}
</style>

