/** @fileoverview Types for Service Mesh configuration. */
import { Uuid } from '../../../types/common.types';

export type TrafficPolicy = 'ROUND_ROBIN' | 'LEAST_REQUESTS' | 'WEIGHTED';

export interface ServiceMeshConfig {
  readonly meshId: Uuid;
  readonly name: string;
  readonly services: ServiceMeshService[];
  readonly trafficPolicy: TrafficPolicy;
  readonly tracingEnabled: boolean;
  readonly metricsEnabled: boolean;
}

export interface ServiceMeshService {
  readonly serviceId: Uuid;
  readonly name: string;
  readonly version: string;
  readonly endpoints: string[];
  readonly healthCheckPath: string;
}
