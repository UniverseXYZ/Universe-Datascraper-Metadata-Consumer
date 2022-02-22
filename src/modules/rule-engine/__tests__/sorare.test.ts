import { SorareMetaDataHandler } from '../sorare';

describe('Sorare Metadata', () => {
  it('should get metadata successfully', async () => {
    const tokenId =
      '39540738401325031036609838612626135829191485180381404294613584492750798191582';

    const res = await SorareMetaDataHandler(tokenId);
    const expected_name = 'A.J. DeLaGarza 2021-22 • Rare 15/100';
    const name = res.metadata.name;

    expect(name).toBe(expected_name);
  });
});
