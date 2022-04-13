import { ethers } from 'ethers';
import { ERC721_ABI } from '../nft-contract/contract';
import { IMetadataHandler } from './interface/metadata-handler';
import { buildAbi, buildAbiReadFunction } from '../../utils/ethereum';
import { getArweaveMapping, HashmaskArweaveMapping } from './interface/hashmasks-arweave-mapping';

const ARWEAVE_BASE_URL = process.env.ARWEAVE_BASE_URL,
  REGISTRY_CONTRACT_ADDR = '0x185c8078285A3dE3EC9a2C203AD12853F03c462D';

const REGISTRY_ABI = buildAbi(
  // Function to get hashmask traits
  buildAbiReadFunction('getTraitsOfMaskId', {maskId: 'uint256'}, [
      // These must be listed in order they're returned
      {character: 'string'},
      {mask: 'string'},
      {eyeColor: 'string'},
      {skinColor: 'string'},
      {item: 'string'}
    ]
  )  
);

const TOKEN_ABI = buildAbi(
  // Function to get Hashmask's name based on its token ID
  buildAbiReadFunction('tokenNameByIndex', {index: 'uint256'}, {name: 'string'})
);

// Hashmask attributes available via registry contract
type RegistryAttributes = {
    character: string,
    mask: string,
    eyeColor: string,
    skinColor: string,
    item: string,
}

/**
 * Generate an Arweave URL for a given tokenId
 */
const getImageUrlForTokenId = (tokenId: string): string => {
  const mapping: HashmaskArweaveMapping = getArweaveMapping(parseInt(tokenId));
  return `${ARWEAVE_BASE_URL}/${mapping.arweave}`;
}

export const HashmasksMetadataHandler: IMetadataHandler = async (
  tokenId: string,
  provider: ethers.providers.BaseProvider,
  contractAddress: string
) => {

  const metadata: any = {};

  // Get image URL
  metadata.image = getImageUrlForTokenId(tokenId);
  
  // Look up attributes
  try {
    const registryContract = new ethers.Contract(REGISTRY_CONTRACT_ADDR, REGISTRY_ABI, provider);
  
    const attributes: RegistryAttributes = await registryContract.getTraitsOfMaskId(tokenId),
      attributesFormatted = Object.keys(attributes).map(trait => ({
        trait_type: trait,
        value: attributes[trait]
      }));

    Object.assign(metadata, {
      attributes: attributesFormatted      
    });
  } catch (error) {
    console.error(
      'Fetch metadata from Hashmasks Registry contract failed',
      JSON.stringify(error),
    );
    return {
      success: false,
      error:
        error?.message ??
        `Fetch Hashmasks metadata from Registry contract (${REGISTRY_CONTRACT_ADDR}) failed`,
    };
  }

  // Look up name from token contract itself
  try {
    const tokenContract = new ethers.Contract(contractAddress, TOKEN_ABI, provider);

    metadata.name = await tokenContract.tokenNameByIndex(tokenId);

    return { success: true, metadata };
  } catch (error) {
    console.error(
      'Fetch metadata from Hashmasks token failed',
      JSON.stringify(error),
    );
    return {
      success: false,
      error:
        error?.message ??
        `Fetch Hashmasks metadata from tokenNameByIndex (contract is ${contractAddress}) failed`,
    };
  }
};
