/**
 * =====================================================================================
 * DATASPHERE GUILDS - WEB APIs TYPE DEFINITIONS
 * =====================================================================================
 * 
 * Enterprise-grade web API type system for browser-based data collection
 * Supporting all modern Web APIs, Browser Capabilities, and Web Sensors
 * Designed to compete with billion-dollar companies (Tesla, Apple, Amazon, Scale AI)
 * 
 * @version 1.0.0
 * @author DataSphere Guilds Engineering Team
 * @description Complete web API type definitions for the world's most advanced data marketplace
 * 
 * Coverage Areas:
 * - Browser Capability Detection
 * - Web Sensor APIs (Generic Sensor, Web Bluetooth, etc.)
 * - Media Capture APIs (Camera, Microphone, Screen)
 * - Geolocation & Position APIs
 * - Storage APIs (IndexedDB, Local Storage, etc.)
 * - Network APIs (Fetch, WebSocket, WebRTC)
 * - Performance & Monitoring APIs
 * - Service Worker & PWA APIs
 * - Payment & Credential APIs
 * - Device APIs (Vibration, Battery, Gamepad)
 * - Security & Permission APIs
 * - File System & Data APIs
 * - WebXR & Immersive APIs
 * =====================================================================================
 */

import { UUID, ISOTimestamp, Percentage } from '../../src/types/index';

// ============================= BROWSER CAPABILITY DETECTION =============================

/**
 * Browser capability levels
 */
export enum BrowserCapabilityLevel {
  NONE = 'none',
  LIMITED = 'limited',
  PARTIAL = 'partial',
  FULL = 'full',
  ENHANCED = 'enhanced'
}

/**
 * Browser feature support
 */
export interface BrowserFeatureSupport {
  supported: boolean;
  level: BrowserCapabilityLevel;
  version?: string;
  prefix?: string;
  notes?: string[];
  fallback?: string;
}

/**
 * Comprehensive browser capabilities
 */
export interface BrowserCapabilities {
  // Core APIs
  fetch: BrowserFeatureSupport;
  webSockets: BrowserFeatureSupport;
  webWorkers: BrowserFeatureSupport;
  serviceWorkers: BrowserFeatureSupport;
  webAssembly: BrowserFeatureSupport;
  
  // Storage
  localStorage: BrowserFeatureSupport;
  sessionStorage: BrowserFeatureSupport;
  indexedDB: BrowserFeatureSupport;
  webSQL: BrowserFeatureSupport;
  cacheAPI: BrowserFeatureSupport;
  
  // Media & Sensors
  getUserMedia: BrowserFeatureSupport;
  getDisplayMedia: BrowserFeatureSupport;
  webRTC: BrowserFeatureSupport;
  geolocation: BrowserFeatureSupport;
  deviceOrientation: BrowserFeatureSupport;
  ambientLight: BrowserFeatureSupport;
  proximity: BrowserFeatureSupport;
  
  // Modern Sensors
  genericSensor: BrowserFeatureSupport;
  accelerometer: BrowserFeatureSupport;
  gyroscope: BrowserFeatureSupport;
  magnetometer: BrowserFeatureSupport;
  absoluteOrientationSensor: BrowserFeatureSupport;
  relativeOrientationSensor: BrowserFeatureSupport;
  linearAccelerationSensor: BrowserFeatureSupport;
  gravitySensor: BrowserFeatureSupport;
  
  // Connectivity
  webBluetooth: BrowserFeatureSupport;
  webUSB: BrowserFeatureSupport;
  webSerial: BrowserFeatureSupport;
  webHID: BrowserFeatureSupport;
  webNFC: BrowserFeatureSupport;
  
  // Device APIs
  vibration: BrowserFeatureSupport;
  battery: BrowserFeatureSupport;
  gamepad: BrowserFeatureSupport;
  screenOrientation: BrowserFeatureSupport;
  wakeLock: BrowserFeatureSupport;
  
  // File & Data
  fileSystem: BrowserFeatureSupport;
  fileSystemAccess: BrowserFeatureSupport;
  clipboard: BrowserFeatureSupport;
  webShare: BrowserFeatureSupport;
  
