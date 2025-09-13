/** @fileoverview Interfaces for Regulatory Compliance services. */
import { Uuid } from '../../../types/common.types';
import { Regulation, RegulationStandard } from './types';

export interface IRegulatoryComplianceService {
  getRegulation(regulationId: Uuid): Promise<Regulation | null>;
  evaluateDataCompliance(data: Record<string, any>, standard: RegulationStandard): Promise<boolean>;
  listRegulations(standard?: RegulationStandard): Promise<Regulation[]>;
}
