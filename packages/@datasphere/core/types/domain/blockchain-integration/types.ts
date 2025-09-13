/** @fileoverview Core types for Blockchain Integration. */
import { Uuid, IsoTimestamp, MoneyValue } from '../../../types/common.types';

export type BlockchainNetwork = 'ETHEREUM' | 'POLYGON' | 'SOLANA';

export interface SmartContract {
  contractId: Uuid;
  address: string;
  network: BlockchainNetwork;
  abi: any; // ABI JSON
  deployedAt: IsoTimestamp;
}