  // Security & Permissions
  permissionsAPI: BrowserFeatureSupport;
  credentialManagement: BrowserFeatureSupport;
  webAuthentication: BrowserFeatureSupport;
  
  // Payment & Commerce
  paymentRequest: BrowserFeatureSupport;
  
  // Performance
  performanceObserver: BrowserFeatureSupport;
  intersectionObserver: BrowserFeatureSupport;
  mutationObserver: BrowserFeatureSupport;
  resizeObserver: BrowserFeatureSupport;
  
  // Graphics & Display
  webGL: BrowserFeatureSupport;
  webGL2: BrowserFeatureSupport;
  webGPU: BrowserFeatureSupport;
  canvas: BrowserFeatureSupport;
  offscreenCanvas: BrowserFeatureSupport;
  
  // Immersive
  webXR: BrowserFeatureSupport;
  webVR: BrowserFeatureSupport;
  
  // Progressive Web App
  manifest: BrowserFeatureSupport;
  pushAPI: BrowserFeatureSupport;
  notificationAPI: BrowserFeatureSupport;
  backgroundSync: BrowserFeatureSupport;
  
  // Misc
  fullscreen: BrowserFeatureSupport;
  pointerLock: BrowserFeatureSupport;
  requestIdleCallback: BrowserFeatureSupport;
  broadcastChannel: BrowserFeatureSupport;
}

// ============================= GEOLOCATION & POSITION APIs =============================

/**
 * Enhanced geolocation options
 */
export interface EnhancedGeolocationOptions extends PositionOptions {
  // Standard options: enableHighAccuracy, timeout, maximumAge
  fallbackToIP?: boolean;
  requireGPS?: boolean;
  backgroundMode?: boolean;
  watchChanges?: boolean;
  minUpdateDistance?: number;
  trackHeading?: boolean;
  trackSpeed?: boolean;
}

/**
 * Enhanced position interface
 */
export interface EnhancedPosition extends GeolocationPosition {
  timestamp: ISOTimestamp;
  source: 'gps' | 'network' | 'passive' | 'ip' | 'manual';
  batteryImpact: 'low' | 'medium' | 'high';
  accuracy: {
    horizontal: number;
    vertical?: number;
    heading?: number;
    speed?: number;
  };
  metadata: {
    provider: string;
    satellites?: number;
    signalStrength?: number;
    indoorOutdoor?: 'indoor' | 'outdoor' | 'unknown';
  };
}

/**
 * Geolocation service configuration
 */
export interface GeolocationServiceConfig {
  options: EnhancedGeolocationOptions;
  fallbackProviders: string[];
  caching: {
    enabled: boolean;
    maxAge: number;
    minAccuracy: number;
  };
  privacy: {
    anonymize: boolean;
    coarseLocation: boolean;
    noLogging: boolean;
  };
}

// ============================= MEDIA CAPTURE APIs =============================

/**
 * Enhanced media constraints
 */
export interface EnhancedMediaConstraints extends MediaStreamConstraints {
  video?: {
    width?: ConstrainULong;
    height?: ConstrainULong;
    frameRate?: ConstrainDouble;
    facingMode?: ConstrainDOMString;
    resizeMode?: ConstrainDOMString;
    aspectRatio?: ConstrainDouble;
    sampleRate?: ConstrainULong;
    sampleSize?: ConstrainULong;
    echoCancellation?: ConstrainBoolean;
    autoGainControl?: ConstrainBoolean;
    noiseSuppression?: ConstrainBoolean;
    latency?: ConstrainDouble;
    channelCount?: ConstrainULong;
    deviceId?: ConstrainDOMString;
    groupId?: ConstrainDOMString;
    whiteBalanceMode?: ConstrainDOMString;
    exposureMode?: ConstrainDOMString;
    focusMode?: ConstrainDOMString;
    torch?: ConstrainBoolean;
    zoom?: ConstrainDouble;
    brightness?: ConstrainDouble;
    contrast?: ConstrainDouble;
    saturation?: ConstrainDouble;
    sharpness?: ConstrainDouble;
  };
  audio?: {
    echoCancellation?: ConstrainBoolean;
    autoGainControl?: ConstrainBoolean;
    noiseSuppression?: ConstrainBoolean;
    voiceIsolation?: ConstrainBoolean;
    sampleRate?: ConstrainULong;
    sampleSize?: ConstrainULong;
    latency?: ConstrainDouble;
    channelCount?: ConstrainULong;
    deviceId?: ConstrainDOMString;
    groupId?: ConstrainDOMString;
    volume?: ConstrainDouble;
    beamforming?: ConstrainBoolean;
  };
  screen?: {
    cursor?: ConstrainDOMString;
    displaySurface?: ConstrainDOMString;
    logicalSurface?: ConstrainBoolean;
    restrictOwnAudio?: ConstrainBoolean;
    suppressLocalAudioPlayback?: ConstrainBoolean;
    surfaceSwitching?: ConstrainDOMString;
    systemAudio?: ConstrainDOMString;
  };
}

