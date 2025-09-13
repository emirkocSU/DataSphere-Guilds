/**
 * @fileoverview Gamification Engine V2 Types - Refactored for conciseness and clarity.
 */

export type UserId = string;
export type AchievementId = string;
export type BadgeId = string;
export type QuestId = string;
export type TournamentId = string;
export type LeaderboardId = string;
export type PointTransactionId = string;
export type ISOTimestamp = string;

export enum PointType {
  EXPERIENCE = 'EXPERIENCE',
  CURRENCY = 'CURRENCY',
  REPUTATION = 'REPUTATION',
  SKILL = 'SKILL',
  ACTIVITY = 'ACTIVITY'
}

export enum AchievementType {
  MILESTONE = 'MILESTONE',
  STREAK = 'STREAK',
  COMPETITION = 'COMPETITION',
  EXPLORATION = 'EXPLORATION',
  SOCIAL = 'SOCIAL',
  SKILL = 'SKILL'
}

export enum QuestType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  STORY = 'STORY',
  SIDE = 'SIDE',
  CHALLENGE = 'CHALLENGE'
}

export enum TournamentType {
  SOLO = 'SOLO',
  TEAM = 'TEAM',
  GUILD = 'GUILD',
  BRACKET = 'BRACKET',
  LADDER = 'LADDER'
}

export interface PlayerProfile {
  userId: UserId;
  level: number;
  experience: number;
  reputation: number;
  points: Record<PointType, number>;
  achievements: AchievementProgress[];
  badges: BadgeCollection[];
  quests: QuestProgress[];
  stats: PlayerStats;
  preferences: {
    notifications: {
      achievements: boolean;
      quests: boolean;
      tournaments: boolean;
      social: boolean;
      dailyReminders: boolean;
      weeklyReports: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'friends' | 'private';
      leaderboardVisibility: boolean;
      activityVisibility: boolean;
      allowFriendRequests: boolean;
    };
    display: {
      theme: 'light' | 'dark' | 'auto';
      animations: boolean;
      sounds: boolean;
      language: string;
    };
    gameplay: {
      difficulty: 'easy' | 'medium' | 'hard' | 'expert';
      autoAcceptQuests: boolean;
      competitiveMode: boolean;
    };
  };
  socialData: SocialData;
  createdAt: ISOTimestamp;
  lastActive: ISOTimestamp;
}

export interface PlayerStats {
  totalPlayTime: number;
  sessionsCount: number;
  averageSessionTime: number;
  longestStreak: number;
  currentStreak: number;
  completedQuests: number;
  earnedAchievements: number;
  tournamentWins: number;
  socialInteractions: number;
  pointsEarned: Record<PointType, number>;
  pointsSpent: Record<PointType, number>;
}

export interface SocialData {
  friends: UserId[];
  followers: UserId[];
  following: UserId[];
  guild?: string;
  reputation: number;
  socialScore: number;
  interactions: SocialInteraction[];
}

export interface SocialInteraction {
  type: 'like' | 'share' | 'comment' | 'challenge' | 'help';
  targetUserId: UserId;
  context: string;
  timestamp: ISOTimestamp;
  points: number;
}

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  type: AchievementType;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirements: AchievementRequirement[];
  rewards: Reward[];
  icon: string;
  isHidden: boolean;
  prerequisites: AchievementId[];
  metadata: Record<string, unknown>;
}

export interface AchievementRequirement {
  type: 'action' | 'stat' | 'time' | 'streak' | 'social';
  target: string;
  value: number;
  operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte';
  timeframe?: number;
  contextFilters?: Record<string, unknown>;
}

export interface AchievementProgress {
  achievementId: AchievementId;
  userId: UserId;
  progress: number;
  isCompleted: boolean;
  completedAt?: ISOTimestamp;
  currentStreak: number;
  bestStreak: number;
  metadata: Record<string, unknown>;
}

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: BadgeRequirement[];
  expiration?: number;
  isTransferable: boolean;
  metadata: Record<string, unknown>;
}

export interface BadgeRequirement {
  type: 'achievement' | 'quest' | 'tournament' | 'social' | 'custom';
  target: string;
  value: number;
  timeframe?: number;
}

export interface BadgeCollection {
  badgeId: BadgeId;
  userId: UserId;
  earnedAt: ISOTimestamp;
  expiresAt?: ISOTimestamp;
  displayOrder: number;
  isVisible: boolean;
  metadata: Record<string, unknown>;
}

export interface Quest {
  id: QuestId;
  name: string;
  description: string;
  type: QuestType;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  objectives: QuestObjective[];
  rewards: Reward[];
  prerequisites: QuestId[];
  timeLimit?: number;
  cooldown?: number;
  maxAttempts?: number;
  isRepeatable: boolean;
  isActive: boolean;
  metadata: Record<string, unknown>;
}

