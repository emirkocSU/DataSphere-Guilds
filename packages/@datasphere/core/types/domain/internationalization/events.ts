/** @fileoverview Event types for Internationalization. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { Translation } from './types';

export interface TranslationUpdatedEvent {
  eventId: Uuid;
  translation: Translation;
  timestamp: IsoTimestamp;
}