/**
 * Media device extended info
 */
export interface ExtendedMediaDeviceInfo extends MediaDeviceInfo {
  capabilities?: MediaTrackCapabilities;
  settings?: MediaTrackSettings;
  constraints?: MediaTrackConstraints;
  isDefault?: boolean;
  batteryLevel?: number;
  connectionType?: 'usb' | 'bluetooth' | 'builtin' | 'unknown';
  vendor?: string;
  model?: string;
  serialNumber?: string;
  driverVersion?: string;
}

/**
 * Media capture session
 */
export interface MediaCaptureSession {
  id: UUID;
  stream: MediaStream;
  constraints: EnhancedMediaConstraints;
  devices: ExtendedMediaDeviceInfo[];
  startTime: ISOTimestamp;
  duration: number;
  stats: {
    framesDropped: number;
    framesCaptured: number;
    bytesTransferred: number;
    bandwidth: number;
    averageFrameRate: number;
    resolution: { width: number; height: number };
  };
  quality: {
    overall: Percentage;
    video: Percentage;
    audio: Percentage;
    stability: Percentage;
  };
  metadata: Record<string, any>;
}

// ============================= WEB SENSOR APIs =============================

/**
 * Generic sensor configuration
 */
export interface WebSensorConfig {
  frequency?: number;
  threshold?: number;
  timeout?: number;
  accuracy?: 'low' | 'medium' | 'high';
  referenceFrame?: 'device' | 'screen';
  autoStart?: boolean;
  continuous?: boolean;
}

/**
 * Sensor reading data
 */
export interface SensorReading {
  timestamp: ISOTimestamp;
  accuracy?: number;
  reliability: Percentage;
  source: string;
  rawData: Record<string, number>;
  processedData?: Record<string, number>;
  metadata?: Record<string, any>;
}

/**
 * Accelerometer reading
 */
export interface AccelerometerReading extends SensorReading {
  x: number;
  y: number;
  z: number;
  magnitude: number;
  includesGravity: boolean;
}

/**
 * Gyroscope reading
 */
export interface GyroscopeReading extends SensorReading {
  x: number; // Angular velocity around X-axis
  y: number; // Angular velocity around Y-axis
  z: number; // Angular velocity around Z-axis
  magnitude: number;
}

/**
 * Magnetometer reading
 */
export interface MagnetometerReading extends SensorReading {
  x: number; // Magnetic field strength along X-axis
  y: number; // Magnetic field strength along Y-axis
  z: number; // Magnetic field strength along Z-axis
  magnitude: number;
  heading?: number; // Compass heading
}

/**
 * Orientation sensor reading
 */
export interface OrientationReading extends SensorReading {
  quaternion: [number, number, number, number];
  euler: {
    alpha: number; // Z-axis rotation (yaw)
    beta: number;  // X-axis rotation (pitch)
    gamma: number; // Y-axis rotation (roll)
  };
  matrix?: number[][]; // 3x3 rotation matrix
}

/**
 * Ambient light reading
 */
export interface AmbientLightReading extends SensorReading {
  illuminance: number; // Lux
  category: 'dark' | 'dim' | 'normal' | 'bright' | 'very-bright';
}

/**
 * Proximity reading
 */
