import { ethers } from 'ethers';
import { EthereumNetworkType } from '../../ethereum/interface';
import { HashmasksMetadataHandler } from '../hashmasks';

describe('Hashmasks Metadata', () => {
  it('should get metadata successfully', async () => {

    const tokenAddr = '0xC2C747E0F7004F9E8817Db2ca4997657a7746928',
      tokenId = '6890',
      expectedImageUri = 'ipfs://ipfs/Qme55fLRNq2mKcjkvfp8SP9EitWqVa7Do3P8HmuykN1mJ7',
      expectedMetadata = {
        character: 'Male',
        mask: 'Doodle',
        eyeColor: 'Dark',
        skinColor: 'Light',
        item: 'No Item',
        /* These attributes are not available on chain
        background: 'Doodle',
        glyph: 'Greek Symbol'
        */
      },
      provider = new ethers.providers.InfuraProvider(
        EthereumNetworkType['mainnet'],
        process.env.INFURA_PROJECT_ID,
      );

    const res = await HashmasksMetadataHandler(tokenId, provider, tokenAddr),
      metadata = res.metadata;

    // Would be nice to test hashmask's name but they (can) change
    expect(metadata.image).toBe(expectedImageUri);
    Object.keys(expectedMetadata).forEach(item => {
      expect(metadata.attributes[item]).toBe(expectedMetadata[item]);
    });
  });
});
