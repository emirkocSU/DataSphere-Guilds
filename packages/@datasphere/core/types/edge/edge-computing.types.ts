/** @fileoverview Types for edge computing capabilities. */
import { UUID, ISOTimestamp, Percentage } from '../../types/common.types';

export type EdgeNodeType = 'GATEWAY' | 'DEVICE' | 'MICRO_SERVER';

export interface EdgeNode {
  readonly nodeId: UUID;
  readonly name: string;
  readonly type: EdgeNodeType;
  readonly location: { latitude: number; longitude: number; };
  readonly status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  readonly availableResources: { cpu: Percentage; memory: Percentage; };
}

export interface EdgeFunction {
  readonly functionId: UUID;
  readonly name: string;
  readonly code: string; // Base64 encoded function code
  readonly triggerEvent: string; // e.g., 'sensor.data.received'
  readonly assignedNodeId: UUID;
}
