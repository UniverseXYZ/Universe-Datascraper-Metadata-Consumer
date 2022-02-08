export default () => ({
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  port: process.env.APP_PORT,
  app_env: process.env.APP_ENV,
  ethereum_network: process.env.ETHEREUM_NETWORK,
  infura: {
    project_id: process.env.INFURA_PROJECT_ID,
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    queueUrl: process.env.AWS_QUEUE_URL,
  },
  etherscan_api_key: process.env.ETHERSCAN_API_KEY,
  ipfs_gateway: process.env.IPFS_GATEWAY,
  opensea_erc_1155_api: process.env.SPECIAL_CASES_OPEN_SEA_1155_URI,
});
