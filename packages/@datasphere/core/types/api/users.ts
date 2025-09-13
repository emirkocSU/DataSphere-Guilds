/**
 * =====================================================================================
 * @datasphere/core - User Management API Types
 * =====================================================================================
 * 
 * Enterprise-grade user management and profile type definitions
 * Supporting comprehensive user lifecycle, roles, permissions, and social features
 * 
 * @version 1.0.0
 * @author DataSphere Guilds Engineering Team
 * @license MIT
 * 
 * User Features:
 * - Comprehensive user profiles and identity management
 * - Role-based access control (RBAC) with hierarchical permissions
 * - User lifecycle management (onboarding, activation, suspension, deletion)
 * - Social features and networking capabilities
 * - Skill verification and certification tracking
 * - Performance analytics and reputation systems
 * - Multi-tenant organization support
 * - Privacy controls and data protection
 * - Audit logging and compliance tracking
 * - Integration with external identity providers
 * =====================================================================================
 */

import {
  UUID,
  ISOTimestamp,
  Percentage,
  EmailAddress,
  PhoneNumber,
  URL,
  CountryCode,
  LanguageCode,
  CurrencyCode,
  TimezoneString,
  BaseRequest,
  BaseResponse,
  PaginationParams,
  FilterParams,
  Status,
  Priority
} from './common';

// ============================= USER ENUMS =============================

/**
 * User status enumeration
 */
export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  DELETED = 'deleted',
  ARCHIVED = 'archived',
  LOCKED = 'locked',
  DISABLED = 'disabled'
}

/**
 * User type enumeration
 */
export enum UserType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
  ENTERPRISE = 'enterprise',
  GOVERNMENT = 'government',
  NONPROFIT = 'nonprofit',
  ACADEMIC = 'academic',
  FREELANCER = 'freelancer',
  CONTRACTOR = 'contractor',
  EMPLOYEE = 'employee',
  PARTNER = 'partner',
  SYSTEM = 'system',
  BOT = 'bot'
}

/**
 * User role enumeration
 */
export enum UserRole {
  GUEST = 'guest',
  WORKER = 'worker',
  REVIEWER = 'reviewer',
  EXPERT = 'expert',
  SPECIALIST = 'specialist',
  MANAGER = 'manager',
  SUPERVISOR = 'supervisor',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  OWNER = 'owner',
  SYSTEM = 'system'
}

/**
 * Verification status enumeration
 */
export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended'
}

/**
 * Account tier enumeration
 */
export enum AccountTier {
  FREE = 'free',
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom'
}

/**
 * Experience level enumeration
 */
export enum ExperienceLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  EXPERT = 'expert',
  LEAD = 'lead',
  PRINCIPAL = 'principal',
  ARCHITECT = 'architect'
}

/**
 * Profile visibility enumeration
 */
export enum ProfileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  CONNECTIONS = 'connections',
  ORGANIZATION = 'organization',
  CUSTOM = 'custom'
}

// ============================= CORE USER TYPES =============================

/**
 * Core user interface
 */
export interface User {
  id: UUID;
  email: EmailAddress;
  username: string;
  type: UserType;
  status: UserStatus;
  role: UserRole;
  tier: AccountTier;
  
  // Profile Information
  profile: UserProfile;
  preferences: UserPreferences;
  settings: UserSettings;
  
  // Verification & Security
  verification: UserVerification;
  security: UserSecurity;
  
  // Performance & Analytics
  performance: UserPerformance;
  analytics: UserAnalytics;
  reputation: UserReputation;
  
  // Organizational
  organizations: UserOrganization[];
  teams: UserTeam[];
  
  // Subscription & Billing
  subscription?: UserSubscription;
  billing?: UserBilling;
  
  // System Information
  metadata: UserMetadata;
  flags: UserFlag[];
  tags: string[];
  
  // Timestamps
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
  lastLoginAt?: ISOTimestamp;
  lastActivityAt?: ISOTimestamp;
  suspendedAt?: ISOTimestamp;
  deletedAt?: ISOTimestamp;
}

/**
 * User profile information
 */
export interface UserProfile {
  // Basic Information
  firstName: string;
  lastName: string;
  displayName: string;
  title?: string;
  bio?: string;
  
