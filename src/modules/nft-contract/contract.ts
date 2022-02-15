const ERC721_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as any;

const ERC1155_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'uri',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as any;
export type ContractType = 'ERC721' | 'ERC1155' | 'CryptoPunks';
export const getContractAbi = (type: ContractType) => {
  switch (type) {
    case 'ERC721':
      return ERC721_ABI;
    case 'ERC1155':
      return ERC1155_ABI;
  }
};
