/**
 * @fileoverview Common types for DataSphere core functionality
 * @version 2.0.0
 * @author DataSphere Guilds Engineering
 */

// Re-export from existing common types
export { UUID, ISOTimestamp, Percentage } from "./api/common";

// Additional common types
export type Uuid = string; // UUID alias for consistency
export type ID = string | number;
export type Timestamp = Date | string;
export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export type JSONObject = { [key: string]: JSONValue };
export type JSONArray = JSONValue[];

// Financial types
export interface Money {
  amount: number;
  currency: string;
  precision?: number;
}

// Geographic types
export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
