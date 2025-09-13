/**
 * @fileoverview Lean, high-performance transaction types for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

import { UUID } from "../api/common";

export interface TransactionContext {
  id: UUID;
  startTime: Date;
  isolationLevel: IsolationLevel;
  readOnly?: boolean;
  timeout?: number;
  metadata?: TransactionMetadata;
}

export interface TransactionMetadata {
  userId?: UUID;
  source?: string;
  traceId?: string;
  parentTransactionId?: UUID;
  tags?: Record<string, string>;
}

export type IsolationLevel = 
  | 'READ_UNCOMMITTED'
  | 'READ_COMMITTED' 
  | 'REPEATABLE_READ'
  | 'SERIALIZABLE';
