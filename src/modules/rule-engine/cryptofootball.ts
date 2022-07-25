import { ethers } from 'ethers';
import { EthereumService } from '../ethereum/ethereum.service';
import { ERC721_ABI } from '../nft-contract/contract';
import { IMetadataHandler } from './interface/metadata-handler';

export const CryptofootballMetadataHandler: IMetadataHandler = async (
  tokenId: string,
  ethereumService: EthereumService,
  contractAddress: string,
) => {
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, ethereumService.ether);
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
    if (error?.error?.reason === 'timeout' || error?.error?.code === 429 || error?.error?.status === 403 || error?.error?.code === 'TIMEOUT') {
      return ethereumService.connectToProvider(() => CryptofootballMetadataHandler(contractAddress, ethereumService, tokenId));
    }
    return {
      success: false,
      error:
        error?.message ??
        `Fetch cryptofootball metadata from tokenURI (contract is ${contractAddress}) failed`,
    };
  }
};
