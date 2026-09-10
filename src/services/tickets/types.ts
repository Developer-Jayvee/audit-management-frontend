import type {
  AuditFindingSummary,
  AuditVisitStatus,
  ClientSummary,
  FieldEngineerSummary,
  StoreSummary,
} from '@/services/auditRequests/types';

export type TicketStatus = 'open' | 'declined' | AuditVisitStatus;

export interface Ticket {
  id: number | string;
  code: string;
  request_type: string;
  current_status: TicketStatus;
  client: ClientSummary | null;
  store: StoreSummary | null;
  field_engineer: FieldEngineerSummary | null;
  latest_finding: AuditFindingSummary | null;
  created_at: string;
  updated_at: string;
}

export interface TicketFindingDetail {
  id: number | string;
  remarks: string | null;
  submitted_at: string | null;
  decision: 'passed' | 'rescheduled' | null;
  review_remarks: string | null;
  reviewed_at: string | null;
}

export interface TicketAuditDetail {
  id: number | string;
  code: string | null;
  status: AuditVisitStatus;
  field_engineer: FieldEngineerSummary | null;
  findings: TicketFindingDetail[];
}

export interface TicketDetail extends Ticket {
  audits: TicketAuditDetail[];
}
