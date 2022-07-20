import { Module } from '@nestjs/common';
import { EthereumModule } from '../ethereum/ethereum.module';
import { RuleEngineModule } from '../rule-engine/rule-engine.module';
import { SqsConsumerService } from './sqs-consumer.service';

@Module({
  imports: [RuleEngineModule, EthereumModule],
  providers: [SqsConsumerService],
  exports: [SqsConsumerService],
})
export class SqsConsumerModule {}
