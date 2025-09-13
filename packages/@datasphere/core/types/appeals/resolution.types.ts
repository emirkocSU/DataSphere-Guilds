/** @fileoverview Types for the resolution and outcome of an appeal. */
import { Uuid, IsoTimestamp, MoneyValue } from '../common.types';

export type ResolutionType = 
  | 'OVERTURN_REJECTION' // Worker was right
  | 'UPHOLD_REJECTION'   // QC was right
  | 'PARTIAL_CREDIT'     // Both parties had a point
  | 'NO_FAULT_REFUND';   // System error

export interface AppealResolution {
  readonly resolutionId: Uuid;
  readonly appealId: Uuid;
  readonly resolvedBy: Uuid;
  readonly resolvedAt: IsoTimestamp;
  readonly type: ResolutionType;
  readonly finalJustification: string;
  readonly compensation?: {
    readonly amount: MoneyValue;
    readonly currency: string;
    readonly reason: string;
  };
  readonly reputationAdjustment?: {
    readonly workerId: Uuid;
    readonly change: number; // e.g., +0.05
  };
}
