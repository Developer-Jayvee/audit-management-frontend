import httpClient from '@/lib/axios';
import type { DefaultResponse, PaginatedResponse } from '@/common/types/common';
import type { CreateUserPayload, FieldEngineerUser, UpdateUserPayload, User } from './types';

const usersURL = 'users';

/**
 * Fetches one page of accounts (all four roles) for the admin User
 * Management list.
 *
 * @param page - {number} The 1-indexed page to fetch. Defaults to 1.
 * @returns {Promise<PaginatedResponse<User>>} The requested page, plus total/last_page for pagination controls.
 */
export const getUsers = async (page = 1): Promise<PaginatedResponse<User>> => {
  const response = await httpClient.get<PaginatedResponse<User>>(usersURL, { params: { page } });
  return response.data;
};

/**
 * Fetches one page of Field Engineer accounts — sources the picker options
 * for Field Audits → Assign (Phase 2.5). Each account includes its
 * `field_engineer_profile`, whose `id` (not the account's own `id`) is
 * what `assignFieldEngineer()` expects.
 *
 * @param page - {number} The 1-indexed page to fetch. Defaults to 1.
 * @param perPage - {number} Page size. Defaults to 10.
 * @returns {Promise<PaginatedResponse<FieldEngineerUser>>} The requested page, plus total/last_page for pagination controls.
 */
export const getFieldEngineers = async (page = 1, perPage = 10): Promise<PaginatedResponse<FieldEngineerUser>> => {
  const response = await httpClient.get<PaginatedResponse<FieldEngineerUser>>(usersURL, {
    params: { page, per_page: perPage, user_type: 'field_engineer' },
  });
  return response.data;
};

/**
 * Creates a new account of any of the four roles.
 *
 * @param payload - {CreateUserPayload} The account's profile, role, and initial password.
 * @returns {Promise<User>} The created account.
 */
export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const response = await httpClient.post<DefaultResponse<User>>(usersURL, payload);
  return response.data.data;
};

/**
 * Updates an existing account. Accepts a partial payload, so a single-field
 * change (e.g. deactivating an account) doesn't require resending the whole
 * record.
 *
 * @param id - {User['id']} The account being updated.
 * @param payload - {UpdateUserPayload} The fields to change.
 * @returns {Promise<User>} The updated account.
 */
export const updateUser = async (id: User['id'], payload: UpdateUserPayload): Promise<User> => {
  const response = await httpClient.put<DefaultResponse<User>>(`${usersURL}/${id}`, payload);
  return response.data.data;
};

/**
 * Deactivates or reactivates an account by toggling `is_active`, without
 * deleting it.
 *
 * @param id - {User['id']} The account to toggle.
 * @param isActive - {boolean} `false` to deactivate, `true` to reactivate.
 * @returns {Promise<User>} The updated account.
 */
export const setUserActive = async (id: User['id'], isActive: boolean): Promise<User> => {
  return updateUser(id, { is_active: isActive });
};
