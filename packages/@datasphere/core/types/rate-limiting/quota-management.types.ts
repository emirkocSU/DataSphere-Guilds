/** @fileoverview Types for managing user and API quotas. */
import { Uuid } from '../common.types';

export type QuotaPeriod = 'HOURLY' | 'DAILY' | 'MONTHLY';

export interface QuotaPolicy {
  readonly policyId: Uuid;
  readonly name: string;
  readonly appliesTo: 'USER_TIER' | 'API_KEY' | 'SERVICE';
  readonly limit: number;
  readonly period: QuotaPeriod;
  readonly overageHandling: 'BLOCK' | 'PAY_AS_YOU_GO';
}
