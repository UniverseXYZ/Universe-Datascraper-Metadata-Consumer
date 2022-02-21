import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RuleEngineService } from './rule-engine.service';
import configuration from '../configuration';
import { NFTContractService } from '../nft-contract/nft-contract.service';
import { NFTTokensService } from '../nft-tokens/nft-tokens.service';
import { EthereumService } from '../ethereum/ethereum.service';
import { NFTTokensDTO } from '../nft-tokens/dto/nft-tokens.dto';

describe('Rule Engine Test', () => {
  let service: RuleEngineService;
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
        RuleEngineService,
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

    service = module.get<RuleEngineService>(RuleEngineService);
    nftContractService = module.get<NFTContractService>(NFTContractService);
    nftTokensService = module.get<NFTTokensService>(NFTTokensService);
  });

  it('Invalidated - should save fetch error when contract is invalid', async () => {
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

  it('Invalidated - should save fetch error when fetching metadata failed', async () => {
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

  it('Standard NFT - should get token metadata successfully', async () => {
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
  it('Opensea Shared Storefront - should get token metadata successfully when nft is ERC1155', async () => {
    const contractAddress = '0x495f947276749Ce646f68AC8c248420045cb7b5e';
    const contractType = 'ERC1155';
    const tokenId =
      '102676433867259323931171365895354757783778570312312576485042789456911181807617';
    let isSaved = false;
    const tokenDto: NFTTokensDTO = {
      contractAddress,
      tokenId,
    };
    jest
      .spyOn(nftTokensService, 'updateOne')
      .mockImplementationOnce((tokenDto) => {
        isSaved = !!tokenDto.metadata;
        return Promise.resolve();
      });
    await service.FetchNFTMetadata(contractAddress, contractType, tokenId);
    expect(isSaved).toBe(true);
  });
  it('Cryptokitties - should get token metadata successfully', async () => {
    const contractAddress = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d';
    const contractType = 'ERC721';
    const tokenId = '229795';
    let isSaved = false;
    const tokenDto: NFTTokensDTO = {
      contractAddress,
      tokenId,
    };
    jest
      .spyOn(nftTokensService, 'updateOne')
      .mockImplementationOnce((tokenDto) => {
        isSaved = !!tokenDto.metadata;
        return Promise.resolve();
      });
    await service.FetchNFTMetadata(contractAddress, contractType, tokenId);
    expect(isSaved).toBe(true);
  });
  it('Cryptopunks - should get token metadata successfully', async () => {
    const contractAddress = '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB';
    const contractType = 'CryptoPunks';
    const tokenId = '3102';
    let isSaved = false;
    const tokenDto: NFTTokensDTO = {
      contractAddress,
      tokenId,
    };
    jest
      .spyOn(nftTokensService, 'updateOne')
      .mockImplementationOnce((tokenDto) => {
        isSaved = !!tokenDto.metadata;
        return Promise.resolve();
      });
    await service.FetchNFTMetadata(contractAddress, contractType, tokenId);
    expect(isSaved).toBe(true);
  });

  it('Decentraland - should get token metadata successfully', async () => {
    const contractAddress = '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643';
    const contractType = 'ERC721';
    const tokenId = '9527906273786276976974489008089509920694';
    let isSaved = false;
    const tokenDto: NFTTokensDTO = {
      contractAddress,
      tokenId,
    };
    jest
      .spyOn(nftTokensService, 'updateOne')
      .mockImplementationOnce((tokenDto) => {
        isSaved = !!tokenDto.metadata;
        return Promise.resolve();
      });
    await service.FetchNFTMetadata(contractAddress, contractType, tokenId);
    expect(isSaved).toBe(true);
  });

  it('Standard with IPFS - should get token metadata successfully when nft is ERC1155 and metadata is stored on ipfs', async () => {
    const contractAddress = '0xd07dc4262BCDbf85190C01c996b4C06a461d2430';
    const contractType = 'ERC1155';
    const tokenId = '731864';
    let isSaved = false;

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

  it('Special URI - should get token metadata successfully', async () => {
    const contractAddress = '0x2E734269c869BDa3Ea6550F510d2514f2D66dE71';
    const contractType = 'ERC1155';
    const tokenId = '1';
    let isSaved = false;

    jest.spyOn(nftContractService, 'getTokenUri').mockReturnValueOnce({
      success: true,
      tokenUri: 'https://meta.strongblock.com/json/{id}.json',
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

  it('Special URI (Fluf scenes) - should get token metadata successfully', async () => {
    const contractAddress = '0x6faD73936527D2a82AEA5384D252462941B44042';
    const contractType = 'ERC1155';
    const tokenId = '1';
    let isSaved = false;

    jest.spyOn(nftContractService, 'getTokenUri').mockReturnValueOnce({
      success: true,
      tokenUri: 'https://erc1155-api.fluf.world/api/token/{id}',
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

  it('Cryptofootball - should get token metadata successfully', async () => {
    const contractAddress = '0x6e1b98153399d5E4e710c1A0b803c74d3d7F2957';
    const contractType = 'ERC721';
    const tokenId = '1';
    let isSaved = false;

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
