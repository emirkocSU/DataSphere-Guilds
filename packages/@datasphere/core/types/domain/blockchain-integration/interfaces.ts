/** @fileoverview Interfaces for Blockchain Integration services. */
import { Uuid } from '../../../types/common.types';
import { SmartContract, BlockchainNetwork } from './types';

export interface IBlockchainService {
  deployContract(abi: any, bytecode: string, network: BlockchainNetwork): Promise<SmartContract>;
  callContractMethod(contractId: Uuid, methodName: string, args: any[]): Promise<any>;
  getWalletBalance(address: string, currency: string): Promise<MoneyValue>;
}
