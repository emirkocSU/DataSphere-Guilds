/** @fileoverview Types for CDN integration and asset optimization. */
import { Uuid, IsoTimestamp } from '../../types/common.types';

export type CdnProvider = 'CLOUDFRONT' | 'CLOUDFLARE' | 'AKAMAI';

export interface CdnConfig {
  readonly configId: Uuid;
  readonly provider: CdnProvider;
  readonly distributionId: string;
  readonly domainName: string;
  readonly cachePolicyId: Uuid;
  readonly lastDeployed: IsoTimestamp;
}

export interface AssetOptimizationConfig {
  readonly optimizationId: Uuid;
  readonly assetType: 'IMAGE' | 'VIDEO' | 'JAVASCRIPT' | 'CSS';
  readonly compressionEnabled: boolean;
  readonly minificationEnabled: boolean;
  readonly lazyLoadingEnabled: boolean;
}