export interface ProximityReading extends SensorReading {
  distance: number;
  max: number;
  near: boolean;
}

// ============================= WEB BLUETOOTH APIs =============================

/**
 * Enhanced Bluetooth device info
 */
export interface EnhancedBluetoothDevice {
  id: string;
  name?: string;
  advertisementName?: string;
  deviceClass?: number;
  vendorIDSource?: string;
  vendorID?: number;
  productID?: number;
  productVersion?: number;
  uuids?: string[];
  gatt?: BluetoothRemoteGATTServer;
  connected: boolean;
  paired: boolean;
  trusted: boolean;
  rssi?: number;
  txPower?: number;
  batteryLevel?: number;
  services: BluetoothServiceInfo[];
  lastSeen: ISOTimestamp;
  metadata: {
    manufacturer?: string;
    model?: string;
    firmwareVersion?: string;
    hardwareVersion?: string;
    capabilities: string[];
  };
}

/**
 * Bluetooth service information
 */
export interface BluetoothServiceInfo {
  uuid: string;
  isPrimary: boolean;
  deviceId: string;
  characteristics: BluetoothCharacteristicInfo[];
}

/**
 * Bluetooth characteristic information
 */
export interface BluetoothCharacteristicInfo {
  uuid: string;
  serviceUuid: string;
  properties: BluetoothCharacteristicProperties;
  descriptors?: BluetoothDescriptorInfo[];
  value?: DataView;
  lastRead?: ISOTimestamp;
  lastWrite?: ISOTimestamp;
}

/**
 * Bluetooth descriptor information
 */
export interface BluetoothDescriptorInfo {
  uuid: string;
  characteristicUuid: string;
  value?: DataView;
}

/**
 * Bluetooth scan options
 */
export interface BluetoothScanOptions {
  acceptAllDevices?: boolean;
  filters?: BluetoothLEScanFilter[];
  optionalServices?: string[];
  timeout?: number;
  continuous?: boolean;
  rssiThreshold?: number;
  manufacturerData?: Record<number, DataView>;
  serviceData?: Record<string, DataView>;
}

// ============================= WEB USB & SERIAL APIs =============================

/**
 * USB device information
 */
export interface USBDeviceInfo {
  deviceId: string;
  vendorId: number;
  productId: number;
  deviceClass: number;
  deviceSubclass: number;
  deviceProtocol: number;
  deviceVersionMajor: number;
  deviceVersionMinor: number;
  deviceVersionSubminor: number;
  manufacturerName?: string;
  productName?: string;
  serialNumber?: string;
  configuration?: USBConfiguration;
  configurations: USBConfiguration[];
  opened: boolean;
  speed: 'low' | 'full' | 'high' | 'super' | 'super-plus';
  metadata: Record<string, any>;
}

/**
 * Serial port information
 */
export interface SerialPortInfo {
  portId: string;
  vendorId?: number;
  productId?: number;
  displayName?: string;
  serialNumber?: string;
  locationId?: string;
  manufacturer?: string;
  product?: string;
  connected: boolean;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: 'none' | 'even' | 'odd' | 'mark' | 'space';
  flowControl?: 'none' | 'hardware';
  metadata: Record<string, any>;
}

// ============================= WEB STORAGE APIs =============================

/**
 * Enhanced storage quota
 */
export interface EnhancedStorageQuota {
  quota: number;
  usage: number;
  available: number;
  persistent: boolean;
  temporary?: number;
  details: {
    indexedDB: number;
    serviceWorkerRegistrations: number;
    cacheAPI: number;
    webSQL?: number;
  };
  breakdown: Record<string, number>;
}

/**
 * Storage persistence options
 */
export interface StoragePersistenceConfig {
  persistent: boolean;
  durability?: 'strict' | 'relaxed';
  quota?: number;
  estimateQuota?: boolean;
  clearOnUnload?: boolean;
  compression?: boolean;
  encryption?: {
    enabled: boolean;
    algorithm: string;
    keySize: number;
  };
}

/**
 * IndexedDB enhanced configuration
 */
