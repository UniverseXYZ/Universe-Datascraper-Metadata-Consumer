import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import configuration from './modules/configuration';
import { DatabaseModule } from './modules/database/database.module';
import { EthereumModule } from './modules/ethereum/ethereum.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './modules/database/database.service';
import { SqsConsumerModule } from './modules/sqs-consumer/sqs-consumer.module';
import { NFTTokensModule } from './modules/nft-tokens/nft-tokens.module';
import { NFTContractModule } from './modules/nft-contract/nft-contract.module';
import { RuleEngineModule } from './modules/rule-engine/rule-engine.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      ignoreEnvVars: false,
      isGlobal: true,
      load: [configuration],
    }),
    TerminusModule,
    MongooseModule.forRootAsync({
      imports: [DatabaseModule],
      useExisting: DatabaseService,
    }),
    HealthModule,
    EthereumModule,
    SqsConsumerModule,
    NFTTokensModule,
    NFTContractModule,
    RuleEngineModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
