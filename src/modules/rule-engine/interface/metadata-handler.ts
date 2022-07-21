import { EthereumService } from 'src/modules/ethereum/ethereum.service';

export interface IMetadataFetcherResponse {
  success: boolean;
  error?: any;
  metadata?: any;
  externalDomainViewUrl?: string;
}

export interface IMetadataHandler {
  (
    tokenId: string,
    ethereumService?: EthereumService,
    contractAddress?: string
  ): Promise<IMetadataFetcherResponse>;
}
