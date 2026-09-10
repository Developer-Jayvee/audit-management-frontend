import { useState } from 'react';
import { useConfirm } from '@/contexts/ConfirmDialogContext';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { assignFieldEngineer } from '@/services/auditRequests/auditRequests.service';
import type { AuditRequest } from '@/services/auditRequests/types';
import { useAuditRequests } from '@/pages/AuditRequests/hooks/useAuditRequests';
import { FieldAuditsTable } from './components/FieldAuditsTable';
import { AssignFieldEngineerDialog, type AssignFieldEngineerFormValues } from './components/AssignFieldEngineerDialog';

export default function FieldAuditsPage() {
  // Every approved request has reached (or passed) the assignment stage —
  // a request's own status never advances past "Approved"/"Declined";
  // AuditWorkflowService tracks the rest on the assigned visit instead.
  const { auditRequests, page, lastPage, loading, error, setPage, refetch } = useAuditRequests('approved');
  const confirm = useConfirm();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [assigningRequest, setAssigningRequest] = useState<AuditRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function openAssignDialog(auditRequest: AuditRequest) {
    setAssigningRequest(auditRequest);
    setDialogOpen(true);
  }

  async function handleSubmit(values: AssignFieldEngineerFormValues) {
    if (!assigningRequest) return;

    const confirmed = await confirm({
      title: 'Assign this field engineer?',
      description: `${assigningRequest.code} will be dispatched for a site visit.`,
      confirmLabel: 'Assign',
      variant: 'default',
    });
    if (!confirmed) return;

    setSubmitting(true);
    try {
      await assignFieldEngineer(assigningRequest.id, { field_engineer_id: values.field_engineer_id });
      setDialogOpen(false);
      showSuccessToast('Field engineer assigned.');
      await refetch();
    } catch {
      showErrorToast('Failed to assign field engineer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <FieldAuditsTable
        auditRequests={auditRequests}
        loading={loading}
        error={error}
        page={page}
        lastPage={lastPage}
        onPageChange={setPage}
        onAssign={openAssignDialog}
      />

      <AssignFieldEngineerDialog
        key={assigningRequest?.id ?? 'none'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        auditRequest={assigningRequest}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
