import httpClient from '@/lib/axios';
import type { DefaultResponse, PaginatedResponse } from '@/common/types/common';
import type { CreateStorePayload, Store, UpdateStorePayload } from './types';

const storesURL = 'stores';

/**
 * Fetches one page of stores for the admin's Client Management oversight
 * view (every client's stores, not scoped to one organization).
 *
 * @param page - {number} The 1-indexed page to fetch. Defaults to 1.
 * @param perPage - {number} Page size. Defaults to 10 (the list view); pass a larger value to source picker options elsewhere.
 * @returns {Promise<PaginatedResponse<Store>>} The requested page, plus total/last_page for pagination controls.
 */
export const getStores = async (page = 1, perPage = 10): Promise<PaginatedResponse<Store>> => {
  const response = await httpClient.get<PaginatedResponse<Store>>(storesURL, {
    params: { page, per_page: perPage },
  });
  return response.data;
};

/**
 * Creates a new store under a client.
 *
 * @param payload - {CreateStorePayload} The store's owning client, optional branch, and profile.
 * @returns {Promise<Store>} The created store.
 */
export const createStore = async (payload: CreateStorePayload): Promise<Store> => {
  const response = await httpClient.post<DefaultResponse<Store>>(storesURL, payload);
  return response.data.data;
};

/**
 * Updates an existing store. Accepts a partial payload, so a single-field
 * change (e.g. deactivating a store) doesn't require resending the whole
 * record.
 *
 * @param id - {Store['id']} The store being updated.
 * @param payload - {UpdateStorePayload} The fields to change.
 * @returns {Promise<Store>} The updated store.
 */
export const updateStore = async (id: Store['id'], payload: UpdateStorePayload): Promise<Store> => {
  const response = await httpClient.put<DefaultResponse<Store>>(`${storesURL}/${id}`, payload);
  return response.data.data;
};

/**
 * Deactivates or reactivates a store by toggling `is_active`, without
 * deleting it.
 *
 * @param id - {Store['id']} The store to toggle.
 * @param isActive - {boolean} `false` to deactivate, `true` to reactivate.
 * @returns {Promise<Store>} The updated store.
 */
export const setStoreActive = async (id: Store['id'], isActive: boolean): Promise<Store> => {
  return updateStore(id, { is_active: isActive });
};
