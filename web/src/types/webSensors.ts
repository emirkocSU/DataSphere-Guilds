/**
 * =====================================================================================
 * DATASPHERE GUILDS - WEB SENSOR TYPE DEFINITIONS
 * =====================================================================================
 * 
 * Enterprise-grade web sensor type system for browser-based sensor data collection
 * Supporting Generic Sensor API, Device Orientation, Media Sensors, and Web Standards
 * Designed to compete with billion-dollar companies (Tesla, Apple, Amazon, Scale AI)
 * 
 * @version 1.0.0
 * @author DataSphere Guilds Engineering Team
 * @description Complete web sensor type definitions for the world's most advanced data marketplace
 * 
 * Coverage Areas:
 * - Generic Sensor API Implementation
 * - Device Orientation & Motion Sensors
 * - Ambient Light & Proximity Sensors
 * - Web Audio & Video Sensors
 * - Geolocation & Positioning Sensors
 * - Performance & System Sensors
 * - Custom Web Sensor Implementations
 * - Sensor Fusion & Data Processing
 * - Real-time Streaming & Analysis
 * - Cross-browser Compatibility
 * - Privacy & Security Controls
 * - Calibration & Validation
 * =====================================================================================
 */

import { UUID, ISOTimestamp, Percentage } from '../../../src/types/index';
import { 
  SensorId, 
  SensorValue, 
  SamplingRate, 
  AccuracyLevel, 
  SensorRange,
  CalibrationStatus,
  SensorAvailability
} from '../../../src/types/sensors';

// ============================= WEB SENSOR CORE TYPES =============================

/**
 * Web sensor identifier
 */
export type WebSensorId = Brand<string, 'WebSensorId'>;

/**
 * Brand utility type for web sensors
 */
type Brand<T, B> = T & { __brand: B };

/**
 * Web sensor states
 */
export enum WebSensorState {
  IDLE = 'idle',
  ACTIVATING = 'activating',
  ACTIVATED = 'activated',
  ERROR = 'error',
  UNAVAILABLE = 'unavailable'
}

/**
 * Web sensor error types
 */
export enum WebSensorError {
  NOT_ALLOWED = 'NotAllowedError',
  NOT_FOUND = 'NotFoundError',
  NOT_READABLE = 'NotReadableError',
  NOT_SUPPORTED = 'NotSupportedError',
  SECURITY_ERROR = 'SecurityError',
  INVALID_STATE = 'InvalidStateError',
  DATA_LOSS = 'DataLossError',
  TIMEOUT = 'TimeoutError',
  CALIBRATION_ERROR = 'CalibrationError',
  HARDWARE_ERROR = 'HardwareError'
}

/**
 * Web sensor capability levels
 */
export enum WebSensorCapability {
  BASIC = 'basic',
  STANDARD = 'standard',
  ENHANCED = 'enhanced',
  PREMIUM = 'premium',
  EXPERIMENTAL = 'experimental'
}

/**
 * Web sensor privacy levels
 */
export enum WebSensorPrivacy {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
  CONFIDENTIAL = 'confidential'
}

// ============================= GENERIC SENSOR API TYPES =============================

/**
 * Generic sensor configuration
 */
export interface GenericSensorConfig {
  frequency?: number;
  threshold?: number;
  timeout?: number;
  accuracy?: 'low' | 'medium' | 'high';
  referenceFrame?: 'device' | 'screen';
  autoActivate?: boolean;
  continuous?: boolean;
  bufferSize?: number;
  reportInterval?: number;
}

/**
 * Generic sensor options
 */
export interface GenericSensorOptions extends GenericSensorConfig {
  permissions?: string[];
  fallback?: GenericSensorConfig;
  validation?: {
    enabled: boolean;
    rules: ValidationRule[];
  };
  calibration?: {
    enabled: boolean;
    autoCalibrate: boolean;
    calibrationData?: Record<string, number>;
  };
  privacy?: {
    level: WebSensorPrivacy;
    anonymize: boolean;
    encryption: boolean;
  };
}

/**
 * Validation rule for sensor data
 */
