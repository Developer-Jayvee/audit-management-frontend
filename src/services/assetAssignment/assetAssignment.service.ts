import httpClient from '@/lib/axios';
import type { AssetAssignment } from './types';

const assetAssignmentsURL = 'asset-assignments';

export const getAssetAssignments = async (): Promise<AssetAssignment[]> => {
  const response = await httpClient.get<AssetAssignment[]>(assetAssignmentsURL);
  return response.data;
};
