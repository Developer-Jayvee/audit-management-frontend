import { useCallback, useState } from 'react';
import type { LoginStep, Portal } from '../types/types';
import { emailLogin, postLogin } from '@/services/auth/auth.service';
import { RoleEnum } from '@/common/constants/roles';
import localStorageKeys from '@/lib/config/localStorage';
import { useNavigate } from 'react-router-dom';

// const MOCK_DELAY_MS = 600;

// function wait(ms: number) {
//   return new Promise<void>((resolve) => setTimeout(resolve, ms));
// }

export function useLoginFlow() {
  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [portal, setPortal] = useState<Portal | null>(null);
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();
  const submitEmail = useCallback(async (value: string) => {
    setBusy(true);
    const normalized = value.trim().toLowerCase();
    await emailLogin({ email : value })
    .then((result) => {
      if(result.status) {
        setEmail(normalized);
        setStep('password');
        setPortal(() => ({
          name : RoleEnum?.[result?.data?.data],
          role: result?.data?.data
        }))
      }
    }).finally(() => {
      setBusy(false);
    })
    return null;
  }, []);

  const submitPassword = useCallback(async (password: string) => {
    setBusy(true);
    await postLogin(password)
    .then((result) => {
      if(result) {
        if(
          !localStorage.getItem(localStorageKeys.authReference) || 
          !localStorage.getItem(localStorageKeys.userTypeReference)
        ) {
          localStorage.setItem(localStorageKeys.authReference,JSON.stringify(result?.data?.data));
          localStorage.setItem(localStorageKeys.userTypeReference,result?.data?.data?.user_type);
        }
        
        return navigate('/redirect');
        
      }
    });

    setBusy(false);

    return null;
  }, []);

  const backToEmail = useCallback(() => {
    setStep('email');
    setPortal(null);
  }, []);

  return { step, email, portal, busy, submitEmail, submitPassword, backToEmail };
}
