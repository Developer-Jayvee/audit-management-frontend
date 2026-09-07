import httpClient from '@/lib/axios';
import type { Asset } from './types';

const assetsURL = 'assets';

export const getAssets = async (): Promise<Asset[]> => {
  const response = await httpClient.get<Asset[]>(assetsURL);
  return response.data;
};
