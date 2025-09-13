/**
 * @fileoverview Enterprise MFA Service - Multi-Factor Authentication
 */

import { EventEmitter } from 'events';
import { randomBytes, createHmac } from 'crypto';
import { 
  AuthMethod, 
  MFAChallenge, 
  UserId, 
  SessionId, 
  DeviceId,
  ISOTimestamp,
  MFAConfiguration,
  MFADevice 
} from './types';

interface MFAConfig {
  enabled: boolean;
  requiredMethods: AuthMethod[];
  gracePeriod: number;
  backupCodeCount: number;
  totpIssuer: string;
  providers: {
    sms: { provider: string; config: any };
    email: { provider: string; config: any };
  };
}

interface Challenge {
  id: string;
  userId: UserId;
  method: AuthMethod;
  code: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}

export class MFAService extends EventEmitter {
  private static instance: MFAService;
  private config: MFAConfig;
  private challenges = new Map<string, Challenge>();
  private devices = new Map<string, MFADevice>();

  private constructor(config: MFAConfig) {
    super();
    this.config = config;
    setInterval(() => this.cleanup(), 300000);
  }

  static getInstance(config?: MFAConfig): MFAService {
    if (!MFAService.instance) {
      if (!config) throw new Error('MFAService requires configuration');
      MFAService.instance = new MFAService(config);
    }
    return MFAService.instance;
  }

  async createChallenge(userId: UserId, method: AuthMethod): Promise<string> {
    const challengeId = randomBytes(16).toString('hex');
    const code = this.generateCode(method);
    const expiresAt = new Date(Date.now() + 300000); // 5 min

    const challenge: Challenge = {
      id: challengeId,
      userId,
      method,
      code,
      expiresAt,
      attempts: 0,
      verified: false
    };

    this.challenges.set(challengeId, challenge);
    await this.sendChallenge(challenge);

    this.emit('challenge-created', { challengeId, userId, method });
    return challengeId;
  }

  async verifyChallenge(challengeId: string, code: string): Promise<boolean> {
    const challenge = this.challenges.get(challengeId);
    if (!challenge || challenge.expiresAt < new Date()) {
      this.emit('challenge-expired', { challengeId });
      return false;
    }

    challenge.attempts++;
    if (challenge.attempts > 3) {
      this.challenges.delete(challengeId);
      this.emit('challenge-failed', { challengeId, reason: 'max-attempts' });
      return false;
    }

    const valid = challenge.code === code;
    if (valid) {
      challenge.verified = true;
      this.challenges.delete(challengeId);
      this.emit('challenge-verified', { challengeId, userId: challenge.userId });
    }

    return valid;
  }

  generateTOTPSecret(): string {
    return randomBytes(20).toString('base32');
  }

  generateTOTPQRCode(userId: string, secret: string): string {
    const issuer = encodeURIComponent(this.config.totpIssuer);
    const user = encodeURIComponent(userId);
    return `otpauth://totp/${issuer}:${user}?secret=${secret}&issuer=${issuer}`;
  }

  verifyTOTP(secret: string, token: string): boolean {
    const window = Math.floor(Date.now() / 30000);
    for (let i = -1; i <= 1; i++) {
      if (this.generateTOTPToken(secret, window + i) === token) {
        return true;
      }
    }
    return false;
  }

  generateBackupCodes(count: number = 10): string[] {
    return Array.from({ length: count }, () => 
      randomBytes(4).toString('hex').toUpperCase()
    );
  }

  private generateCode(method: AuthMethod): string {
    switch (method) {
      case AuthMethod.SMS_OTP:
      case AuthMethod.EMAIL_OTP:
        return Math.floor(100000 + Math.random() * 900000).toString();
      case AuthMethod.TOTP:
        return randomBytes(3).toString('hex');
      default:
        return randomBytes(6).toString('hex');
    }
  }

  private generateTOTPToken(secret: string, counter: number): string {
    const buffer = Buffer.allocUnsafe(8);
    buffer.writeUInt32BE(0, 0);
    buffer.writeUInt32BE(counter, 4);
    
    const hmac = createHmac('sha1', Buffer.from(secret, 'base32'));
    const hash = hmac.update(buffer).digest();
    const offset = hash[hash.length - 1] & 0xf;
    const code = ((hash[offset] & 0x7f) << 24) |
                 ((hash[offset + 1] & 0xff) << 16) |
                 ((hash[offset + 2] & 0xff) << 8) |
                 (hash[offset + 3] & 0xff);
    
    return (code % 1000000).toString().padStart(6, '0');
  }

  private async sendChallenge(challenge: Challenge): Promise<void> {
    switch (challenge.method) {
      case AuthMethod.SMS_OTP:
        await this.sendSMS(challenge);
        break;
      case AuthMethod.EMAIL_OTP:
        await this.sendEmail(challenge);
        break;
    }
  }

  private async sendSMS(challenge: Challenge): Promise<void> {
    this.emit('sms-sent', { challengeId: challenge.id, userId: challenge.userId });
  }

  private async sendEmail(challenge: Challenge): Promise<void> {
    this.emit('email-sent', { challengeId: challenge.id, userId: challenge.userId });
  }

  private cleanup(): void {
    const now = new Date();
    for (const [id, challenge] of this.challenges) {
      if (challenge.expiresAt < now) {
        this.challenges.delete(id);
      }
    }
  }
}

export const createMFAService = (config: Partial<MFAConfig> = {}): MFAService => {
  const defaultConfig: MFAConfig = {
    enabled: true,
    requiredMethods: [AuthMethod.TOTP],
    gracePeriod: 86400,
    backupCodeCount: 10,
    totpIssuer: 'DataSphere',
    providers: {
      sms: { provider: 'twilio', config: {} },
      email: { provider: 'sendgrid', config: {} }
    },
    ...config
  };

  return MFAService.getInstance(defaultConfig);
};