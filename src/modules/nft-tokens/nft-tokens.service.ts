import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NFTToken, NFTTokensDocument } from './schemas/nft-tokens.schema';
import { NFTTokensDTO } from './dto/nft-tokens.dto';
import {
  NFTCollectionAttributes,
  NFTCollectionAttributesDocument,
} from 'datascraper-schema';
import { isEmpty } from 'lodash';

@Injectable()
export class NFTTokensService {
  constructor(
    @InjectModel(NFTToken.name)
    private readonly nftTokensModel: Model<NFTTokensDocument>,
    @InjectModel(NFTCollectionAttributes.name)
    private readonly nftCollectionAttributesModel: Model<NFTCollectionAttributesDocument>,
  ) {}

  async updateOne(nftToken: NFTTokensDTO) {
    const { contractAddress, tokenId, ...res } = nftToken;
    const attributes = res?.metadata?.attributes;

    await this.nftTokensModel.updateOne(
      { contractAddress, tokenId },
      { ...res },
    );

    if (attributes) {
      const token = await this.nftTokensModel.findOne({
        contractAddress,
        tokenId,
      });
      const contract = await this.nftCollectionAttributesModel.findOne({
        contractAddress,
      });
      let contractAttributes = contract?.attributes;

      if (token && token?.metadata?.attributes) {
        if (!isEmpty(contractAttributes)) {
          token.metadata.attributes.forEach(({ trait_type, value }) => {
            if (isEmpty(contractAttributes[trait_type][value])) {
              return;
            }
            const index = contractAttributes[trait_type][value].indexOf(
              token.tokenId,
            );
            if (index > -1) {
              contractAttributes[trait_type][value].splice(index, 1);
            }
          });

          attributes.forEach(({ trait_type, value }) => {
            contractAttributes[trait_type] =
              contractAttributes[trait_type] || {};
            contractAttributes[trait_type][value] = contractAttributes[
              trait_type
            ][value].push(token.tokenId) || [token.tokenId];
          });
        } else {
          contractAttributes = {};
          attributes.forEach(({ trait_type, value }) => {
            contractAttributes[trait_type] =
              contractAttributes[trait_type] || {};
            contractAttributes[trait_type][value] = contractAttributes[
              trait_type
            ][value].push(token.tokenId) || [token.tokenId];
          });
        }
      } else {
        if (!isEmpty(contractAttributes)) {
          attributes.forEach(({ trait_type, value }) => {
            contractAttributes[trait_type] =
              contractAttributes[trait_type] || {};
            contractAttributes[trait_type][value] = contractAttributes[
              trait_type
            ][value].push(token.tokenId) || [token.tokenId];
          });
        } else {
          contractAttributes = {};
          attributes.forEach(({ trait_type, value }) => {
            contractAttributes[trait_type] =
              contractAttributes[trait_type] || {};
            contractAttributes[trait_type][value] = contractAttributes[
              trait_type
            ][value].push(token.tokenId) || [token.tokenId];
          });
        }
      }

      if (contract) {
        contract.attributes = contractAttributes;
        await contract.save();
      } else {
        const nftCollection = {
          contractAddress: contractAddress,
          attributes: contractAttributes,
        };

        await this.nftCollectionAttributesModel.updateOne(
          { contractAddress: contractAddress },
          { $set: nftCollection },
          { upsert: true },
        );
      }
    }
  }
}
