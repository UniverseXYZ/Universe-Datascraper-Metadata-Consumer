# Universe Datascraper Metadata Consumer

## Description

This consumer is to fetch NFT's metadata by given a token id, a NFT contract address and the type of NFT contract, which are passed from Metadata Producer via SQS.

Rule engine is used to define different ways to extract metadata. The table below shows current covered special NFTs.

| NFT Name                  | NFT contract address                       |
| ------------------------- | ------------------------------------------ |
| Cryptofootball            | 0x6e1b98153399d5E4e710c1A0b803c74d3d7F2957 |
| CryptoKitties             | 0x06012c8cf97BEaD5deAe237070F9587f8E7A266d |
| Cryptopunks               | 0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB |
| Decentraland              | 0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643 |
| Hashmasks                 | 0xc2c747e0f7004f9e8817db2ca4997657a7746928 |
| Opensea Shared Storefront | 0x495f947276749Ce646f68AC8c248420045cb7b5e |

## Requirements

- NodeJS version 14+
- NPM

## Required External Service

- AWS SQS
- Infura
- MongoDB

## Primary Third Party Libraries

- NestJS
- Mongoose (MongoDB)
- bbc/sqs-producer (Only applicable for producers)
- bbc/sqs-consumer (Only applicable for consumers)

## DataFlow

### Input Data

The metadata producer sends the messages that contain below parameters to this consumer.

- Token type (Current supported): ERC721, ERC1155, CryptoPunks
- NFT contract address
- Token Id

### Data Analysis and Storage

- If the contract's metadata fetching method is implemented in rule engine, use rule engine handler to fetch its metadata.
- If the contract is not a special case, use standard fetch method to get its metadata.
- Fetched result is stored in DB as well as errors occored during fetch process.

### Output

The fetched metadata is stored in NFT token collection, and should make sure this token is stored already.

- NFT token

## MongoDB Collection Usage

This consumer leverage the following data collection in [schema](https://github.com/plugblockchain/Universe-Datascraper-Schema)

- NFT Tokens: store extracted NFT tokens.