export interface QuestObjective {
  id: string;
  name: string;
  description: string;
  type: 'action' | 'collect' | 'reach' | 'defeat' | 'explore';
  target: string;
  currentValue: number;
  targetValue: number;
  isCompleted: boolean;
  isOptional: boolean;
  rewards: Reward[];
}

export interface QuestProgress {
  questId: QuestId;
  userId: UserId;
  status: 'available' | 'active' | 'completed' | 'failed' | 'expired';
  startedAt?: ISOTimestamp;
  completedAt?: ISOTimestamp;
  objectives: Record<string, number>;
  attempts: number;
  metadata: Record<string, unknown>;
}

export interface Reward {
  type: 'points' | 'badge' | 'item' | 'unlock' | 'multiplier';
  value: number;
  currency?: PointType;
  itemId?: string;
  duration?: number;
  metadata: Record<string, unknown>;
}

export interface Tournament {
  id: TournamentId;
  name: string;
  description: string;
  type: TournamentType;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  prizePool: {
    position: number;
    type: 'points' | 'badge' | 'item' | 'title';
    value: number;
    description: string;
  }[];
  rules: {
    type: 'eligibility' | 'gameplay' | 'scoring' | 'behavior';
    description: string;
    enforcement: 'automatic' | 'manual';
    penalty: string;
  }[];
  schedule: {
    registrationStart: ISOTimestamp;
    registrationEnd: ISOTimestamp;
    tournamentStart: ISOTimestamp;
    tournamentEnd: ISOTimestamp;
    timezone: string;
  };
  leaderboard: {
    entries: {
      userId: UserId;
      rank: number;
      score: number;
      stats: Record<string, number>;
      timestamp: ISOTimestamp;
    }[];
    lastUpdated: ISOTimestamp;
    frozen: boolean;
  };
  metadata: Record<string, unknown>;
}

export interface Leaderboard {
  id: LeaderboardId;
  name: string;
  description: string;
  type: 'global' | 'regional' | 'guild' | 'friends' | 'custom';
  metric: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all_time';
  maxEntries: number;
  entries: {
    userId: UserId;
    rank: number;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
    metadata: Record<string, unknown>;
  }[];
  lastUpdated: ISOTimestamp;
  resetSchedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    time: string;
    timezone: string;
    preserveHistory: boolean;
  };
  filters: Record<string, unknown>;
}

export interface PointTransaction {
  id: PointTransactionId;
  userId: UserId;
  type: PointType;
  amount: number;
  operation: 'earn' | 'spend' | 'transfer' | 'expire';
  source: string;
  description: string;
  timestamp: ISOTimestamp;
  metadata: Record<string, unknown>;
}

export interface ProgressionSystem {
  id: string;
  name: string;
  levels: {
    level: number;
    experienceRequired: number;
    title: string;
    description: string;
    icon: string;
    color: string;
    benefits: string[];
  }[];
  formula: {
    type: 'linear' | 'exponential' | 'logarithmic' | 'custom';
    baseValue: number;
    multiplier: number;
    exponent?: number;
    customFormula?: string;
  };
  rewards: Record<number, Reward[]>;
  milestones: {
    level: number;
    name: string;
    description: string;
    rewards: Reward[];
    isPublic: boolean;
  }[];
}

export interface DynamicDifficulty {
  userId: UserId;
  baseLevel: number;
  adjustmentFactor: number;
  performanceHistory: PerformanceMetric[];
  lastAdjustment: ISOTimestamp;
  nextAdjustment: ISOTimestamp;
}

export interface PerformanceMetric {
  timestamp: ISOTimestamp;
  accuracy: number;
  speed: number;
  completion: number;
  engagement: number;
  difficulty: number;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  type: 'seasonal' | 'special' | 'limited';
  startDate: ISOTimestamp;
  endDate: ISOTimestamp;
  quests: QuestId[];
  achievements: AchievementId[];
  rewards: Reward[];
  leaderboard?: LeaderboardId;
  metadata: Record<string, unknown>;
}

export interface GamificationMetrics {
  totalUsers: number;
  activeUsers: number;
  engagement: {
    averageSessionTime: number;
    sessionsPerUser: number;
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    questCompletionRate: number;
    achievementUnlockRate: number;
    tournamentParticipation: number;
  };
  retention: {
    day1: number;
    day7: number;
    day30: number;
    day90: number;
    cohorts: RetentionCohort[];
  };
  monetization: {
    totalRevenue: number;
    averageRevenuePerUser: number;
    conversionRate: number;
    subscriptionRevenue: number;
    itemSales: number;
    tournamentFees: number;
  };
  social: {
    friendConnections: number;
    guildMemberships: number;
    socialInteractions: number;
    referrals: number;
    viralCoefficient: number;
  };
  content: {
    totalQuests: number;
    questsCompleted: number;
    achievementsUnlocked: number;
    badgesEarned: number;
    tournamentsHeld: number;
    contentEngagement: number;
  };
}

export interface RetentionCohort {
  period: string;
  users: number;
  retained: Record<string, number>;
}