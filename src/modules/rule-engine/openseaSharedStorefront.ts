import { BigNumber } from 'ethers';
import { fetchMetadataFromTokenUri } from 'src/utils/api';
import { IMetadataHandler } from './interface/metadata-handler';

const baseURL = 'https://api.opensea.io/api/v1/metadata';
const contractAddress = '0x495f947276749Ce646f68AC8c248420045cb7b5e';
export const OpenseaSharedMetaDataHandler: IMetadataHandler = async (
  tokenId: string,
) => {
  const hexTokenId = BigNumber.from(tokenId).toHexString();
  const url = `${baseURL}/${contractAddress}/${hexTokenId}`;
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
