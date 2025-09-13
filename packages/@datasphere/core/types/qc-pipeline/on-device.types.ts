/**
 * @fileoverview Types for on-device, real-time validation (Layer 1 of QC).
 * These types define the structure for immediate feedback provided to the worker
 * during the data collection process.
 * @version 1.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID, ISOTimestamp } from '../common.types';

/** The specific type of on-device check performed. */
export type OnDeviceCheckType = 
  | 'BLUR_DETECTION'
  | 'AUDIO_SNR'
  | 'GPS_ACCURACY'
  | 'SENSOR_RANGE'
  | 'IMAGE_RESOLUTION';

/** Represents the result of a single on-device validation check. */
export interface DeviceValidationResult {
  readonly checkId: UUID;
  readonly checkType: OnDeviceCheckType;
  readonly isValid: boolean;
  readonly score: number; // A value from 0 to 1
  readonly message: string;
  readonly timestamp: ISOTimestamp;
  readonly details?: Record<string, any>; // e.g., { blurValue: 120.5, threshold: 100 }
}

/** Defines the configuration for the on-device validation queue for a specific task. */
export interface OnDeviceValidationConfig {
  readonly enabled: boolean;
  readonly checksToPerform: OnDeviceCheckType[];
  readonly realTimeFeedback: boolean;
  readonly offlineQueueing: {
    readonly enabled: boolean;
    readonly maxQueueSize: number;
  };
}
