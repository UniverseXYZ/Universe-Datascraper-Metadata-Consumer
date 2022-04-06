import { Injectable, Logger } from '@nestjs/common';
import { ContractType } from '../nft-contract/contract';
import { NFTContractService } from '../nft-contract/nft-contract.service';
import { fetchMetadataFromTokenUri } from 'src/utils/api';
import { NFTTokensService } from '../nft-tokens/nft-tokens.service';
import { NFTTokensDTO } from '../nft-tokens/dto/nft-tokens.dto';
import { ConfigService } from '@nestjs/config';
import { Rules } from './rules';
import { EthereumService } from '../ethereum/ethereum.service';
import { EtherscanService } from '../etherscan/etherscan.service';
import { IMetadataFetcherResponse } from './interface/metadata-handler';

@Injectable()
export class RuleEngineService {
  private readonly logger = new Logger(RuleEngineService.name);

  constructor(
    protected readonly nftContractService: NFTContractService,
    protected readonly nftTokensService: NFTTokensService,
    protected readonly configService: ConfigService,
    protected readonly ethereumService: EthereumService,
    protected readonly etherscanService: EtherscanService,
  ) {}

  async FetchNFTMetadata(
    contractAddress: string,
    contractType: ContractType,
    tokenId: string,
  ): Promise<void> {
    if (contractAddress && contractType) {
      this.logger.debug(
        `Fetching metadata for contract ${contractAddress} and token ${tokenId}`,
      );
      const tokenDto: NFTTokensDTO = {
        contractAddress,
        tokenId,
      };
      const ruleEngine = Rules.find(
        (rule) =>
          rule.contractAddress.toLowerCase() === contractAddress.toLowerCase(),
      );

      let metadataRes: IMetadataFetcherResponse;
      if (ruleEngine) {
        metadataRes = await ruleEngine.metadataHandler(
          tokenId,
          this.ethereumService.ether,
          contractAddress,
          this.etherscanService
        );
      } else {
        metadataRes = await this.standardNFTMetadata(
          contractAddress,
          contractType,
          tokenId,
        );
      }
      if (metadataRes.success) {
        this.logger.debug(
          `Fetched metadata for contract ${contractAddress} and token ${tokenId}`,
        );
        tokenDto.externalDomainViewUrl = metadataRes.externalDomainViewUrl;
        tokenDto.metadata = metadataRes.metadata;
      } else {
        this.logger.debug(
          `Failed to fetch metadata for contract ${contractAddress} and token ${tokenId}`,
        );
        tokenDto.metadataFetchError = metadataRes.error;
      }

      await this.nftTokensService.updateOne(tokenDto);
      this.logger.debug(
        `Updated metadata in DB for contract ${contractAddress} and token ${tokenId}`,
      );
    }
  }

  private formatTokenUri(tokenUri: string) {
    const ipfsGateway = this.configService.get('ipfs_gateway');
    const regex = /^ipfs:\/\/(ipfs\/){0,1}/;
    const isIpfs = regex.test(tokenUri);
    if (isIpfs) {
      return tokenUri.replace(regex, ipfsGateway);
    } else {
      return tokenUri;
    }
  }

  private specialUriCheck(tokenUri: string, tokenId: string) {
    if (tokenUri.includes('{id}')) {
      return tokenUri.replace('{id}', tokenId);
    }
    return tokenUri;
  }

  private async standardNFTMetadata(
    contractAddress: string,
    contractType: ContractType,
    tokenId: string,
  ): Promise<IMetadataFetcherResponse> {
    const tokenUriRes = await this.nftContractService.getTokenUri(
      contractAddress,
      contractType,
      tokenId,
    );
    if (!tokenUriRes.success) {
      return tokenUriRes;
    }

    const tokenUri = tokenUriRes.tokenUri;
    const formatedUri = this.formatTokenUri(tokenUri);
    const uri = this.specialUriCheck(formatedUri, tokenId);
    const metadataRes = await fetchMetadataFromTokenUri(uri);
    if (!metadataRes.success) {
      return metadataRes;
    }
    return {
      success: true,
      metadata: metadataRes.metadata,
      externalDomainViewUrl: uri,
    };
  }
}
