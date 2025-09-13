/**
 * @fileoverview Comprehensive enumerations for the DATASPHERE GUILDS Enterprise Platform.
 * Defines all core enums for quality control, data collection, AI services, business operations,
 * and platform management across the entire AI-era crowdsourcing ecosystem.
 * @version 3.0.0
 * @author DataSphere Guilds Engineering
 */

// =============================================================================
// CORE QC PIPELINE ENUMERATIONS
// =============================================================================

/**
 * Defines the sophisticated 5-layer Quality Control pipeline architecture.
 * Each layer represents a progressively more rigorous validation stage.
 */
export enum QCLayer {
  /** Layer 1: Real-time on-device validation with edge computing capabilities */
  ON_DEVICE = 'ON_DEVICE',
  
  /** Layer 2: Advanced AI/ML validation with deep learning models */
  AI_VALIDATION = 'AI_VALIDATION',
  
  /** Layer 3: Distributed peer review with consensus algorithms */
  PEER_REVIEW = 'PEER_REVIEW',
  
  /** Layer 4: Gold standard comparison with certified reference datasets */
  GOLD_STANDARD = 'GOLD_STANDARD',
  
  /** Layer 5: Anti-fraud honeypot detection with behavioral analysis */
  HONEYPOT = 'HONEYPOT',
}

/**
 * Comprehensive pipeline execution states with detailed status tracking.
 */
export enum QCPipelineStatus {
  /** Initial state: Pipeline created but not yet started */
  PENDING = 'PENDING',
  
  /** Pipeline is actively processing through layers */
  RUNNING = 'RUNNING',
  
  /** Temporarily suspended, can be resumed */
  PAUSED = 'PAUSED',
  
  /** Successfully completed all required layers */
  COMPLETED = 'COMPLETED',
  
  /** Failed due to critical errors or validation failures */
  FAILED = 'FAILED',
  
  /** Escalated to human experts for manual review */
  ESCALATED = 'ESCALATED',
  
  /** Exceeded maximum allowed processing time */
  TIMEOUT = 'TIMEOUT',
  
  /** Manually cancelled by user or system */
  CANCELLED = 'CANCELLED',
  
  /** Requires additional data or clarification */
  PENDING_REVIEW = 'PENDING_REVIEW',
  
  /** Processing with warnings but continuing */
  WARNING = 'WARNING',
  
  /** Quarantined due to security or quality concerns */
  QUARANTINED = 'QUARANTINED',
}

// =============================================================================
// DATA COLLECTION & SUBMISSION TYPES
// =============================================================================

/**
 * Comprehensive data collection categories for AI training datasets.
 */
export enum DataCollectionCategory {
  // Vision & Imaging
  VISION_STREET_LEVEL = 'VISION_STREET_LEVEL',
  VISION_INDOOR_SCENES = 'VISION_INDOOR_SCENES',
  VISION_RETAIL_SHELVES = 'VISION_RETAIL_SHELVES',
  VISION_OBJECT_PHOTOGRAPHY = 'VISION_OBJECT_PHOTOGRAPHY',
  VISION_VIDEO_CLIPS = 'VISION_VIDEO_CLIPS',
  VISION_MEDICAL_IMAGING = 'VISION_MEDICAL_IMAGING',
  
  // Audio & Speech
  AUDIO_VOICE_COMMANDS = 'AUDIO_VOICE_COMMANDS',
  AUDIO_CONVERSATIONS = 'AUDIO_CONVERSATIONS',
  AUDIO_LOW_RESOURCE_LANGUAGES = 'AUDIO_LOW_RESOURCE_LANGUAGES',
  AUDIO_ENVIRONMENTAL_SOUNDS = 'AUDIO_ENVIRONMENTAL_SOUNDS',
  AUDIO_MUSIC_ANALYSIS = 'AUDIO_MUSIC_ANALYSIS',
  
  // Text & Language
  TEXT_CONTENT_ANNOTATION = 'TEXT_CONTENT_ANNOTATION',
  TEXT_NAMED_ENTITY_RECOGNITION = 'TEXT_NAMED_ENTITY_RECOGNITION',
  TEXT_TRANSLATION = 'TEXT_TRANSLATION',
  TEXT_SUMMARIZATION = 'TEXT_SUMMARIZATION',
  TEXT_RLHF = 'TEXT_RLHF',
  TEXT_SENTIMENT_ANALYSIS = 'TEXT_SENTIMENT_ANALYSIS',
  
