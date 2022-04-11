import { ethers } from 'ethers';
import { ERC721_ABI } from '../nft-contract/contract';
import { EtherscanService } from '../etherscan/etherscan.service';
import { IMetadataHandler } from './interface/metadata-handler';
import { buildAbi, buildAbiReadFunction } from '../../utils/ethereum';

const IPFS_BASE_URL = 'ipfs://ipfs',
  REGISTRY_CONTRACT_ADDR = '0x185c8078285a3de3ec9a2c203ad12853f03c462d';

const REGISTRY_ABI = buildAbi(
  // Function to look up IPFS image hash based on tokenId
  buildAbiReadFunction('getIPFSHashOfMaskId',{maskId: 'uint256'}, {ipfsHash: 'string'}),
  // Function to get hashmask traits
  buildAbiReadFunction('getTraitsOfMaskId', {maskId: 'uint256'}, [
      // These must be listed in order they're returned
      {character: 'string'},
      {eyeColor: 'string'},
      {item: 'string'},
      {mask: 'string'},
      {skinColor: 'string'}
    ]
  )  
);

const TOKEN_ABI = buildAbi(
  // Function to get Hashmask's name based on its token ID
  buildAbiReadFunction('tokenNameByIndex', {index: 'uint256'}, {name: 'string'})
);

// Hashmask attributes via registry contract
type RegistryAttributes = {
    character: string,
    mask: string,
    eyeColor: string,
    skinColor: string,
    item: string,
}

/**
 * Generate an IPFS URL for a given hash
 */
const getImageUrlForHash = (imageHash: string): string => {
  return `${IPFS_BASE_URL}/${imageHash}`;
}

export const HashmasksMetadataHandler: IMetadataHandler = async (
  tokenId: string,
  provider: ethers.providers.BaseProvider,
  contractAddress: string
) => {

  const metadata: any = {};

  // Look up data from registry first - image hash and attributes
  try {
    const registryContract = new ethers.Contract(REGISTRY_CONTRACT_ADDR, REGISTRY_ABI, provider);
  
    const attributes: RegistryAttributes = await registryContract.getTraitsOfMaskId(tokenId),
      imageHash = await registryContract.getIPFSHashOfMaskId(tokenId);

    Object.assign(metadata, {
      attributes,
      image: getImageUrlForHash(imageHash)
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