export interface ValidationRule {
  name: string;
  type: 'range' | 'pattern' | 'custom';
  parameters: Record<string, any>;
  message: string;
  severity: 'warning' | 'error' | 'critical';
}

/**
 * Web sensor reading interface
 */
export interface WebSensorReading {
  timestamp: ISOTimestamp;
  accuracy?: number;
  reliability: Percentage;
  values: Record<string, number>;
  metadata: {
    sensorId: WebSensorId;
    source: string;
    quality: number;
    processed: boolean;
    calibrated: boolean;
  };
}

// ============================= MOTION & ORIENTATION SENSORS =============================

/**
 * Accelerometer web sensor
 */
export interface WebAccelerometer {
  id: WebSensorId;
  type: 'accelerometer' | 'linear-acceleration' | 'gravity';
  state: WebSensorState;
  includeGravity: boolean;
  frequency: number;
  options: GenericSensorOptions;
  
  // Event handlers
  onreading?: (reading: AccelerometerReading) => void;
  onerror?: (error: WebSensorError) => void;
  onactivate?: () => void;
  
  // Methods
  start: () => void;
  stop: () => void;
  calibrate: () => Promise<void>;
}

/**
 * Accelerometer reading
 */
export interface AccelerometerReading extends WebSensorReading {
  x: number;
  y: number;
  z: number;
  magnitude: number;
  includesGravity: boolean;
  linearAcceleration?: {
    x: number;
    y: number;
    z: number;
  };
  gravity?: {
    x: number;
    y: number;
    z: number;
  };
}

/**
 * Gyroscope web sensor
 */
export interface WebGyroscope {
  id: WebSensorId;
  type: 'gyroscope';
  state: WebSensorState;
  frequency: number;
  options: GenericSensorOptions;
  
  // Event handlers
  onreading?: (reading: GyroscopeReading) => void;
  onerror?: (error: WebSensorError) => void;
  onactivate?: () => void;
  
  // Methods
  start: () => void;
  stop: () => void;
  calibrate: () => Promise<void>;
}

/**
 * Gyroscope reading
 */
export interface GyroscopeReading extends WebSensorReading {
  x: number; // Angular velocity around X-axis (rad/s)
  y: number; // Angular velocity around Y-axis (rad/s)
  z: number; // Angular velocity around Z-axis (rad/s)
  magnitude: number;
  rotationRate?: {
    alpha: number;
    beta: number;
    gamma: number;
  };
}

/**
 * Magnetometer web sensor
 */
export interface WebMagnetometer {
  id: WebSensorId;
  type: 'magnetometer';
  state: WebSensorState;
  frequency: number;
  options: GenericSensorOptions;
  
  // Event handlers
  onreading?: (reading: MagnetometerReading) => void;
  onerror?: (error: WebSensorError) => void;
  onactivate?: () => void;
  
  // Methods
  start: () => void;
  stop: () => void;
  calibrate: () => Promise<void>;
}

/**
 * Magnetometer reading
 */
export interface MagnetometerReading extends WebSensorReading {
  x: number; // Magnetic field strength along X-axis (µT)
  y: number; // Magnetic field strength along Y-axis (µT)
  z: number; // Magnetic field strength along Z-axis (µT)
  magnitude: number;
  heading?: number; // Compass heading in degrees
  declination?: number; // Magnetic declination
  inclination?: number; // Magnetic inclination
}

/**
 * Orientation sensor
 */
export interface WebOrientationSensor {
  id: WebSensorId;
  type: 'absolute-orientation' | 'relative-orientation';
  state: WebSensorState;
  frequency: number;
  referenceFrame: 'device' | 'screen';
  options: GenericSensorOptions;
  
  // Event handlers
  onreading?: (reading: OrientationReading) => void;
  onerror?: (error: WebSensorError) => void;
  onactivate?: () => void;
  
  // Methods
  start: () => void;
  stop: () => void;
  calibrate: () => Promise<void>;
}

/**
 * Orientation reading
 */