export interface IndexedDBConfig {
  name: string;
  version: number;
  stores: IndexedDBStoreConfig[];
  upgrade: {
    onUpgradeNeeded?: (event: IDBVersionChangeEvent) => void;
    onBlocked?: (event: Event) => void;
    onVersionChange?: (event: IDBVersionChangeEvent) => void;
  };
  performance: {
    enableProfiling: boolean;
    cacheSize: number;
    batchSize: number;
    transactionTimeout: number;
  };
}

/**
 * IndexedDB store configuration
 */
export interface IndexedDBStoreConfig {
  name: string;
  keyPath?: string | string[];
  autoIncrement?: boolean;
  indices: IndexedDBIndexConfig[];
}

/**
 * IndexedDB index configuration
 */
export interface IndexedDBIndexConfig {
  name: string;
  keyPath: string | string[];
  unique?: boolean;
  multiEntry?: boolean;
  locale?: string;
}

// ============================= PERFORMANCE & MONITORING APIs =============================

/**
 * Web performance metrics
 */
export interface WebPerformanceMetrics {
  navigation: PerformanceNavigationTiming;
  resources: PerformanceResourceTiming[];
  paint: PerformancePaintTiming[];
  layout: PerformanceEntry[];
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  connection?: {
    effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  vitals: {
    fcp?: number; // First Contentful Paint
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
    ttfb?: number; // Time to First Byte
    tti?: number; // Time to Interactive
  };
  custom: Record<string, number>;
}

/**
 * Performance observer configuration
 */
export interface PerformanceObserverConfig {
  entryTypes: string[];
  buffered?: boolean;
  threshold?: number;
  callback: (entries: PerformanceObserverEntryList) => void;
  filter?: (entry: PerformanceEntry) => boolean;
}

// ============================= SERVICE WORKER & PWA APIs =============================

/**
 * Service worker configuration
 */
export interface ServiceWorkerConfig {
  scriptURL: string;
  scope?: string;
  type?: 'classic' | 'module';
  updateViaCache?: 'all' | 'imports' | 'none';
  strategies: {
    cache: 'cacheFirst' | 'networkFirst' | 'fastest' | 'cacheOnly' | 'networkOnly';
    precache: string[];
    runtime: RuntimeCacheConfig[];
  };
  backgroundSync?: BackgroundSyncConfig;
  push?: PushConfig;
  offline?: OfflineConfig;
}

/**
 * Runtime cache configuration
 */
export interface RuntimeCacheConfig {
  urlPattern: string | RegExp;
  handler: string;
  options?: {
    cacheName?: string;
    expiration?: {
      maxEntries?: number;
      maxAgeSeconds?: number;
      purgeOnQuotaError?: boolean;
    };
    cacheKeyWillBeUsed?: (request: Request) => Promise<string>;
    cacheWillUpdate?: (response: Response) => Promise<boolean>;
  };
}

/**
 * Background sync configuration
 */
export interface BackgroundSyncConfig {
  tag: string;
  options?: {
    minInterval?: number;
    maxRetries?: number;
    retryDelays?: number[];
  };
}

/**
 * Push notification configuration
 */
export interface PushConfig {
  userVisibleOnly: boolean;
  applicationServerKey?: BufferSource;
  swURL?: string;
  vapidDetails?: {
    subject: string;
    publicKey: string;
    privateKey: string;
  };
}

/**
 * Offline configuration
 */
export interface OfflineConfig {
  fallbackPage?: string;
  offlineGoogleAnalytics?: boolean;
  backgroundFetch?: boolean;
  periodicBackgroundSync?: {
    tag: string;
    minInterval: number;
  };
}

// ============================= PAYMENT & CREDENTIAL APIs =============================

/**
 * Enhanced payment request
 */
export interface EnhancedPaymentRequest {
  methodData: PaymentMethodData[];
  details: PaymentDetailsInit;
  options?: PaymentOptions;
  shipping?: {
    requestShipping: boolean;
    shippingType?: 'shipping' | 'delivery' | 'pickup';
  };
  contact?: {
    requestPayerName: boolean;
    requestPayerEmail: boolean;
    requestPayerPhone: boolean;
  };
  security?: {
    requireSecureContext: boolean;
    allowedOrigins?: string[];
  };
}

/**
 * Web authentication configuration
 */
export interface WebAuthenticationConfig {
  challenge: BufferSource;
  rp: PublicKeyCredentialRpEntity;
  user: PublicKeyCredentialUserEntity;
  pubKeyCredParams: PublicKeyCredentialParameters[];
  authenticatorSelection?: AuthenticatorSelectionCriteria;
  timeout?: number;
  attestation?: AttestationConveyancePreference;
  extensions?: AuthenticationExtensionsClientInputs;
  excludeCredentials?: PublicKeyCredentialDescriptor[];
}

// ============================= FILE SYSTEM & DATA APIs =============================

/**
 * File system access configuration
 */
export interface FileSystemAccessConfig {
  types?: FilePickerAcceptType[];
  excludeAcceptAllOption?: boolean;
  multiple?: boolean;
  mode?: 'read' | 'readwrite';
  suggestedName?: string;
  startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
  id?: string;
}

/**
 * File transfer progress
 */
export interface FileTransferProgress {
  loaded: number;
  total: number;
  percentage: Percentage;
  speed: number; // bytes per second
  timeRemaining: number; // seconds
  stage: 'uploading' | 'processing' | 'completed' | 'error';
}

/**
 * Web share data
 */
export interface WebShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

// ============================= WEBXR & IMMERSIVE APIs =============================

/**
 * WebXR session configuration
 */
export interface WebXRSessionConfig {
  mode: 'inline' | 'immersive-vr' | 'immersive-ar';
  requiredFeatures?: string[];
  optionalFeatures?: string[];
  domOverlay?: {
    root: Element;
  };
  depthSensing?: {
    usagePreference: string[];
    dataFormatPreference: string[];
  };
}

/**
 * WebXR frame data
 */
export interface WebXRFrameData {
  timestamp: ISOTimestamp;
  pose?: XRPose;
  views: XRView[];
  inputSources: XRInputSource[];
  hitTestResults?: XRHitTestResult[];
  anchors?: XRAnchor[];
  planes?: XRPlane[];
  meshes?: XRMesh[];
  lightEstimate?: XRLightEstimate;
}

// ============================= BROWSER DETECTION & COMPATIBILITY =============================

/**
 * Browser information
 */
export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  engineVersion: string;
  platform: string;
  architecture: string;
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
  touchSupport: boolean;
  cookies: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  webGL: boolean;
  webGL2: boolean;
  canvas: boolean;
  webRTC: boolean;
  fullscreen: boolean;
  permissions: boolean;
  notifications: boolean;
  serviceWorker: boolean;
  pushAPI: boolean;
  backgroundSync: boolean;
  paymentRequest: boolean;
  credentialManagement: boolean;
  webAuthentication: boolean;
  mediaDevices: boolean;
  geolocation: boolean;
  deviceOrientation: boolean;
  ambientLight: boolean;
  proximity: boolean;
  vibration: boolean;
  battery: boolean;
  gamepad: boolean;
  webUSB: boolean;
  webSerial: boolean;
  webBluetooth: boolean;
  webNFC: boolean;
  webShare: boolean;
  fileSystemAccess: boolean;
  webXR: boolean;
  capabilities: BrowserCapabilities;
}

