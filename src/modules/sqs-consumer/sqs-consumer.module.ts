import { Module } from '@nestjs/common';
import { NFTMetadataModule } from '../nft-metadata/nft-metadata.module';
import { SqsConsumerService } from './sqs-consumer.service';

@Module({
  imports: [NFTMetadataModule],
  providers: [SqsConsumerService],
  exports: [SqsConsumerService],
})
export class SqsConsumerModule {}
