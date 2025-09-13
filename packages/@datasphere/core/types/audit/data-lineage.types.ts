/** @fileoverview Types for tracking data lineage. */
import { Uuid, IsoTimestamp } from '../common.types';

export interface DataLineageNode {
  readonly entityId: Uuid;
  readonly entityType: string;
  readonly version: number;
  readonly timestamp: IsoTimestamp;
  readonly operation: 'CREATE' | 'UPDATE' | 'TRANSFORM' | 'DELETE';
  readonly sourceIds: Uuid[];
  readonly actorId: Uuid;
}

export interface DataFlowGraph {
  readonly nodes: DataLineageNode[];
  readonly edges: { from: Uuid; to: Uuid; }[];
}
