export interface GameInfo {
  id: string
  name: string
  icon: string
  cover: string
  description: string
  category: string
  platform: string[]
  developer: string
  releaseDate: string
  rating: number
  downloadCount: number
  isInstalled: boolean
}

export interface GameRoom {
  id: string
  gameId: string
  gameName: string
  roomName: string
  description: string
  maxPlayers: number
  currentPlayers: number
  players: GamePlayer[]
  isPrivate: boolean
  password?: string
  createdBy: string
  createdAt: string
  status: 'waiting' | 'playing' | 'finished'
}

export interface GamePlayer {
  id: string
  username: string
  avatar: string
  gameLevel: string
  gameRank: string
  isReady: boolean
  isHost: boolean
}

export interface GameMatch {
  id: string
  gameId: string
  gameName: string
  playerId: string
  playerName: string
  playerAvatar: string
  level: string
  rank: string
  winRate: number
  matchScore: number
  distance: number
  isOnline: boolean
}
