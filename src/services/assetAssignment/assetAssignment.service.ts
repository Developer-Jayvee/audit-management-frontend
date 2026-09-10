import httpClient from '@/lib/axios';
import type { DefaultResponse } from '@/common/types/common';
import type { Asset } from '@/services/assets/types';
import type { AssignAssetPayload } from './types';

/**
 * Assigns an asset to a store. The backend derives the asset's `client_id`
 * from that store's own `client_id`, so it can't drift from the store it's
 * assigned to (same pattern as Branch's client_id derivation in Phase 2.3).
 *
 * @param id - {Asset['id']} The asset being assigned.
 * @param payload - {AssignAssetPayload} The store to assign it to.
 * @returns {Promise<Asset>} The asset, updated with its new store/client.
 */
export const assignAsset = async (id: Asset['id'], payload: AssignAssetPayload): Promise<Asset> => {
  const response = await httpClient.patch<DefaultResponse<Asset>>(`assets/${id}/assign`, payload);
  return response.data.data;
};
