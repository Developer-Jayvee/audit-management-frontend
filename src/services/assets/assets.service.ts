import httpClient from '@/lib/axios';
import type { DefaultResponse, PaginatedResponse } from '@/common/types/common';
import type { Asset, CreateAssetPayload, UpdateAssetPayload } from './types';

const assetsURL = 'assets';

/**
 * Fetches one page of the per-store asset register for the admin's Asset
 * Management view.
 *
 * @param page - {number} The 1-indexed page to fetch. Defaults to 1.
 * @param perPage - {number} Page size. Defaults to 10 (the list view); pass a larger value to source picker options elsewhere.
 * @returns {Promise<PaginatedResponse<Asset>>} The requested page, plus total/last_page for pagination controls.
 */
export const getAssets = async (page = 1, perPage = 10): Promise<PaginatedResponse<Asset>> => {
  const response = await httpClient.get<PaginatedResponse<Asset>>(assetsURL, {
    params: { page, per_page: perPage },
  });
  return response.data;
};

/**
 * Registers a new asset. `client_id`/`store_id` are optional — an asset can
 * be registered unassigned and attached to a store later from Asset
 * Assignment.
 *
 * @param payload - {CreateAssetPayload} The asset's name and optional store/client.
 * @returns {Promise<Asset>} The created asset.
 */
export const createAsset = async (payload: CreateAssetPayload): Promise<Asset> => {
  const response = await httpClient.post<DefaultResponse<Asset>>(assetsURL, payload);
  return response.data.data;
};

/**
 * Updates an existing asset. Accepts a partial payload, so a single-field
 * change (e.g. deactivating an asset) doesn't require resending the whole
 * record.
 *
 * @param id - {Asset['id']} The asset being updated.
 * @param payload - {UpdateAssetPayload} The fields to change.
 * @returns {Promise<Asset>} The updated asset.
 */
export const updateAsset = async (id: Asset['id'], payload: UpdateAssetPayload): Promise<Asset> => {
  const response = await httpClient.put<DefaultResponse<Asset>>(`${assetsURL}/${id}`, payload);
  return response.data.data;
};

/**
 * Deactivates or reactivates (retires) an asset by toggling `is_active`,
 * without deleting it.
 *
 * @param id - {Asset['id']} The asset to toggle.
 * @param isActive - {boolean} `false` to deactivate, `true` to reactivate.
 * @returns {Promise<Asset>} The updated asset.
 */
export const setAssetActive = async (id: Asset['id'], isActive: boolean): Promise<Asset> => {
  return updateAsset(id, { is_active: isActive });
};
