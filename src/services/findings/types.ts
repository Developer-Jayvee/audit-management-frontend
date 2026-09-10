import type { AuditVisitStatus, ClientSummary, FieldEngineerSummary, StoreSummary } from '@/services/auditRequests/types';

export interface AuditFinding {
  id: number | string;
  audit_id: number | string;
  remarks: string | null;
  submitted_at: string | null;
  decision: 'passed' | 'rescheduled' | null;
  review_remarks: string | null;
  reviewed_at: string | null;
  audit?: {
    id: number | string;
    code: string | null;
    status: AuditVisitStatus;
    field_engineer?: FieldEngineerSummary | null;
    audit_request?: {
      id: number | string;
      code: string;
      client?: ClientSummary | null;
      store?: StoreSummary | null;
    } | null;
  } | null;
}

export interface ReviewFindingPayload {
  review_remarks?: string;
}
