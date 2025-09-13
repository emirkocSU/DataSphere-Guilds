/** @fileoverview Core types for API Contracts. */
import { Uuid, IsoTimestamp } from '../../../types/common.types';

export type ApiProtocol = 'REST' | 'GRAPHQL' | 'GRPC';

export interface ApiContract {
  contractId: Uuid;
  name: string;
  version: string;
  protocol: ApiProtocol;
  schemaDefinition: string; // e.g., OpenAPI/Swagger JSON, GraphQL SDL
  createdAt: IsoTimestamp;
}
