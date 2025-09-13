/** @fileoverview Factory for creating and enriching error objects. */
import { Uuid } from '../types/common.types';
import { ERROR_CODES } from '../constants/error.constants';

export interface ErrorFactoryOptions {
  code?: string;
  message?: string;
  details?: Record<string, any>;
  traceId?: Uuid;
}

export function createError(options: ErrorFactoryOptions): { code: string; message: string; details?: Record<string, any>; traceId: Uuid } {
  const code = options.code || ERROR_CODES.UNKNOWN;
  const message = options.message || ERROR_CODES[code]?.message || 'An unexpected error occurred.';
  const traceId = options.traceId || 'generated-uuid'; // In real app, use uuid.v4()

  return {
    code,
    message,
    details: options.details,
    traceId,
  };
}
