import { ethers } from 'ethers';
import { ERC721_ABI } from '../nft-contract/contract';
import { EtherscanService } from '../etherscan/etherscan.service';
import { IMetadataHandler } from './interface/metadata-handler';
import { buildAbiReadFunction, buildAbiFunctionInput, buildAbiFunctionOutput } from '../../utils/ethereum';

const IPFS_BASE_URL = 'ipfs://ipfs',
  REGISTRY_CONTRACT_ADDR = '0x185c8078285A3dE3EC9a2C203AD12853F03c462D',
  TOKEN_ABI = [
    // Function to get Hashmask's name based on its token ID
    buildAbiReadFunction(
      'tokenNameByIndex',
      [buildAbiFunctionInput('index', 'uint256')],
      [buildAbiFunctionOutput('name', 'string')]
    )
  ];

// Hashmask attributes via registry contract
type RegistryAttributes = {
    character: string,
    eyeColor: string,
    item: string,
    mask: string,
    skinColor: string,
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
  contractAddress: string,
  etherscanService: EtherscanService
) => {
  
  const getAbiResult: any = await etherscanService.getContractAbi(REGISTRY_CONTRACT_ADDR),
    metadata: {
      name?: string,
      image?: string,
      attributes?: any[]
    } = {};

  if(!getAbiResult.success) {
    console.error(`Failed to load Hashmasks registry contract ABI: ${getAbiResult.message}`);
    return { success: false, error: getAbiResult.message };
  }

  // Look up data from registry first - image hash and attributes
  try {
    const registryContract = new ethers.Contract(REGISTRY_CONTRACT_ADDR, getAbiResult.abi, provider);
  
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

    metadata.name = tokenContract.tokenNameByIndex(tokenId);

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
