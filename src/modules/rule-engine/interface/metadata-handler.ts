import { ethers } from 'ethers';
import { EtherscanService } from '../../etherscan/etherscan.service';

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
    contractAddress?: string
  ): Promise<IMetadataFetcherResponse>;
}
