/** @fileoverview Types for regional compliance and data residency. */
import { Uuid } from '../common.types';

export type CountryCode = 'US' | 'DE' | 'TR' | 'GB'; // ISO 3166-1 alpha-2

export interface DataResidencyPolicy {
  readonly policyId: Uuid;
  readonly region: 'EU' | 'NORTH_AMERICA' | 'APAC';
  readonly storageLocation: string; // e.g., 'aws:eu-central-1'
  readonly dataTypes: string[]; // e.g., ['PII', 'FINANCIAL']
}
