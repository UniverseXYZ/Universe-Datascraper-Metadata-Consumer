import { ethers } from 'ethers';
import { ERC721_ABI } from '../nft-contract/contract';
import { IMetadataHandler } from './interface/metadata-handler';

export const CryptofootballMetadataHandler: IMetadataHandler = async (
  tokenId: string,
  provider: ethers.providers.BaseProvider,
  contractAddress: string,
) => {
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
  try {
    const metadataFromChain = await contract.tokenURI(Number(tokenId));
    const formatedMetadata = metadataFromChain.replace(
      'data:application/json;base64,',
      '',
    );
    const decodedMetadata = Buffer.from(formatedMetadata, 'base64').toString();
    const metadata = JSON.parse(decodedMetadata);
    return { success: true, metadata };
  } catch (error) {
    console.error(
      'Fetch metadata from Cryptofootball token failed',
      JSON.stringify(error),
    );
    return {
      success: false,
      error:
        error?.message ??
        `Fetch cryptofootball metadata from tokenURI (contract is ${contractAddress}) failed`,
    };
  }
};
