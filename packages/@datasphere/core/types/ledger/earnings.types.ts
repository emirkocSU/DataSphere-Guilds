/** @fileoverview Types related to worker earnings and incentives. */
import { Uuid, IsoTimestamp, MoneyValue } from '../common.types';

export type EarningType = 'TASK_REWARD' | 'BONUS' | 'REFERRAL' | 'REPUTATION_BONUS';

export interface Earning {
  readonly earningId: Uuid;
  readonly workerId: Uuid;
  readonly taskId?: Uuid;
  readonly type: EarningType;
  readonly amount: MoneyValue;
  readonly currency: string;
  readonly description: string;
  readonly createdAt: IsoTimestamp;
}

export interface BonusStructure {
  readonly bonusId: Uuid;
  readonly name: string;
  readonly type: 'STREAK' | 'PERFORMANCE' | 'EVENT';
  readonly amount: MoneyValue;
  readonly isActive: boolean;
}
