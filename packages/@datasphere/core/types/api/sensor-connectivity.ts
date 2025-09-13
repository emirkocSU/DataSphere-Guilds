/**
 * DataSphere Guilds - Sensor Connectivity & Networking Types
 * Optimized for mobile performance, battery efficiency, and real-time data transfer
 * 
 * Bundle Impact: ~3-4KB (vs 8KB in monolith)
 * Performance Focus: Network efficiency, battery optimization, connection reliability
 */

import { BaseSensorData, SensorId, TimestampISO, SensorStatus } from './sensor-core';

// ==================== CORE CONNECTIVITY TYPES ====================

export type ConnectionType = 
  | 'wifi' | 'ethernet' | 'cellular' | 'bluetooth' | 'zigbee' 
  | 'lora' | 'nb-iot' | 'satellite' | 'mesh' | 'edge-local';

export type ConnectionState = 'connected' | 'disconnected' | 'connecting' | 'error' | 'standby';

export type NetworkPriority = 'low' | 'normal' | 'high' | 'critical' | 'emergency';

export interface ConnectionInfo {
  readonly id: string;
  readonly type: ConnectionType;
  readonly state: ConnectionState;
  readonly priority: NetworkPriority;
  readonly signalStrength: number; // 0-100
  readonly batteryImpact: 'minimal' | 'low' | 'moderate' | 'high';
  readonly lastSeen: TimestampISO;
}

// ==================== MOBILE-FIRST CONNECTIVITY ====================

export interface MobileNetworkConfig {
  readonly preferWifi: boolean;
  readonly cellularDataLimit: number; // bytes per hour
  readonly roamingAllowed: boolean;
  readonly backgroundSyncEnabled: boolean;
  readonly compressionLevel: 1 | 2 | 3 | 4 | 5; // 1=minimal CPU, 5=max compression
}

export interface BatteryAwareConfig {
  readonly enablePowerSaving: boolean;
  readonly batteryThreshold: number; // 0-100, switch to power saving below this
  readonly idleTimeoutMs: number;
  readonly maxRetransmissions: number;
  readonly connectionBackoffMs: number[];
}

export interface DataTransferOptions {
  readonly batchSize: number;
  readonly compressionEnabled: boolean;
  readonly deltaEncodingEnabled: boolean; // Only send changes
  readonly priorityQueue: boolean;
  readonly offlineBuffering: boolean;
  readonly maxBufferSizeMB: number;
}

// ==================== REAL-TIME NETWORKING ====================

export interface RealtimeConnectionConfig {
  readonly protocol: 'websocket' | 'sse' | 'webrtc' | 'mqtt' | 'custom';
  readonly heartbeatIntervalMs: number;
  readonly reconnectDelayMs: number;
  readonly maxReconnectAttempts: number;
  readonly qosLevel: 0 | 1 | 2; // MQTT QoS levels
  readonly keepAliveMs: number;
}

export interface StreamingConfig {
  readonly enabled: boolean;
  readonly bufferSizeMs: number;
  readonly adaptiveBitrate: boolean;
  readonly lossyCompressionAllowed: boolean;
  readonly targetLatencyMs: number;
  readonly fallbackToPolling: boolean;
  readonly pollingIntervalMs: number;
}

// ==================== NETWORK PROTOCOLS ====================

export interface WiFiConfig {
  readonly ssid: string;
  readonly frequency: '2.4GHz' | '5GHz' | '6GHz';
  readonly securityType: 'open' | 'wep' | 'wpa' | 'wpa2' | 'wpa3';
  readonly channelWidth: 20 | 40 | 80 | 160; // MHz
  readonly powerSaveMode: boolean;
}