// ============================= WEB API CONSTANTS =============================

/**
 * Web API default values
 */
export const WEB_API_DEFAULTS = {
  GEOLOCATION_TIMEOUT: 15000,
  GEOLOCATION_MAX_AGE: 300000,
  MEDIA_STREAM_TIMEOUT: 30000,
  BLUETOOTH_SCAN_TIMEOUT: 10000,
  USB_TIMEOUT: 5000,
  STORAGE_QUOTA_CHECK_INTERVAL: 60000,
  PERFORMANCE_BUFFER_SIZE: 150,
  SERVICE_WORKER_UPDATE_CHECK: 3600000, // 1 hour
  WEBXR_FRAME_RATE: 90,
  SENSOR_FREQUENCY: 60, // Hz
  FILE_CHUNK_SIZE: 8 * 1024 * 1024, // 8MB
  MAX_BLOB_SIZE: 100 * 1024 * 1024, // 100MB
} as const;

/**
 * Permission names for Web APIs
 */
export const WEB_PERMISSIONS = {
  GEOLOCATION: 'geolocation',
  NOTIFICATIONS: 'notifications',
  PUSH: 'push',
  MIDI: 'midi',
  CAMERA: 'camera',
  MICROPHONE: 'microphone',
  SPEAKER: 'speaker-selection',
  DEVICE_INFO: 'device-info',
  BACKGROUND_SYNC: 'background-sync',
  BLUETOOTH: 'bluetooth',
  NFC: 'nfc',
  AMBIENT_LIGHT: 'ambient-light-sensor',
  ACCELEROMETER: 'accelerometer',
  GYROSCOPE: 'gyroscope',
  MAGNETOMETER: 'magnetometer',
  PERSISTENT_STORAGE: 'persistent-storage',
  PAYMENT_HANDLER: 'payment-handler',
  IDLE_DETECTION: 'idle-detection',
  SCREEN_WAKE_LOCK: 'screen-wake-lock',
  SYSTEM_WAKE_LOCK: 'system-wake-lock'
} as const;

