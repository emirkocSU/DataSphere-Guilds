/**
 * =====================================================================================
 * @datasphere/core - IoT Device Management (Optimized)
 * =====================================================================================
 * 
 * Mobile-first, edge computing optimized device management types
 * Reference-based architecture for minimal memory footprint
 * 
 * @version 1.0.0
 * @author DataSphere Guilds Engineering Team
 * @license MIT
 * 
 * Performance Features:
 * - Reference-based heavy data (10x smaller objects)
 * - Mobile battery optimization
 * - Edge computing support
 * - Fast device discovery
 * - Minimal network usage
 * - Real-time device monitoring
 * =====================================================================================
 */

import {
  Uuid as UUID,
  IsoTimestamp as ISOTimestamp,
  Percentage,
} from './core/types/common.types';

import {
  BaseRequest,
  BaseResponse,
  Status,
  Priority,
  SensorType,
  SensorStatus,
} from './core/types/sensor-core.types';
  
  // ============================= OPTIMIZED DEVICE ENUMS =============================
  
  /**
   * Essential device types for mobile/edge
   */
  export enum DeviceType {
    SMARTPHONE = 'smartphone',
    TABLET = 'tablet',
    SMARTWATCH = 'smartwatch',
    FITNESS_TRACKER = 'fitness_tracker',
    SMART_HOME = 'smart_home',
    VEHICLE = 'vehicle',
    INDUSTRIAL = 'industrial',
    EDGE_GATEWAY = 'edge_gateway'
  }
  
  /**
   * Connection types optimized for mobile
   */
  export enum ConnectionType {
    WIFI = 'wifi',
    CELLULAR = 'cellular',
    BLUETOOTH = 'bluetooth',
    ETHERNET = 'ethernet',
    SATELLITE = 'satellite'
  }
  
  /**
   * Device health status
   */
  export enum DeviceHealth {
    HEALTHY = 'healthy',
    WARNING = 'warning',
    CRITICAL = 'critical',
    OFFLINE = 'offline'
  }
  
  // ============================= CORE DEVICE TYPES (OPTIMIZED) =============================
  
  /**
   * Lightweight IoT device (3-4KB vs 50KB original)
   * Essential info only, heavy data via references
   */
  export interface IoTDeviceCore {
    id: UUID;
    name: string;
    type: DeviceType;
    manufacturer: string;
    model: string;
    status: SensorStatus;
    health: DeviceHealth;
    
    // Essential connectivity info
    connectivity: ConnectivityCore;
    
    // Essential capabilities
    sensors: SensorType[];
    batteryLevel?: Percentage;
    signalStrength?: number;
    
    // Ownership
    owner: UUID;
    groups: string[];
    
    // References for heavy data (load on demand)
    capabilitiesRef?: string;    // Full device capabilities
    configurationRef?: string;   // Device configuration
    maintenanceRef?: string;     // Maintenance info
    securityRef?: string;        // Security details
    
    // Timestamps
    createdAt: ISOTimestamp;
    lastSeen?: ISOTimestamp;
    lastSync?: ISOTimestamp;
  }
  
  /**
   * Extended device with optional heavy components
   */
  export interface IoTDeviceExtended {
    core: IoTDeviceCore;
    capabilities?: DeviceCapabilitiesLite;
    configuration?: DeviceConfigurationLite;
    maintenance?: MaintenanceInfoLite;
    security?: DeviceSecurityLite;
  }
  
  /**
   * Lightweight connectivity info
   */
  export interface ConnectivityCore {
    type: ConnectionType;
    status: 'connected' | 'disconnected' | 'connecting';
    signalStrength: number;      // 0-100
    bandwidth?: number;          // Mbps
    latency?: number;            // ms
    lastConnection: ISOTimestamp;
    
    // Mobile optimization
    roaming?: boolean;
    dataUsage?: number;          // MB today
    wifiSSID?: string;           // Current WiFi
  }
  
  // ============================= DEVICE CAPABILITIES (LITE) =============================
  
  /**
   * Lightweight device capabilities
   */
  export interface DeviceCapabilitiesLite {
    sensors: SensorCapabilityLite[];
    storage: StorageInfo;
    processing: ProcessingInfo;
    power: PowerInfo;
    connectivity: ConnectionType[];
    
    // Performance summary
    performanceScore: number;    // 0-100
    maxThroughput: number;       // samples/second
    
    // Heavy specs via reference
    fullSpecsRef?: string;
  }
  
  /**
   * Lightweight sensor capability
   */
  export interface SensorCapabilityLite {
    type: SensorType;
    enabled: boolean;
    maxSampleRate: number;       // Hz
    accuracy: number;            // 0-100
    powerConsumption: number;    // mW
    
    // Detailed specs via reference
    fullSpecRef?: string;
  }
  
  /**
   * Essential storage info
   */
  export interface StorageInfo {
    total: number;               // MB
    available: number;           // MB
    type: 'flash' | 'emmc' | 'nvme';
    speed: number;               // MB/s
  }
  
  /**
   * Essential processing info
   */
  export interface ProcessingInfo {
    cores: number;
    frequency: number;           // MHz
    memory: number;              // MB
    architecture: string;       // arm64, x86_64
    
    // AI/ML capabilities
    hasNPU: boolean;
    hasDSP: boolean;
  }
  
  /**
   * Essential power info
   */
  export interface PowerInfo {
    batteryCapacity?: number;    // mAh
    currentLevel: Percentage;
    charging: boolean;
    estimatedLife: number;       // hours
    powerMode: 'eco' | 'balanced' | 'performance';
    
    // Consumption tracking
    avgConsumption: number;      // mW
    peakConsumption: number;     // mW
  }
  
  // ============================= DEVICE CONFIGURATION (LITE) =============================
  
  /**
   * Lightweight device configuration
   */
  export interface DeviceConfigurationLite {
    firmware: FirmwareInfoLite;
    settings: DeviceSettingsLite;
    
    // Configuration status
    lastConfigUpdate: ISOTimestamp;
    configVersion: string;
    pendingUpdates: number;
    
    // Heavy config via reference
    fullConfigRef?: string;
    policiesRef?: string;
    profilesRef?: string;
  }
  
  /**
   * Essential firmware info
   */
  export interface FirmwareInfoLite {
    version: string;
    buildDate: ISOTimestamp;
    updateAvailable: boolean;
    autoUpdate: boolean;
    
    // Update status
    lastUpdateCheck?: ISOTimestamp;
    updateSize?: number;         // MB
    criticalUpdate?: boolean;
  }
  
  /**
   * Essential device settings
   */
  export interface DeviceSettingsLite {
    // Core settings
    timezone: string;
    language: string;
    
    // Power settings
    powerMode: 'eco' | 'balanced' | 'performance';
    sleepTimeout: number;        // seconds
    
    // Data settings
    dataCompression: boolean;
    localCaching: boolean;
    syncFrequency: number;       // minutes
    
    // Privacy settings
    locationSharing: boolean;
    analyticsOptOut: boolean;
  }
  
  // ============================= MAINTENANCE (LITE) =============================
  
  /**
   * Lightweight maintenance info
   */
  export interface MaintenanceInfoLite {
    overallHealth: DeviceHealth;
    lastMaintenance?: ISOTimestamp;
    nextMaintenance?: ISOTimestamp;
    
    // Issue summary
    activeIssues: number;
    warningCount: number;
    errorCount: number;
    
    // Quick diagnostics
    diagnosticScore: number;     // 0-100
    uptimeScore: number;         // 0-100
    performanceScore: number;    // 0-100
    
    // Heavy maintenance data via reference
    detailedHealthRef?: string;
    maintenanceHistoryRef?: string;
    diagnosticsRef?: string;
  }
  
  /**
   * Maintenance alert summary
   */
  export interface MaintenanceAlertSummary {
    type: 'info' | 'warning' | 'error' | 'critical';
    count: number;
    latestMessage: string;
    latestTimestamp: ISOTimestamp;
    
    // Detailed alerts via reference
    detailsRef?: string;
  }
  
  // ============================= SECURITY (LITE) =============================
  
  /**
   * Lightweight device security
   */
  export interface DeviceSecurityLite {
    securityScore: number;       // 0-100
    encrypted: boolean;
    authenticated: boolean;
    
    // Certificate status
    certificateValid: boolean;
    certificateExpiry?: ISOTimestamp;
    
    // Threat summary
    threatsDetected: number;
    lastThreatScan: ISOTimestamp;
    
    // Compliance status
    compliant: boolean;
    complianceFrameworks: string[];
    
    // Heavy security data via reference
    certificatesRef?: string;
    threatsRef?: string;
    complianceRef?: string;
  }
  
  /**
   * Security threat summary
   */
  export interface SecurityThreatSummary {
    level: 'low' | 'medium' | 'high' | 'critical';
    count: number;
    latestType: string;
    latestTimestamp: ISOTimestamp;
    mitigated: number;
    
    // Detailed threats via reference
    detailsRef?: string;
  }
  
  // ============================= MOBILE & EDGE OPTIMIZATION =============================
  
  /**
   * Mobile device profile (ultra-lightweight)
   */
  export interface MobileDeviceProfile {
    deviceId: UUID;
    deviceType: DeviceType;
    
    // Mobile-specific
    osVersion: string;
    appVersion: string;
    batteryLevel: Percentage;
    isCharging: boolean;
    
    // Network optimization
    connectionType: ConnectionType;
    isWiFi: boolean;
    isRoaming: boolean;
    dataUsageToday: number;      // MB
    
    // Power optimization
    powerMode: 'low' | 'normal' | 'high';
    backgroundAllowed: boolean;
    
    // Sensor availability
    availableSensors: SensorType[];
    activeSensors: SensorType[];
    
    // Performance
    avgResponseTime: number;     // ms
    reliability: Percentage;
  }
  
  /**
   * Edge device profile (lightweight)
   */
  export interface EdgeDeviceProfile {
    deviceId: UUID;
    gatewayId?: UUID;
    
    // Edge capabilities
    localProcessing: boolean;
    cacheCapacity: number;       // MB
    computeCapacity: number;     // operations/sec
    
    // Connectivity
    upstreamBandwidth: number;   // Mbps
    downstreamBandwidth: number; // Mbps
    latencyToCloud: number;      // ms
    
    // Edge-specific
    autonomousMode: boolean;
    syncRequired: boolean;
    lastCloudSync: ISOTimestamp;
    
    // Device mesh
    connectedDevices: number;
    meshTopology: 'star' | 'mesh' | 'tree';
  }
  
  /**
   * Device discovery info (fast discovery)
   */
  export interface DeviceDiscoveryInfo {
    deviceId: UUID;
    name: string;
    type: DeviceType;
    connectionType: ConnectionType;
    signalStrength: number;
    batteryLevel?: Percentage;
    
    // Quick identification
    manufacturer: string;
    model: string;
    macAddress?: string;
    ipAddress?: string;
    
    // Discovery metadata
    discoveredAt: ISOTimestamp;
    discoveryMethod: 'broadcast' | 'scan' | 'registration' | 'manual';
    trusted: boolean;
    
    // Fast pairing
    pairingRequired: boolean;
    pairingMethod?: 'pin' | 'qr' | 'nfc' | 'bluetooth';
  }
  
  // ============================= DEVICE GROUPS & FLEET MANAGEMENT =============================
  
  /**
   * Device group (lightweight management)
   */
  export interface DeviceGroup {
    id: UUID;
    name: string;
    description: string;
    type: 'location' | 'function' | 'owner' | 'capability' | 'custom';
    
    // Group composition
    deviceCount: number;
    deviceTypes: DeviceType[];
    
    // Group status
    healthyDevices: number;
    onlineDevices: number;
    lastActivity: ISOTimestamp;
    
    // Group settings
    settings: GroupSettings;
    
    // Devices list via reference (for large groups)
    devicesRef?: string;
    
    // Management
    owner: UUID;
    managers: UUID[];
    createdAt: ISOTimestamp;
    updatedAt: ISOTimestamp;
  }
  
  /**
   * Group settings for batch management
   */
  export interface GroupSettings {
    // Sync settings
    syncInterval: number;        // minutes
    batchOperations: boolean;
    
    // Monitoring
    healthCheck: boolean;
    alerting: boolean;
    
    // Automation
    autoUpdate: boolean;
    autoMaintenance: boolean;
    
    // Policies
    powerPolicy: 'eco' | 'balanced' | 'performance';
    dataPolicy: 'minimal' | 'standard' | 'full';
    securityPolicy: 'basic' | 'standard' | 'strict';
  }
  
  /**
   * Fleet analytics summary
   */
  export interface FleetAnalyticsSummary {
    totalDevices: number;
    onlineDevices: number;
    healthyDevices: number;
    
    // Performance metrics
    avgResponseTime: number;     // ms
    avgBatteryLevel: Percentage;
    avgSignalStrength: number;
    
    // Usage metrics
    totalDataTransfer: number;   // MB today
    totalSamples: number;        // samples today
    avgUptime: Percentage;       // last 24h
    
    // Issues
    criticalIssues: number;
    warnings: number;
    offlineDevices: number;
    
    // Trends
    trend: 'improving' | 'stable' | 'degrading';
    lastUpdated: ISOTimestamp;
  }
  
  // ============================= REQUEST/RESPONSE OPTIMIZATION =============================
  
  /**
   * Device registration request (optimized)
   */
  export interface DeviceRegistrationRequest extends BaseRequest {
    device: DeviceRegistrationInfo;
    verification?: DeviceVerificationLite;
    groupId?: UUID;
    autoActivate?: boolean;
  }
  
  /**
   * Lightweight device registration info
   */
  export interface DeviceRegistrationInfo {
    name: string;
    type: DeviceType;
    manufacturer: string;
    model: string;
    serialNumber?: string;
    macAddress?: string;
    
    // Capabilities summary
    sensors: SensorType[];
    connectivity: ConnectionType[];
    
    // Owner info
    owner: UUID;
    location?: string;
    
    // Initial settings
    settings?: Partial<DeviceSettingsLite>;
  }
  
  /**
   * Lightweight device verification
   */
  export interface DeviceVerificationLite {
    method: 'certificate' | 'token' | 'pin' | 'qr';
    proof: string;
    challenge?: string;
    expiry?: ISOTimestamp;
  }
  
  /**
   * Device registration response
   */
  export interface DeviceRegistrationResponse extends BaseResponse<IoTDeviceCore> {
    deviceId: UUID;
    credentials?: DeviceCredentialsLite;
    activationRequired: boolean;
    nextSteps: string[];
  }
  
  /**
   * Lightweight device credentials
   */
  export interface DeviceCredentialsLite {
    deviceId: UUID;
    token: string;
    secret?: string;
    expiresAt?: ISOTimestamp;
    
    // Connection info
    endpoint: string;
    port: number;
    protocol: 'mqtt' | 'ws' | 'http' | 'coap';
  }
  
  /**
   * Device discovery request
   */
  export interface DeviceDiscoveryRequest extends BaseRequest {
    method: 'broadcast' | 'scan' | 'filter';
    filters?: DeviceDiscoveryFilter;
    timeout?: number;            // seconds
    maxResults?: number;
  }
  
  /**
   * Device discovery filter
   */
  export interface DeviceDiscoveryFilter {
    deviceTypes?: DeviceType[];
    manufacturers?: string[];
    connectionTypes?: ConnectionType[];
    signalStrength?: number;     // minimum
    batteryLevel?: number;       // minimum
    proximity?: number;          // meters
  }
  
  /**
   * Device discovery response
   */
  export interface DeviceDiscoveryResponse extends BaseResponse<DeviceDiscoveryInfo[]> {
    discoveredCount: number;
    method: string;
    duration: number;            // ms
    coverage: string;            // area covered
  }
  
  /**
   * Device status update (real-time)
   */
  export interface DeviceStatusUpdate {
    deviceId: UUID;
    timestamp: ISOTimestamp;
    
    // Status changes
    status?: SensorStatus;
    health?: DeviceHealth;
    batteryLevel?: Percentage;
    signalStrength?: number;
    
    // Connectivity changes
    connectionType?: ConnectionType;
    connected?: boolean;
    
    // Activity
    lastActivity?: ISOTimestamp;
    activeSensors?: SensorType[];
    
    // Performance
    responseTime?: number;       // ms
    throughput?: number;         // samples/sec
    errorRate?: Percentage;
  }
  
  /**
   * Bulk device operation request
   */
  export interface BulkDeviceOperationRequest extends BaseRequest {
    operation: 'update' | 'configure' | 'restart' | 'maintenance' | 'firmware_update';
    claude
    
    deviceIds: UUID[];
    parameters?: Record<string, any>;
    schedule?: ISOTimestamp;     // Optional scheduling
    priority?: Priority;
  }
  
  /**
   * Bulk device operation response
   */
  export interface BulkDeviceOperationResponse extends BaseResponse<BulkOperationResult[]> {
    operationId: UUID;
    totalDevices: number;
    successCount: number;
    failureCount: number;
    estimatedCompletion?: ISOTimestamp;
  }
  
  /**
   * Bulk operation result
   */
  export interface BulkOperationResult {
    deviceId: UUID;
    success: boolean;
    message?: string;
    completedAt?: ISOTimestamp;
    error?: string;
  }
