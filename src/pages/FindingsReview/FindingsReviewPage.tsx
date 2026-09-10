import { useState } from 'react';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { passFinding, rescheduleFinding } from '@/services/findings/findings.service';
import type { AuditFinding } from '@/services/findings/types';
import { FindingsTable } from './components/FindingsTable';
import { ReviewFindingDialog } from './components/ReviewFindingDialog';
import { useFindings } from './hooks/useFindings';

export default function FindingsReviewPage() {
  const { findings, page, lastPage, loading, error, setPage, refetch } = useFindings();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewingFinding, setReviewingFinding] = useState<AuditFinding | null>(null);
  const [decision, setDecision] = useState<'passed' | 'rescheduled' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function openReviewDialog(finding: AuditFinding, nextDecision: 'passed' | 'rescheduled') {
    setReviewingFinding(finding);
    setDecision(nextDecision);
    setDialogOpen(true);
  }

  async function handleSubmit(reviewRemarks: string) {
    if (!reviewingFinding || !decision) return;

    setSubmitting(true);
    try {
      const payload = reviewRemarks ? { review_remarks: reviewRemarks } : {};
      if (decision === 'passed') {
        await passFinding(reviewingFinding.id, payload);
        showSuccessToast('Finding passed. Ticket closed.');
      } else {
        await rescheduleFinding(reviewingFinding.id, payload);
        showSuccessToast('Finding sent back for reschedule.');
      }
      setDialogOpen(false);
      await refetch();
    } catch {
      showErrorToast('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <FindingsTable
        findings={findings}
        loading={loading}
        error={error}
        page={page}
        lastPage={lastPage}
        onPageChange={setPage}
        onPass={(finding) => openReviewDialog(finding, 'passed')}
        onReschedule={(finding) => openReviewDialog(finding, 'rescheduled')}
      />

      <ReviewFindingDialog
        key={reviewingFinding?.id ?? 'none'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        finding={reviewingFinding}
        decision={decision}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
