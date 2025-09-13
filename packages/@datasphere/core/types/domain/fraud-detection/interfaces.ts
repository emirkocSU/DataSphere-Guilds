/** @fileoverview Interfaces for Fraud Detection services. */
import { Uuid } from '../../../types/common.types';
import { FraudSignal } from './types';

export interface IFraudDetectionService {
  detectFraud(data: Record<string, any>): Promise<FraudSignal[]>;
  getFraudSignals(userId: Uuid): Promise<FraudSignal[]>;
  reportFraud(signal: Omit<FraudSignal, 'signalId' | 'timestamp'>): Promise<FraudSignal>;
}