  // Media
  avatar?: MediaAsset;
  cover?: MediaAsset;
  
  // Contact Information
  contact: ContactInfo;
  
  // Location
  location: LocationInfo;
  
  // Demographics
  demographics: DemographicsInfo;
  
  // Professional Information
  professional: ProfessionalInfo;
  
  // Personal Information
  personal: PersonalInfo;
  
  // Social Links
  social: SocialLinks;
  
  // Customization
  customFields: CustomField[];
  
  // Visibility Settings
  visibility: ProfileVisibilitySettings;
  
  // Completion Status
  completeness: Percentage;
  lastUpdated: ISOTimestamp;
}

/**
 * Media asset (avatar, cover, etc.)
 */
export interface MediaAsset {
  id: UUID;
  url: URL;
  thumbnailUrl?: URL;
  originalUrl?: URL;
  type: 'image' | 'video' | 'audio' | 'document';
  format: string;
  size: number;
  dimensions?: MediaDimensions;
  blurhash?: string;
  metadata: Record<string, any>;
  uploadedAt: ISOTimestamp;
}

/**
 * Media dimensions
 */
export interface MediaDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'portrait' | 'landscape' | 'square';
}

/**
 * Contact information
 */
export interface ContactInfo {
  email: EmailAddress;
  phone?: PhoneNumber;
  alternateEmail?: EmailAddress;
  website?: URL;
  linkedin?: URL;
  github?: URL;
  address?: AddressInfo;
  emergencyContact?: EmergencyContact;
  visibility: ContactVisibility;
}

/**
 * Address information
 */
export interface AddressInfo {
  type: 'home' | 'work' | 'billing' | 'shipping' | 'other';
  street: string;
  street2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: CountryCode;
  coordinates?: GeographicCoordinate;
  verified: boolean;
  primary: boolean;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

/**
 * Geographic coordinate
 */
export interface GeographicCoordinate {
  latitude: number;
  longitude: number;
  accuracy?: number;
  source?: 'gps' | 'ip' | 'manual' | 'geocoding';
}

/**
 * Emergency contact
 */
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: PhoneNumber;
  email?: EmailAddress;
  address?: AddressInfo;
  verified: boolean;
  primary: boolean;
}

/**
 * Contact visibility settings
 */
export interface ContactVisibility {
  email: ProfileVisibility;
  phone: ProfileVisibility;
  address: ProfileVisibility;
  website: ProfileVisibility;
  social: ProfileVisibility;
  emergencyContact: ProfileVisibility;
}

/**
 * Location information
 */
export interface LocationInfo {
  country?: CountryCode;
  region?: string;
  city?: string;
  timezone: TimezoneString;
  coordinates?: GeographicCoordinate;
  workplace?: WorkplaceInfo;
  travelWillingness: TravelWillingness;
  visibility: ProfileVisibility;
}

/**
 * Workplace information
 */
export interface WorkplaceInfo {
  type: 'office' | 'home' | 'hybrid' | 'remote' | 'coworking' | 'client_site';
  address?: AddressInfo;
  facilities: string[];
  accessibility: boolean;
  parking: boolean;
  publicTransport: boolean;
}

/**
 * Travel willingness
 */
export interface TravelWillingness {
  domestic: boolean;
  international: boolean;
  maxDistance: number;
  maxDuration: number;
  frequency: 'never' | 'rarely' | 'occasionally' | 'frequently' | 'always';
  expenses: 'client' | 'shared' | 'self';
  visa: boolean;
  passport: boolean;
}

/**
 * Demographics information
 */
export interface DemographicsInfo {
  dateOfBirth?: string;
  age?: number;
  gender?: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | 'other';
  nationality?: CountryCode;
  ethnicity?: string;
  languages: LanguageInfo[];
  education: EducationInfo[];
  accessibility?: AccessibilityInfo;
  diversity?: DiversityInfo;
  privacy: DemographicsPrivacy;
}

/**
 * Language information
 */
export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
  skills: LanguageSkills;
  verified: boolean;
  primary: boolean;
  certification?: CertificationInfo;
}

/**
 * Language skills
 */
export interface LanguageSkills {
  reading: 'basic' | 'intermediate' | 'advanced' | 'native';
  writing: 'basic' | 'intermediate' | 'advanced' | 'native';
  speaking: 'basic' | 'intermediate' | 'advanced' | 'native';
  listening: 'basic' | 'intermediate' | 'advanced' | 'native';
}

