/** @fileoverview Types for Multi-Factor Authentication (MFA/2FA). */
import { Uuid } from '../../types/common.types';

export type MfaMethod = 'TOTP' | 'SMS' | 'EMAIL' | 'BIOMETRIC';

export interface MfaConfig {
  readonly userId: Uuid;
  readonly method: MfaMethod;
  readonly isEnabled: boolean;
  readonly secret?: string; // For TOTP
  readonly phoneNumber?: string; // For SMS
  readonly email?: string; // For Email
}

export interface MfaChallenge {
  readonly challengeId: Uuid;
  readonly userId: Uuid;
  readonly method: MfaMethod;
  readonly code?: string; // Code sent to user
  readonly expiresAt: Date;
  readonly isVerified: boolean;
}