export interface OrientationReading extends WebSensorReading {
  quaternion: [number, number, number, number];
  rotationMatrix: number[][];
  euler: {
    yaw: number;   // Z-axis rotation (degrees)
    pitch: number; // X-axis rotation (degrees)
    roll: number;  // Y-axis rotation (degrees)
  };
  isAbsolute: boolean;
}

// ============================= DEVICE ORIENTATION EVENTS =============================

/**
 * Device orientation configuration
 */
export interface DeviceOrientationConfig {
  absolute: boolean;
  throttleMs?: number;
  filterNoise?: boolean;
  calibrationRequired?: boolean;
  compassCalibration?: boolean;
  permissions: string[];
}

/**
 * Enhanced device orientation data
 */
export interface EnhancedDeviceOrientationData {
  timestamp: ISOTimestamp;
  alpha: number; // Z-axis rotation (0-360°)
  beta: number;  // X-axis rotation (-180 to 180°)
  gamma: number; // Y-axis rotation (-90 to 90°)
  absolute: boolean;
  accuracy?: number;
  webkitCompassHeading?: number;
  webkitCompassAccuracy?: number;
  compassNeedsCalibration?: boolean;
  metadata: {
    browser: string;
    userAgent: string;
    calibrated: boolean;
    quality: Percentage;
  };
}

/**
 * Device motion configuration
 */
export interface DeviceMotionConfig {
  includeGravity: boolean;
  interval?: number;
  throttleMs?: number;
  filterNoise?: boolean;
  permissions: string[];
}

/**
 * Enhanced device motion data
 */
export interface EnhancedDeviceMotionData {
  timestamp: ISOTimestamp;
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  accelerationIncludingGravity: {
    x: number;
    y: number;
    z: number;
  };
  rotationRate: {
    alpha: number;
    beta: number;
    gamma: number;
  };
  interval: number;
  metadata: {
    hasGravity: boolean;
    accuracy: Percentage;
    quality: Percentage;
    batteryImpact: 'low' | 'medium' | 'high';
  };
}

// ============================= AMBIENT SENSORS =============================

/**
 * Ambient light sensor
 */
export interface WebAmbientLightSensor {
  id: WebSensorId;
  type: 'ambient-light';
  state: WebSensorState;
  frequency: number;
  options: GenericSensorOptions;
  
  // Event handlers
  onreading?: (reading: AmbientLightReading) => void;
  onerror?: (error: WebSensorError) => void;
  onactivate?: () => void;
  
  // Methods
  start: () => void;
  stop: () => void;
  calibrate: () => Promise<void>;
}

/**
 * Ambient light reading
 */
export interface AmbientLightReading extends WebSensorReading {
  illuminance: number; // Lux
  category: 'very-dark' | 'dark' | 'dim' | 'normal' | 'bright' | 'very-bright';
  colorTemperature?: number; // Kelvin
  rgbValues?: {
    red: number;
    green: number;
    blue: number;
  };
  uvIndex?: number;
}

/**
 * Proximity sensor
 */
export interface WebProximitySensor {
  id: WebSensorId;
  type: 'proximity';
  state: WebSensorState;
  frequency: number;
  options: GenericSensorOptions;
  
  // Event handlers
  onreading?: (reading: ProximityReading) => void;
  onerror?: (error: WebSensorError) => void;
  onactivate?: () => void;
  
  // Methods
  start: () => void;
  stop: () => void;
  calibrate: () => Promise<void>;
}

/**
 * Proximity reading
 */
export interface ProximityReading extends WebSensorReading {
  distance: number; // meters
  max: number;      // maximum detectable distance
  near: boolean;    // true if object is near
  confidence: Percentage;
  method: 'infrared' | 'ultrasonic' | 'capacitive' | 'optical';
}

// ============================= GEOLOCATION SENSORS =============================

/**
 * Enhanced geolocation sensor
 */
export interface WebGeolocationSensor {
  id: WebSensorId;
  type: 'geolocation';
  state: WebSensorState;
  options: GeolocationSensorOptions;
  watchId?: number;
  
  // Event handlers
  onreading?: (reading: GeolocationReading) => void;
  onerror?: (error: WebSensorError) => void;
  onactivate?: () => void;
  
