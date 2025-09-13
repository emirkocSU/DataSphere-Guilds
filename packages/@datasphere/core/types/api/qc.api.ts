/** @fileoverview API types for Quality Control related requests and responses. */
import { Uuid } from '../../types/common.types';

export interface QCSubmissionRequest {
  submissionId: Uuid;
  reviewerId: Uuid;
  decision: 'APPROVE' | 'REJECT';
  feedback?: string;
}

export interface QCSubmissionResponse {
  qcId: Uuid;
  status: 'PROCESSED' | 'ERROR';
}
