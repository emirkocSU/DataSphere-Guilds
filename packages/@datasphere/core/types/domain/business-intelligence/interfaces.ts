/** @fileoverview Interfaces for Business Intelligence services. */
import { Uuid } from '../../../types/common.types';
import { BIReport, ReportType } from './types';

export interface IBIService {
  generateReport(reportType: ReportType, filters?: Record<string, any>): Promise<BIReport>;
  getReport(reportId: Uuid): Promise<BIReport | null>;
  listReports(type?: ReportType): Promise<BIReport[]>;
}
