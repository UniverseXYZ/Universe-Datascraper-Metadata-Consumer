import { CryptoKittiesMetaDataHandler } from './cryptokitties';
import { CryptopunksMetadataHandler } from './cryptopunks';
import { DecentralandMetaDataHandler } from './decentraland';
import { FlufScenesMetaDataHandler } from './flufScenes';
import { IMetadataHandler } from './interface/metadata-handler';
import { OpenseaSharedMetaDataHandler } from './openseaSharedStorefront';

interface IRule {
  contractAddress: string;
  metadataHandler: IMetadataHandler;
}

export const Rules: IRule[] = [
  {
    contractAddress: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
    metadataHandler: DecentralandMetaDataHandler,
  },
  {
    contractAddress: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
    metadataHandler: CryptoKittiesMetaDataHandler,
  },
  {
    contractAddress: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
    metadataHandler: CryptopunksMetadataHandler,
  },
  {
    contractAddress: '0x495f947276749Ce646f68AC8c248420045cb7b5e',
    metadataHandler: OpenseaSharedMetaDataHandler,
  },
  {
    contractAddress: '0x495f947276749Ce646f68AC8c248420045cb7b5e',
    metadataHandler: OpenseaSharedMetaDataHandler,
  },
  {
    contractAddress: '0x6faD73936527D2a82AEA5384D252462941B44042',
    metadataHandler: FlufScenesMetaDataHandler,
  },
];