/**
 * Education information
 */
export interface EducationInfo {
  id: UUID;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  level: 'high_school' | 'associate' | 'bachelor' | 'master' | 'doctorate' | 'certificate' | 'other';
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: number;
  maxGpa?: number;
  honors?: string[];
  activities?: string[];
  description?: string;
  verified: boolean;
  verifiedBy?: UUID;
  verifiedAt?: ISOTimestamp;
  credentials?: CredentialInfo[];
}

/**
 * Credential information
 */
export interface CredentialInfo {
  id: UUID;
  type: 'diploma' | 'certificate' | 'transcript' | 'license' | 'other';
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: URL;
  verified: boolean;
  verificationMethod?: string;
  blockchain?: BlockchainCredential;
}

/**
 * Blockchain credential
 */
export interface BlockchainCredential {
  network: string;
  address: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: ISOTimestamp;
  immutable: boolean;
}

/**
 * Accessibility information
 */
export interface AccessibilityInfo {
  needs: AccessibilityNeed[];
  accommodations: Accommodation[];
  assistiveTechnology: AssistiveTechnology[];
  preferences: AccessibilityPreferences;
  disclosure: boolean;
}

/**
 * Accessibility need
 */
export interface AccessibilityNeed {
  type: 'visual' | 'auditory' | 'motor' | 'cognitive' | 'speech' | 'other';
  severity: 'mild' | 'moderate' | 'severe' | 'profound';
  description: string;
  accommodations: string[];
  technology: string[];
}

/**
 * Accommodation
 */
export interface Accommodation {
  type: string;
  description: string;
  equipment: string[];
  cost: number;
  provider: string;
  availability: string;
}

/**
 * Assistive technology
 */
export interface AssistiveTechnology {
  name: string;
  type: string;
  version: string;
  platform: string;
  compatibility: string[];
  cost: number;
  training: boolean;
}

/**
 * Accessibility preferences
 */
export interface AccessibilityPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'extra_large';
  contrast: 'normal' | 'high' | 'low';
  colorScheme: 'default' | 'dark' | 'light' | 'custom';
  animations: boolean;
  sounds: boolean;
  vibration: boolean;
  keyboard: boolean;
  voice: boolean;
  gesture: boolean;
}

/**
 * Diversity information
 */
export interface DiversityInfo {
  veteran: boolean;
  disability: boolean;
  lgbtq: boolean;
  underrepresented: boolean;
  firstGeneration: boolean;
  socioeconomic: string;
  disclosure: boolean;
  programs: string[];
}

/**
 * Demographics privacy settings
 */
export interface DemographicsPrivacy {
  dateOfBirth: ProfileVisibility;
  age: ProfileVisibility;
  gender: ProfileVisibility;
  nationality: ProfileVisibility;
  ethnicity: ProfileVisibility;
  languages: ProfileVisibility;
  education: ProfileVisibility;
  accessibility: ProfileVisibility;
  diversity: ProfileVisibility;
}

/**
 * Professional information
 */
export interface ProfessionalInfo {
  title?: string;
  company?: string;
  industry?: string;
  experience: ExperienceLevel;
  yearsOfExperience: number;
  
  // Skills & Expertise
  skills: SkillInfo[];
  certifications: CertificationInfo[];
  
  // Work Experience
  workExperience: WorkExperience[];
  
  // Portfolio & Projects
  portfolio: PortfolioItem[];
  projects: ProjectInfo[];
  
  // Documents
  resume?: DocumentInfo;
  coverLetter?: DocumentInfo;
  
  // References
  references: ReferenceInfo[];
  
  // Availability
  availability: AvailabilityInfo;
  
  // Rates & Compensation
  compensation: CompensationInfo;
  
  // Performance
  performance: ProfessionalPerformance;
}

/**
 * Skill information
 */
export interface SkillInfo {
  id: UUID;
  name: string;
  category: string;
  subcategory?: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  lastUsed?: ISOTimestamp;
  
  // Verification
  verified: boolean;
  verifiedBy?: UUID;
  verifiedAt?: ISOTimestamp;
  verificationMethod?: string;
  