  // Methods
  start: () => void;
  stop: () => void;
  getCurrentPosition: () => Promise<GeolocationReading>;
  watchPosition: () => void;
  clearWatch: () => void;
}

/**
 * Geolocation sensor options
 */
export interface GeolocationSensorOptions extends GenericSensorOptions {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
  trackMovement: boolean;
  minDistanceChange: number;
  fallbackToIP: boolean;
  requireGPS: boolean;
}

/**
 * Geolocation reading
 */
export interface GeolocationReading extends WebSensorReading {
  coords: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy: number;
    altitudeAccuracy?: number;
    heading?: number;
    speed?: number;
  };
  address?: {
    street?: string;
    city?: string;
    region?: string;
    country?: string;
    postalCode?: string;
  };
  source: 'gps' | 'network' | 'passive' | 'fused';
  batteryImpact: 'low' | 'medium' | 'high';
}

// ============================= MEDIA SENSORS =============================

/**
 * Audio level sensor
 */
export interface WebAudioLevelSensor {
  id: WebSensorId;
  type: 'audio-level';
  state: WebSensorState;
  frequency: number;
  audioContext: any; // AudioContext
  analyser: any; // AnalyserNode
  options: AudioSensorOptions;
  
  // Event handlers
  onreading?: (reading: AudioLevelReading) => void;
  onerror?: (error: WebSensorError) => void;
  onactivate?: () => void;
  
  // Methods
  start: () => void;
  stop: () => void;
  connectToStream: (stream: MediaStream) => void;
}

/**
 * Audio sensor options
 */
export interface AudioSensorOptions extends GenericSensorOptions {
  fftSize: number;
  smoothingTimeConstant: number;
  minDecibels: number;
  maxDecibels: number;
  detectSpeech: boolean;
  detectMusic: boolean;
  noiseReduction: boolean;
}

/**
 * Audio level reading
 */
export interface AudioLevelReading extends WebSensorReading {
  level: number; // 0-100
  decibels: number;
  frequency: number;
  frequencyData: Float32Array;
  timeData: Uint8Array;
  dominantFrequency: number;
  spectralCentroid: number;
  spectralRolloff: number;
  zeroCrossingRate: number;
  features: {
    isSpeech: boolean;
    isMusic: boolean;
    isNoise: boolean;
    isSilence: boolean;
  };
}

/**
 * Video analysis sensor
 */
export interface WebVideoAnalysisSensor {
  id: WebSensorId;
  type: 'video-analysis';
  state: WebSensorState;
  frequency: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  options: VideoSensorOptions;
  
  // Event handlers
  onreading?: (reading: VideoAnalysisReading) => void;
  onerror?: (error: WebSensorError) => void;
  onactivate?: () => void;
  
  // Methods
  start: () => void;
  stop: () => void;
  connectToStream: (stream: MediaStream) => void;
  connectToVideo: (video: HTMLVideoElement) => void;
}

/**
 * Video sensor options
 */
export interface VideoSensorOptions extends GenericSensorOptions {
  resolution: {
    width: number;
    height: number;
  };
  frameRate: number;
  detectMotion: boolean;
  detectFaces: boolean;
  detectObjects: boolean;
  trackColors: boolean;
  brightness: boolean;
  contrast: boolean;
}

/**
 * Video analysis reading
 */
export interface VideoAnalysisReading extends WebSensorReading {
  frame: {
    width: number;
    height: number;
    data: ImageData;
  };
  motion: {
    detected: boolean;
    level: number;
    direction?: number;
    velocity?: number;
  };
  brightness: {
    average: number;
    histogram: number[];
  };
  faces?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
  }>;
  objects?: Array<{
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
  }>;
  dominantColors: Array<{
    r: number;
    g: number;
    b: number;
    percentage: number;
  }>;
}

// ============================= PERFORMANCE SENSORS =============================

/**
 * Performance sensor
 */
export interface WebPerformanceSensor {
  id: WebSensorId;
  type: 'performance';
  state: WebSensorState;
  frequency: number;
  observer: any; // PerformanceObserver
  options: PerformanceSensorOptions;
  
