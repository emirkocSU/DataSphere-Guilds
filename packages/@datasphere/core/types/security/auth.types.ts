/**
 * @fileoverview Enterprise-grade core types for authentication and authorization.
 * Defines a rich security context for scalable and secure access control.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UserProfile, Permission, UserRole } from './business/user.types';
import { UUID, ISOTimestamp } from '../common.types';

export interface EnrichedSecurityContext {
  readonly user: UserProfile;
  readonly roles: Set<UserRole>;
  readonly permissions: Set<Permission>;
  readonly token: string; // The raw JWT
  readonly issuedAt: ISOTimestamp;
  readonly expiresAt: ISOTimestamp;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly sessionId: UUID;
  readonly isImpersonating: boolean;
  readonly originalUserId?: UUID;
}

// The initial, raw context extracted from a request
export type RawSecurityContext = Partial<
  Pick<EnrichedSecurityContext, 'token' | 'ipAddress' | 'userAgent' | 'sessionId'>
>;

export interface AuthenticationResult {
  readonly isValid: boolean;
  readonly securityContext?: EnrichedSecurityContext;
  readonly failureReason?: string;
  readonly errorCode?: string;
}

export interface AuthorizationResult {
  readonly isAuthorized: boolean;
  readonly failureReason?: string;
  readonly errorCode?: string;
}
