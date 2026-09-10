export type AuditRequestStatus = 'open' | 'approved' | 'declined';

export type AuditVisitStatus = 'assigned' | 'ongoing' | 'under_review' | 'passed' | 'rescheduled';

export interface ClientSummary {
  id: number | string;
  name: string;
}

export interface StoreSummary {
  id: number | string;
  name: string;
}

export interface FieldEngineerUserSummary {
  id: number | string;
  first_name: string;
  last_name: string;
}

export interface FieldEngineerSummary {
  id: number | string;
  user_id: number | string;
  user?: FieldEngineerUserSummary | null;
}

export interface AuditFindingSummary {
  id: number | string;
  remarks: string | null;
  submitted_at: string | null;
  decision: 'passed' | 'rescheduled' | null;
  review_remarks: string | null;
  reviewed_at: string | null;
}

export interface AuditVisitSummary {
  id: number | string;
  code: string | null;
  status: AuditVisitStatus;
  field_engineer?: FieldEngineerSummary | null;
  latest_finding?: AuditFindingSummary | null;
}

export interface AuditRequest {
  id: number | string;
  code: string;
  client_id: number | string;
  store_id: number | string | null;
  request_type: string;
  status: AuditRequestStatus;
  client?: ClientSummary | null;
  store?: StoreSummary | null;
  latest_audit?: AuditVisitSummary | null;
  created_at: string;
}

export interface CreateAuditRequestPayload {
  client_id: number | string;
  store_id?: number | string | null;
  request_type: string;
}

export interface AssignFieldEngineerPayload {
  field_engineer_id: number | string;
}
