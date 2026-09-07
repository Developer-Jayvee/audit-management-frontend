import { useForm, useFormState } from 'react-hook-form';
import { Button } from '@/components/Button';
import { FieldError } from '@/components/FieldError';
import { Input } from '@/components/Input';
import type { PasswordFormValues } from '../types/schemas';
import type { Portal } from '../types/types';

interface LoginPasswordStepProps {
  email: string;
  busy: boolean;
  portal: Portal | null,
  onSubmit: (values: PasswordFormValues) => Promise<string | null>;
  onChangeEmail: () => void;
}

export function LoginPasswordStep({
  email,
  busy,
  portal,
  onSubmit,
  onChangeEmail,
}: LoginPasswordStepProps) {
  const { register, handleSubmit, control, setError } = useForm<PasswordFormValues>({
    defaultValues: { password: '' },
  });
  // Subscribed via useFormState (not destructured from useForm's return) so the
  // React Compiler's memoization doesn't bail out on RHF's stable-identity proxy.
  const { errors } = useFormState({ control });

  const submit = handleSubmit(async (values) => {
    const errorMessage = await onSubmit(values);
    if (errorMessage) setError('root', { message: errorMessage });
  });

  return (
    <div>
      <h1 className="m-0 mb-1.5 font-condensed text-3xl font-semibold leading-[1.1]">{portal?.name ?? ""}</h1>
      <div className="mb-6 flex items-center gap-2">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] text-atlas-ink/60">
          {email}
        </span>
        <button
          type="button"
          onClick={onChangeEmail}
          className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[13px] text-atlas-blue-text hover:text-atlas-navy"
        >
          Change
        </button>
      </div>

      <form onSubmit={submit} noValidate>
        <label htmlFor="login-password" className="mb-1.5 block text-xs text-atlas-ink/60">
          Password
        </label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register('password')}
        />


        <FieldError>{errors.root?.message}</FieldError>

        <Button type="submit" loading={busy} className="mt-4.5">
          {busy ? 'Signing in' : 'Sign in'}
        </Button>

        <div className="mt-3.5 text-center">
          <a href="#" className="text-[12.5px] text-atlas-blue-text hover:underline">
            Forgot password?
          </a>
        </div>
      </form>
    </div>
  );
}