  // Geospatial & Environmental
  GEO_GPS_TRACKS = 'GEO_GPS_TRACKS',
  GEO_SATELLITE_IMAGERY = 'GEO_SATELLITE_IMAGERY',
  GEO_WEATHER_DATA = 'GEO_WEATHER_DATA',
  GEO_AGRICULTURE = 'GEO_AGRICULTURE',
  GEO_URBAN_PLANNING = 'GEO_URBAN_PLANNING',
  
  // Autonomous Vehicles & Robotics
  AUTO_DRIVING_VIDEOS = 'AUTO_DRIVING_VIDEOS',
  AUTO_LIDAR_DATA = 'AUTO_LIDAR_DATA',
  AUTO_INDOOR_SLAM = 'AUTO_INDOOR_SLAM',
  AUTO_DRONE_IMAGERY = 'AUTO_DRONE_IMAGERY',
  AUTO_ROBOT_NAVIGATION = 'AUTO_ROBOT_NAVIGATION',
  
  // Healthcare & Biometric
  HEALTH_MEDICAL_IMAGING = 'HEALTH_MEDICAL_IMAGING',
  HEALTH_WEARABLES = 'HEALTH_WEARABLES',
  HEALTH_RECORDS = 'HEALTH_RECORDS',
  HEALTH_BIO_AUDIO = 'HEALTH_BIO_AUDIO',
  HEALTH_GENOMICS = 'HEALTH_GENOMICS',
  
  // Business & Finance
  BUSINESS_INVOICES = 'BUSINESS_INVOICES',
  BUSINESS_ECOMMERCE = 'BUSINESS_ECOMMERCE',
  BUSINESS_CUSTOMER_SUPPORT = 'BUSINESS_CUSTOMER_SUPPORT',
  BUSINESS_FINANCIAL_DATA = 'BUSINESS_FINANCIAL_DATA',
  BUSINESS_MARKET_RESEARCH = 'BUSINESS_MARKET_RESEARCH',
  
  // Legal & Compliance
  LEGAL_CONTRACTS = 'LEGAL_CONTRACTS',
  LEGAL_REGULATIONS = 'LEGAL_REGULATIONS',
  LEGAL_CASE_LAW = 'LEGAL_CASE_LAW',
  LEGAL_COMPLIANCE = 'LEGAL_COMPLIANCE',
  
  // AI Ethics & Oversight
  ETHICS_CONTENT_MODERATION = 'ETHICS_CONTENT_MODERATION',
  ETHICS_BIAS_DETECTION = 'ETHICS_BIAS_DETECTION',
  ETHICS_PRIVACY = 'ETHICS_PRIVACY',
  ETHICS_RED_TEAMING = 'ETHICS_RED_TEAMING',
  
  // Emerging Domains
  EMERGING_AR_VR = 'EMERGING_AR_VR',
  EMERGING_EMOTION_DATA = 'EMERGING_EMOTION_DATA',
  EMERGING_CODE_ANNOTATION = 'EMERGING_CODE_ANNOTATION',
  EMERGING_IOT = 'EMERGING_IOT',
}

/**
 * Primary submission types for data validation.
 */
export enum SubmissionType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  TEXT = 'TEXT',
  GEOSPATIAL = 'GEOSPATIAL',
  DOCUMENT = 'DOCUMENT',
  STRUCTURED_DATA = 'STRUCTURED_DATA',
  MULTIMODAL = 'MULTIMODAL',
  CODE = 'CODE',
  SENSOR_DATA = 'SENSOR_DATA',
}

// =============================================================================
// AI ENGINEERING SERVICES
// =============================================================================

/**
 * High-demand AI/LLM engineering services offered on the platform.
 */
export enum AIServiceCategory {
  /** Data annotation and labeling with quality guarantees */
  DATA_ANNOTATION = 'DATA_ANNOTATION',
  
  /** Comprehensive model evaluation and testing */
  MODEL_EVALUATION = 'MODEL_EVALUATION',
  
  /** Advanced prompt engineering and optimization */
  PROMPT_ENGINEERING = 'PROMPT_ENGINEERING',
  
  /** Custom fine-tuning and domain adaptation */
  CUSTOM_FINE_TUNING = 'CUSTOM_FINE_TUNING',
  
