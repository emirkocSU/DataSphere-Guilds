/** @fileoverview Types for Biometric authentication (Fingerprint, Face ID). */
import { Uuid } from '../../types/common.types';

export type BiometricType = 'FINGERPRINT' | 'FACE_ID';

export interface BiometricAuth {
  readonly userId: Uuid;
  readonly type: BiometricType;
  readonly isEnrolled: boolean;
  readonly lastUsed: Date;
  readonly deviceId: Uuid; // Device where biometric is enrolled
}
