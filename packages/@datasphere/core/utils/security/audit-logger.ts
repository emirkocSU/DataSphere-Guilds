/**
 * @fileoverview Enterprise-grade, provider-based security audit logger.
 * Ensures all security-sensitive events are sent to a secure, immutable log store.
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { EnrichedSecurityContext } from '../../types/security/auth.types';
import { UUID, ISOTimestamp } from '../../types/common.types';

export enum SecurityEventType {
  USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS',
  USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE',
  USER_LOGOUT = 'USER_LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PERMISSION_GRANTED = 'PERMISSION_GRANTED',
  PERMISSION_REVOKED = 'PERMISSION_REVOKED',
  RESOURCE_ACCESS = 'RESOURCE_ACCESS',
  RESOURCE_DENIED = 'RESOURCE_DENIED',
  API_KEY_CREATED = 'API_KEY_CREATED',
  CONFIG_CHANGE = 'CONFIG_CHANGE',
}

export interface SecurityAuditEvent {
  eventId: UUID;
  eventType: SecurityEventType;
  timestamp: ISOTimestamp;
  actor: {
    userId: UUID;
    roles: string[];
    ipAddress: string;
    userAgent: string;
  };
  target?: {
    type: string; // e.g., 'user', 'project'
    id: UUID;
  };
  context: Record<string, any>; // Event-specific context
  outcome: 'SUCCESS' | 'FAILURE' | 'ATTEMPT';
}

export interface SecurityAuditProvider {
  logEvent(event: SecurityAuditEvent): Promise<void>;
}

// In a real system, you would use a provider for a secure logging service
// like AWS CloudWatch Logs, Google Cloud Logging, or a dedicated security platform.
export class ConsoleAuditProvider implements SecurityAuditProvider {
  async logEvent(event: SecurityAuditEvent): Promise<void> {
    console.log(JSON.stringify({ auditEvent: event }));
  }
}

export class SecurityAuditLogger {
  private provider: SecurityAuditProvider;

  constructor(provider?: SecurityAuditProvider) {
    this.provider = provider || new ConsoleAuditProvider();
  }

  public async log(
    eventType: SecurityEventType,
    securityContext: EnrichedSecurityContext,
    outcome: 'SUCCESS' | 'FAILURE' | 'ATTEMPT',
    target?: { type: string; id: UUID },
    context: Record<string, any> = {}
  ): Promise<void> {
    const event: SecurityAuditEvent = {
      eventId: this.generateEventId(),
      eventType,
      timestamp: new Date().toISOString(),
      actor: {
        userId: securityContext.user.id,
        roles: Array.from(securityContext.roles),
        ipAddress: securityContext.ipAddress,
        userAgent: securityContext.userAgent,
      },
      target,
      context,
      outcome,
    };

    try {
      await this.provider.logEvent(event);
    } catch (error) {
      // Fallback logging in case the primary provider fails.
      // This is critical for security auditing.
      console.error('CRITICAL: Security audit provider failed. Logging to console.', {
        auditEvent: event,
        providerError: error.message,
      });
    }
  }

  private generateEventId(): UUID {
    // In a real system, use a more robust UUID generator.
    return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
} 