import httpClient from '@/lib/axios';
import type { DefaultResponse, PaginatedResponse } from '@/common/types/common';
import type { Client, CreateClientPayload, UpdateClientPayload } from './types';

const clientsURL = 'clients';

/**
 * Fetches one page of client organizations for the Client Management list.
 *
 * @param page - {number} The 1-indexed page to fetch. Defaults to 1.
 * @param perPage - {number} Page size. Defaults to 10 (the list view); pass a larger value to source picker options elsewhere.
 * @returns {Promise<PaginatedResponse<Client>>} The requested page, plus total/last_page for pagination controls.
 */
export const getClients = async (page = 1, perPage = 10): Promise<PaginatedResponse<Client>> => {
  const response = await httpClient.get<PaginatedResponse<Client>>(clientsURL, {
    params: { page, per_page: perPage },
  });
  return response.data;
};

/**
 * Creates a new client organization.
 *
 * @param payload - {CreateClientPayload} The organization's profile.
 * @returns {Promise<Client>} The created client organization.
 */
export const createClient = async (payload: CreateClientPayload): Promise<Client> => {
  const response = await httpClient.post<DefaultResponse<Client>>(clientsURL, payload);
  return response.data.data;
};

/**
 * Updates an existing client organization. Accepts a partial payload, so a
 * single-field change (e.g. deactivating an organization) doesn't require
 * resending the whole record.
 *
 * @param id - {Client['id']} The client organization being updated.
 * @param payload - {UpdateClientPayload} The fields to change.
 * @returns {Promise<Client>} The updated client organization.
 */
export const updateClient = async (id: Client['id'], payload: UpdateClientPayload): Promise<Client> => {
  const response = await httpClient.put<DefaultResponse<Client>>(`${clientsURL}/${id}`, payload);
  return response.data.data;
};

/**
 * Deactivates or reactivates a client organization by toggling `is_active`,
 * without deleting it.
 *
 * @param id - {Client['id']} The client organization to toggle.
 * @param isActive - {boolean} `false` to deactivate, `true` to reactivate.
 * @returns {Promise<Client>} The updated client organization.
 */
export const setClientActive = async (id: Client['id'], isActive: boolean): Promise<Client> => {
  return updateClient(id, { is_active: isActive });
};