  // Endorsements
  endorsements: SkillEndorsement[];
  
  // Assessment
  assessment?: SkillAssessment;
  
  // Metadata
  tags: string[];
  keywords: string[];
  relatedSkills: UUID[];
  
  // Visibility
  visibility: ProfileVisibility;
  featured: boolean;
}

/**
 * Skill endorsement
 */
export interface SkillEndorsement {
  id: UUID;
  endorserId: UUID;
  endorserName: string;
  endorserTitle?: string;
  relationship: string;
  comment?: string;
  rating: number;
  weight: number;
  verified: boolean;
  createdAt: ISOTimestamp;
  context?: string;
}

/**
 * Skill assessment
 */
export interface SkillAssessment {
  id: UUID;
  type: 'test' | 'project' | 'interview' | 'peer_review' | 'portfolio' | 'certification';
  name: string;
  description: string;
  score: number;
  maxScore: number;
  percentile: number;
  grade: string;
  assessor: string;
  assessorType: 'automated' | 'human' | 'hybrid';
  assessedAt: ISOTimestamp;
  validUntil?: ISOTimestamp;
  certificate?: DocumentInfo;
  feedback?: string;
  recommendations?: string[];
  retakeable: boolean;
  details: Record<string, any>;
}

/**
 * Certification information
 */
export interface CertificationInfo {
  id: UUID;
  name: string;
  issuer: string;
  issuerType: 'organization' | 'institution' | 'government' | 'platform' | 'other';
  category: string;
  level: string;
  issueDate: string;
  expiryDate?: string;
  renewable: boolean;
  
  // Verification
  credentialId?: string;
  credentialUrl?: URL;
  verified: boolean;
  verifiedBy?: UUID;
  verifiedAt?: ISOTimestamp;
  verificationMethod?: string;
  
  // Skills & Competencies
  skills: string[];
  competencies: string[];
  
  // Continuing Education
  continuingEducation: ContinuingEducation[];
  
  // Metadata
  tags: string[];
  priority: Priority;
  visibility: ProfileVisibility;
  
  // Digital Credentials
  digitalCredential?: DigitalCredential;
}

/**
 * Continuing education
 */
export interface ContinuingEducation {
  id: UUID;
  name: string;
  provider: string;
  type: 'course' | 'workshop' | 'seminar' | 'conference' | 'other';
  hours: number;
  completedAt: ISOTimestamp;
  certificate?: DocumentInfo;
  cost?: number;
  sponsored: boolean;
}

/**
 * Digital credential
 */
export interface DigitalCredential {
  format: 'open_badges' | 'blockcerts' | 'verifiable_credentials' | 'other';
  issuer: string;
  badge?: BadgeInfo;
  blockchain?: BlockchainCredential;
  metadata: Record<string, any>;
}

/**
 * Badge information
 */
export interface BadgeInfo {
  id: UUID;
  name: string;
  description: string;
  image: URL;
  criteria: string;
  evidence: string[];
  issuer: string;
  issuedAt: ISOTimestamp;
  expiresAt?: ISOTimestamp;
  revoked: boolean;
  revokedAt?: ISOTimestamp;
  verification: string;
}

/**
 * Work experience
 */
export interface WorkExperience {
  id: UUID;
  company: string;
  position: string;
  department?: string;
  location: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'temporary' | 'internship' | 'volunteer' | 'freelance';
  startDate: string;
  endDate?: string;
  current: boolean;
  
  // Responsibilities
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  skills: string[];
  
  // Management
  teamSize?: number;
  budget?: number;
  projects: string[];
  
  // Verification
  verified: boolean;
  verifiedBy?: UUID;
  verifiedAt?: ISOTimestamp;
  
  // References
  supervisor?: ContactReference;
  colleagues?: ContactReference[];
  
  // Metadata
  description: string;
  tags: string[];
  visibility: ProfileVisibility;
}

/**
 * Contact reference
 */
export interface ContactReference {
  name: string;
  title: string;
  company: string;
  email: EmailAddress;
  phone?: PhoneNumber;
  relationship: string;
  canContact: boolean;
  contacted: boolean;
  contactedAt?: ISOTimestamp;
  response?: ReferenceResponse;
}

/**
 * Reference response
 */
