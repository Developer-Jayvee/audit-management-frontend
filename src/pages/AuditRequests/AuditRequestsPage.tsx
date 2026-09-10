import { useState } from 'react';
import { Button } from '@/components/Button';
import { useConfirm } from '@/contexts/ConfirmDialogContext';
import localStorageKeys from '@/lib/config/localStorage';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import {
  approveAuditRequest,
  createAuditRequest,
  declineAuditRequest,
} from '@/services/auditRequests/auditRequests.service';
import type { AuditRequest } from '@/services/auditRequests/types';
import { AuditRequestsTable } from './components/AuditRequestsTable';
import { NewAuditRequestDialog, type NewAuditRequestFormValues } from './components/NewAuditRequestDialog';
import { useAuditRequests } from './hooks/useAuditRequests';

export default function AuditRequestsPage() {
  const { auditRequests, page, lastPage, loading, error, setPage, refetch } = useAuditRequests();
  const confirm = useConfirm();
  const isAdmin = localStorage.getItem(localStorageKeys.userTypeReference) === 'admin';

  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(values: NewAuditRequestFormValues) {
    setSubmitting(true);
    try {
      await createAuditRequest({
        client_id: values.client_id,
        store_id: values.store_id || null,
        request_type: values.request_type,
      });
      setDialogOpen(false);
      showSuccessToast('Audit request raised.');
      await refetch();
    } catch {
      showErrorToast('Failed to raise audit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleApprove(auditRequest: AuditRequest) {
    const confirmed = await confirm({
      title: 'Approve this audit request?',
      description: `${auditRequest.code} will be ready for field engineer assignment.`,
      confirmLabel: 'Approve',
      variant: 'default',
    });
    if (!confirmed) return;

    try {
      await approveAuditRequest(auditRequest.id);
      showSuccessToast('Audit request approved.');
      await refetch();
    } catch {
      showErrorToast('Failed to approve audit request. Please try again.');
    }
  }

  async function handleDecline(auditRequest: AuditRequest) {
    const confirmed = await confirm({
      title: 'Decline this audit request?',
      description: `${auditRequest.code} will be closed without a site visit.`,
      confirmLabel: 'Decline',
      variant: 'destructive',
    });
    if (!confirmed) return;

    try {
      await declineAuditRequest(auditRequest.id);
      showSuccessToast('Audit request declined.');
      await refetch();
    } catch {
      showErrorToast('Failed to decline audit request. Please try again.');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {isAdmin && (
        <div className="flex justify-end">
          <Button className="!w-auto px-5" onClick={() => setDialogOpen(true)}>
            New Request
          </Button>
        </div>
      )}

      <AuditRequestsTable
        auditRequests={auditRequests}
        loading={loading}
        error={error}
        page={page}
        lastPage={lastPage}
        onPageChange={setPage}
        onApprove={handleApprove}
        onDecline={handleDecline}
      />

      <NewAuditRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        submitting={submitting}
        onSubmit={handleCreate}
      />
    </div>
  );
}
