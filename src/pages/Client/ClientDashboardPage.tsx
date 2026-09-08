/**
 * Minimal landing shell for the Client portal.
 *
 * Proves the `/client` redirect and role boundary work end to end; the
 * real modules (My Stores & Branches, My Assets, Audit Requests,
 * Notifications) are built in Phase 3.
 *
 * @returns {JSX.Element} A placeholder landing view for a Client account.
 */
export default function ClientDashboardPage() {
  return (
    <div className="flex flex-col gap-3">
      <p className="max-w-prose text-sm text-atlas-ink/70">
        Your stores, assets, and audit requests will appear here once the
        Client portal is built out in Phase 3. For now this confirms you're
        signed in to the right place.
      </p>
    </div>
  );
}
