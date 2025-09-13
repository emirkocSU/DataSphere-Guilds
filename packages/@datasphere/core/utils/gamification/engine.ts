/**
 * @fileoverview Gamification Engine V2
 */

import { EventEmitter } from 'events';
import { PlayerProfile, Achievement, Quest, Tournament, Leaderboard, PointTransaction, UserId, AchievementId, QuestId, TournamentId, PointType, AchievementProgress, QuestProgress, Reward } from './types';

export class GamificationEngine extends EventEmitter {
  private static instance: GamificationEngine;
  private players = new Map<UserId, PlayerProfile>();
  private achievements = new Map<AchievementId, Achievement>();
  private quests = new Map<QuestId, Quest>();
  private tournaments = new Map<TournamentId, Tournament>();
  private leaderboards = new Map<string, Leaderboard>();
  private transactions: PointTransaction[] = [];

  private constructor() {
    super();
  }

  static getInstance(): GamificationEngine {
    if (!GamificationEngine.instance) {
      GamificationEngine.instance = new GamificationEngine();
    }
    return GamificationEngine.instance;
  }

  createPlayer(userId: UserId): PlayerProfile {
    const player: PlayerProfile = {
      userId,
      level: 1,
      experience: 0,
      reputation: 0,
      points: { EXPERIENCE: 0, CURRENCY: 0, REPUTATION: 0, SKILL: 0, ACTIVITY: 0 },
      achievements: [],
      badges: [],
      quests: [],
      stats: { totalPlayTime: 0, sessionsCount: 0, averageSessionTime: 0, longestStreak: 0, currentStreak: 0, completedQuests: 0, earnedAchievements: 0, tournamentWins: 0, socialInteractions: 0, pointsEarned: { EXPERIENCE: 0, CURRENCY: 0, REPUTATION: 0, SKILL: 0, ACTIVITY: 0 }, pointsSpent: { EXPERIENCE: 0, CURRENCY: 0, REPUTATION: 0, SKILL: 0, ACTIVITY: 0 } },
      preferences: { notifications: { achievements: true, quests: true, tournaments: true, social: true, dailyReminders: true, weeklyReports: true }, privacy: { profileVisibility: 'public', leaderboardVisibility: true, activityVisibility: true, allowFriendRequests: true }, display: { theme: 'auto', animations: true, sounds: true, language: 'en' }, gameplay: { difficulty: 'medium', autoAcceptQuests: false, competitiveMode: false } },
      socialData: { friends: [], followers: [], following: [], reputation: 0, socialScore: 0, interactions: [] },
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    this.players.set(userId, player);
    this.emit('player-created', player);
    return player;
  }

  awardPoints(userId: UserId, type: PointType, amount: number, source: string): void {
    const player = this.players.get(userId);
    if (!player) return;

    player.points[type] += amount;
    player.stats.pointsEarned[type] += amount;

    const transaction: PointTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      amount,
      operation: 'earn',
      source,
      description: `Earned ${amount} ${type} points from ${source}`,
      timestamp: new Date().toISOString(),
      metadata: {}
    };

    this.transactions.push(transaction);
    this.checkAchievements(userId);
    this.updateLeaderboards(userId);
    this.emit('points-awarded', { userId, type, amount, source });
  }

  completeQuest(userId: UserId, questId: QuestId): boolean {
    const player = this.players.get(userId);
    const quest = this.quests.get(questId);
    if (!player || !quest) return false;

    const progress = player.quests.find(q => q.questId === questId);
    if (!progress || progress.status !== 'active') return false;

    progress.status = 'completed';
    progress.completedAt = new Date().toISOString();
    player.stats.completedQuests++;

    // Award rewards
    quest.rewards.forEach(reward => this.grantReward(userId, reward));

    this.emit('quest-completed', { userId, questId });
    return true;
  }

