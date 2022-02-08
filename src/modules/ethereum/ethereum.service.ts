import { Injectable } from '@nestjs/common';
import { EthereumNetworkType } from './interface';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EthereumService {
  public ether: ethers.providers.InfuraProvider;

  constructor(private configService: ConfigService) {
    const key = this.configService.get('ethereum_network');

    const projectId = this.configService.get('infura.project_id');

    if (!projectId) {
      throw new Error('Infura project id or secret is not defined');
    }

    const ethersProvider = new ethers.providers.InfuraProvider(
      EthereumNetworkType[key],
      projectId,
    );

    this.ether = ethersProvider;
  }
}
