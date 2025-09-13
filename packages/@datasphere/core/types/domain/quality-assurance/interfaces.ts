/** @fileoverview Interfaces for Quality Assurance services. */
import { Uuid } from '../../../types/common.types';
import { QAProcess } from './types';

export interface IQAService {
  startQAProcess(submissionId: Uuid): Promise<QAProcess>;
  getQAProcess(processId: Uuid): Promise<QAProcess | null>;
  updateQAProcess(processId: Uuid, updates: Partial<QAProcess>): Promise<QAProcess>;
}
