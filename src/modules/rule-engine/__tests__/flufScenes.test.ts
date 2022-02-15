import { FlufScenesMetaDataHandler } from '../flufScenes';

describe('Fluf Scences and Sounds Metadata', () => {
  it('should get metadata successfully', async () => {
    const tokenId = '49';
    const expected_artist = 'Dude Skywalker';

    const res = await FlufScenesMetaDataHandler(tokenId);
    const attributes = res.metadata.attributes;
    const artist = attributes.find((attr) => attr.trait_type === 'Artist');
    expect(artist.value).toBe(expected_artist);
  });
});
