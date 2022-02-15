import { DecentralandMetaDataHandler } from '../decentraland';

describe('Decentraland Metadata', () => {
  it('should get metadata successfully', async () => {
    const tokenId = '9527906273786276976974489008089509920694';
    const expected_x = 27;
    const expected_y = -74;

    const res = await DecentralandMetaDataHandler(tokenId);
    const attributes = res.metadata.attributes;
    const x = attributes.find((attr) => attr.trait_type === 'X');
    const y = attributes.find((attr) => attr.trait_type === 'Y');
    expect(x.value).toBe(expected_x);
    expect(y.value).toBe(expected_y);
  });
});
