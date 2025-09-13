/** @fileoverview Interfaces for Geographic Distribution services. */
import { Uuid } from '../../../types/common.types';
import { GeoLocation, Region } from './types';

export interface IGeoDistributionService {
  getNearestRegion(location: GeoLocation): Promise<Region>;
  listLocationsInRegion(region: Region): Promise<GeoLocation[]>;
  updateLocation(locationId: Uuid, newLocation: GeoLocation): Promise<void>;
}
