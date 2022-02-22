import { fetchMetadataFromTokenUri } from 'src/utils/api';
import { IMetadataHandler } from './interface/metadata-handler';

const baseURL = 'https://api.sorare.com/api/v1/cards';
export const SorareMetaDataHandler: IMetadataHandler = async (
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