export interface ReferenceResponse {
  overall: number;
  skills: number;
  workQuality: number;
  reliability: number;
  communication: number;
  teamwork: number;
  leadership: number;
  innovation: number;
  recommendation: 'highly_recommend' | 'recommend' | 'neutral' | 'not_recommend';
  comments: string;
  wouldRehire: boolean;
  strengths: string[];
  improvements: string[];
  submittedAt: ISOTimestamp;
}

/**
 * Portfolio item
 */
export interface PortfolioItem {
  id: UUID;
  title: string;
  description: string;
  type: 'project' | 'work_sample' | 'case_study' | 'publication' | 'presentation' | 'other';
  category: string;
  
  // Media
  images: MediaAsset[];
  videos: MediaAsset[];
  documents: DocumentInfo[];
  
  // Links
  url?: URL;
  demoUrl?: URL;
  repositoryUrl?: URL;
  
  // Details
  technologies: string[];
  skills: string[];
  role: string;
  teamSize?: number;
  duration?: number;
  
  // Achievements
  achievements: string[];
  metrics: PortfolioMetrics;
  
  // Dates
  startDate?: string;
  endDate?: string;
  
  // Verification
  verified: boolean;
  verifiedBy?: UUID;
  verifiedAt?: ISOTimestamp;
  
  // Engagement
  views: number;
  likes: number;
  shares: number;
  comments: number;
  
  // Settings
  featured: boolean;
  priority: Priority;
  visibility: ProfileVisibility;
  
  // Metadata
  tags: string[];
  keywords: string[];
  
  // Timestamps
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

/**
 * Portfolio metrics
 */
export interface PortfolioMetrics {
  impressions: number;
  clicks: number;
  engagement: number;
  conversions: number;
  inquiries: number;
  bookings: number;
  revenue?: number;
  rating?: number;
  reviews?: number;
}

/**
 * Project information
 */
export interface ProjectInfo {
  id: UUID;
  name: string;
  description: string;
  type: 'personal' | 'professional' | 'academic' | 'volunteer' | 'open_source' | 'client' | 'other';
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  
  // Participants
  role: string;
  team: TeamMember[];
  client?: string;
  
  // Timeline
  startDate: string;
  endDate?: string;
  duration?: number;
  
  // Scope
  scope: string;
  objectives: string[];
  deliverables: string[];
  
  // Technical
  technologies: string[];
  methodologies: string[];
  tools: string[];
  
  // Results
  outcomes: string[];
  impact: string;
  metrics: ProjectMetrics;
  
  // Resources
  budget?: number;
  resources: string[];
  
  // Links
  url?: URL;
  repository?: URL;
  documentation?: URL;
  
  // Verification
  verified: boolean;
  verifiedBy?: UUID;
  verifiedAt?: ISOTimestamp;
  
  // Metadata
  tags: string[];
  visibility: ProfileVisibility;
}

/**
 * Team member
 */
export interface TeamMember {
  id: UUID;
  name: string;
  role: string;
  contribution: string;
  collaboration: number;
  endorsement?: string;
}

/**
 * Project metrics
 */
export interface ProjectMetrics {
  complexity: number;
  innovation: number;
  impact: number;
  success: number;
  roi?: number;
  users?: number;
  downloads?: number;
  citations?: number;
  awards?: string[];
}

/**
 * Document information
 */
export interface DocumentInfo {
  id: UUID;
  name: string;
  type: 'resume' | 'cover_letter' | 'portfolio' | 'certificate' | 'transcript' | 'other';
  format: string;
  size: number;
  url: URL;
  thumbnailUrl?: URL;
  
  // Content
  content?: string;
  extractedText?: string;
  
  // Metadata
  title?: string;
  description?: string;
  keywords: string[];
  language: LanguageCode;
  
  // Processing
  parsed: boolean;
  parsedAt?: ISOTimestamp;
  parsedData?: Record<string, any>;
  
  // Verification
  verified: boolean;
  verifiedBy?: UUID;
  verifiedAt?: ISOTimestamp;
  
  // Security
  encrypted: boolean;
  checksum: string;
  signature?: string;
  
  // Access
  visibility: ProfileVisibility;
  downloadable: boolean;
  
  // Versions
  version: number;
  previousVersions: UUID[];
  
