import httpClient from '@/lib/axios';
import type { DefaultResponse, PaginatedResponse } from '@/common/types/common';
import type {
  AssignFieldEngineerPayload,
  AuditRequest,
  AuditRequestStatus,
  CreateAuditRequestPayload,
} from './types';

const auditRequestsURL = 'audit-requests';

/**
 * Fetches one page of audit requests. Backs both the Audit Requests review
 * queue (no filter, or `status: 'open'`) and the Field Audits queue
 * (`status: 'approved'` — every request that has reached, or passed, the
 * assignment stage, since a request's own status never advances past
 * "Approved"/"Declined").
 *
 * @param page - {number} The 1-indexed page to fetch. Defaults to 1.
 * @param perPage - {number} Page size. Defaults to 10.
 * @param status - {AuditRequestStatus} Optional status filter.
 * @returns {Promise<PaginatedResponse<AuditRequest>>} The requested page, plus total/last_page for pagination controls.
 */
export const getAuditRequests = async (
  page = 1,
  perPage = 10,
  status?: AuditRequestStatus
): Promise<PaginatedResponse<AuditRequest>> => {
  const response = await httpClient.get<PaginatedResponse<AuditRequest>>(auditRequestsURL, {
    params: { page, per_page: perPage, status },
  });
  return response.data;
};

/**
 * Raises a new audit request. Admin-only for now — a stand-in for the
 * Client's own raise-a-request flow, not built until Phase 3.
 *
 * @param payload - {CreateAuditRequestPayload} The request's client, optional store, and request type.
 * @returns {Promise<AuditRequest>} The created request, in the "Requested" state.
 */
export const createAuditRequest = async (payload: CreateAuditRequestPayload): Promise<AuditRequest> => {
  const response = await httpClient.post<DefaultResponse<AuditRequest>>(auditRequestsURL, payload);
  return response.data.data;
};

/**
 * Approves a pending audit request.
 *
 * @param id - {AuditRequest['id']} The request being approved.
 * @returns {Promise<AuditRequest>} The request, updated to "Approved".
 */
export const approveAuditRequest = async (id: AuditRequest['id']): Promise<AuditRequest> => {
  const response = await httpClient.patch<DefaultResponse<AuditRequest>>(`${auditRequestsURL}/${id}/approve`);
  return response.data.data;
};

/**
 * Declines a pending audit request.
 *
 * @param id - {AuditRequest['id']} The request being declined.
 * @returns {Promise<AuditRequest>} The request, updated to "Declined".
 */
export const declineAuditRequest = async (id: AuditRequest['id']): Promise<AuditRequest> => {
  const response = await httpClient.patch<DefaultResponse<AuditRequest>>(`${auditRequestsURL}/${id}/decline`);
  return response.data.data;
};

/**
 * Assigns a field engineer to an approved audit request, creating the
 * visit that tracks it.
 *
 * @param id - {AuditRequest['id']} The request being assigned.
 * @param payload - {AssignFieldEngineerPayload} The field engineer to dispatch.
 * @returns {Promise<unknown>} The newly created visit (`Audits` row).
 */
export const assignFieldEngineer = async (id: AuditRequest['id'], payload: AssignFieldEngineerPayload) => {
  const response = await httpClient.patch<DefaultResponse<unknown>>(`${auditRequestsURL}/${id}/assign`, payload);
  return response.data.data;
};
