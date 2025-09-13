/**
 * DataSphere Guilds - Sensor Device Management Types
 * Optimized for hardware interfaces, device control, and mobile performance
 * 
 * Bundle Impact: ~4-5KB (vs 10KB in monolith)
 * Performance Focus: Hardware efficiency, device lifecycle, mobile device management
 */

import { BaseSensorData, SensorId, TimestampISO, SensorStatus, SensorType } from './sensor-core';
import { ConnectionType, ConnectionInfo } from './sensor-connectivity';

// ==================== CORE DEVICE TYPES ====================

export type DeviceCategory = 
  | 'environmental' | 'motion' | 'optical' | 'audio' | 'chemical' 
  | 'biometric' | 'location' | 'industrial' | 'iot' | 'wearable' | 'mobile';

export type DeviceState = 'active' | 'idle' | 'calibrating' | 'error' | 'maintenance' | 'offline';

export type PowerSource = 'battery' | 'usb' | 'solar' | 'wireless' | 'grid' | 'kinetic' | 'hybrid';

export interface DeviceInfo {
  readonly id: string;
  readonly name: string;
  readonly category: DeviceCategory;
  readonly manufacturer: string;
  readonly model: string;
  readonly firmwareVersion: string;
  readonly hardwareRevision: string;
  readonly serialNumber: string;
  readonly manufactureDate: TimestampISO;
  readonly powerSource: PowerSource;
  readonly operatingSystem?: string;
}

// ==================== HARDWARE SPECIFICATIONS ====================

export interface HardwareSpecs {
  readonly processorType: string;
  readonly processorSpeedMHz: number;
  readonly ramMB: number;
  readonly storageMB: number;
  readonly operatingVoltage: number; // Volts
  readonly powerConsumptionMw: number; // Milliwatts
  readonly operatingTempRange: { min: number; max: number }; // Celsius
  readonly operatingHumidityRange: { min: number; max: number }; // Percentage
  readonly dimensions: { width: number; height: number; depth: number }; // mm
  readonly weight: number; // grams
  readonly ipRating?: string; // IP67, IP68, etc.
}

export interface SensorCapabilities {
  readonly supportedMeasurements: string[];
  readonly measurementRange: { min: number; max: number; unit: string };
  readonly resolution: number;
  readonly accuracy: number; // percentage
  readonly precision: number; // decimal places
  readonly responseTimeMs: number;
  readonly samplingRateHz: { min: number; max: number };
  readonly calibrationRequired: boolean;
  readonly calibrationIntervalDays: number;
}

// ==================== DEVICE LIFECYCLE MANAGEMENT ====================

export interface DeviceLifecycle {
  readonly registrationDate: TimestampISO;
  readonly firstActivation: TimestampISO;
  readonly lastActivation: TimestampISO;
  readonly totalOperatingHours: number;
  readonly maintenanceSchedule: MaintenanceSchedule[];
  readonly warrantyExpiration: TimestampISO;
  readonly expectedLifespanHours: number;
  readonly currentHealthScore: number; // 0-100
  readonly replacementRecommended: boolean;
}

export interface MaintenanceSchedule {
  readonly type: 'calibration' | 'cleaning' | 'firmware-update' | 'battery-replacement' | 'inspection';
  readonly intervalDays: number;
  readonly lastPerformed?: TimestampISO;
  readonly nextDue: TimestampISO;
  readonly isOverdue: boolean;
  readonly priority: 'low' | 'medium' | 'high' | 'critical';
}

// ==================== MOBILE DEVICE MANAGEMENT ====================

export interface MobileDeviceConfig {
  readonly deviceType: 'smartphone' | 'tablet' | 'smartwatch' | 'fitness-tracker' | 'iot-device';
  readonly osVersion: string;
  readonly appVersion: string;
  readonly screenResolution: { width: number; height: number };
  readonly availableStorageMB: number;
  readonly batteryLevel: number; // 0-100
  readonly batteryHealthPercent: number; // 0-100
  readonly chargingState: 'charging' | 'discharging' | 'full' | 'unknown';
  readonly powerSavingMode: boolean;
  readonly backgroundAppRefresh: boolean;
  readonly locationServicesEnabled: boolean;
}

