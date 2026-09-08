interface ComingSoonPageProps {
  description: string;
}

/**
 * Shared placeholder for a nav-scaffolded module that has no feature code
 * yet (Phase 2.1) — proves the route/RBAC boundary works without a
 * one-off page per module.
 *
 * @param description - {string} What this module will do once it's built, and which sub-phase builds it.
 * @returns {JSX.Element} A placeholder view.
 */
export default function ComingSoonPage({ description }: ComingSoonPageProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="max-w-prose text-sm text-atlas-ink/70">{description}</p>
    </div>
  );
}
