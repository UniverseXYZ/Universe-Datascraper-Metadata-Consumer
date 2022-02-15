import { fetchMetadataFromTokenUri } from 'src/utils/api';
import { IMetadataHandler } from './interface/metadata-handler';

const decentralandBaseURL = 'https://api.decentraland.org/v2';
const contractAddress = '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d';
export const DecentralandMetaDataHandler: IMetadataHandler = async (
  tokenId: string,
) => {
  const url = `${decentralandBaseURL}/contracts/${contractAddress}/tokens/${tokenId}`;
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
