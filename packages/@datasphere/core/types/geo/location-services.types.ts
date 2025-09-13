/** @fileoverview Types for location and geofencing services. */
import { Uuid } from '../common.types';

export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface GeoFence {
  readonly fenceId: Uuid;
  readonly name: string;
  readonly shape: 'CIRCLE' | 'POLYGON';
  readonly definition: Coordinates | Coordinates[];
  readonly radiusMeters?: number;
}

export interface LocationPrivacySettings {
  readonly userId: Uuid;
  readonly precision: 'EXACT' | 'CITY_LEVEL' | 'COUNTRY_LEVEL';
  readonly allowHistory: boolean;
}