  // Timestamps
  uploadedAt: ISOTimestamp;
  lastModified: ISOTimestamp;
  expiresAt?: ISOTimestamp;
}

/**
 * Reference information
 */
export interface ReferenceInfo {
  id: UUID;
  name: string;
  title: string;
  company: string;
  email: EmailAddress;
  phone?: PhoneNumber;
  relationship: string;
  yearsKnown: number;
  
  // Context
  context: string;
  projects: string[];
  skills: string[];
  
  // Contact
  canContact: boolean;
  preferredMethod: 'email' | 'phone' | 'both';
  bestTime: string;
  timezone: TimezoneString;
  
  // Status
  contacted: boolean;
  contactedAt?: ISOTimestamp;
  response?: ReferenceResponse;
  
  // Verification
  verified: boolean;
  verifiedBy?: UUID;
  verifiedAt?: ISOTimestamp;
  
  // Metadata
  notes: string;
  tags: string[];
  priority: Priority;
  
  // Timestamps
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

/**
 * Availability information
 */
export interface AvailabilityInfo {
  status: 'available' | 'busy' | 'limited' | 'unavailable' | 'away' | 'do_not_disturb';
  hoursPerWeek: number;
  timezone: TimezoneString;
  
  // Schedule
  workingHours: WorkingHours;
  unavailableDates: UnavailableDate[];
  
  // Preferences
  preferredTaskTypes: string[];
  preferredDuration: string;
  preferredComplexity: string;
  
  // Commitment
  minimumCommitment: string;
  maximumCommitment: string;
  longTermAvailable: boolean;
  
  // Notice
  noticePeriod: number;
  immediateStart: boolean;
  
  // Remote Work
  remoteWork: boolean;
  hybridWork: boolean;
  onsiteWork: boolean;
  travel: boolean;
  
  // Response
  responseTime: number;
  responseWindow: string;
  
  // Automation
  autoAccept: boolean;
  autoReject: boolean;
  
  // Timestamps
  lastUpdated: ISOTimestamp;
  effectiveFrom: ISOTimestamp;
  effectiveUntil?: ISOTimestamp;
}

/**
 * Working hours
 */
export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

/**
 * Day schedule
 */
export interface DaySchedule {
  available: boolean;
  slots: TimeSlot[];
  breaks: TimeSlot[];
  timezone: TimezoneString;
  flexible: boolean;
}

/**
 * Time slot
 */
export interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: number;
  type: 'work' | 'break' | 'meeting' | 'blocked' | 'flexible';
  description?: string;
}

/**
 * Unavailable date
 */
export interface UnavailableDate {
  startDate: string;
  endDate: string;
  reason: string;
  type: 'vacation' | 'holiday' | 'sick' | 'training' | 'personal' | 'other';
  allDay: boolean;
  recurring: boolean;
  recurrencePattern?: RecurrencePattern;
}

/**
 * Recurrence pattern
 */
export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;
  endDate?: string;
  count?: number;
  byDay?: string[];
  byMonth?: number[];
  byWeek?: number[];
}

/**
 * Compensation information
 */
export interface CompensationInfo {
  // Rates
  hourlyRate?: number;
  dailyRate?: number;
  projectRate?: number;
  
  // Preferences
  preferredCurrency: CurrencyCode;
  minimumRate: number;
  maximumRate?: number;
  
  // Structure
  rateStructure: 'fixed' | 'hourly' | 'daily' | 'project' | 'performance' | 'negotiable';
  
  // Negotiations
  negotiable: boolean;
  bulkDiscounts: boolean;
  longTermDiscounts: boolean;
  
  // Payment
  paymentMethods: string[];
  paymentTerms: string;
  invoiceFrequency: string;
  
  // Benefits
  benefits: string[];
  equity: boolean;
  bonuses: boolean;
  
  // Taxes
  taxStatus: string;
  taxId?: string;
  
  // History
  rateHistory: RateHistory[];
  
  // Visibility
  visibility: ProfileVisibility;
  
  // Timestamps
  lastUpdated: ISOTimestamp;
  effectiveFrom: ISOTimestamp;
}

/**
 * Rate history
 */
