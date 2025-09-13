/** @fileoverview Types specific to mobile platform capabilities. */

export interface MobileCapabilities {
  readonly hasCamera: boolean;
  readonly hasGps: boolean;
  readonly hasNfc: boolean;
  readonly hasBiometrics: boolean;
  readonly batteryOptimization: boolean;
}

export interface DeviceFeatures {
  readonly model: string;
  readonly osVersion: string;
  readonly screen: { width: number; height: number; density: number; };
}
