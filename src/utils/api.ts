import axios from 'axios';

export const fetchMetadataFromTokenUri = async (tokenUri: string) => {
  let metadata;
  try {
    const response = await axios.get(tokenUri);
    metadata = response.data;
  } catch (err) {
    console.error('Fetch metadata from token uri failed', JSON.stringify(err));
    return {
      success: false,
      error: err?.message ?? 'Fetch metadata from token uri failed',
    };
  }

  return { success: true, metadata };
};
