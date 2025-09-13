/**
 * @file packages/@datasphere/core/types/api/common.ts
 * @version 1.0.0
 * @description Common API data structures and enums.
 */

export type UUID = string;
export type ISOTimestamp = string;
export type Percentage = number;

export interface BaseRequest {
  requestId: UUID;
}

export interface BaseResponse<T> {
  data: T;
  serverTimestamp: ISOTimestamp;
}
