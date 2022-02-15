import { fetchMetadataFromTokenUri } from 'src/utils/api';
import { IMetadataHandler } from './interface/metadata-handler';

const baseURL = 'https://erc1155-api.fluf.world/api/token';
export const FlufScenesMetaDataHandler: IMetadataHandler = async (
  tokenId: string,
) => {
  const url = `${baseURL}/${tokenId}`;
  const metadataRes = await fetchMetadataFromTokenUri(url);
  if (!metadataRes.success) {
    return metadataRes;
  }

  return {
    success: true,
    metadata: metadataRes.metadata,
    externalDomainViewUrl: url,
  };
};