export interface DevicePermissions {
  readonly camera: boolean;
  readonly microphone: boolean;
  readonly location: boolean;
  readonly notifications: boolean;
  readonly sensors: boolean;
  readonly storage: boolean;
  readonly contacts: boolean;
  readonly bluetooth: boolean;
  readonly wifi: boolean;
  readonly cellular: boolean;
  readonly backgroundExecution: boolean;
}

// ==================== HARDWARE INTERFACES ====================

export interface HardwareInterface {
  readonly type: 'i2c' | 'spi' | 'uart' | 'gpio' | 'adc' | 'dac' | 'pwm' | 'usb' | 'bluetooth' | 'wifi';
  readonly pins: number[];
  readonly voltage: number; // Volts
  readonly frequency?: number; // Hz
  readonly enabled: boolean;
  readonly lastActivity: TimestampISO;
  readonly errorCount: number;
}

export interface GPIOConfig {
  readonly pinNumber: number;
  readonly mode: 'input' | 'output' | 'input-pullup' | 'input-pulldown';
  readonly value: boolean | number;
  readonly interruptEnabled: boolean;
  readonly interruptTrigger?: 'rising' | 'falling' | 'both';
  readonly debounceMs: number;
}

export interface I2CConfig {
  readonly address: number; // 7-bit or 10-bit
  readonly clockSpeedHz: number;
  readonly dataLength: number; // bytes
  readonly timeoutMs: number;
  readonly retryAttempts: number;
}

export interface SPIConfig {
  readonly chipSelect: number;
  readonly clockSpeedHz: number;
  readonly mode: 0 | 1 | 2 | 3; // SPI modes
  readonly bitOrder: 'msb-first' | 'lsb-first';
  readonly wordSize: 8 | 16 | 32; // bits
}

// ==================== SENSOR-SPECIFIC CONFIGURATIONS ====================

export interface CameraConfig {
  readonly resolution: { width: number; height: number };
  readonly frameRate: number; // fps
  readonly format: 'jpeg' | 'png' | 'raw' | 'h264' | 'h265';
  readonly quality: number; // 0-100
  readonly autofocus: boolean;
  readonly autoExposure: boolean;
  readonly flashMode: 'auto' | 'on' | 'off' | 'torch';
  readonly stabilization: boolean;
  readonly nightMode: boolean;
}

export interface MicrophoneConfig {
  readonly sampleRate: number; // Hz
  readonly bitDepth: 8 | 16 | 24 | 32;
  readonly channels: 1 | 2; // mono or stereo
  readonly gainDb: number;
  readonly noiseCancellation: boolean;
  readonly echoCancellation: boolean;
  readonly agcEnabled: boolean; // Automatic Gain Control
  readonly format: 'pcm' | 'mp3' | 'aac' | 'opus';
}

export interface LocationConfig {
  readonly provider: 'gps' | 'network' | 'passive' | 'fused';
  readonly accuracy: 'high' | 'medium' | 'low' | 'power-optimized';
  readonly updateIntervalMs: number;
  readonly minDisplacementMeters: number;
  readonly geofencingEnabled: boolean;
  readonly altitudeRequired: boolean;
  readonly bearingRequired: boolean;
  readonly speedRequired: boolean;
}

export interface AccelerometerConfig {
  readonly range: '±2g' | '±4g' | '±8g' | '±16g';
  readonly sensitivity: number; // mg/LSB
  readonly samplingRate: number; // Hz
  readonly filterEnabled: boolean;
  readonly filterCutoffHz: number;
  readonly motionDetectionEnabled: boolean;
  readonly motionThreshold: number; // g
}

// ==================== DEVICE CONTROL & COMMANDS ====================

export interface DeviceCommand {
  readonly id: string;
  readonly deviceId: string;
  readonly command: string;
  readonly parameters: Record<string, any>;
  readonly priority: 'low' | 'normal' | 'high' | 'emergency';
  readonly timestamp: TimestampISO;
  readonly timeoutMs: number;
  readonly retryCount: number;
  readonly acknowledgmentRequired: boolean;
}

export interface DeviceCommandResult {
  readonly commandId: string;
  readonly success: boolean;
  readonly executionTimeMs: number;
  readonly result?: any;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly timestamp: TimestampISO;
  readonly deviceState: DeviceState;
}

export type DeviceControlAction = 
  | 'start' | 'stop' | 'pause' | 'resume' | 'reset' | 'calibrate' 
  | 'update-firmware' | 'change-config' | 'take-reading' | 'self-test';

