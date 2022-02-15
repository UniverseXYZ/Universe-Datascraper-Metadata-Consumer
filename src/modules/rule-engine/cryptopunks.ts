import { ethers } from 'ethers';
import { IMetadataHandler } from './interface/metadata-handler';
const CRYPTOPUNKS_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: 'index',
        type: 'uint16',
      },
    ],
    name: 'punkAttributes',
    outputs: [
      {
        name: 'text',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'index',
        type: 'uint16',
      },
    ],
    name: 'punkImageSvg',
    outputs: [
      {
        name: 'svg',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as any;

const CRYPTOPUNKS_METADATA_ADDRESS =
  '0x16F5A35647D6F03D5D3da7b35409D65ba03aF3B2';
export const CryptopunksMetadataHandler: IMetadataHandler = async (
  tokenId: string,
  provider: ethers.providers.BaseProvider,
) => {
  const contract = new ethers.Contract(
    CRYPTOPUNKS_METADATA_ADDRESS,
    CRYPTOPUNKS_ABI,
    provider,
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