  unlockAchievement(userId: UserId, achievementId: AchievementId): boolean {
    const player = this.players.get(userId);
    const achievement = this.achievements.get(achievementId);
    if (!player || !achievement) return false;

    const progress = player.achievements.find(a => a.achievementId === achievementId);
    if (progress?.isCompleted) return false;

    if (progress) {
      progress.isCompleted = true;
      progress.completedAt = new Date().toISOString();
    } else {
      player.achievements.push({
        achievementId,
        userId,
        progress: 100,
        isCompleted: true,
        completedAt: new Date().toISOString(),
        currentStreak: 0,
        bestStreak: 0,
        metadata: {}
      });
    }

    player.stats.earnedAchievements++;
    achievement.rewards.forEach(reward => this.grantReward(userId, reward));

    this.emit('achievement-unlocked', { userId, achievementId });
    return true;
  }

  joinTournament(userId: UserId, tournamentId: TournamentId): boolean {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament || tournament.status !== 'active') return false;

    if (tournament.currentParticipants >= tournament.maxParticipants) return false;

    tournament.currentParticipants++;
    tournament.leaderboard.entries.push({
      userId,
      rank: tournament.currentParticipants,
      score: 0,
      stats: {},
      timestamp: new Date().toISOString()
    });

    this.emit('tournament-joined', { userId, tournamentId });
    return true;
  }

  updateTournamentScore(userId: UserId, tournamentId: TournamentId, score: number): void {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return;

    const entry = tournament.leaderboard.entries.find(e => e.userId === userId);
    if (!entry) return;

    entry.score = score;
    entry.timestamp = new Date().toISOString();

    // Resort leaderboard
    tournament.leaderboard.entries.sort((a, b) => b.score - a.score);
    tournament.leaderboard.entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    this.emit('tournament-score-updated', { userId, tournamentId, score });
  }

  private checkAchievements(userId: UserId): void {
    const player = this.players.get(userId);
    if (!player) return;

    for (const achievement of this.achievements.values()) {
      const progress = player.achievements.find(a => a.achievementId === achievement.id);
      if (progress?.isCompleted) continue;

      if (this.meetsRequirements(player, achievement.requirements)) {
        this.unlockAchievement(userId, achievement.id);
      }
    }
  }

  private meetsRequirements(player: PlayerProfile, requirements: any[]): boolean {
    return requirements.every(req => {
      switch (req.type) {
        case 'stat':
          return (player.stats as any)[req.target] >= req.value;
        case 'action':
          return player.points[req.target as PointType] >= req.value;
        default:
          return false;
      }
    });
  }

  private grantReward(userId: UserId, reward: Reward): void {
    switch (reward.type) {
      case 'points':
        if (reward.currency) {
          this.awardPoints(userId, reward.currency, reward.value, 'reward');
        }
        break;
      case 'badge':
        this.emit('badge-awarded', { userId, badgeId: reward.itemId });
        break;
    }
  }

  private updateLeaderboards(userId: UserId): void {
    const player = this.players.get(userId);
    if (!player) return;

    for (const leaderboard of this.leaderboards.values()) {
      const entry = leaderboard.entries.find(e => e.userId === userId);
      const value = this.getMetricValue(player, leaderboard.metric);

      if (entry) {
        entry.value = value;
      } else {
        leaderboard.entries.push({
          userId,
          rank: 0,
          value,
          change: 0,
          trend: 'stable',
          metadata: {}
        });
      }
    }

    // Resort all leaderboards
    for (const leaderboard of this.leaderboards.values()) {
      leaderboard.entries.sort((a, b) => b.value - a.value);
      leaderboard.entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });
    }
  }

  private getMetricValue(player: PlayerProfile, metric: string): number {
    switch (metric) {
      case 'experience':
        return player.experience;
      case 'reputation':
        return player.reputation;
      case 'level':
        return player.level;
      default:
        return 0;
    }
  }
}

export const createGamificationEngine = (): GamificationEngine => {
  return GamificationEngine.getInstance();
};