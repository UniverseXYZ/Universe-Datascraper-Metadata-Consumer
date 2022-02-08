import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { NFTMetadataService } from './nft-metadata.service';
import configuration from '../configuration';
import { NFTContractService } from '../nft-contract/nft-contract.service';
import { NFTTokensService } from '../nft-tokens/nft-tokens.service';
import { EthereumService } from '../ethereum/ethereum.service';
import { NFTTokensDTO } from '../nft-tokens/dto/nft-tokens.dto';

describe('NFT Metadata', () => {
  let service: NFTMetadataService;
  let nftContractService: NFTContractService;
  let nftTokensService: NFTTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: false,
          ignoreEnvVars: false,
          isGlobal: true,
          load: [configuration],
        }),
      ],
      providers: [
        NFTMetadataService,
        NFTContractService,
        EthereumService,
        {
          provide: NFTTokensService,
          useValue: {
            updateOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NFTMetadataService>(NFTMetadataService);
    nftContractService = module.get<NFTContractService>(NFTContractService);
    nftTokensService = module.get<NFTTokensService>(NFTTokensService);
  });

  it('should save fetch error when contract is invalid', async () => {
    const contractAddress = '0xe51Aac67b09EaEd6d3D43e794D6bAe679Cbe09D8';
    const contractType = 'ERC721';
    const tokenId = '0';
    let isSaved = false;
    const fetchError = 'contract is invalid';
    const tokenDto: NFTTokensDTO = {
      contractAddress,
      tokenId,
    };
    jest.spyOn(nftContractService, 'getTokenUri').mockReturnValueOnce({
      success: false,
      error: fetchError,
    } as any);
    jest
      .spyOn(nftTokensService, 'updateOne')
      .mockImplementationOnce((tokenDto) => {
        isSaved = tokenDto.metadataFetchError === fetchError;
        return Promise.resolve();
      });
    await service.FetchNFTMetadata(contractAddress, contractType, tokenId);
    expect(isSaved).toBe(true);
  });

  it('should save fetch error when fetching metadata failed', async () => {
    const contractAddress = '0xe51Aac67b09EaEd6d3D43e794D6bAe679Cbe09D8';
    const contractType = 'ERC721';
    const tokenId = '0';
    let isSaved = false;
    const tokenDto: NFTTokensDTO = {
      contractAddress,
      tokenId,
    };
    jest.spyOn(nftContractService, 'getTokenUri').mockReturnValueOnce({
      success: true,
      tokenUri: 'https://burrows-api.fluf.world/api/token/90000',
    } as any);
    jest
      .spyOn(nftTokensService, 'updateOne')
      .mockImplementationOnce((tokenDto) => {
        isSaved = !!tokenDto.metadataFetchError;
        return Promise.resolve();
      });
    await service.FetchNFTMetadata(contractAddress, contractType, tokenId);
    expect(isSaved).toBe(true);
  });

  it('should get token metadata successfully', async () => {
    const contractAddress = '0xe51Aac67b09EaEd6d3D43e794D6bAe679Cbe09D8';
    const contractType = 'ERC721';
    const tokenId = '0';
    let isSaved = false;
    const tokenDto: NFTTokensDTO = {
      contractAddress,
      tokenId,
    };
    jest.spyOn(nftContractService, 'getTokenUri').mockReturnValueOnce({
      success: true,
      tokenUri: 'https://burrows-api.fluf.world/api/token/0',
    } as any);
    jest
      .spyOn(nftTokensService, 'updateOne')
      .mockImplementationOnce((tokenDto) => {
        isSaved = !!tokenDto.metadata;
        return Promise.resolve();
      });
    await service.FetchNFTMetadata(contractAddress, contractType, tokenId);
    expect(isSaved).toBe(true);
  });
  it('should get token metadata successfully when nft is ERC1155', async () => {
    const contractAddress = '0x495f947276749Ce646f68AC8c248420045cb7b5e';
    const contractType = 'ERC1155';
    const tokenId =
      '102676433867259323931171365895354757783778570312312576485042789456911181807617';
    let isSaved = false;
    const tokenDto: NFTTokensDTO = {
      contractAddress,
      tokenId,
    };
    jest.spyOn(nftContractService, 'getTokenUri').mockReturnValueOnce({
      success: true,
      tokenUri:
        'https://api.opensea.io/api/v1/metadata/0x495f947276749Ce646f68AC8c248420045cb7b5e/0x{id}',
    } as any);
    jest
      .spyOn(nftTokensService, 'updateOne')
      .mockImplementationOnce((tokenDto) => {
        isSaved = !!tokenDto.metadata;
        return Promise.resolve();
      });
    await service.FetchNFTMetadata(contractAddress, contractType, tokenId);
    expect(isSaved).toBe(true);
  });
  it('should get token metadata successfully when nft is ERC1155 and metadata is stored on ipfs', async () => {
    const contractAddress = '0xd07dc4262BCDbf85190C01c996b4C06a461d2430';
    const contractType = 'ERC1155';
    const tokenId = '731864';
    let isSaved = false;
    const tokenDto: NFTTokensDTO = {
      contractAddress,
      tokenId,
    };
    jest.spyOn(nftContractService, 'getTokenUri').mockReturnValueOnce({
      success: true,
      tokenUri: 'ipfs://ipfs/QmcKm9k7FB7WEwcBFQXr41tkdh3owQkwcXL8u9P67WnsQu',
    } as any);
    jest
      .spyOn(nftTokensService, 'updateOne')
      .mockImplementationOnce((tokenDto) => {
        isSaved = !!tokenDto.metadata;
        return Promise.resolve();
      });
    await service.FetchNFTMetadata(contractAddress, contractType, tokenId);
    expect(isSaved).toBe(true);
  });
});
