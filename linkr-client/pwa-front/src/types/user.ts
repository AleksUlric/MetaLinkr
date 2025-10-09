export interface User {
  id: string
  username: string
  nickname: string
  avatar: string
  phone?: string
  email?: string
  gender: 'male' | 'female' | 'other'
  birthday?: string
  location?: string
  bio?: string
  level: number
  points: number
  vipLevel: number
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  interests: string[]
  gameAccounts: GameAccount[]
  pets: Pet[]
  checkInCount: number
  followCount: number
  fanCount: number
  postCount: number
  // 游戏化字段 - 参考Soul的积分和等级系统
  experience?: number
  achievements?: string[]
  streakDays?: number
  lastDailyReward?: string
  lastActiveDate?: string
  matches?: number
  likes?: number
  fans?: number
  // 社交统计
  totalMatches?: number
  totalLikes?: number
  totalFans?: number
  // 活跃度统计
  weeklyActiveDays?: number
  monthlyActiveDays?: number
  // 成就系统
  badges?: Badge[]
  // 任务系统
  dailyTasks?: DailyTask[]
  weeklyTasks?: WeeklyTask[]
  // Soul风格的等级系统
  levelTitle?: string
  nextLevelExperience?: number
  currentLevelExperience?: number
  // Uki风格的签到系统
  checkinStreak?: number
  lastCheckinDate?: string
  checkinRewards?: CheckinReward[]
  // 排行榜系统
  rank?: number
  weeklyRank?: number
  monthlyRank?: number
  // 游戏化统计
  totalExperience?: number
  totalPointsEarned?: number
  totalTasksCompleted?: number
  totalAchievementsEarned?: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt: string
}

export interface DailyTask {
  id: string
  title: string
  description: string
  reward: {
    points: number
    experience: number
  }
  completed: boolean
  progress: number
  maxProgress: number
}

export interface WeeklyTask {
  id: string
  title: string
  description: string
  reward: {
    points: number
    experience: number
    badge?: string
  }
  completed: boolean
  progress: number
  maxProgress: number
  deadline: string
}

export interface GameAccount {
  id: string
  gameName: string
  gameId: string
  level: string
  rank: string
  winRate: number
  avatar: string
}

export interface Pet {
  id: string
  name: string
  type: string
  breed: string
  age: number
  avatar: string
  health: string
  description?: string
}

export interface CheckinReward {
  day: number
  points: number
  experience: number
  badge?: string
  claimed: boolean
}

export interface LeaderboardUser {
  id: string
  name: string
  avatar: string
  level: number
  points: number
  rank: number
  isMe: boolean
}

export interface GameReward {
  id: string
  type: 'points' | 'experience' | 'badge' | 'item'
  value: number | string
  description: string
  icon: string
}
