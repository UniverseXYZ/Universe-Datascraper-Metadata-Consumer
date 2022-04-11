import { ethers } from 'ethers';
import { EthereumNetworkType } from '../../ethereum/interface';
import { HashmasksMetadataHandler } from '../hashmasks';

describe('Hashmasks Metadata', () => {
  it('should get metadata successfully', async () => {

    const tokenAddr = '0xc2c747e0f7004f9e8817db2ca4997657a7746928',
      tokenId = '6',
      expectedCharacter = 'Golden Robot',
      expectedImageUri = 'ipfs://ipfs/QmfHy9m96YzWu95J4hSGdvUDepALCqboescddDYAcZxqqG',
      provider = new ethers.providers.InfuraProvider(
        EthereumNetworkType['mainnet'],
        process.env.INFURA_PROJECT_ID,
      );

    const res = await HashmasksMetadataHandler(tokenId, provider, tokenAddr),
      metadata = res.metadata;

    // Would be nice to test hashmask's name but they can change
    expect(metadata.attributes.character).toBe(expectedCharacter);
    expect(metadata.image).toBe(expectedImageUri);
  });
});
