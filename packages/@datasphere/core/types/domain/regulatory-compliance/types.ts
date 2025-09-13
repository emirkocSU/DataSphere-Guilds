/** @fileoverview Core types for Regulatory Compliance. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type RegulationStandard = 'GDPR' | 'HIPAA' | 'CCPA' | 'PCI_DSS';

export interface Regulation {
  regulationId: Uuid;
  name: string;
  standard: RegulationStandard;
  jurisdiction: string; // e.g., 'EU', 'California'
  effectiveDate: IsoTimestamp;
  description: string;
}