/**
 * MIME types for web data
 */
export const WEB_MIME_TYPES = {
  // Images
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  GIF: 'image/gif',
  WEBP: 'image/webp',
  SVG: 'image/svg+xml',
  
  // Videos
  MP4: 'video/mp4',
  WEBM: 'video/webm',
  OGG_VIDEO: 'video/ogg',
  
  // Audio
  MP3: 'audio/mpeg',
  WAV: 'audio/wav',
  OGG_AUDIO: 'audio/ogg',
  AAC: 'audio/aac',
  
  // Documents
  PDF: 'application/pdf',
  JSON: 'application/json',
  XML: 'application/xml',
  TEXT: 'text/plain',
  HTML: 'text/html',
  CSS: 'text/css',
  JAVASCRIPT: 'application/javascript'
} as const;

// ============================= TYPE GUARDS =============================

/**
 * Check if browser supports a specific API
 */
export const supportsBrowserAPI = (api: keyof BrowserCapabilities): boolean => {
  switch (api) {
    case 'geolocation':
      return 'geolocation' in navigator;
    case 'getUserMedia':
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    case 'webBluetooth':
      return 'bluetooth' in navigator;
    case 'webUSB':
      return 'usb' in navigator;
    case 'serviceWorkers':
      return 'serviceWorker' in navigator;
    case 'webAssembly':
      return 'WebAssembly' in window;
    case 'paymentRequest':
      return 'PaymentRequest' in window;
    case 'credentialManagement':
      return 'credentials' in navigator;
    case 'webShare':
      return 'share' in navigator;
    case 'vibration':
      return 'vibrate' in navigator;
    case 'battery':
      return 'getBattery' in navigator;
    case 'gamepad':
      return 'getGamepads' in navigator;
    case 'webXR':
      return 'xr' in navigator;
    default:
      return false;
  }
};

/**
 * Check if device has specific sensor
 */
export const hasSensor = (sensorType: string): boolean => {
  try {
    switch (sensorType) {
      case 'accelerometer':
        return 'Accelerometer' in window;
      case 'gyroscope':
        return 'Gyroscope' in window;
      case 'magnetometer':
        return 'Magnetometer' in window;
      case 'ambientLight':
        return 'AmbientLightSensor' in window;
      case 'proximity':
        return 'ProximitySensor' in window;
      case 'deviceOrientation':
        return 'DeviceOrientationEvent' in window;
      default:
        return false;
    }
  } catch {
    return false;
  }
};

/**
 * Check if media type is supported
 */
export const isMediaTypeSupported = (mimeType: string): boolean => {
  if ('MediaRecorder' in window) {
    return MediaRecorder.isTypeSupported(mimeType);
  }
  return false;
};

// ============================= HELPER FUNCTIONS =============================

/**
 * Get comprehensive browser capabilities
 */
