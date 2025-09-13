/**
 * @fileoverview Lean, high-performance query types for DataSphere unicorn-scale operations
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

export interface QueryOptions<T = any> {
  filter?: FilterOptions<T>;
  sort?: SortOptions<T>[];
  pagination?: PaginationOptions;
  include?: string[];
  exclude?: string[];
  timeout?: number;
}

export interface FilterOptions<T> {
  [K in keyof T]?: T[K]  < /dev/null |  FilterOperator<T[K]>;
}

export interface FilterOperator<T> {
  $eq?: T;
  $ne?: T;
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $in?: T[];
  $nin?: T[];
  $exists?: boolean;
  $regex?: string;
}

export interface SortOptions<T> {
  field: keyof T;
  direction: "asc" | "desc";
  nullsFirst?: boolean;
}

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  offset?: number;
  limit?: number;
  cursor?: string;
}
