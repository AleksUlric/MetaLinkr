import type { GameInfo, GameRoom, GamePlayer, GameMatch } from '@/types/game'

export const mockGames: GameInfo[] = [
  {
    id: '1',
    name: '王者荣耀',
    icon: 'https://picsum.photos/100/100?random=901',
    cover: 'https://picsum.photos/400/300?random=902',
    description: '5v5英雄公平对战手游',
    category: 'MOBA',
    platform: ['iOS', 'Android'],
    developer: '腾讯游戏',
    releaseDate: '2015-11-26',
    rating: 4.5,
    downloadCount: 100000000,
    isInstalled: true
  },
  {
    id: '2',
    name: '英雄联盟',
    icon: 'https://picsum.photos/100/100?random=903',
    cover: 'https://picsum.photos/400/300?random=904',
    description: '5v5英雄联盟对战游戏',
    category: 'MOBA',
    platform: ['PC'],
    developer: 'Riot Games',
    releaseDate: '2011-09-22',
    rating: 4.8,
    downloadCount: 50000000,
    isInstalled: true
  },
  {
    id: '3',
    name: '和平精英',
    icon: 'https://picsum.photos/100/100?random=905',
    cover: 'https://picsum.photos/400/300?random=906',
    description: '腾讯光子工作室群自研战术竞技手游',
    category: '射击',
    platform: ['iOS', 'Android'],
    developer: '腾讯游戏',
    releaseDate: '2019-05-08',
    rating: 4.3,
    downloadCount: 80000000,
    isInstalled: false
  }
]

export const mockGameRooms: GameRoom[] = [
  {
    id: '1',
    gameId: '1',
    gameName: '王者荣耀',
    roomName: '钻石段位开黑房间',
    description: '寻找钻石段位队友一起上分',
    maxPlayers: 5,
    currentPlayers: 3,
    players: [
      {
        id: '1',
        username: '房主',
        avatar: 'https://picsum.photos/200/200?random=1',
        gameLevel: '钻石',
        gameRank: '钻石III',
        isReady: true,
        isHost: true
      },
      {
        id: '2',
        username: '小明',
        avatar: 'https://picsum.photos/200/200?random=2',
        gameLevel: '钻石',
        gameRank: '钻石IV',
        isReady: true,
        isHost: false
      },
      {
        id: '3',
        username: '小红',
        avatar: 'https://picsum.photos/200/200?random=3',
        gameLevel: '钻石',
        gameRank: '钻石II',
        isReady: false,
        isHost: false
      }
    ],
    isPrivate: false,
    createdBy: '1',
    createdAt: '2024-01-15T19:00:00Z',
    status: 'waiting'
  },
  {
    id: '2',
    gameId: '2',
    gameName: '英雄联盟',
    roomName: '黄金白银开黑',
    description: '黄金白银段位，娱乐为主',
    maxPlayers: 5,
    currentPlayers: 2,
    players: [
      {
        id: '4',
        username: '房主2',
        avatar: 'https://picsum.photos/200/200?random=4',
        gameLevel: '黄金',
        gameRank: '黄金I',
        isReady: true,
        isHost: true
      },
      {
        id: '5',
        username: '小李',
        avatar: 'https://picsum.photos/200/200?random=5',
        gameLevel: '白银',
        gameRank: '白银I',
        isReady: true,
        isHost: false
      }
    ],
    isPrivate: false,
    createdBy: '4',
    createdAt: '2024-01-15T18:30:00Z',
    status: 'waiting'
  }
]

export const mockGameMatches: GameMatch[] = [
  {
    id: '2',
    gameId: '1',
    gameName: '王者荣耀',
    playerId: '2',
    playerName: '小明',
    playerAvatar: 'https://picsum.photos/200/200?random=2',
    level: '钻石',
    rank: '钻石III',
    winRate: 65.5,
    matchScore: 85,
    distance: 15.2,
    isOnline: true
  },
  {
    id: '3',
    gameId: '1',
    gameName: '王者荣耀',
    playerId: '3',
    playerName: '小红',
    playerAvatar: 'https://picsum.photos/200/200?random=3',
    level: '钻石',
    rank: '钻石II',
    winRate: 58.2,
    matchScore: 78,
    distance: 28.5,
    isOnline: false
  },
  {
    id: '4',
    gameId: '2',
    gameName: '英雄联盟',
    playerId: '4',
    playerName: '小李',
    playerAvatar: 'https://picsum.photos/200/200?random=4',
    level: '黄金',
    rank: '黄金I',
    winRate: 72.3,
    matchScore: 82,
    distance: 35.8,
    isOnline: true
  }
]
