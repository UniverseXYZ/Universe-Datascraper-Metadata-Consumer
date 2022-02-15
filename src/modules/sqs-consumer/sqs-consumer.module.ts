import { Module } from '@nestjs/common';
import { RuleEngineModule } from '../rule-engine/rule-engine.module';
import { SqsConsumerService } from './sqs-consumer.service';

@Module({
  imports: [RuleEngineModule],
  providers: [SqsConsumerService],
  exports: [SqsConsumerService],
})
export class SqsConsumerModule {}
