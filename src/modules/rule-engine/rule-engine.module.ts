import { Module } from '@nestjs/common';
import { EthereumModule } from '../ethereum/ethereum.module';
import { NFTContractModule } from '../nft-contract/nft-contract.module';
import { NFTTokensModule } from '../nft-tokens/nft-tokens.module';
import { RuleEngineService } from './rule-engine.service';

@Module({
  imports: [NFTContractModule, NFTTokensModule, EthereumModule],
  providers: [RuleEngineService],
  exports: [RuleEngineService],
})
export class RuleEngineModule {}
