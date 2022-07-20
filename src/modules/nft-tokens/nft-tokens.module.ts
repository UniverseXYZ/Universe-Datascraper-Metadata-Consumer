import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NFTToken, NFTTokensSchema } from './schemas/nft-tokens.schema';
import { NFTTokensService } from './nft-tokens.service';
import {
  NFTCollectionAttributes,
  NFTCollectionAttributesrSchema,
} from 'datascraper-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NFTToken.name, schema: NFTTokensSchema },
    ]),
    MongooseModule.forFeature([
      {
        name: NFTCollectionAttributes.name,
        schema: NFTCollectionAttributesrSchema,
      },
    ]),
  ],
  providers: [NFTTokensService],
  exports: [NFTTokensService],
})
export class NFTTokensModule {}
