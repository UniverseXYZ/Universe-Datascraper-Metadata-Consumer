import { HashmasksMetadataHandler } from '../hashmasks';

describe('Hashmasks Metadata', () => {
  it('should get metadata successfully', async () => {
    const tokenId = '6';
    const expectedCharacter = 'Golden Robot'
    const expectedImageUri = 'ipfs://ipfs/QmfHy9m96YzWu95J4hSGdvUDepALCqboescddDYAcZxqqG';

    const res = await HashmasksMetadataHandler(tokenId);
    const attributes = res.metadata.attributes;
    
    expect(attributes.character).toBe(expectedCharacter);
    expect(res.metadata.image).toBe(expectedImageUri);
  });
});