  // Event handlers
  onreading?: (reading: PerformanceReading) => void;
  onerror?: (error: WebSensorError) => void;
  onactivate?: () => void;
  
  // Methods
  start: () => void;
  stop: () => void;
  measure: (name: string) => void;
}

/**
 * Performance sensor options
 */
export interface PerformanceSensorOptions extends GenericSensorOptions {
  entryTypes: string[];
  buffered: boolean;
  measureMemory: boolean;
  measureNetwork: boolean;
  measureUserTiming: boolean;
  measureNavigation: boolean;
}

/**
 * Performance reading
 */
export interface PerformanceReading extends WebSensorReading {
  navigation: {
    loadTime: number;
    domContentLoaded: number;
    firstPaint: number;
    firstContentfulPaint: number;
    largestContentfulPaint?: number;
    firstInputDelay?: number;
    cumulativeLayoutShift?: number;
  };
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  network?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  resources: Array<{
    name: string;
    duration: number;
    size: number;
    type: string;
  }>;
  userTiming: Array<{
    name: string;
    duration: number;
    startTime: number;
  }>;
}

// ============================= SYSTEM SENSORS =============================

/**
 * Battery sensor
 */
export interface WebBatterySensor {
  id: WebSensorId;
  type: 'battery';
  state: WebSensorState;
  frequency: number;
  battery: any; // BatteryManager
  options: GenericSensorOptions;
  
  // Event handlers
  onreading?: (reading: BatteryReading) => void;
  onerror?: (error: WebSensorError) => void;
  onactivate?: () => void;
  
  // Methods
  start: () => void;
  stop: () => void;
  getBatteryInfo: () => Promise<BatteryReading>;
}

/**
 * Battery reading
 */
export interface BatteryReading extends WebSensorReading {
  level: Percentage; // 0-100
  charging: boolean;
  chargingTime?: number; // seconds
  dischargingTime?: number; // seconds
  health?: Percentage;
  temperature?: number;
  voltage?: number;
  cycleCount?: number;
}

/**
 * Network sensor
 */
export interface WebNetworkSensor {
  id: WebSensorId;
  type: 'network';
  state: WebSensorState;
  frequency: number;
  connection: any; // NetworkInformation
  options: GenericSensorOptions;
  
  // Event handlers
  onreading?: (reading: NetworkReading) => void;
  onerror?: (error: WebSensorError) => void;
  onactivate?: () => void;
  
  // Methods
  start: () => void;
  stop: () => void;
  testConnection: () => Promise<ConnectionTest>;
}

/**
 * Network reading
 */
export interface NetworkReading extends WebSensorReading {
  online: boolean;
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number; // Mbps
  uplink?: number; // Mbps
  rtt: number; // milliseconds
  saveData: boolean;
  type?: 'cellular' | 'wifi' | 'ethernet' | 'bluetooth' | 'wimax';
  quality: 'poor' | 'good' | 'excellent';
}

/**
 * Connection test result
 */
export interface ConnectionTest {
  timestamp: ISOTimestamp;
  latency: number;
  downloadSpeed: number;
  uploadSpeed: number;
  packetLoss: number;
  jitter: number;
  quality: Percentage;
}

// ============================= SENSOR FUSION & PROCESSING =============================

/**
 * Sensor fusion engine
 */
export interface WebSensorFusionEngine {
  id: UUID;
  name: string;
  sensors: WebSensorId[];
  algorithm: 'kalman' | 'complementary' | 'mahony' | 'madgwick' | 'custom';
  frequency: number;
  options: SensorFusionOptions;
  
  // Event handlers
  onresult?: (result: FusionResult) => void;
  onerror?: (error: WebSensorError) => void;
  
  // Methods
  start: () => void;
  stop: () => void;
  addSensor: (sensor: WebSensorId) => void;
  removeSensor: (sensor: WebSensorId) => void;
  calibrate: () => Promise<void>;
}

/**
 * Sensor fusion options
 */
