/**
 * @fileoverview Mock JWT validator for demonstration and development purposes.
 * @warning_security This implementation does NOT verify token signatures and is NOT secure for production.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { Logger } from '../logging/logger';
import { AuthenticationResult, EnrichedSecurityContext } from '../../types/security/auth.types';
import { UserProfile, UserRole, UserStatus } from '../../types/business/user.types';

export interface JWTValidatorOptions {
  // In a real implementation, this would contain issuer, audience, etc.
  mockSecret?: string; // Not used for signature validation, just for demonstration.
}

export class JWTValidator {
  private logger = new Logger('JWTValidator');
  private options: JWTValidatorOptions;

  constructor(options: JWTValidatorOptions = {}) {
    this.options = options;
    this.logger.warn('Initializing MOCK JWTValidator. This is NOT secure for production use.');
  }

  async validate(token: string): Promise<AuthenticationResult> {
    try {
      const payload = this.decode(token);

      if (!payload) {
        return { isValid: false, failureReason: 'Invalid token format.' };
      }

      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return { isValid: false, failureReason: 'Token has expired.', errorCode: 'TOKEN_EXPIRED' };
      }

      const securityContext = this.createSecurityContext(token, payload);

      return {
        isValid: true,
        securityContext,
      };
    } catch (error) {
      this.logger.error('JWT validation failed', error);
      return { isValid: false, failureReason: 'Invalid token', errorCode: 'TOKEN_INVALID' };
    }
  }

  private decode(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = Buffer.from(base64, 'base64').toString();
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  private createSecurityContext(token: string, payload: any): EnrichedSecurityContext {
    const user: UserProfile = {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      roles: (payload.roles as UserRole[]) || [],
      status: 'active' as UserStatus,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
    };
    
    return {
      user,
      token,
      roles: new Set(user.roles),
      permissions: new Set(payload.permissions || []),
      issuedAt: new Date((payload.iat || 0) * 1000).toISOString(),
      expiresAt: new Date((payload.exp || 0) * 1000).toISOString(),
      ipAddress: payload.ip_address || '',
      userAgent: payload.user_agent || '',
      sessionId: payload.sid,
      isImpersonating: false,
    };
  }
} 