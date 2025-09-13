
import { z } from 'zod';

/**
 * Schema for data retention policies.
 * Defines how long different types of data should be stored.
 */
const DataRetentionSchema = z.object({
  /** Default retention period in days for user data after account deletion. */
  userDataDays: z.number().int().positive(),
  /** Retention period in days for audit logs. */
  auditLogDays: z.number().int().positive(),
  /** Retention period in days for inactive user data. */
  inactiveAccountDays: z.number().int().positive(),
});

/**
 * Schema for consent management settings.
 */
const ConsentManagementSchema = z.object({
  /** Whether a cookie consent banner should be displayed. */
  requiresCookieConsent: z.boolean(),
  /** The version of the Terms of Service that users must agree to. */
  termsOfServiceVersion: z.string(),
  /** The version of the Privacy Policy that users must agree to. */
  privacyPolicyVersion: z.string(),
});

/**
 * Main schema for the compliance settings configuration file.
 */
export const ComplianceConfigSchema = z.object({
  dataRetention: DataRetentionSchema,
  consent: ConsentManagementSchema,
  /** The designated Data Protection Officer (DPO) contact email. */
  dpoEmail: z.string().email(),
});

export type ComplianceConfig = z.infer<typeof ComplianceConfigSchema>;

/**
 * Default compliance settings configuration.
 * These values should be reviewed and adjusted based on legal requirements.
 */
export const defaultComplianceConfig: ComplianceConfig = {
  dataRetention: {
    userDataDays: 30,
    auditLogDays: 180,
    inactiveAccountDays: 365 * 2, // 2 years
  },
  consent: {
    requiresCookieConsent: true,
    termsOfServiceVersion: 'v1.1.0',
    privacyPolicyVersion: 'v1.1.0',
  },
  dpoEmail: 'dpo@datasphereguilds.com',
};