export interface RateHistory {
  rate: number;
  currency: CurrencyCode;
  type: string;
  effectiveFrom: ISOTimestamp;
  effectiveUntil?: ISOTimestamp;
  reason?: string;
}

/**
 * Professional performance
 */
export interface ProfessionalPerformance {
  // Overall Metrics
  overallRating: number;
  totalTasks: number;
  completedTasks: number;
  successRate: Percentage;
  
  // Quality Metrics
  qualityScore: number;
  accuracyRate: Percentage;
  defectRate: Percentage;
  revisionRate: Percentage;
  
  // Efficiency Metrics
  averageTime: number;
  onTimeDelivery: Percentage;
  productivityScore: number;
  
  // Collaboration
  communicationScore: number;
  teamworkScore: number;
  leadershipScore: number;
  
  // Client Satisfaction
  clientRating: number;
  repeatClientRate: Percentage;
  referralRate: Percentage;
  
  // Growth
  improvementRate: Percentage;
  skillGrowth: number;
  careerProgression: number;
  
  // Reliability
  attendanceRate: Percentage;
  responseTime: number;
  commitmentScore: number;
  
  // Financial
  totalEarnings: number;
  averageEarnings: number;
  hourlyEarnings: number;
  
  // Trends
  trends: PerformanceTrend[];
  
  // Achievements
  achievements: string[];
  milestones: string[];
  awards: string[];
  
  // Feedback
  feedbackScore: number;
  feedbackCount: number;
  
  // Benchmarks
  industryPercentile: number;
  peerRanking: number;
  
  // Timestamps
  lastUpdated: ISOTimestamp;
  periodStart: ISOTimestamp;
  periodEnd: ISOTimestamp;
}

/**
 * Performance trend
 */
export interface PerformanceTrend {
  metric: string;
  period: string;
  value: number;
  change: number;
  trend: 'improving' | 'declining' | 'stable';
  confidence: Percentage;
}

/**
 * Personal information
 */
export interface PersonalInfo {
  interests: string[];
  hobbies: string[];
  values: string[];
  personalityType?: string;
  workStyle?: string;
  communicationStyle?: string;
  motivations: string[];
  
  // Goals
  goals: PersonalGoal[];
  
  // Achievements
  achievements: PersonalAchievement[];
  
  // Causes
  causes: string[];
  volunteer: VolunteerInfo[];
  
  // Lifestyle
  lifestyle: LifestyleInfo;
  
  // Privacy
  privacy: PersonalPrivacy;
}

/**
 * Personal goal
 */
export interface PersonalGoal {
  id: UUID;
  title: string;
  description: string;
  category: string;
  type: 'career' | 'skill' | 'financial' | 'personal' | 'health' | 'other';
  priority: Priority;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  
  // Timeline
  targetDate?: ISOTimestamp;
  startDate: ISOTimestamp;
  completedDate?: ISOTimestamp;
  
  // Progress
  progress: Percentage;
  milestones: GoalMilestone[];
  
  // Tracking
  metrics: GoalMetrics;
  
  // Metadata
  tags: string[];
  visibility: ProfileVisibility;
  
  // Timestamps
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

/**
 * Goal milestone
 */
export interface GoalMilestone {
  id: UUID;
  title: string;
  description: string;
  targetDate: ISOTimestamp;
  completed: boolean;
  completedAt?: ISOTimestamp;
  progress: Percentage;
  requirements: string[];
  rewards: string[];
}

/**
 * Goal metrics
 */
export interface GoalMetrics {
  completion: Percentage;
  timeSpent: number;
  effort: number;
  difficulty: number;
  satisfaction: number;
  impact: number;
  resources: string[];
  obstacles: string[];
  support: string[];
}

/**
 * Personal achievement
 */
export interface PersonalAchievement {
  id: UUID;
  title: string;
  description: string;
  category: string;
  type: 'award' | 'recognition' | 'milestone' | 'certification' | 'publication' | 'other';
  
  // Details
  issuer?: string;
  evidence?: string;
  skills: string[];
  impact: string;
  
  // Verification
  verified: boolean;
  verifiedBy?: UUID;
  verifiedAt?: ISOTimestamp;
  
  // Media
  images: MediaAsset[];
  documents: DocumentInfo[];
  
  // Dates
  achievedAt: ISOTimestamp;
  validUntil?: ISOTimestamp;
  
