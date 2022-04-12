import { ethers } from 'ethers';
import { EthereumNetworkType } from '../../ethereum/interface';
import { HashmasksMetadataHandler } from '../hashmasks';

describe('Hashmasks Metadata', () => {
  it('should get metadata successfully', async () => {

    const tokenAddr = '0xC2C747E0F7004F9E8817Db2ca4997657a7746928',
      tokenId = '6890',
      expectedImageUri = 'ipfs://ipfs/Qme55fLRNq2mKcjkvfp8SP9EitWqVa7Do3P8HmuykN1mJ7',
      expectedMetadata = [
        { trait_type: 'character', value: 'Male' },
        { trait_type: 'mask', value: 'Doodle' },
        { trait_type: 'eyeColor', value: 'Dark' },
        { trait_type: 'skinColor', value: 'Light' },
        { trait_type: 'item', value: 'No Item' },
        /* These attributes are not available on chain
        { trait_type: 'background', value: 'Doodle' },
        { trait_type: 'glyph', value: 'Greek Symbol' }
        */
      ],
      provider = new ethers.providers.InfuraProvider(
        EthereumNetworkType['mainnet'],
        process.env.INFURA_PROJECT_ID,
      );

    const res = await HashmasksMetadataHandler(tokenId, provider, tokenAddr),
      metadata = res.metadata;

    // Would be nice to test hashmask's name but they (can) change
    expect(metadata.image).toBe(expectedImageUri);
    expectedMetadata.forEach(expectedTrait => {
      const trait = metadata.attributes.find(trait => trait.trait_type === expectedTrait.trait_type);
      expect(trait).toEqual(expectedTrait);
    });
  });
});
