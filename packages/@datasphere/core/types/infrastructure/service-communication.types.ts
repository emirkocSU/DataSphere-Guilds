/** @fileoverview Types for service-to-service communication. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type CommunicationProtocol = 'HTTP_REST' | 'GRPC' | 'MESSAGE_QUEUE';

export interface ServiceEndpoint {
  readonly serviceId: Uuid;
  readonly name: string;
  readonly protocol: CommunicationProtocol;
  readonly url: string;
  readonly lastHeartbeat: IsoTimestamp;
}

export interface ServiceMessage {
  readonly messageId: Uuid;
  readonly senderId: Uuid;
  readonly recipientId: Uuid;
  readonly type: string; // e.g., 'USER_CREATED', 'TASK_UPDATED'
  readonly payload: Record<string, any>;
  readonly timestamp: IsoTimestamp;
}
