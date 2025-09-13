/** @fileoverview Types for user session management. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export interface UserSession {
  readonly sessionId: Uuid;
  readonly userId: Uuid;
  readonly isAuthenticated: boolean;
  readonly createdAt: IsoTimestamp;
  readonly expiresAt: IsoTimestamp;
  readonly lastActivityAt: IsoTimestamp;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly deviceId?: Uuid;
}
