import httpClient from '@/lib/axios';
import type { DefaultResponse, PaginatedResponse } from '@/common/types/common';
import type { Ticket, TicketDetail } from './types';

const ticketsURL = 'tickets';

/**
 * Fetches one page of tickets — every audit request reduced to its current
 * lifecycle status (Requested → Assigned → In Progress → Under Review →
 * Passed/Rescheduled), per the Audit Tracking & Ticketing deliverable.
 *
 * @param page - {number} The 1-indexed page to fetch. Defaults to 1.
 * @param perPage - {number} Page size. Defaults to 10.
 * @returns {Promise<PaginatedResponse<Ticket>>} The requested page, plus total/last_page for pagination controls.
 */
export const getTickets = async (page = 1, perPage = 10): Promise<PaginatedResponse<Ticket>> => {
  const response = await httpClient.get<PaginatedResponse<Ticket>>(ticketsURL, {
    params: { page, per_page: perPage },
  });
  return response.data;
};

/**
 * Fetches a single ticket's full history — every visit cycle and every
 * findings submission raised against the request.
 *
 * @param id - {Ticket['id']} The ticket (audit request) to fetch.
 * @returns {Promise<TicketDetail>} The ticket, with its full `audits`/`findings` history.
 */
export const getTicket = async (id: Ticket['id']): Promise<TicketDetail> => {
  const response = await httpClient.get<DefaultResponse<TicketDetail>>(`${ticketsURL}/${id}`);
  return response.data.data;
};
