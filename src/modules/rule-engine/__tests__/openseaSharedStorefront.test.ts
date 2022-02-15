import { OpenseaSharedMetaDataHandler } from '../openseaSharedStorefront';

describe('Opensea Shared Storefront Metadata', () => {
  it('should get metadata successfully', async () => {
    const tokenId =
      '102676433867259323931171365895354757783778570312312576485042790095727437545473';

    const res = await OpenseaSharedMetaDataHandler(tokenId);
    const expected_name = 'Satoshi #6039';
    const name = res.metadata.name;

    expect(name).toBe(expected_name);
  });
});
