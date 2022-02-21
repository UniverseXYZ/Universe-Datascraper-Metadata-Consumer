import { ethers } from 'ethers';

export interface IMetadataFetcherResponse {
  success: boolean;
  error?: any;
  metadata?: any;
  externalDomainViewUrl?: string;
}

export interface IMetadataHandler {
  (
    tokenId: string,
    provider?: ethers.providers.BaseProvider,
    contractAddress?: string,
  ): Promise<IMetadataFetcherResponse>;
}