export interface SensorFusionOptions {
  weights: Record<string, number>;
  threshold: number;
  windowSize: number;
  outlierDetection: boolean;
  noiseReduction: boolean;
  prediction: boolean;
  smoothing: boolean;
  validation: boolean;
}

/**
 * Fusion result
 */
export interface FusionResult {
  timestamp: ISOTimestamp;
  confidence: Percentage;
  accuracy: AccuracyLevel;
  data: Record<string, number>;
  sources: WebSensorId[];
  quality: Percentage;
  metadata: {
    algorithm: string;
    processingTime: number;
    inputCount: number;
    validInputs: number;
  };
}

/**
 * Real-time processor
 */
export interface WebSensorProcessor {
  id: UUID;
  name: string;
  type: 'filter' | 'transform' | 'aggregate' | 'analyze';
  frequency: number;
  bufferSize: number;
  options: ProcessorOptions;
  
  // Methods
  process: (data: WebSensorReading[]) => ProcessorResult;
  configure: (options: ProcessorOptions) => void;
  reset: () => void;
}

/**
 * Processor options
 */
export interface ProcessorOptions {
  algorithm: string;
  parameters: Record<string, any>;
  outputFormat: 'raw' | 'processed' | 'summary';
  realtime: boolean;
  validation: boolean;
}

/**
 * Processor result
 */
export interface ProcessorResult {
  timestamp: ISOTimestamp;
  processingTime: number;
  inputCount: number;
  outputData: Record<string, any>;
  quality: Percentage;
  metadata: Record<string, any>;
}

// ============================= SENSOR MANAGEMENT =============================

/**
 * Web sensor manager
 */
export interface WebSensorManager {
  sensors: Map<WebSensorId, WebSensorInstance>;
  activeSensors: Set<WebSensorId>;
  permissions: Map<string, PermissionState>;
  
  // Sensor lifecycle
  createSensor: <T>(type: string, options?: GenericSensorOptions) => Promise<T>;
  activateSensor: (sensorId: WebSensorId) => Promise<void>;
  deactivateSensor: (sensorId: WebSensorId) => void;
  removeSensor: (sensorId: WebSensorId) => void;
  
  // Permission management
  requestPermissions: (permissions: string[]) => Promise<Record<string, PermissionState>>;
  checkPermission: (permission: string) => Promise<PermissionState>;
  
  // Capability detection
  isSupported: (sensorType: string) => boolean;
  getCapabilities: (sensorType: string) => WebSensorCapability;
  
  // Configuration
  configure: (config: SensorManagerConfig) => void;
  reset: () => void;
}

/**
 * Web sensor instance
 */
export interface WebSensorInstance {
  id: WebSensorId;
  type: string;
  state: WebSensorState;
  config: GenericSensorOptions;
  readings: WebSensorReading[];
  lastReading?: WebSensorReading;
  startTime?: ISOTimestamp;
  errorCount: number;
  metadata: Record<string, any>;
}

/**
 * Sensor manager configuration
 */
export interface SensorManagerConfig {
  maxSensors: number;
  maxReadings: number;
  defaultFrequency: number;
  autoCleanup: boolean;
  errorThreshold: number;
  retryAttempts: number;
  permissions: string[];
  privacy: {
    anonymize: boolean;
    encryption: boolean;
    retention: number;
  };
  performance: {
    optimization: boolean;
    batching: boolean;
    compression: boolean;
  };
}

// ============================= WEB SENSOR CONSTANTS =============================

/**
 * Web sensor default values
 */
export const WEB_SENSOR_DEFAULTS = {
  FREQUENCY: 10, // Hz
  TIMEOUT: 5000, // ms
  BUFFER_SIZE: 100,
  RETRY_ATTEMPTS: 3,
  ACCURACY_THRESHOLD: 0.8,
  CALIBRATION_INTERVAL: 3600000, // 1 hour
  MAX_SENSORS: 20,
  MAX_READINGS: 1000,
  ERROR_THRESHOLD: 5,
  BATCH_SIZE: 10,
  PROCESSING_TIMEOUT: 1000
} as const;