// ==================== FIRMWARE & SOFTWARE MANAGEMENT ====================

export interface FirmwareInfo {
  readonly currentVersion: string;
  readonly availableVersion?: string;
  readonly updateAvailable: boolean;
  readonly updateCritical: boolean;
  readonly releaseDate: TimestampISO;
  readonly releaseNotes: string;
  readonly downloadSizeMB: number;
  readonly updateDurationMinutes: number;
  readonly requiresReboot: boolean;
  readonly backupSupported: boolean;
}

export interface SoftwareComponents {
  readonly bootloader: string;
  readonly operatingSystem: string;
  readonly drivers: Record<string, string>; // component -> version
  readonly applications: Record<string, string>; // app -> version
  readonly libraries: Record<string, string>; // library -> version
  readonly certificates: CertificateInfo[];
}

export interface CertificateInfo {
  readonly type: 'ssl' | 'device-identity' | 'code-signing' | 'encryption';
  readonly issuer: string;
  readonly subject: string;
  readonly validFrom: TimestampISO;
  readonly validTo: TimestampISO;
  readonly fingerprint: string;
  readonly isValid: boolean;
  readonly expiresInDays: number;
}

// ==================== DEVICE HEALTH & DIAGNOSTICS ====================

export interface DeviceHealth {
  readonly deviceId: string;
  readonly timestamp: TimestampISO;
  readonly overallHealth: number; // 0-100
  readonly components: ComponentHealth[];
  readonly activeAlarms: DeviceAlarm[];
  readonly performance: DevicePerformance;
  readonly environment: EnvironmentalConditions;
  readonly powerStatus: PowerStatus;
}

export interface ComponentHealth {
  readonly component: string;
  readonly health: number; // 0-100
  readonly status: 'healthy' | 'warning' | 'critical' | 'failed';
  readonly lastTest: TimestampISO;
  readonly errorCount: number;
  readonly temperature?: number; // Celsius
  readonly voltage?: number; // Volts
  readonly current?: number; // Amperes
}

export interface DeviceAlarm {
  readonly id: string;
  readonly type: 'hardware' | 'software' | 'communication' | 'power' | 'environmental';
  readonly severity: 'info' | 'warning' | 'error' | 'critical';
  readonly message: string;
  readonly component?: string;
  readonly timestamp: TimestampISO;
  readonly acknowledged: boolean;
  readonly cleared: boolean;
  readonly autoClearing: boolean;
}

export interface DevicePerformance {
  readonly cpuUtilization: number; // 0-100
  readonly memoryUtilization: number; // 0-100
  readonly storageUtilization: number; // 0-100
  readonly networkUtilization: number; // 0-100
  readonly averageResponseTimeMs: number;
  readonly dataProcessingRate: number; // items/second
  readonly errorRate: number; // 0-1
  readonly uptime: number; // seconds
}

export interface EnvironmentalConditions {
  readonly temperature: number; // Celsius
  readonly humidity: number; // 0-100
  readonly pressure?: number; // hPa
  readonly vibration?: number; // g
  readonly ambientLight?: number; // lux
  readonly airQuality?: number; // AQI
  readonly operatingWithinLimits: boolean;
}

export interface PowerStatus {
  readonly source: PowerSource;
  readonly batteryLevel?: number; // 0-100
  readonly batteryVoltage?: number; // Volts
  readonly chargingCurrent?: number; // Amperes
  readonly powerConsumption: number; // Watts
  readonly estimatedRuntimeHours?: number;
  readonly lowPowerMode: boolean;
  readonly powerSavingEnabled: boolean;
}

// ==================== CONFIGURATION MANAGEMENT ====================

export interface DeviceConfiguration {
  readonly deviceId: string;
  readonly configVersion: string;
  readonly lastUpdated: TimestampISO;
  readonly hardwareConfig: HardwareInterface[];
  readonly sensorConfig: SensorCapabilities;
  readonly mobileConfig?: MobileDeviceConfig;
  readonly permissions: DevicePermissions;
  readonly protocolConfigs: {
    readonly camera?: CameraConfig;
    readonly microphone?: MicrophoneConfig;
    readonly location?: LocationConfig;
    readonly accelerometer?: AccelerometerConfig;
  };
  readonly powerManagement: PowerManagementConfig;
  readonly securitySettings: DeviceSecurityConfig;
}

