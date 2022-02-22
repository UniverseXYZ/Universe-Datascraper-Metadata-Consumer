import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Consumer } from 'sqs-consumer';
import AWS from 'aws-sdk';
import {
  ERROR_EVENT_NAME,
  PROCESSING_ERROR_EVENT_NAME,
  SqsConsumerHandler,
  TIMEOUT_EVENT_NAME,
  TokenMessage,
} from './sqs-consumer.types';
import { ConfigService } from '@nestjs/config';
import https from 'https';
import { RuleEngineService } from '../rule-engine/rule-engine.service';

@Injectable()
export class SqsConsumerService
  implements SqsConsumerHandler, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(SqsConsumerService.name);
  public sqsConsumer: Consumer;
  private queue: AWS.SQS;

  constructor(
    private configService: ConfigService,
    private metadataRuleEngine: RuleEngineService,
  ) {
    const region = this.configService.get('aws.region');
    const accessKeyId = this.configService.get('aws.accessKeyId');
    const secretAccessKey = this.configService.get('aws.secretAccessKey');
    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'Initialize AWS queue failed, please check required variables',
      );
    }
    AWS.config.update({
      region,
      accessKeyId,
      secretAccessKey,
    });
  }

  public onModuleInit() {
    this.logger.log('Initialize SQS consumer');
    this.queue = new AWS.SQS({
      httpOptions: {
        agent: new https.Agent({
          keepAlive: true,
        }),
      },
    });
    this.sqsConsumer = Consumer.create({
      queueUrl: this.configService.get('aws.queueUrl'),
      sqs: this.queue,
      handleMessage: this.handleMessage.bind(this),
    });

    this.sqsConsumer.addListener(ERROR_EVENT_NAME, this.onError.bind(this));
    this.sqsConsumer.addListener(
      PROCESSING_ERROR_EVENT_NAME,
      this.onProcessingError.bind(this),
    );
    this.sqsConsumer.addListener(
      TIMEOUT_EVENT_NAME,
      this.onTimeoutError.bind(this),
    );
    this.sqsConsumer.start();
    this.logger.log('SQS consumer started');
  }

  public onModuleDestroy() {
    this.sqsConsumer.stop();
    this.logger.log('SQS consumer stopped');
  }

  async handleMessage(message: AWS.SQS.Message): Promise<void> {
    this.logger.log(`Handle sqs message id:(${message.MessageId})`);
    const tokenMessage: TokenMessage = JSON.parse(message.Body);
    const { contractAddress, contractType, tokenId } = tokenMessage;
    this.logger.log(
      `Handle sqs message contractAddress:${contractAddress} tokenId:${tokenId}`,
    );
    await this.metadataRuleEngine.FetchNFTMetadata(
      contractAddress,
      contractType,
      tokenId,
    );
  }

  onError(error: Error, message: AWS.SQS.Message): Promise<void> {
    this.logger.error(`SQS error ${error.message}`);
    this.deleteMessage(message);
    return;
  }

  onProcessingError(error: Error, message: AWS.SQS.Message): Promise<void> {
    this.logger.error(`Processing error ${error.message}`);
    this.deleteMessage(message);
    return;
  }

  onTimeoutError(error: Error, message: AWS.SQS.Message): Promise<void> {
    this.logger.error(`Timeout error ${error.message}`);
    this.deleteMessage(message);
    return;
  }

  private async deleteMessage(message: AWS.SQS.Message) {
    const deleteParams = {
      QueueUrl: this.configService.get('aws.queueUrl'),
      ReceiptHandle: message.ReceiptHandle,
    };

    try {
      await this.queue.deleteMessage(deleteParams).promise();
    } catch (err) {
      this.logger.error(`Deleting Message(${message?.MessageId}) ERROR`);
    }
  }
}
