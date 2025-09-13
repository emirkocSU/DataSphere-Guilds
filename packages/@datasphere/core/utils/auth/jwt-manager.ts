/**
 * @fileoverview Enterprise JWT Manager - Advanced Token Management
 * 
 * Comprehensive JWT token management system with enterprise features including
 * token generation, validation, rotation, blacklisting, and integration with
 * the authentication type system for unicorn-level security.
 */

import { createHash, randomBytes } from 'crypto';
import { sign, verify, decode, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { EventEmitter } from 'events';
import {
  JWTPayload,
  TokenId,
  SessionId,
  UserId,
  TokenType,
  AuthMethod,
  ISOTimestamp,
  AuthConfig,
  OAuth2TokenResponse
} from './types';

interface JWTConfig {
  issuer: string;
  audience: string[];
  secretKey: string;
  algorithm: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512';
  accessTokenTTL: number; // seconds
  refreshTokenTTL: number; // seconds
  idTokenTTL: number; // seconds
  rotationPolicy: {
    enabled: boolean;
    refreshThreshold: number; // percentage of TTL
    maxRefreshes: number;
  };
  security: {
    enableJTI: boolean;
    enableTokenBlacklist: boolean;
    enableAudience: boolean;
    enableIssuer: boolean;
    leewaySeconds: number;
  };
}

interface TokenValidationResult {
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
  errorCode?: 'EXPIRED' | 'INVALID' | 'BLACKLISTED' | 'MALFORMED' | 'UNAUTHORIZED';
  metadata: {
    issuedAt: Date;
    expiresAt: Date;
    remainingTime: number;
    needsRefresh: boolean;
  };
}

interface TokenGenerationOptions {
  userId: UserId;
  sessionId: SessionId;
  authMethods: AuthMethod[];
  acr?: string;
  customClaims?: Record<string, unknown>;
  audience?: string[];
  expiresIn?: number;
}

interface TokenRotationResult {
  newToken: string;
  newRefreshToken?: string;
  rotationId: string;
  expiresAt: Date;
  metadata: {
    originalTokenId: TokenId;
    rotationCount: number;
    rotationTimestamp: ISOTimestamp;
  };
}

interface BlacklistedToken {
  tokenId: TokenId;
  userId: UserId;
  blacklistedAt: ISOTimestamp;
  reason: 'logout' | 'security' | 'rotation' | 'expired' | 'admin';
  expiresAt: Date;
}

interface TokenMetrics {
  totalGenerated: number;
  totalValidated: number;
  totalRotated: number;
  totalBlacklisted: number;
  validationErrors: {
    expired: number;
    invalid: number;
    blacklisted: number;
    malformed: number;
  };
  averageValidationTime: number;
  activeTokens: number;
}

/**
 * Enterprise JWT Manager
 * 
 * Provides comprehensive JWT token management with enterprise security features,
 * token rotation, blacklisting, and detailed analytics.
 */
export class JWTManager extends EventEmitter {
  private static instance: JWTManager;
  private config: JWTConfig;
  private blacklistedTokens: Map<TokenId, BlacklistedToken> = new Map();
  private tokenMetadata: Map<TokenId, any> = new Map();
  private metrics: TokenMetrics;
  private cleanupTimer?: NodeJS.Timeout;

  private constructor(config: JWTConfig) {
    super();
    this.config = config;
    this.metrics = {
      totalGenerated: 0,
      totalValidated: 0,
      totalRotated: 0,
      totalBlacklisted: 0,
      validationErrors: {
        expired: 0,
        invalid: 0,
        blacklisted: 0,
        malformed: 0
      },
      averageValidationTime: 0,
      activeTokens: 0
    };

    this.startCleanupTimer();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: JWTConfig): JWTManager {
    if (!JWTManager.instance) {
      if (!config) {
        throw new Error('JWTManager requires configuration on first instantiation');
      }
      JWTManager.instance = new JWTManager(config);
    }
    return JWTManager.instance;
  }

  /**
   * Generate access token
   */
  public generateAccessToken(options: TokenGenerationOptions): string {
    const tokenId = this.generateTokenId();
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = options.expiresIn || this.config.accessTokenTTL;

    const payload: JWTPayload = {
      sub: options.userId,
      iss: this.config.issuer,
      aud: options.audience || this.config.audience,
      exp: now + expiresIn,
      nbf: now,
      iat: now,
      jti: tokenId,
      sid: options.sessionId,
      auth_time: now,
      amr: options.authMethods,
      acr: options.acr || '1',
      ...options.customClaims
    };

    const token = sign(payload, this.config.secretKey, {
      algorithm: this.config.algorithm,
      issuer: this.config.issuer,
      audience: this.config.audience
    });

    this.storeTokenMetadata(tokenId, {
      type: TokenType.ACCESS_TOKEN,
      userId: options.userId,
      sessionId: options.sessionId,
      createdAt: new Date(),
      expiresAt: new Date((now + expiresIn) * 1000),
      rotationCount: 0
    });

    this.metrics.totalGenerated++;
    this.metrics.activeTokens++;

    this.emit('token-generated', {
      tokenId,
      type: TokenType.ACCESS_TOKEN,
      userId: options.userId,
      sessionId: options.sessionId,
      expiresAt: new Date((now + expiresIn) * 1000)
    });

    return token;
  }

  /**
   * Generate refresh token
   */
  public generateRefreshToken(options: TokenGenerationOptions): string {
    const tokenId = this.generateTokenId();
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = this.config.refreshTokenTTL;

    const payload: JWTPayload = {
      sub: options.userId,
      iss: this.config.issuer,
      aud: this.config.audience,
      exp: now + expiresIn,
      iat: now,
      jti: tokenId,
      sid: options.sessionId,
      auth_time: now,
      amr: options.authMethods,
      acr: options.acr || '1'
    };

    const token = sign(payload, this.config.secretKey, {
      algorithm: this.config.algorithm,
      issuer: this.config.issuer,
      audience: this.config.audience
    });

    this.storeTokenMetadata(tokenId, {
      type: TokenType.REFRESH_TOKEN,
      userId: options.userId,
      sessionId: options.sessionId,
      createdAt: new Date(),
      expiresAt: new Date((now + expiresIn) * 1000),
      rotationCount: 0
    });

    this.metrics.totalGenerated++;

    this.emit('token-generated', {
      tokenId,
      type: TokenType.REFRESH_TOKEN,
      userId: options.userId,
      sessionId: options.sessionId,
      expiresAt: new Date((now + expiresIn) * 1000)
    });

    return token;
  }

  /**
   * Generate ID token (OIDC)
   */
  public generateIdToken(options: TokenGenerationOptions): string {
    const tokenId = this.generateTokenId();
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = this.config.idTokenTTL;

    const payload: JWTPayload = {
      sub: options.userId,
      iss: this.config.issuer,
      aud: options.audience || this.config.audience,
      exp: now + expiresIn,
      iat: now,
      jti: tokenId,
      sid: options.sessionId,
      auth_time: now,
      amr: options.authMethods,
      acr: options.acr || '1',
      ...options.customClaims
    };

    const token = sign(payload, this.config.secretKey, {
      algorithm: this.config.algorithm,
      issuer: this.config.issuer,
      audience: this.config.audience
    });

    this.storeTokenMetadata(tokenId, {
      type: TokenType.ID_TOKEN,
      userId: options.userId,
      sessionId: options.sessionId,
      createdAt: new Date(),
      expiresAt: new Date((now + expiresIn) * 1000),
      rotationCount: 0
    });

    this.metrics.totalGenerated++;

    this.emit('token-generated', {
      tokenId,
      type: TokenType.ID_TOKEN,
      userId: options.userId,
      sessionId: options.sessionId,
      expiresAt: new Date((now + expiresIn) * 1000)
    });

    return token;
  }

  /**
   * Generate complete token set
   */
  public generateTokenSet(options: TokenGenerationOptions): OAuth2TokenResponse {
    const accessToken = this.generateAccessToken(options);
    const refreshToken = this.generateRefreshToken(options);
    const idToken = this.generateIdToken(options);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: this.config.accessTokenTTL,
      refresh_token: refreshToken,
      id_token: idToken,
      scope: 'openid profile email'
    };
  }

  /**
   * Validate token
   */
  public async validateToken(token: string, expectedAudience?: string): Promise<TokenValidationResult> {
    const startTime = Date.now();

    try {
      // Basic format validation
      if (!token || typeof token !== 'string') {
        this.metrics.validationErrors.malformed++;
        return this.createValidationError('MALFORMED', 'Invalid token format');
      }

      // Decode without verification first to get JTI
      const decoded = decode(token, { complete: true });
      if (!decoded || typeof decoded === 'string' || !decoded.payload) {
        this.metrics.validationErrors.malformed++;
        return this.createValidationError('MALFORMED', 'Token cannot be decoded');
      }

      const payload = decoded.payload as JWTPayload;

      // Check blacklist
      if (this.config.security.enableTokenBlacklist && payload.jti) {
        if (this.isTokenBlacklisted(payload.jti)) {
          this.metrics.validationErrors.blacklisted++;
          return this.createValidationError('BLACKLISTED', 'Token has been blacklisted');
        }
      }

      // Verify token signature and claims
      const verifiedPayload = verify(token, this.config.secretKey, {
        algorithms: [this.config.algorithm],
        issuer: this.config.security.enableIssuer ? this.config.issuer : undefined,
        audience: this.config.security.enableAudience ? (expectedAudience || this.config.audience) : undefined,
        clockTolerance: this.config.security.leewaySeconds
      }) as JWTPayload;

      // Calculate metadata
      const issuedAt = new Date(verifiedPayload.iat * 1000);
      const expiresAt = new Date(verifiedPayload.exp * 1000);
      const now = new Date();
      const remainingTime = expiresAt.getTime() - now.getTime();
      const totalLifetime = expiresAt.getTime() - issuedAt.getTime();
      const usedPercentage = (totalLifetime - remainingTime) / totalLifetime;
      const needsRefresh = this.config.rotationPolicy.enabled && 
                          usedPercentage >= (this.config.rotationPolicy.refreshThreshold / 100);

      this.metrics.totalValidated++;
      this.updateAverageValidationTime(Date.now() - startTime);

      this.emit('token-validated', {
        tokenId: verifiedPayload.jti,
        userId: verifiedPayload.sub,
        sessionId: verifiedPayload.sid,
        valid: true,
        remainingTime,
        needsRefresh
      });

      return {
        valid: true,
        payload: verifiedPayload,
        metadata: {
          issuedAt,
          expiresAt,
          remainingTime,
          needsRefresh
        }
      };

    } catch (error) {
      this.updateAverageValidationTime(Date.now() - startTime);

      if (error instanceof TokenExpiredError) {
        this.metrics.validationErrors.expired++;
        return this.createValidationError('EXPIRED', 'Token has expired');
      }

      if (error instanceof JsonWebTokenError) {
        this.metrics.validationErrors.invalid++;
        return this.createValidationError('INVALID', error.message);
      }

      this.metrics.validationErrors.invalid++;
      return this.createValidationError('INVALID', 'Token validation failed');
    }
  }

  /**
   * Rotate token (refresh)
   */
  public async rotateToken(refreshToken: string): Promise<TokenRotationResult> {
    const validation = await this.validateToken(refreshToken);
    
    if (!validation.valid || !validation.payload) {
      throw new Error(`Cannot rotate token: ${validation.error}`);
    }

    const originalPayload = validation.payload;
    const metadata = this.tokenMetadata.get(originalPayload.jti);

    if (!metadata) {
      throw new Error('Token metadata not found');
    }

    if (metadata.type !== TokenType.REFRESH_TOKEN) {
      throw new Error('Only refresh tokens can be rotated');
    }

    if (this.config.rotationPolicy.enabled && 
        metadata.rotationCount >= this.config.rotationPolicy.maxRefreshes) {
      throw new Error('Maximum rotation count exceeded');
    }

    // Blacklist old token
    this.blacklistToken(originalPayload.jti, originalPayload.sub, 'rotation');

    // Generate new tokens
    const rotationId = this.generateTokenId();
    const newAccessToken = this.generateAccessToken({
      userId: originalPayload.sub,
      sessionId: originalPayload.sid,
      authMethods: originalPayload.amr,
      acr: originalPayload.acr,
      audience: Array.isArray(originalPayload.aud) ? originalPayload.aud : [originalPayload.aud]
    });

    const newRefreshToken = this.generateRefreshToken({
      userId: originalPayload.sub,
      sessionId: originalPayload.sid,
      authMethods: originalPayload.amr,
      acr: originalPayload.acr,
      audience: Array.isArray(originalPayload.aud) ? originalPayload.aud : [originalPayload.aud]
    });

    // Update rotation count
    const newRefreshPayload = decode(newRefreshToken) as JWTPayload;
    if (newRefreshPayload?.jti) {
      const newMetadata = this.tokenMetadata.get(newRefreshPayload.jti);
      if (newMetadata) {
        newMetadata.rotationCount = metadata.rotationCount + 1;
      }
    }

    this.metrics.totalRotated++;

    const result: TokenRotationResult = {
      newToken: newAccessToken,
      newRefreshToken,
      rotationId,
      expiresAt: new Date(Date.now() + this.config.accessTokenTTL * 1000),
      metadata: {
        originalTokenId: originalPayload.jti,
        rotationCount: metadata.rotationCount + 1,
        rotationTimestamp: new Date().toISOString() as ISOTimestamp
      }
    };

    this.emit('token-rotated', {
      originalTokenId: originalPayload.jti,
      newTokenId: decode(newAccessToken)?.jti,
      userId: originalPayload.sub,
      sessionId: originalPayload.sid,
      rotationId,
      rotationCount: metadata.rotationCount + 1
    });

    return result;
  }

  /**
   * Blacklist token
   */
  public blacklistToken(
    tokenId: TokenId, 
    userId: UserId, 
    reason: BlacklistedToken['reason'] = 'security'
  ): void {
    const metadata = this.tokenMetadata.get(tokenId);
    const expiresAt = metadata?.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000);

    const blacklistedToken: BlacklistedToken = {
      tokenId,
      userId,
      blacklistedAt: new Date().toISOString() as ISOTimestamp,
      reason,
      expiresAt
    };

    this.blacklistedTokens.set(tokenId, blacklistedToken);
    this.tokenMetadata.delete(tokenId);
    this.metrics.totalBlacklisted++;
    this.metrics.activeTokens = Math.max(0, this.metrics.activeTokens - 1);

    this.emit('token-blacklisted', {
      tokenId,
      userId,
      reason,
      blacklistedAt: blacklistedToken.blacklistedAt
    });
  }

  /**
   * Blacklist all tokens for user
   */
  public blacklistUserTokens(userId: UserId, reason: BlacklistedToken['reason'] = 'security'): number {
    let count = 0;
    
    for (const [tokenId, metadata] of this.tokenMetadata) {
      if (metadata.userId === userId) {
        this.blacklistToken(tokenId, userId, reason);
        count++;
      }
    }

    this.emit('user-tokens-blacklisted', {
      userId,
      count,
      reason,
      timestamp: new Date().toISOString()
    });

    return count;
  }

  /**
   * Blacklist all tokens for session
   */
  public blacklistSessionTokens(sessionId: SessionId, reason: BlacklistedToken['reason'] = 'logout'): number {
    let count = 0;
    
    for (const [tokenId, metadata] of this.tokenMetadata) {
      if (metadata.sessionId === sessionId) {
        this.blacklistToken(tokenId, metadata.userId, reason);
        count++;
      }
    }

    this.emit('session-tokens-blacklisted', {
      sessionId,
      count,
      reason,
      timestamp: new Date().toISOString()
    });

    return count;
  }

  /**
   * Check if token is blacklisted
   */
  public isTokenBlacklisted(tokenId: TokenId): boolean {
    return this.blacklistedTokens.has(tokenId);
  }

  /**
   * Get token metrics
   */
  public getMetrics(): TokenMetrics {
    return { ...this.metrics };
  }

  /**
   * Get blacklisted tokens
   */
  public getBlacklistedTokens(userId?: UserId): BlacklistedToken[] {
    const tokens = Array.from(this.blacklistedTokens.values());
    return userId ? tokens.filter(token => token.userId === userId) : tokens;
  }

  /**
   * Clean up expired tokens and blacklist entries
   */
  public cleanup(): void {
    const now = new Date();
    let cleanedTokens = 0;
    let cleanedBlacklist = 0;

    // Clean expired token metadata
    for (const [tokenId, metadata] of this.tokenMetadata) {
      if (metadata.expiresAt < now) {
        this.tokenMetadata.delete(tokenId);
        this.metrics.activeTokens = Math.max(0, this.metrics.activeTokens - 1);
        cleanedTokens++;
      }
    }

    // Clean expired blacklist entries
    for (const [tokenId, blacklistedToken] of this.blacklistedTokens) {
      if (blacklistedToken.expiresAt < now) {
        this.blacklistedTokens.delete(tokenId);
        cleanedBlacklist++;
      }
    }

    this.emit('cleanup-completed', {
      cleanedTokens,
      cleanedBlacklist,
      activeTokens: this.metrics.activeTokens,
      blacklistedTokens: this.blacklistedTokens.size,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Update configuration
   */
  public updateConfig(updates: Partial<JWTConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('config-updated', { config: this.config, timestamp: new Date().toISOString() });
  }

  /**
   * Shutdown JWT manager
   */
  public shutdown(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.emit('shutdown', {
      finalMetrics: this.getMetrics(),
      activeTokens: this.metrics.activeTokens,
      blacklistedTokens: this.blacklistedTokens.size,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Generate unique token ID
   */
  private generateTokenId(): TokenId {
    return `jwt_${Date.now()}_${randomBytes(16).toString('hex')}` as TokenId;
  }

  /**
   * Store token metadata
   */
  private storeTokenMetadata(tokenId: TokenId, metadata: any): void {
    this.tokenMetadata.set(tokenId, metadata);
  }

  /**
   * Create validation error result
   */
  private createValidationError(code: TokenValidationResult['errorCode'], message: string): TokenValidationResult {
    return {
      valid: false,
      error: message,
      errorCode: code,
      metadata: {
        issuedAt: new Date(0),
        expiresAt: new Date(0),
        remainingTime: 0,
        needsRefresh: false
      }
    };
  }

  /**
   * Update average validation time
   */
  private updateAverageValidationTime(duration: number): void {
    const total = this.metrics.averageValidationTime * this.metrics.totalValidated + duration;
    this.metrics.averageValidationTime = total / (this.metrics.totalValidated + 1);
  }

  /**
   * Start cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, 60 * 60 * 1000); // Every hour
  }
}

/**
 * Create JWT manager instance
 */
export const createJWTManager = (config: Partial<JWTConfig> = {}): JWTManager => {
  const defaultConfig: JWTConfig = {
    issuer: config.issuer || 'datasphere-auth',
    audience: config.audience || ['datasphere-api'],
    secretKey: config.secretKey || process.env.JWT_SECRET || 'default-secret-key',
    algorithm: config.algorithm || 'HS256',
    accessTokenTTL: config.accessTokenTTL || 900, // 15 minutes
    refreshTokenTTL: config.refreshTokenTTL || 2592000, // 30 days
    idTokenTTL: config.idTokenTTL || 3600, // 1 hour
    rotationPolicy: {
      enabled: config.rotationPolicy?.enabled ?? true,
      refreshThreshold: config.rotationPolicy?.refreshThreshold || 80,
      maxRefreshes: config.rotationPolicy?.maxRefreshes || 10
    },
    security: {
      enableJTI: config.security?.enableJTI ?? true,
      enableTokenBlacklist: config.security?.enableTokenBlacklist ?? true,
      enableAudience: config.security?.enableAudience ?? true,
      enableIssuer: config.security?.enableIssuer ?? true,
      leewaySeconds: config.security?.leewaySeconds || 10
    }
  };

  return JWTManager.getInstance({ ...defaultConfig, ...config });
};

// Default export
export default JWTManager;