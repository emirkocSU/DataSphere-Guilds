/** @fileoverview Interfaces for Third-Party APIs services. */
import { Uuid } from '../../../types/common.types';
import { ExternalApiConfig, ApiProvider } from './types';

export interface IThirdPartyApiService {
  getApiConfig(provider: ApiProvider): Promise<ExternalApiConfig | null>;
  updateApiConfig(configId: Uuid, updates: Partial<ExternalApiConfig>): Promise<void>;
  callApi(provider: ApiProvider, endpoint: string, data: Record<string, any>): Promise<any>;
}