export interface PowerManagementConfig {
  readonly powerSavingEnabled: boolean;
  readonly sleepTimeoutMs: number;
  readonly wakeupSources: string[];
  readonly lowBatteryThreshold: number; // 0-100
  readonly criticalBatteryThreshold: number; // 0-100
  readonly automaticShutdownEnabled: boolean;
  readonly chargingOptimization: boolean;
  readonly thermalThrottling: boolean;
}

export interface DeviceSecurityConfig {
  readonly encryptionEnabled: boolean;
  readonly secureBootEnabled: boolean;
  readonly trustedPlatformModule: boolean;
  readonly certificateValidation: boolean;
  readonly remoteWipeEnabled: boolean;
  readonly deviceLockEnabled: boolean;
  readonly biometricAuthEnabled: boolean;
  readonly allowedNetworks: string[];
  readonly blockedApplications: string[];
}

// ==================== REFERENCE-BASED HEAVY DATA ====================

export interface HeavyDeviceDataRef {
  readonly dataType: 'firmware-image' | 'diagnostic-logs' | 'performance-history' | 'crash-dumps' | 'calibration-data';
  readonly refId: string;
  readonly sizeEstimateMB: number;
  readonly lastUpdated: TimestampISO;
  readonly accessUrl?: string; // For lazy loading
  readonly compressionUsed: boolean;
  readonly securityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
}

// ==================== API RESPONSE TYPES ====================

export interface DeviceStatusResponse {
  readonly deviceId: string;
  readonly info: DeviceInfo;
  readonly state: DeviceState;
  readonly status: SensorStatus;
  readonly connectivity: ConnectionInfo[];
  readonly health: DeviceHealth;
  readonly configuration: DeviceConfiguration;
  readonly lifecycle: DeviceLifecycle;
  readonly lastUpdate: TimestampISO;
}

export interface DeviceInventoryResponse {
  readonly totalDevices: number;
  readonly activeDevices: number;
  readonly devicesByCategory: Record<DeviceCategory, number>;
  readonly devicesByState: Record<DeviceState, number>;
  readonly devices: DeviceStatusResponse[];
  readonly healthSummary: {
    readonly healthy: number;
    readonly warning: number;
    readonly critical: number;
    readonly offline: number;
  };
  readonly heavyDataRefs: HeavyDeviceDataRef[];
}

export interface DeviceCommandResponse {
  readonly commandId: string;
  readonly accepted: boolean;
  readonly estimatedExecutionTimeMs?: number;
  readonly queuePosition?: number;
  readonly errorMessage?: string;
  readonly timestamp: TimestampISO;
}

export interface FirmwareUpdateResponse {
  readonly deviceId: string;
  readonly updateId: string;
  readonly status: 'queued' | 'downloading' | 'installing' | 'completed' | 'failed' | 'cancelled';
  readonly progress: number; // 0-100
  readonly currentStage: string;
  readonly estimatedTimeRemainingMinutes?: number;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly canRollback: boolean;
}

// ==================== EXPORTS ====================

export type {
  // Core device types
  DeviceCategory, DeviceState, PowerSource, DeviceInfo,
  
  // Hardware specifications
  HardwareSpecs, SensorCapabilities, HardwareInterface, GPIOConfig, I2CConfig, SPIConfig,
  
  // Device lifecycle
  DeviceLifecycle, MaintenanceSchedule,
  
  // Mobile device management
  MobileDeviceConfig, DevicePermissions,
  
  // Sensor configurations
  CameraConfig, MicrophoneConfig, LocationConfig, AccelerometerConfig,
  
  // Device control
  DeviceCommand, DeviceCommandResult, DeviceControlAction,
  
  // Firmware & software
  FirmwareInfo, SoftwareComponents, CertificateInfo,
  
  // Health & diagnostics
  DeviceHealth, ComponentHealth, DeviceAlarm, DevicePerformance, EnvironmentalConditions, PowerStatus,
  
  // Configuration
  DeviceConfiguration, PowerManagementConfig, DeviceSecurityConfig,
  
  // References
  HeavyDeviceDataRef,
  
  // API responses
  DeviceStatusResponse, DeviceInventoryResponse, DeviceCommandResponse, FirmwareUpdateResponse
}; 