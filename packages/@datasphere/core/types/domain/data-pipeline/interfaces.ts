/** @fileoverview Interfaces for Data Pipeline services. */
import { Uuid } from '../../../types/common.types';
import { DataPipeline } from './types';

export interface IDataPipelineService {
  createPipeline(pipeline: Omit<DataPipeline, 'pipelineId' | 'createdAt'>): Promise<DataPipeline>;
  startPipeline(pipelineId: Uuid): Promise<void>;
  stopPipeline(pipelineId: Uuid): Promise<void>;
  getPipelineStatus(pipelineId: Uuid): Promise<DataPipeline | null>;
}