  // Visibility
  visibility: ProfileVisibility;
  featured: boolean;
  
  // Metadata
  tags: string[];
  keywords: string[];
  
  // Timestamps
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

/**
 * Volunteer information
 */
export interface VolunteerInfo {
  id: UUID;
  organization: string;
  role: string;
  cause: string;
  description: string;
  
  // Timeline
  startDate: string;
  endDate?: string;
  hoursPerWeek: number;
  totalHours: number;
  
  // Skills
  skills: string[];
  achievements: string[];
  
  // Verification
  verified: boolean;
  verifiedBy?: UUID;
  verifiedAt?: ISOTimestamp;
  
  // Contact
  supervisor?: ContactReference;
  
  // Visibility
  visibility: ProfileVisibility;
  
  // Timestamps
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

/**
 * Lifestyle information
 */
export interface LifestyleInfo {
  workLifeBalance: number;
  stressLevel: number;
  healthStatus: string;
  fitnessLevel: string;
  
  // Preferences
  workEnvironment: string[];
  workCulture: string[];
  teamSize: string;
  
  // Habits
  workingHabits: string[];
  communicationHabits: string[];
  learningHabits: string[];
  
  // Constraints
  constraints: string[];
  limitations: string[];
  
  // Visibility
  visibility: ProfileVisibility;
}

/**
 * Personal privacy settings
 */
export interface PersonalPrivacy {
  interests: ProfileVisibility;
  hobbies: ProfileVisibility;
  values: ProfileVisibility;
  goals: ProfileVisibility;
  achievements: ProfileVisibility;
  volunteer: ProfileVisibility;
  lifestyle: ProfileVisibility;
}

/**
 * Social links
 */
export interface SocialLinks {
  linkedin?: SocialLink;
  github?: SocialLink;
  twitter?: SocialLink;
  instagram?: SocialLink;
  facebook?: SocialLink;
  youtube?: SocialLink;
  tiktok?: SocialLink;
  discord?: SocialLink;
  slack?: SocialLink;
  behance?: SocialLink;
  dribbble?: SocialLink;
  medium?: SocialLink;
  custom: CustomSocialLink[];
}

/**
 * Social link
 */
export interface SocialLink {
  url: URL;
  username: string;
  verified: boolean;
  verifiedAt?: ISOTimestamp;
  followers?: number;
  following?: number;
  posts?: number;
  engagement?: number;
  lastSynced?: ISOTimestamp;
  visibility: ProfileVisibility;
}

/**
 * Custom social link
 */
export interface CustomSocialLink {
  id: UUID;
  name: string;
  url: URL;
  icon?: URL;
  username?: string;
  verified: boolean;
  verifiedAt?: ISOTimestamp;
  visibility: ProfileVisibility;
  order: number;
}

/**
 * Custom field
 */
export interface CustomField {
  id: UUID;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'url' | 'email' | 'phone' | 'json';
  value: any;
  options?: string[];
  required: boolean;
  editable: boolean;
  visibility: ProfileVisibility;
  category: string;
  order: number;
  validation?: FieldValidation;
  metadata: Record<string, any>;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
}

/**
 * Field validation
 */
export interface FieldValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  enum?: any[];
  custom?: string;
}

/**
 * Profile visibility settings
 */
export interface ProfileVisibilitySettings {
  overall: ProfileVisibility;
  sections: ProfileSectionVisibility;
  fields: Record<string, ProfileVisibility>;
  search: boolean;
  indexing: boolean;
  analytics: boolean;
  recommendations: boolean;
}

/**
 * Profile section visibility
 */
export interface ProfileSectionVisibility {
  basic: ProfileVisibility;
  contact: ProfileVisibility;
  location: ProfileVisibility;
  demographics: ProfileVisibility;
  professional: ProfileVisibility;
  personal: ProfileVisibility;
  social: ProfileVisibility;
  portfolio: ProfileVisibility;
  achievements: ProfileVisibility;
  references: ProfileVisibility;
  availability: ProfileVisibility;
  compensation: ProfileVisibility;
  custom: ProfileVisibility;
}

// ============================= EXPORTS =============================

export * from './user-requests';
export * from './user-responses';
export * from './user-events';
export * from './user-utils';
export * from './user-constants'; 