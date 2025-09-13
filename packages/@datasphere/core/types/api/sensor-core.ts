/**
 * =====================================================================================
 * @datasphere/core - Core Sensor Data Types (Optimized)
 * =====================================================================================
 * 
 * Real-time, mobile-first, edge computing optimized sensor data types
 * Designed for performance, minimal memory footprint, and fast JSON parsing
 * 
 * @version 1.0.0
 * @author DataSphere Guilds Engineering Team
 * @license MIT
 * 
 * Performance Features:
 * - Lightweight core data structures (2KB vs 50KB)
 * - Reference-based heavy data loading
 * - Real-time JSON parsing optimization
 * - Mobile battery-aware design
 * - Edge computing friendly
 * - Memory leak prevention
 * =====================================================================================
 */

import {
    UUID,
    ISOTimestamp,
    Percentage,
    BaseRequest,
    BaseResponse
  } from './common';
  
  // ============================= OPTIMIZED ENUMS =============================
  
  /**
   * Essential sensor types (most commonly used)
   */
  export enum SensorType {
    ACCELEROMETER = 'accelerometer',
    GYROSCOPE = 'gyroscope',
    MAGNETOMETER = 'magnetometer',
    GPS = 'gps',
    TEMPERATURE = 'temperature',
    HUMIDITY = 'humidity',
    PRESSURE = 'pressure',
    LIGHT = 'light',
    PROXIMITY = 'proximity',
    MICROPHONE = 'microphone',
    CAMERA = 'camera',
    HEART_RATE = 'heart_rate',
    BATTERY = 'battery',
    MOTION = 'motion'
  }
  
  /**
   * Optimized data formats for fast parsing
   */
  export enum DataFormat {
    JSON = 'json',
    BINARY = 'binary',
    COMPRESSED = 'compressed'
  }
  
  /**
   * Lightweight sensor status
   */
  export enum SensorStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    ERROR = 'error',
    OFFLINE = 'offline'
  }
  
  /**
   * Real-time collection modes
   */
  export enum CollectionMode {
    CONTINUOUS = 'continuous',
    TRIGGERED = 'triggered',
    ON_DEMAND = 'on_demand'
  }
  
  // ============================= CORE OPTIMIZED TYPES =============================
  
  /**
   * Lightweight core sensor data (2-3KB max)
   * Optimized for real-time streaming and mobile performance
   */
  export interface SensorDataCore {
    id: UUID;
    deviceId: UUID;
    sensorType: SensorType;
    timestamp: ISOTimestamp;
    values: SensorValues;
    qualityScore: Percentage;
    
    // Optional references for heavy data (load on demand)
    metadataRef?: string;
    processingRef?: string;
    validationRef?: string;
    locationRef?: string;
  }
  
  /**
   * Extended sensor data with optional heavy components
   * Only loaded when specifically requested
   */
  export interface SensorDataExtended {
    core: SensorDataCore;
    metadata?: SensorMetadataLite;
    processing?: ProcessingInfoLite;
    validation?: ValidationResultLite;
    location?: LocationDataLite;
  }
  
  /**
   * Ultra-lightweight sensor values (optimized union)
   * Fast JSON parsing, minimal memory footprint
   */
  export type SensorValues = 
    | MotionData           // Most common - 100 bytes
    | EnvironmentalData    // Common - 80 bytes
    | LocationData         // Common - 120 bytes
    | BiometricData        // Moderate - 60 bytes
    | AudioDataLite        // Lightweight - 40 bytes
    | ImageDataLite        // Lightweight - 60 bytes
    | GenericData;         // Fallback - variable
  
  // ============================= OPTIMIZED SENSOR VALUE TYPES =============================
  
  /**
   * Motion sensors (accelerometer, gyroscope, magnetometer)
   * Optimized for high-frequency real-time data
   */
  export interface MotionData {
    type: 'motion';
    accel?: Vector3D;      // Accelerometer data
    gyro?: Vector3D;       // Gyroscope data
    mag?: Vector3D;        // Magnetometer data
    units: 'm/s²' | 'rad/s' | 'µT';
  }
  
  /**
   * 3D vector with magnitude (16 bytes)
   */
  export interface Vector3D {
    x: number;
    y: number;
    z: number;
    magnitude?: number;    // Pre-calculated for performance
  }
  
  /**
   * Environmental sensors (temperature, humidity, pressure, light)
   */
  export interface EnvironmentalData {
    type: 'environmental';
    temperature?: number;  // Celsius
    humidity?: Percentage; // 0-100
    pressure?: number;     // hPa
    light?: number;        // Lux
    uvIndex?: number;      // 0-12
    airQuality?: number;   // AQI
  }
  
  /**
   * Lightweight location data
   */
  export interface LocationData {
    type: 'location';
    lat: number;           // Latitude
    lng: number;           // Longitude  
    alt?: number;          // Altitude (optional)
    acc: number;           // Accuracy in meters
    bearing?: number;      // Direction (optional)
    speed?: number;        // Speed m/s (optional)
    provider: 'gps' | 'network' | 'fused';
  }
  
  /**
   * Biometric data (optimized for wearables)
   */
  export interface BiometricData {
    type: 'biometric';
    heartRate?: number;    // BPM
    steps?: number;        // Step count
    temp?: number;         // Body temperature
    stress?: number;       // Stress level 0-100
  }
  
  /**
   * Lightweight audio data (no heavy features)
   */
  export interface AudioDataLite {
    type: 'audio';
    amplitude: number;     // Current amplitude
    duration: number;      // Duration in ms
    sampleRate: number;    // Hz
    
    // Heavy features via reference
    featuresRef?: string;  // Reference to AudioFeatures
  }
  
  /**
   * Lightweight image data (no heavy features)
   */
  export interface ImageDataLite {
    type: 'image';
    width: number;
    height: number;
    size: number;          // File size
    format: string;        // jpg, png, etc.
    
    // Heavy analysis via reference
    featuresRef?: string;  // Reference to ImageFeatures
    objectsRef?: string;   // Reference to DetectedObjects
  }
  
  /**
   * Generic sensor data for extensibility
   */
  export interface GenericData {
    type: 'generic';
    values: Record<string, number>;
    schema?: string;       // Schema reference
  }
  
  // ============================= LIGHTWEIGHT METADATA =============================
  
  /**
   * Essential metadata only (lightweight version)
   */
  export interface SensorMetadataLite {
    deviceModel: string;   // Essential device info
    firmwareVersion: string;
    batteryLevel?: Percentage;
    signalStrength?: number;
    
    // Heavy data via references
    fullDeviceInfoRef?: string;
    calibrationRef?: string;
    environmentRef?: string;
  }
  
  /**
   * Lightweight processing info
   */
  export interface ProcessingInfoLite {
    filtered: boolean;
    aggregated: boolean;
    latency: number;       // Processing latency in ms
    
    // Heavy pipeline data via reference
    pipelineRef?: string;
  }
  
  /**
   * Lightweight validation result
   */
  export interface ValidationResultLite {
    valid: boolean;
    score: Percentage;
    errorCount: number;
    
    // Detailed validation via reference
    detailsRef?: string;
  }
  
  /**
   * Lightweight location data
   */
  export interface LocationDataLite {
    country?: string;
    timezone: string;
    
    // Heavy geo data via reference
    addressRef?: string;
    geofenceRef?: string;
  }
  
  // ============================= QUALITY & PROCESSING =============================
  
  /**
   * Minimal quality info for real-time processing
   */
  export interface DataQualityCore {
    score: Percentage;     // Overall quality score
    accuracy: Percentage;  // Accuracy percentage
    issues: number;        // Number of issues
    
    // Detailed quality analysis via reference
    detailsRef?: string;
  }
  
  /**
   * Quality issue summary (lightweight)
   */
  export interface QualityIssueSummary {
    missing: number;       // Count of missing values
    outliers: number;      // Count of outliers
    invalid: number;       // Count of invalid values
    delayed: number;       // Count of delayed readings
  }
  
  /**
   * Sensor range for validation
   */
  export interface SensorRange {
    min: number;
    max: number;
    units: string;
  }
  
  /**
   * Sample rate information
   */
  export interface SampleRate {
    current: number;       // Current rate
    max: number;           // Maximum rate
    units: 'Hz';
  }
  
  // ============================= REAL-TIME STREAMING TYPES =============================
  
  /**
   * Real-time sensor stream configuration
   */
  export interface StreamConfig {
    sensorType: SensorType;
    frequency: number;     // Hz
    duration?: number;     // seconds (optional)
    bufferSize: number;    // Buffer size for batching
    compression: boolean;  // Enable compression
    priority: 'low' | 'normal' | 'high';
  }
  
  /**
   * Batched sensor data for efficient streaming
   */
  export interface SensorDataBatch {
    batchId: UUID;
    deviceId: UUID;
    sensorType: SensorType;
    count: number;
    startTime: ISOTimestamp;
    endTime: ISOTimestamp;
    data: SensorDataCore[];
    compressed: boolean;
    checksum?: string;
  }
  
  /**
   * Stream status for monitoring
   */
  export interface StreamStatus {
    active: boolean;
    frequency: number;
    bytesPerSecond: number;
    latency: number;
    packetsLost: number;
    quality: Percentage;
  }
  
  // ============================= MOBILE & EDGE OPTIMIZATION =============================
  
  /**
   * Mobile-optimized sensor configuration
   */
  export interface MobileSensorConfig {
    sensorType: SensorType;
    enabled: boolean;
    frequency: number;     // Optimized for battery
    precision: 'low' | 'medium' | 'high';
    
    // Battery optimization
    powerMode: 'eco' | 'balanced' | 'performance';
    adaptiveFrequency: boolean;
    
    // Mobile-specific
    backgroundAllowed: boolean;
    wifiOnly: boolean;
  }
  
  /**
   * Edge computing optimized data
   */
  export interface EdgeSensorData {
    id: UUID;
    sensorType: SensorType;
    timestamp: ISOTimestamp;
    value: number | Vector3D;  // Single value or vector
    quality: number;           // 0-100 quality score
    
    // Edge processing results
    processed: boolean;
    anomaly: boolean;
    confidence: Percentage;
  }
  
  /**
   * Battery-aware collection policy
   */
  export interface BatteryAwarePolicy {
    batteryLevel: Percentage;
    frequency: number;         // Adaptive frequency
    sensors: SensorType[];     // Enabled sensors
    compression: boolean;      // Enable compression
    caching: boolean;          // Enable local caching
  }
  
  // ============================= COMPRESSION & OPTIMIZATION =============================
  
  /**
   * Compressed sensor data for efficient transport
   */
  export interface CompressedSensorData {
    format: 'gzip' | 'lz4' | 'brotli';
    originalSize: number;
    compressedSize: number;
    data: string;              // Base64 encoded compressed data
    checksum: string;
  }
  
  /**
   * Delta compression for continuous data
   */
  export interface DeltaSensorData {
    baseTimestamp: ISOTimestamp;
    timeDeltas: number[];      // Time differences in ms
    valueDeltas: number[];     // Value differences
    qualityScores: number[];   // Quality scores
  }
  
  // ============================= REQUEST/RESPONSE OPTIMIZATION =============================
  
  /**
   * Optimized sensor data request
   */
  export interface SensorDataRequest extends BaseRequest {
    deviceId: UUID;
    sensorTypes: SensorType[];
    duration?: number;         // seconds
    frequency?: number;        // Hz
    format: DataFormat;
    compression?: boolean;
    
    // Mobile optimization
    powerMode?: 'eco' | 'balanced' | 'performance';
    batteryLevel?: Percentage;
    
    // Edge optimization
    edgeProcessing?: boolean;
    localCaching?: boolean;
  }
  
  /**
   * Optimized sensor data response
   */
  export interface SensorDataResponse extends BaseResponse<SensorDataCore[]> {
    streamId?: UUID;
    totalSamples: number;
    avgLatency: number;
    dataSize: number;
    compression?: {
      enabled: boolean;
      ratio: number;
      algorithm: string;
    };
    
    // Performance metrics
    performance: {
      processingTime: number;
      batteryImpact: 'low' | 'medium' | 'high';
      networkUsage: number;
    };
  }
  
  /**
   * Real-time stream subscription
   */
  export interface StreamSubscription {
    subscriptionId: UUID;
    deviceId: UUID;
    sensorTypes: SensorType[];
    config: StreamConfig;
    status: StreamStatus;
    createdAt: ISOTimestamp;
    expiresAt?: ISOTimestamp;
  }
  
  // ============================= ANALYTICS & MONITORING =============================
  
  /**
   * Lightweight sensor analytics
   */
  export interface SensorAnalyticsLite {
    sensorType: SensorType;
    samplesCount: number;
    avgQuality: Percentage;
    uptime: Percentage;
    
    // Performance metrics
    avgLatency: number;
    throughput: number;
    errorRate: Percentage;
    
    // Trends (summary only)
    trend: 'improving' | 'stable' | 'degrading';
    lastUpdated: ISOTimestamp;
  }
  
  /**
   * Device performance summary
   */
  export interface DevicePerformanceSummary {
    deviceId: UUID;
    activeSensors: number;
    totalSamples: number;
    avgQuality: Percentage;
    batteryUsage: Percentage;
    networkUsage: number;
    
    // Health indicators
    healthy: boolean;
    issues: string[];
    recommendations: string[];
  }
  
  // ============================= EXPORTS =============================
  
  export * from './sensor-utils';
  export * from './sensor-validators';
  export * from './sensor-constants';