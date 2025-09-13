/** @fileoverview Types for email notifications. */
import { UUID } from '../common.types';

export type EmailProvider = 'SENDGRID' | 'SES' | 'MAILGUN';

export interface EmailRequest {
  readonly to: string | string[];
  readonly from: { email: string; name: string; };
  readonly subject: string;
  readonly templateId: string;
  readonly templateContext: Record<string, any>;
  readonly provider: EmailProvider;
}

export interface EmailDeliveryReport {
  readonly messageId: string;
  readonly status: 'SENT' | 'DELIVERED' | 'BOUNCED' | 'OPENED' | 'CLICKED';
  readonly providerResponse: any;
}
