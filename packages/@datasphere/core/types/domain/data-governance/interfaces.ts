/** @fileoverview Interfaces for Data Governance services. */
import { Uuid } from '../../../types/common.types';
import { DataPolicy, DataClassificationLevel } from './types';

export interface IDataGovernanceService {
  createDataPolicy(policy: Omit<DataPolicy, 'policyId'>): Promise<DataPolicy>;
  getDataPolicy(policyId: Uuid): Promise<DataPolicy | null>;
  classifyData(dataId: Uuid, level: DataClassificationLevel): Promise<void>;
}
