/** @fileoverview Core types for Geographic Distribution. */
import { Uuid } from '../../../types/common.types';

export type Region = 'NORTH_AMERICA' | 'EUROPE' | 'ASIA_PACIFIC';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  countryCode: string;
  region?: Region;
}
