/** @fileoverview Types for handling timezones. */
import { IsoTimestamp } from '../common.types';

export interface Timezone {
  readonly name: string; // e.g., 'Europe/Istanbul'
  readonly offset: string; // e.g., '+03:00'
  readonly observesDst: boolean;
}

export interface TimezoneConversionRequest {
  readonly sourceTimestamp: IsoTimestamp;
  readonly sourceTimezone: string;
  readonly targetTimezone: string;
}