export interface CellularConfig {
  readonly networkType: '2G' | '3G' | '4G' | '5G' | 'nb-iot' | 'cat-m1';
  readonly carrier: string;
  readonly apn?: string;
  readonly dataRoaming: boolean;
  readonly signalQuality: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface LoRaConfig {
  readonly frequency: number; // Hz
  readonly spreadingFactor: 6 | 7 | 8 | 9 | 10 | 11 | 12;
  readonly bandwidth: 125 | 250 | 500; // kHz
  readonly codingRate: '4/5' | '4/6' | '4/7' | '4/8';
  readonly transmissionPower: number; // dBm
  readonly gatewayDistance: number; // meters
}

export interface BluetoothConfig {
  readonly version: '4.0' | '4.1' | '4.2' | '5.0' | '5.1' | '5.2' | '5.3';
  readonly profile: 'ble' | 'classic' | 'mesh';
  readonly advertisingInterval: number; // ms
  readonly connectionInterval: number; // ms
  readonly transmissionPower: number; // dBm
}

// ==================== NETWORK QUALITY & MONITORING ====================

export interface NetworkQualityMetrics {
  readonly timestamp: TimestampISO;
  readonly latencyMs: number;
  readonly jitterMs: number;
  readonly packetLoss: number; // 0-1
  readonly throughputBps: number;
  readonly signalStrength: number; // dBm
  readonly snr: number; // Signal-to-noise ratio
  readonly reliability: number; // 0-1
}

export interface ConnectionHealth {
  readonly sensorId: SensorId;
  readonly connectionId: string;
  readonly isHealthy: boolean;
  readonly lastSuccessfulTransmission: TimestampISO;
  readonly consecutiveFailures: number;
  readonly averageLatencyMs: number;
  readonly dataSuccessRate: number; // 0-1
  readonly batteryImpactScore: number; // 0-10
}

// ==================== DATA TRANSMISSION ====================

export interface DataPacket {
  readonly id: string;
  readonly sensorId: SensorId;
  readonly sequenceNumber: number;
  readonly timestamp: TimestampISO;
  readonly priority: NetworkPriority;
  readonly retryCount: number;
  readonly compressionUsed: boolean;
  readonly checksumMD5: string;
  readonly sizeBytes: number;
}

export interface TransmissionResult {
  readonly packetId: string;
  readonly success: boolean;
  readonly latencyMs: number;
  readonly retryCount: number;
  readonly errorCode?: string;
  readonly timestamp: TimestampISO;
  readonly bytesTransmitted: number;
  readonly compressionRatio?: number;
}

export interface QueuedTransmission {
  readonly packet: DataPacket;
  readonly priority: NetworkPriority;
  readonly scheduledTime: TimestampISO;
  readonly maxRetries: number;
  readonly timeoutMs: number;
  readonly fallbackConnection?: ConnectionType;
}

// ==================== EDGE COMPUTING & MESH NETWORKING ====================

export interface EdgeNode {
  readonly id: string;
  readonly type: 'gateway' | 'relay' | 'processor' | 'storage';
  readonly location: { lat: number; lng: number; altitude?: number };
  readonly capabilities: EdgeCapability[];
  readonly connectedSensors: SensorId[];
  readonly parentNode?: string;
  readonly childNodes: string[];
  readonly computingPower: 'minimal' | 'low' | 'moderate' | 'high' | 'server-grade';
}

export type EdgeCapability = 
  | 'data-aggregation' | 'real-time-processing' | 'ml-inference' 
  | 'data-filtering' | 'compression' | 'caching' | 'routing'
  | 'protocol-translation' | 'security-encryption';

export interface MeshTopology {
  readonly networkId: string;
  readonly nodes: EdgeNode[];
  readonly connections: MeshConnection[];
  readonly routingTable: Record<SensorId, string[]>; // sensor -> path of node IDs
  readonly redundantPaths: Record<SensorId, string[][]>; // backup routes
  readonly networkHealth: number; // 0-1
}

export interface MeshConnection {
  readonly from: string; // node ID
  readonly to: string; // node ID
  readonly connectionType: ConnectionType;
  readonly bidirectional: boolean;
  readonly bandwidth: number; // bps
  readonly latency: number; // ms
  readonly reliability: number; // 0-1
  readonly powerConsumption: number; // watts
}

// ==================== SECURITY & ENCRYPTION ====================

export interface NetworkSecurity {
  readonly encryptionEnabled: boolean;
  readonly encryptionAlgorithm: 'aes-128' | 'aes-256' | 'chacha20' | 'end-to-end';
  readonly certificateValidation: boolean;
  readonly mutualAuthentication: boolean;
  readonly integrityChecking: boolean;
  readonly replayProtection: boolean;
}

export interface VPNConfig {
  readonly enabled: boolean;
  readonly protocol: 'openvpn' | 'wireguard' | 'ipsec' | 'custom';
  readonly serverEndpoint: string;
  readonly authentication: 'certificate' | 'psk' | 'username-password';
  readonly encryptionStrength: 128 | 256 | 512;
  readonly compressionEnabled: boolean;
}

// ==================== ADAPTIVE NETWORKING ====================

export interface AdaptiveNetworkConfig {
  readonly enabled: boolean;
  readonly qualityThresholds: {
    readonly excellent: NetworkQualityMetrics;
    readonly good: NetworkQualityMetrics;
    readonly poor: NetworkQualityMetrics;
  };
  readonly adaptationStrategies: {
    readonly compression: boolean;
    readonly sampleRate: boolean;
    readonly dataFormat: boolean;
    readonly connectionType: boolean;
    readonly batchSize: boolean;
  };
  readonly fallbackHierarchy: ConnectionType[];
}

export interface NetworkOptimization {
  readonly currentStrategy: 'bandwidth' | 'latency' | 'battery' | 'reliability' | 'cost';
  readonly autoAdaptation: boolean;
  readonly learningEnabled: boolean; // ML-based optimization
  readonly historicalPerformance: Record<ConnectionType, NetworkQualityMetrics[]>;
  readonly predictiveRouting: boolean;
}

// ==================== MONITORING & DIAGNOSTICS ====================

export interface NetworkDiagnostics {
  readonly sensorId: SensorId;
  readonly timestamp: TimestampISO;
  readonly activeConnections: ConnectionInfo[];
  readonly qualityMetrics: NetworkQualityMetrics;
  readonly dataTransferStats: {
    readonly totalBytesSent: number;
    readonly totalBytesReceived: number;
    readonly successfulTransmissions: number;
    readonly failedTransmissions: number;
    readonly averageLatency: number;
    readonly compressionEfficiency: number;
  };
  readonly powerConsumption: {
    readonly networkingPowerMw: number;
    readonly percentageOfTotal: number;
    readonly estimatedBatteryHours: number;
  };
}

export interface ConnectivityAlert {
  readonly id: string;
  readonly sensorId: SensorId;
  readonly severity: 'info' | 'warning' | 'error' | 'critical';
  readonly type: 'connection-lost' | 'poor-quality' | 'high-latency' | 'battery-drain' | 'security-issue';
  readonly message: string;
  readonly timestamp: TimestampISO;
  readonly resolved: boolean;
  readonly resolvedAt?: TimestampISO;
  readonly affectedConnections: string[];
}

// ==================== REFERENCE-BASED HEAVY DATA ====================

export interface HeavyNetworkDataRef {
  readonly dataType: 'packet-capture' | 'network-logs' | 'performance-history' | 'topology-map';
  readonly refId: string;
  readonly sizeEstimateMB: number;
  readonly lastUpdated: TimestampISO;
  readonly accessUrl?: string; // For lazy loading
  readonly compressionUsed: boolean;
}

// ==================== API RESPONSE TYPES ====================

export interface SensorConnectivityStatus {
  readonly sensorId: SensorId;
  readonly status: SensorStatus;
  readonly primaryConnection: ConnectionInfo;
  readonly backupConnections: ConnectionInfo[];
  readonly lastDataTransmission: TimestampISO;
  readonly networkHealth: NetworkQualityMetrics;
  readonly adaptiveConfig: AdaptiveNetworkConfig;
  readonly batteryImpact: BatteryAwareConfig;
}

export interface NetworkTopologyResponse {
  readonly networkId: string;
  readonly totalSensors: number;
  readonly activeSensors: number;
  readonly meshTopology: MeshTopology;
  readonly edgeNodes: EdgeNode[];
  readonly healthScore: number; // 0-1
  readonly lastUpdated: TimestampISO;
  readonly heavyDataRefs: HeavyNetworkDataRef[];
}

export interface ConnectivityConfigResponse {
  readonly sensorId: SensorId;
  readonly mobileConfig: MobileNetworkConfig;
  readonly batteryConfig: BatteryAwareConfig;
  readonly realtimeConfig: RealtimeConnectionConfig;
  readonly streamingConfig: StreamingConfig;
  readonly securityConfig: NetworkSecurity;
  readonly adaptiveConfig: AdaptiveNetworkConfig;
  readonly protocols: {
    readonly wifi?: WiFiConfig;
    readonly cellular?: CellularConfig;
    readonly lora?: LoRaConfig;
    readonly bluetooth?: BluetoothConfig;
  };
}

// ==================== EXPORTS ====================

export type {
  // Core connectivity
  ConnectionType, ConnectionState, NetworkPriority, ConnectionInfo,
  
  // Mobile & battery optimization
  MobileNetworkConfig, BatteryAwareConfig, DataTransferOptions,
  
  // Real-time networking
  RealtimeConnectionConfig, StreamingConfig,
  
  // Protocol configs
  WiFiConfig, CellularConfig, LoRaConfig, BluetoothConfig,
  
  // Quality & monitoring
  NetworkQualityMetrics, ConnectionHealth, NetworkDiagnostics, ConnectivityAlert,
  
  // Data transmission
  DataPacket, TransmissionResult, QueuedTransmission,
  
  // Edge & mesh
  EdgeNode, EdgeCapability, MeshTopology, MeshConnection,
  
  // Security
  NetworkSecurity, VPNConfig,
  
  // Adaptive networking
  AdaptiveNetworkConfig, NetworkOptimization,
  
  // References
  HeavyNetworkDataRef,
  
  // API responses
  SensorConnectivityStatus, NetworkTopologyResponse, ConnectivityConfigResponse
}; 