/**
 * @fileoverview Enterprise Biometric Authentication
 */

import { EventEmitter } from 'events';
import { createHash } from 'crypto';
import { 
  BiometricType, 
  UserId, 
  DeviceId,
  BiometricEnrollment,
  WebAuthnRegistrationOptions,
  WebAuthnAuthenticationOptions 
} from './types';

interface BiometricConfig {
  enabled: boolean;
  supportedTypes: BiometricType[];
  qualityThreshold: number;
  webauthn: {
    rpName: string;
    rpId: string;
    origin: string;
  };
}

interface EnrollmentData {
  userId: UserId;
  deviceId: DeviceId;
  type: BiometricType;
  template: string;
  quality: number;
  createdAt: Date;
}

export class BiometricAuth extends EventEmitter {
  private static instance: BiometricAuth;
  private config: BiometricConfig;
  private enrollments = new Map<string, EnrollmentData>();

  private constructor(config: BiometricConfig) {
    super();
    this.config = config;
  }

  static getInstance(config?: BiometricConfig): BiometricAuth {
    if (!BiometricAuth.instance) {
      if (!config) throw new Error('BiometricAuth requires configuration');
      BiometricAuth.instance = new BiometricAuth(config);
    }
    return BiometricAuth.instance;
  }

  async enrollBiometric(
    userId: UserId,
    deviceId: DeviceId,
    type: BiometricType,
    biometricData: ArrayBuffer
  ): Promise<string> {
    const template = this.processTemplate(biometricData);
    const quality = this.assessQuality(template);
    
    if (quality < this.config.qualityThreshold) {
      throw new Error('Biometric quality insufficient');
    }

    const enrollmentId = this.generateEnrollmentId();
    const enrollment: EnrollmentData = {
      userId,
      deviceId,
      type,
      template,
      quality,
      createdAt: new Date()
    };

    this.enrollments.set(enrollmentId, enrollment);
    this.emit('biometric-enrolled', { enrollmentId, userId, type });
    
    return enrollmentId;
  }

  async verifyBiometric(
    userId: UserId,
    type: BiometricType,
    biometricData: ArrayBuffer
  ): Promise<boolean> {
    const template = this.processTemplate(biometricData);
    
    for (const [id, enrollment] of this.enrollments) {
      if (enrollment.userId === userId && enrollment.type === type) {
        const similarity = this.compareTemplates(enrollment.template, template);
        if (similarity > 0.8) {
          this.emit('biometric-verified', { enrollmentId: id, userId });
          return true;
        }
      }
    }

    this.emit('biometric-failed', { userId, type });
    return false;
  }

  generateWebAuthnRegistration(userId: UserId): WebAuthnRegistrationOptions {
    return {
      challenge: this.generateChallenge(),
      rp: {
        name: this.config.webauthn.rpName,
        id: this.config.webauthn.rpId
      },
      user: {
        id: userId,
        name: userId,
        displayName: userId
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 }
      ],
      authenticatorSelection: {
        userVerification: 'required'
      },
      attestation: 'direct'
    };
  }

  generateWebAuthnAuthentication(): WebAuthnAuthenticationOptions {
    return {
      challenge: this.generateChallenge(),
      timeout: 60000,
      rpId: this.config.webauthn.rpId,
      userVerification: 'required'
    };
  }

  private processTemplate(data: ArrayBuffer): string {
    return createHash('sha256').update(Buffer.from(data)).digest('hex');
  }

  private assessQuality(template: string): number {
    return 0.95; // Simplified quality assessment
  }

  private compareTemplates(template1: string, template2: string): number {
    if (template1 === template2) return 1.0;
    
    let matches = 0;
    const length = Math.min(template1.length, template2.length);
    
    for (let i = 0; i < length; i++) {
      if (template1[i] === template2[i]) matches++;
    }
    
    return matches / length;
  }

  private generateEnrollmentId(): string {
    return `bio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateChallenge(): string {
    return Buffer.from(Math.random().toString()).toString('base64');
  }
}

export const createBiometricAuth = (config: Partial<BiometricConfig> = {}): BiometricAuth => {
  const defaultConfig: BiometricConfig = {
    enabled: true,
    supportedTypes: [BiometricType.FINGERPRINT, BiometricType.FACE_RECOGNITION],
    qualityThreshold: 0.7,
    webauthn: {
      rpName: 'DataSphere',
      rpId: 'datasphere.com',
      origin: 'https://datasphere.com'
    },
    ...config
  };

  return BiometricAuth.getInstance(defaultConfig);
};