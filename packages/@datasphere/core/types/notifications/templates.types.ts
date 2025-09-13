/** @fileoverview Types for notification templates. */
import { UUID } from '../common.types';

export type TemplateChannel = 'EMAIL' | 'SMS' | 'IN_APP';

export interface NotificationTemplate {
  readonly templateId: UUID;
  readonly name: string;
  readonly channel: TemplateChannel;
  readonly content: string; // e.g., Handlebars, Liquid template string
  readonly requiredVariables: string[];
  readonly version: number;
}
