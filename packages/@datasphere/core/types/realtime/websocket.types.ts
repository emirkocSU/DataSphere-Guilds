/** @fileoverview Types for WebSocket messages and connection states. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type WebSocketMessageType = 'TEXT' | 'BINARY' | 'JSON';
export type ConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING';

export interface WebSocketMessage {
  readonly id: Uuid;
  readonly type: WebSocketMessageType;
  readonly payload: string | ArrayBuffer | Record<string, any>;
  readonly timestamp: IsoTimestamp;
  readonly senderId?: Uuid;
}

export interface WebSocketConnection {
  readonly connectionId: Uuid;
  readonly userId: Uuid;
  readonly status: ConnectionStatus;
  readonly connectedAt: IsoTimestamp;
  readonly lastActivityAt: IsoTimestamp;
}
