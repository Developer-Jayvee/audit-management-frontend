import httpClient from '@/lib/axios';
import type { DefaultResponse, PaginatedResponse } from '@/common/types/common';
import type { Branch, CreateBranchPayload, UpdateBranchPayload } from './types';

const branchesURL = 'branches';

/**
 * Fetches one page of branches for the admin's Client Management oversight
 * view.
 *
 * @param page - {number} The 1-indexed page to fetch. Defaults to 1.
 * @param perPage - {number} Page size. Defaults to 10 (the list view); pass a larger value to source picker options elsewhere.
 * @returns {Promise<PaginatedResponse<Branch>>} The requested page, plus total/last_page for pagination controls.
 */
export const getBranches = async (page = 1, perPage = 10): Promise<PaginatedResponse<Branch>> => {
  const response = await httpClient.get<PaginatedResponse<Branch>>(branchesURL, {
    params: { page, per_page: perPage },
  });
  return response.data;
};

/**
 * Creates a new branch under a store.
 *
 * @param payload - {CreateBranchPayload} The branch's owning store/client and address.
 * @returns {Promise<Branch>} The created branch.
 */
export const createBranch = async (payload: CreateBranchPayload): Promise<Branch> => {
  const response = await httpClient.post<DefaultResponse<Branch>>(branchesURL, payload);
  return response.data.data;
};

/**
 * Updates an existing branch. Accepts a partial payload, so a single-field
 * change (e.g. deactivating a branch) doesn't require resending the whole
 * record.
 *
 * @param id - {Branch['id']} The branch being updated.
 * @param payload - {UpdateBranchPayload} The fields to change.
 * @returns {Promise<Branch>} The updated branch.
 */
export const updateBranch = async (id: Branch['id'], payload: UpdateBranchPayload): Promise<Branch> => {
  const response = await httpClient.put<DefaultResponse<Branch>>(`${branchesURL}/${id}`, payload);
  return response.data.data;
};

/**
 * Deactivates or reactivates a branch by toggling `is_active`, without
 * deleting it.
 *
 * @param id - {Branch['id']} The branch to toggle.
 * @param isActive - {boolean} `false` to deactivate, `true` to reactivate.
 * @returns {Promise<Branch>} The updated branch.
 */
export const setBranchActive = async (id: Branch['id'], isActive: boolean): Promise<Branch> => {
  return updateBranch(id, { is_active: isActive });
};
