import httpClient from '@/lib/axios';
import type { DefaultResponse, PaginatedResponse } from '@/common/types/common';
import type { CreateUserPayload, UpdateUserPayload, User } from './types';

const usersURL = 'users';

/**
 * Fetches every account in the system (all four roles) for the admin
 * User Management list.
 *
 * @returns {Promise<User[]>} The current page of accounts.
 */
export const getUsers = async (): Promise<User[]> => {
  const response = await httpClient.get<PaginatedResponse<User>>(usersURL);
  return response.data.data;
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
