import { ethers } from 'ethers';
import { EthereumNetworkType } from '../../ethereum/interface';
import { CryptofootballMetadataHandler } from '../crptofootball';
describe('Cryptofootball Metadata', () => {
  it('should get metadata successfully', async () => {
    const ethersProvider = new ethers.providers.InfuraProvider(
      EthereumNetworkType['mainnet'],
      process.env.INFURA_PROJECT_ID,
    );
    const tokenId = '1';
    const contractAddress = '0x6e1b98153399d5E4e710c1A0b803c74d3d7F2957';
    const expected_name = 'Team #1';

    const res = await CryptofootballMetadataHandler(
      tokenId,
      ethersProvider,
      contractAddress,
    );
    console.log(res);
    const name = res.metadata.name;
    expect(expected_name).toBe(name);
  });
});
