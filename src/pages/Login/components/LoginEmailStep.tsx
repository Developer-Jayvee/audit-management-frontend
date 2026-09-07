import { useFormState, type UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/Button';
import { FieldError } from '@/components/FieldError';
import { Input } from '@/components/Input';
import type { EmailFormValues } from '../types/schemas';

interface LoginEmailStepProps {
  form: UseFormReturn<EmailFormValues>;
  busy: boolean;
  onSubmit: (values: EmailFormValues) => void;
}

export function LoginEmailStep({ form, busy, onSubmit }: LoginEmailStepProps) {
  const { register, handleSubmit, control } = form;
  // Subscribed locally (rather than reading `form.formState` from the prop) so the
  // React Compiler's memoization doesn't bail out on RHF's stable-identity proxy.
  const { errors } = useFormState({ control });

  return (
    <div>
      <h1 className="m-0 mb-1.5 font-condensed text-3xl font-semibold leading-[1.1]">Sign in</h1>
      <p className="m-0 mb-6 text-sm text-atlas-ink/60">Enter your work email to continue.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="login-email" className="mb-1.5 block text-xs text-atlas-ink/60">
          Email
        </label>
        <Input
          id="login-email"
          type="email"
          autoComplete="username"
          placeholder="name@company.com"
          {...register('email')}
        />
        <FieldError>{errors.email?.message ?? errors.root?.message}</FieldError>

        <Button type="submit" loading={busy} className="mt-4.5">
          {busy ? 'Checking' : 'Continue'}
        </Button>
      </form>
    </div>
  );
}
