import { fetchMetadataFromTokenUri } from 'src/utils/api';
import { IMetadataHandler } from './interface/metadata-handler';

const cryptoKittiesBaseURL = 'https://api.cryptokitties.co/v3';
export const CryptoKittiesMetaDataHandler: IMetadataHandler = async (
  tokenId: string,
) => {
  const url = `${cryptoKittiesBaseURL}/kitties/${tokenId}`;
  const metadataRes = await fetchMetadataFromTokenUri(url);
  if (!metadataRes.success) {
    return metadataRes;
  }

  const enhanced_attributes = metadataRes.metadata.enhanced_cattributes.map(
    (attr) => {
      return {
        trait_type: attributeTypes(attr.type),
        value: attr.description,
      };
    },
  );

  const metadata = {
    image: metadataRes.metadata.image_url_png,
    name: metadataRes.metadata.name,
    description: metadataRes.metadata.bio,
    attributes: [
      ...enhanced_attributes,
      {
        trait_type: 'cooldown',
        value: cooldownAttribute(metadataRes.metadata.status.cooldown_index),
      },
    ],
  };

  return { success: true, metadata, externalDomainViewUrl: url };
};

const attributeTypes = (type: string) => {
  switch (type) {
    case 'colorprimary':
      return 'base colour';
    case 'coloreyes':
      return 'eye colour';
    case 'colorsecondary':
      return 'accent colour';
    case 'colortertiary':
      return 'highlight colour';
    default:
      return type;
  }
};

const cooldownAttribute = (cooldown_index: number) => {
  switch (cooldown_index) {
    case 0:
      return 'Fast (1 min)';
    case 1:
      return 'Swift (2 min)';
    case 2:
      return 'Swift (5 min)';
    case 3:
      return 'Snappy (10 min)';
    case 4:
      return 'Snappy (30 min)';
    case 5:
      return 'Brisk (1 hr)';
    case 6:
      return 'Brisk (2 hr)';
    case 7:
      return 'Plodding (4 hr)';
    case 8:
      return 'Plodding (8 hr)';
    case 9:
      return 'Slow (16 hr)';
    case 10:
      return 'Slow (24 hr)';
    case 11:
      return 'Sluggish (2 days)';
    case 12:
      return 'Sluggish (4 days)';
    case 13:
      return 'Catatonic (1 week)';
  }
};
