import { Injectable } from '@nestjs/common';
import { ContractType } from '../nft-contract/contract';
import { NFTContractService } from '../nft-contract/nft-contract.service';
import { fetchMetadataFromTokenUri } from 'src/utils/api';
import { NFTTokensService } from '../nft-tokens/nft-tokens.service';
import { NFTTokensDTO } from '../nft-tokens/dto/nft-tokens.dto';
import { BigNumber } from 'ethers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NFTMetadataService {
  constructor(
    protected readonly nftContractService: NFTContractService,
    protected readonly nftTokensService: NFTTokensService,
    protected readonly configService: ConfigService,
  ) {}

  async FetchNFTMetadata(
    contractAddress: string,
    contractType: ContractType,
    tokenId: string,
  ): Promise<void> {
    if (contractAddress && contractType) {
      const tokenDto: NFTTokensDTO = {
        contractAddress,
        tokenId,
      };
      const tokenUriRes = await this.nftContractService.getTokenUri(
        contractAddress,
        contractType,
        tokenId,
      );
      if (!tokenUriRes.success) {
        tokenDto.metadataFetchError = tokenUriRes.error;
      } else {
        const tokenUri = tokenUriRes.tokenUri;
        tokenDto.externalDomainViewUrl = tokenUri;
        const uri = this.formatTokenUri(tokenUri, tokenId);
        const metadataRes = await fetchMetadataFromTokenUri(uri);
        if (!metadataRes.success) {
          tokenDto.metadataFetchError = metadataRes.error;
        } else {
          tokenDto.metadata = metadataRes.metadata;
        }
      }
      await this.nftTokensService.updateOne(tokenDto);
    }
  }

  private formatTokenUri(tokenUri: string, tokenId: string) {
    const ipfsGateway = this.configService.get('ipfs_gateway');
    const regex = /^ipfs:\/\/(ipfs\/){0,1}/;
    const isIpfs = regex.test(tokenUri);
    if (isIpfs) {
      return tokenUri.replace(regex, ipfsGateway);
    } else {
      return this.specialCases(tokenUri, tokenId);
    }
  }

  private specialCases(tokenUri: string, tokenId: string) {
    const opensea1155 = this.configService.get('opensea_erc_1155_api');
    if (tokenUri.includes(opensea1155)) {
      const hexTokenId = BigNumber.from(tokenId).toHexString();
      return tokenUri.replace('/0x{id}', `/${hexTokenId}`);
    }
    return tokenUri;
  }
}
