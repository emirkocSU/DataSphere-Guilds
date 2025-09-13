/** @fileoverview Event types for Prediction Models. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';
import { PredictionModel } from './types';

export interface ModelTrainedEvent {
  eventId: Uuid;
  model: PredictionModel;
  timestamp: IsoTimestamp;
}