  /** MLOps and deployment pipeline development */
  MLOPS_DEPLOYMENT = 'MLOPS_DEPLOYMENT',
  
  /** Rapid pipeline debugging and SRE support */
  PIPELINE_DEBUGGING = 'PIPELINE_DEBUGGING',
  
  /** AI ethics auditing and bias mitigation */
  AI_ETHICS_AUDITING = 'AI_ETHICS_AUDITING',
  
  /** AI safety and red-teaming services */
  AI_SAFETY_RED_TEAMING = 'AI_SAFETY_RED_TEAMING',
  
  /** Human-in-the-loop monitoring and quality control */
  HITL_MONITORING = 'HITL_MONITORING',
}

// =============================================================================
// BUSINESS & OPERATIONAL ENUMS
// =============================================================================

/**
 * Priority levels for tasks and operations.
 */
export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

/**
 * Data sensitivity classification levels.
 */
export enum DataSensitivity {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  CONFIDENTIAL = 'CONFIDENTIAL',
  RESTRICTED = 'RESTRICTED',
  TOP_SECRET = 'TOP_SECRET',
}

/**
 * User roles within the DATASPHERE GUILDS platform.
 */
export enum UserRole {
  /** Basic contributor with data submission rights */
  CONTRIBUTOR = 'CONTRIBUTOR',
  
  /** Skilled annotator with quality control responsibilities */
  ANNOTATOR = 'ANNOTATOR',
  
  /** Expert reviewer with advanced validation capabilities */
  REVIEWER = 'REVIEWER',
  
  /** AI engineer with technical service delivery rights */
  AI_ENGINEER = 'AI_ENGINEER',
  
  /** Project manager with team coordination responsibilities */
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  
  /** Quality assurance specialist with audit rights */
  QA_SPECIALIST = 'QA_SPECIALIST',
  
  /** Data scientist with analytics and insights access */
  DATA_SCIENTIST = 'DATA_SCIENTIST',
  
  /** Platform administrator with system management rights */
  ADMIN = 'ADMIN',
  
  /** Super administrator with full platform control */
  SUPER_ADMIN = 'SUPER_ADMIN',
  
  /** Enterprise client with procurement and management access */
  ENTERPRISE_CLIENT = 'ENTERPRISE_CLIENT',
}

/**
 * User account status states.
 */
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
  INACTIVE = 'INACTIVE',
  PROBATION = 'PROBATION',
  VIP = 'VIP',
  ENTERPRISE = 'ENTERPRISE',
}

/**
 * Task status progression through the platform workflow.
 */
export enum TaskStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  DISPUTED = 'DISPUTED',
}

// =============================================================================
// QUALITY & VALIDATION ENUMS
// =============================================================================

/**
 * Quality assessment levels for submissions and outputs.
 */
export enum QualityLevel {
  UNACCEPTABLE = 'UNACCEPTABLE',
  POOR = 'POOR',
  FAIR = 'FAIR',
  GOOD = 'GOOD',
  EXCELLENT = 'EXCELLENT',
  EXCEPTIONAL = 'EXCEPTIONAL',
}

/**
 * Validation result outcomes.
 */
export enum ValidationResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  WARNING = 'WARNING',
  REQUIRES_REVIEW = 'REQUIRES_REVIEW',
  INCONCLUSIVE = 'INCONCLUSIVE',
}

/**
 * Fraud detection and security alert levels.
 */
export enum SecurityAlertLevel {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY',
}

// =============================================================================
// FINANCIAL & REWARD SYSTEM ENUMS
// =============================================================================

/**
 * Payment and reward methods available on the platform.
 */
export enum PaymentMethod {
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
  BANK_TRANSFER = 'BANK_TRANSFER',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  PLATFORM_CREDITS = 'PLATFORM_CREDITS',
  GIFT_CARDS = 'GIFT_CARDS',
  PAYPAL = 'PAYPAL',
  STABLECOIN = 'STABLECOIN',
}

/**
 * Transaction status for financial operations.
 */
export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED',
  ON_HOLD = 'ON_HOLD',
}

// =============================================================================
// GAMIFICATION & ENGAGEMENT ENUMS
// =============================================================================

/**
 * Achievement types within the gamification system.
 */