/**
 * Sensor type registry
 */
export const WEB_SENSOR_TYPES = {
  MOTION: ['accelerometer', 'gyroscope', 'magnetometer', 'orientation'],
  ENVIRONMENTAL: ['ambient-light', 'proximity', 'geolocation'],
  MEDIA: ['audio-level', 'video-analysis'],
  SYSTEM: ['battery', 'network', 'performance'],
  DEVICE: ['device-orientation', 'device-motion'],
  CUSTOM: ['fusion', 'processed', 'synthetic']
} as const;

/**
 * Permission requirements for sensors
 */
export const SENSOR_PERMISSIONS = {
  'accelerometer': ['accelerometer'],
  'gyroscope': ['gyroscope'],
  'magnetometer': ['magnetometer'],
  'ambient-light': ['ambient-light-sensor'],
  'proximity': ['proximity'],
  'geolocation': ['geolocation'],
  'audio-level': ['microphone'],
  'video-analysis': ['camera'],
  'battery': [],
  'network': [],
  'performance': []
} as const;

// ============================= TYPE GUARDS & UTILITIES =============================

/**
 * Check if sensor type is supported
 */
export const isSensorSupported = (sensorType: string): boolean => {
  try {
    switch (sensorType) {
      case 'accelerometer':
        return 'Accelerometer' in window;
      case 'gyroscope':
        return 'Gyroscope' in window;
      case 'magnetometer':
        return 'Magnetometer' in window;
      case 'ambient-light':
        return 'AmbientLightSensor' in window;
      case 'proximity':
        return 'ProximitySensor' in window;
      case 'geolocation':
        return 'geolocation' in navigator;
      case 'device-orientation':
        return 'DeviceOrientationEvent' in window;
      case 'device-motion':
        return 'DeviceMotionEvent' in window;
      case 'battery':
        return 'getBattery' in navigator;
      case 'network':
        return 'connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator;
      case 'performance':
        return 'performance' in window;
      default:
        return false;
    }
  } catch {
    return false;
  }
};

/**
 * Type guard for web sensor reading
 */
export const isWebSensorReading = (value: any): value is WebSensorReading => {
  return value && 
    typeof value.timestamp === 'string' &&
    typeof value.reliability === 'number' &&
    typeof value.values === 'object' &&
    typeof value.metadata === 'object';
};

/**
 * Create web sensor ID
 */
export const createWebSensorId = (type: string, instance?: string): WebSensorId => {
  const suffix = instance ? `_${instance}` : `_${Date.now()}`;
  return `web_${type}${suffix}` as WebSensorId;
};

/**
 * Calculate sensor data quality score
 */
export const calculateQualityScore = (reading: WebSensorReading): Percentage => {
  let score = reading.reliability;
  
  // Adjust for accuracy
  if (reading.accuracy) {
    score = (score + reading.accuracy) / 2;
  }
  
  // Adjust for metadata quality indicators
  if (reading.metadata.calibrated) {
    score += 10;
  }
  
  if (reading.metadata.processed) {
    score += 5;
  }
  
  return Math.min(100, Math.max(0, score)) as Percentage;
};

/**
 * Validate sensor configuration
 */
export const validateSensorConfig = (config: GenericSensorOptions): ValidationResult => {
  const errors: string[] = [];
  
  if (config.frequency && (config.frequency < 0.1 || config.frequency > 1000)) {
    errors.push('Frequency must be between 0.1 and 1000 Hz');
  }
  
  if (config.timeout && config.timeout < 1000) {
    errors.push('Timeout must be at least 1000ms');
  }
  
  if (config.bufferSize && config.bufferSize < 1) {
    errors.push('Buffer size must be at least 1');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Version information
 */
export const WEB_SENSOR_TYPES_VERSION = '1.0.0';
export const SUPPORTED_SENSOR_APIS = [
  'Generic Sensor API',
  'Device Orientation Events',
  'Geolocation API',
  'Battery Status API',
  'Network Information API',
  'Performance Observer API',
  'Web Audio API',
  'Canvas API'
];

// ============================= END OF FILE =============================