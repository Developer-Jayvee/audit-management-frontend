import httpClient from '@/lib/axios';
import type { DefaultResponse, PaginatedResponse } from '@/common/types/common';
import type { AuditFinding, ReviewFindingPayload } from './types';

const findingsURL = 'audit-findings';

/**
 * Fetches one page of findings submissions for the Findings Review queue —
 * undecided submissions (`decision: null`) are the actionable queue;
 * decided rows in the same list are that queue's history.
 *
 * @param page - {number} The 1-indexed page to fetch. Defaults to 1.
 * @param perPage - {number} Page size. Defaults to 10.
 * @param pendingOnly - {boolean} When true, only fetch submissions still awaiting a decision.
 * @returns {Promise<PaginatedResponse<AuditFinding>>} The requested page, plus total/last_page for pagination controls.
 */
export const getFindings = async (
  page = 1,
  perPage = 10,
  pendingOnly = false
): Promise<PaginatedResponse<AuditFinding>> => {
  const response = await httpClient.get<PaginatedResponse<AuditFinding>>(findingsURL, {
    params: { page, per_page: perPage, pending: pendingOnly ? 1 : undefined },
  });
  return response.data;
};

/**
 * Marks a findings submission passed, closing the ticket.
 *
 * @param id - {AuditFinding['id']} The submission being decided.
 * @param payload - {ReviewFindingPayload} Optional reviewer note.
 * @returns {Promise<AuditFinding>} The submission, updated with the decision.
 */
export const passFinding = async (id: AuditFinding['id'], payload: ReviewFindingPayload = {}): Promise<AuditFinding> => {
  const response = await httpClient.patch<DefaultResponse<AuditFinding>>(`${findingsURL}/${id}/pass`, payload);
  return response.data.data;
};

/**
 * Sends a findings submission back for a revisit.
 *
 * @param id - {AuditFinding['id']} The submission being decided.
 * @param payload - {ReviewFindingPayload} Optional reviewer note explaining the reschedule.
 * @returns {Promise<AuditFinding>} The submission, updated with the decision.
 */
export const rescheduleFinding = async (id: AuditFinding['id'], payload: ReviewFindingPayload = {}): Promise<AuditFinding> => {
  const response = await httpClient.patch<DefaultResponse<AuditFinding>>(`${findingsURL}/${id}/reschedule`, payload);
  return response.data.data;
};
