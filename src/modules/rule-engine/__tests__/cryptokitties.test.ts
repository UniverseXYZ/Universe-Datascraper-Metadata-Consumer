import { CryptoKittiesMetaDataHandler } from '../cryptokitties';

describe('Cryptokitties Metadata', () => {
  it('should get metadata successfully', async () => {
    const tokenId = '229795';
    const expected_base_color = 'aquamarine';
    const expected_cooldown = 'Brisk (1 hr)';

    const res = await CryptoKittiesMetaDataHandler(tokenId);
    const attributes = res.metadata.attributes;
    const base_color = attributes.find(
      (attr) => attr.trait_type === 'base colour',
    );
    const cooldown = attributes.find((attr) => attr.trait_type === 'cooldown');
    expect(base_color.value).toBe(expected_base_color);
    expect(cooldown.value).toBe(expected_cooldown);
  });
});
