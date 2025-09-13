/** @fileoverview Factory for building standardized API responses. */
import { Uuid, IsoTimestamp } from '../types/common.types';
import { BaseResponse, PaginatedResponse } from '../types/api.types';

export interface ApiResponseBuilderOptions<T> {
  data: T;
  requestId?: Uuid;
  serverTimestamp?: IsoTimestamp;
}

export function buildSuccessResponse<T>(options: ApiResponseBuilderOptions<T>): BaseResponse<T> {
  return {
    data: options.data,
    requestId: options.requestId || 'generated-uuid', // In real app, use uuid.v4()
    serverTimestamp: options.serverTimestamp || new Date().toISOString(),
  };
}

export function buildPaginatedResponse<T>(options: { data: T[]; total: number; limit: number; offset: number; requestId?: Uuid; serverTimestamp?: IsoTimestamp; }): PaginatedResponse<T> {
  return {
    data: options.data,
    requestId: options.requestId || 'generated-uuid',
    serverTimestamp: options.serverTimestamp || new Date().toISOString(),
    pagination: {
      total: options.total,
      limit: options.limit,
      offset: options.offset,
    },
  };
}
