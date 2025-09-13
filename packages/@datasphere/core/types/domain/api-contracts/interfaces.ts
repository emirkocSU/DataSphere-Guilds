/** @fileoverview Interfaces for API Contracts services. */
import { Uuid } from '../../../types/common.types';
import { ApiContract } from './types';

export interface IApiContractService {
  getContract(contractId: Uuid): Promise<ApiContract | null>;
  validatePayload(contractId: Uuid, payload: any): Promise<boolean>;
  listContracts(protocol?: ApiProtocol): Promise<ApiContract[]>;
}
