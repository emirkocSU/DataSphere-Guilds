/**
 * @fileoverview Enterprise Session Manager
 */

import { EventEmitter } from 'events';
import { randomBytes } from 'crypto';
import { 
  SessionId, 
  UserId, 
  DeviceId,
  SessionData,
  SessionStatus,
  AuthContext,
  ISOTimestamp 
} from './types';

interface SessionConfig {
  defaultTimeout: number;
  maxTimeout: number;
  maxConcurrentSessions: number;
  storage: 'memory' | 'redis' | 'database';
  cookieSettings: {
    name: string;
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
  };
}

export class SessionManager extends EventEmitter {
  private static instance: SessionManager;
  private config: SessionConfig;
  private sessions = new Map<SessionId, SessionData>();
  private userSessions = new Map<UserId, Set<SessionId>>();

  private constructor(config: SessionConfig) {
    super();
    this.config = config;
    setInterval(() => this.cleanup(), 60000);
  }

  static getInstance(config?: SessionConfig): SessionManager {
    if (!SessionManager.instance) {
      if (!config) throw new Error('SessionManager requires configuration');
      SessionManager.instance = new SessionManager(config);
    }
    return SessionManager.instance;
  }

  async createSession(
    userId: UserId,
    authContext: AuthContext,
    timeout?: number
  ): Promise<SessionData> {
    const sessionId = this.generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (timeout || this.config.defaultTimeout) * 1000);

    // Enforce concurrent session limit
    await this.enforceConcurrentLimit(userId);

    const session: SessionData = {
      sessionId,
      userId,
      status: SessionStatus.ACTIVE,
      createdAt: now.toISOString() as ISOTimestamp,
      lastActivity: now.toISOString() as ISOTimestamp,
      expiresAt: expiresAt.toISOString() as ISOTimestamp,
      device: authContext.device,
      network: authContext.network,
      authContext,
      attributes: {},
      securityContext: {
        riskScore: authContext.metadata.riskScore || 0,
        trustLevel: 'medium',
        mfaVerified: false,
        deviceTrusted: authContext.device.trustLevel === 'trusted'
      }
    };

    this.sessions.set(sessionId, session);
    
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, new Set());
    }
    this.userSessions.get(userId)!.add(sessionId);

    this.emit('session-created', { sessionId, userId });
    return session;
  }

  async getSession(sessionId: SessionId): Promise<SessionData | null> {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== SessionStatus.ACTIVE) {
      return null;
    }

    if (new Date() > new Date(session.expiresAt)) {
      await this.expireSession(sessionId);
      return null;
    }

    return session;
  }

  async updateActivity(sessionId: SessionId): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session && session.status === SessionStatus.ACTIVE) {
      session.lastActivity = new Date().toISOString() as ISOTimestamp;
      this.emit('session-activity', { sessionId });
    }
  }

  async terminateSession(sessionId: SessionId): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = SessionStatus.TERMINATED;
      this.cleanupUserSession(session.userId, sessionId);
      this.sessions.delete(sessionId);
      this.emit('session-terminated', { sessionId, userId: session.userId });
    }
  }

  async terminateUserSessions(userId: UserId): Promise<number> {
    const sessionIds = this.userSessions.get(userId);
    if (!sessionIds) return 0;

    let count = 0;
    for (const sessionId of sessionIds) {
      await this.terminateSession(sessionId);
      count++;
    }

    this.userSessions.delete(userId);
    return count;
  }

  getUserSessions(userId: UserId): SessionData[] {
    const sessionIds = this.userSessions.get(userId);
    if (!sessionIds) return [];

    return Array.from(sessionIds)
      .map(id => this.sessions.get(id))
      .filter((session): session is SessionData => 
        session !== undefined && session.status === SessionStatus.ACTIVE
      );
  }

  private async enforceConcurrentLimit(userId: UserId): Promise<void> {
    const sessions = this.getUserSessions(userId);
    if (sessions.length >= this.config.maxConcurrentSessions) {
      const oldest = sessions.sort((a, b) => 
        new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime()
      )[0];
      await this.terminateSession(oldest.sessionId);
    }
  }

  private async expireSession(sessionId: SessionId): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = SessionStatus.EXPIRED;
      this.cleanupUserSession(session.userId, sessionId);
      this.sessions.delete(sessionId);
      this.emit('session-expired', { sessionId, userId: session.userId });
    }
  }

  private cleanupUserSession(userId: UserId, sessionId: SessionId): void {
    const userSessions = this.userSessions.get(userId);
    if (userSessions) {
      userSessions.delete(sessionId);
      if (userSessions.size === 0) {
        this.userSessions.delete(userId);
      }
    }
  }

  private cleanup(): void {
    const now = new Date();
    for (const [sessionId, session] of this.sessions) {
      if (new Date(session.expiresAt) < now) {
        this.expireSession(sessionId);
      }
    }
  }

  private generateSessionId(): SessionId {
    return `sess_${Date.now()}_${randomBytes(16).toString('hex')}` as SessionId;
  }
}

export const createSessionManager = (config: Partial<SessionConfig> = {}): SessionManager => {
  const defaultConfig: SessionConfig = {
    defaultTimeout: 3600,
    maxTimeout: 86400,
    maxConcurrentSessions: 5,
    storage: 'memory',
    cookieSettings: {
      name: 'ds_session',
      secure: true,
      httpOnly: true,
      sameSite: 'strict'
    },
    ...config
  };

  return SessionManager.getInstance(defaultConfig);
};