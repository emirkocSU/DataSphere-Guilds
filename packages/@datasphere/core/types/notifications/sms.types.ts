/** @fileoverview Types for SMS notifications. */
import { UUID } from '../common.types';

export type SmsProvider = 'TWILIO' | 'SNS' | 'NEXMO';

export interface SmsRequest {
  readonly to: string; // E.164 format
  readonly from: string; // Sender ID or phone number
  readonly body: string;
  readonly provider: SmsProvider;
}

export interface SmsDeliveryReport {
  readonly messageSid: string;
  readonly status: 'QUEUED' | 'SENDING' | 'SENT' | 'FAILED' | 'DELIVERED';
  readonly errorCode?: number;
}
