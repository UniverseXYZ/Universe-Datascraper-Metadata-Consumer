import { Module } from '@nestjs/common';
import { NFTContractModule } from '../nft-contract/nft-contract.module';
import { NFTTokensModule } from '../nft-tokens/nft-tokens.module';
import { NFTMetadataService } from './nft-metadata.service';

@Module({
  imports: [NFTContractModule, NFTTokensModule],
  providers: [NFTMetadataService],
  exports: [NFTMetadataService],
})
export class NFTMetadataModule {}