export enum AchievementType {
  MILESTONE = 'MILESTONE',
  QUALITY_BONUS = 'QUALITY_BONUS',
  SPEED_BONUS = 'SPEED_BONUS',
  CONSISTENCY = 'CONSISTENCY',
  INNOVATION = 'INNOVATION',
  COMMUNITY_IMPACT = 'COMMUNITY_IMPACT',
  EXPERTISE_LEVEL = 'EXPERTISE_LEVEL',
  COLLABORATION = 'COLLABORATION',
}

/**
 * Badge categories for user recognition.
 */
export enum BadgeCategory {
  CONTRIBUTOR = 'CONTRIBUTOR',
  QUALITY_EXPERT = 'QUALITY_EXPERT',
  SPEED_MASTER = 'SPEED_MASTER',
  DOMAIN_SPECIALIST = 'DOMAIN_SPECIALIST',
  MENTOR = 'MENTOR',
  INNOVATOR = 'INNOVATOR',
  COMMUNITY_LEADER = 'COMMUNITY_LEADER',
  PLATFORM_CHAMPION = 'PLATFORM_CHAMPION',
}

// =============================================================================
// NOTIFICATION & COMMUNICATION ENUMS
// =============================================================================

/**
 * Notification types for user communication.
 */
export enum NotificationType {
  TASK_ASSIGNMENT = 'TASK_ASSIGNMENT',
  TASK_COMPLETION = 'TASK_COMPLETION',
  QUALITY_FEEDBACK = 'QUALITY_FEEDBACK',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  ACHIEVEMENT_UNLOCKED = 'ACHIEVEMENT_UNLOCKED',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
  SECURITY_ALERT = 'SECURITY_ALERT',
  DEADLINE_REMINDER = 'DEADLINE_REMINDER',
  DISPUTE_UPDATE = 'DISPUTE_UPDATE',
  PLATFORM_UPDATE = 'PLATFORM_UPDATE',
}

/**
 * Communication channels for notifications.
 */
export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  SLACK = 'SLACK',
  DISCORD = 'DISCORD',
  WEBHOOK = 'WEBHOOK',
  TELEGRAM = 'TELEGRAM',
}

// =============================================================================
// PLATFORM ANALYTICS & INSIGHTS ENUMS
// =============================================================================

/**
 * Analytics event types for platform insights.
 */
export enum AnalyticsEventType {
  USER_LOGIN = 'USER_LOGIN',
  TASK_VIEW = 'TASK_VIEW',
  TASK_START = 'TASK_START',
  TASK_SUBMIT = 'TASK_SUBMIT',
  QUALITY_REVIEW = 'QUALITY_REVIEW',
  PAYMENT_REQUEST = 'PAYMENT_REQUEST',
  SEARCH_QUERY = 'SEARCH_QUERY',
  FILTER_APPLIED = 'FILTER_APPLIED',
  FEATURE_USAGE = 'FEATURE_USAGE',
  ERROR_OCCURRED = 'ERROR_OCCURRED',
}

/**
 * Report types for business intelligence.
 */
export enum ReportType {
  DAILY_SUMMARY = 'DAILY_SUMMARY',
  WEEKLY_ANALYTICS = 'WEEKLY_ANALYTICS',
  MONTHLY_REVENUE = 'MONTHLY_REVENUE',
  QUALITY_METRICS = 'QUALITY_METRICS',
  USER_ENGAGEMENT = 'USER_ENGAGEMENT',
  TASK_PERFORMANCE = 'TASK_PERFORMANCE',
  FRAUD_DETECTION = 'FRAUD_DETECTION',
  PLATFORM_HEALTH = 'PLATFORM_HEALTH',
  COMPETITIVE_ANALYSIS = 'COMPETITIVE_ANALYSIS',
  PREDICTIVE_INSIGHTS = 'PREDICTIVE_INSIGHTS',
}

// =============================================================================
// EXPORT ALL ENUMS
// =============================================================================

export const DATASPHERE_ENUMS = {
  QCLayer,
  QCPipelineStatus,
  DataCollectionCategory,
  SubmissionType,
  AIServiceCategory,
  Priority,
  DataSensitivity,
  UserRole,
  UserStatus,
  TaskStatus,
  QualityLevel,
  ValidationResult,
  SecurityAlertLevel,
  PaymentMethod,
  TransactionStatus,
  AchievementType,
  BadgeCategory,
  NotificationType,
  NotificationChannel,
  AnalyticsEventType,
  ReportType,
} as const; 