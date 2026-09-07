import { Button } from '@/components/Button';
import type { Portal } from '../types/types';

interface LoginSuccessStepProps {
  email: string;
  portal: Portal;
  onSignOut: () => void;
}

export function LoginSuccessStep({ email, portal, onSignOut }: LoginSuccessStepProps) {
  return (
    <div>
      <h1 className="m-0 mb-1.5 font-condensed text-3xl font-semibold leading-[1.1]">{portal.name}</h1>
      <p className="m-0 mb-5.5 text-sm text-atlas-ink/60">Signed in as {email}.</p>
      <Button variant="ghost" onClick={onSignOut}>
        Sign out
      </Button>
    </div>
  );
}