export const getBrowserCapabilities = async (): Promise<BrowserCapabilities> => {
  const capabilities: Partial<BrowserCapabilities> = {};
  
  // Test each capability
  for (const api of Object.keys(WEB_PERMISSIONS)) {
    try {
      const supported = supportsBrowserAPI(api as keyof BrowserCapabilities);
      capabilities[api as keyof BrowserCapabilities] = {
        supported,
        level: supported ? BrowserCapabilityLevel.FULL : BrowserCapabilityLevel.NONE
      };
    } catch {
      capabilities[api as keyof BrowserCapabilities] = {
        supported: false,
        level: BrowserCapabilityLevel.NONE
      };
    }
  }
  
  return capabilities as BrowserCapabilities;
};

/**
 * Request multiple permissions at once
 */
export const requestPermissions = async (permissions: string[]): Promise<Record<string, PermissionState>> => {
  const results: Record<string, PermissionState> = {};
  
  if ('permissions' in navigator) {
    for (const permission of permissions) {
      try {
        const result = await navigator.permissions.query({ name: permission as PermissionName });
        results[permission] = result.state;
      } catch {
        results[permission] = 'denied';
      }
    }
  }
  
  return results;
};

/**
 * Estimate storage quota and usage
 */
export const getStorageEstimate = async (): Promise<EnhancedStorageQuota | null> => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      const persistent = await navigator.storage.persisted();
      
      return {
        quota: estimate.quota || 0,
        usage: estimate.usage || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0),
        persistent,
        details: estimate.usageDetails || {
          indexedDB: 0,
          serviceWorkerRegistrations: 0,
          cacheAPI: 0
        },
        breakdown: estimate.usageDetails || {}
      };
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Detect browser information
 */
export const detectBrowser = (): BrowserInfo => {
  const userAgent = navigator.userAgent;
  const capabilities = {
    // Will be populated with actual capability detection
  } as BrowserCapabilities;
  
  return {
    name: 'Unknown',
    version: '0.0.0',
    engine: 'Unknown',
    engineVersion: '0.0.0',
    platform: navigator.platform,
    architecture: 'unknown',
    mobile: /Mobile|Android|iPhone|iPad/.test(userAgent),
    tablet: /iPad|Android.*Tablet/.test(userAgent),
    desktop: !/Mobile|Android|iPhone|iPad/.test(userAgent),
    touchSupport: 'ontouchstart' in window,
    cookies: navigator.cookieEnabled,
    localStorage: 'localStorage' in window,
    sessionStorage: 'sessionStorage' in window,
    webGL: 'WebGLRenderingContext' in window,
    webGL2: 'WebGL2RenderingContext' in window,
    canvas: 'HTMLCanvasElement' in window,
    webRTC: 'RTCPeerConnection' in window,
    fullscreen: 'requestFullscreen' in document.documentElement,
    permissions: 'permissions' in navigator,
    notifications: 'Notification' in window,
    serviceWorker: 'serviceWorker' in navigator,
    pushAPI: 'PushManager' in window,
    backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
    paymentRequest: 'PaymentRequest' in window,
    credentialManagement: 'credentials' in navigator,
    webAuthentication: 'credentials' in navigator && 'create' in navigator.credentials,
    mediaDevices: 'mediaDevices' in navigator,
    geolocation: 'geolocation' in navigator,
    deviceOrientation: 'DeviceOrientationEvent' in window,
    ambientLight: 'AmbientLightSensor' in window,
    proximity: 'ProximitySensor' in window,
    vibration: 'vibrate' in navigator,
    battery: 'getBattery' in navigator,
    gamepad: 'getGamepads' in navigator,
    webUSB: 'usb' in navigator,
    webSerial: 'serial' in navigator,
    webBluetooth: 'bluetooth' in navigator,
    webNFC: 'nfc' in navigator,
    webShare: 'share' in navigator,
    fileSystemAccess: 'showOpenFilePicker' in window,
    webXR: 'xr' in navigator,
    capabilities
  };
};

/**
 * Version information
 */
export const WEB_API_TYPES_VERSION = '1.0.0';
export const SUPPORTED_WEB_STANDARDS = [
  'HTML5',
  'CSS3',
  'ES2022',
  'WebAPI',
  'PWA',
  'WebAssembly',
  'WebXR',
  'WebRTC',
  'WebGL2',
  'WebGPU'
];

// ============================= END OF FILE =============================