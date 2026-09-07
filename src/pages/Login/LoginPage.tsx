import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LoginEmailStep } from './components/LoginEmailStep';
import { LoginPasswordStep } from './components/LoginPasswordStep';
import { useLoginFlow } from './hooks/useLoginFlow';
import { LoginLayout } from './layouts/LoginLayout';
import { emailSchema, type EmailFormValues } from './types/schemas';

export default function LoginPage() {
  const loginFlow = useLoginFlow();
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const handleEmailSubmit = async (values: EmailFormValues) => {
    const errorMessage = await loginFlow.submitEmail(values.email);
    if (errorMessage) emailForm.setError('root', { message: errorMessage });
  };


  return (
    <LoginLayout>
      {loginFlow.step === 'email' && (
        <LoginEmailStep form={emailForm} busy={loginFlow.busy} onSubmit={handleEmailSubmit} />
      )}

      {loginFlow.step === 'password' && (
        <LoginPasswordStep
          portal={loginFlow.portal}
          key={loginFlow.email}
          email={loginFlow.email}
          busy={loginFlow.busy}
          onSubmit={(values) => loginFlow.submitPassword(values.password)}
          onChangeEmail={loginFlow.backToEmail}
        />
      )}

    </LoginLayout>
  );
}
