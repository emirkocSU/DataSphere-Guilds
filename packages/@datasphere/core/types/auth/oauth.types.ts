/** @fileoverview Types for OAuth2 and OpenID Connect authentication. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type OAuthProvider = 'GOOGLE' | 'FACEBOOK' | 'APPLE' | 'MICROSOFT';

export interface OAuthToken {
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly expiresIn: number; // seconds
  readonly tokenType: string;
  readonly issuedAt: IsoTimestamp;
}

export interface OAuthProfile {
  readonly provider: OAuthProvider;
  readonly providerId: string;
  readonly email: string;
  readonly name?: string;
  readonly picture?: string;
}
