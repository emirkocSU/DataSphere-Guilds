/** @fileoverview Types for token rotation strategies. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export interface TokenPair {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly accessTokenExpiresAt: IsoTimestamp;
  readonly refreshTokenExpiresAt: IsoTimestamp;
}

export interface TokenRotationPolicy {
  readonly policyId: Uuid;
  readonly name: string;
  readonly accessTokenLifetimeSeconds: number;
  readonly refreshTokenLifetimeSeconds: number;
  readonly rotationIntervalSeconds: number;
  readonly reuseIntervalSeconds: number; // How long a used refresh token can be reused
}
