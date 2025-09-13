/** @fileoverview Core types for Data Pipeline. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type PipelineStageType = 'INGESTION' | 'TRANSFORMATION' | 'VALIDATION' | 'LOADING';

export interface DataPipeline {
  pipelineId: Uuid;
  name: string;
  description: string;
  stages: PipelineStage[];
  status: 'ACTIVE' | 'INACTIVE' | 'FAILED';
  createdAt: IsoTimestamp;
}

export interface PipelineStage {
  stageId: Uuid;
  name: string;
  type: PipelineStageType;
  configuration: Record<string, any>;
  order: number;
}
