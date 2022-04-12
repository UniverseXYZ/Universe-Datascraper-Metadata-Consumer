import { buildAbi, buildAbiReadFunction } from '../../utils/ethereum';

export const ERC721_ABI = buildAbi(
  buildAbiReadFunction(
    'tokenURI',
    {tokenId: 'uint256'},
    {uri: 'string'}
  )
) as any;

const ERC1155_ABI = buildAbi(
  buildAbiReadFunction(
    'uri',
    {id: 'uint256'},
    {uri: 'string'}
  )
) as any;

export type ContractType = 'ERC721' | 'ERC1155' | 'CryptoPunks';

export const getContractAbi = (type: ContractType) => {
  switch (type) {
    case 'ERC721':
      return ERC721_ABI;
    case 'ERC1155':
      return ERC1155_ABI;
  }
};
