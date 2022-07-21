import { ethers } from 'ethers';
import { IMetadataHandler } from './interface/metadata-handler';
import { buildAbi, buildAbiReadFunction } from '../../utils/ethereum';
import { EthereumService } from '../ethereum/ethereum.service';

const CRYPTOPUNKS_ABI = buildAbi(
  buildAbiReadFunction(
    'punkAttributes',
    {index: 'uint16'},
    {text: 'string'}
  ),
  buildAbiReadFunction(
    'punkImageSvg',
    {index: 'uint16'},
    {svg: 'string'}
  )
) as any;

const CRYPTOPUNKS_METADATA_ADDRESS =
  '0x16F5A35647D6F03D5D3da7b35409D65ba03aF3B2';
export const CryptopunksMetadataHandler: IMetadataHandler = async (
  tokenId: string,
  ethereumService: EthereumService,
) => {
  const contract = new ethers.Contract(
    CRYPTOPUNKS_METADATA_ADDRESS,
    CRYPTOPUNKS_ABI,
    ethereumService.ether,
  );
  try {
    const metadataFromChain = await contract.punkAttributes(Number(tokenId));
    const values = metadataFromChain.split(',');
    const attributes = values.map((value) => {
      return {
        trait_type: getTypeByValue(value),
        value,
      };
    });
    const metadata = {
      name: 'Cryptopunks',
      attributes,
    };
    return { success: true, metadata };
  } catch (error) {
    console.error(
      'Fetch metadata from Cryptopunks token failed',
      JSON.stringify(error),
    );
    if (error?.error?.reason === 'timeout' || error?.error?.code === 429) {
      return ethereumService.connectToProvider(() => CryptopunksMetadataHandler(tokenId, ethereumService));
    }

    return {
      success: false,
      error:
        error?.message ??
        `Fetch cryptopunk metadata from punkAttributes (contract is ${CRYPTOPUNKS_METADATA_ADDRESS}) failed`,
    };
  }
};

const getTypeByValue = (value: string) => {
  if (value.includes('Female') || value.includes('Male')) {
    return 'gender';
  }
  return 'accessory';
};
