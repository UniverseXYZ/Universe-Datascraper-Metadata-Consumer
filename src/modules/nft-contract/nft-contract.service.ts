import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { EthereumService } from '../ethereum/ethereum.service';
import { ContractType, getContractAbi } from './contract';

@Injectable()
export class NFTContractService {
  private readonly logger = new Logger(NFTContractService.name);
  constructor(protected readonly ethService: EthereumService) {}

  public async getTokenUri(
    contractAddress: string,
    contractType: ContractType,
    tokenId: string,
  ): Promise<{ success: boolean; tokenUri?: string; error?: string }> {
    const contractAbi = getContractAbi(contractType);
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      this.ethService.ether,
    );
    if (!contract) {
      this.logger.log(
        `Contract instance ${contractAddress} ${contractType} cannot be constructued.`,
      );
      return {
        success: false,
        error: 'Contract instance cannot be constructued.',
      };
    }
    try {
      let tokenUri;
      if (contractType === 'ERC721') {
        tokenUri = await contract.tokenURI(tokenId);
      } else if (contractType === 'ERC1155') {
        tokenUri = await contract.uri(tokenId);
      }

      return { success: true, tokenUri };
    } catch (err) {
      this.logger.log('Get tokenUri from contract failed', JSON.stringify(err));
      if (err?.error?.reason === 'timeout' || err?.error?.code === 429) {
        return this.ethService.connectToProvider(() => this.getTokenUri(contractAddress, contractType, tokenId));
      }
      return {
        success: false,
        error: JSON.stringify(err),
      };
    }
  }
}
