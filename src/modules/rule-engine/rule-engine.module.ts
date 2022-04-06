import { Module } from '@nestjs/common';
import { EthereumModule } from '../ethereum/ethereum.module';
import { EtherscanModule } from '../etherscan/etherscan.module';
import { NFTContractModule } from '../nft-contract/nft-contract.module';
import { NFTTokensModule } from '../nft-tokens/nft-tokens.module';
import { RuleEngineService } from './rule-engine.service';

@Module({
  imports: [NFTContractModule, NFTTokensModule, EthereumModule, EtherscanModule],
  providers: [RuleEngineService],
  exports: [RuleEngineService],
})
export class RuleEngineModule {}
